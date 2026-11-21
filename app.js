const STORAGE = {
  tgf: "tgr_tgf_submissions",
  reports: "tgr_cheat_reports"
};

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch (_) { return []; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

const tgfForm = document.getElementById("tgfForm");
if (tgfForm) {
  const textQuestions = [
    "Mi a Discord neved és Discord ID-d?",
    "Hány éves vagy?",
    "Mesélj magadról 5 mondatban.",
    "Miért szeretnél jelentkezni?",
    "Voltál már korábban admin másik szerveren?",
    "Mivel tudnád segíteni a csapatot?",
    "Mennyire tudod jól kezelni a vitákat?",
    "Miért pont téged válasszunk?"
  ];
  const choiceQuestions = [
    ["Belépsz egy hangcsatornába és azt hallod, hogy két ember egymással veszekszik. Mi a helyes cselekedet ebben a helyzetben?", ["A) Hagyod hogy folytassák", "B) Beleszólsz és te is elkezdesz veszekedni velük", "C) Leállítod őket és ha nem hagyják abba akkor le némítod őket", "D) Hívsz egy nagyobbat!"]],
    ["Egy nem beszélgetésre való hangcsatornában el elkezdenek beszélgetni és ebből egy vita alakul ki. Mit tennél?", ["A) Hagyod, hogy beszélgessenek de a vitát megprópálod leállítani.", "B) Elmagyarázod nekik, hogy ez nem beszélgetésre van és le állítod őket", "Nem szólsz közbe hagyod, hogy folytassák", "C) Szólsz a szerver tulajnak!"]],
    ["Kialakul egy vita a semmiből. Mit teszel?", ["A) Semmit", "B) Le némítod őket", "C) Ki bannolod őket", "D) Megbeszéled velük."]],
    ["Valakit feltörnek és minden csatornába beküld egy vírust. Mit teszel?", ["A) Semmit", "B) Le némítod", "C) Bannolod", "D) Szólsz neki PM-ben, hogy feltörték és cseréljen jelszót."]],
  ];

  textQuestions.forEach((question, index) => {
    const section = document.createElement("section");
    section.className = "question-block";
    section.innerHTML = `
      <span class="question-number">${String(index + 1).padStart(2, "0")} / 12</span>
      <label for="q${index + 1}">${question}</label>
      <textarea id="q${index + 1}" name="q${index + 1}" required placeholder="${index >= 4 ? "Írd ide a válaszodat…" : "Írd ide a válaszodat…"}"></textarea>
    `;
    tgfForm.appendChild(section);
  });

  choiceQuestions.forEach(([question, choices], choiceIndex) => {
    const number = choiceIndex + 9;
    const section = document.createElement("section");
    section.className = "question-block";
    section.innerHTML = `
      <span class="question-number">${String(number).padStart(2, "0")} / 13</span>
      <label>${question}</label>
      <div class="choices">
        ${choices.map((choice, index) => `
          <label class="choice">
            <input type="radio" name="q${number}" value="${choice}" ${index === 0 ? "required" : ""}>
            <span>${choice}</span>
          </label>
        `).join("")}
      </div>
    `;
    tgfForm.appendChild(section);
  });

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "submit-btn";
  submit.innerHTML = "Jelentkezés küldése <span>›</span>";
  tgfForm.appendChild(submit);

  tgfForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(tgfForm);
    const answers = [];
    for (let i = 1; i <= 12; i++) {
      answers.push(data.get(`q${i}`));
    }
    const submissions = read(STORAGE.tgf);
    submissions.unshift({
      id: Date.now(),
      createdAt: new Date().toLocaleString("hu-HU"),
      answers
    });
    save(STORAGE.tgf, submissions);
    tgfForm.reset();
    showToast();
  });
}

const reportForm = document.getElementById("reportForm");
if (reportForm) {
  reportForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const reports = read(STORAGE.reports);
    reports.unshift({
      id: Date.now(),
      createdAt: new Date().toLocaleString("hu-HU"),
      answers: [
        document.getElementById("reporterName").value,
        document.getElementById("reportedName").value,
        document.getElementById("reason").value
      ]
    });
    save(STORAGE.reports, reports);
    reportForm.reset();
    showToast();
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const accounts = {
    "Bocika": "Bocika0211",
    "Barni": "Barni567",
    "Fanneszka": "Fanni567",
    "Flori": "Flori567",
    "Navi": "Navi567"
  };

  loginForm.addEventListener("submit", (event) => {
    event.preventEvent?.();
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (accounts[username] === password) {
      sessionStorage.setItem("tgr_admin", "true");
      openDashboard();
    } else {
      document.getElementById("loginError").textContent = "Hibás felhasználónév vagy jelszó.";
    }
  });

  if (sessionStorage.getItem("tgr_admin") === "true") openDashboard();
}

function openDashboard() {
  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  renderDashboard();
}

function renderDashboard() {
  const tgfItems = read(STORAGE.tgf);
  const reports = read(STORAGE.reports);
  document.getElementById("tgfCount").textContent = tgfItems.length;
  document.getElementById("reportCount").textContent = reports.length;
  renderSubmissionList("tgfPanel", tgfItems, [
    "Discord név és ID",
    "Kor",
    "Bemutatkozás",
    "Jelentkezés indoka",
    "5. kérdés",
    "6. kérdés",
    "7. kérdés",
    "8. kérdés",
    "9. kérdés",
    "10. kérdés",
    "11. kérdés",
    "12. kérdés",
    "13. kérdés"
  ], STORAGE.tgf);
  renderSubmissionList("reportsPanel", reports, [
    "Bejelentő neve és Discord ID-je",
    "Bejelentett személy neve és Discord ID-je",
    "Indok"
  ], STORAGE.reports);
}

function renderSubmissionList(panelId, items, labels, storageKey) {
  const panel = document.getElementById(panelId);
  if (!items.length) {
    panel.innerHTML = '<div class="empty-state">Jelenleg nincs beküldött lap.</div>';
    return;
  }

  let index = 0;
  const card = document.createElement("div");
  card.className = "submission-card";

  function paint() {
    const item = items[index];
    card.innerHTML = `
      <div class="submission-top">
        <div class="submission-title">Beküldés #${items.length - index} <span style="color:#9296a1;font-weight:400">· ${item.createdAt}</span></div>
        <div class="submission-controls">
          <button type="button" class="prev" title="Előző">‹</button>
          <span class="submission-count">${index + 1} / ${items.length}</span>
          <button type="button" class="next" title="Következő">›</button>
          <button type="button" class="delete-btn">Törlés</button>
        </div>
      </div>
      <div class="submission-body">
        ${labels.map((label, i) => `
          <div class="answer-row ${storageKey === STORAGE.reports && i === 2 ? "full" : ""}">
            <strong>${label}</strong>
            <p>${escapeHtml(item.answers[i] || "—")}</p>
          </div>
        `).join("")}
      </div>
    `;
    card.querySelector(".prev").addEventListener("click", () => {
      if (index > 0) { index--; paint(); }
    });
    card.querySelector(".next").addEventListener("click", () => {
      if (index < items.length - 1) { index++; paint(); }
    });
    card.querySelector(".delete-btn").addEventListener("click", () => {
      if (!confirm("Biztosan törlöd ezt a beküldést?")) return;
      items.splice(index, 1);
      save(storageKey, items);
      if (items.length === 0) {
        panel.innerHTML = '<div class="empty-state">Jelenleg nincs beküldött lap.</div>';
      } else {
        index = Math.min(index, items.length - 1);
        paint();
      }
      renderCountsOnly();
    });
  }
  panel.replaceChildren(card);
  paint();
}

function renderCountsOnly() {
  document.getElementById("tgfCount").textContent = read(STORAGE.tgf).length;
  document.getElementById("reportCount").textContent = read(STORAGE.reports).length;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    const reports = tab.dataset.tab === "reports";
    document.getElementById("tgfPanel").classList.toggle("hidden", reports);
    document.getElementById("reportsPanel").classList.toggle("hidden", !reports);
  });
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("tgr_admin");
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("loginView").classList.remove("hidden");
    document.getElementById("loginForm").reset();
  });
}
