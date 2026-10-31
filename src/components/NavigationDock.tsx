/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Inbox, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationDockProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadCount?: number;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
}) => {
  return (
    <nav
      aria-label="App Navigation"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[340px]"
    >
      <div className="flex items-center justify-around px-3 py-2.5 rounded-full bg-[#FBFBF9]/90 backdrop-blur-xl border border-[#E2DFCE] shadow-editorial-dock">
        {/* Discover / Swipe Tab */}
        <button
          onClick={() => onTabChange('swipe')}
          className="relative flex flex-col items-center justify-center py-1.5 px-4 rounded-full transition-all duration-200 group cursor-pointer focus:outline-none"
          aria-label="Discover opportunities"
        >
          <div
            className={`transition-colors duration-200 ${
              activeTab === 'swipe' ? 'text-[#4C050D]' : 'text-[#8C877E] group-hover:text-[#1C1917]'
            }`}
          >
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase font-semibold mt-0.5 transition-colors duration-200 ${
              activeTab === 'swipe' ? 'text-[#4C050D]' : 'text-[#8C877E]'
            }`}
          >
            Discover
          </span>
          {activeTab === 'swipe' && (
            <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#8C0610]" />
          )}
        </button>

        {/* Activity / Matches Tab */}
        <button
          onClick={() => onTabChange('activity')}
          className="relative flex flex-col items-center justify-center py-1.5 px-4 rounded-full transition-all duration-200 group cursor-pointer focus:outline-none"
          aria-label="Applications and matches"
        >
          <div
            className={`relative transition-colors duration-200 ${
              activeTab === 'activity' ? 'text-[#4C050D]' : 'text-[#8C877E] group-hover:text-[#1C1917]'
            }`}
          >
            <Inbox className="w-5 h-5 stroke-[2.2]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#8C0610] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase font-semibold mt-0.5 transition-colors duration-200 ${
              activeTab === 'activity' ? 'text-[#4C050D]' : 'text-[#8C877E]'
            }`}
          >
            Activity
          </span>
          {activeTab === 'activity' && (
            <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#8C0610]" />
          )}
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className="relative flex flex-col items-center justify-center py-1.5 px-4 rounded-full transition-all duration-200 group cursor-pointer focus:outline-none"
          aria-label="Student profile"
        >
          <div
            className={`transition-colors duration-200 ${
              activeTab === 'profile' ? 'text-[#4C050D]' : 'text-[#8C877E] group-hover:text-[#1C1917]'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] tracking-wider uppercase font-semibold mt-0.5 transition-colors duration-200 ${
              activeTab === 'profile' ? 'text-[#4C050D]' : 'text-[#8C877E]'
            }`}
          >
            Profile
          </span>
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#8C0610]" />
          )}
        </button>
      </div>
    </nav>
  );
};
