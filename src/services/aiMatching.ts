/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpportunityCard, UserProfile } from '../types';

interface MatchEvaluation {
  id: string;
  matchScore: number;
  whyYouFit: string;
}

interface MatchApiResponse {
  matches: MatchEvaluation[];
  provider: string;
}

// In-memory cache to prevent duplicate evaluations for the same student skills & card
const matchCache = new Map<string, MatchEvaluation>();

function getCacheKey(userId: string, skillsHash: string, cardId: string): string {
  return `${userId}_${skillsHash}_${cardId}`;
}

export async function fetchAiMatchesForCards(
  userProfile: UserProfile,
  cards: OpportunityCard[]
): Promise<Map<string, MatchEvaluation>> {
  const results = new Map<string, MatchEvaluation>();
  const cardsToFetch: OpportunityCard[] = [];

  const skillsHash = (userProfile.skills || []).sort().join(',');

  for (const card of cards) {
    const key = getCacheKey(userProfile.name, skillsHash, card.id);
    if (matchCache.has(key)) {
      results.set(card.id, matchCache.get(key)!);
    } else {
      cardsToFetch.push(card);
    }
  }

  if (cardsToFetch.length === 0) {
    return results;
  }

  try {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile: {
          name: userProfile.name,
          school: userProfile.school,
          major: userProfile.major,
          gradYear: userProfile.gradYear,
          skills: userProfile.skills,
          interests: userProfile.interests,
          bio: userProfile.bio,
        },
        cards: cardsToFetch.map((c) => ({
          id: c.id,
          kind: c.kind,
          title: c.title,
          subtitle: c.subtitle,
          organization: c.organization,
          university: c.university,
          venue: c.venue,
          skills: c.skills,
          summary: c.summary,
          editorialBrief: c.editorialBrief,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as MatchApiResponse;
    if (data && Array.isArray(data.matches)) {
      for (const m of data.matches) {
        results.set(m.id, m);
        matchCache.set(getCacheKey(userProfile.name, skillsHash, m.id), m);
      }
    }
  } catch (err) {
    console.warn('Using client fallback match calculation:', err);
    // Graceful fallback if network or API fails
    for (const card of cardsToFetch) {
      const cardSkills = card.skills || [];
      const userSkillsSet = new Set(userProfile.skills.map((s) => s.toLowerCase()));
      const shared = cardSkills.filter((s) => userSkillsSet.has(s.toLowerCase()));
      const ratio = cardSkills.length > 0 ? shared.length / cardSkills.length : 0.5;

      const isCampus =
        card.university.toLowerCase().includes(userProfile.school.toLowerCase()) ||
        userProfile.school.toLowerCase().includes(card.university.toLowerCase());

      const score = Math.min(99, Math.round((isCampus ? 84 : 74) + ratio * 15));
      const fallbackEvaluation: MatchEvaluation = {
        id: card.id,
        matchScore: score,
        whyYouFit:
          shared.length > 0
            ? `Your proficiencies in ${shared.slice(0, 2).join(' and ')} match this ${card.organization} opportunity directly.`
            : `Your background in ${userProfile.major} at ${userProfile.school} provides the foundation needed for ${card.title}.`,
      };
      results.set(card.id, fallbackEvaluation);
      matchCache.set(getCacheKey(userProfile.name, skillsHash, card.id), fallbackEvaluation);
    }
  }

  return results;
}
