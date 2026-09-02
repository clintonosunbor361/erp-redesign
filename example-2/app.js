const products=[
  ["👕","Premium T-Shirt","Completed"],["♠","Playstation 5","Pending"],["♟","Hoodie Gonibong","Pending"],
  ["▣","iPhone 15 Pro Max","Completed"],["☕","Lotse","Completed"],["◉","Starbucks","Completed"],["👕","Tinek Detstar T-Shirt","Completed"]
];
const heights=[[88,72],[58,83],[79,64],[73,54],[94,76],[84,69]];
const list=document.querySelector("#transactionList");
function renderTransactions(q=""){
  const filtered=products.filter(p=>p.join(" ").toLowerCase().includes(q.toLowerCase()));
  list.innerHTML=filtered.map(p=>`<div class="transaction"><span class="product-icon">${p[0]}</span><span class="transaction-copy"><strong>${p[1]}</strong><small>Jul 12th 2024</small></span><span class="transaction-status"><strong>${p[2]}</strong><small>0JWEJS7ISNC</small></span></div>`).join("")||'<p style="color:#888;font-size:11px">No matching transactions.</p>';
}
document.querySelector("#revenueChart").innerHTML=heights.map(h=>`<span class="bar-pair"><i style="height:${h[0]}%"></i><i style="height:${h[1]}%"></i></span>`).join("");
document.querySelector("#search").addEventListener("input",e=>renderTransactions(e.target.value));
document.querySelectorAll(".sidebar nav a").forEach(a=>a.addEventListener("click",()=>{document.querySelectorAll(".sidebar nav a").forEach(x=>x.classList.remove("active"));a.classList.add("active");document.querySelector(".sidebar").classList.remove("open")}));
document.querySelector(".mobile-menu").addEventListener("click",()=>document.querySelector(".sidebar").classList.toggle("open"));
document.querySelector("#exportPdf").addEventListener("click",()=>{const t=document.querySelector("#toast");t.classList.add("show");setTimeout(()=>{t.classList.remove("show");window.print()},600)});
renderTransactions();
