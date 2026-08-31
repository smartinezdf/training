const STORAGE_KEY='sam-training-v1';
const state=loadState();
let deferredPrompt=null;

const plan=[
 {short:'Mon',name:'Monday',focus:'Heavy Lower — Quads + Glutes + Calves',sessions:[
  ['Lower Strength A',['Hip thrust — 4 × 8–10','Hack squat or back squat — 3 × 6–10','Bulgarian split squat — 3 × 8 each','Leg press — 3 × 10–12','Leg extension — 2 × 12–15','Standing calf raise — 4 × 10–15','Tibialis raise — 3 × 15–20']],
  ['Core — 8 min',['Hanging knee raise — 3 × 10–15','Cable crunch — 3 × 12–15','Plank — 2 × 45 sec']]
 ]},
 {short:'Tue',name:'Tuesday',focus:'Upper A + Easy Run + Tennis',sessions:[
  ['Upper Strength A',['Lat pulldown — 3 × 8–12','Seated cable row — 3 × 10–12','DB shoulder press — 3 × 8–10','Incline DB press — 2 × 8–12','Lateral raise — 3 × 12–15','Biceps curl — 3 × 10–12','Face pull — 2 × 15']],
  ['Run',['30 min easy conversational run']],['Tennis',['Afternoon lessons']],['Core',['Dead bug','Pallof press','Side plank']]
 ]},
 {short:'Wed',name:'Wednesday',focus:'Heavy Lower — Hamstrings + Glutes + Adductors',sessions:[
  ['Lower Strength B',['Romanian deadlift — 4 × 8–10','Hip thrust — 3 × 10–12','Reverse lunge — 3 × 10 each','Hamstring curl — 3 × 10–15','Adductor machine — 3 × 12–15','Hip abduction — 3 × 15–20','Seated calf raise — 3 × 12–18']],
  ['Padel movement',['Split-step → first-step sprint — 6 each direction','Lateral shuffle 5–7 m — 6 reps','Reaction cone drill — 6–8 reps']],
  ['Core',['Copenhagen plank — 2 × 20–30 sec each','Pallof press — 3 × 10 each']]
 ]},
 {short:'Thu',name:'Thursday',focus:'Upper B + Intervals + Tennis',sessions:[
  ['Upper Strength B',['Single-arm row — 3 × 10','Neutral-grip pulldown — 3 × 10–12','Push-ups or DB press — 3 × 8–12','Rear-delt fly — 3 × 12–15','Lateral raise — 3 × 12–15','Triceps pushdown — 3 × 10–12','External rotation — 2 × 15']],
  ['Intervals',['5 min easy','1 min fast / 2 min easy × 6','5 min cooldown']],['Tennis',['Afternoon lessons']]
 ]},
 {short:'Fri',name:'Friday',focus:'Athletic Day — Explosive + Long Cardio + Light Legs',sessions:[
  ['Explosive / Reaction',['Dynamic warm-up — 6–8 min','Lateral bounds — 3 × 5 each','5 m reaction sprint — 6–8 reps','Cone change-of-direction — 6 reps','Split-step → sprint → recover — 6 reps','Skater jump — 2 × 8 each']],
  ['Light Athletic Legs',['Goblet squat — 3 × 10','Single-leg RDL — 3 × 10','Step-up — 3 × 10 each','Walking lunge — 2 × 10 each','Adductor machine — 2 × 15','Hip abduction — 2 × 15','Standing calf raise — 3 × 15']],
  ['Endurance — choose one',['8–12 km easy run; occasionally up to 15 km','OR 40–50 min easy run','OR 45 min bike / elliptical if impact feels high']],['Core',['Cable crunch','Dead bug','Side plank']]
 ]},
 {short:'Sat',name:'Saturday',focus:'High Tennis Load + Recovery',sessions:[['Tennis',['~4 hours lessons']],['Recovery',['5–10 min hips/adductors/calves mobility','Easy walk if desired','No required gym or run']]]},
 {short:'Sun',name:'Sunday',focus:'High Tennis Load + Recovery',sessions:[['Tennis',['~4 hours lessons']],['Recovery',['Hip flexor mobility','Hamstring mobility','Calf / ankle mobility','Easy walk']],['Optional',['20–30 min Zone 2 only if tennis load is unusually light']]]}
];

const strength=[
 ['Hip thrust','Lower','8–10'],['Hack/back squat','Lower','6–10'],['Bulgarian split squat','Lower','8–10'],['Romanian deadlift','Lower','8–10'],['Hamstring curl','Lower','10–15'],['Standing calf raise','Lower','10–15'],['Seated calf raise','Lower','12–18'],['Adductor machine','Lower','12–15'],['Hip abduction','Lower','15–20'],['Lat pulldown','Upper','8–12'],['Seated row','Upper','10–12'],['DB shoulder press','Upper','8–10'],['Incline DB press','Upper','8–12'],['Biceps curl','Upper','10–12'],['Triceps pushdown','Upper','10–12']
];

function defaultState(){return {week:1,selectedDay:Math.min(new Date().getDay()+6,6)%7,energy:3,soreness:3,doneDays:Array(7).fill(false),checks:{},logs:{},history:[]}}
function loadState(){try{return {...defaultState(),...(JSON.parse(localStorage.getItem(STORAGE_KEY))||{})}}catch{return defaultState()}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
const $=s=>document.querySelector(s);

function adjustment(){
 if(state.energy<=2||state.soreness>=4)return 'Recovery adjustment: cut lower-body volume about 30–40%, skip maximal jumps/sprints, and replace hard running with easy bike, elliptical, or walking.';
 if(state.energy>=4&&state.soreness<=2)return 'Green light: complete the full session. Keep strength around RIR 1–2 and explosive work fast and crisp. Optional: add 10–15 min easy Zone 2.';
 return 'Normal day: follow the plan as written. Most strength work should finish with about 2 reps in reserve.';
}

function renderToday(){
 const d=plan[state.selectedDay];
 let html=`<div class="day-picker">${plan.map((x,i)=>`<button class="day-chip ${i===state.selectedDay?'active':''} ${state.doneDays[i]?'done':''}" data-day="${i}">${x.short}</button>`).join('')}</div>`;
 html+=`<div class="card"><div class="day-head"><div><div class="big">${d.name}</div><div class="focus">${d.focus}</div></div><label class="row">Done <input id="dayDone" type="checkbox" ${state.doneDays[state.selectedDay]?'checked':''}></label></div><div class="recovery">${adjustment()}</div>`;
 d.sessions.forEach((s,si)=>{html+=`<div class="session"><h3>${s[0]}</h3>`;s[1].forEach((item,ii)=>{const k=`${state.selectedDay}-${si}-${ii}`;html+=`<label class="exercise"><input type="checkbox" data-check="${k}" ${state.checks[k]?'checked':''}><span>${item}</span></label>`});html+='</div>'});
 html+='</div>';$('#today').innerHTML=html;
 document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>{state.selectedDay=+b.dataset.day;save();renderAll()}));
 $('#dayDone').addEventListener('change',e=>{state.doneDays[state.selectedDay]=e.target.checked;save();renderAll()});
 document.querySelectorAll('[data-check]').forEach(cb=>cb.addEventListener('change',()=>{state.checks[cb.dataset.check]=cb.checked;save();renderProgress()}));
}

function renderWeek(){
 $('#week').innerHTML=`<div class="week-grid">${plan.map((d,i)=>`<button class="week-day ${i===state.selectedDay?'active':''}" data-weekday="${i}"><div class="strength-head"><strong>${state.doneDays[i]?'✓ ':''}${d.short} — ${d.name}</strong><span class="badge">${i===4?'athletic':i>=5?'recovery':i===0||i===2?'lower':'mixed'}</span></div><div class="focus">${d.focus}</div></button>`).join('')}</div>`;
 document.querySelectorAll('[data-weekday]').forEach(b=>b.addEventListener('click',()=>{state.selectedDay=+b.dataset.weekday;save();showTab('today');renderAll()}));
}

function renderStrength(){
 const deload=state.week===6;
 $('#strength').innerHTML=`<div class="card"><div class="strength-head"><div><div class="big">Strength — Week ${state.week}</div><div class="focus">${deload?'Deload: reduce sets about 30–50% and use comfortable loads.':'Same exercises every week. Add reps first; then add weight.'}</div></div><span class="badge">RIR 2–3 → 1–2</span></div></div>`+strength.map((ex,i)=>{
  const log=state.logs[i]||{weight:'',reps:'',rir:'2'};
  return `<div class="strength-card"><div class="strength-head"><strong>${ex[0]}</strong><span class="badge">${ex[1]} • ${ex[2]}</span></div><div class="strength-grid"><label>Weight<input data-log="${i}" data-field="weight" value="${log.weight}" placeholder="lb/kg" inputmode="decimal"></label><label>Best reps<input data-log="${i}" data-field="reps" value="${log.reps}" placeholder="reps" inputmode="numeric"></label><label>RIR<select data-log="${i}" data-field="rir"><option ${log.rir==='3'?'selected':''}>3</option><option ${log.rir==='2'?'selected':''}>2</option><option ${log.rir==='1'?'selected':''}>1</option><option ${log.rir==='0'?'selected':''}>0</option></select></label></div><div class="note">When all work sets hit the top of the rep range with RIR 1–2, increase the load slightly next time.</div></div>`
 }).join('');
 document.querySelectorAll('[data-log]').forEach(el=>el.addEventListener('input',()=>{const i=el.dataset.log;state.logs[i]=state.logs[i]||{weight:'',reps:'',rir:'2'};state.logs[i][el.dataset.field]=el.value;save();renderProgress()}));
}

function renderAthletic(){
 $('#athletic').innerHTML=`<div class="card"><div class="big">Explosiveness</div><ul class="list"><li>Wednesday = short reaction exposure.</li><li>Friday = main explosive session.</li><li>Use 5–10 m accelerations, lateral movement, split-step reactions and change of direction.</li><li>Take enough rest to keep every rep fast.</li><li>Stop when speed or technique clearly drops.</li></ul></div><div class="card"><div class="big">Running</div><ul class="list"><li>Tuesday: 30 min easy.</li><li>Thursday: intervals.</li><li>Friday: main endurance day, usually 8–12 km.</li><li>Bike or elliptical replaces impact when court load is high.</li><li>No need to force a long run after an exhausting tennis weekend.</li></ul></div><div class="card"><div class="big">Mobility priorities</div><div class="focus">Ankles • calves • hip flexors • adductors • hamstrings • thoracic rotation • shoulders</div></div>`;
}

function renderProgress(){
 const done=state.doneDays.filter(Boolean).length;
 const checked=Object.values(state.checks).filter(Boolean).length;
 const logged=Object.values(state.logs).filter(x=>x&&x.weight).length;
 $('#progress').innerHTML=`<div class="metric-grid"><div class="metric"><div class="small">Days done</div><div class="value">${done}/7</div></div><div class="metric"><div class="small">Exercises checked</div><div class="value">${checked}</div></div><div class="metric"><div class="small">Strength lifts logged</div><div class="value">${logged}</div></div></div><div class="card"><div class="big">Coverage</div><div class="focus">Quads ✓✓ • Glutes ✓✓✓ • Hamstrings ✓✓ • Calves ✓✓✓ • Adductors ✓✓ • Abductors ✓✓ • Back ✓✓ • Shoulders ✓✓ • Chest ✓ • Arms ✓ • Core ✓✓✓✓ • Explosiveness ✓✓ • Running ✓✓✓</div></div>`;
}

function renderHeader(){
 $('#weekNumber').textContent=`Week ${state.week} of 6`;$('#energy').value=state.energy;$('#soreness').value=state.soreness;
}
function renderAll(){renderHeader();renderToday();renderWeek();renderStrength();renderAthletic();renderProgress()}
function showTab(name){document.querySelectorAll('.panel').forEach(p=>p.classList.add('hidden'));$('#'+name).classList.remove('hidden');document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name))}

document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
$('#energy').addEventListener('change',e=>{state.energy=+e.target.value;save();renderToday()});
$('#soreness').addEventListener('change',e=>{state.soreness=+e.target.value;save();renderToday()});
$('#prevWeek').addEventListener('click',()=>{state.week=Math.max(1,state.week-1);save();renderAll()});
$('#nextWeek').addEventListener('click',()=>{state.week=Math.min(6,state.week+1);save();renderAll()});
$('#resetData').addEventListener('click',()=>{if(confirm('Reset all workout data?')){localStorage.removeItem(STORAGE_KEY);location.reload()}});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden')});
$('#installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').classList.add('hidden')});

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
renderAll();showTab('today');
