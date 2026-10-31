/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required 'aistudio-build' User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface MatchRequestCard {
  id: string;
  kind: 'event' | 'student_project';
  title: string;
  subtitle: string;
  organization: string;
  university: string;
  venue?: string;
  skills: string[];
  summary: string;
  editorialBrief: string[];
}

interface MatchRequestProfile {
  name: string;
  school: string;
  major: string;
  gradYear: string;
  skills: string[];
  interests: string[];
  bio: string;
}

// Heuristic fallback matching in case of missing API key or network glitch
function generateFallbackMatches(profile: MatchRequestProfile, cards: MatchRequestCard[]) {
  const userSkillsSet = new Set(profile.skills.map((s) => s.toLowerCase()));

  return cards.map((card) => {
    const cardSkills = card.skills || [];
    const sharedSkills = cardSkills.filter((s) => userSkillsSet.has(s.toLowerCase()));
    const ratio = cardSkills.length > 0 ? sharedSkills.length / cardSkills.length : 0.5;

    // Base score between 75 and 98 based on skill overlap and campus match
    const isCampusMatch = card.university.toLowerCase().includes(profile.school.toLowerCase()) ||
                          profile.school.toLowerCase().includes(card.university.toLowerCase());
    const baseScore = isCampusMatch ? 82 : 72;
    const computedScore = Math.min(99, Math.round(baseScore + ratio * 16));

    let whyFit = '';
    if (sharedSkills.length > 0) {
      whyFit = `Your background in ${sharedSkills.slice(0, 2).join(' and ')} aligns directly with ${card.organization}'s focus on ${cardSkills[0] || 'engineering'}.`;
    } else if (isCampusMatch) {
      whyFit = `As an ${profile.school} ${profile.major} student, your coursework and campus proximity make this a strong fit for ${card.title}.`;
    } else {
      whyFit = `Your technical proficiencies in ${profile.skills.slice(0, 2).join(' and ')} complement this ${card.kind === 'event' ? 'event' : 'project'} team.`;
    }

    return {
      id: card.id,
      matchScore: computedScore,
      whyYouFit: whyFit,
    };
  });
}

// AI Matching Endpoint using Gemma / Gemini API
app.post('/api/match', async (req, res) => {
  const { userProfile, cards } = req.body as {
    userProfile: MatchRequestProfile;
    cards: MatchRequestCard[];
  };

  if (!cards || !Array.isArray(cards) || cards.length === 0 || !userProfile) {
    return res.status(400).json({ error: 'Missing userProfile or cards array' });
  }

  // If no GEMINI_API_KEY is available, immediately provide high-quality fallback
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not configured, using fallback match heuristics');
    const fallbackResults = generateFallbackMatches(userProfile, cards);
    return res.json({ matches: fallbackResults, provider: 'fallback' });
  }

  try {
    const prompt = `You are the Gemma 4 intelligent opportunity matching engine for college students at NC State University and the Research Triangle.
Evaluate the exact fit between this student and each campus event or peer project card.

Student Profile:
- Name: ${userProfile.name}
- Campus: ${userProfile.school}
- Major: ${userProfile.major} (${userProfile.gradYear})
- Skills: ${userProfile.skills.join(', ')}
- Interests: ${userProfile.interests?.join(', ') || 'Technology'}
- Bio: ${userProfile.bio}

Cards to Evaluate:
${cards
  .map(
    (c, i) => `[Card ${i + 1}] ID: ${c.id}
Type: ${c.kind}
Title: ${c.title}
Host / Lead: ${c.subtitle} (${c.organization})
Campus / Venue: ${c.university} • ${c.venue || 'Campus'}
Required Skills: ${c.skills.join(', ')}
Summary: ${c.summary}
Briefing: ${c.editorialBrief.join(' | ')}`
  )
  .join('\n\n')}

For each card, calculate:
1. "matchScore": An integer between 65 and 99 representing candidate compatibility.
2. "whyYouFit": A single punchy, personalized sentence (under 18 words) highlighting the exact technical and campus synergy (e.g. mention NC State, Hunt Library, EB2, or their specific skills like Rust, Linux, or PyTorch).

Return JSON matching the schema.`;

    // Call the model using @google/genai
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are Gemma 4, an ultra-precise college talent and opportunity matchmaking engine. Always return concise, personalized technical fit explanations formatted as structured JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              whyYouFit: { type: Type.STRING },
            },
            required: ['id', 'matchScore', 'whyYouFit'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json({ matches: parsed, provider: 'gemma-4' });
    }

    throw new Error('Invalid JSON format from model');
  } catch (error) {
    console.error('Error in Gemma AI match evaluation:', error);
    const fallbackResults = generateFallbackMatches(userProfile, cards);
    return res.json({ matches: fallbackResults, provider: 'fallback_after_error' });
  }
});

// Mount Vite in dev mode or serve static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`LCKDIN server running on port ${PORT}`);
  });
}

startServer();
