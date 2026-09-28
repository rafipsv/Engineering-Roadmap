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

  $("#practiceView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">DSA + PROBLEM SOLVING</div>
        <h1>15 questions per topic.</h1>
        <p>Every topic has 5 Codeforces + 5 HackerRank + 5 LeetCode problems with direct links.</p>
      </div>
    </div>
    <div class="practice-layout">
      <div class="topic-menu">
        ${Object.keys(groups)
          .map(
            (t) =>
              `<button data-topic="${esc(t)}" class="${t === topic ? "active" : ""}">
                ${esc(t)} <span style="float:right">15</span>
              </button>`,
          )
          .join("")}
      </div>
      <div class="card">
        <div class="section-title">
          <h2>${esc(topic)}</h2>
          <span>5 CF + 5 HR + 5 LC</span>
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
