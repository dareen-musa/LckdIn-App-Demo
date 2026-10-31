/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Calendar,
  Users,
  GraduationCap,
  ChevronDown,
  X,
  Check,
  Search,
} from 'lucide-react';
import { FilterType } from '../types';
import { UNIVERSITIES_LIST } from '../data/mockData';

interface TopHeaderProps {
  currentFilter?: FilterType;
  onFilterChange?: (filter: FilterType) => void;
  canUndo?: boolean;
  onUndo?: () => void;
  userSchool: string;
  onSchoolChange: (school: string) => void;
  onOpenOnboarding?: () => void;
  totalCardsCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentFilter = 'all',
  onFilterChange,
  canUndo = false,
  onUndo,
  userSchool,
  onSchoolChange,
  onOpenOnboarding,
  totalCardsCount = 0,
}) => {
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchools = UNIVERSITIES_LIST.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-30 w-full px-4 pt-3 pb-2 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E2DFCE]/60">
        {/* Top row: Brand & Clickable Campus Selector */}
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenOnboarding}
              className="text-left group cursor-pointer focus:outline-none"
              title="View LCKDIN Overview"
            >
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-xl tracking-tight text-[#4C050D] font-mono">
                  LCKD<span className="text-[#8C0610]">IN</span>
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8C0610]" />
              </div>
            </button>

            <div className="h-4 w-px bg-[#E2DFCE]" />

            {/* University Switcher Pill */}
            <button
              onClick={() => setShowSchoolModal(true)}
              className="flex items-center space-x-1 text-[11px] font-semibold text-[#57534E] hover:text-[#1C1917] uppercase bg-[#F4F2EC] hover:bg-[#E8E8E6] px-2.5 py-0.5 rounded-full border border-[#E2DFCE] transition-all cursor-pointer"
              title="Change University Filter"
              aria-label="Change University"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#8C0610]" />
              <span className="max-w-[120px] truncate">{userSchool}</span>
              <ChevronDown className="w-3 h-3 text-[#8C877E]" />
            </button>
          </div>

          {/* Action buttons (Undo previous card, onboarding restart) */}
          <div className="flex items-center space-x-1.5">
            {canUndo && onUndo && (
              <button
                onClick={onUndo}
                className="flex items-center space-x-1 text-xs font-medium text-[#57534E] hover:text-[#4C050D] bg-[#F4F2EC] hover:bg-[#E8E8E6] active:scale-95 px-2.5 py-1 rounded-full border border-[#E2DFCE] transition-all cursor-pointer"
                title="Undo last swipe"
                aria-label="Undo last swipe"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[10px] font-bold">Rewind</span>
              </button>
            )}

            <button
              onClick={onOpenOnboarding}
              className="p-1.5 text-[#57534E] hover:text-[#4C050D] rounded-full hover:bg-[#F4F2EC] transition-colors cursor-pointer"
              title="Campus Calibration / Guide"
              aria-label="Campus Calibration"
            >
              <Sparkles className="w-4 h-4 text-[#8C0610]" />
            </button>
          </div>
        </div>

        {/* Filter Tabs (All Discovery | Campus Events | Co-Founders) */}
        {onFilterChange && (
          <div className="flex items-center justify-center pt-2.5 pb-0.5 max-w-lg mx-auto">
            <div className="flex p-0.5 rounded-full bg-[#F4F2EC] border border-[#E2DFCE] text-xs w-full">
              <button
                onClick={() => onFilterChange('all')}
                className={`flex-1 py-1 px-2 text-center font-bold rounded-full text-[11px] transition-all cursor-pointer ${
                  currentFilter === 'all'
                    ? 'bg-[#FBFBF9] text-[#4C050D] shadow-xs'
                    : 'text-[#8C877E] hover:text-[#1C1917]'
                }`}
              >
                All Discovery
              </button>
              <button
                onClick={() => onFilterChange('event')}
                className={`flex-1 flex items-center justify-center space-x-1 py-1 px-2 text-center font-bold rounded-full text-[11px] transition-all cursor-pointer ${
                  currentFilter === 'event'
                    ? 'bg-[#FBFBF9] text-[#4C050D] shadow-xs'
                    : 'text-[#8C877E] hover:text-[#1C1917]'
                }`}
              >
                <Calendar className="w-3 h-3 text-[#8C0610]" />
                <span>Events</span>
              </button>
              <button
                onClick={() => onFilterChange('student_project')}
                className={`flex-1 flex items-center justify-center space-x-1 py-1 px-2 text-center font-bold rounded-full text-[11px] transition-all cursor-pointer ${
                  currentFilter === 'student_project'
                    ? 'bg-[#FBFBF9] text-[#4C050D] shadow-xs'
                    : 'text-[#8C877E] hover:text-[#1C1917]'
                }`}
              >
                <Users className="w-3 h-3 text-[#95B1C7]" />
                <span>Co-Founders</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Campus Switcher Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-xs"
            onClick={() => setShowSchoolModal(false)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FBFBF9] border border-[#E2DFCE] shadow-editorial-active p-5 z-10 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2DFCE]">
              <div>
                <h3 className="font-bold text-base text-[#4C050D]">
                  Campus Filter
                </h3>
                <p className="text-[11px] text-[#57534E]">
                  Select your university to narrow discovery.
                </p>
              </div>
              <button
                onClick={() => setShowSchoolModal(false)}
                className="p-1 rounded-full text-[#8C877E] hover:text-[#1C1917]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* School search */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campus..."
                className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] placeholder-[#8C877E] pl-8.5 pr-3 py-2 rounded-xl border border-[#E2DFCE] focus:outline-none"
              />
            </div>

            {/* School list */}
            <div className="space-y-1 max-h-[220px] overflow-y-auto no-scrollbar mb-4">
              {filteredSchools.map((school) => {
                const isSelected = school === userSchool;
                return (
                  <button
                    key={school}
                    onClick={() => {
                      onSchoolChange(school);
                      setShowSchoolModal(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#4C050D] text-[#FBFBF9]'
                        : 'bg-[#F4F2EC] text-[#57534E] hover:bg-[#E8E8E6] hover:text-[#1C1917]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                      <span>{school}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowSchoolModal(false)}
              className="w-full py-2.5 rounded-full bg-[#8C0610] text-[#FBFBF9] text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </>
  );
};
