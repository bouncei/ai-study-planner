export interface UserProfile {
  id: string;
  name: string;
  learningStyle: string;
  goals: string[];
  subjects: string[];
}

export interface StudySession {
  id: string;
  date: string;
  subject: string;
  duration: number;
  notes: string;
  aiFeedback: string;
}

export interface StudyPlan {
  id: string;
  subject: string;
  topics: string[];
  schedule: {
    [date: string]: {
      topics: string[];
      duration: number;
    };
  };
}
