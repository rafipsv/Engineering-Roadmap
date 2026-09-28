import { state } from "../state.js";
import { $, esc, qDone, getQId } from "../utils.js";

export function renderPractice() {
  const { C, activeTopic } = state;

  let groups = {};
  C.weeks
    .filter((w) => w.questions?.length)
    .forEach((w) => {
      if (!groups[w.problemTopic]) groups[w.problemTopic] = w.questions;
    });

  let topic = activeTopic || Object.keys(groups)[0],
    q = groups[topic] || [];

  const cfCount = q.filter((x) => x.platform === "Codeforces").length;
  const hrCount = q.filter((x) => x.platform === "HackerRank").length;
  const lcCount = q.filter((x) => x.platform === "LeetCode").length;

  $("#practiceView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">DSA + PROBLEM SOLVING</div>
        <h1>Tiered Practice Bank (30–100+ Problems)</h1>
        <p>Curated problem sets across 20 DSA topics — scaled strictly by complexity from foundations (30 problems) to advanced & complex topics (40 to 100 problems) on Codeforces, HackerRank, and LeetCode.</p>
      </div>
    </div>
    <div class="practice-layout">
      <div class="topic-menu">
        ${Object.keys(groups)
          .map(
            (t) =>
              `<button data-topic="${esc(t)}" class="${t === topic ? "active" : ""}">
                ${esc(t)} <span style="float:right">${(groups[t] || []).length}</span>
              </button>`,
          )
          .join("")}
      </div>
      <div class="card">
        <div class="section-title">
          <h2>${esc(topic)}</h2>
          <span>${cfCount} CF + ${hrCount} HR + ${lcCount} LC (${q.length} Problems)</span>
        </div>
        <div class="problem-grid">
          ${q
            .map((x, i) => {
              let id = getQId(topic, x.platform, i);
              return `
                <div class="problem ${qDone(id) ? "problem-done" : ""}">
                  <div class="problem-head">
                    <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.name)} ↗</a>
                    <input class="qcheck" type="checkbox" data-q="${esc(id)}" ${qDone(id) ? "checked" : ""}>
                  </div>
                  <small>${esc(x.platform)} · #${i + 1}</small>
                </div>`;
            })
            .join("")}
        </div>
      </div>
    </div>`;
}
