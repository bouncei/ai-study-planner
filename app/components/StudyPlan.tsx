"use client";

import { useState, useEffect } from "react";
import { UserProfile, StudyPlan as StudyPlanType } from "../types";
import { storage } from "../utils/storage";
import { ai } from "../utils/ai";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface StudyPlanProps {
  userProfile: UserProfile;
  onPlanUpdate: (plans: StudyPlanType[]) => void;
}

export default function StudyPlan({
  userProfile,
  onPlanUpdate,
}: StudyPlanProps) {
  const [plans, setPlans] = useState<StudyPlanType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const savedPlans = storage.getStudyPlans();
    setPlans(savedPlans);
  }, []);

  const generateNewPlan = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const response = await ai.generateStudyPlan(userProfile);
      if (response.error) {
        setError(response.error);
        return;
      }

      const newPlan: StudyPlanType = {
        id: crypto.randomUUID(),
        subject: userProfile.subjects[0], // Default to first subject
        topics: response.content.split("\n").filter((topic) => topic.trim()),
        schedule: generateSchedule(response.content),
      };

      const updatedPlans = [...plans, newPlan];
      storage.setStudyPlans(updatedPlans);
      setPlans(updatedPlans);
      onPlanUpdate(updatedPlans);
    } catch (err) {
      setError("Failed to generate study plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSchedule = (content: string) => {
    const schedule: StudyPlanType["schedule"] = {};
    const today = new Date();

    // Generate a 7-day schedule
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split("T")[0];

      // Distribute topics evenly across the week
      const topicsPerDay = Math.ceil(content.split("\n").length / 7);
      const startIndex = i * topicsPerDay;
      const endIndex = Math.min(
        startIndex + topicsPerDay,
        content.split("\n").length
      );

      schedule[dateKey] = {
        topics: content.split("\n").slice(startIndex, endIndex),
        duration: 60, // Default 1 hour per day
      };
    }

    return schedule;
  };

  const getRecommendations = async () => {
    try {
      const response = await ai.generateTopicRecommendations(userProfile, []);
      if (response.error) {
        setError(response.error);
        return;
      }
      setRecommendations(response.content);
    } catch (err) {
      setError("Failed to generate recommendations");
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <motion.h4
          className="text-lg font-semibold text-gray-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Study Plans
        </motion.h4>
        <motion.button
          onClick={generateNewPlan}
          disabled={isGenerating}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {isGenerating ? "Generating..." : "Generate New Plan"}
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="p-4 bg-red-50 rounded-lg border border-red-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            layout
          >
            <div className="px-6 py-5 border-b border-gray-100">
              <motion.h5 className="text-lg font-semibold text-gray-900" layout>
                {plan.subject}
              </motion.h5>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">
                    Topics to Cover
                  </h6>
                  <motion.ul className="space-y-2" layout>
                    {plan.topics.map((topic, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start text-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                      >
                        <svg
                          className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{topic}</ReactMarkdown>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">
                    Schedule
                  </h6>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Day
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Topics
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(plan.schedule).map(
                          ([date, schedule]) => (
                            <tr key={date} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {new Date(date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="px-6 py-4">
                                <ul className="space-y-1">
                                  {schedule.topics.map((topic, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-600"
                                    >
                                      <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown>{topic}</ReactMarkdown>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {schedule.duration} minutes
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {recommendations && (
        <motion.div
          className="p-4 bg-indigo-50 rounded-lg border border-indigo-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-indigo-800">
                Recommended Topics
              </h4>
              <p className="mt-1 text-sm text-indigo-700">{recommendations}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
