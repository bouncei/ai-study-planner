"use client";

import { useState, useEffect } from "react";
import type { StudySession } from "../types";
import { storage } from "../utils/storage";
import { motion, AnimatePresence } from "framer-motion";

interface StudySessionProps {
  onSessionComplete: (session: StudySession) => void;
}

export default function StudySession({ onSessionComplete }: StudySessionProps) {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setDuration(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const startSession = () => {
    if (!subject) return;
    setIsActive(true);
    setStartTime(new Date());
    setDuration(0);
    setNotes("");
    setAiFeedback("");
  };

  const endSession = () => {
    if (!startTime || !subject) return;

    const session: StudySession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      subject,
      duration,
      notes,
      aiFeedback: generateAiFeedback(duration, subject, notes),
    };

    storage.addStudySession(session);
    onSessionComplete(session);
    setIsActive(false);
    setStartTime(null);
  };

  const generateAiFeedback = (
    duration: number,
    subject: string,
    notes: string
  ): string => {
    const minutes = Math.floor(duration / 60);
    return `Great job studying ${subject} for ${minutes} minutes! ${
      notes
        ? `Your notes on "${notes}" show good engagement with the material.`
        : ""
    } Keep up the good work!`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-5 border-b border-gray-100">
        <motion.h4
          className="text-lg font-semibold text-gray-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Study Session
        </motion.h4>
      </div>

      <div className="p-6">
        {!isActive ? (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                What are you studying?
              </label>
              <input
                type="text"
                id="subject"
                className="block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors placeholder:text-gray-400"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics, Physics, Chemistry..."
              />
            </div>

            <motion.button
              onClick={startSession}
              disabled={!subject}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Session
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="text-center bg-gray-50 rounded-xl p-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="text-5xl font-mono font-bold text-indigo-600"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {formatDuration(duration)}
              </motion.div>
              <div className="text-sm text-gray-500 mt-2">Study Time</div>
            </motion.div>

            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Study Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                className="block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors placeholder:text-gray-400 resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during your study session..."
              />
            </div>

            <motion.button
              onClick={endSession}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              End Session
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {aiFeedback && (
            <motion.div
              className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
                    AI Feedback
                  </h4>
                  <p className="mt-1 text-sm text-indigo-700">{aiFeedback}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
