import { state } from "../state.js";
import {
  $,
  esc,
  pct,
  doneW,
  qDone,
  pDone,
  getQId,
  getCatInfo,
} from "../utils.js";

export function renderWeekly() {
  const { C, P, activePhase, activeMonth, activeStatus, searchTerm } = state;

  const phases = ["All", ...C.phases.map((x) => x[0])];
  let availableMonths = C.months;
  if (activePhase !== "All") {
    availableMonths = C.months.filter((m) => m.phase === activePhase);
  }

  let a = C.weeks;
  if (activePhase !== "All") {
    a = a.filter((w) => w.phase === activePhase);
  }
  if (activeMonth !== "All") {
    a = a.filter((w) => w.month === Number(activeMonth));
  }
  if (activeStatus === "done") {
    a = a.filter((w) => doneW(w.week));
  } else if (activeStatus === "pending") {
    a = a.filter((w) => !doneW(w.week));
  }
  if (searchTerm) {
    a = a.filter((w) =>
      (w.title + " " + w.topics + " " + w.deliverable + " " + (w.focus || ""))
        .toLowerCase()
        .includes(searchTerm),
    );
  }

  const completedCount = a.filter((w) => doneW(w.week)).length;

  $("#weeksView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">WEEKLY PLANNER</div>
        <h1>One week at a time.</h1>
        <p>Saturday–Thursday study · Friday stays protected. Click <b>Open workspace ↗</b> to view practice problems & project details.</p>
      </div>
      <div class="filter-summary-badge">
        <span>Showing <b>${a.length}</b> weeks</span> · 
        <span><b>${completedCount}/${a.length}</b> Completed (${pct(completedCount, a.length)}%)</span>
      </div>
    </div>

    <!-- Dropdown Filter Card -->
    <div class="filter-controls-card">
      <div class="filter-dropdown-grid">
        <!-- 1. Phase Dropdown with % -->
        <div class="dropdown-group">
          <label for="phaseSelect" class="dropdown-label">1. Filter by Phase</label>
          <div class="select-wrapper">
            <select id="phaseSelect" class="custom-select">
              <option value="All" ${activePhase === "All" ? "selected" : ""}>
                All Phases (${pct(Object.values(P.weeks || {}).filter(Boolean).length, C.weeks.length)}% · ${Object.values(P.weeks || {}).filter(Boolean).length}/${C.weeks.length}w)
              </option>
              ${C.phases
                .map((p) => {
                  const pWeeks = C.weeks.filter((w) => w.phase === p[0]);
                  const pDoneCount = pWeeks.filter((w) => doneW(w.week)).length;
                  const pPct = pct(pDoneCount, pWeeks.length);
                  return `<option value="${esc(p[0])}" ${activePhase === p[0] ? "selected" : ""}>
                    ${esc(p[0])}: ${esc(p[1])} — ${pPct}% (${pDoneCount}/${pWeeks.length}w)
                  </option>`;
                })
                .join("")}
            </select>
          </div>
        </div>

        <!-- 2. Month Dropdown with % -->
        <div class="dropdown-group">
          <label for="monthSelect" class="dropdown-label">2. Filter by Month</label>
          <div class="select-wrapper">
            <select id="monthSelect" class="custom-select">
              ${(() => {
                const scopeWeeks =
                  activePhase === "All"
                    ? C.weeks
                    : C.weeks.filter((w) => w.phase === activePhase);
                const scopeDone = scopeWeeks.filter((w) => doneW(w.week)).length;
                const scopePct = pct(scopeDone, scopeWeeks.length);
                return `<option value="All" ${activeMonth === "All" ? "selected" : ""}>
                  All Months ${activePhase !== "All" ? `in ${esc(activePhase)}` : "(1–24)"} — ${scopePct}% (${scopeDone}/${scopeWeeks.length}w)
                </option>`;
              })()}
              ${availableMonths
                .map((m) => {
                  const mWeeks = C.weeks.filter((w) => w.month === m.month);
                  const mDoneCount = mWeeks.filter((w) => doneW(w.week)).length;
                  const mPct = pct(mDoneCount, mWeeks.length);
                  return `<option value="${m.month}" ${String(activeMonth) === String(m.month) ? "selected" : ""}>
                    Month ${String(m.month).padStart(2, "0")} (${esc(m.phase)}) — ${mPct}% (${mDoneCount}/${mWeeks.length}w)
                  </option>`;
                })
                .join("")}
            </select>
          </div>
        </div>

        <!-- 3. Status Dropdown -->
        <div class="dropdown-group">
          <label for="statusSelect" class="dropdown-label">3. Completion Status</label>
          <div class="select-wrapper">
            <select id="statusSelect" class="custom-select">
              <option value="All" ${activeStatus === "All" ? "selected" : ""}>
                All Weeks (${Object.values(P.weeks || {}).filter(Boolean).length}/${C.weeks.length})
              </option>
              <option value="pending" ${activeStatus === "pending" ? "selected" : ""}>
                Incomplete Only (${C.weeks.length - Object.values(P.weeks || {}).filter(Boolean).length})
              </option>
              <option value="done" ${activeStatus === "done" ? "selected" : ""}>
                Completed Only (${Object.values(P.weeks || {}).filter(Boolean).length})
              </option>
            </select>
          </div>
        </div>
      </div>

      ${
        activePhase !== "All" ||
        activeMonth !== "All" ||
        activeStatus !== "All" ||
        searchTerm
          ? `
        <div class="active-filter-bar">
          <div class="active-filter-tags">
            <span class="active-tag-label">Active:</span>
            ${activePhase !== "All" ? `<span class="active-filter-tag">${esc(activePhase)} <b class="tag-clear" data-clear="phase">×</b></span>` : ""}
            ${activeMonth !== "All" ? `<span class="active-filter-tag">Month ${String(activeMonth).padStart(2, "0")} <b class="tag-clear" data-clear="month">×</b></span>` : ""}
            ${activeStatus !== "All" ? `<span class="active-filter-tag">${activeStatus === "done" ? "Completed" : "Incomplete"} <b class="tag-clear" data-clear="status">×</b></span>` : ""}
            ${searchTerm ? `<span class="active-filter-tag">Search: "${esc(searchTerm)}" <b class="tag-clear" data-clear="search">×</b></span>` : ""}
          </div>
          <button id="resetFiltersBtn" class="clear-filters-btn">✕ Reset Filters</button>
        </div>`
          : ""
      }
    </div>

    <!-- Week Grid -->
    ${
      a.length === 0
        ? `<div class="empty-card">
            <h3>No weeks found matching current filters</h3>
            <p>Try resetting filters or changing your search keyword.</p>
            <button class="ghost" id="emptyResetBtn" style="max-width:200px;margin:12px auto 0;">Reset All Filters</button>
          </div>`
        : `<div class="week-grid">
          ${a
            .map((w) => {
              const isDone = doneW(w.week);
              const qCount = w.questions?.length || 0;
              const qSolved = qCount
                ? w.questions.filter((x, i) =>
                    qDone(getQId(w.problemTopic, x.platform, i)),
                  ).length
                : 0;
              const pCount = w.projects?.length || 0;
              const pSolved = pCount
                ? w.projects.filter((p) => pDone(p.id)).length
                : 0;

              const cat = getCatInfo(w.category);

              return `
              <article class="week-card ${isDone ? "done" : ""}">
                <div class="week-head">
                  <div class="week-badges">
                    <span class="week-no">W${String(w.week).padStart(3, "0")}</span>
                    <span class="badge month-tag">M${String(w.month).padStart(2, "0")}</span>
                    <span class="category-badge ${cat.cls}">${cat.icon} ${cat.label}</span>
                  </div>
                  <label class="week-toggle-label" title="Toggle week completion">
                    <input class="check" type="checkbox" data-week="${w.week}" ${isDone ? "checked" : ""}>
                    <span class="check-text">${isDone ? "Done ✓" : "Mark done"}</span>
                  </label>
                </div>

                <h3>${esc(w.title)}</h3>
                
                <div class="card-steps-container">
                  <!-- 1. What to Learn -->
                  <div class="card-step-box">
                    <div class="step-header learn-head">
                      <span>📖 ১. কী শিখবেন (Learn)</span>
                    </div>
                    <div class="step-content">
                      <b>Focus:</b> ${esc(w.focus)}
                      <div class="step-chips">
                        ${w.topics
                          .split(";")
                          .map((t) => `<span class="step-chip">${esc(t.trim())}</span>`)
                          .join("")}
                      </div>
                    </div>
                  </div>

                  <!-- 2. What to Practice / Build -->
                  <div class="card-step-box">
                    <div class="step-header practice-head">
                      <span>🧩 ২. কী প্র্যাকটিস করবেন (Practice)</span>
                    </div>
                    <div class="step-content">
                      ${
                        qCount
                          ? `<div><b>DSA:</b> ${esc(w.problemTopic)} — 15 Problems (${qSolved}/${qCount} Solved)</div>`
                          : ""
                      }
                      ${
                        pCount
                          ? `<div><b>Project:</b> <a href="#" class="project-link-trigger" data-project-id="${esc(w.projects[0]?.id)}" title="Click to view detailed features & architecture specs">${esc(w.projects[0]?.title || "")} ↗</a> (${pSolved}/${pCount} Built)</div>`
                          : ""
                      }
                      ${
                        !qCount && !pCount
                          ? `<div>Hands-on Code Labs & Drills</div>`
                          : ""
                      }
                    </div>
                  </div>

                  <!-- 3. Deliverable -->
                  <div class="card-step-box step-deliver">
                    <div class="step-header deliver-head">
                      <span>🏆 ৩. ফাইনাল আউটপুট (Deliverable)</span>
                    </div>
                    <div class="step-content">
                      <b>${esc(w.deliverable)}</b>
                    </div>
                  </div>
                </div>

                <div class="card-progress-footer">
                  <div class="card-tags">
                    ${
                      qCount
                        ? `<span class="tag ${qSolved === qCount ? "tag-complete" : "tag-practice"}">
                            ${qSolved}/${qCount} DSA Solved
                          </span>`
                        : ""
                    }
                    ${
                      pCount
                        ? `<span class="tag ${pSolved === pCount ? "tag-complete" : "tag-project"}">
                            ${pSolved}/${pCount} Project Done
                          </span>`
                        : ""
                    }
                  </div>
                  <button class="detail-btn" data-detail="${w.week}">
                    Open workspace ↗
                  </button>
                </div>
              </article>`;
            })
            .join("")}
        </div>`
    }
  `;
}
