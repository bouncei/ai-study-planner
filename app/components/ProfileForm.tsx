"use client";

import { useState } from "react";
import { UserProfile } from "../types";
import { storage } from "../utils/storage";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Welcome to Your Study Journey
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600"
        >
          Let&apos;s create your personalized study profile to help you achieve
          your learning goals.
        </motion.p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors placeholder:text-gray-400"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label
            htmlFor="learningStyle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Learning Style
          </label>
          <select
            id="learningStyle"
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            value={formData.learningStyle}
            onChange={(e) =>
              setFormData({ ...formData, learningStyle: e.target.value })
            }
          >
            <option value="visual">Visual Learner</option>
            <option value="auditory">Auditory Learner</option>
            <option value="reading">Reading/Writing Learner</option>
            <option value="kinesthetic">Kinesthetic Learner</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Choose the learning style that best describes how you prefer to
            learn
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label
            htmlFor="goals"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Study Goals
          </label>
          <input
            type="text"
            id="goals"
            required
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors placeholder:text-gray-400"
            placeholder="e.g., Master calculus, Improve writing skills"
            value={formData.goals}
            onChange={(e) =>
              setFormData({ ...formData, goals: e.target.value })
            }
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter your goals separated by commas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <label
            htmlFor="subjects"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subjects
          </label>
          <input
            type="text"
            id="subjects"
            required
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors placeholder:text-gray-400"
            placeholder="e.g., Mathematics, Physics, Chemistry"
            value={formData.subjects}
            onChange={(e) =>
              setFormData({ ...formData, subjects: e.target.value })
            }
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter the subjects you want to study, separated by commas
          </p>
        </motion.div>

        <motion.button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Start Your Learning Journey
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
