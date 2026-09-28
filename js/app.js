import { state, setC, setP } from "./state.js";
import { esc, $ } from "./utils.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderRoadmap } from "./views/roadmap.js";
import { renderWeekly } from "./views/weekly.js";
import { renderPractice } from "./views/practice.js";
import { renderProjects } from "./views/projects.js";
import { renderDependencies } from "./views/dependencies.js";
import { renderStrategy } from "./views/strategy.js";
import { openWorkspaceModal } from "./modals/workspaceModal.js";
import { openProjectModal } from "./modals/projectModal.js";
import { bindEvents, initKeyboard } from "./events.js";

export function apply() {
  const map = {
    dashboard: "Dashboard",
    roadmap: "24-Month Roadmap",
    weeks: "Weekly Planner",
    practice: "DSA Practice",
    projects: "Projects",
    dependencies: "Dependencies",
    principles: "Rules & Strategy",
  };
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  $(`#${state.currentView}View`)?.classList.add("active");
  if ($("#crumb")) $("#crumb").textContent = map[state.currentView] || "Dashboard";
  document.querySelectorAll(".nav-item").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === state.currentView),
  );
}

export function status() {
  if ($("#storageStatus") && state.C && state.P) {
    const completedWeeks = Object.values(state.P.weeks || {}).filter(Boolean).length;
    $("#storageStatus").textContent = `Progress: ${completedWeeks}/${state.C.weeks.length} weeks`;
  }
}

export function render() {
  if (!state.C || !state.P) return;

  renderDashboard();
  renderRoadmap();
  renderWeekly();
  renderPractice();
  renderProjects();
  renderDependencies();
  renderStrategy();
  apply();
  bindEvents(render, status);
  status();

  if (state.modalProjectId !== null) {
    openProjectModal(state.modalProjectId, state.previousModalWeekId);
  } else if (state.modalWeekId !== null) {
    openWorkspaceModal(state.modalWeekId);
  }
}

export async function boot() {
  try {
    const [a, b] = await Promise.all([
      fetch("data/curriculum.json?" + Date.now()),
      fetch("data/progress.json?" + Date.now()),
    ]);
    if (!a.ok || !b.ok) throw Error("JSON files unavailable");
    const curriculumData = await a.json();
    let progressData = await b.json();

    const saved = localStorage.getItem("rafi-progress-session");
    if (saved) {
      try {
        const sp = JSON.parse(saved);
        if (sp && typeof sp === "object") {
          progressData = Object.assign(progressData, sp);
        }
      } catch (err) {}
    }

    setC(curriculumData);
    setP(progressData);

    document.documentElement.dataset.theme = progressData.settings?.theme || "dark";
    render();
  } catch (e) {
    console.error("Boot error:", e);
    document.body.innerHTML =
      '<div style="padding:40px;font:14px Inter">Open this folder with VS Code Live Server or another local HTTP server. The app needs to fetch <b>data/curriculum.json</b> and <b>data/progress.json</b>.<br><br><span style="color:red;font-size:12px">' +
      esc(e.message) +
      "</span></div>";
  }
}

window.addEventListener("roadmap:render", () => render());

initKeyboard();
boot();
