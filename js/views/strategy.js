import { $ } from "../utils.js";

export function renderStrategy() {
  $("#principlesView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">ENGINEERING OS</div>
        <h1>Rules that keep this sustainable.</h1>
        <p>90–120 minutes on Saturday–Thursday. Friday is protected.</p>
      </div>
    </div>
    <div class="grid two">
      <div class="card">
        <h2 style="font-size:15px">Weekly rhythm</h2>
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
        <ul style="font-size:11px;color:var(--muted);line-height:1.9;margin-top:12px">
          <li>30–45m DSA / problem solving.</li>
          <li>45–75m current topic / project build.</li>
          <li>Every week leaves demonstrable evidence.</li>
          <li>No Friday catch-up: rest is mandatory.</li>
        </ul>
      </div>
      <div class="card">
        <h2 style="font-size:15px">AI Agent Rule</h2>
        <div class="callout">
          <strong>Think → Design → Attempt → Ask AI → Review.</strong><br>
          Especially for DSA, attempt independently first before looking at hints or solutions.
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <h2 style="font-size:15px">Progress Backup & Sync</h2>
      <p class="export-note">The main source of truth is <code>data/progress.json</code>. Your progress is saved in your browser storage automatically. Use <b>Save progress.json</b> periodically to download a file backup.</p>
    </div>`;
}
