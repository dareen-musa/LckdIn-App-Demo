/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ActiveTab,
  FilterType,
  OpportunityCard,
  UserProfile,
  EventRSVP,
  StudentMatch,
  InvolvedProject,
  PublicStudentProfile,
} from './types';
import {
  INITIAL_USER_PROFILE,
  ALL_OPPORTUNITY_CARDS,
  INITIAL_EVENT_RSVPS,
  INITIAL_STUDENT_MATCHES,
  INITIAL_INVOLVED_PROJECTS,
} from './data/mockData';
import { fetchAiMatchesForCards } from './services/aiMatching';
import { TopHeader } from './components/TopHeader';
import { NavigationDock } from './components/NavigationDock';
import { CardDeck } from './components/CardDeck';
import { MatchesActivityView } from './components/MatchesActivityView';
import { ProfileView } from './components/ProfileView';
import { OnboardingView } from './components/OnboardingView';
import { ConfirmationModal } from './components/ConfirmationModal';
import { DossierModal } from './components/DossierModal';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('swipe');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  // Check if onboarding was completed before; if not, open on launch
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lckdin_onboarded_ncsu') !== 'true';
    }
    return false;
  });

  // User Profile - Default NC State University
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lckdin_profile_ncsu');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_USER_PROFILE;
  });

  // Save profile to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lckdin_profile_ncsu', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // "Involved In" Projects State (Owner, Joined, Applied)
  const [involvedProjects, setInvolvedProjects] = useState<InvolvedProject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lckdin_involved_projects_v2');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_INVOLVED_PROJECTS;
  });

  // Save involved projects to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lckdin_involved_projects_v2', JSON.stringify(involvedProjects));
    }
  }, [involvedProjects]);

  // Opportunity Stack State
  const [allCards, setAllCards] = useState<OpportunityCard[]>(ALL_OPPORTUNITY_CARDS);
  const [swipedHistory, setSwipedHistory] = useState<{
    card: OpportunityCard;
    direction: 'left' | 'right';
  }[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Real AI Matching State
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const evaluationInFlight = useRef<boolean>(false);

  // Activity & Pipeline State (Event RSVPs & Student Matches)
  const [rsvps, setRsvps] = useState<EventRSVP[]>(INITIAL_EVENT_RSVPS);
  const [matches, setMatches] = useState<StudentMatch[]>(INITIAL_STUDENT_MATCHES);

  // Active Public Profile State (when inspecting another student's profile)
  const [activePublicProfile, setActivePublicProfile] = useState<PublicStudentProfile | null>(null);

  // Modals & Overlays
  const [inspectingCard, setInspectingCard] = useState<OpportunityCard | null>(null);
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    card: OpportunityCard | null;
    type: 'applied' | 'matched' | null;
  }>({
    isOpen: false,
    card: null,
    type: null,
  });

  // Trigger Gemma 4 AI Matching whenever the deck or student skills change
  useEffect(() => {
    let isCancelled = false;

    async function evaluateDeck() {
      if (evaluationInFlight.current) return;
      evaluationInFlight.current = true;
      setIsLoadingAi(true);

      try {
        const evaluations = await fetchAiMatchesForCards(userProfile, allCards);
        if (!isCancelled && evaluations.size > 0) {
          setAllCards((prevCards) =>
            prevCards.map((c) => {
              const evalResult = evaluations.get(c.id);
              if (evalResult) {
                return {
                  ...c,
                  matchScore: evalResult.matchScore,
                  whyYouFit: evalResult.whyYouFit,
                  isAiEvaluated: true,
                };
              }
              return c;
            })
          );
        }
      } catch (err) {
        console.error('AI match evaluation failed:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingAi(false);
          evaluationInFlight.current = false;
        }
      }
    }

    evaluateDeck();

    return () => {
      isCancelled = true;
      evaluationInFlight.current = false;
    };
  }, [userProfile.skills, userProfile.school, userProfile.major]);

  // Calculate unread count across matches
  const unreadCount = useMemo(() => {
    return matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);
  }, [matches]);

  // Filtered Cards strictly calibrated to the student's university
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      // 1. Campus Filter: If campusOnlyFilter is on, only show events/students from their school or "All Universities"
      if (userProfile.campusOnlyFilter) {
        const matchesCampus =
          card.university.toLowerCase() === userProfile.school.toLowerCase() ||
          card.university === 'All Universities';
        if (!matchesCampus) return false;
      }

      // 2. Kind Filter (All Discovery vs Campus Events vs Co-Founders)
      if (currentFilter !== 'all' && card.kind !== currentFilter) {
        return false;
      }

      return true;
    });
  }, [allCards, userProfile.school, userProfile.campusOnlyFilter, currentFilter]);

  // Haptic Feedback Helper
  const triggerHaptic = (ms: number = 20) => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignore haptic failures
      }
    }
  };

  // Add a newly created project to both user's "Involved In" (as Owner) and Discovery deck
  const handleCreateProject = (
    projectData: Omit<InvolvedProject, 'id' | 'createdAt' | 'status'>
  ) => {
    triggerHaptic(30);

    const newProjectId = `proj-${Date.now()}`;
    const newInvolvedProject: InvolvedProject = {
      ...projectData,
      id: newProjectId,
      status: 'Owner',
      createdAt: 'Just now',
    };

    // 1. Add to user's Involved In list
    setInvolvedProjects((prev) => [newInvolvedProject, ...prev]);

    // 2. Create corresponding OpportunityCard and insert into Discovery deck
    const newOpportunityCard: OpportunityCard = {
      id: `card-${newProjectId}`,
      kind: 'student_project',
      category: 'CAMPUS CO-FOUNDER',
      title: projectData.title,
      subtitle: `${userProfile.name} • ${userProfile.school} ${userProfile.gradYear}`,
      organization: `${userProfile.name}’s Team`,
      leadName: userProfile.name,
      leadTitle: `${userProfile.major} ${userProfile.gradYear}`,
      leadMajor: userProfile.major,
      leadGradYear: userProfile.gradYear,
      leadBio: userProfile.bio,
      leadInterests: userProfile.interests,
      projectType: projectData.type,
      university: userProfile.school,
      location: `Raleigh, NC (${userProfile.school})`,
      venue: 'Campus Main / Centennial Campus',
      remoteType: 'In-Person Campus',
      commitment: projectData.timeline,
      compensation: 'Co-Founder Equity & Project Ownership',
      summary: projectData.description,
      editorialBrief: [
        `Focus: ${projectData.type} initiated by ${userProfile.name}.`,
        `Stack Needed: ${projectData.skills.join(', ')}.`,
        `Timeline & Milestones: ${projectData.timeline}.`,
      ],
      skills: projectData.skills,
      matchScore: 99,
      whyYouFit: 'You are the founder and creator of this project.',
      eligibility: `Open to ${userProfile.school} peers and collaborators`,
      verified: true,
      teamSize: '1 Founder seeking partners',
      founderNote: 'Reach out if you want to collaborate and build together on campus!',
    };

    setAllCards((prev) => [newOpportunityCard, ...prev]);
  };

  // Handle Swipe Gesture (Right = RSVP/Match, Left = Pass)
  const handleSwipe = (card: OpportunityCard, direction: 'left' | 'right') => {
    triggerHaptic(direction === 'right' ? 35 : 15);

    // Remove top card from active list and record in history
    setAllCards((prev) => prev.filter((c) => c.id !== card.id));
    setSwipedHistory((prev) => [...prev, { card, direction }]);

    if (direction === 'right') {
      if (card.kind === 'event') {
        // Create new Event RSVP Ticket
        const cleanOrg = card.organization.replace(/[^a-zA-Z]/g, '').slice(0, 6).toUpperCase();
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        const ticketCode = `${cleanOrg}-${randomCode}-PASS`;

        const newRsvp: EventRSVP = {
          id: `rsvp-${Date.now()}`,
          cardId: card.id,
          card,
          appliedAt: 'Just now',
          status: 'confirmed',
          lastUpdated: 'Just now',
          ticketCode,
          candidateNote: `1-Swipe RSVP confirmed for ${userProfile.name} (${userProfile.school}). Fast-track entrance badge issued.`,
        };
        setRsvps((prev) => [newRsvp, ...prev]);

        // Trigger event confirmation modal
        setConfirmation({
          isOpen: true,
          card,
          type: 'applied',
        });
      } else {
        // 1. Add to user's "Involved In" section as "Applied"
        const existingInvolved = involvedProjects.find(
          (p) => p.cardId === card.id || p.title.toLowerCase() === card.title.toLowerCase()
        );
        if (!existingInvolved) {
          const appliedProject: InvolvedProject = {
            id: `proj-${card.id}-${Date.now()}`,
            title: card.title,
            description: card.summary,
            type: card.projectType || 'Side Project',
            status: 'Applied',
            skills: card.skills,
            timeline: card.commitment,
            university: card.university,
            ownerName: card.leadName || card.subtitle,
            ownerSchool: card.university,
            cardId: card.id,
            createdAt: 'Just now',
          };
          setInvolvedProjects((prev) => [appliedProject, ...prev]);
        }

        // 2. Create new Campus Collaborator Match
        const newMatch: StudentMatch = {
          id: `match-${Date.now()}`,
          cardId: card.id,
          card,
          matchedAt: 'Just now',
          unreadCount: 1,
          lastMessage: `Hey ${userProfile.name}! Thanks for connecting on ${card.title}. Are you around ${userProfile.school} Centennial Campus this week?`,
          lastMessageTime: 'Just now',
          messages: [
            {
              id: `msg-${Date.now()}-1`,
              sender: 'them',
              text: `Hey ${userProfile.name}! Saw you swiped on ${card.title}. Love your background in ${userProfile.skills.slice(0, 2).join(' & ')}.`,
              time: 'Just now',
            },
            {
              id: `msg-${Date.now()}-2`,
              sender: 'them',
              text: `Would love to team up! Are you free to meet at Hunt Library or EB2 for coffee?`,
              time: 'Just now',
            },
          ],
        };
        setMatches((prev) => [newMatch, ...prev]);

        // Trigger match confirmation modal
        setConfirmation({
          isOpen: true,
          card,
          type: 'matched',
        });
      }
    }
  };

  // Open public profile for another student tapped from a discovery card
  const handleViewStudentProfile = (card: OpportunityCard) => {
    triggerHaptic(15);

    const publicProfile: PublicStudentProfile = {
      id: card.id,
      name: card.leadName || card.subtitle.split('•')[0].trim(),
      school: card.university,
      major: card.leadMajor || 'Computer Science & Engineering',
      gradYear: card.leadGradYear || "'26",
      bio:
        card.leadBio ||
        card.founderNote ||
        `${card.leadName || card.subtitle} is a student builder at ${card.university} leading ${card.title}.`,
      skills: card.skills,
      interests: card.leadInterests || ['Open Source', 'Hackathons', 'Systems Engineering'],
      matchScore: card.matchScore,
      whyYouFit: card.whyYouFit,
      cardId: card.id,
      card,
      projects: [
        {
          id: `proj-${card.id}`,
          title: card.title,
          description: card.summary,
          type: card.projectType || 'Startup / Side Hustle',
          status: 'Owner',
          skills: card.skills,
          timeline: card.commitment,
          university: card.university,
          ownerName: card.leadName || card.subtitle,
          ownerSchool: card.university,
          createdAt: 'Active Project',
        },
      ],
    };

    setActivePublicProfile(publicProfile);
    setActiveTab('profile');
  };

  // Handle "Connect & Message" from another student's public profile
  const handleConnectFromPublicProfile = (student: PublicStudentProfile) => {
    triggerHaptic(30);

    // If there is an associated card, apply/match
    if (student.card) {
      handleSwipe(student.card, 'right');
    }
    setActivePublicProfile(null);
    setActiveTab('activity');
  };

  // Rewind / Undo previous card
  const handleUndo = () => {
    if (swipedHistory.length === 0) return;
    triggerHaptic(25);

    const lastSwiped = swipedHistory[swipedHistory.length - 1];
    setSwipedHistory((prev) => prev.slice(0, -1));
    setAllCards((prev) => [lastSwiped.card, ...prev]);

    // If it was swiped right, revert from activity & applied
    if (lastSwiped.direction === 'right') {
      if (lastSwiped.card.kind === 'event') {
        setRsvps((prev) => prev.filter((r) => r.cardId !== lastSwiped.card.id));
      } else {
        setMatches((prev) => prev.filter((m) => m.cardId !== lastSwiped.card.id));
        setInvolvedProjects((prev) =>
          prev.filter((p) => p.cardId !== lastSwiped.card.id && p.status !== 'Owner')
        );
      }
    }
  };

  // Reset cards for current university
  const handleResetDeck = () => {
    setAllCards(ALL_OPPORTUNITY_CARDS);
    setSwipedHistory([]);
  };

  // Toggle bookmark on card
  const handleToggleBookmark = (cardId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  // Chat message sending inside a match thread
  const handleSendMessage = (matchId: string, text: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'me' as const,
            text,
            time: 'Just now',
          };
          return {
            ...m,
            unreadCount: 0,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...m.messages, newMsg],
          };
        }
        return m;
      })
    );
  };

  // Switch university directly from header or profile
  const handleSchoolChange = (newSchool: string) => {
    setUserProfile((prev) => ({
      ...prev,
      school: newSchool,
    }));
    setAllCards(ALL_OPPORTUNITY_CARDS);
    setSwipedHistory([]);
  };

  // Complete onboarding
  const handleCompleteOnboarding = (profileUpdates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...profileUpdates,
    }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('lckdin_onboarded_ncsu', 'true');
    }
    setShowOnboarding(false);
    setAllCards(ALL_OPPORTUNITY_CARDS);
    setSwipedHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex flex-col items-center justify-start text-[#1C1917]">
      {/* Mobile-First Frame Container */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[92vh] sm:my-4 sm:rounded-3xl sm:border sm:border-[#E2DFCE] bg-[#FBFBF9] shadow-2xl flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <TopHeader
          currentFilter={activeTab === 'swipe' ? currentFilter : undefined}
          onFilterChange={activeTab === 'swipe' ? setCurrentFilter : undefined}
          canUndo={activeTab === 'swipe' && swipedHistory.length > 0}
          onUndo={handleUndo}
          userSchool={userProfile.school}
          onSchoolChange={handleSchoolChange}
          onOpenOnboarding={() => setShowOnboarding(true)}
          totalCardsCount={filteredCards.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {activeTab === 'swipe' && (
            <CardDeck
              cards={filteredCards}
              onSwipe={handleSwipe}
              onOpenDetails={(card) => setInspectingCard(card)}
              onResetDeck={handleResetDeck}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              userSchool={userProfile.school}
              onChangeSchoolRequest={() => setShowOnboarding(true)}
              isLoadingAi={isLoadingAi}
              onViewStudentProfile={handleViewStudentProfile}
            />
          )}

          {activeTab === 'activity' && (
            <MatchesActivityView
              rsvps={rsvps}
              matches={matches}
              onSendMessage={handleSendMessage}
              userSchool={userProfile.school}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={userProfile}
              onUpdateProfile={setUserProfile}
              involvedProjects={involvedProjects}
              onAddProject={handleCreateProject}
              eventRsvps={rsvps}
              activePublicProfile={activePublicProfile}
              onClosePublicProfile={() => setActivePublicProfile(null)}
              onConnectOrMessage={handleConnectFromPublicProfile}
              onRestartOnboarding={() => setShowOnboarding(true)}
            />
          )}
        </main>

        {/* Floating Minimalist Navigation Dock */}
        <NavigationDock
          activeTab={activeTab}
          onTabChange={(tab) => {
            triggerHaptic(10);
            if (tab === 'profile') {
              // When user taps profile tab in bottom dock, reset any active external public profile
              setActivePublicProfile(null);
            }
            setActiveTab(tab);
          }}
          unreadCount={unreadCount}
        />

        {/* Deep Dossier Modal */}
        <DossierModal
          card={inspectingCard}
          isOpen={!!inspectingCard}
          onClose={() => setInspectingCard(null)}
          onApply={(card) => {
            setInspectingCard(null);
            handleSwipe(card, 'right');
          }}
        />

        {/* Match / RSVP Confirmation Celebration */}
        <ConfirmationModal
          card={confirmation.card}
          type={confirmation.type}
          userProfile={userProfile}
          isOpen={confirmation.isOpen}
          onClose={() => setConfirmation({ isOpen: false, card: null, type: null })}
          onViewMatches={() => {
            setConfirmation({ isOpen: false, card: null, type: null });
            setActiveTab('activity');
          }}
        />

        {/* Onboarding Account Setup Overlay */}
        {showOnboarding && (
          <OnboardingView
            onComplete={handleCompleteOnboarding}
            currentProfile={userProfile}
          />
        )}
      </div>
    </div>
  );
}
