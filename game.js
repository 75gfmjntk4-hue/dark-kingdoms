const C=[
["Вовк",4,"melee","🐺",""],["Вартовий",5,"melee","🛡️",""],["Берсерк",7,"melee","🪓",""],
["Мисливець",4,"ranged","🏹",""],["Арбалетник",6,"ranged","🎯",""],["Слідопит",5,"ranged","🦅",""],
["Відьма",5,"magic","🧙",""],["Некромант",6,"magic","💀",""],["Вогнемант",7,"magic","🔥",""],
["Друїд",4,"magic","🌿",""],["Лицар",6,"melee","⚔️",""],["Тінь",5,"ranged","🥷",""]
].map((x,i)=>({name:x[0],power:x[1],row:x[2],icon:x[3],ability:x[4],id:i}));
let hand=[],eh=[],p=[],e=[],r=1,pr=0,er=0,passed=false,epassed=false,busy=false;
const $=x=>document.getElementById(x);
function shuffle(a){return a.slice().sort(()=>Math.random()-.5)}
function makeDeck(){return shuffle([...C,...C]).map((x,i)=>({...x,id:x.id+"-"+Math.random()+"-"+i}))}
function power(a){return a.reduce((s,x)=>s+x.power,0)}
function card(c,click=false){return `<div class="card"${click?` onclick="play('${c.id}')"`:""}><div class="p">${c.power}</div><div class="i">${c.icon}</div><div class="n">${c.name}</div><div class="a">${c.ability}</div></div>`}
function render(){
$("hand").innerHTML=hand.map(c=>card(c,!busy&&!passed)).join("");$("hc").textContent=hand.length;
for(const row of ["melee","ranged","magic"]){$("p"+row).innerHTML=p.filter(x=>x.row===row).map(x=>card(x)).join("");$("e"+row).innerHTML=e.filter(x=>x.row===row).map(x=>card(x)).join("")}
$("ps").textContent=power(p);$("es").textContent=power(e);$("round").textContent=`Раунд ${r} · ${pr}:${er}`;
$("pass").disabled=busy||passed;
}
function play(id){if(busy||passed)return;let i=hand.findIndex(x=>x.id===id);if(i<0)return;p.push(hand.splice(i,1)[0]);busy=true;$("msg").textContent="Ворог думає…";render();setTimeout(enemy,450)}
function enemy(){
if(epassed||eh.length===0){epassed=true;busy=false;render();finishCheck();return}
let ps=power(p),es=power(e);
if((e.length>=5&&es>=ps+5)||passed){epassed=true;busy=false;$("msg").textContent="Ворог пасує.";render();finishCheck();return}
let best=eh[Math.floor(Math.random()*eh.length)],idx=eh.indexOf(best);e.push(eh.splice(idx,1)[0]);busy=false;$("msg").textContent=passed?"Ворог ще грає…":"Твій хід";render();finishCheck()
}
function pass(){if(busy||passed)return;passed=true;$("msg").textContent="Ти пасуєш. Ворог грає…";render();setTimeout(enemy,350)}
function finishCheck(){if((passed&&epassed)||(hand.length===0&&eh.length===0))setTimeout(endRound,400)}
function endRound(){
let a=power(p),b=power(e);if(a>b)pr++;else if(b>a)er++;
if(a===b)$("msg").textContent=`Нічия ${a}:${b}`;else $("msg").textContent=a>b?`Ти забрав раунд ${a}:${b}`:`Ворог забрав раунд ${b}:${a}`;
render();
if(pr>=2||er>=2||r>=3){setTimeout(()=>{ $("result").textContent=pr>er?"🏆 ПЕРЕМОГА":"☠ ПОРАЗКА";$("detail").textContent=`Рахунок раундів: ${pr}:${er}. Загальна сила останнього раунду ${a}:${b}.`;$("overlay").style.display="flex"},500);return}
r++;p=[];e=[];passed=false;epassed=false;busy=false;hand=makeDeck().slice(0,10);eh=makeDeck().slice(0,10);render();$("msg").textContent="Новий раунд — твій хід"}
function start(){$("overlay").style.display="none";r=1;pr=0;er=0;p=[];e=[];passed=false;epassed=false;busy=false;hand=makeDeck().slice(0,10);eh=makeDeck().slice(0,10);render();$("msg").textContent="Твій хід — обери карту"}
}
$("pass").onclick=pass;$("restart").onclick=start;$("again").onclick=start;start();
