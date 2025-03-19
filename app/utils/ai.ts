import { UserProfile, StudyPlan, StudySession } from "../types";
import { Cache } from "./cache";

interface AIResponse {
  content: string;
  error?: string;
}

const cache = Cache.getInstance();

export const ai = {
  async generateStudyPlan(profile: UserProfile): Promise<AIResponse> {
    const cacheKey = `study_plan_${profile.id}`;
    const cached = cache.get<AIResponse>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an expert study coach. Create a personalized study plan based on the user's profile.",
            },
            {
              role: "user",
              content: `Create a study plan for a student with the following profile:
                - Learning Style: ${profile.learningStyle}
                - Goals: ${profile.goals.join(", ")}
                - Subjects: ${profile.subjects.join(", ")}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate study plan");
      }
      const result = { content: data.choices[0].message.content };
      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      return {
        content: "Failed to generate study plan",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async generateStudyFeedback(session: StudySession): Promise<AIResponse> {
    const cacheKey = `feedback_${session.id}`;
    const cached = cache.get<AIResponse>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an expert study coach. Provide personalized feedback on the study session.",
            },
            {
              role: "user",
              content: `Provide feedback for a study session with the following details:
                - Subject: ${session.subject}
                - Duration: ${Math.floor(session.duration / 60)} minutes
                - Notes: ${session.notes || "No notes provided"}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate feedback");
      }
      const result = { content: data.choices[0].message.content };
      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      return {
        content: "Failed to generate feedback",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async generateTopicRecommendations(
    profile: UserProfile,
    sessions: StudySession[]
  ): Promise<AIResponse> {
    const cacheKey = `recommendations_${profile.id}`;
    const cached = cache.get<AIResponse>(cacheKey);
    if (cached) return cached;

    try {
      const recentSessions = sessions
        .slice(-5)
        .map((s) => `${s.subject}: ${s.notes || "No notes"}`)
        .join("\n");

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an expert study coach. Recommend study topics based on the user's profile and recent sessions.",
            },
            {
              role: "user",
              content: `Recommend study topics for a student with:
                - Learning Style: ${profile.learningStyle}
                - Goals: ${profile.goals.join(", ")}
                - Subjects: ${profile.subjects.join(", ")}
                - Recent Sessions:
                ${recentSessions}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recommendations");
      }
      const result = { content: data.choices[0].message.content };
      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      return {
        content: "Failed to generate recommendations",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
