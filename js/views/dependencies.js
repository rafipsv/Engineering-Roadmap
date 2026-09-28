import { state } from "../state.js";
import { $, esc } from "../utils.js";

export function renderDependencies() {
  const { C } = state;

  $("#dependenciesView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">DEPENDENCIES</div>
        <h1>Prerequisites before shortcuts.</h1>
        <p>Understand the foundations required before proceeding to subsequent topics.</p>
      </div>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <div class="dependency" style="background:var(--surface2);font-weight:800">
        <div>WEEK</div>
        <div>LEARN</div>
        <div>PREREQUISITE</div>
      </div>
      ${C.weeks
        .map(
          (w) => `
        <div class="dependency">
          <div class="dep-no">W${String(w.week).padStart(3, "0")}</div>
          <div class="dep-title">${esc(w.title)}</div>
          <div class="dep-prereq">${esc(w.prereq)}</div>
        </div>`,
        )
        .join("")}
    </div>`;
}
