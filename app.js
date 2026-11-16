const API_URL = "https://batch-code-api.mrrazy143.workers.dev";

const sources = [
  {name:"CheckFresh", url:"https://www.checkfresh.com/?lang=en"},
  {name:"SkinCarisma Batch Code Checker", url:"https://www.skincarisma.com/batch-code-checker"},
  {name:"LotDate", url:"https://lotdate.com/"},
  {name:"BatchCode.org", url:"https://batchcode.org/"}
];

const $ = id => document.getElementById(id);
let active = null;

function readHistory() {
  try { return JSON.parse(localStorage.getItem("bcc-history") || "[]"); }
  catch { return []; }
}

function renderHistory() {
  const items = readHistory();
  const el = $("history");
  if (!items.length) {
    el.innerHTML = '<p class="empty">No saved searches yet.</p>';
    return;
  }
  el.innerHTML = items.map(x =>
    `<div class="history-item"><strong>${escapeHtml(x.brand)} — ${escapeHtml(x.batch)}</strong><span>${escapeHtml(x.mfg || "MFG not recorded")} · ${escapeHtml(x.expiry || "EXP not recorded")}</span><br><span>${escapeHtml(x.status)}${x.notes ? " · " + escapeHtml(x.notes) : ""}</span></div>`
  ).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}

function showSources() {
  $("source-list").innerHTML = sources.map((source, i) =>
    `<div class="source"><strong>${i + 1}. ${escapeHtml(source.name)}</strong><a href="${source.url}" target="_blank" rel="noopener noreferrer">OPEN WEBSITE ↗</a></div>`
  ).join("");
}

function showApiResult(result) {
  const box = document.createElement("div");
  box.className = "notice";
  const heading = document.createElement("strong");
  heading.textContent = result.status === "not_verified"
    ? "Unable to verify automatically"
    : "API response";
  const detail = document.createElement("p");
  detail.textContent = result.message || "No verified date information was returned.";
  box.replaceChildren(heading, detail);
  $("source-list").prepend(box);
}

$("lookup-form").addEventListener("submit", async event => {
  event.preventDefault();

  const brand = $("brand").value.trim();
  const batch = $("batch").value.trim();
  if (!brand || !batch) return;

  active = {brand, batch};
  $("results").classList.remove("hidden");
  $("current-product").textContent = `Product: ${brand} · Batch: ${batch}`;
  $("mfg").value = "";
  $("expiry").value = "";
  $("notes").value = "";
  $("status").value = "Not found";

  const button = $("lookup-form").querySelector('button[type="submit"]');
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "SEARCHING...";
  $("source-list").innerHTML = '<p class="hint">Checking the Batch Code Checker API...</p>';
  $("results").scrollIntoView({behavior:"smooth", block:"start"});

  try {
    const response = await fetch(`${API_URL}/api/check`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({brand, batchCode: batch})
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || `Request failed (${response.status})`);
    }

    showApiResult(result);
    if (result.manufacturingDate) $("mfg").value = result.manufacturingDate;
    if (result.expiryDate) $("expiry").value = result.expiryDate;

    if (result.status === "verified") {
      $("status").value = "Verified on source";
    } else if (result.status === "estimated") {
      $("status").value = "Estimated - not confirmed";
    } else {
      $("status").value = "Not found";
    }
    $("notes").value = result.message || "";
  } catch (error) {
    const box = document.createElement("p");
    box.className = "notice";
    box.textContent = `API connection error: ${error.message}. You can still open the source websites below.`;
    $("source-list").replaceChildren(box);
    $("status").value = "Not found";
    $("notes").value = `API connection error: ${error.message}`;
  }

  showSources();
  button.disabled = false;
  button.textContent = originalLabel;
});

$("save").addEventListener("click", () => {
  if (!active) {
    alert("Search for a product first.");
    return;
  }
  const items = readHistory();
  items.unshift({
    ...active,
    mfg: $("mfg").value,
    expiry: $("expiry").value,
    status: $("status").value,
    notes: $("notes").value.trim(),
    savedAt: new Date().toISOString()
  });
  localStorage.setItem("bcc-history", JSON.stringify(items.slice(0, 100)));
  renderHistory();
  alert("Saved on this device.");
});

$("clear").addEventListener("click", () => {
  if (confirm("Delete saved searches from this device?")) {
    localStorage.removeItem("bcc-history");
    renderHistory();
  }
});

renderHistory();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
