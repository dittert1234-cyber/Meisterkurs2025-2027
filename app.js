const defaultParticipants = [
  {last:"Dittert", first:"Sebastian", kst:"13701"},
  {last:"Hachenberg", first:"Marcel", kst:"13701"},
  {last:"Schiffner", first:"Pierre", kst:"50212"},
  {last:"Treichel", first:"Viktor", kst:"50212"},
  {last:"Schmidt", first:"Steffen", kst:"25901"},
  {last:"Caltepe", first:"Yusuf", kst:"25901"},
  {last:"Warkentin", first:"Kevin", kst:"4140002611"},
  {last:"Birinci", first:"Enez", kst:"25702"},
  {last:"Bavtijari", first:"Nebi", kst:"25702"},
  {last:"Przystarz", first:"Krystian", kst:"25705"}
];
const participants = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem("attendance-participants") || "null");
    return Array.isArray(saved) && saved.length ? saved : defaultParticipants.map(p=>({...p}));
  } catch { return defaultParticipants.map(p=>({...p})); }
})();
// Erstimport der historischen Listen. ? = noch manuell zu prüfen; zählt NICHT als Anwesenheit.
const historicalSeed = {
 '2025-04':[2,5,23,26,28], '2025-06':[11,14,16,18,28], '2025-07':[2], '2025-08':[20,23,25,30],
 '2025-11':[1,3,5,8,10,12,15,17,19,24,29], '2025-12':[1,3,6,8,10,13,15,20],
 '2026-01':[12,14,17,19,21,24,26,28,31], '2026-02':[2,4,7,9,11,14,16,18,21,23,25],
 '2026-03':[2,4,9,11,14,18,21,23,25,28], '2026-04':[15],
 '2026-05':[4,6,9,11,13,18,20,27,30], '2026-06':[1,3,8,10,13,15,17,20,22,24],
 '2026-08':[8,10,12,15,17,19,22,24,26,29,31],
 '2026-09':[2,5,7,9,14,16,19,21,23,26,28,30]
};
// Gut lesbare Einträge aus den Originalfotos Januar bis April 2026.
// Ein Slash bleibt Abwesenheit; leere/unklare Felder werden mit ? zur Prüfung markiert.
const transcribed = {
 '2026-01': [
  ['/', 'SD','SD','SD','SD','SD','/','/','SD'],
  ['MH','MH','MH','MH','MH','MH','MH','MH','MH'],
  ['PS','/','PS','PS','PS','PS','PS','PS','PS'],
  ['VT','VT','VT','VT','VT','VT','VT','VT','/'],
  ['STS','STS','STS','STS','STS','STS','STS','STS','STS'],
  ['YC','YC','/','YC','/','YC','YC','/','YC'],
  ['KW','KW','KW','KW','KW','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB'],
  ['NB','NB','NB','/','NB','NB','NB','NB','NB'],
  ['KP','KP','KP','KP','KP','KP','KP','KP','KP']
 ],
 '2026-02': [
  ['SD','/','SD','SD','SD','SD','/','SD','SD','/','SD'],
  ['MH','/','MH','MH','/','MH','MH','MH','/','MH','MH'],
  ['PS','/','PS','PS','PS','PS','PS','PS','PS','PS','PS'],
  ['VT','VT','VT','VT','/','VT','VT','VT','VT','/','VT'],
  ['STS','STS','STS','STS','STS','STS','STS','STS','STS','STS','STS'],
  ['YC','YC','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
  ['KW','KW','KW','KW','KW','KW','/','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB','EB','?'],
  ['NB','/','NB','NB','NB','NB','NB','NB','NB','NB','?'],
  ['KP','KP','KP','/','KP','KP','KP','/','KP','KP','KP']
 ],
 '2026-03': [
  ['SD','SD','/','SD','SD','SD','SD','SD','SD','SD'],
  ['MH','MH','MH','MH','MH','MH','/','MH','MH','MH'],
  ['PS','PS','PS','/','PS','PS','/','PS','PS','PS'],
  ['VT','VT','VT','VT','VT','VT','VT','VT','VT','VT'],
  ['STS','STS','STS','STS','/','STS','STS','STS','STS','STS'],
  ['YC','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
  ['KW','KW','KW','KW','KW','KW','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB','EB'],
  ['NB','NB','NB','NB','NB','NB','NB','NB','NB','NB'],
  ['KP','KP','KP','KP','KP','/','KP','KP','KP','KP']
 ],
 '2026-04': [['SD'],['MH'],['PS'],['VT'],['STS'],['YC'],['KW'],['EB'],['NB'],['KP']]
};
function installHistoricalSeed(){
  // Neue historische Monate separat ergänzen, ohne bereits gespeicherte Monate/Änderungen zu überschreiben.
  if(!localStorage.getItem('attendance:2026-09')) {
    const month='2026-09';
    const dayNums=historicalSeed[month];
    const dates=dayNums.map(d=>`${month}-${String(d).padStart(2,'0')}`);
    const rows=[
      ['/','SD','SD','SD','/','SD','SD','SD','SD','/','/','?'],
      ['MH','MH','/','MH','MH','MH','MH','MH','MH','MH','/','?'],
      ['PS','PS','PS','PS','PS','PS','?','PS','/','PS','?','?'],
      ['VT','VT','/','/','VT','VT','VT','VT','VT','VT','VT','?'],
      ['STS','/','STS','STS','STS','/','STS','STS','STS','STS','STS','STS'],
      ['YC','YC','/','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
      ['KW','KW','KW','KW','KW','KW','KW','KW','KW','KW','KW','KW'],
      ['EB','EB','/','/','/','EB','EB','EB','EB','EB','EB','EB'],
      ['NB','/','/','/','NB','NB','NB','NB','/','NB','/','NB'],
      ['/','/','/','/','KP','KP','KP','KP','KP','KP','KP','/']
    ];
    const attendance={}; dates.forEach((d,j)=>{attendance[d]={}; rows.forEach((r,i)=>attendance[d][i]=r[j]||'?');});
    localStorage.setItem('attendance:'+month,JSON.stringify({dates,attendance,source:'September 2026 vom Foto übertragen; ? = prüfen, bitte Handschrift kontrollieren'}));
  }
  if(localStorage.getItem('attendance-historical-seed-v1')) return;
  Object.entries(historicalSeed).forEach(([month,dayNums])=>{
    const dates=dayNums.map(d=>`${month}-${String(d).padStart(2,'0')}`);
    const attendance={};
    dates.forEach(d=>{attendance[d]={}; for(let i=0;i<defaultParticipants.length;i++) attendance[d][i]='?';});
    const rows=transcribed[month];
    if(rows) rows.forEach((vals,i)=>vals.forEach((v,j)=>{if(dates[j]) attendance[dates[j]][i]=v;}));
    localStorage.setItem('attendance:'+month,JSON.stringify({dates,attendance,source:'historische Liste; ? = prüfen'}));
  });
  localStorage.setItem('attendance-historical-seed-v1','done');
}

const $ = id => document.getElementById(id);
function saveParticipants(){ localStorage.setItem("attendance-participants", JSON.stringify(participants)); }
function initialsForParticipant(i){
  const p=participants[i] || {};
  const known=["SD","MH","PS","VT","STS","YC","KW","EB","NB","KP"];
  return known[i] || ((p.first||"").trim()[0]+(p.last||"").trim()[0]).toUpperCase();
}
function normalizeAttendanceValue(value, i){
  const v=String(value ?? "").trim().toUpperCase();
  return v && v===initialsForParticipant(i) ? v : "";
}
function normalizeStoredMonths(){
  Object.keys(localStorage).filter(key=>/^attendance:\d{4}-\d{2}$/.test(key)).forEach(key=>{
    try{
      const data=JSON.parse(localStorage.getItem(key)||"{}");
      for(const date of (data.dates||[])){
        const row=(data.attendance||{})[date] || {};
        for(let i=0;i<participants.length;i++) row[i]=normalizeAttendanceValue(row[i],i);
        data.attendance=data.attendance||{}; data.attendance[date]=row;
      }
      localStorage.setItem(key,JSON.stringify(data));
    }catch(err){console.warn("Monat konnte nicht bereinigt werden:",key,err);}
  });
}
normalizeStoredMonths();
const now = new Date();
const monthInput = $("month");
monthInput.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
let dates = [];
let attendance = {};
let hourSettings = {totalHours:1000, requiredPercent:70, weekdayHours:4, saturdayHours:6};


function monthKey(){return monthInput.value || `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;}
function loadMonth(){
  const saved = JSON.parse(localStorage.getItem("attendance:"+monthKey()) || "{}");
  dates = saved.dates || [];
  attendance = saved.attendance || {};
  render();
  renderOverview();
  renderArchiveList();
}
let cloudSaveTimer=null;
let cloudSaveInProgress=Promise.resolve();
function queueCloudSave(){
  if(cloudSaveTimer) clearTimeout(cloudSaveTimer);
  if(window.attendanceCloud && window.attendanceCloud.isReady()){
    showStatus("Änderung lokal gesichert – Synchronisierung läuft …",false,false);
    cloudSaveTimer=setTimeout(async()=>{
      cloudSaveTimer=null;
      try { await window.attendanceCloud.saveAll(); showStatus("Automatisch in Supabase gespeichert.",false,true); }
      catch(err){ console.error(err); showStatus("Noch nicht in Supabase gespeichert. Bitte Internet prüfen und auf Speichern drücken. "+(err.message||err),true); }
    },700);
  }
}
function saveMonth(){localStorage.setItem("attendance:"+monthKey(),JSON.stringify({dates,attendance})); queueCloudSave();}
function showStatus(message,error=false,ok=false){const el=$("status");el.textContent=message;el.className="status"+(error?" error":ok?" ok":"");}
function saveHourSettings(){
  hourSettings = {
    totalHours: Math.max(1, Number($("totalHours").value)||1000),
    requiredPercent: Math.min(100,Math.max(0,Number($("requiredPercent").value)||0)),
    weekdayHours: Math.max(0,Number($("weekdayHours").value)||0),
    saturdayHours: Math.max(0,Number($("saturdayHours").value)||0)
  };
  localStorage.setItem("attendance-hour-settings", JSON.stringify(hourSettings));
  renderOverview();
}
function getGlobalHourCorrection(){
  const value=Number(localStorage.getItem("attendance-global-hour-correction")||0);
  return Number.isFinite(value)?value:0;
}
function setGlobalHourCorrection(value){
  const parsed=Number(value);
  const next=Number.isFinite(parsed)?parsed:0;
  localStorage.setItem("attendance-global-hour-correction",String(next));
  renderOverview();
  queueCloudSave();
}
function dayHours(date){
  const day = new Date(date+"T12:00:00").getDay(); // 0=Sun, 6=Sat
  if(day===0) return 0;
  return day===6 ? hourSettings.saturdayHours : hourSettings.weekdayHours;
}
function isPresent(value){
  const v=(value||"").trim();
  return v!=="" && v!=="?" && v!=="/" && v!=="—" && v!=="-" && !["E","K","U"].includes(v.toUpperCase());
}
function ensureReviewOptions(){
  const select=$("reviewParticipant");
  if(!select) return;
  const current=select.value;
  select.innerHTML="";
  participants.forEach((p,i)=>{
    const option=document.createElement("option");
    option.value=String(i);
    option.textContent=`${i+1}. ${p.first} ${p.last}`;
    select.appendChild(option);
  });
  if(current && Number(current)<participants.length) select.value=current;
}
function renderDayReview(){
  const select=$("reviewParticipant");
  const body=$("dayReviewBody");
  if(!select || !body) return;
  const index=Number(select.value||0);
  const p=participants[index];
  body.innerHTML="";
  dates.forEach(date=>{
    const tr=document.createElement("tr");
    const d=new Date(date+"T12:00:00");
    const weekday=d.toLocaleDateString("de-DE",{weekday:"long"});
    const hours=dayHours(date);
    const tdDate=document.createElement("td");tdDate.textContent=d.toLocaleDateString("de-DE");tr.appendChild(tdDate);
    const tdDay=document.createElement("td");tdDay.textContent=weekday;tr.appendChild(tdDay);
    const tdHours=document.createElement("td");tdHours.textContent=`${hours} Std.`;tr.appendChild(tdHours);
    const tdStatus=document.createElement("td");
    const status=document.createElement("select");
    status.className="attendance-status";
    [["","Nicht eingetragen / abwesend"],["X","Anwesend"],["/","Abwesend"],["E","Entschuldigt"],["K","Krank"],["U","Unentschuldigt"]].forEach(([value,label])=>{
      const option=document.createElement("option");option.value=value;option.textContent=label;status.appendChild(option);
    });
    const current=(attendance[date]||{})[index]||"";
    status.value=isPresent(current)?"X":current==="/"?"/":["E","K","U"].includes(current)?current:"";
    status.addEventListener("change",()=>{
      attendance[date]=attendance[date]||{};
      attendance[date][index]=status.value;
      saveMonth();
      renderOverview();
      renderDayReview();
      showStatus("Anwesenheit geändert und gespeichert.",false,true);
    });
    tdStatus.appendChild(status);tr.appendChild(tdStatus);
    body.appendChild(tr);
  });
}
function getSavedMonths(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key && key.startsWith("attendance:") && /^attendance:\d{4}-\d{2}$/.test(key)) keys.push(key);
  }
  return keys.sort().map(key=>{
    try { return {month:key.slice("attendance:".length), data:JSON.parse(localStorage.getItem(key)||"{}")}; }
    catch { return {month:key.slice("attendance:".length),data:{dates:[],attendance:{}}}; }
  });
}
function monthLabelForKey(key){const [y,m]=key.split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString("de-DE",{month:"long",year:"numeric"});}
function renderPersonTabs(){
  const box=$("personTabs"); if(!box) return;
  const current=Number($("reviewParticipant")?.value||0);
  box.innerHTML="";
  participants.forEach((p,i)=>{
    const b=document.createElement("button"); b.type="button"; b.className="person-tab"+(i===current?" active":"");
    b.setAttribute("role","tab"); b.setAttribute("aria-selected",String(i===current));
    b.textContent=`${p.first} ${p.last}`;
    b.addEventListener("click",()=>{$("reviewParticipant").value=String(i);renderOverview();});
    box.appendChild(b);
  });
}
function renderPersonMonthTable(index){
  const body=$("personMonthBody"); if(!body) return;
  body.innerHTML="";
  const months=getSavedMonths();
  let allPresentDays=0,allDays=0,allPresentHours=0,allScheduledHours=0;
  months.forEach(({month,data})=>{
    const monthDates=(data.dates||[]).slice().sort();
    let presentDays=0,scheduledHours=0,presentHours=0;
    monthDates.forEach(d=>{
      const h=dayHours(d); scheduledHours+=h;
      if(isPresent(((data.attendance||{})[d]||{})[index])) { presentDays++; presentHours+=h; }
    });
    allPresentDays+=presentDays; allDays+=monthDates.length; allPresentHours+=presentHours; allScheduledHours+=scheduledHours;
    const tr=document.createElement("tr");
    const vals=[monthLabelForKey(month),`${presentDays}`,`${monthDates.length}`,`${monthDates.length?(presentDays/monthDates.length*100).toLocaleString("de-DE",{maximumFractionDigits:1}):"0,0"} %`,`${presentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`];
    vals.forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);}); body.appendChild(tr);
  });
  const tr=document.createElement("tr");tr.className="total-row";
  const pct=allDays?allPresentDays/allDays*100:0;
  const vals=["GESAMT",`${allPresentDays}`,`${allDays}`,`${pct.toLocaleString("de-DE",{maximumFractionDigits:1})} %`,`${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`];
  vals.forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);});body.appendChild(tr);
}
function renderOverview(){
  const body=$("overviewBody");
  if(!body) return;
  const months=getSavedMonths();
  const allDates=new Set();
  months.forEach(({data})=>(data.dates||[]).forEach(d=>allDates.add(d)));
  const datesAll=[...allDates].sort();
  const rawScheduledHours=datesAll.reduce((sum,d)=>sum+dayHours(d),0);
  const globalCorrection=getGlobalHourCorrection();
  const scheduledHours=Math.max(0,rawScheduledHours+globalCorrection);
  const correctionInput=$("globalHourCorrection");
  if(correctionInput && document.activeElement!==correctionInput) correctionInput.value=String(globalCorrection);
  const courseSummary=$("courseHoursSummary");
  if(courseSummary) courseSummary.textContent=`Unterricht bisher: ${scheduledHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Stunden nach Korrektur (${rawScheduledHours.toLocaleString("de-DE",{maximumFractionDigits:1})} erfasst, ${globalCorrection>0?"+":""}${globalCorrection.toLocaleString("de-DE",{maximumFractionDigits:1})} Std. Korrektur) · ${datesAll.length} Unterrichtstage`;
  let corrections={};
  try { corrections=JSON.parse(localStorage.getItem("attendance-hour-corrections")||"{}"); } catch { corrections={}; }
  body.innerHTML="";
  participants.forEach((p,i)=>{
    let presentHours=0;
    datesAll.forEach(date=>{
      const month=months.find(m=>m.month===date.slice(0,7));
      if(month && isPresent(((month.data.attendance||{})[date]||{})[i])) presentHours+=dayHours(date);
    });
    // Name + KST bilden einen stabilen Schlüssel, damit die Korrektur zur Person gehört.
    const correctionKey=[p.kst||"",p.last||"",p.first||""].join("|");
    const correction=Number(corrections[correctionKey]||0);
    const adjustedHours=Math.max(0,presentHours+correction);
    const pct=scheduledHours>0?adjustedHours/scheduledHours*100:0;
    const tr=document.createElement("tr");
    const nameCell=document.createElement("td");
    nameCell.textContent=`${p.first} ${p.last}`; nameCell.className="participant-name-cell"; tr.appendChild(nameCell);
    const totalCell=document.createElement("td"); totalCell.textContent=`${scheduledHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`; tr.appendChild(totalCell);
    const recordedCell=document.createElement("td"); recordedCell.textContent=`${presentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`; tr.appendChild(recordedCell);
    const correctionCell=document.createElement("td");
    const correctionInput=document.createElement("input");
    correctionInput.type="number"; correctionInput.step="0.5"; correctionInput.value=String(correction);
    correctionInput.className="hour-correction-input"; correctionInput.setAttribute("aria-label",`Stundenkorrektur für ${p.first} ${p.last}`);
    correctionInput.title="Positive Zahl addiert Stunden, negative Zahl zieht Stunden ab";
    correctionInput.addEventListener("change",()=>{
      const raw=correctionInput.value.trim();
      const next=raw===""?0:Number(raw);
      if(!Number.isFinite(next)) return;
      corrections[correctionKey]=next;
      localStorage.setItem("attendance-hour-corrections",JSON.stringify(corrections));
      renderOverview();
      queueCloudSave();
    });
    correctionCell.appendChild(correctionInput);
    const unit=document.createElement("span"); unit.textContent=" Std."; correctionCell.appendChild(unit); tr.appendChild(correctionCell);
    const adjustedCell=document.createElement("td"); adjustedCell.textContent=`${adjustedHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`; adjustedCell.className="corrected-hours"; tr.appendChild(adjustedCell);
    const pctCell=document.createElement("td"); pctCell.textContent=`${pct.toLocaleString("de-DE",{maximumFractionDigits:1})} %`; pctCell.className="review-percent"; tr.appendChild(pctCell);
    body.appendChild(tr);
  });
}

function render(){
  const head=$("tableHead");
  head.innerHTML='<th>Nr.</th><th>Nachname</th><th>Vorname</th><th>KST.</th>';
  dates.forEach((date,index)=>{
    const th=document.createElement("th");th.className="date-head";
    const label=document.createElement("span");label.textContent=new Date(date+"T12:00:00").getDate()+".";
    const del=document.createElement("button");del.className="remove-date";del.textContent="entfernen";del.title="Unterrichtstag entfernen";
    del.addEventListener("click",()=>{dates.splice(index,1);saveMonth();render();});
    th.append(label,del);head.appendChild(th);
  });
  const body=$("tableBody");body.innerHTML="";
  participants.forEach((person,i)=>{
    const tr=document.createElement("tr");
    const num=document.createElement("td");num.textContent=String(i+1);tr.appendChild(num);
    [["last","name"],["first","name"],["kst","kst"]].forEach(([field,cls])=>{
      const td=document.createElement("td");td.className=cls;
      const input=document.createElement("input");input.value=person[field];input.setAttribute("aria-label",`${field} Teilnehmer ${i+1}`);
      input.addEventListener("change",()=>{person[field]=input.value.trim();saveParticipants();renderOverview();showStatus("Teilnehmerdaten gespeichert.",false,true);});
      td.appendChild(input);tr.appendChild(td);
    });
    dates.forEach(date=>{
      const td=document.createElement("td");
      td.className="attendance-cell";
      const input=document.createElement("select");
      input.className="attendance-status attendance-cell-select";
      const initials=initialsForParticipant(i);
      [["","–"],[initials,initials]].forEach(([value,label])=>{
        const option=document.createElement("option"); option.value=value; option.textContent=label; input.appendChild(option);
      });
      input.value=normalizeAttendanceValue((attendance[date]||{})[i]||"",i);
      td.classList.toggle("has-entry",isPresent(input.value));
      input.setAttribute("aria-label",`${person.first} ${person.last}, ${date}`);
      input.title="Nur Teilnehmerkürzel oder Gedankenstrich auswählen";
      input.addEventListener("change",()=>{
        attendance[date]=attendance[date]||{};
        attendance[date][i]=normalizeAttendanceValue(input.value,i);
        input.value=attendance[date][i];
        td.classList.toggle("has-entry",isPresent(input.value));
        td.classList.remove("is-uncertain");
        saveMonth();renderOverview();
        showStatus("Anwesenheit gespeichert.",false,true);
      });
      td.appendChild(input);tr.appendChild(td);
    });
    body.appendChild(tr);
  });
  saveMonth();
  renderOverview();
}
async function addDate(value){
  const date=value || $("newDate").value;
  if(!date){showStatus("Bitte zuerst ein Datum auswählen.",true);return;}
  if(date.slice(0,7)!==monthKey()){showStatus("Das Datum liegt nicht im ausgewählten Monat.",true);return;}
  if(dates.includes(date)){showStatus("Dieser Unterrichtstag ist bereits eingetragen.",true);return;}
  dates.push(date);dates.sort();$("newDate").value="";
  // Zuerst lokal sichern, dann den neu angelegten Tag sofort in die Cloud übertragen.
  localStorage.setItem("attendance:"+monthKey(),JSON.stringify({dates,attendance}));
  render();
  if(cloudSaveTimer){clearTimeout(cloudSaveTimer);cloudSaveTimer=null;}
  if(window.attendanceCloud && window.attendanceCloud.isReady()){
    showStatus("Unterrichtstag hinzugefügt – speichere jetzt in Supabase …",false,false);
    try {
      await window.attendanceCloud.saveAll();
      showStatus("✓ Unterrichtstag "+date+" erfolgreich in Supabase gespeichert.",false,true);
    } catch(err) {
      console.error(err);
      showStatus("✕ Unterrichtstag "+date+" ist nur lokal gespeichert; Supabase-Speichern fehlgeschlagen. Bitte angemeldet bleiben und erneut auf Speichern drücken. "+(err.message||err),true);
    }
  } else {
    showStatus("Unterrichtstag lokal gespeichert, aber nicht in Supabase: Bitte anmelden und anschließend Speichern drücken.",true);
  }
}
function monthLabel(){const [y,m]=monthKey().split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString("de-DE",{month:"long",year:"numeric"});}
function createPdf(){
  if(!window.jspdf || !window.jspdf.jsPDF) throw new Error("PDF-Bibliothek konnte nicht geladen werden. Bitte Internetverbindung prüfen.");
  [...$("tableBody").rows].forEach((row,i)=>{participants[i].last=row.cells[1].querySelector("input").value;participants[i].first=row.cells[2].querySelector("input").value;participants[i].kst=row.cells[3].querySelector("input").value;});
  saveParticipants();
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
  // Originalähnliche Vorlage: Monat/Jahr oben, Teilnehmer links, Datumsfelder rechts.
  doc.setFont("helvetica","bold");doc.setFontSize(13);
  doc.text("Anwesenheitsliste",doc.internal.pageSize.getWidth()-14,12,{align:"right"});
  doc.setFontSize(11);
  doc.text("Meisterkurs Kunststoff/Kautschuk",doc.internal.pageSize.getWidth()-14,18,{align:"right"});
  doc.setFont("helvetica","normal");doc.setFontSize(9);
  const maxDateCols=18;
  const visibleDates=dates.slice(0,maxDateCols);
  const emptyCols=Math.max(0,Math.min(6,maxDateCols-visibleDates.length));
  const dateHeaders=[...visibleDates.map(d=>String(new Date(d+"T12:00:00").getDate())),...Array(emptyCols).fill("")];
  const head=[["Lfd. Nr.","Name","Vorname","KST.",...Array(dateHeaders.length).fill("")]];
  const body=participants.map((p,i)=>[String(i+1),p.last,p.first,p.kst,...visibleDates.map(d=>{const value=String((attendance[d]||{})[i]??"").trim();return value||"X";}),...Array(emptyCols).fill("")]);
  const pageW=doc.internal.pageSize.getWidth();
  const dateCount=dateHeaders.length;
  const fixedWidths={0:11,1:39,2:39,3:22};
  const fixedTotal=Object.values(fixedWidths).reduce((a,b)=>a+b,0);
  const dateWidth=(pageW-20-fixedTotal)/Math.max(1,dateCount);
  const columnStyles={0:{cellWidth:fixedWidths[0]},1:{cellWidth:fixedWidths[1],halign:"left"},2:{cellWidth:fixedWidths[2],halign:"left"},3:{cellWidth:fixedWidths[3]}};
  for(let c=4;c<4+dateCount;c++) columnStyles[c]={cellWidth:dateWidth};
  // Kopfzeile mit Kästchen: Monat/Jahr links und jedes Datum direkt darüber in einer eigenen Spalte.
  const boxY=25, boxH=10, leftX=10, dateStartX=leftX+fixedTotal;
  doc.setDrawColor(75,85,95); doc.setLineWidth(.22);
  doc.rect(leftX,boxY,fixedTotal,boxH);
  doc.setFont("helvetica","bold");doc.setFontSize(9);
  doc.text(`Monat/Jahr: ${monthLabel()}`,leftX+3,boxY+6.2);
  doc.setFont("helvetica","normal");doc.setFontSize(8);
  doc.text("Teilnehmer Continental Korbach",leftX+3,boxY+9.2);
  let xDate=dateStartX;
  dateHeaders.forEach((day)=>{
    doc.rect(xDate,boxY,dateWidth,boxH);
    if(day){
      doc.setFont("helvetica","bold");doc.setFontSize(9);
      doc.text(day, xDate + dateWidth/2, boxY+6.2, {align:"center"});
    }
    xDate += dateWidth;
  });
  doc.autoTable({head,body,startY:boxY+boxH,theme:"grid",styles:{font:"helvetica",fontSize:7,cellPadding:{top:2.2,right:0.6,bottom:2.2,left:0.6},minCellHeight:8,overflow:"visible",halign:"center",valign:"middle",lineColor:[75,85,95],lineWidth:.22,textColor:[25,25,25]},headStyles:{fillColor:[255,255,255],textColor:[25,25,25],fontStyle:"bold",lineColor:[75,85,95]},columnStyles,margin:{left:10,right:10},tableWidth:pageW-20});
  const y=doc.lastAutoTable.finalY+8;
  doc.setFontSize(8);doc.text("Der Teilnehmer bestätigt seine Anwesenheit mit seinem Namenskürzel.",10,Math.min(y,195));
  return doc;
}
function renderArchiveList(){
  const el=$("archiveList"); if(!el) return;
  const months=getSavedMonths().slice().sort((a,b)=>b.month.localeCompare(a.month));
  el.innerHTML="<strong>Vergangene Monate</strong>";
  if(!months.length){el.innerHTML+="<p class=\"muted small\">Noch keine Monate gespeichert.</p>";return;}
  const list=document.createElement("div");list.className="archive-items";
  months.forEach(({month,data})=>{
    const row=document.createElement("div");row.className="archive-item";
    const label=document.createElement("span");label.textContent=monthLabelForKey(month)+` · ${(data.dates||[]).length} Unterrichtseinheiten`;
    const btn=document.createElement("button");btn.type="button";btn.className="button secondary";btn.textContent="Öffnen / bearbeiten";
    btn.addEventListener("click",()=>{$("month").value=month;loadMonth();showMainView(false);activateMenu("attendanceSection");window.scrollTo({top:0,behavior:"smooth"});showStatus(`${monthLabelForKey(month)} geöffnet. Änderungen werden in dieser Monatsliste gespeichert.`,false,true);});
    row.append(label,btn);list.appendChild(row);
  });
  el.appendChild(list);
}
$("archiveMonth")?.addEventListener("click", async ()=>{
  const btn=$("archiveMonth");
  if(btn){btn.disabled=true;btn.dataset.originalText=btn.textContent;btn.textContent="Speichert & legt ab …";}
  try {
    // Erst lokal sichern, dann auf erfolgreiche Cloud-Speicherung warten.
    saveMonth();
    if(!window.attendanceCloud || !window.attendanceCloud.isReady()) {
      throw new Error("Keine aktive Supabase-Verbindung. Bitte anmelden und erneut versuchen.");
    }
    showStatus("Monat wird in Supabase gespeichert …",false,false);
    await window.attendanceCloud.saveAll();
    const archived=JSON.parse(localStorage.getItem("attendance-archived-months")||"[]");
    const key=monthKey();
    if(!archived.includes(key)) archived.push(key);
    localStorage.setItem("attendance-archived-months",JSON.stringify(archived));
    renderArchiveList();
    showStatus(`✓ ${monthLabel()} wurde erfolgreich in Supabase gespeichert und in der Monatsablage abgelegt.`,false,true);
  } catch(err) {
    console.error(err);
    showStatus(`✕ Monat nicht erfolgreich in Supabase gespeichert. Die lokalen Daten bleiben erhalten; bitte Verbindung prüfen und erneut versuchen. ${err.message||err}`,true);
  } finally {
    if(btn){btn.disabled=false;btn.textContent=btn.dataset.originalText||"Monat speichern & ablegen";delete btn.dataset.originalText;}
  }
});

function pdfFileName(){return "Anwesenheit_"+monthKey()+".pdf";}
function pdfBase64(doc){return doc.output("datauristring").split(",")[1];}
$("addDate").addEventListener("click",()=>{$("newDate").focus();});
$("addDateValue").addEventListener("click",()=>addDate());
$("month").addEventListener("change",loadMonth);
function openCurrentMonthPdfPreview(){
  try{
    saveMonth();
    const doc=createPdf();
    // Öffne zuerst ein leeres Fenster synchron zum Klick, damit Browser-Popup-Blocker es nicht blockieren.
    const printWindow=window.open("about:blank","_blank");
    if(!printWindow){
      showStatus("Der Browser hat das Druckfenster blockiert. Bitte Pop-ups für diese Website erlauben und erneut klicken.",true);
      return;
    }
    const blob=doc.output("blob");
    const url=URL.createObjectURL(blob);
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Anwesenheitsliste drucken</title><style>
      *{box-sizing:border-box}body{margin:0;background:#e9edf2;font-family:Arial,sans-serif;color:#183047}
      .toolbar{position:sticky;top:0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:12px 16px;background:#fff;border-bottom:1px solid #ccd5df;box-shadow:0 2px 8px #0001}
      .toolbar strong{margin-right:auto}.toolbar button{border:0;border-radius:8px;padding:10px 16px;font-weight:700;cursor:pointer;background:#174f78;color:white}.toolbar .secondary{background:#e8eef4;color:#183047}
      iframe{display:block;width:100%;height:calc(100vh - 62px);border:0;background:white}
      @media print{.toolbar{display:none}iframe{height:100vh}}
      </style></head><body><div class="toolbar"><strong>Anwesenheitsliste – ${monthLabel()}</strong><button onclick="document.getElementById('pdfFrame').contentWindow.print()">Drucken / als PDF speichern</button><button class="secondary" onclick="sharePdf()">PDF teilen</button></div><iframe id="pdfFrame" title="Druckvorschau"></iframe><script>
      async function sharePdf(){try{const response=await fetch(${JSON.stringify(url)});const blob=await response.blob();const file=new File([blob],${JSON.stringify(pdfFileName())},{type:'application/pdf'});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:${JSON.stringify("Anwesenheitsliste "+monthLabel())}});}else{alert('Teilen wird von diesem Browser nicht unterstützt. Bitte „Drucken / als PDF speichern“ wählen und die Datei anschließend teilen.');}}catch(e){alert('Teilen konnte nicht geöffnet werden. Bitte die Druck-/Speicherfunktion verwenden.');}}
      <\/script></body></html>`);
    printWindow.document.close();
    printWindow.document.getElementById("pdfFrame").src=url;
    showStatus("Druckübersicht geöffnet. Nutze dort „Drucken / als PDF speichern“ oder „PDF teilen“.",false,true);
  }catch(e){showStatus(e.message||"Druckübersicht konnte nicht geöffnet werden.",true);}
}
$("makePdf").addEventListener("click",openCurrentMonthPdfPreview);
$("sendMonthPdf")?.addEventListener("click",openCurrentMonthPdfPreview);
async function makeAndShare(){
  try {
    saveMonth();
    const doc = createPdf();
    const blob = doc.output("blob");
    const file = new File([blob], pdfFileName(), {type:"application/pdf"});
    if (navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
      await navigator.share({files:[file], title:`Anwesenheit ${monthLabel()}`, text:`Anwesenheitsliste ${monthLabel()}`});
      showStatus("Teilen-Menü geöffnet.",false,true);
    } else {
      doc.save(pdfFileName());
      showStatus("PDF heruntergeladen. Öffne die Datei und nutze anschließend „Teilen“ auf deinem Gerät.",false,true);
    }
  } catch(e) {
    if (e && e.name === "AbortError") {
      showStatus("Teilen abgebrochen. Die PDF wurde nicht versendet.",false,false);
    } else {
      showStatus(e.message || "PDF konnte nicht geteilt werden.",true);
    }
  }
}
$("sharePdf").addEventListener("click",makeAndShare);
$("newClass").addEventListener("click",()=>{
  const confirmed=window.confirm("Neue Klasse vorbereiten? Dabei werden alle gespeicherten Anwesenheitsmonate in diesem Browser gelöscht. Die Teilnehmernamen bleiben erhalten und können danach geändert werden. Diese Aktion kann nicht rückgängig gemacht werden.");
  if(!confirmed) return;
  Object.keys(localStorage).filter(key=>key.startsWith("attendance:")).forEach(key=>localStorage.removeItem(key));
  dates=[]; attendance={}; saveMonth(); render(); renderOverview();
  showStatus("Alte Anwesenheitsdaten gelöscht. Du kannst jetzt die Teilnehmernamen für die neue Klasse ändern.",false,true);
});

["totalHours","requiredPercent","weekdayHours","saturdayHours"].forEach(id=>{
  $(id).addEventListener("change",()=>{
    saveHourSettings();
    showStatus("Anwesenheitsberechnung aktualisiert.",false,true);
  });
});
hourSettings=JSON.parse(localStorage.getItem("attendance-hour-settings")||'{"totalHours":1000,"requiredPercent":70,"weekdayHours":4,"saturdayHours":6}');
if ($("useCourseTotal")) $("useCourseTotal").checked = localStorage.getItem("attendance-use-course-total") !== "false";
$("totalHours").value=hourSettings.totalHours;
$("requiredPercent").value=hourSettings.requiredPercent;
$("weekdayHours").value=hourSettings.weekdayHours;
$("saturdayHours").value=hourSettings.saturdayHours;

function showMainView(showOverview){
  document.body.classList.remove("show-overview");
  if(showOverview) renderOverview();
}
$("openOverview")?.addEventListener("click",()=>{
  const opening=!document.body.classList.contains("show-overview");
  showMainView(opening);
  document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",opening ? b.id==="menuOverview" : b.dataset.target==="attendanceSection"));
});
const backButton=document.createElement("button");
backButton.type="button"; backButton.className="button secondary overview-back";
backButton.textContent="← Zurück zur Monatsliste";
backButton.addEventListener("click",()=>{
  showMainView(false);
  document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",b.dataset.target==="attendanceSection"));
});
const overviewPanel=$("overviewPanel");
if(overviewPanel) overviewPanel.insertBefore(backButton,overviewPanel.firstChild);

$("reviewParticipant")?.addEventListener("change",renderOverview);
$("useCourseTotal")?.addEventListener("change",()=>{
  localStorage.setItem("attendance-use-course-total", String($("useCourseTotal").checked));
  const help=$("quoteModeHelp");
  if(help) help.textContent=$("useCourseTotal").checked
    ? "Aktiv: Quote wird auf die eingestellten gesamten Kursstunden bezogen."
    : "Standard: Quote nur bezogen auf die bisher erfassten Unterrichtsstunden.";
  renderOverview();
});


function saveAllLocal(){
  saveMonth();
  saveParticipants();
  saveHourSettings();
}
function downloadLocalBackup(){
  const data={format:'meisterhaft-anwesenheit-backup-v1',createdAt:new Date().toISOString(),origin:location.origin,items:{}};
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key && (key.startsWith('attendance:') || key.startsWith('attendance-'))){
      data.items[key]=localStorage.getItem(key);
    }
  }
  data.items['attendance-participants']=localStorage.getItem('attendance-participants');
  data.items['attendance-hour-settings']=localStorage.getItem('attendance-hour-settings');
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download='Anwesenheit-Backup-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  showStatus('Datenbackup wurde erstellt. Bitte die JSON-Datei sicher aufbewahren.',false,true);
}
$('backupData')?.addEventListener('click',downloadLocalBackup);

function participantIdentity(p){
  return [String(p?.kst||'').trim(),String(p?.last||'').trim().toLowerCase(),String(p?.first||'').trim().toLowerCase()].join('|');
}
function parseBackupText(text){
  let data;
  try { data=JSON.parse(text); } catch { throw new Error('Die Datei ist kein gültiges JSON-Backup.'); }
  if(!data || data.format!=='meisterhaft-anwesenheit-backup-v1' || !data.items || typeof data.items!=='object' || Array.isArray(data.items)) {
    throw new Error('Unbekanntes Backup-Format. Bitte ein Backup aus dieser Anwesenheits-App auswählen.');
  }
  return data;
}
async function restoreLocalBackup(file){
  if(!file) return;
  if(file.size>15*1024*1024) throw new Error('Die Backup-Datei ist ungewöhnlich groß (über 15 MB).');
  const backup=parseBackupText(await file.text());
  const items=backup.items;
  let backupParticipants=[];
  try { backupParticipants=JSON.parse(items['attendance-participants']||'[]'); } catch {}
  if(!Array.isArray(backupParticipants) || !backupParticipants.length) backupParticipants=participants.map(p=>({...p}));
  const currentByIdentity=new Map();
  participants.forEach((p,i)=>currentByIdentity.set(participantIdentity(p),i));
  const indexMap=new Map();
  backupParticipants.forEach((p,oldIndex)=>{
    const match=currentByIdentity.get(participantIdentity(p));
    if(match!==undefined) indexMap.set(String(oldIndex),match);
  });
  const monthEntries=Object.entries(items).filter(([key])=>/^attendance:\d{4}-\d{2}$/.test(key));
  if(!monthEntries.length) throw new Error('Das Backup enthält keine gespeicherten Unterrichtsmonate.');
  const restoredMonths=[];
  for(const [key,raw] of monthEntries){
    let data; try { data=JSON.parse(raw||'{}'); } catch { throw new Error('Der Monat '+key.slice(11)+' ist im Backup beschädigt. Es wurde nichts importiert.'); }
    if(!data || !Array.isArray(data.dates) || !data.attendance || typeof data.attendance!=='object') {
      throw new Error('Der Monat '+key.slice(11)+' hat eine ungültige Struktur. Es wurde nichts importiert.');
    }
    const remapped={dates:[...new Set(data.dates.filter(d=>typeof d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort(),attendance:{}};
    for(const date of remapped.dates){
      const oldRow=data.attendance[date]||{}; const newRow={};
      for(const [oldIndex,newIndex] of indexMap.entries()){
        if(Object.prototype.hasOwnProperty.call(oldRow,oldIndex)) newRow[newIndex]=oldRow[oldIndex];
      }
      remapped.attendance[date]=newRow;
    }
    restoredMonths.push([key,JSON.stringify(remapped)]);
  }
  // Validate all content first, then write. Keep a recoverable copy of the current browser data before changes.
  downloadLocalBackup();
  for(const [key,value] of Object.entries(items)){
    if(!key || typeof value!=='string') continue;
    if(key==='attendance-participants' || key==='attendance-global-hour-correction' || /^attendance:\d{4}-\d{2}$/.test(key)) continue;
    if(key.startsWith('attendance-')) localStorage.setItem(key,value);
  }
  restoredMonths.forEach(([key,value])=>localStorage.setItem(key,value));
  localStorage.setItem('attendance-backup-restore-pending','true');
  loadMonth(); renderArchiveList(); renderOverview();
  const skipped=backupParticipants.length-indexMap.size;
  showStatus(`Backup eingelesen: ${restoredMonths.length} Monat(e). Klicke jetzt auf „Speichern“, damit die Daten mit Supabase abgeglichen werden. Vorhandene Cloud-Zellen haben Vorrang; fehlende Cloud-Einträge werden ergänzt.${skipped?` ${skipped} Teilnehmer aus dem Backup konnten nicht eindeutig zugeordnet werden und wurden für den Import ausgelassen.`:''}`,false,true);
}
$('restoreBackup')?.addEventListener('click',()=>$('backupFileInput')?.click());
$('backupFileInput')?.addEventListener('change',async event=>{
  const input=event.currentTarget; const file=input.files?.[0]; if(!file) return;
  const confirmed=confirm('Backup einlesen? Vorhandene lokale Monatsdaten können ersetzt werden. Vorhandene Supabase-Zellen werden beim anschließenden Speichern geschützt und haben Vorrang. Vor dem Import wird zusätzlich ein Backup des aktuellen Browserstands heruntergeladen.');
  if(!confirmed){input.value='';return;}
  try { await restoreLocalBackup(file); }
  catch(err){ console.error(err); showStatus('Backup konnte nicht wiederhergestellt werden: '+(err.message||err),true); }
  finally { input.value=''; }
});

async function saveAllNow(){
  const btn=$("saveNow");
  if(btn){btn.disabled=true;btn.textContent="Speichert …";}
  if(cloudSaveTimer){clearTimeout(cloudSaveTimer);cloudSaveTimer=null;}
  saveAllLocal();
  // saveMonth may queue an automatic sync; the explicit save below handles it once.
  if(cloudSaveTimer){clearTimeout(cloudSaveTimer);cloudSaveTimer=null;}
  showStatus("Speichern läuft – Daten werden an Supabase übertragen …",false,false);
  try {
    if(window.attendanceCloud && window.attendanceCloud.isReady()) {
      if(localStorage.getItem('attendance-backup-restore-pending')==='true' && typeof window.attendanceCloud.refreshAll==='function') {
        await window.attendanceCloud.refreshAll();
        localStorage.removeItem('attendance-backup-restore-pending');
        showStatus("✓ Backup abgeglichen und gespeichert. Vorhandene Cloud-Zellen blieben geschützt; fehlende Einträge wurden ergänzt.",false,true);
      } else {
        await window.attendanceCloud.saveAll();
        showStatus("✓ Erfolgreich gespeichert – Supabase hat die Änderungen angenommen.",false,true);
      }
    } else {
      showStatus("Nur auf diesem Gerät gespeichert – nicht in Supabase. Bitte anmelden und erneut speichern.",true);
    }
  } catch(err) {
    console.error(err);
    showStatus("✕ Speichern in Supabase fehlgeschlagen. Lokale Änderungen bleiben auf diesem Gerät erhalten. Fehler: "+(err.message||err),true);
  } finally {
    if(btn){btn.disabled=false;btn.textContent="Speichern";}
  }
}
$("saveNow")?.addEventListener("click",saveAllNow);
$("refreshNow")?.addEventListener("click",async()=>{
  const btn=$("refreshNow");
  if(!window.attendanceCloud || !window.attendanceCloud.isReady()){
    showStatus("Aktualisieren nicht möglich: Bitte anmelden und auf die Supabase-Verbindung warten.",true);
    return;
  }
  if(btn){btn.disabled=true;btn.textContent="Aktualisiert …";}
  showStatus("Aktualisieren läuft: Cloud-Daten werden geladen und mit fehlenden lokalen Einträgen abgeglichen …",false,false);
  try {
    await window.attendanceCloud.refreshAll();
    showStatus("✓ Aktualisiert. Cloud-Daten wurden geladen; fehlende lokale Einträge wurden ergänzt und der abgeglichene Stand gespeichert.",false,true);
  } catch(err) {
    console.error(err);
    showStatus("✕ Aktualisieren fehlgeschlagen. Bitte Verbindung prüfen. Fehler: "+(err.message||err),true);
  } finally {
    if(btn){btn.disabled=false;btn.textContent="Aktualisieren";}
  }
});
$("globalHourCorrection")?.addEventListener("change",()=>{
  const input=$("globalHourCorrection");
  const value=input.value.trim()===""?0:Number(input.value);
  if(!Number.isFinite(value)){showStatus("Bitte eine gültige Stundenkorrektur eingeben, z. B. -10 oder +5.",true);return;}
  setGlobalHourCorrection(value);
  showStatus("Gemeinsame Stundenkorrektur übernommen; Synchronisierung läuft.",false,false);
});


function activateMenu(activeId){
  document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",b.id===activeId || b.dataset.target===activeId));
}
document.querySelectorAll(".menu-item[data-target]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    showMainView(false);
    activateMenu(btn.id || btn.dataset.target);
    const target=document.getElementById(btn.dataset.target);
    if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
    if(btn.id==="menuArchive") $("archiveList")?.scrollIntoView({behavior:"smooth",block:"start"});
    if(btn.dataset.target==="pdfSection") $("makePdf")?.focus({preventScroll:true});
  });
});
$("menuOverview")?.addEventListener("click",()=>{
  showMainView(true);
  document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",b.id==="menuOverview"));
  $("overviewPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
});
installHistoricalSeed();
loadMonth();
renderArchiveList();


// Supabase login + shared cloud data. Publishable key is safe for browser use;
// all access is controlled by database RLS policies.
(function setupSupabaseAttendance(){
  const SUPABASE_URL = "https://mmjsdnyfbbkbxidvserz.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_d5cfpcooyerbFDdL6ieRZw_c9ndarMr";
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const gate = document.getElementById('authGate');
  const authForm = document.getElementById('authForm');
  const authMessage = document.getElementById('authMessage');
  const signupBtn = document.getElementById('signupBtn');
  let activeUser = null;
  let remoteParticipants = [];
  let participantMap = new Map();
  let cloudReady = false;
  const msg = (t, err=false) => { if(authMessage){authMessage.textContent=t;authMessage.className='status'+(err?' error':' ok');} };
  const setGate = (locked) => document.body.classList.toggle('auth-locked',locked);
  if(!sb){ msg('Supabase konnte nicht geladen werden. Bitte Internetverbindung prüfen.',true); return; }

  async function getProfile(user){
    const {data,error}=await sb.from('app_profiles').select('user_id,display_name,role,approved').eq('user_id',user.id).maybeSingle();
    if(error) throw error;
    return data;
  }
  async function afterAuth(user){
    activeUser=user;
    const profile=await getProfile(user);
    if(!profile){setGate(true);msg('Dein Profil wurde noch nicht angelegt. Bitte Administrator kontaktieren.',true);return;}
    if(!profile.approved){setGate(true);msg('Deine Anfrage ist eingegangen. Der Administrator muss deinen Zugang in Supabase unter Table Editor → app_profiles freigeben.',false);return;}
    setGate(false);
    let signout=document.getElementById('signOutButton');
    if(!signout){signout=document.createElement('button');signout.id='signOutButton';signout.className='button secondary';signout.type='button';signout.textContent='Abmelden';document.querySelector('.app-menu')?.appendChild(signout);}
    signout.onclick=async()=>{signout.disabled=true;signout.textContent='Speichere vor Abmeldung …';try{if(cloudSaveTimer){clearTimeout(cloudSaveTimer);cloudSaveTimer=null;}await saveAll();await sb.auth.signOut();cloudReady=false;activeUser=null;setGate(true);msg('Abgemeldet. Änderungen wurden vorher in Supabase gespeichert.');}catch(err){console.error(err);msg('Abmeldung abgebrochen: Speichern fehlgeschlagen. Bitte angemeldet bleiben und erneut speichern. '+(err.message||err),true);}finally{signout.disabled=false;signout.textContent='Abmelden';}};
    try { await refreshAll(); cloudReady=true; showStatus('Mit Supabase verbunden. Gemeinsame Daten geladen.',false,true); }
    catch(err){ console.error(err); showStatus('Anmeldung aktiv, aber Daten konnten nicht geladen werden: '+err.message,true); }
  }
  async function upsertParticipantsFromLocal(){
    const local = participants.map(p=>({full_name:(p.first+' '+p.last).trim(),participant_number:String(p.kst||'')}));
    const {data:existing,error}=await sb.from('course_participants').select('id,full_name,participant_number,correction_factor');
    if(error) throw error;
    const list=existing||[];
    for(const p of local){
      const found=list.find(x=>x.full_name.toLowerCase()===p.full_name.toLowerCase() && String(x.participant_number||'')===p.participant_number);
      if(!found){ const {data,error:insErr}=await sb.from('course_participants').insert({...p,correction_factor:0}).select('id,full_name,participant_number,correction_factor').single(); if(insErr) throw insErr; list.push(insErr?null:data); }
    }
    remoteParticipants=list.filter(Boolean);
    participantMap=new Map();
    participants.forEach((p,i)=>{
      const full=(p.first+' '+p.last).trim().toLowerCase();
      const match=remoteParticipants.find(r=>r.full_name.toLowerCase()===full && String(r.participant_number||'')===String(p.kst||''));
      if(match) participantMap.set(i,match.id);
    });
  }
  async function refreshAll(){
    if(!activeUser) throw new Error('Bitte anmelden.');
    const profile=await getProfile(activeUser);
    if(!profile || !profile.approved) throw new Error('Dein Konto ist nicht freigegeben.');
    const {data:globalSetting,error:globalSettingError}=await sb.from('course_settings').select('setting_key,setting_value').eq('setting_key','global_hour_correction').maybeSingle();
    if(globalSettingError) throw new Error('Gemeinsame Stundenkorrektur konnte nicht geladen werden. Bitte SQL-Migration course_settings ausführen: '+globalSettingError.message);
    if(globalSetting && globalSetting.setting_value!==null){localStorage.setItem('attendance-global-hour-correction',String(Number(globalSetting.setting_value)||0));}
    const {data:remote,error}=await sb.from('course_participants').select('id,full_name,participant_number,correction_factor').order('created_at');
    if(error) throw error;
    if(remote && remote.length){
      remoteParticipants=remote;
      participants.splice(0,participants.length,...remote.map(r=>{const parts=(r.full_name||'').trim().split(/\s+/);return {first:parts.slice(0,-1).join(' ')||'',last:parts.slice(-1)[0]||'',kst:r.participant_number||''};}));
      saveParticipants();
      // Korrekturwerte aus Supabase laden und lokal anhand Teilnehmer/KST zuordnen.
      let cloudCorrections={};
      try { cloudCorrections=JSON.parse(localStorage.getItem('attendance-hour-corrections')||'{}'); } catch { cloudCorrections={}; }
      remote.forEach(r=>{
        const parts=(r.full_name||'').trim().split(/\s+/);
        const first=parts.slice(0,-1).join(' ')||''; const last=parts.slice(-1)[0]||'';
        const key=[r.participant_number||'',last,first].join('|');
        if(r.correction_factor !== null && r.correction_factor !== undefined) cloudCorrections[key]=Number(r.correction_factor)||0;
      });
      localStorage.setItem('attendance-hour-corrections',JSON.stringify(cloudCorrections));
    } else {
      await upsertParticipantsFromLocal();
    }
    participantMap=new Map();
    participants.forEach((p,i)=>{const full=(p.first+' '+p.last).trim().toLowerCase();const r=remoteParticipants.find(x=>x.full_name.toLowerCase()===full&&String(x.participant_number||'')===String(p.kst||''));if(r)participantMap.set(i,r.id);});
    const {data:days,error:daysErr}=await sb.from('attendance_days').select('participant_id,attendance_date,entry');
    if(daysErr) throw daysErr;
    // Build a month cache from the shared attendance rows.
    const monthData={};
    // Vorhandene Cloud-Zeilen auch dann markieren, wenn entry leer ist.
    // So überschreibt ein alter lokaler Eintrag keine bewusst leere Cloud-Zelle.
    const cloudCells=new Set();
    for(const row of (days||[])){
      const mk=row.attendance_date.slice(0,7); if(!monthData[mk]) monthData[mk]={dates:[],attendance:{}};
      const idx=participants.findIndex((p,i)=>participantMap.get(i)===row.participant_id);
      if(idx<0) continue;
      if(!monthData[mk].dates.includes(row.attendance_date)) monthData[mk].dates.push(row.attendance_date);
      monthData[mk].attendance[row.attendance_date]=monthData[mk].attendance[row.attendance_date]||{};
      monthData[mk].attendance[row.attendance_date][idx]=row.entry||'';
      cloudCells.add(`${row.attendance_date}|${idx}`);
    }
    // Sicherheits-Merge: lokale Monate niemals pauschal löschen.
    // Lokale, nichtleere Einträge bleiben erhalten; fehlende Daten werden aus Supabase ergänzt.
    const localKeys=Object.keys(localStorage).filter(key=>/^attendance:\d{4}-\d{2}$/.test(key));
    for(const key of localKeys){
      const mk=key.slice('attendance:'.length);
      let localData={};
      try{localData=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{}
      if(!monthData[mk]) monthData[mk]={dates:[],attendance:{}};
      const target=monthData[mk];
      const localDates=Array.isArray(localData.dates)?localData.dates:[];
      for(const date of localDates){
        if(!target.dates.includes(date)) target.dates.push(date);
        target.attendance[date]=target.attendance[date]||{};
        const localRow=localData.attendance?.[date]||{};
        for(let i=0;i<participants.length;i++){
          const localValue=String(localRow[i]??'').trim();
          const hasCloudCell=cloudCells.has(`${date}|${i}`);
          // Cloud-Zeilen haben Vorrang, auch wenn entry absichtlich leer ist.
          // Lokale Daten ergänzen nur Zellen, für die es noch keine Cloud-Zeile gibt.
          if(!hasCloudCell && localValue!=='') target.attendance[date][i]=localValue;
        }
      }
    }
    Object.entries(monthData).forEach(([mk,data])=>{
      data.dates=[...new Set(data.dates)].sort();
      localStorage.setItem('attendance:'+mk,JSON.stringify(data));
    });
    // Den zusammengeführten Bestand zurück in die Cloud schreiben.
    // Leere Cloud: ebenso vorhandene lokale Monate übernehmen.
    await saveAll();
    loadMonth(); renderArchiveList(); renderOverview();
  }
  async function saveAll(){
    if(!activeUser) throw new Error('Bitte anmelden.');
    const profile=await getProfile(activeUser); if(!profile?.approved) throw new Error('Dein Konto ist nicht freigegeben.');
    const globalCorrection=getGlobalHourCorrection();
    const {error:globalSaveError}=await sb.from('course_settings').upsert({setting_key:'global_hour_correction',setting_value:globalCorrection,updated_by:activeUser.id,updated_at:new Date().toISOString()},{onConflict:'setting_key'});
    if(globalSaveError) throw new Error('Gemeinsame Stundenkorrektur konnte nicht in Supabase gespeichert werden. Bitte SQL-Migration course_settings ausführen: '+globalSaveError.message);
    await upsertParticipantsFromLocal();
    const participantUpdates=[];
    for(let i=0;i<participants.length;i++){
      const id=participantMap.get(i); if(!id) continue;
      const p=participants[i];
      let corrections={}; try { corrections=JSON.parse(localStorage.getItem('attendance-hour-corrections')||'{}'); } catch { corrections={}; }
      const correctionKey=[p.kst||'',p.last||'',p.first||''].join('|');
      const correctionValue=Number(corrections[correctionKey]||0);
      participantUpdates.push(sb.from('course_participants').update({full_name:(p.first+' '+p.last).trim(),participant_number:String(p.kst||''),correction_factor:Number.isFinite(correctionValue)?correctionValue:0}).eq('id',id));
    }
    const participantResults=await Promise.all(participantUpdates);
    const participantError=participantResults.find(r=>r.error)?.error; if(participantError) throw participantError;
    const keys=Object.keys(localStorage).filter(k=>/^attendance:\d{4}-\d{2}$/.test(k));
    const rows=[];
    for(const key of keys){
      let data; try{data=JSON.parse(localStorage.getItem(key)||'{}')}catch{continue;}
      const month=key.slice('attendance:'.length);
      const [year,monthNum]=month.split('-').map(Number);
      const monthStart=`${month}-01`;
      const nextMonthDate=new Date(year,monthNum,1);
      const monthEnd=`${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth()+1).padStart(2,'0')}-01`;
      const keptDates=[...new Set((data.dates||[]))].sort();
      // Absichtlich keine Cloud-Löschungen: ein fehlender lokaler Unterrichtstag
      // ist kein Beweis dafür, dass der gemeinsame Cloud-Tag gelöscht werden soll.
      for(const date of keptDates){
        const row=data.attendance?.[date]||{};
        for(let i=0;i<participants.length;i++){
          const pid=participantMap.get(i); if(!pid) continue;
          rows.push({participant_id:pid,attendance_date:date,entry:String(row[i]||''),updated_by:activeUser.id,updated_at:new Date().toISOString()});
        }
      }
    }
    // Send rows in batches instead of waiting for one network request per cell.
    for(let i=0;i<rows.length;i+=250){
      const {error}=await sb.from('attendance_days').upsert(rows.slice(i,i+250),{onConflict:'participant_id,attendance_date'});
      if(error) throw error;
    }
    cloudReady=true;
  }
  window.attendanceCloud={isReady:()=>Boolean(cloudReady&&activeUser),saveAll,refreshAll};
  authForm?.addEventListener('submit',async e=>{
    e.preventDefault();
    const email=document.getElementById('authEmail').value.trim(); const password=document.getElementById('authPassword').value;
    const btn=document.getElementById('loginBtn'); if(btn){btn.disabled=true;btn.textContent='Bitte warten …';}
    try{const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;await afterAuth(data.user);}
    catch(err){msg('Anmeldung fehlgeschlagen: '+err.message,true);}
    finally{if(btn){btn.disabled=false;btn.textContent='Anmelden';}}
  });
  signupBtn?.addEventListener('click',async()=>{
    const email=document.getElementById('authEmail').value.trim(); const password=document.getElementById('authPassword').value; const name=document.getElementById('authName').value.trim();
    if(!email||!password){msg('Bitte E-Mail und Passwort eingeben.',true);return;}
    signupBtn.disabled=true;signupBtn.textContent='Anfrage wird gesendet …';
    try{
      const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}}); if(error)throw error;
      msg(data.session ? 'Konto erstellt. Bitte auf die Freigabe durch den Administrator warten.' : 'Registrierung gestartet. Prüfe ggf. deine E-Mail zur Bestätigung. Danach wird dein Profil in Supabase unter app_profiles angelegt.');
    }catch(err){msg('Anfrage fehlgeschlagen: '+err.message,true);}
    finally{signupBtn.disabled=false;signupBtn.textContent='Zugang anfordern';}
  });
  sb.auth.getSession().then(async({data,error})=>{if(error){msg(error.message,true);return;}if(data.session){try{await afterAuth(data.session.user);}catch(err){msg('Konto konnte nicht geprüft werden: '+err.message,true);}}});
  sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'){activeUser=null;cloudReady=false;setGate(true);}});
})();
