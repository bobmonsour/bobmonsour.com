const PAGEFIND_PATH = "/pagefind/pagefind.js";
const DEBOUNCE_MS = 150;
const MAX_POSTS = 20;
const MAX_PAGES = 10;
const MOBILE_QUERY = "(max-width: 699px)";

const navInput = document.getElementById("site-search");
const toggleBtn = document.querySelector(".search-toggle");
const overlay = document.getElementById("search-overlay");
const overlayInput = overlay && overlay.querySelector(".search-overlay__input");
const overlayInner = overlay && overlay.querySelector(".search-overlay__inner");
const announce = overlay && overlay.querySelector(".search-announce");

let pagefind = null;
let pagefindLoadPromise = null;
let lastQueryToken = 0;
let debounceHandle = null;

if (navInput && toggleBtn && overlay && overlayInput && overlayInner && announce) {
  bind();
}

function bind() {
  navInput.addEventListener("input", onInput);
  overlayInput.addEventListener("input", onInput);

  toggleBtn.addEventListener("click", () => {
    if (overlay.hidden) {
      openOverlay();
      overlayInput.focus();
    } else {
      closeOverlay();
    }
  });

  document.addEventListener("keydown", onKeydown);
  document.addEventListener("click", onDocClick);
}

function onInput(e) {
  const value = e.target.value;
  const q = value.trim();

  if (e.target === navInput) overlayInput.value = value;
  else navInput.value = value;

  if (debounceHandle) clearTimeout(debounceHandle);

  if (q === "") {
    closeOverlay();
    return;
  }
  debounceHandle = setTimeout(() => runQuery(q), DEBOUNCE_MS);
}

function onKeydown(e) {
  if (e.key === "/") {
    const t = e.target;
    if (t && t.matches && t.matches("input, textarea, [contenteditable=true]")) return;
    e.preventDefault();
    if (window.matchMedia(MOBILE_QUERY).matches) {
      openOverlay();
      overlayInput.focus();
    } else {
      navInput.focus();
    }
    return;
  }
  if (e.key === "Escape" && !overlay.hidden) {
    closeOverlay();
    if (window.matchMedia(MOBILE_QUERY).matches) toggleBtn.focus();
    else navInput.focus();
    return;
  }
  if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !overlay.hidden) {
    handleArrow(e);
  }
}

function onDocClick(e) {
  if (overlay.hidden) return;
  if (overlay.contains(e.target)) return;
  const header = document.querySelector("header");
  if (header && header.contains(e.target)) return;
  closeOverlay();
}

async function loadPagefind() {
  if (pagefind) return pagefind;
  if (!pagefindLoadPromise) {
    pagefindLoadPromise = import(PAGEFIND_PATH).then((mod) => {
      pagefind = mod;
      return mod;
    });
  }
  return pagefindLoadPromise;
}

async function runQuery(q) {
  const token = ++lastQueryToken;
  let lib;
  try {
    lib = await loadPagefind();
  } catch (err) {
    console.error("Pagefind failed to load", err);
    showUnavailable();
    return;
  }

  let postRes, pageRes;
  try {
    [postRes, pageRes] = await Promise.all([
      lib.search(q, { filters: { type: "post" }, sort: { date: "desc" } }),
      lib.search(q, { filters: { type: "page" } }),
    ]);
  } catch (err) {
    console.error("Pagefind search failed", err);
    showUnavailable();
    return;
  }

  if (token !== lastQueryToken) return;

  const [postData, pageData] = await Promise.all([
    Promise.all(postRes.results.slice(0, MAX_POSTS).map((r) => r.data())),
    Promise.all(pageRes.results.slice(0, MAX_PAGES).map((r) => r.data())),
  ]);

  if (token !== lastQueryToken) return;

  render(q, postData, pageData);
  openOverlay();
}

function render(q, posts, pages) {
  const sections = [];
  if (posts.length) sections.push(renderSection("Posts", posts, true));
  if (pages.length) sections.push(renderSection("Pages", pages, false));

  if (sections.length === 0) {
    overlayInner.innerHTML =
      `<p class="search-empty">No results found for <em>${escapeHtml(q)}</em>.</p>`;
  } else {
    overlayInner.innerHTML = sections.join("");
  }

  announce.textContent =
    `${posts.length} ${posts.length === 1 ? "post" : "posts"} and ` +
    `${pages.length} ${pages.length === 1 ? "page" : "pages"} found.`;
}

function renderSection(heading, results, withDate) {
  const cards = results.map((r) => renderCard(r, withDate)).join("");
  return `<section class="search-section">
    <h3 class="search-section__heading">${escapeHtml(heading)}</h3>
    <ul class="search-results">${cards}</ul>
  </section>`;
}

function renderCard(r, withDate) {
  const title = (r.meta && r.meta.title) ? r.meta.title : "Untitled";
  const dateIso = withDate && r.meta && r.meta.date;
  const dateHtml = dateIso
    ? `<time class="search-result__date" datetime="${escapeAttr(dateIso)}">${escapeHtml(formatDate(dateIso))}</time>`
    : "";
  const subs = Array.isArray(r.sub_results) ? r.sub_results : [];
  const deepSubs = subs.filter((s) => s.url && s.url.includes("#")).slice(0, 5);
  const subHtml = deepSubs.length
    ? `<ul class="search-subresults">${deepSubs.map((sr) =>
        `<li><a class="search-subresult" href="${escapeAttr(sr.url)}">
          <span class="search-subresult__title">${escapeHtml(sr.title || "")}</span>
          <span class="search-subresult__excerpt">${sr.excerpt}</span>
        </a></li>`).join("")}</ul>`
    : "";
  return `<li>
    <a class="search-result" href="${escapeAttr(r.url)}">
      <h4 class="search-result__title">${escapeHtml(title)}</h4>
      ${dateHtml}
      <p class="search-result__excerpt">${r.excerpt}</p>
    </a>
    ${subHtml}
  </li>`;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "short", day: "numeric"
  }).format(d);
}

function showUnavailable() {
  overlayInner.innerHTML =
    `<p class="search-empty">Search is unavailable right now.</p>`;
  announce.textContent = "Search is unavailable.";
  openOverlay();
}

function openOverlay() {
  overlay.hidden = false;
  navInput.setAttribute("aria-expanded", "true");
  toggleBtn.setAttribute("aria-expanded", "true");
}

function closeOverlay() {
  overlay.hidden = true;
  navInput.setAttribute("aria-expanded", "false");
  toggleBtn.setAttribute("aria-expanded", "false");
  navInput.value = "";
  overlayInput.value = "";
  if (debounceHandle) clearTimeout(debounceHandle);
}

function handleArrow(e) {
  const links = overlay.querySelectorAll(".search-result");
  if (links.length === 0) return;
  const idx = Array.from(links).indexOf(document.activeElement);
  e.preventDefault();
  if (e.key === "ArrowDown") {
    if (idx === -1) links[0].focus();
    else if (idx < links.length - 1) links[idx + 1].focus();
  } else {
    if (idx <= 0) {
      const target = window.matchMedia(MOBILE_QUERY).matches ? overlayInput : navInput;
      target.focus();
    } else {
      links[idx - 1].focus();
    }
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}
function escapeAttr(s) { return escapeHtml(s); }
