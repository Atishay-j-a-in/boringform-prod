import { useMemo, useState } from "react";
import { useListFormsByUserId, useGetFormAnalytics } from "../hooks/api/form";
import { BarChart3, ChevronDown, ChevronUp, ClipboardList, CalendarDays } from "lucide-react";
import ProtectedRoute from "../components/auth/protected-route";

interface AnalyticsResult {
  formId: string;
  title: string;
  totalResponses: number;
  responsesToday: number;
  avgResponsesPerDay: number;
  recentResponses: Array<{
    id: string;
    email: string | null;
    createdAt: Date | null;
  }>;
}

const AnalyticsPageContent = () => {
  const { forms, isLoading, error } = useListFormsByUserId();
  const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string>("");

  const {
    analytics,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useGetFormAnalytics(selectedFormId);

  const analyticsById = useMemo(() => {
    if (!analytics) return {};
    const data = analytics as AnalyticsResult;
    return { [data.formId]: data };
  }, [analytics]);

  const handleToggle = (formId: string) => {
    setExpandedFormId((prev) => (prev === formId ? null : formId));
    setSelectedFormId(formId);
  };

  const getBarWidth = (value: number, max: number) => {
    if (max <= 0) return "0%";
    return `${Math.min((value / max) * 100, 100)}%`;
  };

  return (
    <div className="relative min-h-screen min-w-screen overflow-hidden bg-black">
      <img
        src="/analytic-bg.png"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            <BarChart3 className="h-4 w-4 text-pink-400" />
            Form Analytics
          </p>

          <h1 className="mt-6 text-5xl font-bold text-white">Analytics Overview</h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Track responses, activity, and recent submissions for every form in your workspace.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white">
            Loading your forms...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
            Failed to load forms. Please try again.
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid gap-6">
            {(forms ?? []).map((form) => {
              const isExpanded = expandedFormId === form.id;
              const analyticsData = analyticsById[form.id] as AnalyticsResult | undefined;
              const maxValue = analyticsData
                ? Math.max(
                    1,
                    analyticsData.totalResponses,
                    analyticsData.responsesToday,
                    analyticsData.avgResponsesPerDay,
                  )
                : 1;

              return (
                <div
                  key={form.id}
                  className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
                >
                  <button
                    onClick={() => handleToggle(form.id)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <div>
                      <p className="text-sm text-zinc-500">Form</p>
                      <h2 className="text-2xl font-semibold text-white">{form.title}</h2>
                      <p className="mt-2 text-xs text-zinc-500">ID: {form.id}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        {form.visibility ?? "unlisted"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                      {isAnalyticsLoading && (
                        <p className="text-sm text-zinc-300">Loading analytics...</p>
                      )}

                      {analyticsError && (
                        <p className="text-sm text-red-200">
                          Unable to load analytics for this form.
                        </p>
                      )}

                      {analyticsData && !isAnalyticsLoading && (
                        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                          <div className="space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                              <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <ClipboardList className="h-4 w-4" />
                                Response Metrics
                              </div>

                              <div className="mt-4 space-y-4">
                                <div>
                                  <div className="flex items-center justify-between text-sm text-white">
                                    <span>Total Responses</span>
                                    <span>{analyticsData.totalResponses}</span>
                                  </div>
                                  <div className="mt-2 h-2 rounded-full bg-white/10">
                                    <div
                                      className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                                      style={{
                                        width: getBarWidth(analyticsData.totalResponses, maxValue),
                                      }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between text-sm text-white">
                                    <span>Responses Today</span>
                                    <span>{analyticsData.responsesToday}</span>
                                  </div>
                                  <div className="mt-2 h-2 rounded-full bg-white/10">
                                    <div
                                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                      style={{
                                        width: getBarWidth(analyticsData.responsesToday, maxValue),
                                      }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between text-sm text-white">
                                    <span>Avg. Responses / Day</span>
                                    <span>{analyticsData.avgResponsesPerDay}</span>
                                  </div>
                                  <div className="mt-2 h-2 rounded-full bg-white/10">
                                    <div
                                      className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                                      style={{
                                        width: getBarWidth(
                                          analyticsData.avgResponsesPerDay,
                                          maxValue,
                                        ),
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <CalendarDays className="h-4 w-4" />
                              Recent Responses
                            </div>

                            <div className="mt-4 space-y-3">
                              {analyticsData.recentResponses.length === 0 && (
                                <p className="text-sm text-zinc-500">No recent responses.</p>
                              )}

                              {analyticsData.recentResponses.map((response) => (
                                <div
                                  key={response.id}
                                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                                >
                                  <p className="text-xs text-zinc-500">{response.id}</p>
                                  <p className="mt-1 text-sm text-white">
                                    {response.email ?? "Anonymous"}
                                  </p>
                                  <p className="mt-1 text-xs text-zinc-500">
                                    {response.createdAt
                                      ? new Date(response.createdAt).toLocaleString()
                                      : "Unknown time"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}
