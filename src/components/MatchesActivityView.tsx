/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Search,
  MessageSquare,
  ArrowRight,
  Send,
  Ticket,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  QrCode,
  Share2,
} from 'lucide-react';
import { EventRSVP, StudentMatch } from '../types';

interface MatchesActivityViewProps {
  rsvps: EventRSVP[];
  matches: StudentMatch[];
  onSendMessage: (matchId: string, text: string) => void;
  userSchool: string;
}

export const MatchesActivityView: React.FC<MatchesActivityViewProps> = ({
  rsvps,
  matches,
  onSendMessage,
  userSchool,
}) => {
  const [subTab, setSubTab] = useState<'events' | 'matches'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatMatch, setActiveChatMatch] = useState<StudentMatch | null>(null);
  const [activeTicket, setActiveTicket] = useState<EventRSVP | null>(null);
  const [inputMessage, setInputMessage] = useState('');

  const filteredRsvps = rsvps.filter(
    (r) =>
      r.card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.card.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.card.venue && r.card.venue.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMatches = matches.filter(
    (m) =>
      m.card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.card.leadName && m.card.leadName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.card.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatMatch) return;
    onSendMessage(activeChatMatch.id, inputMessage.trim());
    setInputMessage('');
  };

  const currentOpenMatch = activeChatMatch
    ? matches.find((m) => m.id === activeChatMatch.id) || activeChatMatch
    : null;

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pt-3 pb-24 sm:pb-28">
      {/* Editorial View Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#4C050D]">
          Activity & Passes
        </h1>
        <p className="text-xs text-[#57534E] mt-0.5">
          Your campus event entry passes and student collaborator matches.
        </p>
      </div>

      {/* Sub-Tabs: Event Passes vs Collaborator Matches */}
      <div className="flex p-0.5 rounded-full bg-[#F4F2EC] border border-[#E2DFCE] text-xs mb-3">
        <button
          onClick={() => setSubTab('events')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-full font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
            subTab === 'events'
              ? 'bg-[#FBFBF9] text-[#4C050D] shadow-xs'
              : 'text-[#8C877E] hover:text-[#1C1917]'
          }`}
        >
          <Ticket className="w-3.5 h-3.5 text-[#8C0610]" />
          <span>Event Passes ({rsvps.length})</span>
        </button>

        <button
          onClick={() => setSubTab('matches')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-full font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
            subTab === 'matches'
              ? 'bg-[#FBFBF9] text-[#4C050D] shadow-xs'
              : 'text-[#8C877E] hover:text-[#1C1917]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#95B1C7]" />
          <span>Matches ({matches.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3.5">
        <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            subTab === 'events'
              ? 'Filter passes, venues, hackathons...'
              : 'Filter co-founders or projects...'
          }
          className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] placeholder-[#8C877E] pl-9.5 pr-4 py-2.5 rounded-2xl border border-transparent focus:border-[#95B1C7] focus:bg-[#FBFBF9] focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#8C877E] hover:text-[#1C1917]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content Feed */}
      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
        {subTab === 'events' ? (
          filteredRsvps.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#F4F2EC]/60 rounded-3xl border border-[#E2DFCE]">
              <Ticket className="w-10 h-10 text-[#8C877E] mx-auto mb-2 opacity-60" />
              <div className="text-sm font-bold text-[#4C050D]">No event passes yet</div>
              <p className="text-xs text-[#57534E] mt-1">
                Swipe right on campus hackathons, career fairs, or recruiter visits to claim your pass.
              </p>
            </div>
          ) : (
            filteredRsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                onClick={() => setActiveTicket(rsvp)}
                className="bg-[#FBFBF9] rounded-2xl border border-[#E2DFCE] p-4 shadow-editorial transition-all hover:border-[#8C0610]/40 cursor-pointer group"
              >
                {/* Top Badge & Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#8C0610]/10 text-[#8C0610]">
                      {rsvp.card.category}
                    </span>
                    <span className="text-[10px] text-[#57534E] font-semibold bg-[#F4F2EC] px-2 py-0.5 rounded-full border border-[#E2DFCE]">
                      {rsvp.card.university}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Pass Confirmed</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-[#1C1917] group-hover:text-[#4C050D] transition-colors leading-snug">
                  {rsvp.card.title}
                </h3>

                {/* Venue & Date */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#57534E] mt-1 mb-2.5">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#8C0610]" />
                    <span>{rsvp.card.eventDate}</span>
                  </div>
                  {rsvp.card.venue && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8C877E]" />
                      <span className="truncate max-w-[160px]">{rsvp.card.venue}</span>
                    </div>
                  )}
                </div>

                {/* Digital Ticket Barcode Stub Mockup */}
                <div className="bg-[#F4F2EC] p-2.5 rounded-xl border border-dashed border-[#E2DFCE] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[9px] uppercase font-bold tracking-widest text-[#8C877E]">
                      Pass Code
                    </div>
                    <div className="font-mono text-xs font-bold text-[#4C050D]">
                      {rsvp.ticketCode}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] font-bold text-[#8C0610] uppercase">
                    <QrCode className="w-4 h-4" />
                    <span>View Pass</span>
                  </div>
                </div>
              </div>
            ))
          )
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#F4F2EC]/60 rounded-3xl border border-[#E2DFCE]">
            <Users className="w-10 h-10 text-[#8C877E] mx-auto mb-2 opacity-60" />
            <div className="text-sm font-bold text-[#4C050D]">No co-founder matches yet</div>
            <p className="text-xs text-[#57534E] mt-1">
              Swipe right on classmates seeking hackathon partners and co-builders.
            </p>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => setActiveChatMatch(match)}
              className="bg-[#FBFBF9] rounded-2xl border border-[#E2DFCE] p-4 shadow-editorial hover:border-[#8C0610]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-[#1C1917] group-hover:text-[#4C050D] transition-colors">
                      {match.card.leadName || match.card.subtitle}
                    </h3>
                    <span className="text-[10px] font-bold tracking-wider text-[#8C0610] uppercase bg-[#8C0610]/8 px-2 py-0.5 rounded-full">
                      Matched
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#57534E] mt-0.5">
                    {match.card.title}
                  </div>
                </div>

                {match.unreadCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C0610] ring-4 ring-[#8C0610]/20" />
                )}
              </div>

              {match.lastMessage && (
                <p className="text-xs text-[#57534E] line-clamp-1 mt-1.5 bg-[#F4F2EC] p-2 rounded-xl border border-[#E2DFCE]/60">
                  {match.lastMessage}
                </p>
              )}

              <div className="mt-3 pt-2 border-t border-[#E2DFCE]/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#8C877E]">
                  Matched {match.matchedAt} • {match.card.university}
                </span>
                <span className="flex items-center space-x-1 font-bold text-[#8C0610] text-[11px] uppercase tracking-wider">
                  <MessageSquare className="w-3 h-3" />
                  <span>Open Chat</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Digital Pass / Ticket Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-xs"
            onClick={() => setActiveTicket(null)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FBFBF9] border border-[#E2DFCE] p-6 shadow-editorial-active z-10 flex flex-col text-center">
            <button
              onClick={() => setActiveTicket(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-[#8C877E] hover:text-[#1C1917]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#8C0610]/10 text-[#8C0610] flex items-center justify-center mx-auto mb-3">
              <Ticket className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="text-[10px] uppercase font-bold tracking-widest text-[#8C0610] mb-1">
              Official Campus Pass
            </div>
            <h3 className="text-lg font-bold text-[#4C050D] leading-tight mb-1">
              {activeTicket.card.title}
            </h3>
            <div className="text-xs text-[#57534E] mb-4">
              {activeTicket.card.subtitle}
            </div>

            {/* Ticket Details Box */}
            <div className="bg-[#F4F2EC] rounded-2xl p-4 border border-[#E2DFCE] text-left space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#8C877E]">Date & Time</span>
                <span className="font-semibold text-[#1C1917]">{activeTicket.card.eventDate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8C877E]">Venue</span>
                <span className="font-semibold text-[#1C1917]">{activeTicket.card.venue || 'Campus Main'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8C877E]">Perks</span>
                <span className="font-semibold text-[#1C1917]">{activeTicket.card.compensation}</span>
              </div>
            </div>

            {/* Mock QR / Barcode Scan */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2DFCE] mb-4 flex flex-col items-center justify-center">
              <QrCode className="w-24 h-24 text-[#1C1917] mb-2" />
              <div className="font-mono text-xs font-bold text-[#4C050D] tracking-widest">
                {activeTicket.ticketCode}
              </div>
              <div className="text-[10px] text-[#8C877E] mt-0.5">
                Scan for VIP Fast-Pass Entrance
              </div>
            </div>

            <button
              onClick={() => setActiveTicket(null)}
              className="w-full py-2.5 rounded-full bg-[#4C050D] text-[#FBFBF9] text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Match Conversation Drawer Modal */}
      {currentOpenMatch && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div
            className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-xs"
            onClick={() => setActiveChatMatch(null)}
          />

          <div className="relative w-full max-w-md h-[90vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl bg-[#FBFBF9] border-t sm:border border-[#E2DFCE] shadow-editorial-active flex flex-col z-10 overflow-hidden">
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-[#E2DFCE] flex items-center justify-between bg-[#FBFBF9] shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#4C050D] text-[#FBFBF9] font-bold text-sm flex items-center justify-center">
                  {(currentOpenMatch.card.leadName || currentOpenMatch.card.organization)
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1C1917]">
                    {currentOpenMatch.card.leadName || currentOpenMatch.card.subtitle}
                  </h3>
                  <div className="text-[11px] text-[#57534E]">
                    {currentOpenMatch.card.university} •{' '}
                    <span className="text-[#8C0610] font-semibold">Campus Match</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveChatMatch(null)}
                className="p-1.5 rounded-full text-[#8C877E] hover:text-[#1C1917] hover:bg-[#F4F2EC] transition-colors cursor-pointer"
                aria-label="Close conversation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Context Sub-header */}
            <div className="px-5 py-2.5 bg-[#F4F2EC] border-b border-[#E2DFCE] text-xs flex items-center justify-between text-[#57534E]">
              <span className="font-medium truncate max-w-[280px]">
                Project: {currentOpenMatch.card.title}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C877E]">
                {currentOpenMatch.card.venue || 'Campus Meetup'}
              </span>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBFBF9]">
              {currentOpenMatch.messages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#8C0610] text-[#FBFBF9] rounded-br-xs'
                          : 'bg-[#F4F2EC] text-[#1C1917] border border-[#E2DFCE] rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#8C877E] mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendChat}
              className="p-3 border-t border-[#E2DFCE] bg-[#FBFBF9] flex items-center space-x-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Send a note or suggest meeting on campus..."
                className="flex-1 bg-[#F4F2EC] text-xs text-[#1C1917] placeholder-[#8C877E] px-4 py-2.5 rounded-full border border-[#E2DFCE] focus:border-[#8C0610] focus:bg-[#FBFBF9] focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-full bg-[#8C0610] text-[#FBFBF9] disabled:opacity-40 hover:bg-[#9e0b16] active:scale-95 transition-all cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
