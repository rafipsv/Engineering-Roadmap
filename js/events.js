import { state } from "./state.js";
import { $, $$, saveMem, saveFile } from "./utils.js";
import { openWorkspaceModal } from "./modals/workspaceModal.js";
import { openProjectModal } from "./modals/projectModal.js";

export function bindEvents(renderCallback, statusCallback) {
  // Navigation Tabs
  $$(".nav-item").forEach(
    (b) =>
      (b.onclick = () => {
        state.currentView = b.dataset.view;
        renderCallback();
      }),
  );

  // Dropdown Filters
  if ($("#phaseSelect")) {
    $("#phaseSelect").onchange = (e) => {
      state.activePhase = e.target.value;
      state.activeMonth = "All";
      renderCallback();
    };
  }

  if ($("#monthSelect")) {
    $("#monthSelect").onchange = (e) => {
      state.activeMonth = e.target.value;
      renderCallback();
    };
  }

  if ($("#statusSelect")) {
    $("#statusSelect").onchange = (e) => {
      state.activeStatus = e.target.value;
      renderCallback();
    };
  }

  // Active Filter Clear Badges
  $$(".tag-clear").forEach((b) => {
    b.onclick = () => {
      const type = b.dataset.clear;
      if (type === "phase") state.activePhase = "All";
      if (type === "month") state.activeMonth = "All";
      if (type === "status") state.activeStatus = "All";
      if (type === "search") {
        state.searchTerm = "";
        if ($("#globalSearch")) $("#globalSearch").value = "";
      }
      renderCallback();
    };
  });

  if ($("#resetFiltersBtn")) {
    $("#resetFiltersBtn").onclick = () => {
      state.activePhase = "All";
      state.activeMonth = "All";
      state.activeStatus = "All";
      state.searchTerm = "";
      if ($("#globalSearch")) $("#globalSearch").value = "";
      renderCallback();
    };
  }

  if ($("#emptyResetBtn")) {
    $("#emptyResetBtn").onclick = () => {
      state.activePhase = "All";
      state.activeMonth = "All";
      state.activeStatus = "All";
      state.searchTerm = "";
      if ($("#globalSearch")) $("#globalSearch").value = "";
      renderCallback();
    };
  }

  // Week Checkboxes in Weekly Cards
  $$(".check:not(.modal-week-check)").forEach(
    (c) =>
      (c.onchange = () => {
        state.P.weeks[c.dataset.week] = c.checked;
        saveMem();
        renderCallback();
      }),
  );

  // Open Workspace Modal
  $$(".detail-btn").forEach(
    (b) => (b.onclick = () => openWorkspaceModal(b.dataset.detail)),
  );

  // Open Project Details Modal
  $$(".project-link-trigger, .view-specs-btn").forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      const pId = el.dataset.projectId;
      if (state.modalWeekId !== null) {
        state.previousModalWeekId = state.modalWeekId;
        state.modalWeekId = null;
      }
      openProjectModal(pId, state.previousModalWeekId);
    };
  });

  // DSA Topic Menu Buttons
  $$(".topic-menu button").forEach(
    (b) =>
      (b.onclick = () => {
        state.activeTopic = b.dataset.topic;
        renderCallback();
      }),
  );

  // DSA Question Checkboxes
  $$(".qcheck:not(.modal-qcheck)").forEach(
    (c) =>
      (c.onchange = () => {
        state.P.questions[c.dataset.q] = c.checked;
        saveMem();
        if (statusCallback) statusCallback();
      }),
  );

  // Project Completion Checkboxes
  $$(".pcheck:not(.modal-pcheck):not(.modal-pcheck-detail)").forEach(
    (c) =>
      (c.onchange = () => {
        state.P.projects[c.dataset.p] = c.checked;
        saveMem();
        renderCallback();
      }),
  );

  // Month Rows in 24-Month Roadmap
  $$(".month-row").forEach(
    (r) =>
      (r.onclick = () => {
        if (r.dataset.month) {
          state.activeMonth = r.dataset.month;
          if (r.dataset.phase) state.activePhase = r.dataset.phase;
        }
        state.currentView = "weeks";
        renderCallback();
      }),
  );

  // Progress Backup & Import
  if ($("#saveBtn")) $("#saveBtn").onclick = saveFile;
  if ($("#importBtn")) $("#importBtn").onclick = () => $("#importFile")?.click();
  if ($("#importFile"))
    $("#importFile").onchange = async (e) => {
      let f = e.target.files[0];
      if (!f) return;
      try {
        state.P = JSON.parse(await f.text());
        saveMem();
        renderCallback();
      } catch {
        alert("Invalid progress.json");
      }
    };

  // Reset Progress
  if ($("#resetProgress"))
    $("#resetProgress").onclick = () => {
      if (confirm("Are you sure you want to reset all progress?")) {
        state.P = {
          version: 2,
          weeks: {},
          questions: {},
          projects: {},
          notes: {},
          settings: { theme: state.P.settings?.theme || "dark" },
        };
        localStorage.removeItem("rafi-progress-session");
        renderCallback();
      }
    };

  // Theme Toggle
  if ($("#themeBtn"))
    $("#themeBtn").onclick = () => {
      state.P.settings.theme =
        state.P.settings.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = state.P.settings.theme;
      saveMem();
      renderCallback();
    };

  // Global Search
  if ($("#globalSearch"))
    $("#globalSearch").oninput = (e) => {
      state.searchTerm = e.target.value.toLowerCase();
      state.currentView = ["projects", "practice", "weeks"].includes(
        state.currentView,
      )
        ? state.currentView
        : "weeks";
      renderCallback();
    };

  // Mobile Menu
  if ($("#menuBtn"))
    $("#menuBtn").onclick = () => $("#sidebar").classList.toggle("open");
}

export function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.modalProjectId !== null) {
        if (state.previousModalWeekId !== null) {
          const prev = state.previousModalWeekId;
          state.previousModalWeekId = null;
          state.modalProjectId = null;
          openWorkspaceModal(prev);
        } else {
          $("#modalRoot").innerHTML = "";
          state.modalProjectId = null;
        }
      } else if (state.modalWeekId !== null) {
        $("#modalRoot").innerHTML = "";
        state.modalWeekId = null;
        state.previousModalWeekId = null;
      }
    }
  });
}
