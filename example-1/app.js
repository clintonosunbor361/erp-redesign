const pipelineSets = {
  "This Month": [
    ["New", 32, 84, "#3d8ff5"], ["Qualified", 28, 73, "#76baf2"],
    ["Proposal", 18, 50, "#9f8ce6"], ["Negotiation", 10, 29, "#d99ce4"], ["Won", 8, 23, "#72c8aa"]
  ],
  "Last Month": [
    ["New", 29, 76, "#3d8ff5"], ["Qualified", 25, 66, "#76baf2"],
    ["Proposal", 16, 45, "#9f8ce6"], ["Negotiation", 11, 31, "#d99ce4"], ["Won", 7, 20, "#72c8aa"]
  ],
  "This Quarter": [
    ["New", 86, 92, "#3d8ff5"], ["Qualified", 71, 76, "#76baf2"],
    ["Proposal", 48, 54, "#9f8ce6"], ["Negotiation", 31, 38, "#d99ce4"], ["Won", 24, 29, "#72c8aa"]
  ]
};

const activities = [
  { title: "Discovery Call", company: "Zylker Inc.", day: "Today", time: "10:00 AM", color: "#398cf4", bg: "#e5f2ff", icon: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/>' },
  { title: "Follow-up Call", company: "Globex Corporation", day: "Today", time: "1:30 PM", color: "#4dbd91", bg: "#e5f7f0", icon: '<path d="M7 4 4.5 6.5c-.6 7 6 13.5 13 13l2.5-2.5-4-3-2 2c-2.5-1-5-3.5-6-6l2-2-3-4Z"/>' },
  { title: "Demo Presentation", company: "Initech", day: "Tomorrow", time: "11:00 AM", color: "#398cf4", bg: "#e5f2ff", icon: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m2-11a3 3 0 0 1 0 6"/>' }
];

const deals = [
  { name: "Enterprise Plan", company: "Globex Corporation", amount: "$24,000", stage: "Proposal", date: "Sep 12, 2026" },
  { name: "Growth Suite", company: "Stark Industries", amount: "$18,500", stage: "Won", date: "Sep 18, 2026" },
  { name: "Team Workspace", company: "Zylker Inc.", amount: "$12,800", stage: "Proposal", date: "Sep 26, 2026" }
];

const pipeline = document.querySelector("#pipeline");
const period = document.querySelector("#period");
const activitiesEl = document.querySelector("#activities");
const dealsBody = document.querySelector("#dealsBody");
const emptyState = document.querySelector("#emptyState");

function renderPipeline(periodName) {
  pipeline.innerHTML = pipelineSets[periodName].map(([label, total, width, color]) => `
    <div class="pipeline-row">
      <span class="pipeline-label"><i class="dot" style="background:${color}"></i>${label}</span>
      <span class="bar"><span style="width:${width}%;background:${color}"></span></span>
      <strong>${total}</strong>
    </div>`).join("");
}

function renderActivities() {
  activitiesEl.innerHTML = activities.map(item => `
    <div class="activity">
      <span class="activity-icon" style="color:${item.color};background:${item.bg}"><svg viewBox="0 0 24 24">${item.icon}</svg></span>
      <span class="activity-copy"><strong>${item.title}</strong><small>${item.company}</small></span>
      <span class="activity-time"><span>${item.day}</span><span>${item.time}</span></span>
    </div>`).join("");
}

function renderDeals(query = "") {
  const normalized = query.trim().toLowerCase();
  const visible = deals.filter(deal => Object.values(deal).some(value => value.toLowerCase().includes(normalized)));
  dealsBody.innerHTML = visible.map(deal => `
    <tr>
      <td>${deal.name}</td><td>${deal.company}</td><td>${deal.amount}</td>
      <td><span class="stage ${deal.stage === "Won" ? "won" : ""}">${deal.stage}</span></td>
      <td>${deal.date}</td><td><button class="more" aria-label="More options">⋮</button></td>
    </tr>`).join("");
  emptyState.hidden = visible.length > 0;
  document.querySelector(".table-scroll").hidden = visible.length === 0;
}

function exportPdf() {
  const toast = document.querySelector("#toast");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    window.print();
  }, 650);
}

period.addEventListener("change", event => renderPipeline(event.target.value));
document.querySelector("#searchInput").addEventListener("input", event => renderDeals(event.target.value));
document.querySelector("#downloadPdf").addEventListener("click", exportPdf);
document.querySelectorAll("[data-print]").forEach(button => button.addEventListener("click", exportPdf));
document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach(link => link.classList.remove("active"));
  item.classList.add("active");
}));
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.querySelector("#searchInput").focus();
  }
});

renderPipeline("This Month");
renderActivities();
renderDeals();
