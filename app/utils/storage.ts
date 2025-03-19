import { UserProfile, StudySession, StudyPlan } from "../types";

const STORAGE_KEYS = {
  USER_PROFILE: "study_coach_user_profile",
  STUDY_SESSIONS: "study_coach_sessions",
  STUDY_PLANS: "study_coach_plans",
};

export const storage = {
  // User Profile
  getUserProfile: (): UserProfile | null => {
    if (typeof window === "undefined") return null;
    const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  },

  setUserProfile: (profile: UserProfile): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Study Sessions
  getStudySessions: (): StudySession[] => {
    if (typeof window === "undefined") return [];
    const sessions = localStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
    return sessions ? JSON.parse(sessions) : [];
  },

  addStudySession: (session: StudySession): void => {
    if (typeof window === "undefined") return;
    const sessions = storage.getStudySessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(sessions));
  },

  // Study Plans
  getStudyPlans: (): StudyPlan[] => {
    if (typeof window === "undefined") return [];
    const plans = localStorage.getItem(STORAGE_KEYS.STUDY_PLANS);
    return plans ? JSON.parse(plans) : [];
  },

  setStudyPlans: (plans: StudyPlan[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.STUDY_PLANS, JSON.stringify(plans));
  },
};
