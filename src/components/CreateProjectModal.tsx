/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { ProjectType, InvolvedProject } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSchool: string;
  userName: string;
  onCreateProject: (project: Omit<InvolvedProject, 'id' | 'createdAt' | 'status'>) => void;
}

const PROJECT_TYPES: ProjectType[] = [
  'Hackathon Partner',
  'Startup / Side Hustle',
  'Side Project',
  'Class Project',
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  userSchool,
  userName,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>('Hackathon Partner');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Python', 'Rust']);
  const [timeline, setTimeline] = useState('Fall 2026 – Spring 2027');

  if (!isOpen) return null;

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills([...skills, trimmed]);
        setSkillInput('');
      }
    }
  };

  const handleAddSkillClick = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onCreateProject({
      title: title.trim(),
      description: description.trim(),
      type,
      skills,
      timeline: timeline.trim() || 'Ongoing',
      university: userSchool,
      ownerName: userName,
      ownerSchool: userSchool,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl bg-[#FBFBF9] border-t sm:border border-[#E2DFCE] shadow-editorial-active flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2DFCE] flex items-center justify-between bg-[#FBFBF9] shrink-0">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-full bg-[#8C0610]/10 text-[#8C0610]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-base text-[#4C050D] leading-tight">
                Create a Project Brief
              </h3>
              <p className="text-[11px] text-[#57534E]">
                Post to your profile and {userSchool} discovery feed.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8C877E] hover:text-[#1C1917] hover:bg-[#F4F2EC] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-4 text-left">
          {/* Project Title */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
              Project / Venture Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed CAN-Bus Sensor Pipeline"
              className="w-full bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] placeholder-[#8C877E] px-3.5 py-2.5 rounded-xl border border-[#E2DFCE] focus:border-[#8C0610] focus:bg-[#FBFBF9] focus:outline-none"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C877E] mb-1.5">
              Project Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                    type === t
                      ? 'bg-[#4C050D] text-[#FBFBF9] border-[#4C050D] shadow-xs'
                      : 'bg-[#F4F2EC] text-[#57534E] border-[#E2DFCE] hover:text-[#1C1917]'
                  }`}
                >
                  <span className="truncate">{t}</span>
                  {type === t && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
              Description & Problem Statement
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you building, what challenge are you tackling on campus, and what is your vision?"
              className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] placeholder-[#8C877E] p-3 rounded-xl border border-[#E2DFCE] focus:border-[#8C0610] focus:bg-[#FBFBF9] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Skills Needed */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
              Skills Needed (press Enter to add)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#57534E] bg-[#F4F2EC] px-2.5 py-1 rounded-full border border-[#E2DFCE]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 text-[#8C877E] hover:text-[#ba1a1a] rounded-full cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type skill & press Enter..."
                className="flex-1 bg-[#F4F2EC] text-xs text-[#1C1917] placeholder-[#8C877E] px-3.5 py-2 rounded-xl border border-[#E2DFCE] focus:border-[#8C0610] focus:bg-[#FBFBF9] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkillClick}
                className="px-3 py-2 bg-[#F4F2EC] hover:bg-[#E8E8E6] text-[#4C050D] text-xs font-bold rounded-xl border border-[#E2DFCE] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C877E] mb-1">
              Estimated Timeline / Commitment
            </label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. Weekend Sprint, 10 hrs/wk, Spring 2027"
              className="w-full bg-[#F4F2EC] text-xs text-[#1C1917] placeholder-[#8C877E] px-3.5 py-2 rounded-xl border border-[#E2DFCE] focus:border-[#8C0610] focus:outline-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="w-full py-3 px-4 rounded-full bg-[#8C0610] text-[#FBFBF9] font-bold text-xs uppercase tracking-wider shadow-editorial hover:bg-[#9e0b16] disabled:opacity-40 transition-all cursor-pointer"
            >
              Publish Project to {userSchool}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
