/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check, FileText, RefreshCw, GraduationCap } from 'lucide-react';
import { OpportunityCard } from '../types';
import { SwipeCard } from './SwipeCard';

interface CardDeckProps {
  cards: OpportunityCard[];
  onSwipe: (card: OpportunityCard, direction: 'left' | 'right') => void;
  onOpenDetails: (card: OpportunityCard) => void;
  onResetDeck: () => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (cardId: string) => void;
  userSchool: string;
  onChangeSchoolRequest?: () => void;
  isLoadingAi?: boolean;
  onViewStudentProfile?: (card: OpportunityCard) => void;
}

export const CardDeck: React.FC<CardDeckProps> = ({
  cards,
  onSwipe,
  onOpenDetails,
  onResetDeck,
  bookmarkedIds,
  onToggleBookmark,
  userSchool,
  onChangeSchoolRequest,
  isLoadingAi = false,
  onViewStudentProfile,
}) => {
  const activeCard = cards[0];

  const handleAuxiliarySwipe = (direction: 'left' | 'right') => {
    if (!activeCard) return;
    onSwipe(activeCard, direction);
  };

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#F4F2EC] border border-[#E2DFCE] flex items-center justify-center text-[#4C050D] mb-4 shadow-xs">
          <GraduationCap className="w-8 h-8 text-[#8C0610]" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[#4C050D] mb-2">
          {userSchool} Queue Caught Up
        </h3>
        <p className="text-xs text-[#57534E] leading-relaxed mb-6">
          You have reviewed all campus hackathons, career fairs, recruiter visits, and student co-founders currently listed for {userSchool}.
        </p>
        <div className="flex flex-col space-y-2.5 w-full">
          <button
            onClick={onResetDeck}
            className="flex items-center justify-center space-x-2 w-full py-3 px-5 rounded-full bg-[#8C0610] text-[#FBFBF9] text-xs font-bold tracking-wide uppercase shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload {userSchool} Feed</span>
          </button>

          {onChangeSchoolRequest && (
            <button
              onClick={onChangeSchoolRequest}
              className="py-2.5 px-4 rounded-full bg-[#F4F2EC] hover:bg-[#E8E8E6] text-[#4C050D] text-xs font-bold uppercase tracking-wider border border-[#E2DFCE] transition-all cursor-pointer"
            >
              Explore Another Campus
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full max-w-md mx-auto px-4 pt-2 pb-24 sm:pb-28">
      {/* Gesture Card Stack Canvas */}
      <div className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center">
        {cards.slice(0, 3).map((card, index) => (
          <SwipeCard
            key={card.id}
            card={card}
            index={index}
            isTop={index === 0}
            onSwipe={(direction) => onSwipe(card, direction)}
            onOpenDetails={onOpenDetails}
            onToggleBookmark={onToggleBookmark}
            isBookmarked={bookmarkedIds.has(card.id)}
            isLoadingAi={index === 0 ? isLoadingAi : false}
            onViewStudentProfile={onViewStudentProfile}
          />
        ))}
      </div>

      {/* Auxiliary Tactile Dials as defined in design system */}
      <div className="flex items-center justify-center space-x-6 mt-4 w-full">
        {/* Pass / Archive Button (Slate border, #FBFBF9 fill) */}
        <button
          type="button"
          onClick={() => handleAuxiliarySwipe('left')}
          className="w-14 h-14 rounded-full bg-[#FBFBF9] border border-[#E2DFCE] shadow-editorial flex items-center justify-center text-[#57534E] hover:text-[#ba1a1a] hover:border-[#ba1a1a]/40 active:scale-90 transition-all cursor-pointer"
          title="Pass / Archive"
          aria-label="Pass item"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Dossier Detail Quick Button */}
        <button
          type="button"
          onClick={() => activeCard && onOpenDetails(activeCard)}
          className="h-10 px-4 rounded-full bg-[#F4F2EC] border border-[#E2DFCE] text-[#4C050D] hover:bg-[#E8E8E6] flex items-center space-x-1.5 text-xs font-bold tracking-wider uppercase active:scale-95 transition-all cursor-pointer"
          title="Inspect Full Details"
          aria-label="Inspect details"
        >
          <FileText className="w-4 h-4 text-[#8C877E]" />
          <span>Details</span>
        </button>

        {/* RSVP / Connect Button (Crimson fill, white glyph) */}
        <button
          type="button"
          onClick={() => handleAuxiliarySwipe('right')}
          className="w-14 h-14 rounded-full bg-[#8C0610] text-[#FBFBF9] shadow-editorial flex items-center justify-center hover:bg-[#9e0b16] active:scale-90 transition-all cursor-pointer"
          title="1-Swipe RSVP / Connect"
          aria-label="RSVP or connect"
        >
          <Check className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Quick gesture hint */}
      <p className="text-[11px] font-medium text-[#8C877E] mt-2 tracking-wide">
        Swipe left to pass • Swipe right to RSVP or match
      </p>
    </div>
  );
};
