import { state } from "../state.js";
import { $, esc, pct, doneW } from "../utils.js";

export function renderRoadmap() {
  const { C, activePhase } = state;

  $("#roadmapView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">MASTER ROADMAP</div>
        <h1>24 months, with execution built in.</h1>
        <p>Month-by-month sequence with projects and practice. Click any month to view its weekly planner.</p>
      </div>
    </div>
    <div class="filters">
      ${["All", ...C.phases.map((x) => x[0])]
        .map(
          (x) =>
            `<button class="filter ${activePhase === x ? "active" : ""}" data-phase="${esc(x)}">${esc(x)}</button>`,
        )
        .join("")}
    </div>
    <div class="month-list">
      ${C.months
        .filter((m) => activePhase === "All" || m.phase === activePhase)
        .map((m) => {
          let a = C.weeks.filter((w) => w.month === m.month),
            d = a.filter((w) => doneW(w.week)).length;
          return `
            <div class="month-row" data-month="${m.month}" data-phase="${esc(m.phase)}" title="Click to open Weekly Planner for Month ${m.month}">
              <div class="month-num">M${String(m.month).padStart(2, "0")}</div>
              <div>
                <div class="month-title">${esc(m.phase)} — ${esc(m.title)}</div>
                <div class="month-sub">${esc(a[0]?.title || "")} → ${esc(a.at(-1)?.title || "")} · ${a.reduce((n, w) => n + (w.projects?.length || 0), 0)} projects</div>
              </div>
              <div class="month-progress">
                <div class="progress"><i style="width:${pct(d, a.length)}%"></i></div>
              </div>
              <div class="badge">${d}/${a.length} Weeks</div>
            </div>`;
        })
        .join("")}
    </div>`;
}
