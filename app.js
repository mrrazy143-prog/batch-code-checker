const sources = [
  {name:"CheckFresh", url:"https://www.checkfresh.com/?lang=en"},
  {name:"SkinCarisma Batch Code Checker", url:"https://www.skincarisma.com/batch-code-checker"},
  {name:"LotDate", url:"https://lotdate.com/"},
  {name:"BatchCode.org", url:"https://batchcode.org/"}
];
const $ = id => document.getElementById(id);
let active = null;
function readHistory(){try{return JSON.parse(localStorage.getItem("bcc-history")||"[]")}catch{return []}}
function renderHistory(){
  const items=readHistory(); const el=$("history");
  if(!items.length){el.innerHTML='<p class="empty">No saved searches yet.</p>';return}
  el.innerHTML=items.map(x=>`<div class="history-item"><strong>${escapeHtml(x.brand)} — ${escapeHtml(x.batch)}</strong><span>${escapeHtml(x.mfg||"MFG not recorded")} · ${escapeHtml(x.expiry||"EXP not recorded")}</span><br><span>${escapeHtml(x.status)}${x.notes?" · "+escapeHtml(x.notes):""}</span></div>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("lookup-form").addEventListener("submit",e=>{
  e.preventDefault();
  const brand=$("brand").value.trim(), batch=$("batch").value.trim();
  if(!brand||!batch)return;
  active={brand,batch};
  $("results").classList.remove("hidden");
  $("current-product").textContent=`Product: ${brand} · Batch: ${batch}`;
  $("source-list").innerHTML=sources.map((s,i)=>`<div class="source"><strong>${i+1}. ${escapeHtml(s.name)}</strong><a href="${s.url}" target="_blank" rel="noopener">OPEN WEBSITE ↗</a></div>`).join("");
  $("mfg").value="";$("expiry").value="";$("notes").value="";$("status").value="Verified on source";
  $("results").scrollIntoView({behavior:"smooth",block:"start"});
  // Open source sites only after the user submits. The site may require manual entry.
  sources.forEach(s=>window.open(s.url,"_blank","noopener"));
});
$("save").addEventListener("click",()=>{
  if(!active){alert("Search for a product first.");return}
  const items=readHistory();
  items.unshift({...active,mfg:$("mfg").value,expiry:$("expiry").value,status:$("status").value,notes:$("notes").value.trim(),savedAt:new Date().toISOString()});
  localStorage.setItem("bcc-history",JSON.stringify(items.slice(0,100)));
  renderHistory();alert("Saved on this device.");
});
$("clear").addEventListener("click",()=>{
  if(confirm("Delete saved searches from this device?")){localStorage.removeItem("bcc-history");renderHistory()}
});
renderHistory();
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
