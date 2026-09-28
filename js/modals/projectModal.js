import { state } from "../state.js";
import { $, $$, esc, pDone, saveMem } from "../utils.js";
import { openWorkspaceModal } from "./workspaceModal.js";

export function openProjectModal(id, returnToWeek = null) {
  const { C, P } = state;
  let p =
    C.miniProjects.find((x) => x.id === id) ||
    C.weeks.flatMap((w) => w.projects || []).find((x) => x.id === id);
  if (!p) return;

  state.modalProjectId = id;
  if (returnToWeek !== null) {
    state.previousModalWeekId = returnToWeek;
  }

  const pIsDone = pDone(p.id);
  const weekObj = C.weeks.find((w) => w.week === p.week);

  $("#modalRoot").innerHTML = `
    <div class="modal-backdrop" id="projectBackdrop">
      <div class="modal project-detail-modal">
        <!-- Project Modal Header -->
        <div class="modal-head">
          <div class="modal-title-group">
            <div class="modal-eyebrows">
              <span class="badge project-id-badge">PROJECT ${esc(p.id.toUpperCase())}</span>
              <span class="badge week-badge">WEEK ${String(p.week).padStart(3, "0")}</span>
              <span class="badge type-badge">${esc(p.type)} BUILD</span>
            </div>
            <h2>${esc(p.title)}</h2>
            <div class="project-tagline-hero">${esc(p.tagline || p.description)}</div>
          </div>
          <div class="modal-head-actions">
            <label class="project-done-toggle" title="Toggle project build completion">
              <input class="pcheck modal-pcheck-detail" type="checkbox" data-p="${esc(p.id)}" ${pIsDone ? "checked" : ""}>
              <span>${pIsDone ? "Built ✓" : "Mark Built"}</span>
            </label>
            <button class="modal-close" id="projectCloseBtn" title="Close (Esc)">×</button>
          </div>
        </div>

        <!-- Tech Stack Pills -->
        <div class="project-detail-stack-row">
          <span class="stack-label">TECH STACK:</span>
          <div class="topic-list">
            ${(p.stack || []).map((s) => `<span class="topic stack-pill">${esc(s)}</span>`).join("")}
          </div>
        </div>

        <!-- Section 1: Overview Description -->
        <div class="modal-section" style="margin-top:14px;padding-top:0;border-top:0">
          <div class="project-desc-callout">
            <strong>🎯 প্রজেক্টের মূল উদ্দেশ্য (Goal & Overview):</strong>
            <p>${esc(p.description)}</p>
          </div>
        </div>

        <!-- Section 2: Key Features Checklist -->
        <div class="modal-section">
          <div class="modal-section-head">
            <div>
              <h4>✨ প্রয়োজনীয় ফিচারসমূহ (Key Features & Specifications)</h4>
              <p class="modal-section-sub">এই প্রজেক্টে যে সকল ফিচার ও ফাংশনালিটি স্পষ্টভাবে ইমপ্লিমেন্ট করতে হবে:</p>
            </div>
            <span class="feature-count-badge">${(p.features || []).length} Features</span>
          </div>

          <div class="project-features-grid">
            ${(p.features || [])
              .map(
                (feat, idx) => `
              <div class="project-feature-card">
                <div class="feature-num-badge">Feature 0${idx + 1}</div>
                <div class="feature-content-wrap">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-text">${esc(feat)}</div>
                </div>
              </div>`,
              )
              .join("")}
          </div>
        </div>

        <!-- Section 3: Architecture & Structure -->
        <div class="modal-section">
          <div class="modal-section-head">
            <h4>🏗️ প্রজেক্ট আর্কিটেকচার ও কোড স্ট্রাকচার (Architecture Design)</h4>
          </div>
          <div class="arch-box">
            <div class="arch-icon">🏛️</div>
            <div class="arch-info">
              <b>Recommended Pattern / Architecture:</b>
              <p>${esc(p.architecture || "Modular Clean Architecture with separation of concerns.")}</p>
            </div>
          </div>
        </div>

        <!-- Section 4: Expected Deliverable & Outcome -->
        <div class="modal-section">
          <div class="modal-section-head">
            <h4>📦 ফাইনাল আউটপুট ও ডেলিভারেবল (Expected Deliverable)</h4>
          </div>
          <div class="deliverable-highlight-card">
            <div class="deliv-row">
              <span class="deliv-tag">🎯 Final Deliverable:</span>
              <p class="deliv-value"><b>${esc(p.deliverable || p.outcome)}</b></p>
            </div>
            <div class="deliv-row" style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)">
              <span class="deliv-tag">🌟 Demonstrable Outcome:</span>
              <p class="deliv-value">${esc(p.outcome)}</p>
            </div>
          </div>
        </div>

        <!-- Section 5: Modal Actions / Footer -->
        <div class="project-modal-footer">
          ${
            state.previousModalWeekId !== null
              ? `
            <button class="ghost footer-btn" id="backToWeekModalBtn">
              ← Back to Week W${String(state.previousModalWeekId).padStart(3, "0")} Workspace
            </button>`
              : `
            <button class="ghost footer-btn" id="jumpToWeekBtn" data-week="${p.week}">
              📅 Jump to Week W${String(p.week).padStart(3, "0")} in Planner ↗
            </button>`
          }
          <button class="primary-btn footer-btn" id="projectCloseFooterBtn">
            Done & Close ✕
          </button>
        </div>
      </div>
    </div>`;

  const closeProjectModal = () => {
    if (state.previousModalWeekId !== null) {
      const prevWeek = state.previousModalWeekId;
      state.previousModalWeekId = null;
      state.modalProjectId = null;
      openWorkspaceModal(prevWeek);
    } else {
      $("#modalRoot").innerHTML = "";
      state.modalProjectId = null;
    }
  };

  $("#projectCloseBtn").onclick = closeProjectModal;
  $("#projectCloseFooterBtn").onclick = closeProjectModal;
  $("#projectBackdrop").onclick = (e) => {
    if (e.target.id === "projectBackdrop") closeProjectModal();
  };

  if ($("#backToWeekModalBtn")) {
    $("#backToWeekModalBtn").onclick = closeProjectModal;
  }

  if ($("#jumpToWeekBtn")) {
    $("#jumpToWeekBtn").onclick = () => {
      const wNum = p.week;
      state.previousModalWeekId = null;
      state.modalProjectId = null;
      $("#modalRoot").innerHTML = "";
      state.currentView = "weeks";
      state.activePhase = "All";
      state.activeMonth = String(weekObj ? weekObj.month : "All");
      state.activeStatus = "All";
      state.searchTerm = "";

      // Dispatch global re-render
      window.dispatchEvent(new CustomEvent("roadmap:render"));
      openWorkspaceModal(wNum);
    };
  }

  $$(".modal-pcheck-detail").forEach((c) => {
    c.onchange = () => {
      state.P.projects[c.dataset.p] = c.checked;
      saveMem();
      window.dispatchEvent(new CustomEvent("roadmap:render"));
    };
  });
}
