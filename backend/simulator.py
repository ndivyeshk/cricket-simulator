import numpy as np
import random

# ── Constants ─────────────────────────────────────────────────
# Gamma distribution models T20 scoring better than normal
# because it allows for explosive overs (right skewed)
MEAN_RUNS_PER_OVER = 11.5
STD_RUNS_PER_OVER  = 6.5
WICKET_PROB        = 0.12

# ── Strategy recommendation ────────────────────────────────────
def get_strategy(win_prob, rrr):
    if win_prob >= 70:
        return "Comfortable chase. Play normally, rotate strike."
    elif win_prob >= 50:
        return "Competitive chase. Accelerate from next over."
    elif win_prob >= 30:
        return "Difficult chase. Need boundaries every over."
    elif win_prob >= 15:
        return "Very hard chase. Attack from ball one."
    else:
        return "Near impossible. Maximum aggression, nothing to lose."

# ── Monte Carlo Simulation ─────────────────────────────────────
def simulate(target, overs_left, wickets_left):
    wins = 0
    total_simulations = 10000

    for _ in range(total_simulations):
        runs_scored  = 0
        wickets_lost = 0

        for over in range(overs_left):
            if wickets_lost >= wickets_left:
                break

            # Wickets in hand affect how freely team bats
            wickets_remaining = wickets_left - wickets_lost
            # Even with few wickets, in T20 batsmen go hard
            wicket_factor = 0.7 + (wickets_remaining / 5.0) * 0.6
            wicket_factor = min(wicket_factor, 1.3)

            mean = MEAN_RUNS_PER_OVER * wicket_factor
            std  = STD_RUNS_PER_OVER * 1.3  # more variance
            

            # Gamma distribution — right skewed, allows explosive overs
            # shape and scale calculated from mean and std
            shape = max((mean ** 2) / (std ** 2), 0.1)
            scale = max((std ** 2) / mean, 0.1)

            over_runs = int(np.random.gamma(shape, scale))
            over_runs = max(0, min(over_runs, 36))

            # Check if wicket falls this over
            if random.random() < WICKET_PROB:
                wickets_lost += 1
                over_runs = int(over_runs * 0.8)

            runs_scored += over_runs

            if runs_scored >= target:
                break

        if runs_scored >= target:
            wins += 1

    win_probability = round((wins / total_simulations) * 100, 2)
    rrr = round(target / overs_left, 2) if overs_left > 0 else 999
    strategy = get_strategy(win_probability, rrr)

    return {
        "win_probability": win_probability,
        "strategy": strategy,
        "required_run_rate": rrr
    }
