import { state } from "../state.js";
import { $, esc, pct, stat, doneW } from "../utils.js";

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
    <div class="hero">
      <div>
        <div class="eyebrow">ENGINEERING SYSTEM V2</div>
        <h1>Learn it. Build it.<br>Prove it.</h1>
        <p>104 weeks, mini-projects, DSA practice and portfolio evidence. Friday remains completely protected.</p>
      </div>
      <div class="callout" style="max-width:330px">
        <strong>Next · W${String(next.week).padStart(3, "0")}</strong><br>
        ${esc(next.title)}<br>
        <span style="font-size:10px;color:var(--muted)">${esc(next.deliverable)}</span>
      </div>
    </div>
    <div class="grid stats">
      ${stat("Roadmap", pct(d, n) + "%", `${d}/${n} weeks completed`)}
      ${stat("DSA practice", pct(qd, q) + "%", `${qd}/${q} solved`)}
      ${stat("Projects", pct(pd, p) + "%", `${pd}/${p} builds done`)}
      ${stat("Friday", "OFF", "Family + personal day")}
    </div>
    <div class="grid two">
      <div class="card">
        <div class="section-title"><h2>Phase Map</h2></div>
        <div class="grid two">
          ${C.phases
            .map((x) => {
              let a = C.weeks.filter((w) => w.phase === x[0]),
                z = a.filter((w) => doneW(w.week)).length;
              return `<div class="phase-card card" style="box-shadow:none">
                <div class="phase-top">
                  <div class="phase-name">${esc(x[1])}</div>
                  <span class="badge">${esc(x[2])}</span>
                </div>
                <p>${esc(x[3])}</p>
                <div class="phase-progress-row">
                  <span>${z}/${a.length} weeks</span>
                  <span>${pct(z, a.length)}%</span>
                </div>
                <div class="progress"><i style="width:${pct(z, a.length)}%"></i></div>
              </div>`;
            })
            .join("")}
        </div>
      </div>
      <div class="card">
        <div class="section-title"><h2>Execution Rule</h2></div>
        <div class="callout">
          <strong>Topic → 15 problems → mini-project → deliverable.</strong><br>
          Don't stop at watching tutorials. Build and solve.
        </div>
        <ul style="font-size:11px;line-height:1.9;color:var(--muted);margin-top:12px">
          <li>5 Codeforces + 5 HackerRank + 5 LeetCode per DSA topic.</li>
          <li>Projects are small and focused before massive capstones.</li>
          <li>Save progress periodically to keep progress JSON safe.</li>
        </ul>
      </div>
    </div>`;
}
