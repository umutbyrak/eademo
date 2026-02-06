let state = { lang: "de", page: "announcements", data: null };

const el = (id) => document.getElementById(id);
const content = el("content");

function t(obj) {
  if (!obj) return "";
  return obj[state.lang] ?? obj.de ?? "";
}

function setActiveNav() {
  document.querySelectorAll(".navBtn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === state.page);
  });
}

function renderAnnouncements() {
  const items = state.data.announcements || [];
  content.innerHTML = items.map(a => `
    <div class="item">
      <p class="itemTitle">${t(a.title)}</p>
      <p class="itemMeta">${t(a.meta)}</p>
      <p class="itemText">${t(a.text)}</p>
    </div>
  `).join("");
}

function renderMeals() {
  const meals = state.data.meals;
  const times = t(meals.times);
  const week = meals.week || [];
  content.innerHTML = `
    <div class="item">
      <p class="itemTitle">${t({de:"Zeiten", en:"Times"})}</p>
      <p class="itemText">${times}</p>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>${t({de:"Tag", en:"Day"})}</th>
          <th>${t({de:"Frühstück", en:"Breakfast"})}</th>
          <th>${t({de:"Mittag", en:"Lunch"})}</th>
          <th>${t({de:"Abend", en:"Dinner"})}</th>
        </tr>
      </thead>
      <tbody>
        ${week.map(d => `
          <tr>
            <td><strong>${t(d.day)}</strong></td>
            <td>${t(d.breakfast)}</td>
            <td>${t(d.lunch)}</td>
            <td>${t(d.dinner)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderActivities() {
  const items = state.data.activities || [];
  content.innerHTML = items.map(a => `
    <div class="item">
      <p class="itemTitle">${t(a.title)}</p>
      <p class="itemMeta">${t(a.meta)}</p>
      <p class="itemText">${t(a.text)}</p>
    </div>
  `).join("");
}

function renderBuildings() {
  const items = state.data.buildings || [];
const mapHtml = `
  <div class="mapWrap">
    <img class="mapImg" src="camp-map.png" alt="Camp map" />
    <div class="legend">
      <strong>DE:</strong> Gebäude sind nummeriert. <br/>
      <strong>EN:</strong> Buildings are numbered.
    </div>
  </div>
`;

  content.innerHTML = mapHtml + items.map(b => {

    const maps = b.maps ? `<a class="link" href="${b.maps}" target="_blank" rel="noopener">${t({de:"Route öffnen", en:"Open directions"})}</a>` : "";
    return `
      <div class="item">
        <p class="itemTitle">${b.icon ? b.icon + " " : ""}${t({de:"Gebäude", en:"Building"})} ${b.id}: ${t(b.name)}</p>

        <p class="itemMeta">${t({de:"Öffnungszeiten", en:"Opening hours"})}: ${t(b.hours)}</p>
        <p class="itemText">${t(b.desc)}</p>
        ${maps ? `<p class="itemMeta">${maps}</p>` : ``}
      </div>
    `;
  }).join("");
}

function renderInfo() {
  content.innerHTML = `
    <div class="item">
      <p class="itemTitle">${t(state.data.info.title)}</p>
      <p class="itemText">${t(state.data.info.text)}</p>
      <p class="itemMeta">${t(state.data.info.cta)}</p>
    </div>
  `;
}
function renderHours() {
  const hours = state.data.hours;

  if (!hours || !hours.sections) {
    content.innerHTML = `
      <div class="item">
        <p class="itemTitle">${t({de:"Zeiten & Sprechstunden", en:"Hours & office times"})}</p>
        <p class="itemText">${t({de:"Noch keine Daten.", en:"No data yet."})}</p>
      </div>
    `;
    return;
  }

  const sections = hours.sections || [];

  content.innerHTML = sections.map(sec => `
    <div class="item">
      <p class="itemTitle">${t(sec.title)}</p>
      ${(sec.items || []).map(i => `
        <p class="itemText">${t(i.line)}</p>
      `).join("")}
      ${sec.note ? `<p class="itemMeta">${t(sec.note)}</p>` : ``}
    </div>
  `).join("");
}


function render() {
  // header / home
  el("subtitle").textContent = t(state.data.app.subtitle);
  el("homeTitle").textContent = t(state.data.app.homeTitle);
  el("homeText").textContent = t(state.data.app.homeText);

      // nav labels (keep icons + fallback)
const iconMap = {
  navAnnouncements: "📣",
  navHours: "📅",
  navMeals: "🍽️",
  navActivities: "🎯",
  navBuildings: "🗺️",
  navInfo: "ℹ️"
};

const setNavLabel = (btnId, labelObj) => {
  const btn = el(btnId);
  if (!btn) return;
  const icon = (btn.dataset.icon || iconMap[btnId] || "") + ( (btn.dataset.icon || iconMap[btnId]) ? " " : "" );
  btn.innerHTML = `${icon}<span>${t(labelObj)}</span>`;
};


  setNavLabel("navAnnouncements", state.data.nav.announcements);
  setNavLabel("navHours", state.data.nav.hours);
  setNavLabel("navMeals", state.data.nav.meals);
  setNavLabel("navActivities", state.data.nav.activities);
  setNavLabel("navBuildings", state.data.nav.buildings);
  setNavLabel("navInfo", state.data.nav.info);



const navHoursEl = el("navHours");
if (navHoursEl && state.data.nav?.hours) navHoursEl.textContent = t(state.data.nav.hours);



  // page title + content
  const titleMap = {
    announcements: state.data.nav.announcements,
    meals: state.data.nav.meals,
    activities: state.data.nav.activities,
    buildings: state.data.nav.buildings,
    info: state.data.nav.info,
hours: state.data.nav.hours

  };
  el("pageTitle").textContent = t(titleMap[state.page]);

  setActiveNav();

  if (state.page === "announcements") renderAnnouncements();
  if (state.page === "meals") renderMeals();
  if (state.page === "activities") renderActivities();
  if (state.page === "buildings") renderBuildings();
  if (state.page === "info") renderInfo();
if (state.page === "hours") renderHours();

}

async function init() {
  const res = await fetch("data.json", { cache: "no-store" });
  state.data = await res.json();

  // language buttons
  el("btnDe").onclick = () => { state.lang = "de"; render(); };
  el("btnEn").onclick = () => { state.lang = "en"; render(); };

  // nav buttons
  document.querySelectorAll(".navBtn").forEach(btn => {
    btn.onclick = () => { state.page = btn.dataset.page; render(); };
  });

  render();
}

init();

