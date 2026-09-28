import { state } from "./state.js";

export const $ = (s) => document.querySelector(s);
export const $$ = (s) => [...document.querySelectorAll(s)];

export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );

export const getQId = (topic, platform, i) =>
  ((topic || "") + "-" + platform + "-" + i)
    .replace(/[^a-z0-9]+/gi, "_")
    .toLowerCase();

export const getCatInfo = (cat) => {
  const c = cat || "Engineering Topic";
  if (c.includes("Flutter"))
    return { cls: "cat-flutter", icon: "📱", label: "Flutter Topic" };
  if (c.includes("DSA"))
    return { cls: "cat-dsa", icon: "🎯", label: "DSA Topic" };
  if (c.includes("Dart"))
    return { cls: "cat-dart", icon: "⚡", label: "Dart Topic" };
  if (c.includes("Backend"))
    return { cls: "cat-backend", icon: "🌐", label: "Backend Topic" };
  if (c.includes("Android"))
    return { cls: "cat-android", icon: "🤖", label: "Android Topic" };
  if (c.includes("CS Core"))
    return { cls: "cat-cscore", icon: "🖥️", label: "CS Core Topic" };
  if (c.includes("System Design"))
    return { cls: "cat-systemdesign", icon: "🏗️", label: "System Design" };
  if (c.includes("DevOps"))
    return { cls: "cat-devops", icon: "🛠️", label: "DevOps & Cloud" };
  if (c.includes("Career"))
    return { cls: "cat-career", icon: "💼", label: "Career & Interview" };
  return { cls: "cat-dart", icon: "📌", label: c };
};

export const doneW = (w) => state.P?.weeks?.[w] === true;
export const qDone = (id) => state.P?.questions?.[id] === true;
export const pDone = (id) => state.P?.projects?.[id] === true;
export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

export function saveMem() {
  localStorage.setItem("rafi-progress-session", JSON.stringify(state.P));
}

export function saveFile() {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(state.P, null, 2)], { type: "application/json" }),
  );
  a.download = "progress.json";
  a.click();
}

export function stat(a, b, c) {
  return `<div class="card stat"><div class="label">${a}</div><div class="value">${b}</div><div class="sub">${c}</div></div>`;
}
