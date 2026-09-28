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
        <p>Saturday–Thursday study · Friday stays protected. Click any week to open its step-by-step workspace.</p>
      </div>
      <div class="filter-summary-badge">
        <span>Showing <b>${a.length}</b> weeks</span> · 
        <span><b>${completedCount}/${a.length}</b> Done (${pct(completedCount, a.length)}%)</span>
      </div>
    </div>

    <!-- Compact Modern Filter Toolbar -->
    <div class="filter-toolbar">
      <div class="filter-toolbar-grid">
        <!-- 1. Phase Dropdown -->
        <div class="toolbar-field">
          <label for="phaseSelect" class="toolbar-label">Phase</label>
          <div class="select-wrapper">
            <select id="phaseSelect" class="toolbar-select">
              <option value="All" ${activePhase === "All" ? "selected" : ""}>
                All Phases (${pct(Object.values(P.weeks || {}).filter(Boolean).length, C.weeks.length)}%)
              </option>
              ${C.phases
                .map((p) => {
                  const pWeeks = C.weeks.filter((w) => w.phase === p[0]);
                  const pDoneCount = pWeeks.filter((w) => doneW(w.week)).length;
                  const pPct = pct(pDoneCount, pWeeks.length);
                  return `<option value="${esc(p[0])}" ${activePhase === p[0] ? "selected" : ""}>
                    ${esc(p[0])} — ${pPct}% (${pDoneCount}/${pWeeks.length}w)
                  </option>`;
                })
                .join("")}
            </select>
          </div>
        </div>

        <!-- 2. Month Dropdown -->
        <div class="toolbar-field">
          <label for="monthSelect" class="toolbar-label">Month</label>
          <div class="select-wrapper">
            <select id="monthSelect" class="toolbar-select">
              ${(() => {
                const scopeWeeks =
                  activePhase === "All"
                    ? C.weeks
                    : C.weeks.filter((w) => w.phase === activePhase);
                const scopeDone = scopeWeeks.filter((w) => doneW(w.week)).length;
                const scopePct = pct(scopeDone, scopeWeeks.length);
                return `<option value="All" ${activeMonth === "All" ? "selected" : ""}>
                  All Months ${activePhase !== "All" ? `in ${esc(activePhase)}` : "(1–24)"} (${scopePct}%)
                </option>`;
              })()}
              ${availableMonths
                .map((m) => {
                  const mWeeks = C.weeks.filter((w) => w.month === m.month);
                  const mDoneCount = mWeeks.filter((w) => doneW(w.week)).length;
                  const mPct = pct(mDoneCount, mWeeks.length);
                  return `<option value="${m.month}" ${String(activeMonth) === String(m.month) ? "selected" : ""}>
                    Month ${String(m.month).padStart(2, "0")} — ${mPct}% (${mDoneCount}/${mWeeks.length}w)
                  </option>`;
                })
                .join("")}
            </select>
          </div>
        </div>

        <!-- 3. Status Dropdown -->
        <div class="toolbar-field">
          <label for="statusSelect" class="toolbar-label">Status</label>
          <div class="select-wrapper">
            <select id="statusSelect" class="toolbar-select">
              <option value="All" ${activeStatus === "All" ? "selected" : ""}>
                All Weeks (${C.weeks.length})
              </option>
              <option value="pending" ${activeStatus === "pending" ? "selected" : ""}>
                Incomplete (${C.weeks.length - Object.values(P.weeks || {}).filter(Boolean).length})
              </option>
              <option value="done" ${activeStatus === "done" ? "selected" : ""}>
                Completed (${Object.values(P.weeks || {}).filter(Boolean).length})
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
            <span class="active-tag-label">Active Filters:</span>
            ${activePhase !== "All" ? `<span class="active-filter-tag">${esc(activePhase)} <b class="tag-clear" data-clear="phase">×</b></span>` : ""}
            ${activeMonth !== "All" ? `<span class="active-filter-tag">Month ${String(activeMonth).padStart(2, "0")} <b class="tag-clear" data-clear="month">×</b></span>` : ""}
            ${activeStatus !== "All" ? `<span class="active-filter-tag">${activeStatus === "done" ? "Completed" : "Incomplete"} <b class="tag-clear" data-clear="status">×</b></span>` : ""}
            ${searchTerm ? `<span class="active-filter-tag">"${esc(searchTerm)}" <b class="tag-clear" data-clear="search">×</b></span>` : ""}
          </div>
          <button id="resetFiltersBtn" class="clear-filters-btn">✕ Reset All</button>
        </div>`
          : ""
      }
    </div>

    <!-- Clean, Breathable Week Grid -->
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
              const topicsList = w.topics.split(";").map((t) => t.trim());

              return `
              <article class="week-card ${isDone ? "done" : ""}">
                <!-- Top Badge & Completion Toggle -->
                <div class="week-card-top">
                  <div class="week-pill-group">
                    <span class="week-code">W${String(w.week).padStart(3, "0")} · M${String(w.month).padStart(2, "0")}</span>
                    <span class="category-badge ${cat.cls}">${cat.icon} ${cat.label}</span>
                  </div>
                  <label class="week-check-toggle" title="Mark week as completed">
                    <input class="check" type="checkbox" data-week="${w.week}" ${isDone ? "checked" : ""}>
                    <span class="check-label">${isDone ? "Done ✓" : "Mark done"}</span>
                  </label>
                </div>

                <!-- Clean Title & Focus Summary -->
                <div class="week-card-body">
                  <h3 class="week-card-title">${esc(w.title)}</h3>
                  <div class="week-focus-row">
                    <span class="focus-label">Focus:</span>
                    <span class="focus-val">${esc(w.focus)}</span>
                  </div>
                </div>

                <!-- Minimalist 3-Pill Glance Track (Clean, compact, non-overwhelming) -->
                <div class="week-glance-track">
                  <!-- 1. Topics pill -->
                  <div class="glance-pill" title="Topics: ${esc(w.topics)}">
                    <span class="glance-icon">📖</span>
                    <span class="glance-text">${topicsList.length} Topics</span>
                  </div>

                  <!-- 2. DSA / Practice pill -->
                  ${
                    qCount
                      ? `<div class="glance-pill ${qSolved === qCount ? "glance-done" : ""}" title="15 DSA Problems on ${esc(w.problemTopic)}">
                          <span class="glance-icon">🧩</span>
                          <span class="glance-text">${qSolved}/${qCount} DSA</span>
                        </div>`
                      : ""
                  }

                  <!-- 3. Project pill (Clickable to view specs) -->
                  ${
                    pCount
                      ? `<div class="glance-pill glance-project ${pSolved === pCount ? "glance-done" : ""}" title="Click to view project details">
                          <span class="glance-icon">🚀</span>
                          <a href="#" class="project-link-trigger glance-link" data-project-id="${esc(w.projects[0]?.id)}">
                            ${esc(w.projects[0]?.title || "Project")} ↗
                          </a>
                        </div>`
                      : ""
                  }

                  <!-- 4. Deliverable pill -->
                  <div class="glance-pill glance-deliv" title="Final Deliverable: ${esc(w.deliverable)}">
                    <span class="glance-icon">🏆</span>
                    <span class="glance-text">${esc(w.deliverable)}</span>
                  </div>
                </div>

                <!-- Card Footer: Status & Workspace Button -->
                <div class="week-card-footer">
                  <div class="card-status-info">
                    ${
                      isDone
                        ? `<span class="status-done-pill">✓ Complete</span>`
                        : `<span class="status-pending-pill">In Progress</span>`
                    }
                  </div>
                  <button class="detail-btn" data-detail="${w.week}">
                    Open Workspace ↗
                  </button>
                </div>
              </article>`;
            })
            .join("")}
        </div>`
    }
  `;
}
