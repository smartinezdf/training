const STORAGE_KEY='numa-training-v2';
const state=loadState();
let deferredPrompt=null;

const plan=[
 {short:'Mon',name:'Monday',focus:'Lower Body + Cardio — Lower is the priority',sessions:[
  ['LOWER BODY',['Squat / hack squat — 4 × 5–6','RDL — 3 × 6–8','Bulgarian split squat — 3 × 8 each leg','Hip thrust — 3 × 8','Shin / tibialis raises — 3 × 10','Calf raises — 3 × 12','Core — 3 sets']],
  ['CARDIO — choose based on how you feel',['30 min running','OR 25 min elliptical','OR 20 min StairMaster']],
  ['Optional',['If you finish everything and still feel good, you can add a little upper body. Totally optional — do not add volume just to do more.']]
 ]},
 {short:'Tue',name:'Tuesday',focus:'Upper Body — Day 1 Pull + Push + optional cardio',sessions:[
  ['UPPER BODY — DAY 1',['Lat pulldown — 3 × 8–10','DB bench press — 3 × 8–10','Seated cable row — 3 × 8–10','DB shoulder press — 3 × 8–10','Face pulls — 3 × 12–15','Bicep curls — 3 × 10–12','Tricep rope pushdown — 3 × 10–12']],
  ['Cardio',['Optional — choose the cardio that fits your energy and schedule.']],
  ['Strength note',['The last 2–3 reps should feel challenging while technique stays clean. You do not need to reach failure on every exercise.']]
 ]},
 {short:'Wed',name:'Wednesday',focus:'HIIT Full Body — strength + cardio + coordination + endurance',sessions:[
  ['WARM-UP — 8–10 min',['2 min easy jog','30 sec jumping jacks','30 sec high knees','30 sec butt kicks','10 walking lunges','10 air squats','10 inchworms','Hip, ankle and shoulder mobility']],
  ['HIIT CIRCUIT — 40 sec work / 20 sec rest',['Squat jumps','Push-ups','Walking lunges','Mountain climbers','DB thrusters — squat then drive dumbbells overhead','Burpees','Alternating reverse lunges + knee drive','Renegade rows — keep hips stable','Skater jumps — land with control','Plank shoulder taps — keep hips stable']],
  ['FINISHER — 3 rounds',['30 sec sprint / max effort','30 sec walk or rest','30 sec high knees','30 sec rest','Rest 1–2 min between rounds']],
  ['Today’s goal',['This is the hard conditioning day. No extra cardio afterward. Push the intensity while keeping control and good technique.']]
 ]},
 {short:'Thu',name:'Thursday',focus:'Upper Body — Day 2 Back + Shoulders + optional cardio',sessions:[
  ['UPPER BODY — DAY 2',['Pull-ups / assisted pull-ups — 3 × 5–8','Single-arm DB row — 3 × 8–10 each side','Incline DB press — 3 × 8–10','Lateral raises — 3 × 12–15','Hammer curls — 3 × 10–12','Tricep overhead extension — 3 × 10–12']],
  ['Cardio',['Optional — choose the cardio that fits your energy and schedule.']],
  ['Strength note',['The last 2–3 reps should feel challenging while technique stays clean. You do not need to reach failure on every exercise.']]
 ]},
 {short:'Fri',name:'Friday',focus:'Lower Body + Cardio — Lower is the priority',sessions:[
  ['LOWER BODY',['Deadlift — 3 × 5','Goblet / front squat — 3 × 8','Walking lunges — 3 × 10 each leg','Hip thrust — 3 × 8–10','Hamstring curl — 3 × 10','Calf raises — 3 × 12','Core — 3 sets']],
  ['CARDIO — choose one',['30–45 min running','OR 12–15 × 1 min fast / 1 min easy','OR 25 min StairMaster','OR 30 min elliptical']],
  ['Optional',['If you finish everything and feel great, you can add upper body. It is not required. Lower body remains the priority.']],
  ['Why hamstrings stay',['Hamstring work stays in the program because it is important for running and leg strength/stability.']]
 ]},
 {short:'Sat',name:'Saturday',focus:'Upper Body — Day 3 Full Upper + tennis workload',sessions:[
  ['UPPER BODY — DAY 3',['Lat pulldown — 3 × 8–10','DB bench press — 3 × 8–10','Cable row — 3 × 8–10','Arnold press — 3 × 8–10','Lateral raises — 3 × 12–15','Face pulls — 3 × 12–15','Biceps + triceps — 3 × 10–12 each']],
  ['Tennis / schedule',['Fit this upper session around your tennis workload. If the day is especially demanding, reduce or move the session instead of forcing volume.']],
  ['Strength note',['The last 2–3 reps should feel challenging while technique stays clean. You do not need to reach failure on every exercise.']]
 ]},
 {short:'Sun',name:'Sunday',focus:'Recovery / Tennis — no required gym session',sessions:[
  ['RECOVERY',['Tennis lessons / activity as scheduled','Easy walking if desired','Hip, ankle, calf, hamstring and shoulder mobility','No required strength or cardio session']]
 ]}
];

const strength=[
 ['Squat / hack squat','Monday Lower','5–6'],['RDL','Monday Lower','6–8'],['Bulgarian split squat','Monday Lower','8 each'],['Hip thrust','Lower','8–10'],['Shin / tibialis raise','Monday Lower','10'],['Calf raise','Lower','12'],
 ['Lat pulldown','Upper','8–10'],['DB bench press','Upper','8–10'],['Seated / cable row','Upper','8–10'],['DB shoulder press','Upper','8–10'],['Face pulls','Upper','12–15'],['Bicep curls','Upper','10–12'],['Tricep rope pushdown','Upper','10–12'],
 ['Pull-ups / assisted','Thursday Upper','5–8'],['Single-arm DB row','Thursday Upper','8–10'],['Incline DB press','Thursday Upper','8–10'],['Lateral raises','Upper','12–15'],['Hammer curls','Thursday Upper','10–12'],['Tricep overhead extension','Thursday Upper','10–12'],
 ['Deadlift','Friday Lower','5'],['Goblet / front squat','Friday Lower','8'],['Walking lunges','Friday Lower','10 each'],['Hamstring curl','Friday Lower','10'],['Arnold press','Saturday Upper','8–10']
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
 $('#athletic').innerHTML=`<div class="card"><div class="big">Wednesday HIIT</div><ul class="list"><li>Warm up for 8–10 minutes before starting.</li><li>Main circuit: 40 seconds work + 20 seconds rest for each of the 10 exercises.</li><li>Keep movement controlled even when intensity rises.</li><li>Finisher: 3 rounds of sprint, recovery, high knees and rest.</li><li>Rest 1–2 minutes between finisher rounds.</li><li>No additional cardio is needed after this session.</li></ul></div><div class="card"><div class="big">Cardio structure</div><ul class="list"><li>Monday: cardio only after lower body; choose run, elliptical or StairMaster.</li><li>Tuesday/Thursday: cardio is flexible and optional around upper body.</li><li>Wednesday: HIIT is the conditioning session.</li><li>Friday: cardio after lower; choose steady running, intervals, StairMaster or elliptical.</li><li>Lower-body strength always comes before cardio on Monday and Friday.</li></ul></div><div class="card"><div class="big">Strength rule</div><div class="focus">Keep the exercises consistent week to week. The last 2–3 reps should be difficult but technically clean. You do not need to train every set to failure.</div></div>`;
}

function renderProgress(){
 const done=state.doneDays.filter(Boolean).length;
 const checked=Object.values(state.checks).filter(Boolean).length;
 const logged=Object.values(state.logs).filter(x=>x&&x.weight).length;
 $('#progress').innerHTML=`<div class="metric-grid"><div class="metric"><div class="small">Days done</div><div class="value">${done}/7</div></div><div class="metric"><div class="small">Exercises checked</div><div class="value">${checked}</div></div><div class="metric"><div class="small">Strength lifts logged</div><div class="value">${logged}</div></div></div><div class="card"><div class="big">Coverage</div><div class="focus">Quads ✓✓ • Glutes ✓✓ • Hamstrings ✓✓ • Calves ✓✓ • Tibialis ✓ • Back ✓✓✓ • Shoulders ✓✓✓ • Chest ✓✓✓ • Biceps ✓✓✓ • Triceps ✓✓✓ • Core ✓✓ • HIIT ✓ • Cardio ✓✓+</div></div>`;
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
