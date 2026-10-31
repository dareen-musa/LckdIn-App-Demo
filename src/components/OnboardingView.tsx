/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  Building2,
  Users,
  Calendar,
  Sparkles,
  Search,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { AVAILABLE_SKILLS_LIST, UNIVERSITIES_LIST } from '../data/mockData';
import { UserProfile } from '../types';

interface OnboardingViewProps {
  onComplete: (userProfileUpdates: Partial<UserProfile>) => void;
  currentProfile: UserProfile;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onComplete,
  currentProfile,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSchool, setSelectedSchool] = useState<string>(currentProfile.school || 'NC State University');
  const [schoolSearchQuery, setSchoolSearchQuery] = useState<string>('');
  const [customSchoolInput, setCustomSchoolInput] = useState<string>('');
  const [studentName, setStudentName] = useState<string>(currentProfile.name || 'Jordan Miller');
  const [studentMajor, setStudentMajor] = useState<string>(currentProfile.major || 'Computer Science & Electrical Engineering');
  const [gradYear, setGradYear] = useState<string>(currentProfile.gradYear || "'26");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentProfile.skills.length > 0
      ? currentProfile.skills
      : ['Python', 'Rust', 'Linux Kernel', 'Distributed Systems']
  );

  const filteredSchools = UNIVERSITIES_LIST.filter((u) =>
    u.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFinish = () => {
    const finalSchool = customSchoolInput.trim() || selectedSchool;
    const finalEmail = `${studentName.toLowerCase().replace(/\s+/g, '.')}@${finalSchool.toLowerCase().replace(/[^a-z]/g, '')}.edu`;

    onComplete({
      name: studentName.trim() || 'Student Builder',
      school: finalSchool,
      major: studentMajor.trim() || 'Computer Science',
      gradYear,
      email: finalEmail,
      skills: selectedSkills,
      campusOnlyFilter: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FBFBF9] flex flex-col justify-between overflow-y-auto no-scrollbar p-5 sm:p-6 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex items-center justify-between pt-2 mb-4 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-2xl tracking-tight text-[#4C050D] font-mono">
            LCKD<span className="text-[#8C0610]">IN</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-[#8C0610] animate-pulse" />
        </div>

        <div className="flex items-center space-x-1 text-xs font-bold text-[#8C877E] uppercase tracking-wider">
          <span>Step {step} of 2</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col justify-between space-y-4 my-auto"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C0610] mb-1 block">
                Campus Calibration
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4C050D] leading-tight">
                Where do you go to school?
              </h1>
              <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                LCKDIN filters campus hackathons, career fairs, recruiter visits, and student co-founders to your university so opportunities are targeted, never too broad.
              </p>
            </div>

            {/* University Selection with Search & Pills */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C877E]">
                Select Your Campus
              </label>

              {/* School Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8C877E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={schoolSearchQuery}
                  onChange={(e) => setSchoolSearchQuery(e.target.value)}
                  placeholder="Search university or college..."
                  className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] placeholder-[#8C877E] pl-8.5 pr-3 py-2 rounded-xl border border-[#E2DFCE] focus:border-[#8C0610] focus:bg-[#FBFBF9] focus:outline-none"
                />
              </div>

              {/* Campus Grid / List */}
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto no-scrollbar p-1">
                {filteredSchools.map((univ) => {
                  const isSelected = selectedSchool === univ && !customSchoolInput;
                  return (
                    <button
                      key={univ}
                      type="button"
                      onClick={() => {
                        setSelectedSchool(univ);
                        setCustomSchoolInput('');
                      }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center space-x-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#4C050D] text-[#FBFBF9] border-[#4C050D] shadow-xs'
                          : 'bg-[#F4F2EC] text-[#57534E] border-[#E2DFCE] hover:text-[#1C1917]'
                      }`}
                    >
                      <GraduationCap className="w-3 h-3 shrink-0" />
                      <span>{univ}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Option to type custom school */}
              <div className="pt-1">
                <span className="text-[10px] text-[#8C877E] block mb-1">
                  Don't see your campus? Enter custom school:
                </span>
                <input
                  type="text"
                  value={customSchoolInput}
                  onChange={(e) => {
                    setCustomSchoolInput(e.target.value);
                    if (e.target.value) setSelectedSchool(e.target.value);
                  }}
                  placeholder="e.g. Waterloo, Princeton, Georgia Tech..."
                  className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] placeholder-[#8C877E] px-3 py-1.5 rounded-xl border border-[#E2DFCE] focus:border-[#8C0610] focus:outline-none"
                />
              </div>
            </div>

            {/* Basic Info (Name, Major, Grad Year) */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] px-3 py-2 rounded-xl border border-[#E2DFCE] focus:outline-none focus:border-[#8C0610]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  Major / Field
                </label>
                <input
                  type="text"
                  value={studentMajor}
                  onChange={(e) => setStudentMajor(e.target.value)}
                  placeholder="e.g. EECS / CS"
                  className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] px-3 py-2 rounded-xl border border-[#E2DFCE] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  Class Year
                </label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] px-3 py-2 rounded-xl border border-[#E2DFCE] focus:outline-none cursor-pointer"
                >
                  <option value="'25">'25 (Senior)</option>
                  <option value="'26">'26 (Junior)</option>
                  <option value="'27">'27 (Sophomore)</option>
                  <option value="'28">'28 (Freshman)</option>
                  <option value="Grad">Graduate / PhD</option>
                </select>
              </div>
            </div>

            {/* Verification assurance */}
            <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#F4F2EC] border border-[#E2DFCE] text-[11px] text-[#57534E]">
              <ShieldCheck className="w-4 h-4 text-[#8C0610] shrink-0" />
              <span>
                Campus filter locks in: <strong className="text-[#1C1917]">{customSchoolInput || selectedSchool}</strong>
              </span>
            </div>

            {/* Step 1 Next Button */}
            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-6 rounded-full bg-[#8C0610] text-[#FBFBF9] font-bold text-xs uppercase tracking-wider shadow-editorial hover:bg-[#9e0b16] active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Continue to Skills & Interests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col justify-between space-y-4 my-auto"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C0610]">
                  Step 2 of 2
                </span>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#8C877E] hover:text-[#1C1917] cursor-pointer"
                >
                  Change Campus
                </button>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4C050D]">
                Skills & Event Pass
              </h2>
              <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                Targeting <strong className="text-[#4C050D]">{customSchoolInput || selectedSchool}</strong> hackathons, career fairs, company visits, and project partners.
              </p>
            </div>

            {/* Value prop banner */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 rounded-2xl bg-[#F4F2EC] border border-[#E2DFCE]">
                <Calendar className="w-4 h-4 text-[#8C0610] mb-1" />
                <div className="text-xs font-bold text-[#1C1917]">Campus Events</div>
                <div className="text-[10px] text-[#57534E]">1-swipe RSVPs for hackathons & recruiter sessions.</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#F4F2EC] border border-[#E2DFCE]">
                <Users className="w-4 h-4 text-[#95B1C7] mb-1" />
                <div className="text-xs font-bold text-[#1C1917]">Classmate Matches</div>
                <div className="text-[10px] text-[#57534E]">Find co-builders at your campus.</div>
              </div>
            </div>

            {/* Skills selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C877E]">
                  Your Technical Proficiencies ({selectedSkills.length})
                </label>
                <span className="text-[10px] text-[#8C877E]">Tap to select</span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto no-scrollbar p-1">
                {AVAILABLE_SKILLS_LIST.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center space-x-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#8C0610] text-[#FBFBF9] border-[#8C0610] shadow-xs'
                          : 'bg-[#F4F2EC] text-[#57534E] border-[#E2DFCE] hover:border-[#8C877E]'
                      }`}
                    >
                      <span>{skill}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Final CTA */}
            <button
              onClick={handleFinish}
              className="w-full py-4 px-6 rounded-full bg-[#8C0610] text-[#FBFBF9] font-bold text-xs uppercase tracking-wider shadow-editorial hover:bg-[#9e0b16] active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-3"
            >
              <span>Enter {customSchoolInput || selectedSchool} Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer disclaimer */}
      <div className="text-center pt-3 pb-1 text-[10px] text-[#8C877E] shrink-0">
        LCKDIN Campus Network • Verified University Students
      </div>
    </div>
  );
};
