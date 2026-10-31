/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import {
  MapPin,
  Clock,
  Bookmark,
  Check,
  X,
  Calendar,
  Users,
  Sparkles,
  ChevronRight,
  Ticket,
  Award,
  Cpu,
} from 'lucide-react';
import { OpportunityCard } from '../types';

interface SwipeCardProps {
  card: OpportunityCard;
  isTop: boolean;
  index: number;
  onSwipe: (direction: 'left' | 'right') => void;
  onOpenDetails: (card: OpportunityCard) => void;
  onToggleBookmark?: (cardId: string) => void;
  isBookmarked?: boolean;
  isLoadingAi?: boolean;
  onViewStudentProfile?: (card: OpportunityCard) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  card,
  isTop,
  index,
  onSwipe,
  onOpenDetails,
  onToggleBookmark,
  isBookmarked = false,
  isLoadingAi = false,
  onViewStudentProfile,
}) => {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  // Motion values for smooth drag and rotation physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-10, 0, 10]);

  // Visual cues: Opacity of "RSVP / MATCH" vs "PASS" stamps & subtle glows
  const applyOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  // Subtle edge tint opacity
  const rightGlowOpacity = useTransform(x, [10, 150], [0, 0.45]);
  const leftGlowOpacity = useTransform(x, [-10, -150], [0, 0.45]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 90;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      setExitDirection('right');
      onSwipe('right');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      setExitDirection('left');
      onSwipe('left');
    }
  };

  const stackScale = index === 0 ? 1 : index === 1 ? 0.95 : 0.9;
  const stackTranslateY = index === 0 ? 0 : index === 1 ? 12 : 24;
  const stackOpacity = index === 0 ? 1 : index === 1 ? 0.8 : 0.5;

  const isEvent = card.kind === 'event';

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10 - index,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale: isTop ? 1 : stackScale,
        y: isTop ? 0 : stackTranslateY,
        opacity: isTop ? 1 : stackOpacity,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isTop ? handleDragEnd : undefined}
      animate={
        exitDirection
          ? {
              x: exitDirection === 'right' ? 600 : -600,
              opacity: 0,
              rotate: exitDirection === 'right' ? 20 : -20,
              transition: { duration: 0.28, ease: 'easeOut' },
            }
          : undefined
      }
      className={`swipe-card-container select-none touch-none h-full w-full rounded-3xl bg-[#FBFBF9] border border-[#E2DFCE] flex flex-col justify-between overflow-hidden ${
        isTop ? 'shadow-editorial active:shadow-editorial-active cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      {/* Directional Feedback Overlays */}
      {isTop && (
        <>
          <motion.div
            style={{ opacity: rightGlowOpacity }}
            className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#8C0610]/15 to-transparent pointer-events-none z-20"
          />
          <motion.div
            style={{ opacity: leftGlowOpacity }}
            className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#95B1C7]/25 to-transparent pointer-events-none z-20"
          />

          {/* Minimalist Editorial Stamp: RSVP or CONNECT */}
          <motion.div
            style={{ opacity: applyOpacity }}
            className="absolute top-6 left-6 z-30 pointer-events-none"
          >
            <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#8C0610] bg-[#FBFBF9]/95 text-[#8C0610] font-extrabold text-xs tracking-wider shadow-sm">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isEvent ? 'RSVP FOR PASS' : 'CONNECT & MATCH'}</span>
            </div>
          </motion.div>

          {/* Minimalist Editorial Stamp: PASS */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-6 right-6 z-30 pointer-events-none"
          >
            <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#8C877E] bg-[#FBFBF9]/95 text-[#57534E] font-extrabold text-xs tracking-wider shadow-sm">
              <X className="w-4 h-4 stroke-[3]" />
              <span>PASS</span>
            </div>
          </motion.div>
        </>
      )}

      {/* Card Scrollable Body */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto no-scrollbar flex flex-col">
        {/* Top Header Row with Category, Match Score, and Gemma 4 Label */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span
              className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                isEvent
                  ? 'bg-[#8C0610]/10 text-[#8C0610]'
                  : 'bg-[#95B1C7]/20 text-[#2B4A60]'
              }`}
            >
              {card.category}
            </span>

            {/* AI Match Score with Loading State */}
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#8C0610] bg-[#8C0610]/8 px-2.5 py-0.5 rounded-full border border-[#8C0610]/20">
              <Sparkles className={`w-3 h-3 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span>{isLoadingAi ? 'Analyzing...' : `${card.matchScore}% Match`}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark?.(card.id);
            }}
            className="p-1.5 rounded-full text-[#8C877E] hover:text-[#4C050D] hover:bg-[#F4F2EC] transition-colors cursor-pointer"
            aria-label="Bookmark item"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked ? 'fill-[#4C050D] text-[#4C050D]' : ''
              }`}
            />
          </button>
        </div>

        {/* Primary Editorial Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#4C050D] leading-snug mb-1">
          {card.title}
        </h2>

        {/* Subtitle / Venue & Organization (Tappable for student collaborators) */}
        {isEvent ? (
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#57534E] mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#8C0610] shrink-0" />
            <span className="truncate">{card.subtitle}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewStudentProfile?.(card);
              }}
              className="flex items-center space-x-2 text-xs font-semibold text-[#57534E] hover:text-[#4C050D] p-1 -ml-1 rounded-xl hover:bg-[#F4F2EC] transition-all cursor-pointer group/lead text-left"
              title="View student public profile"
            >
              <div className="w-6 h-6 rounded-full bg-[#4C050D] text-[#FBFBF9] font-bold text-[10px] flex items-center justify-center shrink-0">
                {(card.leadName || card.subtitle).slice(0, 2).toUpperCase()}
              </div>
              <span className="truncate group-hover/lead:underline underline-offset-2 font-bold text-[#1C1917]">
                {card.subtitle}
              </span>
              <span className="text-[10px] text-[#8C0610] font-bold bg-[#8C0610]/8 px-2 py-0.5 rounded-full border border-[#8C0610]/20 shrink-0">
                View Profile
              </span>
            </button>
          </div>
        )}

        {/* AI "Why You Fit" Card Section - Powered by Gemma 4 */}
        <div className="mb-3.5 p-3 rounded-2xl bg-[#4C050D]/4 border border-[#4C050D]/12">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#4C050D] mb-1">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#8C0610]" />
              <span>Why You Fit</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-[9px] font-semibold text-[#8C877E] lowercase tracking-normal">
              <Cpu className="w-2.5 h-2.5 text-[#8C0610]" />
              <span>powered by gemma 4</span>
            </span>
          </div>

          {isLoadingAi ? (
            <div className="flex items-center space-x-2 py-1 text-xs text-[#57534E]">
              <div className="w-2 h-2 rounded-full bg-[#8C0610] animate-ping" />
              <span className="text-[11.5px] italic text-[#8C877E]">
                Gemma 4 is analyzing your technical profile & course fit...
              </span>
            </div>
          ) : (
            <p className="text-xs font-medium text-[#1C1917] leading-relaxed">
              {card.whyYouFit ||
                `Your technical skill profile in ${card.skills.slice(0, 2).join(' and ')} directly maps to this opportunity.`}
            </p>
          )}
        </div>

        {/* Event Quick Date & Venue Box (if event) */}
        {isEvent && (
          <div className="mb-3 p-3 rounded-2xl bg-[#F4F2EC] border border-[#E2DFCE] flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-[#1C1917] flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#8C0610]" />
                <span>{card.eventDate}</span>
              </div>
              <div className="text-[11px] text-[#57534E]">{card.eventTime}</div>
            </div>
            {card.venue && (
              <div className="text-right text-[11px] text-[#4C050D] font-semibold max-w-[150px] truncate">
                {card.venue}
              </div>
            )}
          </div>
        )}

        {/* Summary Thesis */}
        <p className="text-[13px] leading-relaxed text-[#1C1917] font-normal mb-3.5 bg-[#F4F2EC]/50 p-3 rounded-2xl border border-[#E2DFCE]/60">
          {card.summary}
        </p>

        {/* Editorial Briefing Notes */}
        <div className="mb-3 space-y-1">
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#8C877E]">
            {isEvent ? 'Campus Highlights' : 'Project Brief'}
          </div>
          <div className="space-y-1">
            {card.editorialBrief.map((bullet, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#57534E] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C0610] shrink-0 mt-1.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills / Focus Stack */}
        <div className="mb-2">
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#8C877E] mb-1.5">
            {isEvent ? 'Focus Disciplines' : 'Required Stack'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {card.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-medium text-[#57534E] bg-[#F4F2EC] px-2.5 py-0.5 rounded-full border border-[#E2DFCE]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Founder / Host Note */}
        {card.founderNote && (
          <div className="mt-auto text-xs italic text-[#57534E] bg-[#F4F2EC]/80 border-l-2 border-[#4C050D] p-2.5 rounded-r-xl">
            &ldquo;{card.founderNote}&rdquo;
          </div>
        )}
      </div>

      {/* Card Footer: Metadata (Venue / Spots / Perks) & Dossier Button */}
      <div className="px-5 py-3 bg-[#F4F2EC]/80 border-t border-[#E2DFCE] flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#57534E]">
          {isEvent ? (
            <>
              <div className="flex items-center space-x-1 font-semibold text-[#8C0610]">
                <Ticket className="w-3.5 h-3.5" />
                <span>{card.capacity || 'Open RSVP'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-[#8C877E]" />
                <span className="truncate max-w-[130px] font-medium">{card.compensation}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#8C877E]" />
                <span className="font-medium truncate max-w-[140px]">{card.venue || card.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#8C877E]" />
                <span className="font-medium">{card.commitment}</span>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(card);
          }}
          className="shrink-0 flex items-center space-x-1 text-xs font-semibold text-[#4C050D] hover:text-[#8C0610] bg-[#FBFBF9] px-2.5 py-1 rounded-full border border-[#E2DFCE] cursor-pointer"
        >
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
