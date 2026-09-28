import { state } from "../state.js";
import {
  $,
  $$,
  esc,
  pct,
  doneW,
  qDone,
  pDone,
  getQId,
  getCatInfo,
  saveMem,
} from "../utils.js";
import { openProjectModal } from "./projectModal.js";

export function openWorkspaceModal(id) {
  const { C, P } = state;
  let w = C.weeks.find((x) => x.week == id);
  if (!w) return;

  state.modalWeekId = id;
  const isDone = doneW(w.week);

  const qList = w.questions || [];
  const cfQuestions = [];
  const hrQuestions = [];
  const lcQuestions = [];

  qList.forEach((x, i) => {
    const qid = getQId(w.problemTopic, x.platform, i);
    const item = { ...x, qid, originalIndex: i, isDone: qDone(qid) };
    if (x.platform === "Codeforces") cfQuestions.push(item);
    else if (x.platform === "HackerRank") hrQuestions.push(item);
    else if (x.platform === "LeetCode") lcQuestions.push(item);
    else cfQuestions.push(item);
  });

  const totalQuestions = qList.length;
  const solvedQuestions = qList.filter((x, i) =>
    qDone(getQId(w.problemTopic, x.platform, i)),
  ).length;

  const cat = getCatInfo(w.category);

  $("#modalRoot").innerHTML = `
    <div class="modal-backdrop" id="back">
      <div class="modal">
        <!-- Modal Topbar -->
        <div class="modal-head">
          <div class="modal-title-group">
            <div class="modal-eyebrows">
              <span class="badge week-badge">WEEK ${String(w.week).padStart(3, "0")}</span>
              <span class="badge">MONTH ${String(w.month).padStart(2, "0")}</span>
              <span class="category-badge ${cat.cls}">${cat.icon} ${cat.label}</span>
            </div>
            <h2>${esc(w.title)}</h2>
          </div>
          <div class="modal-head-actions">
            <label class="modal-done-toggle" title="Toggle week completion">
              <input class="check modal-week-check" type="checkbox" data-week="${w.week}" ${isDone ? "checked" : ""}>
              <span>${isDone ? "Week Completed ✓" : "Mark Week Done"}</span>
            </label>
            <button class="modal-close" id="x" title="Close Workspace (Esc)">×</button>
          </div>
        </div>

        <!-- STEP 1: What to Learn -->
        <div class="modal-section" style="margin-top:14px;padding-top:0;border-top:0">
          <div class="modal-section-head">
            <h4>📖 STEP 1: কী শিখবেন (Learning Syllabus & Concepts)</h4>
          </div>
          <div class="modal-brief-grid">
            <div class="brief-card">
              <span class="brief-label">TARGET FOCUS</span>
              <p><b>${esc(w.focus)}</b></p>
            </div>
            <div class="brief-card">
              <span class="brief-label">PREREQUISITE</span>
              <p>${esc(w.prereq)}</p>
            </div>
            <div class="brief-card">
              <span class="brief-label">COVERED TOPICS</span>
              <div class="step-chips" style="margin-top:6px">
                ${w.topics
                  .split(";")
                  .map((t) => `<span class="step-chip">${esc(t.trim())}</span>`)
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- DSA Practice Section with Direct Problem Links -->
        ${
          totalQuestions > 0
            ? `
          <div class="modal-section">
            <div class="modal-section-head">
              <div>
                <h4>🧩 DSA Practice Bank: <span class="topic-highlight">${esc(w.problemTopic || "Problem Solving")}</span></h4>
                <p class="modal-section-sub">15 questions (5 Codeforces + 5 HackerRank + 5 LeetCode). Click link to solve & check the box when done.</p>
              </div>
              <div class="solved-counter-badge" id="modalSolvedCounter">
                ${solvedQuestions}/${totalQuestions} Solved (${pct(solvedQuestions, totalQuestions)}%)
              </div>
            </div>

            <!-- Platform Columns -->
            <div class="platform-groups">
              <!-- Codeforces Group -->
              <div class="platform-column cf-col">
                <div class="platform-header">
                  <span class="platform-badge cf-badge">Codeforces</span>
                  <span class="platform-count">${cfQuestions.filter((q) => q.isDone).length}/${cfQuestions.length}</span>
                </div>
                <div class="platform-problem-list">
                  ${cfQuestions
                    .map(
                      (q) => `
                    <div class="modal-problem-card ${q.isDone ? "problem-done" : ""}">
                      <label class="problem-checkbox-wrap">
                        <input class="qcheck modal-qcheck" type="checkbox" data-q="${esc(q.qid)}" ${q.isDone ? "checked" : ""}>
                      </label>
                      <div class="problem-info">
                        <a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer" class="problem-link" title="Open on Codeforces">
                          ${esc(q.name)} <span class="ext-icon">↗</span>
                        </a>
                        <span class="problem-idx">Codeforces #${q.originalIndex + 1}</span>
                      </div>
                    </div>`,
                    )
                    .join("")}
                </div>
              </div>

              <!-- HackerRank Group -->
              <div class="platform-column hr-col">
                <div class="platform-header">
                  <span class="platform-badge hr-badge">HackerRank</span>
                  <span class="platform-count">${hrQuestions.filter((q) => q.isDone).length}/${hrQuestions.length}</span>
                </div>
                <div class="platform-problem-list">
                  ${hrQuestions
                    .map(
                      (q) => `
                    <div class="modal-problem-card ${q.isDone ? "problem-done" : ""}">
                      <label class="problem-checkbox-wrap">
                        <input class="qcheck modal-qcheck" type="checkbox" data-q="${esc(q.qid)}" ${q.isDone ? "checked" : ""}>
                      </label>
                      <div class="problem-info">
                        <a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer" class="problem-link" title="Open on HackerRank">
                          ${esc(q.name)} <span class="ext-icon">↗</span>
                        </a>
                        <span class="problem-idx">HackerRank #${q.originalIndex + 1}</span>
                      </div>
                    </div>`,
                    )
                    .join("")}
                </div>
              </div>

              <!-- LeetCode Group -->
              <div class="platform-column lc-col">
                <div class="platform-header">
                  <span class="platform-badge lc-badge">LeetCode</span>
                  <span class="platform-count">${lcQuestions.filter((q) => q.isDone).length}/${lcQuestions.length}</span>
                </div>
                <div class="platform-problem-list">
                  ${lcQuestions
                    .map(
                      (q) => `
                    <div class="modal-problem-card ${q.isDone ? "problem-done" : ""}">
                      <label class="problem-checkbox-wrap">
                        <input class="qcheck modal-qcheck" type="checkbox" data-q="${esc(q.qid)}" ${q.isDone ? "checked" : ""}>
                      </label>
                      <div class="problem-info">
                        <a href="${esc(q.url)}" target="_blank" rel="noopener noreferrer" class="problem-link" title="Open on LeetCode">
                          ${esc(q.name)} <span class="ext-icon">↗</span>
                        </a>
                        <span class="problem-idx">LeetCode #${q.originalIndex + 1}</span>
                      </div>
                    </div>`,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>`
            : ""
        }

        <!-- Projects Section (Part of STEP 2) -->
        ${
          w.projects?.length
            ? `
          <div class="modal-section">
            <div class="modal-section-head">
              <div>
                <h4>🚀 STEP 2 (Continued): হ্যান্ডস-অন প্রজেক্ট (Hands-on Mini Project)</h4>
                <p class="modal-section-sub">প্রজেক্টের টাইটেলে বা বাটনে ক্লিক করে ফুল ফিচার লিস্ট ও আর্কিটেকচার স্পেকস দেখে নিন।</p>
              </div>
            </div>
            <div class="modal-project-list">
              ${w.projects
                .map((p) => {
                  const pIsDone = pDone(p.id);
                  return `
                  <div class="modal-project-card ${pIsDone ? "project-completed" : ""}">
                    <div class="modal-project-top">
                      <div>
                        <div class="modal-project-tags">
                          <span class="tag">${esc(p.type)}</span>
                          ${(p.stack || []).map((s) => `<span class="topic">${esc(s)}</span>`).join("")}
                        </div>
                        <h3 class="project-title-clickable project-link-trigger" data-project-id="${esc(p.id)}" title="Click to view detailed features & architecture specs">
                          ${esc(p.title)} <span class="ext-icon">↗</span>
                        </h3>
                      </div>
                      <label class="project-done-toggle">
                        <input class="pcheck modal-pcheck" type="checkbox" data-p="${esc(p.id)}" ${pIsDone ? "checked" : ""}>
                        <span>${pIsDone ? "Built ✓" : "Mark Built"}</span>
                      </label>
                    </div>
                    <p class="project-desc">${esc(p.tagline || p.description)}</p>
                    <div class="project-feature-bullets">
                      ${(p.features || [])
                        .slice(0, 2)
                        .map((f) => `<div class="mini-feat-item">✓ ${esc(f)}</div>`)
                        .join("")}
                    </div>
                    <div class="modal-project-actions" style="margin-top:10px;">
                      <button class="view-specs-btn" data-project-id="${esc(p.id)}">
                        🔍 View In-depth Features & Specifications ↗
                      </button>
                    </div>
                  </div>`;
                })
                .join("")}
            </div>
          </div>`
            : ""
        }

        <!-- STEP 3: Definition of Done / Deliverable -->
        <div class="modal-section">
          <div class="modal-section-head">
            <h4>🏆 STEP 3: ফাইনাল আউটপুট (Definition of Done)</h4>
          </div>
          <div class="callout" style="border-left:4px solid var(--green)">
            <strong>${esc(w.deliverable)}</strong>
            <p style="margin:4px 0 0;font-size:11px;color:var(--muted)">এই আউটপুট তৈরি হলে তবেই সপ্তাহের কাজ সম্পূর্ণ হিসেবে গণ্য হবে।</p>
          </div>
        </div>

        <!-- STEP 4: Weekly Study Rhythm -->
        <div class="modal-section">
          <div class="modal-section-head">
            <h4>📅 STEP 4: ৬-দিনের স্টাডি প্ল্যান (Saturday → Thursday · Friday OFF)</h4>
          </div>
          <div class="day-grid">
            ${["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
              .map(
                (d, i) => `
                <div class="day ${d === "Friday" ? "friday" : ""}">
                  <b>${d.slice(0, 3)}</b>
                  <small>${d === "Friday" ? "OFF" : i < 2 ? "Learn" : i < 4 ? "Build + solve" : "Review + deliver"}</small>
                </div>`,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>`;

  $("#x").onclick = () => {
    $("#modalRoot").innerHTML = "";
    state.modalWeekId = null;
    state.previousModalWeekId = null;
  };
  $("#back").onclick = (e) => {
    if (e.target.id === "back") {
      $("#modalRoot").innerHTML = "";
      state.modalWeekId = null;
      state.previousModalWeekId = null;
    }
  };

  $$(".modal-week-check").forEach((c) => {
    c.onchange = () => {
      state.P.weeks[c.dataset.week] = c.checked;
      saveMem();
      window.dispatchEvent(new CustomEvent("roadmap:render"));
    };
  });

  $$(".modal-qcheck").forEach((c) => {
    c.onchange = () => {
      state.P.questions[c.dataset.q] = c.checked;
      saveMem();
      window.dispatchEvent(new CustomEvent("roadmap:render"));
    };
  });

  $$(".modal-pcheck").forEach((c) => {
    c.onchange = () => {
      state.P.projects[c.dataset.p] = c.checked;
      saveMem();
      window.dispatchEvent(new CustomEvent("roadmap:render"));
    };
  });

  $$(".modal .project-link-trigger, .modal .view-specs-btn").forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      const pId = el.dataset.projectId;
      state.previousModalWeekId = state.modalWeekId;
      state.modalWeekId = null;
      openProjectModal(pId, state.previousModalWeekId);
    };
  });
}
