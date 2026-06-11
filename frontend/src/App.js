import { useState } from "react";
import axios from "axios";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

function App() {
  const [target, setTarget]   = useState("");
  const [overs, setOvers]     = useState("");
  const [wickets, setWickets] = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // ── Call backend ─────────────────────────────────────────────
  const handleSimulate = async () => {
    if (!target || !overs || !wickets) {
      setError("Please fill in all fields.");
      return;
    }
    if (target < 1 || target > 500) {
      setError("Runs needed must be between 1 and 500.");
      return;
    }
    if (overs < 1 || overs > 20) {
      setError("Overs must be between 1 and 20.");
      return;
    }
    if (wickets < 1 || wickets > 10) {
      setError("Wickets must be between 1 and 10.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post("https://cricket-simulator-8sec.onrender.com/simulate", {
        target:       parseInt(target),
        overs_left:   parseInt(overs),
        wickets_left: parseInt(wickets),
      });
      setResult(response.data);
    } catch (err) {
      setError("Could not connect to server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  // ── Reset form ───────────────────────────────────────────────
  const handleReset = () => {
    setTarget("");
    setOvers("");
    setWickets("");
    setResult(null);
    setError("");
  };

  // ── Color based on probability ───────────────────────────────
  const getColor = (prob) => {
    if (prob >= 70) return "#22c55e";
    if (prob >= 40) return "#f59e0b";
    return "#ef4444";
  };

  // ── Probability label ────────────────────────────────────────
  const getProbLabel = (prob) => {
    if (prob >= 70) return "Looking Good!";
    if (prob >= 50) return "It's On!";
    if (prob >= 30) return "Tough Ask";
    if (prob >= 15) return "Very Hard";
    return "Near Impossible";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.emoji}>🏏</span>
          <h1 style={styles.title}>Cricket Strategy Simulator</h1>
          <p style={styles.subtitle}>
            Enter the match situation — we'll run 10,000 simulations to predict your win probability.
          </p>
        </div>

        {/* Show form if no result yet */}
        {!result ? (
          <>
            <div style={styles.form}>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Runs needed</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="e.g. 60"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Overs remaining</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="e.g. 5"
                  value={overs}
                  onChange={(e) => setOvers(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Wickets in hand</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="e.g. 4"
                  value={wickets}
                  onChange={(e) => setWickets(e.target.value)}
                />
              </div>

            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleSimulate}
              disabled={loading}
            >
              {loading ? "⏳ Simulating 10,000 matches..." : "Simulate →"}
            </button>
          </>
        ) : (

          /* ── Result screen ── */
          <div style={styles.result}>

            {/* Radial chart — fills proportionally to probability */}
            <div style={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  innerRadius="65%"
                  outerRadius="100%"
                  data={[
                    { value: 100, fill: "#1e3a5f" },
                    { value: result.win_probability, fill: getColor(result.win_probability) }
                  ]}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>

              {/* Centered text inside chart */}
              <div style={styles.chartCenter}>
                <p style={{ ...styles.probability, color: getColor(result.win_probability) }}>
                  {result.win_probability}%
                </p>
                <p style={styles.probSublabel}>
                  {getProbLabel(result.win_probability)}
                </p>
              </div>
            </div>

            <p style={styles.simCount}>Based on 10,000 simulated matches</p>

            {/* Stats row */}
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{result.required_run_rate}</p>
                <p style={styles.statLabel}>Run Rate Needed</p>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{target}</p>
                <p style={styles.statLabel}>Runs to Win</p>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{wickets}</p>
                <p style={styles.statLabel}>Wickets Left</p>
              </div>
            </div>

            {/* Strategy */}
            <div style={{
              ...styles.strategyBox,
              borderLeft: `4px solid ${getColor(result.win_probability)}`
            }}>
              <p style={styles.strategyLabel}>Strategy Recommendation</p>
              <p style={styles.strategyText}>{result.strategy}</p>
            </div>

            {/* Simulate again button */}
            <button style={styles.resetButton} onClick={handleReset}>
              ← Simulate Again
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "2rem",
  },
  card: {
    background: "#1e293b",
    borderRadius: "1.5rem",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  emoji: {
    fontSize: "2.5rem",
  },
  title: {
    color: "#f1f5f9",
    fontSize: "1.6rem",
    margin: "0.5rem 0 0.5rem",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    lineHeight: 1.5,
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    color: "#94a3b8",
    fontSize: "0.85rem",
  },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#f1f5f9",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.9rem",
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    border: "none",
    borderRadius: "0.75rem",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "#ef4444",
    fontSize: "0.85rem",
    marginBottom: "0.5rem",
  },
  result: {
    textAlign: "center",
  },
  chartWrapper: {
    position: "relative",
    marginBottom: "0.5rem",
  },
  chartCenter: {
    position: "absolute",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
  },
  probability: {
    fontSize: "3rem",
    fontWeight: "700",
    margin: "0",
    lineHeight: 1,
  },
  probSublabel: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    margin: "0.3rem 0 0",
  },
  simCount: {
    color: "#475569",
    fontSize: "0.75rem",
    marginBottom: "1.5rem",
  },
  statsRow: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  statBox: {
    flex: 1,
    background: "#0f172a",
    borderRadius: "0.75rem",
    padding: "0.75rem",
  },
  statValue: {
    color: "#f1f5f9",
    fontSize: "1.3rem",
    fontWeight: "600",
    margin: "0 0 0.2rem",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "0.75rem",
    margin: 0,
  },
  strategyBox: {
    background: "#0f172a",
    borderRadius: "0.75rem",
    padding: "1rem 1.25rem",
    textAlign: "left",
    marginBottom: "1.5rem",
  },
  strategyLabel: {
    color: "#64748b",
    fontSize: "0.75rem",
    margin: "0 0 0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  strategyText: {
    color: "#f1f5f9",
    fontSize: "0.95rem",
    margin: 0,
    lineHeight: 1.5,
  },
  resetButton: {
    width: "100%",
    padding: "0.9rem",
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: "0.75rem",
    color: "#94a3b8",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
};

export default App;