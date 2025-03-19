"use client";

import { StudySession } from "../types";

interface StudyProgressProps {
  sessions: StudySession[];
}

export default function StudyProgress({ sessions }: StudyProgressProps) {
  const totalStudyTime = sessions.reduce(
    (acc, session) => acc + session.duration,
    0
  );
  const totalSessions = sessions.length;
  const averageSessionTime =
    totalSessions > 0 ? Math.round(totalStudyTime / totalSessions) : 0;

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">Total Study Time</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatDuration(totalStudyTime)}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600">Total Sessions</div>
          <div className="text-2xl font-bold text-green-900">
            {totalSessions}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600">Avg. Session Time</div>
          <div className="text-2xl font-bold text-purple-900">
            {formatDuration(averageSessionTime)}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Recent Study Sessions
        </h4>
        <div className="space-y-4">
          {sessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">
                    {session.subject}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(session.date)}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDuration(session.duration)}
                </div>
              </div>
              {session.notes && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {session.notes}
                </div>
              )}
              {session.aiFeedback && (
                <div className="mt-2 text-sm text-blue-600">
                  <span className="font-medium">AI Feedback:</span>{" "}
                  {session.aiFeedback}
                </div>
              )}
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No study sessions yet. Start your first session!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
