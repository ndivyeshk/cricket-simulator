# 🏏 Cricket Strategy Simulator

A full-stack web application that predicts **win probability** for a batting team in a cricket chase using **Monte Carlo Simulation** — the same probabilistic modeling technique used in quantitative finance for options pricing and risk analysis.

---

## 🎯 What It Does

Enter any live match situation:
- Runs needed to win
- Overs remaining
- Wickets in hand

The app runs **10,000 simulated versions** of the remaining match and tells you:
- **Win probability** (with a visual gauge)
- **Required run rate**
- **Strategy recommendation** (e.g. "Competitive chase, accelerate now")

---

## 🧠 How It Works

### Monte Carlo Simulation Engine
The core of this project is a Monte Carlo simulation — a technique that runs thousands of random scenarios based on real statistical distributions and averages the outcomes.

For each simulation:
1. Each remaining over is simulated independently
2. Runs per over are sampled from a **Gamma distribution** (right-skewed, matches real T20 scoring patterns)
3. Wicket fall probability is applied each over
4. Wickets in hand affect scoring rate via a dynamic multiplier
5. After 10,000 simulations, win % = (simulations where target was reached / 10,000) × 100

### Why Gamma Distribution?
Normal distributions underestimate explosive overs in T20 cricket (18-run overs happen regularly). The Gamma distribution is right-skewed — it allows for both quiet overs and explosive ones, which matches real IPL data far better.

### Why This Matters for Quant Finance
Monte Carlo simulation is a core quant technique used for:
- **Options pricing** (Black-Scholes Monte Carlo)
- **Portfolio stress testing**
- **Risk modeling (VaR)**
- **Derivative valuation**

This project demonstrates the same underlying concept applied to cricket.

---
---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | User interface |
| Charts | Recharts | Win probability gauge |
| HTTP Client | Axios | API calls from React |
| Backend | FastAPI (Python) | REST API server |
| Simulation | NumPy | Gamma distribution sampling |
| Server | Uvicorn | ASGI server for FastAPI |

---
## 📁 Project Structure

cricket-simulator/
│
├── backend/
│   ├── main.py          # FastAPI server — defines /simulate endpoint
│   ├── simulator.py     # Monte Carlo simulation engine
│   └── requirements.txt # Python dependencies
│
├── frontend/
│   └── src/
│       └── App.js       # React UI — form, chart, results display
│
└── README.md

---

## 🚀 Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`

---

## 📡 API Reference

### `POST /simulate`

**Request body:**
```json
{
  "target": 60,
  "overs_left": 5,
  "wickets_left": 5
}
```

**Response:**
```json
{
  "win_probability": 66.23,
  "strategy": "Competitive chase. Accelerate from next over.",
  "required_run_rate": 12.0
}
```

---

## 📊 Sample Results

| Situation | RRR | Win Probability |
|---|---|---|
| 30 runs in 5 overs, 7 wickets | 6.0 | ~99% |
| 40 runs in 5 overs, 6 wickets | 8.0 | ~92% |
| 55 runs in 5 overs, 5 wickets | 11.0 | ~76% |
| 70 runs in 5 overs, 4 wickets | 14.0 | ~30% |
| 90 runs in 5 overs, 3 wickets | 18.0 | ~4% |

---

## 🔬 Simulation Design Decisions

**Why not use raw IPL data for probabilities?**
Raw over-by-over averages from the dataset were skewed by tail-end batting situations. Using calibrated statistical constants based on IPL analytics produced more realistic simulations.

**Wicket factor:**
```python
wicket_factor = 0.7 + (wickets_remaining / 5.0) * 0.6
```
Teams with more wickets in hand bat more aggressively — this multiplier adjusts the mean runs per over dynamically.

**Variance:**
High std deviation in the Gamma distribution captures T20's inherent unpredictability — a team can score 6 or 18 in a single over.

---

## 🎥 Demo

> Add Loom video link here after recording

---

## 👤 Author

**Divyesh Kumar**
[GitHub](https://github.com/ndivyeshk)

---
