const metrics=[
 {name:"Total revenue",value:"$ 99.560",change:"↑ 2,67%",featured:true},
 {name:"Total orders",value:"35",change:"↓ 2,67%",down:true},
 {name:"Total visitors",value:"45.600",change:"↓ 2,67%",down:true},
 {name:"Net profit",value:"$ 60.450",change:"↑ 5,67%"}
];
document.querySelector("#metrics").innerHTML=metrics.map((m,i)=>`<article class="metric ${m.featured?'featured':''}" style="animation-delay:${i*.08}s"><p>${m.name}</p><button class="arrow">↗</button><strong>${m.value} <small class="${m.down?'down':''}">${m.change}</small></strong><small>This month vs last</small></article>`).join("");
const values=[76,40,57,53,64,72,84,73];
document.querySelector("#bars").innerHTML=values.map((v,i)=>`<div class="bar-item"><b>$ ${Math.round(v*196)}</b><i style="height:${v}%;animation-delay:${.2+i*.07}s"></i><span>${i+1} AUG</span></div>`).join("");
document.querySelectorAll(".counter").forEach(el=>{const target=+el.dataset.value,start=performance.now(),duration=850;function tick(now){const p=Math.min((now-start)/duration,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)});
const toggle=document.querySelector("#themeToggle");
const saved=localStorage.getItem("wave-theme");if(saved==="light")document.body.classList.add("light");
toggle.addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("wave-theme",document.body.classList.contains("light")?"light":"dark")});
document.querySelectorAll(".sidebar nav a").forEach(a=>a.addEventListener("click",()=>{document.querySelectorAll(".sidebar nav a").forEach(x=>x.classList.remove("active"));a.classList.add("active")}));
