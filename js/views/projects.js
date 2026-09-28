import { state } from "../state.js";
import { $, esc, pDone } from "../utils.js";

export function renderProjects() {
  const { C, searchTerm } = state;

  let a = C.miniProjects.filter(
    (p) =>
      !searchTerm ||
      (
        p.title +
        " " +
        p.description +
        " " +
        (p.tagline || "") +
        " " +
        (p.stack || []).join(" ")
      )
        .toLowerCase()
        .includes(searchTerm),
  );

  $("#projectsView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">BUILD TRACK</div>
        <h1>Small projects before big projects.</h1>
        <p>${C.miniProjects.length} builds across Flutter, backend, Android, DSA, system design and production engineering. Click any project to see detailed features, architecture and deliverables.</p>
      </div>
    </div>
    <div class="project-grid">
      ${a
        .map(
          (p) => `
        <div class="project-card ${pDone(p.id) ? "project-completed" : ""}">
          <div class="project-card-header">
            <span class="tag">${esc(p.type)} · W${String(p.week).padStart(3, "0")}</span>
            <label class="project-done-toggle" title="Toggle project build completion">
              <input class="pcheck" type="checkbox" data-p="${esc(p.id)}" ${pDone(p.id) ? "checked" : ""}>
              <span>${pDone(p.id) ? "Built ✓" : "Mark Built"}</span>
            </label>
          </div>
          <h3 class="project-title-clickable project-link-trigger" data-project-id="${esc(p.id)}" title="Click to view detailed features & architecture specs">
            ${esc(p.title)} <span class="ext-icon">↗</span>
          </h3>
          <div class="project-tagline-preview">${esc(p.tagline || p.description)}</div>
          <div class="project-meta">
            ${(p.stack || []).map((s) => `<span class="topic">${esc(s)}</span>`).join("")}
          </div>
          <p class="project-outcome-text"><b>Deliverable:</b> ${esc(p.deliverable || p.outcome)}</p>
          <div class="project-card-footer">
            <button class="view-specs-btn" data-project-id="${esc(p.id)}">
              🔍 View Detailed Features & Architecture ↗
            </button>
          </div>
        </div>`,
        )
        .join("")}
    </div>`;
}
