let C = null,
  P = null,
  currentView = "dashboard",
  activePhase = "All",
  activeMonth = "All",
  activeStatus = "All",
  activeTopic = null,
  searchTerm = "",
  modalWeekId = null;

const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];

async function boot() {
  try {
    let [a, b] = await Promise.all([
      fetch("data/curriculum.json?" + Date.now()),
      fetch("data/progress.json?" + Date.now()),
    ]);
    if (!a.ok || !b.ok) throw Error("JSON files unavailable");
    C = await a.json();
    P = await b.json();
    let saved = localStorage.getItem("rafi-progress-session");
    if (saved) {
      try {
        let sp = JSON.parse(saved);
        if (sp && typeof sp === "object") P = Object.assign(P, sp);
      } catch (err) {}
    }
    document.documentElement.dataset.theme = P.settings?.theme || "dark";
    render();
  } catch (e) {
    console.error("Boot error:", e);
    document.body.innerHTML =
      '<div style="padding:40px;font:14px Inter">Open this folder with VS Code Live Server or another local HTTP server. The app needs to fetch <b>data/curriculum.json</b> and <b>data/progress.json</b>.<br><br><span style="color:red;font-size:12px">' +
      esc(e.message) +
      "</span></div>";
  }
}

const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );

const getQId = (topic, platform, i) =>
  ((topic || "") + "-" + platform + "-" + i)
    .replace(/[^a-z0-9]+/gi, "_")
    .toLowerCase();

const getCatInfo = (cat) => {
  const c = cat || "Engineering Topic";
  if (c.includes("Flutter")) return { cls: "cat-flutter", icon: "📱", label: "Flutter Topic" };
  if (c.includes("DSA")) return { cls: "cat-dsa", icon: "🎯", label: "DSA Topic" };
  if (c.includes("Dart")) return { cls: "cat-dart", icon: "⚡", label: "Dart Topic" };
  if (c.includes("Backend")) return { cls: "cat-backend", icon: "🌐", label: "Backend Topic" };
  if (c.includes("Android")) return { cls: "cat-android", icon: "🤖", label: "Android Topic" };
  if (c.includes("CS Core")) return { cls: "cat-cscore", icon: "🖥️", label: "CS Core Topic" };
  if (c.includes("System Design")) return { cls: "cat-systemdesign", icon: "🏗️", label: "System Design" };
  if (c.includes("DevOps")) return { cls: "cat-devops", icon: "🛠️", label: "DevOps & Cloud" };
  if (c.includes("Career")) return { cls: "cat-career", icon: "💼", label: "Career & Interview" };
  return { cls: "cat-dart", icon: "📌", label: c };
};

const doneW = (w) => P.weeks?.[w] === true,
  qDone = (id) => P.questions?.[id] === true,
  pDone = (id) => P.projects?.[id] === true;
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

function saveMem() {
  localStorage.setItem("rafi-progress-session", JSON.stringify(P));
}

function saveFile() {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(P, null, 2)], { type: "application/json" }),
  );
  a.download = "progress.json";
  a.click();
}

function render() {
  dashboard();
  roadmap();
  weekly();
  practice();
  projects();
  dependencies();
  strategy();
  apply();
  bind();
  status();
  if (modalWeekId !== null) {
    modal(modalWeekId);
  }
}

function stat(a, b, c) {
  return `<div class="card stat"><div class="label">${a}</div><div class="value">${b}</div><div class="sub">${c}</div></div>`;
}

function dashboard() {
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

function roadmap() {
  $("#roadmapView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">MASTER ROADMAP</div>
        <h1>24 months, with execution built in.</h1>
        <p>Month-by-month sequence with projects and practice. Click any month to view its weekly planner.</p>
      </div>
    </div>
    <div class="filters">
      ${["All", ...C.phases.map((x) => x[0])]
        .map(
          (x) =>
            `<button class="filter ${activePhase === x ? "active" : ""}" data-phase="${esc(x)}">${esc(x)}</button>`,
        )
        .join("")}
    </div>
    <div class="month-list">
      ${C.months
        .filter((m) => activePhase === "All" || m.phase === activePhase)
        .map((m) => {
          let a = C.weeks.filter((w) => w.month === m.month),
            d = a.filter((w) => doneW(w.week)).length;
          return `
            <div class="month-row" data-month="${m.month}" data-phase="${esc(m.phase)}" title="Click to open Weekly Planner for Month ${m.month}">
              <div class="month-num">M${String(m.month).padStart(2, "0")}</div>
              <div>
                <div class="month-title">${esc(m.phase)} — ${esc(m.title)}</div>
                <div class="month-sub">${esc(a[0]?.title || "")} → ${esc(a.at(-1)?.title || "")} · ${a.reduce((n, w) => n + (w.projects?.length || 0), 0)} projects</div>
              </div>
              <div class="month-progress">
                <div class="progress"><i style="width:${pct(d, a.length)}%"></i></div>
              </div>
              <div class="badge">${d}/${a.length} Weeks</div>
            </div>`;
        })
        .join("")}
    </div>`;
}

function weekly() {
  const phases = ["All", ...C.phases.map((x) => x[0])];
  let availableMonths = C.months;
  if (activePhase !== "All") {
    availableMonths = C.months.filter((m) => m.phase === activePhase);
  }

  let a = C.weeks;
  if (activePhase !== "All") {
    a = a.filter((w) => w.phase === activePhase);
  }
  if (activeMonth !== "All") {
    a = a.filter((w) => w.month === Number(activeMonth));
  }
  if (activeStatus === "done") {
    a = a.filter((w) => doneW(w.week));
  } else if (activeStatus === "pending") {
    a = a.filter((w) => !doneW(w.week));
  }
  if (searchTerm) {
    a = a.filter((w) =>
      (w.title + " " + w.topics + " " + w.deliverable + " " + (w.focus || ""))
        .toLowerCase()
        .includes(searchTerm),
    );
  }

  const completedCount = a.filter((w) => doneW(w.week)).length;

  $("#weeksView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">WEEKLY PLANNER</div>
        <h1>One week at a time.</h1>
        <p>Saturday–Thursday study · Friday stays protected. Click <b>Open workspace ↗</b> to view practice problems & project details.</p>
      </div>
      <div class="filter-summary-badge">
        <span>Showing <b>${a.length}</b> weeks</span> · 
        <span><b>${completedCount}/${a.length}</b> Completed (${pct(completedCount, a.length)}%)</span>
      </div>
    </div>

    <!-- Dropdown Filter Card -->
    <div class="filter-controls-card">
      <div class="filter-dropdown-grid">
        <!-- 1. Phase Dropdown with % -->
        <div class="dropdown-group">
          <label for="phaseSelect" class="dropdown-label">1. Filter by Phase</label>
          <div class="select-wrapper">
            <select id="phaseSelect" class="custom-select">
              <option value="All" ${activePhase === "All" ? "selected" : ""}>
                All Phases (${pct(Object.values(P.weeks || {}).filter(Boolean).length, C.weeks.length)}% · ${Object.values(P.weeks || {}).filter(Boolean).length}/${C.weeks.length}w)
              </option>
              ${C.phases
                .map((p) => {
                  const pWeeks = C.weeks.filter((w) => w.phase === p[0]);
                  const pDoneCount = pWeeks.filter((w) => doneW(w.week)).length;
                  const pPct = pct(pDoneCount, pWeeks.length);
                  return `<option value="${esc(p[0])}" ${activePhase === p[0] ? "selected" : ""}>
                    ${esc(p[0])}: ${esc(p[1])} — ${pPct}% (${pDoneCount}/${pWeeks.length}w)
                  </option>`;
                })
                .join("")}
            </select>
          </div>
        </div>

        <!-- 2. Month Dropdown with % -->
        <div class="dropdown-group">
          <label for="monthSelect" class="dropdown-label">2. Filter by Month</label>
          <div class="select-wrapper">
            <select id="monthSelect" class="custom-select">
              ${(() => {
                const scopeWeeks =
                  activePhase === "All"
                    ? C.weeks
                    : C.weeks.filter((w) => w.phase === activePhase);
                const scopeDone = scopeWeeks.filter((w) => doneW(w.week)).length;
                const scopePct = pct(scopeDone, scopeWeeks.length);
                return `<option value="All" ${activeMonth === "All" ? "selected" : ""}>
                  All Months ${activePhase !== "All" ? `in ${esc(activePhase)}` : "(1–24)"} — ${scopePct}% (${scopeDone}/${scopeWeeks.length}w)
                </option>`;
              })()}
              ${availableMonths
                .map((m) => {
                  const mWeeks = C.weeks.filter((w) => w.month === m.month);
                  const mDoneCount = mWeeks.filter((w) => doneW(w.week)).length;
                  const mPct = pct(mDoneCount, mWeeks.length);
                  return `<option value="${m.month}" ${String(activeMonth) === String(m.month) ? "selected" : ""}>
                    Month ${String(m.month).padStart(2, "0")} (${esc(m.phase)}) — ${mPct}% (${mDoneCount}/${mWeeks.length}w)
                  </option>`;
                })
                .join("")}
            </select>
          </div>
        </div>

        <!-- 3. Status Dropdown -->
        <div class="dropdown-group">
          <label for="statusSelect" class="dropdown-label">3. Completion Status</label>
          <div class="select-wrapper">
            <select id="statusSelect" class="custom-select">
              <option value="All" ${activeStatus === "All" ? "selected" : ""}>
                All Weeks (${Object.values(P.weeks || {}).filter(Boolean).length}/${C.weeks.length})
              </option>
              <option value="pending" ${activeStatus === "pending" ? "selected" : ""}>
                Incomplete Only (${C.weeks.length - Object.values(P.weeks || {}).filter(Boolean).length})
              </option>
              <option value="done" ${activeStatus === "done" ? "selected" : ""}>
                Completed Only (${Object.values(P.weeks || {}).filter(Boolean).length})
              </option>
            </select>
          </div>
        </div>
      </div>

      ${
        activePhase !== "All" ||
        activeMonth !== "All" ||
        activeStatus !== "All" ||
        searchTerm
          ? `
        <div class="active-filter-bar">
          <div class="active-filter-tags">
            <span class="active-tag-label">Active:</span>
            ${activePhase !== "All" ? `<span class="active-filter-tag">${esc(activePhase)} <b class="tag-clear" data-clear="phase">×</b></span>` : ""}
            ${activeMonth !== "All" ? `<span class="active-filter-tag">Month ${String(activeMonth).padStart(2, "0")} <b class="tag-clear" data-clear="month">×</b></span>` : ""}
            ${activeStatus !== "All" ? `<span class="active-filter-tag">${activeStatus === "done" ? "Completed" : "Incomplete"} <b class="tag-clear" data-clear="status">×</b></span>` : ""}
            ${searchTerm ? `<span class="active-filter-tag">Search: "${esc(searchTerm)}" <b class="tag-clear" data-clear="search">×</b></span>` : ""}
          </div>
          <button id="resetFiltersBtn" class="clear-filters-btn">✕ Reset Filters</button>
        </div>`
          : ""
      }
    </div>

    <!-- Week Grid -->
    ${
      a.length === 0
        ? `<div class="empty-card">
            <h3>No weeks found matching current filters</h3>
            <p>Try resetting filters or changing your search keyword.</p>
            <button class="ghost" id="emptyResetBtn" style="max-width:200px;margin:12px auto 0;">Reset All Filters</button>
          </div>`
        : `<div class="week-grid">
          ${a
            .map((w) => {
              const isDone = doneW(w.week);
              const qCount = w.questions?.length || 0;
              const qSolved = qCount
                ? w.questions.filter((x, i) =>
                    qDone(getQId(w.problemTopic, x.platform, i)),
                  ).length
                : 0;
              const pCount = w.projects?.length || 0;
              const pSolved = pCount
                ? w.projects.filter((p) => pDone(p.id)).length
                : 0;

              const cat = getCatInfo(w.category);

              return `
              <article class="week-card ${isDone ? "done" : ""}">
                <div class="week-head">
                  <div class="week-badges">
                    <span class="week-no">W${String(w.week).padStart(3, "0")}</span>
                    <span class="badge month-tag">M${String(w.month).padStart(2, "0")}</span>
                    <span class="category-badge ${cat.cls}">${cat.icon} ${cat.label}</span>
                  </div>
                  <label class="week-toggle-label" title="Toggle week completion">
                    <input class="check" type="checkbox" data-week="${w.week}" ${isDone ? "checked" : ""}>
                    <span class="check-text">${isDone ? "Done ✓" : "Mark done"}</span>
                  </label>
                </div>

                <h3>${esc(w.title)}</h3>
                
                <div class="card-steps-container">
                  <!-- 1. What to Learn -->
                  <div class="card-step-box">
                    <div class="step-header learn-head">
                      <span>📖 ১. কী শিখবেন (Learn)</span>
                    </div>
                    <div class="step-content">
                      <b>Focus:</b> ${esc(w.focus)}
                      <div class="step-chips">
                        ${w.topics
                          .split(";")
                          .map((t) => `<span class="step-chip">${esc(t.trim())}</span>`)
                          .join("")}
                      </div>
                    </div>
                  </div>

                  <!-- 2. What to Practice / Build -->
                  <div class="card-step-box">
                    <div class="step-header practice-head">
                      <span>🧩 ২. কী প্র্যাকটিস করবেন (Practice)</span>
                    </div>
                    <div class="step-content">
                      ${
                        qCount
                          ? `<div><b>DSA:</b> ${esc(w.problemTopic)} — 15 Problems (${qSolved}/${qCount} Solved)</div>`
                          : ""
                      }
                      ${
                        pCount
                          ? `<div><b>Project:</b> ${esc(w.projects[0]?.title || "")} (${pSolved}/${pCount} Built)</div>`
                          : ""
                      }
                      ${
                        !qCount && !pCount
                          ? `<div>Hands-on Code Labs & Drills</div>`
                          : ""
                      }
                    </div>
                  </div>

                  <!-- 3. Deliverable -->
                  <div class="card-step-box step-deliver">
                    <div class="step-header deliver-head">
                      <span>🏆 ৩. ফাইনাল আউটপুট (Deliverable)</span>
                    </div>
                    <div class="step-content">
                      <b>${esc(w.deliverable)}</b>
                    </div>
                  </div>
                </div>

                <div class="card-progress-footer">
                  <div class="card-tags">
                    ${
                      qCount
                        ? `<span class="tag ${qSolved === qCount ? "tag-complete" : "tag-practice"}">
                            ${qSolved}/${qCount} DSA Solved
                          </span>`
                        : ""
                    }
                    ${
                      pCount
                        ? `<span class="tag ${pSolved === pCount ? "tag-complete" : "tag-project"}">
                            ${pSolved}/${pCount} Project Done
                          </span>`
                        : ""
                    }
                  </div>
                  <button class="detail-btn" data-detail="${w.week}">
                    Open workspace ↗
                  </button>
                </div>
              </article>`;
            })
            .join("")}
        </div>`
    }
  `;
}

function practice() {
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

function projects() {
  let a = C.miniProjects.filter(
    (p) =>
      !searchTerm ||
      (p.title + " " + p.description + " " + p.stack.join(" "))
        .toLowerCase()
        .includes(searchTerm),
  );

  $("#projectsView").innerHTML = `
    <div class="hero">
      <div>
        <div class="eyebrow">BUILD TRACK</div>
        <h1>Small projects before big projects.</h1>
        <p>${C.miniProjects.length} builds across Flutter, backend, Android, DSA, system design and production engineering.</p>
      </div>
    </div>
    <div class="project-grid">
      ${a
        .map(
          (p) => `
        <div class="project-card ${pDone(p.id) ? "project-completed" : ""}">
          <span class="tag">${esc(p.type)} · W${String(p.week).padStart(3, "0")}</span>
          <h3>${esc(p.title)}</h3>
          <div class="project-meta">
            ${p.stack.map((s) => `<span class="topic">${esc(s)}</span>`).join("")}
          </div>
          <p>${esc(p.description)}<br><br><b>Outcome:</b> ${esc(p.outcome)}</p>
          <div class="project-actions">
            <input class="pcheck" type="checkbox" data-p="${esc(p.id)}" ${pDone(p.id) ? "checked" : ""}>
            <label>Completed</label>
          </div>
        </div>`,
        )
        .join("")}
    </div>`;
}

function dependencies() {
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

function strategy() {
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

function apply() {
  let map = {
    dashboard: "Dashboard",
    roadmap: "24-Month Roadmap",
    weeks: "Weekly Planner",
    practice: "DSA Practice",
    projects: "Projects",
    dependencies: "Dependencies",
    principles: "Rules & Strategy",
  };
  $$(".view").forEach((v) => v.classList.remove("active"));
  $(`#${currentView}View`)?.classList.add("active");
  if ($("#crumb")) $("#crumb").textContent = map[currentView] || "Dashboard";
  $$(".nav-item").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === currentView),
  );
}

function status() {
  if ($("#storageStatus")) {
    const completedWeeks = Object.values(P.weeks || {}).filter(Boolean).length;
    $("#storageStatus").textContent = `Progress: ${completedWeeks}/${C.weeks.length} weeks`;
  }
}

function modal(id) {
  let w = C.weeks.find((x) => x.week == id);
  if (!w) return;
  modalWeekId = id;
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
              <h4>🚀 STEP 2 (Continued): হ্যান্ডস-অন প্রজেক্ট (Hands-on Mini Project)</h4>
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
                        <h3>${esc(p.title)}</h3>
                      </div>
                      <label class="project-done-toggle">
                        <input class="pcheck modal-pcheck" type="checkbox" data-p="${esc(p.id)}" ${pIsDone ? "checked" : ""}>
                        <span>${pIsDone ? "Built ✓" : "Mark Built"}</span>
                      </label>
                    </div>
                    <p class="project-desc">${esc(p.description)}</p>
                    <div class="project-outcome-box">
                      <b>Demonstrable Outcome:</b> ${esc(p.outcome)}
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
    modalWeekId = null;
  };
  $("#back").onclick = (e) => {
    if (e.target.id === "back") {
      $("#modalRoot").innerHTML = "";
      modalWeekId = null;
    }
  };

  $$(".modal-week-check").forEach((c) => {
    c.onchange = () => {
      P.weeks[c.dataset.week] = c.checked;
      saveMem();
      render();
    };
  });

  $$(".modal-qcheck").forEach((c) => {
    c.onchange = () => {
      P.questions[c.dataset.q] = c.checked;
      saveMem();
      render();
    };
  });

  $$(".modal-pcheck").forEach((c) => {
    c.onchange = () => {
      P.projects[c.dataset.p] = c.checked;
      saveMem();
      render();
    };
  });
}

function bind() {
  $$(".nav-item").forEach(
    (b) =>
      (b.onclick = () => {
        currentView = b.dataset.view;
        render();
      }),
  );

  if ($("#phaseSelect")) {
    $("#phaseSelect").onchange = (e) => {
      activePhase = e.target.value;
      activeMonth = "All";
      render();
    };
  }

  if ($("#monthSelect")) {
    $("#monthSelect").onchange = (e) => {
      activeMonth = e.target.value;
      render();
    };
  }

  if ($("#statusSelect")) {
    $("#statusSelect").onchange = (e) => {
      activeStatus = e.target.value;
      render();
    };
  }

  $$(".tag-clear").forEach((b) => {
    b.onclick = () => {
      const type = b.dataset.clear;
      if (type === "phase") activePhase = "All";
      if (type === "month") activeMonth = "All";
      if (type === "status") activeStatus = "All";
      if (type === "search") {
        searchTerm = "";
        if ($("#globalSearch")) $("#globalSearch").value = "";
      }
      render();
    };
  });

  if ($("#resetFiltersBtn")) {
    $("#resetFiltersBtn").onclick = () => {
      activePhase = "All";
      activeMonth = "All";
      activeStatus = "All";
      searchTerm = "";
      if ($("#globalSearch")) $("#globalSearch").value = "";
      render();
    };
  }

  if ($("#emptyResetBtn")) {
    $("#emptyResetBtn").onclick = () => {
      activePhase = "All";
      activeMonth = "All";
      activeStatus = "All";
      searchTerm = "";
      if ($("#globalSearch")) $("#globalSearch").value = "";
      render();
    };
  }

  $$(".check:not(.modal-week-check)").forEach(
    (c) =>
      (c.onchange = () => {
        P.weeks[c.dataset.week] = c.checked;
        saveMem();
        render();
      }),
  );

  $$(".detail-btn").forEach((b) => (b.onclick = () => modal(b.dataset.detail)));

  $$(".topic-menu button").forEach(
    (b) =>
      (b.onclick = () => {
        activeTopic = b.dataset.topic;
        render();
      }),
  );

  $$(".qcheck:not(.modal-qcheck)").forEach(
    (c) =>
      (c.onchange = () => {
        P.questions[c.dataset.q] = c.checked;
        saveMem();
        status();
      }),
  );

  $$(".pcheck:not(.modal-pcheck)").forEach(
    (c) =>
      (c.onchange = () => {
        P.projects[c.dataset.p] = c.checked;
        saveMem();
        render();
      }),
  );

  $$(".month-row").forEach(
    (r) =>
      (r.onclick = () => {
        if (r.dataset.month) {
          activeMonth = r.dataset.month;
          if (r.dataset.phase) activePhase = r.dataset.phase;
        }
        currentView = "weeks";
        render();
      }),
  );

  if ($("#saveBtn")) $("#saveBtn").onclick = saveFile;
  if ($("#importBtn")) $("#importBtn").onclick = () => $("#importFile")?.click();
  if ($("#importFile"))
    $("#importFile").onchange = async (e) => {
      let f = e.target.files[0];
      if (!f) return;
      try {
        P = JSON.parse(await f.text());
        saveMem();
        render();
      } catch {
        alert("Invalid progress.json");
      }
    };

  if ($("#resetProgress"))
    $("#resetProgress").onclick = () => {
      if (confirm("Are you sure you want to reset all progress?")) {
        P = {
          version: 2,
          weeks: {},
          questions: {},
          projects: {},
          notes: {},
          settings: { theme: P.settings?.theme || "dark" },
        };
        localStorage.removeItem("rafi-progress-session");
        render();
      }
    };

  if ($("#themeBtn"))
    $("#themeBtn").onclick = () => {
      P.settings.theme = P.settings.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = P.settings.theme;
      saveMem();
      render();
    };

  if ($("#globalSearch"))
    $("#globalSearch").oninput = (e) => {
      searchTerm = e.target.value.toLowerCase();
      currentView = ["projects", "practice", "weeks"].includes(currentView)
        ? currentView
        : "weeks";
      render();
    };

  if ($("#menuBtn"))
    $("#menuBtn").onclick = () => $("#sidebar").classList.toggle("open");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalWeekId !== null) {
    $("#modalRoot").innerHTML = "";
    modalWeekId = null;
  }
});

boot();
