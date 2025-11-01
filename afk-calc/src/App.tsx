import React, { useMemo, useState } from "react";

const MILESTONES = [
  { step: 1, total: 60, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 2, total: 120, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 3, total: 180, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 4, total: 240, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 5, total: 300, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 6, total: 360, reward: "Equip Chests ×2", type: "equip", amount: 2 },
  { step: 7, total: 420, reward: "Equip Chests ×2", type: "equip", amount: 2 },
  { step: 8, total: 500, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 9, total: 580, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 10, total: 660, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 11, total: 740, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 12, total: 820, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 13, total: 900, reward: "Equip Chests ×2", type: "equip", amount: 2 },
  { step: 14, total: 980, reward: "Equip Chests ×2", type: "equip", amount: 2 },
  { step: 15, total: 1080, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 16, total: 1180, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 17, total: 1280, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 18, total: 1380, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 19, total: 1480, reward: "Spirit ×1", type: "spirit", amount: 1 },
  { step: 20, total: 1580, reward: "Equip Chests ×2", type: "equip", amount: 2 }
];

const PER_SUMMON_SPIRIT_RATE = 0.02;
const DIAMONDS_PER_SUMMON = 300;
const SCROLLS_PER_SUMMON = 1;

function spiritsFromMilestones(totalSummons) {
  return MILESTONES.filter(m => m.type === "spirit" && totalSummons >= m.total).reduce((acc, m) => acc + (m.amount || 0), 0);
}

function expectedSpirits(totalSummons) {
  const milestoneSpirits = spiritsFromMilestones(totalSummons);
  const rngSpirits = totalSummons * PER_SUMMON_SPIRIT_RATE;
  return milestoneSpirits + rngSpirits;
}

function highestReachedStep(totalSummons) {
  const reached = MILESTONES.filter(m => totalSummons >= m.total);
  if (reached.length === 0) return null;
  return reached[reached.length - 1];
}

function nextStep(totalSummons) {
  return MILESTONES.find(m => totalSummons < m.total) || null;
}

function summonsNeededForTarget(targetSpirits, cap = 10000) {
  let lo = 0, hi = cap, ans = cap;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (expectedSpirits(mid) + 1e-9 >= targetSpirits) {
      ans = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return ans === cap ? NaN : ans;
}

function cls(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function App() {
  const [plannedSummons, setPlannedSummons] = useState(0);
  const [targetSpirits, setTargetSpirits] = useState(10);

  const reached = useMemo(() => highestReachedStep(plannedSummons), [plannedSummons]);
  const upcoming = useMemo(() => nextStep(plannedSummons), [plannedSummons]);

  const milestoneSpiritCount = useMemo(() => spiritsFromMilestones(plannedSummons), [plannedSummons]);
  const rngExpected = useMemo(() => plannedSummons * PER_SUMMON_SPIRIT_RATE, [plannedSummons]);
  const totalExpected = useMemo(() => milestoneSpiritCount + rngExpected, [milestoneSpiritCount, rngExpected]);

  const summonsForTarget = useMemo(() => summonsNeededForTarget(targetSpirits), [targetSpirits]);
  const targetSummons = useMemo(() => (Number.isFinite(summonsForTarget) ? Math.ceil(summonsForTarget) : 0), [summonsForTarget]);
  const targetNearestStep = useMemo(() => (targetSummons ? highestReachedStep(targetSummons) : null), [targetSummons]);

  const plannedScrollsCost = useMemo(() => plannedSummons * SCROLLS_PER_SUMMON, [plannedSummons]);
  const plannedDiamondsCost = useMemo(() => plannedSummons * DIAMONDS_PER_SUMMON, [plannedSummons]);

  const targetScrollsCost = useMemo(() => targetSummons * SCROLLS_PER_SUMMON, [targetSummons]);
  const targetDiamondsCost = useMemo(() => targetSummons * DIAMONDS_PER_SUMMON, [targetSummons]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e14] to-[#0d1218] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dimensional Spirits Calculator</h1>
            <p className="text-sm text-white/70 mt-1">AFK Arena (Companions) · 2% spirit chance per summon · 20-step milestone ladder</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-white/60">
            <span className="px-3 py-1 rounded-full bg-white/10">Spirits</span>
            <span className="px-3 py-1 rounded-full bg-white/10">Equipment</span>
            <span className="px-3 py-1 rounded-full bg-white/10">Milestones</span>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Plan by Summons</h2>
            <label className="text-sm text-white/70">How many summons will you make?</label>
            <input
              type="number"
              min={0}
              value={plannedSummons}
              onChange={(e) => setPlannedSummons(Math.max(0, Number(e.target.value)))}
              className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="e.g., 600"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Expected Spirits</div>
                <div className="text-2xl font-semibold">{totalExpected.toFixed(2)}</div>
                <div className="text-white/60">≈ {milestoneSpiritCount} from milestones + {rngExpected.toFixed(2)} RNG</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Highest Milestone Reached</div>
                <div className="text-2xl font-semibold">{reached ? `#${reached.step}` : "—"}</div>
                <div className="text-white/60">{reached ? `${reached.total} pulls` : "No milestones yet"}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-white/70">
              {upcoming ? (
                <span>Next milestone: <span className="text-white">#{upcoming.step}</span> at <span className="text-white">{upcoming.total}</span> pulls ({Math.max(upcoming.total - plannedSummons, 0)} more)</span>
              ) : (
                <span>All 20 milestones completed 🎉</span>
              )}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Plan by Target Spirits</h2>
            <label className="text-sm text-white/70">How many spirits do you want?</label>
            <input
              type="number"
              min={0}
              value={targetSpirits}
              onChange={(e) => setTargetSpirits(Math.max(0, Number(e.target.value)))}
              className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="e.g., 12"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Summons Needed (EV)</div>
                <div className="text-2xl font-semibold">{Number.isFinite(summonsForTarget) ? Math.ceil(summonsForTarget) : "—"}</div>
                <div className="text-white/60">Expected-value estimate</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Milestone at That Point</div>
                <div className="text-2xl font-semibold">{targetNearestStep ? `#${targetNearestStep.step}` : "—"}</div>
                <div className="text-white/60">{targetNearestStep ? `${targetNearestStep.total} pulls` : "—"}</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/60">Note: RNG can swing above/below the expected value. This tool uses EV for planning.</p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Cost for Planned Summons</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Destiny Scrolls</div>
                <div className="text-2xl font-semibold">{plannedScrollsCost.toLocaleString()}</div>
                <div className="text-white/60">({SCROLLS_PER_SUMMON} scroll / summon)</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Diamonds</div>
                <div className="text-2xl font-semibold">{plannedDiamondsCost.toLocaleString()}</div>
                <div className="text-white/60">({DIAMONDS_PER_SUMMON.toLocaleString()} per summon)</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Cost to Reach Target Spirits (EV)</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Required Summons (EV)</div>
                <div className="text-2xl font-semibold">{targetSummons ? targetSummons.toLocaleString() : "—"}</div>
                <div className="text-white/60">Expected value basis</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Destiny Scrolls</div>
                <div className="text-2xl font-semibold">{targetSummons ? targetScrollsCost.toLocaleString() : "—"}</div>
                <div className="text-white/60">({SCROLLS_PER_SUMMON} scroll / summon)</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-white/70">Diamonds</div>
                <div className="text-2xl font-semibold">{targetSummons ? targetDiamondsCost.toLocaleString() : "—"}</div>
                <div className="text-white/60">({DIAMONDS_PER_SUMMON.toLocaleString()} per summon)</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/60">Tip: If you have some free scrolls, subtract them from the destiny scroll total to estimate extra diamonds needed.</p>
          </div>
        </section>

        <section className="bg-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">20-Step Milestone Ladder</h2>
            <div className="text-sm text-white/70">Increment schedule: +60 → +80 → +100 (after equipment groups)</div>
          </div>
          <div className="px-5 pb-2">
            <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 text-amber-200 text-sm px-4 py-3">
              Milestone values are estimates. Until the event starts, real numbers may differ and results may vary.
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left p-3">Step</th>
                  <th className="text-left p-3">Total Summons</th>
                  <th className="text-left p-3">Reward</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {MILESTONES.map((m) => {
                  const reachedRow = plannedSummons >= m.total;
                  const nextRow = upcoming && upcoming.step === m.step;
                  return (
                    <tr key={m.step} className={cls("border-b border-white/10", reachedRow && "bg-teal-500/10", nextRow && "bg-yellow-500/10 animate-pulse")}>
                      <td className="p-3 font-semibold">#{m.step}</td>
                      <td className="p-3">{m.total.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={cls("px-2 py-1 rounded-md", m.type === "spirit" ? "bg-teal-400/20 text-teal-200" : "bg-amber-400/20 text-amber-200")}>{m.reward}</span>
                      </td>
                      <td className="p-3">
                        {reachedRow ? <span className="text-teal-300">Reached</span> : nextRow ? <span className="text-amber-300">Next up</span> : <span className="text-white/60">Locked</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="text-center text-xs text-white/50 mt-6">
          <p>Calculator uses expected value for RNG spirits (2% per summon). Verify in-game for your region’s exact event details.</p>
        </footer>
      </div>
    </div>
  );
}
