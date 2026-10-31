/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Award,
} from 'lucide-react';
import { OpportunityCard } from '../types';

interface DossierModalProps {
  card: OpportunityCard | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (card: OpportunityCard) => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  card,
  isOpen,
  onClose,
  onApply,
}) => {
  if (!isOpen || !card) return null;

  const isEvent = card.kind === 'event';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-md max-h-[85vh] sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl bg-[#FBFBF9] border-t sm:border border-[#E2DFCE] shadow-editorial-active flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-[#E2DFCE] flex items-center justify-between shrink-0 bg-[#FBFBF9]">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#F4F2EC] px-2.5 py-1 rounded-full text-[#57534E] border border-[#E2DFCE]">
                {card.category}
              </span>
              <span className="text-[10px] font-semibold text-[#8C0610] bg-[#8C0610]/10 px-2 py-0.5 rounded-full">
                {card.university}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8C877E] hover:text-[#1C1917] hover:bg-[#F4F2EC] transition-colors cursor-pointer"
              aria-label="Close dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto no-scrollbar space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#4C050D] leading-snug">
                {card.title}
              </h2>
              <div className="flex items-center space-x-2 text-sm font-semibold text-[#57534E] mt-1">
                {isEvent ? (
                  <Calendar className="w-4 h-4 text-[#8C0610]" />
                ) : (
                  <Users className="w-4 h-4 text-[#95B1C7]" />
                )}
                <span>{card.subtitle}</span>
              </div>
            </div>

            {/* Quick Metrics Matrix */}
            <div className="grid grid-cols-2 gap-2.5 bg-[#F4F2EC] p-3.5 rounded-2xl border border-[#E2DFCE]">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C877E]">
                  {isEvent ? 'Date & Schedule' : 'Commitment'}
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-0.5">
                  {isEvent ? card.eventDate : card.commitment}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C877E]">
                  {isEvent ? 'Campus Venue' : 'Location'}
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-0.5 truncate">
                  {card.venue || card.location}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C877E]">
                  {isEvent ? 'Perks & Awards' : 'Compensation'}
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-0.5">
                  {card.compensation}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C877E]">
                  {isEvent ? 'Capacity' : 'Team / Lab'}
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-0.5">
                  {card.capacity || card.teamSize || 'Open'}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase text-[#8C877E] mb-1">
                Overview
              </div>
              <p className="text-xs leading-relaxed text-[#1C1917] bg-[#F4F2EC]/50 p-3 rounded-2xl border border-[#E2DFCE]/60">
                {card.summary}
              </p>
            </div>

            {/* Gemma 4 AI Analysis */}
            <div className="p-3.5 rounded-2xl bg-[#4C050D]/5 border border-[#4C050D]/15">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#4C050D] mb-1.5">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C0610]" />
                  <span>Why You Fit This Opportunity</span>
                </span>
                <span className="text-[9px] font-semibold text-[#8C877E] lowercase">
                  powered by gemma 4
                </span>
              </div>
              <p className="text-xs font-medium text-[#1C1917] leading-relaxed">
                {card.whyYouFit ||
                  `Your technical proficiencies in ${card.skills.slice(0, 2).join(' and ')} directly align with this role.`}
              </p>
            </div>

            {/* Editorial Brief */}
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase text-[#8C877E] mb-1.5">
                Key Briefing Notes
              </div>
              <div className="space-y-1.5">
                {card.editorialBrief.map((bullet, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-[#57534E] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C0610] shrink-0 mt-1.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase text-[#8C877E] mb-1.5">
                Target Technologies & Focus
              </div>
              <div className="flex flex-wrap gap-1.5">
                {card.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium text-[#57534E] bg-[#F4F2EC] px-3 py-1 rounded-full border border-[#E2DFCE]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div className="flex items-start space-x-2 text-xs text-[#57534E] bg-[#F4F2EC]/80 p-3 rounded-2xl border border-[#E2DFCE]">
              <ShieldCheck className="w-4 h-4 text-[#8C0610] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1C1917]">Eligibility: </span>
                {card.eligibility}
              </div>
            </div>
          </div>

          {/* Sticky Modal Bottom Action */}
          <div className="p-4 border-t border-[#E2DFCE] bg-[#FBFBF9] shrink-0 flex items-center space-x-3">
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-full bg-[#F4F2EC] hover:bg-[#E8E8E6] text-[#4C050D] text-xs font-bold uppercase tracking-wider border border-[#E2DFCE] active:scale-95 transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onApply(card);
              }}
              className="flex-1 py-3 px-5 rounded-full bg-[#8C0610] text-[#FBFBF9] text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#9e0b16] active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isEvent ? '1-Swipe RSVP For Pass' : 'Express Interest & Match'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
