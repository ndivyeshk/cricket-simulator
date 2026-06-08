from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from simulator import simulate

# ── Create the FastAPI app ─────────────────────────────────────
app = FastAPI()

# ── CORS — allows React (running on port 3000) to talk to this server ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Define what input the API expects ─────────────────────────
class MatchInput(BaseModel):
    target: int
    overs_left: int
    wickets_left: int

# ── The API endpoint ───────────────────────────────────────────
@app.post("/simulate")
def run_simulation(data: MatchInput):
    result = simulate(data.target, data.overs_left, data.wickets_left)
    return result

# ── Health check endpoint ──────────────────────────────────────
@app.get("/")
def root():
    return {"status": "Cricket simulator API is running"}