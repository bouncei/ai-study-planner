"use client";

import { useState, useEffect } from "react";
import { UserProfile, StudySession, StudyPlan } from "../types";
import { storage } from "../utils/storage";
import ProfileForm from "./ProfileForm";
import { default as StudySessionComponent } from "./StudySession";
import StudyProgress from "./StudyProgress";
import { default as StudyPlanComponent } from "./StudyPlan";
import { motion, AnimatePresence } from "framer-motion";

export default function StudyCoach() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  useEffect(() => {
    // Load initial data from localStorage
    const profile = storage.getUserProfile();
    const sessions = storage.getStudySessions();
    const plans = storage.getStudyPlans();

    setUserProfile(profile);
    setStudySessions(sessions);
    setStudyPlans(plans);
  }, []);

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleSessionComplete = (session: StudySession) => {
    setStudySessions([...studySessions, session]);
  };

  const handlePlanUpdate = (plans: StudyPlan[]) => {
    setStudyPlans(plans);
  };

  if (!userProfile) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to Your AI Study Coach
          </motion.h2>
          <motion.p
            className="text-center text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Let's get started by creating your profile
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ProfileForm onSubmit={handleProfileSubmit} />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StudySessionComponent onSessionComplete={handleSessionComplete} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StudyProgress sessions={studySessions} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <StudyPlanComponent
              userProfile={userProfile}
              onPlanUpdate={handlePlanUpdate}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
