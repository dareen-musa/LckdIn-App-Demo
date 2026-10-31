/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  ShieldCheck,
  Github,
  Linkedin,
  Globe,
  FileText,
  Plus,
  X,
  Edit3,
  Check,
  Sparkles,
  Eye,
  ArrowLeft,
  Calendar,
  Users,
  MessageSquare,
  Clock,
  Layers,
  Send,
  Ticket,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import {
  UserProfile,
  InvolvedProject,
  EventRSVP,
  PublicStudentProfile,
  InvolvedProjectStatus,
} from '../types';
import { CreateProjectModal } from './CreateProjectModal';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  involvedProjects: InvolvedProject[];
  onAddProject: (project: Omit<InvolvedProject, 'id' | 'createdAt' | 'status'>) => void;
  eventRsvps: EventRSVP[];
  activePublicProfile?: PublicStudentProfile | null;
  onClosePublicProfile?: () => void;
  onConnectOrMessage?: (student: PublicStudentProfile) => void;
  onRestartOnboarding: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  involvedProjects,
  onAddProject,
  eventRsvps,
  activePublicProfile,
  onClosePublicProfile,
  onConnectOrMessage,
  onRestartOnboarding,
}) => {
  // Toggle between My View and Self-Public View
  const [isSelfPublicView, setIsSelfPublicView] = useState(false);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedSchool, setEditedSchool] = useState(profile.school);
  const [editedMajor, setEditedMajor] = useState(profile.major);
  const [editedGradYear, setEditedGradYear] = useState(profile.gradYear);
  const [editedBio, setEditedBio] = useState(profile.bio);

  // Create Project Modal State
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Skill & Interest Inputs
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  // Involved In filter sub-tab: 'all' | 'Owner' | 'Joined' | 'Applied'
  const [involvedFilter, setInvolvedFilter] = useState<'all' | InvolvedProjectStatus>('all');

  // Resume preview state
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Save profile info
  const handleSaveProfileModal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: editedName.trim() || profile.name,
      school: editedSchool.trim() || profile.school,
      major: editedMajor.trim() || profile.major,
      gradYear: editedGradYear.trim() || profile.gradYear,
      bio: editedBio.trim() || profile.bio,
    });
    setIsEditModalOpen(false);
  };

  // Skill management (triggers Gemma 4 re-evaluation via App.tsx effect on skills)
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !profile.skills.includes(trimmed)) {
        onUpdateProfile({
          ...profile,
          skills: [...profile.skills, trimmed],
        });
        setSkillInput('');
      }
    }
  };

  const handleAddSkillClick = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      onUpdateProfile({
        ...profile,
        skills: [...profile.skills, trimmed],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdateProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Interest management
  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = interestInput.trim();
      if (trimmed && !profile.interests.includes(trimmed)) {
        onUpdateProfile({
          ...profile,
          interests: [...profile.interests, trimmed],
        });
        setInterestInput('');
      }
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    onUpdateProfile({
      ...profile,
      interests: profile.interests.filter((i) => i !== interestToRemove),
    });
  };

  // Helper for project status badges
  const renderStatusBadge = (status: InvolvedProjectStatus) => {
    switch (status) {
      case 'Owner':
        return (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#4C050D] text-[#FBFBF9] border border-[#4C050D]">
            Owner
          </span>
        );
      case 'Joined':
        return (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Joined
          </span>
        );
      case 'Applied':
      default:
        return (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#F4F2EC] text-[#57534E] border border-[#E2DFCE] flex items-center space-x-1">
            <Clock className="w-2.5 h-2.5" />
            <span>Applied</span>
          </span>
        );
    }
  };

  // Filtered involved projects for My View
  const filteredProjects = involvedProjects.filter((p) => {
    if (involvedFilter === 'all') return true;
    return p.status === involvedFilter;
  });

  // =========================================================================
  // CASE A: PUBLIC VIEW of ANOTHER student (tapped from discovery card)
  // =========================================================================
  if (activePublicProfile) {
    const student = activePublicProfile;
    const publicProjects = student.projects.filter(
      (p) => p.status === 'Owner' || p.status === 'Joined'
    );

    return (
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pt-3 pb-24 sm:pb-28">
        {/* Back navigation header */}
        <div className="flex items-center justify-between mb-3.5">
          <button
            onClick={onClosePublicProfile}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#4C050D] hover:text-[#8C0610] bg-[#F4F2EC] px-3 py-1.5 rounded-full border border-[#E2DFCE] cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Discovery</span>
          </button>

          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C877E] bg-[#F4F2EC] px-2.5 py-1 rounded-full border border-[#E2DFCE]">
            Public Student Profile
          </span>
        </div>

        {/* Header Card */}
        <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-5 shadow-editorial mb-4">
          <div className="flex items-start space-x-3.5 mb-3.5">
            <div className="w-16 h-16 rounded-full bg-[#4C050D] text-[#FBFBF9] flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-xl font-bold text-[#1C1917] truncate">
                  {student.name}
                </h1>
                <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-[#8C0610] bg-[#8C0610]/10 px-1.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>.edu</span>
                </span>
              </div>

              <div className="flex items-center space-x-1 text-xs font-semibold text-[#57534E] mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#8C0610] shrink-0" />
                <span className="truncate">
                  {student.school} • {student.major} {student.gradYear}
                </span>
              </div>
            </div>
          </div>

          {/* About Me Bio */}
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
              About Me
            </div>
            <p className="text-xs leading-relaxed text-[#1C1917] bg-[#F4F2EC]/60 p-3 rounded-2xl border border-[#E2DFCE]/60">
              {student.bio}
            </p>
          </div>

          {/* Gemma 4 AI Match Analysis */}
          <div className="mb-4 p-3.5 rounded-2xl bg-[#4C050D]/5 border border-[#4C050D]/15">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#4C050D] mb-1">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8C0610]" />
                <span>Compatibility: {student.matchScore || 98}% Match</span>
              </span>
              <span className="text-[9px] font-semibold text-[#8C877E] lowercase">
                powered by gemma 4
              </span>
            </div>
            <p className="text-xs font-medium text-[#1C1917] leading-relaxed">
              {student.whyYouFit ||
                `Your shared campus network at ${student.school} and technical strengths in ${student.skills.slice(0, 2).join(' & ')} make this a natural collaboration.`}
            </p>
          </div>

          {/* Action Connect / Message button */}
          <button
            onClick={() => onConnectOrMessage?.(student)}
            className="w-full py-3 px-4 rounded-full bg-[#8C0610] text-[#FBFBF9] font-bold text-xs uppercase tracking-wider shadow-editorial hover:bg-[#9e0b16] active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connect & Message {student.name.split(' ')[0]}</span>
          </button>
        </div>

        {/* Skills & Interests */}
        <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-4 shadow-editorial mb-4 space-y-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-2">
              Skills ({student.skills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium text-[#57534E] bg-[#F4F2EC] px-3 py-1 rounded-full border border-[#E2DFCE]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {student.interests && student.interests.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-2">
                Interests & Focus
              </div>
              <div className="flex flex-wrap gap-1.5">
                {student.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs font-medium text-[#4C050D] bg-[#4C050D]/8 px-3 py-1 rounded-full border border-[#4C050D]/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student's Projects (Owner and Joined only) */}
        <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-4 shadow-editorial mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C877E]">
              Projects & Ventures ({publicProjects.length})
            </div>
          </div>

          {publicProjects.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#8C877E] bg-[#F4F2EC] rounded-2xl">
              No active public projects listed yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {publicProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-2xl bg-[#F4F2EC] border border-[#E2DFCE] space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-[#1C1917]">{proj.title}</h4>
                      <span className="text-[10px] font-semibold text-[#8C0610]">
                        {proj.type}
                      </span>
                    </div>
                    {renderStatusBadge(proj.status)}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium bg-[#FBFBF9] px-2 py-0.5 rounded-full border border-[#E2DFCE] text-[#57534E]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE B: PUBLIC VIEW of MYSELF ("View as others see it")
  // =========================================================================
  if (isSelfPublicView) {
    const myPublicProjects = involvedProjects.filter(
      (p) => p.status === 'Owner' || p.status === 'Joined'
    );

    return (
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pt-3 pb-24 sm:pb-28">
        {/* Banner indicating Public View mode */}
        <div className="mb-4 p-3 rounded-2xl bg-[#4C050D] text-[#FBFBF9] flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-[#ffdad8] shrink-0" />
            <span className="text-xs font-semibold">
              Viewing your public profile as others see it
            </span>
          </div>
          <button
            onClick={() => setIsSelfPublicView(false)}
            className="text-xs font-bold underline underline-offset-2 hover:text-[#ffdad8] cursor-pointer ml-2 shrink-0"
          >
            Exit Public View
          </button>
        </div>

        {/* Header Card (No edit button, no create project box) */}
        <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-5 shadow-editorial mb-4">
          <div className="flex items-start space-x-3.5 mb-3.5">
            <div className="w-16 h-16 rounded-full bg-[#4C050D] text-[#FBFBF9] flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-xl font-bold text-[#1C1917] truncate">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-[#8C0610] bg-[#8C0610]/10 px-1.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>.edu</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1 text-xs font-semibold text-[#57534E] mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#8C0610] shrink-0" />
                <span className="truncate">
                  {profile.school} • {profile.major} {profile.gradYear}
                </span>
              </div>
            </div>
          </div>

          {/* About Me */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
              About Me
            </div>
            <p className="text-xs leading-relaxed text-[#1C1917] bg-[#F4F2EC]/60 p-3 rounded-2xl border border-[#E2DFCE]/60">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Skills & Interests (Static chips only) */}
        <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-4 shadow-editorial mb-4 space-y-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-2">
              Skills ({profile.skills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium text-[#57534E] bg-[#F4F2EC] px-3 py-1 rounded-full border border-[#E2DFCE]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-2">
              Interests & Focus
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs font-medium text-[#4C050D] bg-[#4C050D]/8 px-3 py-1 rounded-full border border-[#4C050D]/20"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Projects (Owner and Joined only, NO Applied, NO events) */}
        <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-4 shadow-editorial mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C877E] mb-3">
            Projects & Ventures ({myPublicProjects.length})
          </div>

          {myPublicProjects.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#8C877E] bg-[#F4F2EC] rounded-2xl">
              No public projects posted yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {myPublicProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-2xl bg-[#F4F2EC] border border-[#E2DFCE] space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-[#1C1917]">{proj.title}</h4>
                      <span className="text-[10px] font-semibold text-[#8C0610]">
                        {proj.type}
                      </span>
                    </div>
                    {renderStatusBadge(proj.status)}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium bg-[#FBFBF9] px-2 py-0.5 rounded-full border border-[#E2DFCE] text-[#57534E]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE C: MY VIEW (The primary home base)
  // =========================================================================
  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pt-3 pb-24 sm:pb-28">
      {/* Top Bar: Title & View Mode Switcher */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4C050D]">
            Personal Profile
          </h1>
          <p className="text-xs text-[#57534E] mt-0.5">
            Your home base and student presence at {profile.school}.
          </p>
        </div>

        {/* "View as others see it" button */}
        <button
          onClick={() => setIsSelfPublicView(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F4F2EC] hover:bg-[#E8E8E6] text-[#4C050D] text-xs font-bold uppercase tracking-wider border border-[#E2DFCE] transition-all cursor-pointer shadow-xs"
          title="Preview public profile"
        >
          <Eye className="w-3.5 h-3.5 text-[#8C0610]" />
          <span>View Public</span>
        </button>
      </div>

      {/* "Create a Project" box at the top (LinkedIn "Start a post" pattern) */}
      <div
        onClick={() => setIsCreateProjectOpen(true)}
        className="bg-[#FBFBF9] rounded-2xl border border-[#E2DFCE] p-3 shadow-editorial mb-4 hover:border-[#8C0610]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#4C050D] text-[#FBFBF9] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {profile.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="flex-1 bg-[#F4F2EC] rounded-full px-4 py-2 text-xs font-medium text-[#8C877E] group-hover:text-[#1C1917] border border-[#E2DFCE]/60 flex items-center justify-between">
            <span>Start a project or find teammates...</span>
            <Plus className="w-4 h-4 text-[#8C0610]" />
          </div>
        </div>

        {/* Quick shortcut tags */}
        <div className="flex items-center justify-around pt-2.5 mt-2 border-t border-[#E2DFCE]/50 text-[11px] font-semibold text-[#57534E]">
          <span className="flex items-center space-x-1 hover:text-[#8C0610]">
            <Sparkles className="w-3 h-3 text-[#8C0610]" />
            <span>Hackathon Partner</span>
          </span>
          <span className="flex items-center space-x-1 hover:text-[#8C0610]">
            <Briefcase className="w-3 h-3 text-[#95B1C7]" />
            <span>Startup / Side Hustle</span>
          </span>
          <span className="flex items-center space-x-1 hover:text-[#8C0610]">
            <Layers className="w-3 h-3 text-[#57534E]" />
            <span>Class Project</span>
          </span>
        </div>
      </div>

      {/* Header Card: Profile Info + Edit Profile Button */}
      <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-5 shadow-editorial mb-4">
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-start space-x-3.5 min-w-0">
            <div className="w-16 h-16 rounded-full bg-[#4C050D] text-[#FBFBF9] flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <h2 className="text-xl font-bold text-[#1C1917] truncate">
                  {profile.name}
                </h2>
                {profile.verified && (
                  <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-[#8C0610] bg-[#8C0610]/10 px-1.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>.edu</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1 text-xs font-semibold text-[#57534E] mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#8C0610] shrink-0" />
                <span className="truncate font-bold text-[#4C050D]">
                  {profile.school}
                </span>
                <span>• {profile.major} {profile.gradYear}</span>
              </div>

              <div className="text-[11px] text-[#8C877E] mt-0.5 truncate">
                {profile.email}
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 rounded-full bg-[#F4F2EC] hover:bg-[#E8E8E6] text-[#4C050D] border border-[#E2DFCE] transition-colors cursor-pointer shrink-0"
            title="Edit profile"
            aria-label="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* About Me Bio */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
            About Me
          </div>
          <p className="text-xs leading-relaxed text-[#1C1917] bg-[#F4F2EC]/60 p-3 rounded-2xl border border-[#E2DFCE]/60">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* Skills & Interests as Chips */}
      <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-4 shadow-editorial mb-4 space-y-4">
        {/* Skills Section */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C877E]">
              Skills ({profile.skills.length})
            </span>
            <span className="text-[10px] text-[#8C0610] font-semibold">
              Re-runs Gemma AI scoring on change
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-[#57534E] bg-[#F4F2EC] px-3 py-1 rounded-full border border-[#E2DFCE]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="p-0.5 text-[#8C877E] hover:text-[#ba1a1a] rounded-full cursor-pointer"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input: Press Enter to add */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type skill & press Enter..."
              className="flex-1 text-xs bg-[#F4F2EC] px-3.5 py-2 rounded-full border border-[#E2DFCE] text-[#1C1917] placeholder-[#8C877E] focus:outline-none focus:border-[#8C0610]"
            />
            <button
              type="button"
              onClick={handleAddSkillClick}
              disabled={!skillInput.trim()}
              className="px-3.5 py-2 rounded-full bg-[#4C050D] text-[#FBFBF9] text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        <div className="h-px bg-[#E2DFCE]/60" />

        {/* Interests Section */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C877E]">
              Interests & Focus
            </span>
            <span className="text-[10px] text-[#8C877E]">Press Enter to add</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-[#4C050D] bg-[#4C050D]/8 px-3 py-1 rounded-full border border-[#4C050D]/20"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="p-0.5 text-[#8C877E] hover:text-[#ba1a1a] rounded-full cursor-pointer"
                  title="Remove interest"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleAddInterest}
              placeholder="Add interest & press Enter..."
              className="flex-1 text-xs bg-[#F4F2EC] px-3.5 py-2 rounded-full border border-[#E2DFCE] text-[#1C1917] placeholder-[#8C877E] focus:outline-none focus:border-[#4C050D]"
            />
          </div>
        </div>
      </div>

      {/* "Involved In" Section: Owner, Joined, Applied */}
      <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-4 shadow-editorial mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#4C050D] uppercase tracking-wider text-[11px]">
              Involved In ({involvedProjects.length})
            </h3>
            <p className="text-[10px] text-[#57534E]">
              Projects you own, joined as collaborator, or applied to via swipe.
            </p>
          </div>

          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="flex items-center space-x-1 text-[11px] font-bold text-[#8C0610] hover:text-[#9e0b16] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>
        </div>

        {/* Filter pills: All | Owner | Joined | Applied */}
        <div className="flex p-0.5 rounded-full bg-[#F4F2EC] border border-[#E2DFCE] text-[11px] mb-3">
          {(['all', 'Owner', 'Joined', 'Applied'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setInvolvedFilter(filter)}
              className={`flex-1 py-1 text-center font-bold rounded-full transition-all cursor-pointer ${
                involvedFilter === filter
                  ? 'bg-[#FBFBF9] text-[#4C050D] shadow-xs'
                  : 'text-[#8C877E] hover:text-[#1C1917]'
              }`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>

        {/* Project List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#8C877E] bg-[#F4F2EC] rounded-2xl">
            No projects in this category yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-2xl bg-[#F4F2EC] border border-[#E2DFCE] space-y-1.5 transition-all hover:border-[#8C0610]/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs text-[#1C1917] leading-snug">
                      {proj.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-[#8C0610]">
                      {proj.type} • {proj.timeline}
                    </span>
                  </div>
                  {renderStatusBadge(proj.status)}
                </div>

                <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                  {proj.description}
                </p>

                <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                  <div className="flex flex-wrap gap-1">
                    {proj.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium bg-[#FBFBF9] px-2 py-0.5 rounded-full border border-[#E2DFCE] text-[#57534E]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {proj.ownerName && proj.status !== 'Owner' && (
                    <span className="text-[10px] text-[#8C877E] italic">
                      Lead: {proj.ownerName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* "My Events" Section: Events I have passes for */}
      <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-4 shadow-editorial mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C877E]">
            My Events & Passes ({eventRsvps.length})
          </div>
          <span className="text-[10px] font-semibold text-[#8C0610] bg-[#8C0610]/8 px-2 py-0.5 rounded-full">
            Confirmed RSVPs
          </span>
        </div>

        {eventRsvps.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#8C877E] bg-[#F4F2EC] rounded-2xl">
            You don't have any event passes yet. Swipe right on campus events in Discover to claim tickets.
          </div>
        ) : (
          <div className="space-y-2.5">
            {eventRsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                className="p-3 rounded-2xl bg-[#F4F2EC] border border-[#E2DFCE] flex items-center justify-between"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="text-xs font-bold text-[#1C1917] truncate">
                    {rsvp.card.title}
                  </div>
                  <div className="text-[11px] text-[#57534E] flex items-center space-x-1.5">
                    <span>{rsvp.card.eventDate}</span>
                    <span>•</span>
                    <span className="truncate">{rsvp.card.venue || 'Campus Main'}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="font-mono text-[10px] font-bold text-[#4C050D] bg-[#FBFBF9] px-2 py-1 rounded-md border border-[#E2DFCE] block">
                    {rsvp.ticketCode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Dossier Artifacts */}
      <div className="bg-[#FBFBF9] rounded-3xl border border-[#E2DFCE] p-4 shadow-editorial mb-4 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C877E]">
          Verified Dossier Artifacts
        </div>

        <div
          onClick={() => setShowResumeModal(true)}
          className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F2EC] border border-[#E2DFCE] hover:border-[#8C0610]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#8C0610]/10 text-[#8C0610]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1C1917] group-hover:text-[#8C0610] transition-colors">
                {profile.resumeName}
              </div>
              <div className="text-[10px] text-[#8C877E]">
                Parsed & Attached to All Swipes
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#4C050D] uppercase text-[10px]">
            Preview
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a
            href={`https://${profile.githubUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-[#F4F2EC] border border-[#E2DFCE] text-xs font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="truncate">GitHub</span>
          </a>

          <a
            href={`https://${profile.linkedinUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-[#F4F2EC] border border-[#E2DFCE] text-xs font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span className="truncate">LinkedIn</span>
          </a>

          <a
            href={`https://${profile.portfolioUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-[#F4F2EC] border border-[#E2DFCE] text-xs font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="truncate">Site</span>
          </a>
        </div>
      </div>

      {/* Recalibrate Campus trigger */}
      <div className="text-center pt-2">
        <button
          onClick={onRestartOnboarding}
          className="text-xs font-bold text-[#57534E] hover:text-[#4C050D] underline underline-offset-4 decoration-[#E2DFCE] cursor-pointer"
        >
          Recalibrate Campus & Onboarding
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-xs"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FBFBF9] border border-[#E2DFCE] p-6 shadow-editorial-active z-10">
            <div className="flex items-center justify-between mb-4 border-b border-[#E2DFCE] pb-3">
              <h3 className="font-bold text-base text-[#4C050D]">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-[#8C877E] hover:text-[#1C1917]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileModal} className="space-y-3 text-left">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full text-xs font-semibold bg-[#F4F2EC] px-3 py-2 rounded-xl border border-[#E2DFCE] text-[#1C1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  required
                  value={editedSchool}
                  onChange={(e) => setEditedSchool(e.target.value)}
                  className="w-full text-xs font-semibold bg-[#F4F2EC] px-3 py-2 rounded-xl border border-[#E2DFCE] text-[#1C1917] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                    Major
                  </label>
                  <input
                    type="text"
                    required
                    value={editedMajor}
                    onChange={(e) => setEditedMajor(e.target.value)}
                    className="w-full text-xs font-semibold bg-[#F4F2EC] px-3 py-2 rounded-xl border border-[#E2DFCE] text-[#1C1917] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                    Class Year
                  </label>
                  <input
                    type="text"
                    required
                    value={editedGradYear}
                    onChange={(e) => setEditedGradYear(e.target.value)}
                    className="w-full text-xs font-semibold bg-[#F4F2EC] px-3 py-2 rounded-xl border border-[#E2DFCE] text-[#1C1917] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
                  About Me Bio
                </label>
                <textarea
                  rows={3}
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="w-full text-xs bg-[#F4F2EC] p-3 rounded-xl border border-[#E2DFCE] text-[#1C1917] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#F4F2EC] text-[#4C050D] text-xs font-bold uppercase tracking-wider border border-[#E2DFCE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#8C0610] text-[#FBFBF9] text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        userSchool={profile.school}
        userName={profile.name}
        onCreateProject={onAddProject}
      />

      {/* Resume Preview Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-xs"
            onClick={() => setShowResumeModal(false)}
          />

          <div className="relative w-full max-w-sm rounded-3xl bg-[#FBFBF9] border border-[#E2DFCE] p-6 shadow-editorial-active z-10">
            <div className="flex items-center justify-between mb-4 border-b border-[#E2DFCE] pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#8C0610]" />
                <span className="font-bold text-sm text-[#1C1917]">
                  {profile.resumeName}
                </span>
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className="p-1 rounded-full text-[#8C877E] hover:text-[#1C1917]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#57534E] mb-6">
              <div className="p-3 bg-[#F4F2EC] rounded-2xl border border-[#E2DFCE]">
                <div className="font-bold text-[#4C050D] mb-1">
                  Education & Honors
                </div>
                <div>{profile.school} • {profile.major}</div>
                <div className="text-[11px] text-[#8C877E]">
                  Verified Student Identity • Active Wolfpack Pass Holder
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowResumeModal(false)}
              className="w-full py-2.5 rounded-full bg-[#4C050D] text-[#FBFBF9] text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Done Previewing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
