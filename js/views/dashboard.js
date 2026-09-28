import { state } from "../state.js";
import { $, esc, pct, doneW } from "../utils.js";

export function renderDashboard() {
  const { C, P } = state;
  let d = Object.values(P.weeks || {}).filter(Boolean).length,
    n = C.weeks.length,
    q = C.weeks.reduce((x, w) => x + (w.questions?.length || 0), 0),
    qd = Object.values(P.questions || {}).filter(Boolean).length,
    p = C.miniProjects.length,
    pd = Object.values(P.projects || {}).filter(Boolean).length,
    next = C.weeks.find((w) => !doneW(w.week)) || C.weeks.at(-1);

  $("#dashboardView").innerHTML = `
    <!-- Hero Section -->
    <div class="hero dashboard-hero">
      <div>
        <div class="eyebrow">ENGINEERING SYSTEM V2</div>
        <h1>Learn it. Build it.<br>Prove it.</h1>
        <p>104 weeks of structured engineering mastery. Mini-projects, DSA practice banks, and demonstrable portfolio evidence with protected Friday rest.</p>
      </div>
      <div class="next-target-card">
        <div class="next-target-badge">CURRENT TARGET · W${String(next.week).padStart(3, "0")}</div>
        <div class="next-target-title">${esc(next.title)}</div>
        <div class="next-target-sub"><b>Deliverable:</b> ${esc(next.deliverable)}</div>
        <button class="next-target-btn detail-btn" data-detail="${next.week}">
          Open Workspace W${String(next.week).padStart(3, "0")} ↗
        </button>
      </div>
    </div>

    <!-- Stats Grid (4 Clean Cards) -->
    <div class="grid stats dashboard-stats">
      <div class="card stat-card">
        <div class="stat-top">
          <span class="stat-label">ROADMAP PROGRESS</span>
          <span class="stat-badge">${pct(d, n)}%</span>
        </div>
        <div class="stat-value">${d}<span class="stat-total">/${n} w</span></div>
        <div class="progress stat-progress"><i style="width:${pct(d, n)}%"></i></div>
        <div class="stat-sub">${d} weeks completed out of 104</div>
      </div>

      <div class="card stat-card">
        <div class="stat-top">
          <span class="stat-label">DSA PRACTICE</span>
          <span class="stat-badge stat-badge-orange">${pct(qd, q)}%</span>
        </div>
        <div class="stat-value">${qd}<span class="stat-total">/${q}</span></div>
        <div class="progress stat-progress"><i style="width:${pct(qd, q)}%;background:linear-gradient(90deg, var(--orange), #fbbf24)"></i></div>
        <div class="stat-sub">${qd} solved across CF, HR & LC</div>
      </div>

      <div class="card stat-card">
        <div class="stat-top">
          <span class="stat-label">PROJECT BUILDS</span>
          <span class="stat-badge stat-badge-green">${pct(pd, p)}%</span>
        </div>
        <div class="stat-value">${pd}<span class="stat-total">/${p}</span></div>
        <div class="progress stat-progress"><i style="width:${pct(pd, p)}%;background:linear-gradient(90deg, var(--green), #34d399)"></i></div>
        <div class="stat-sub">${pd} demonstrable builds done</div>
      </div>

      <div class="card stat-card stat-card-rest">
        <div class="stat-top">
          <span class="stat-label">FRIDAY REST</span>
          <span class="stat-badge stat-badge-rest">PROTECTED</span>
        </div>
        <div class="stat-value text-green">OFF DAY</div>
        <div class="stat-sub" style="margin-top:12px">No study tasks. Dedicated to family, health and recovery.</div>
      </div>
    </div>

    <!-- Phase Journey Map (Full Width Grid) -->
    <div class="dashboard-section">
      <div class="section-head">
        <div>
          <h2>🗺️ Phase Roadmap Journey</h2>
          <p class="section-sub">8 progressive phases taking you from fundamentals to production software engineer.</p>
        </div>
        <span class="badge">8 Phases · 24 Months</span>
      </div>

      <div class="phase-grid">
        ${C.phases
          .map((x) => {
            let a = C.weeks.filter((w) => w.phase === x[0]),
              z = a.filter((w) => doneW(w.week)).length,
              pPercent = pct(z, a.length);
            return `
            <div class="phase-card card ${z === a.length ? "phase-completed" : ""}" data-phase-filter="${esc(x[0])}" title="Click to view ${esc(x[0])} in Weekly Planner">
              <div class="phase-top">
                <span class="phase-id-pill">${esc(x[0])}</span>
                <span class="phase-duration-badge">${esc(x[2])}</span>
              </div>
              <h3 class="phase-name">${esc(x[1])}</h3>
              <p class="phase-desc">${esc(x[3])}</p>
              <div class="phase-bottom">
                <div class="phase-progress-row">
                  <span class="phase-weeks-count">${z}/${a.length} Weeks</span>
                  <span class="phase-pct-badge">${pPercent}%</span>
                </div>
                <div class="progress phase-progress-bar"><i style="width:${pPercent}%"></i></div>
              </div>
            </div>`;
          })
          .join("")}
      </div>
    </div>

    <!-- Bottom Two Column Section -->
    <div class="grid two dashboard-bottom-grid">
      <!-- 1. Execution Rule -->
      <div class="card exec-card">
        <div class="section-title">
          <h2>⚡ The Execution Formula</h2>
        </div>
        <div class="callout exec-callout">
          <strong>Topic → Progressive Problem Bank (30–100+ Problems) → Mini-Project → Demonstrable Deliverable.</strong>
          <p>Don't stop at watching videos. Real engineering skill comes from solving and shipping.</p>
        </div>
        <div class="exec-steps">
          <div class="exec-step-item">
            <span class="exec-icon">🎯</span>
            <div>
              <b>Deep Understanding:</b> Study core concepts on Saturday–Sunday with zero shortcuts.
            </div>
          </div>
          <div class="exec-step-item">
            <span class="exec-icon">🧩</span>
            <div>
              <b>Rigorous Problem Solving:</b> Scaled problem banks (30 to 100+ problems per topic) across Codeforces, HackerRank & LeetCode.
            </div>
          </div>
          <div class="exec-step-item">
            <span class="exec-icon">🚀</span>
            <div>
              <b>Evidence-Based Output:</b> Every single month leaves demonstrable working code in your portfolio.
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Weekly Rhythm -->
      <div class="card rhythm-card">
        <div class="section-title">
          <h2>📅 Weekly Rhythm & Schedule</h2>
        </div>
        <div class="day-grid">
          ${["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            .map(
              (x) => `
            <div class="day ${x === "Friday" ? "friday" : ""}">
              <b>${x.slice(0, 3)}</b>
              <small>${x === "Friday" ? "OFF" : "90–120m"}</small>
            </div>`,
            )
            .join("")}
        </div>
        <div class="rhythm-guidelines">
          <div class="rhythm-item">
            <span class="dot-bullet"></span>
            <span><b>30–45m daily:</b> Focused DSA / problem solving.</span>
          </div>
          <div class="rhythm-item">
            <span class="dot-bullet"></span>
            <span><b>45–75m daily:</b> Current tech stack / project architecture.</span>
          </div>
          <div class="rhythm-item">
            <span class="dot-bullet"></span>
            <span><b>Mandatory Rest:</b> Friday has zero study tasks — family, recharge & life balance.</span>
          </div>
        </div>
      </div>
    </div>`;
}
