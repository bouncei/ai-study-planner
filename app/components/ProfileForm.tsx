"use client";

import { useState } from "react";
import { UserProfile } from "../types";
import { storage } from "../utils/storage";

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    learningStyle: "visual",
    goals: "",
    subjects: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name: formData.name,
      learningStyle: formData.learningStyle,
      goals: formData.goals.split(",").map((goal) => goal.trim()),
      subjects: formData.subjects.split(",").map((subject) => subject.trim()),
    };

    storage.setUserProfile(profile);
    onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Your Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label
          htmlFor="learningStyle"
          className="block text-sm font-medium text-gray-700"
        >
          Learning Style
        </label>
        <select
          id="learningStyle"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.learningStyle}
          onChange={(e) =>
            setFormData({ ...formData, learningStyle: e.target.value })
          }
        >
          <option value="visual">Visual</option>
          <option value="auditory">Auditory</option>
          <option value="reading">Reading/Writing</option>
          <option value="kinesthetic">Kinesthetic</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="goals"
          className="block text-sm font-medium text-gray-700"
        >
          Study Goals (comma-separated)
        </label>
        <input
          type="text"
          id="goals"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., Master calculus, Improve writing skills"
          value={formData.goals}
          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
        />
      </div>

      <div>
        <label
          htmlFor="subjects"
          className="block text-sm font-medium text-gray-700"
        >
          Subjects (comma-separated)
        </label>
        <input
          type="text"
          id="subjects"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., Mathematics, Physics, Chemistry"
          value={formData.subjects}
          onChange={(e) =>
            setFormData({ ...formData, subjects: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Profile
      </button>
    </form>
  );
}
