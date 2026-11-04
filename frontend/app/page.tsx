
"use client";

import { useRef, useState } from "react";

type AnalysisResult = {
  filename: string;
  profile: {
    total_rows: number;
    total_columns: number;
    missing_values: Record<string, number>;
    duplicate_rows: number;
    numeric_columns: string[];
    categorical_columns: string[];
    statistical_summary: Record<
      string,
      Record<string, number | null>
    >;
  };
  cleaning_summary: {
    original_rows: number;
    final_rows: number;
    duplicates_removed: number;
    numeric_missing_filled: number;
    categorical_missing_filled: number;
  };
  eda: {
    numeric_columns: string[];
    categorical_columns: string[];
  };
};

const navigation = [
  { name: "Overview", icon: "◫" },
  { name: "Data Quality", icon: "◇" },
  { name: "Exploratory Analysis", icon: "▥" },
  { name: "Insights", icon: "✧" },
  { name: "Reports", icon: "▤" },
];

export default function Home() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeDataset() {
    if (!file) {
      setError("Please select a CSV or Excel file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to analyze this file."
        );
      }

      setResult(data as AnalysisResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  const profile = result?.profile;
  const missingCount = profile
    ? Object.values(profile.missing_values).reduce(
        (total, count) => total + count,
        0
      )
    : null;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-800 bg-[#111827] text-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-xl font-black text-slate-950">
            I
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">InsightFlow</h1>
            <p className="text-xs text-slate-400">Data intelligence platform</p>
          </div>
        </div>

        <div className="px-4 pt-8">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item, index) => (
              <button
                key={item.name}
                onClick={() => {
                  if (index === 0) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    document
                      .getElementById(
                        index === 1
                          ? "quality"
                          : index === 2
                            ? "analysis"
                            : "upload"
                      )
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                  index === 0
                    ? "bg-cyan-400 font-semibold text-slate-950"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-xs font-semibold text-slate-200">
                Local workspace
              </p>
            </div>
            <p className="text-xs leading-5 text-slate-400">
              Analyze your datasets with the InsightFlow analytics engine.
            </p>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div>
            <p className="text-xs font-medium text-slate-500">
              WORKSPACE / OVERVIEW
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
              Data Analytics Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Analyst Workspace</p>
              <p className="text-xs text-slate-500">Local environment</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-cyan-300">
              IF
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
          <section className="relative overflow-hidden rounded-3xl bg-[#172554] p-7 text-white sm:p-10">
            <div className="relative z-[1] max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                Your data, understood
              </p>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Turn raw data into
                <span className="text-cyan-300"> meaningful insights.</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Upload a dataset to explore its structure, identify data
                quality issues, and generate statistical summaries in one place.
              </p>
              <button
                onClick={() =>
                  document.getElementById("upload")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="mt-7 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                Analyze a dataset <span className="ml-2">→</span>
              </button>
            </div>
            <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border border-cyan-300/20" />
            <div className="absolute -right-2 -top-12 h-60 w-60 rounded-full border border-cyan-300/20" />
            <div className="absolute -bottom-28 right-28 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          </section>

          <section id="analysis" className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Dataset overview
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {result
                  ? `Analysis results for ${result.filename}`
                  : "Your dataset metrics will appear here after analysis."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Total rows",
                  value: profile?.total_rows,
                  icon: "▤",
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  label: "Total columns",
                  value: profile?.total_columns,
                  icon: "▥",
                  color: "bg-violet-50 text-violet-700",
                },
                {
                  label: "Missing values",
                  value: missingCount,
                  icon: "◇",
                  color: "bg-amber-50 text-amber-700",
                },
                {
                  label: "Duplicate rows",
                  value: profile?.duplicate_rows,
                  icon: "⧉",
                  color: "bg-rose-50 text-rose-700",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${card.color}`}
                    >
                      {card.icon}
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                    {card.value === undefined || card.value === null
                      ? "—"
                      : card.value.toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {result ? "From uploaded dataset" : "Awaiting dataset"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="upload"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
                Start your analysis
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Upload your dataset
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose a CSV or Excel file. InsightFlow will profile, clean,
                and analyze the dataset using its Python backend.
              </p>
            </div>

            <input
              ref={fileInput}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;
                setFile(selected);
                setError("");
                setResult(null);
              }}
            />

            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-cyan-500 hover:bg-cyan-50/40"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-2xl text-cyan-800">
                ↑
              </span>
              <span className="mt-4 font-semibold text-slate-800">
                {file ? file.name : "Choose a dataset to upload"}
              </span>
              <span className="mt-2 text-sm text-slate-500">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB · Click to change file`
                  : "Click to browse files on your computer"}
              </span>
              <span className="mt-3 text-xs text-slate-400">
                Supported formats: CSV, XLSX
              </span>
            </button>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              >
                {error}
                <p className="mt-1 text-xs">
                  Make sure the backend is running and CORS is configured.
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                Uploads are processed by your local backend.
              </p>
              <button
                onClick={analyzeDataset}
                disabled={!file || loading}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Analyzing dataset..." : "Analyze dataset →"}
              </button>
            </div>
          </section>

          {result && (
            <>
              <section id="quality" className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900">Data quality</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Missing values and duplicate records detected before cleaning.
                  </p>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                      <span className="text-sm text-slate-600">
                        Columns with missing values
                      </span>
                      <strong>
                        {Object.keys(profile!.missing_values).length}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                      <span className="text-sm text-slate-600">
                        Total missing cells
                      </span>
                      <strong>{missingCount}</strong>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                      <span className="text-sm text-slate-600">
                        Duplicate rows detected
                      </span>
                      <strong>{profile!.duplicate_rows}</strong>
                    </div>
                  </div>
                  {Object.keys(profile!.missing_values).length > 0 && (
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="text-xs uppercase text-slate-500">
                          <tr>
                            <th className="pb-3">Column</th>
                            <th className="pb-3 text-right">Missing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(profile!.missing_values).map(
                            ([column, count]) => (
                              <tr key={column} className="border-t border-slate-100">
                                <td className="py-3 font-medium">{column}</td>
                                <td className="py-3 text-right">{count}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900">Cleaning summary</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Changes made by the current automatic cleaning pipeline.
                  </p>
                  <div className="mt-5 space-y-3">
                    {[
                      ["Original rows", result.cleaning_summary.original_rows],
                      ["Rows after cleaning", result.cleaning_summary.final_rows],
                      ["Duplicates removed", result.cleaning_summary.duplicates_removed],
                      ["Numeric missing values filled", result.cleaning_summary.numeric_missing_filled],
                      ["Categorical missing values filled", result.cleaning_summary.categorical_missing_filled],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"
                      >
                        <span className="text-sm text-slate-600">{label}</span>
                        <strong className="text-sm">{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-slate-900">
                  Numerical statistics
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Summary statistics generated by Pandas.
                </p>
                {Object.keys(profile!.statistical_summary).length === 0 ? (
                  <p className="mt-5 text-sm text-slate-500">
                    No numerical columns were detected in this dataset.
                  </p>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="rounded-l-lg p-3">Column</th>
                          <th className="p-3">Mean</th>
                          <th className="p-3">Median</th>
                          <th className="p-3">Minimum</th>
                          <th className="p-3">Maximum</th>
                          <th className="rounded-r-lg p-3">Std. dev.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(profile!.statistical_summary).map(
                          ([column, stats]) => (
                            <tr key={column} className="border-b border-slate-100">
                              <td className="p-3 font-semibold">{column}</td>
                              {[
                                stats.mean,
                                stats.median,
                                stats.minimum,
                                stats.maximum,
                                stats.standard_deviation,
                              ].map((value, index) => (
                                <td key={index} className="p-3 text-slate-600">
                                  {typeof value === "number"
                                    ? value.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      })
                                    : "—"}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}

          <footer className="pb-4 pt-2 text-center text-xs text-slate-400">
            InsightFlow · Automated Data Analysis &amp; Insights Generation
          </footer>
        </div>
      </main>
    </div>
  );
}
