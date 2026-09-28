import { state } from "../state.js";
import { $, esc, doneW } from "../utils.js";

export function renderDependencies() {
  const { C } = state;

  $("#dependenciesView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">DEPENDENCIES & PREREQUISITES</div>
        <h1>Prerequisites before shortcuts.</h1>
        <p>Understand the foundations required before proceeding to subsequent topics. Click any week to inspect its full workspace.</p>
      </div>
    </div>
    
    <div class="dep-card">
      <div class="dep-table-head">
        <div>WEEK</div>
        <div>TOPIC / SYLLABUS</div>
        <div>PREREQUISITE</div>
        <div style="text-align:right">ACTION</div>
      </div>
      <div class="dep-list">
        ${C.weeks
          .map((w) => {
            const isDone = doneW(w.week);
            return `
          <div class="dependency ${isDone ? "dep-done" : ""}">
            <div>
              <span class="dep-no">W${String(w.week).padStart(3, "0")}</span>
            </div>
            <div class="dep-title-wrap">
              <span class="dep-title">${esc(w.title)}</span>
              <span class="dep-phase-tag">${esc(w.phase)} · M${String(w.month).padStart(2, "0")}</span>
            </div>
            <div class="dep-prereq">
              ${
                w.prereq === "None"
                  ? `<span class="prereq-none">None (Foundational)</span>`
                  : `<span>${esc(w.prereq)}</span>`
              }
            </div>
            <div style="text-align:right">
              <button class="dep-action-btn detail-btn" data-detail="${w.week}">
                Workspace ↗
              </button>
            </div>
          </div>`;
          })
          .join("")}
      </div>
    </div>`;
}
