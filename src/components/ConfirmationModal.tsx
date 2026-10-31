/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, Sparkles, ArrowRight, X, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { OpportunityCard, UserProfile } from '../types';

interface ConfirmationModalProps {
  card: OpportunityCard | null;
  type: 'applied' | 'matched' | null;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onViewMatches: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  card,
  type,
  userProfile,
  isOpen,
  onClose,
  onViewMatches,
}) => {
  if (!isOpen || !card || !type) return null;

  const isEvent = card.kind === 'event';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm rounded-3xl bg-[#FBFBF9] border border-[#E2DFCE] shadow-editorial-active p-6 z-10 flex flex-col text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C877E] hover:text-[#1C1917] hover:bg-[#F4F2EC] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Editorial Icon Badge with calm pulse */}
          <div className="mx-auto mb-3.5 relative">
            <div className="w-16 h-16 rounded-full bg-[#8C0610]/10 border border-[#8C0610]/20 flex items-center justify-center text-[#8C0610]">
              {isEvent ? (
                <Ticket className="w-7 h-7 stroke-[2.2]" />
              ) : (
                <Sparkles className="w-7 h-7 stroke-[2.2]" />
              )}
            </div>
          </div>

          {/* Subtitle pill */}
          <div className="inline-block mx-auto mb-2 px-3 py-1 rounded-full bg-[#F4F2EC] border border-[#E2DFCE] text-[10px] font-bold tracking-widest uppercase text-[#57534E]">
            {isEvent ? 'Campus Event Pass Issued' : 'Mutual Interest Confirmed'}
          </div>

          {/* Heading */}
          <h3 className="text-2xl font-bold tracking-tight text-[#4C050D] mb-1.5">
            {isEvent ? 'RSVP Confirmed' : 'It’s an Editorial Match'}
          </h3>

          {/* Context Copy */}
          <p className="text-xs text-[#57534E] leading-relaxed mb-4 px-2">
            {isEvent ? (
              <>
                Spot reserved for <span className="font-semibold text-[#1C1917]">{userProfile.name}</span> ({userProfile.school}). Your digital entry pass is now stored in your Activity tab.
              </>
            ) : (
              <>
                You and <span className="font-semibold text-[#1C1917]">{card.leadName || card.subtitle}</span> expressed mutual interest in collaborating on <span className="font-semibold text-[#4C050D]">{card.title}</span>.
              </>
            )}
          </p>

          {/* Opportunity Snippet Box */}
          <div className="text-left bg-[#F4F2EC] rounded-2xl p-3.5 border border-[#E2DFCE] mb-5">
            <div className="flex items-center justify-between text-[10px] font-semibold text-[#8C877E] uppercase tracking-wider mb-1">
              <span>{isEvent ? card.category : 'Campus Co-Founder'}</span>
              <span>{card.university}</span>
            </div>
            <div className="text-sm font-bold text-[#1C1917] line-clamp-1">{card.title}</div>
            <div className="text-xs text-[#57534E] mt-0.5">
              {isEvent ? `${card.eventDate} • ${card.venue || card.location}` : card.subtitle}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={onViewMatches}
              className="w-full py-3 px-4 rounded-full bg-[#8C0610] text-[#FBFBF9] font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 shadow-xs hover:bg-[#9e0b16] active:scale-98 transition-all cursor-pointer"
            >
              <span>{isEvent ? 'View Digital Pass' : 'Open Collaboration Chat'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-full bg-[#F4F2EC] hover:bg-[#E8E8E6] text-[#4C050D] font-bold text-xs tracking-wider uppercase border border-[#E2DFCE] active:scale-98 transition-all cursor-pointer"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
