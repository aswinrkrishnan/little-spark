// Picture clues, shuffled practice, independent writing and art tools.
const pictureWords='cat sun dog bus pig hat bed hen fish moon bug duck ball book bird tree flower rabbit apple banana carrot grapes pear sandwich boat kite boot shell frog bear pencil house read jump draw wave'.split(' ');
const extraPictureWords='bag cup mug sock shoe coat shirt dress skirt scarf box brush bike car truck train plane drum bell flag ribbon button bead block plate bowl spoon bucket spade towel blanket pillow chair bench door gate tent mat rug basket plum orange melon rice bread soup pasta peas corn toast peach berries egg beans goat lamb leaf rain beach swim run clap sing dance smile count help share grass sky'.split(' ');
function pictureClue(text){
 const aliases={kitten:'cat',pup:'dog',boots:'boot',bunny:'rabbit',hop:'jump',skip:'jump',paint:'draw',crayon:'pencil',pen:'pencil',park:'tree',garden:'flower',nap:'bed',sleep:'bed',mum:'wave',dad:'wave',waves:'wave',hug:'wave',helps:'help',friend:'help',hum:'sing',pond:'fish',play:'ball',water:'fish'};
 const tokens=text.toLowerCase().replace(/[^a-z ]/g,'').split(' ').filter((t,i,a)=>t!=='orange'||!a[i+1]);
 const key=tokens.map(t=>aliases[t]||t).find(t=>pictureWords.includes(t)||extraPictureWords.includes(t))||'read';
 let i=pictureWords.indexOf(key),rows=6,cols=6,file='reading-pictures.png';if(i<0){i=extraPictureWords.indexOf(key);file='reading-extra-'+Math.floor(i/30)+'.png';if(i>=60){rows=2;cols=5}else rows=5;i%=30}
 const colours={red:[.8,.04,.08],blue:[.04,.25,.85],green:[.03,.5,.14],yellow:[.92,.7,.02],pink:[.95,.25,.55],purple:[.5,.08,.75],orange:[.95,.35,.02],brown:[.35,.15,.04],black:[0,0,0],white:[.65,.65,.65]};
 const colour=text.toLowerCase().match(/\b(red|blue|green|yellow|pink|purple|orange|brown|black|white) (?=\w)/)?.[1];
 const tint=colour?`<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs><filter id="clueTint" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${colours[colour].map((v,i)=>`<feFunc${'RGB'[i]} type="linear" slope="${1-v}" intercept="${v}"/>`).join('')}</feComponentTransfer></filter></defs></svg>`:'';
 const row=Math.floor(i/cols),edges=file==='reading-extra-1.png'?[0,.2,.397,.59,.775,1]:Array.from({length:rows+1},(_,j)=>j/rows),inset=.008,left=i%cols/cols+inset,top=edges[row]+inset,w=1/cols-2*inset,h=edges[row+1]-edges[row]-2*inset;
 return `<figure class="reading-clue">${tint}<div role="img" aria-label="Picture clue: ${colour?colour+' ':''}${key}" style="${colour?'filter:url(#clueTint);':''}background-image:url('assets/${file}');background-size:${100/w}% ${100/h}%;background-position:${100*left/(1-w)}% ${100*top/(1-h)}%"></div></figure>`;
}
function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let sentenceBag=[],sentenceHistory=[],sentenceCursor=-1;
try{sentenceBag=JSON.parse(sessionStorage.getItem('spark-sentence-bag')||'[]').filter(n=>Number.isInteger(n)&&n>=0&&n<sentenceLibrary.length)}catch{}
function randomSentence(){if(!sentenceBag.length)sentenceBag=shuffled(sentenceLibrary.map((_,i)=>i));wordIndex=sentenceBag.pop();try{sessionStorage.setItem('spark-sentence-bag',JSON.stringify(sentenceBag))}catch{}sentenceHistory=sentenceHistory.slice(0,sentenceCursor+1);sentenceHistory.push(wordIndex);sentenceCursor++;}
randomSentence();
wordGames.push(['bus','We ride on a ___.',['bus','fish','hat']],['pig','The ___ lives on a farm.',['moon','pig','bed']],['hen','The ___ lays an egg.',['hen','bus','sun']],['moon','I see the ___ at night.',['bed','cat','moon']],['duck','The ___ swims in the pond.',['hat','duck','pencil']],['ball','I can kick a ___.',['ball','sun','book']],['book','I read a ___.',['fish','book','boot']],['bird','A ___ has wings.',['bed','bus','bird']],['apple','I eat an ___.',['apple','hat','moon']],['kite','My ___ flies in the wind.',['fish','kite','bed']],['frog','The ___ can hop.',['book','frog','hat']],['pencil','I write with a ___.',['pencil','bus','cat']],['boat','The ___ floats on the lake.',['sun','hat','boat']],['flower','A bee visits a ___.',['flower','bed','shoe']]);
let wordBag=shuffled(wordGames.map((_,i)=>i));wordRound=wordBag.pop();
function nextRandomWord(){if(!wordBag.length)wordBag=shuffled(wordGames.map((_,i)=>i).filter(i=>i!==wordRound));wordRound=wordBag.pop();render()}
const originalWordPlay=renderWordPlay;
renderWordPlay=function(){originalWordPlay();$('.sentence-card').insertAdjacentHTML('afterbegin',pictureClue(wordGames[wordRound][0]));$('#nextWord').onclick=()=>{stopVoice();nextRandomWord()};document.querySelectorAll('[data-word]').forEach(b=>{b.onclick=()=>{const answer=wordGames[wordRound][0];speak(b.dataset.word);if(b.dataset.word===answer){award('word'+wordRound);b.classList.add('correct');$('.gap-sentence').textContent=wordGames[wordRound][1].replace('___',answer);feedback('You found it! Read the whole sentence.');advanceAfterCorrect(nextRandomWord,'Next word game')}else {feedback('Have another go. Look at the picture clue.');speak('Have another go. Look at the picture clue.')}}})};
let drawingTool='pen';const practicePages=new Map();
function addDrawingTools(container){
 const tools=[['pen','Pen','Smooth lines','#7450d4'],['pencil','Pencil','Little details','#dba62c'],['marker','Marker','See-through colour','#e45b91'],['brush','Paintbrush','Big bold strokes','#3c9e88'],['eraser','Eraser','Rub it out','#578fc5']];
 const pictures={
 pen:'<path d="M24 51 53 22 65 34 36 63 20 68Z" fill="#8860dc"/><path d="m20 68 4-17 12 12Z" fill="#e7d0ae"/><path d="m20 68 3-8 5 5Z" fill="#353049"/><path d="m53 22 6-6q4-4 8 0l4 4q4 4 0 8l-6 6Z" fill="#4b347e"/><path d="m55 21 10 10-14 14" fill="none" stroke="#eee5ff" stroke-width="4"/>',
 pencil:'<path d="m23 54 34-34 13 13-34 34-17 4Z" fill="#f5c54f"/><path d="m29 59 34-34" stroke="#d99a27" stroke-width="4"/><path d="m19 71 4-17 13 13Z" fill="#e9cda3"/><path d="m19 71 3-8 5 5Z" fill="#454052"/><path d="m57 20 6-6q3-3 6 0l7 7q3 3 0 6l-6 6Z" fill="#ef8cab"/><path d="m54 23 13 13" stroke="#a4b6c6" stroke-width="6"/>',
 marker:'<path d="m24 53 28-31q3-3 6 0l13 12q3 3 0 6L43 70Z" fill="#ed75a3"/><path d="m27 50 20 18" stroke="#bc3874" stroke-width="6"/><path d="m24 53-7 15 13 5 13-3Z" fill="#9b285d"/><path d="m52 22 7-8q3-3 6 0l13 12q3 3 0 6l-7 8Z" fill="#773255"/><path d="m48 34 12 11" stroke="#ffe0ed" stroke-width="5"/>',
 brush:'<path d="M40 46 68 14q6-5 10 0t-1 9L49 55Z" fill="#43ae96"/><path d="m40 46 9 9-9 10-12-11Z" fill="#b4c8cf"/><path d="M29 53q-17 4-12 20-1 6-8 8 27 4 32-16Z" fill="#9b6543"/><path d="M17 68q0 8-8 13 20 3 28-9" fill="#8561d2"/><path d="m69 18 3-3" stroke="#b8f0d8" stroke-width="3"/>',
 eraser:'<path d="m18 47 28-28q5-5 10 0l23 23q4 4 0 8L51 78H39L18 57q-5-5 0-10Z" fill="#f09ab4"/><path d="m18 47 15-15 33 33-15 13H39L18 57q-5-5 0-10Z" fill="#7cb5dc"/><path d="m26 39 33 33" stroke="#dceefa" stroke-width="3"/><path d="M58 80h22" stroke="#b7aec5" stroke-width="3" stroke-linecap="round"/>'
 };
 const row=document.createElement('section');row.className='art-tools';row.setAttribute('aria-label','Drawing tools');
 row.innerHTML=`<h3>Pick your tool</h3><div class="tool-grid">${tools.map(([id,name,hint,c])=>`<button type="button" class="tool-card" data-tool="${id}" aria-pressed="${drawingTool===id}" style="--tool-colour:${c}"><span class="tool-check" aria-hidden="true">✓</span><svg viewBox="0 0 96 96" aria-hidden="true">${pictures[id]}</svg><strong>${name}</strong><small>${hint}</small></button>`).join('')}</div><div class="tool-preview" aria-live="polite"><svg viewBox="0 0 180 35" aria-hidden="true"><path d="M8 23 Q35 2 59 20 T111 18 T171 16" fill="none" stroke-linecap="round"/></svg><span id="toolDescription"></span></div>`;
 container.prepend(row);
 function update(){row.querySelectorAll('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool===drawingTool));const tool=tools.find(t=>t[0]===drawingTool);row.querySelector('#toolDescription').textContent=tool[1]+' · '+tool[2];const p=row.querySelector('.tool-preview path');p.setAttribute('stroke',drawingTool==='eraser'?'#c8c1d3':ink);p.setAttribute('stroke-width',({pen:5,pencil:2,marker:15,brush:11,eraser:7})[drawingTool]);p.setAttribute('opacity',drawingTool==='marker'?'.35':'1');p.setAttribute('stroke-dasharray',drawingTool==='eraser'?'24 20':'none');$('canvas').style.cursor=drawingTool==='eraser'?'cell':'crosshair'}
 row.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{drawingTool=b.dataset.tool;update()});
 container.querySelectorAll('[data-ink]').forEach(b=>{const select=b.onclick;b.onclick=()=>{select();if(drawingTool==='eraser')drawingTool='pen';update()}});update();
}
const originalSetupCanvas=setupCanvas;
setupCanvas=function(){originalSetupCanvas();const c=$('canvas'),down=c.onpointerdown;c.onpointerdown=e=>{down(e);if(active){active.tool=mode==='draw'?drawingTool:'pen';if(active.tool==='pencil')active.width=Math.max(2,active.width*.35);if(active.tool==='marker')active.width*=1.8;if(active.tool==='brush')active.width*=1.3;redraw()}}};
redraw=function(){const c=$('canvas');if(!c)return;const x=c.getContext('2d'),r=c.getBoundingClientRect();x.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);x.clearRect(0,0,r.width,r.height);for(const s of strokes){x.globalCompositeOperation=s.tool==='eraser'?'destination-out':'source-over';x.globalAlpha=s.tool==='marker'?.35:s.tool==='pencil'?.65:1;x.strokeStyle=x.fillStyle=s.color;x.lineWidth=s.width;x.lineCap=x.lineJoin='round';x.beginPath();s.points.forEach((p,i)=>i?x.lineTo(p[0]*r.width,p[1]*r.height):x.moveTo(p[0]*r.width,p[1]*r.height));x.stroke();if(s.points.length===1){x.beginPath();x.arc(s.points[0][0]*r.width,s.points[0][1]*r.height,s.width/2,0,Math.PI*2);x.fill()}}x.globalCompositeOperation='source-over';x.globalAlpha=1};
const originalTracing=renderTracing;
renderTracing=function(){originalTracing();const glyph=traceState.glyph;if(!practicePages.has(glyph))practicePages.set(glyph,[]);$('.canvas-area').insertAdjacentHTML('beforeend',`<section class="independent-writing"><h2>Now write ${glyph} yourself</h2><p>Have a go on the lines. You can look at the letter above for help.</p><div class="paper practice-paper"><canvas aria-label="Write ${glyph} yourself on the practice lines"></canvas></div><div class="toolbar"><button class="button" id="practiceUndo">Undo</button><button class="button" id="practiceClear">Fresh paper</button><button class="button primary" id="practiceDone">I tried it!</button></div><p id="practiceMessage" role="status"></p></section>`);strokes=practicePages.get(glyph);setupCanvas();$('#practiceUndo').onclick=()=>{strokes.pop();redraw()};$('#practiceClear').onclick=()=>{strokes.length=0;redraw()};$('#practiceDone').onclick=()=>{if(!strokes.length){$('#practiceMessage').textContent='Try writing on the lines first.';return}award('freewrite-'+glyph);$('#practiceMessage').textContent='Lovely practice! Every try helps your writing grow.';speak('Lovely practice!')}};
const baseRender=render;
render=function(){baseRender();if(mode==='read'&&readView==='sentences'){$('.sentence-card').insertAdjacentHTML('afterbegin',pictureClue(sentenceLibrary[wordIndex]));$('#next').textContent='Next surprise';const next=()=>{stopVoice();randomSentence();render()};$('#next').onclick=next;$('#shuffleSentence').onclick=next;$('#previous').disabled=sentenceCursor<=0;$('#previous').onclick=()=>{if(sentenceCursor>0){wordIndex=sentenceHistory[--sentenceCursor];render()}};$('#readDone').onclick=()=>{if(!readCompleted.has(wordIndex)){star();readCompleted.add(wordIndex)}feedback('Lovely reading! A new sentence is coming.');speak('Lovely reading!');advanceAfterCorrect(next,'Next sentence')}}if(mode==='draw')addDrawingTools($('.sidebar'))};

// Random maths with readable place-value models for larger numbers.
const randint=n=>Math.floor(Math.random()*(n+1));
const shapeNames=['circle','square','triangle','rectangle','oval','pentagon','hexagon','octagon','star','rhombus','trapezium','semicircle'];
const shapeHints=['Round, with no straight sides.','Four equal sides and four square corners.','Three straight sides.','Four square corners, with two longer sides.','Round and stretched, like an egg.','Five straight sides.','Six straight sides.','Eight straight sides.','Five points reaching out.','Four equal sides, tilted like a diamond.','One pair of parallel sides.','Half of a circle.'];
let previousMath='';
const oldMathQuestion=makeMathQuestion;
makeMathQuestion=function(kind,round,limit){let q;for(let attempt=0;attempt<30;attempt++){const a=randint(limit),b=randint(limit);if(kind==='shapes'){const i=randint(shapeNames.length-1),name=shapeNames[i];q={prompt:'What is this shape?',answer:name,choices:shuffled([name,...shuffled(shapeNames.filter(n=>n!==name)).slice(0,3)]),shape:name,hint:shapeHints[i]}}
 else if(kind==='patterns')q=oldMathQuestion(kind,randint(1000),limit);
 else if(kind==='count')q={prompt:limit>20?'What number is shown?':'How many dots can you count?',answer:a,choices:numberChoices(a,limit),groups:[a],hint:limit>20?'Add the hundreds, tens and ones.':'Tap each dot once as you count.'};
 else if(kind==='add'){const right=randint(limit-a);q={prompt:`${a} + ${right} = ?`,answer:a+right,choices:numberChoices(a+right,limit),groups:[a,right],hint:'Add the ones, then the tens, then the hundreds.'}}
 else if(kind==='subtract'){const take=randint(a);q={prompt:`${a} − ${take} = ?`,answer:a-take,choices:numberChoices(a-take,limit),groups:limit<=20?[a]:undefined,removed:take,hint:'Start with the first number and take away the second number. Work with hundreds, tens and ones.'}}
 else q={prompt:'Which group has more?',answer:a===b?'The same':a>b?'Left':'Right',choices:['Left','The same','Right'],groups:[a,b],hint:'Compare hundreds first, then tens, then ones.'};
 const key=JSON.stringify([q.prompt,q.answer,q.groups,q.pattern]);if(key!==previousMath){previousMath=key;break}}
 q.choices=shuffled(q.choices);return q};
const oldDots=dots;
dots=function(n,removed=0){if(n<=20)return oldDots(n,removed);const h=Math.floor(n/100),t=Math.floor(n%100/10),o=n%10;return `<div class="place-value" aria-label="${h} hundreds, ${t} tens, ${o} ones"><div><b>${h}</b><span>hundreds</span></div><div><b>${t}</b><span>tens</span></div><div><b>${o}</b><span>ones</span></div></div>`};
const baseMath=renderMath;
try{const saved=Number(sessionStorage.getItem('spark-math-limit'));mathLimit=[5,10,20,50,100,500,1000].includes(saved)?saved:1000}catch{mathLimit=1000}
renderMath=function(){baseMath();const select=$('#mathLevel');if(select){select.innerHTML=[5,10,20,50,100,500,1000].map(n=>`<option value="${n}" ${n===mathLimit?'selected':''}>Up to ${n.toLocaleString()}</option>`).join('');const change=select.onchange;select.onchange=e=>{try{sessionStorage.setItem('spark-math-limit',e.target.value)}catch{}change(e)}}};

// Use installed English voices, preferring enhanced/natural voices when available.
let selectedVoice='';try{selectedVoice=sessionStorage.getItem('spark-voice')||''}catch{}
let voiceRate=.95;
const voicePanel=document.createElement('details');voicePanel.className='voice-panel';voicePanel.innerHTML='<summary>Grown-up settings · voice and reading pace</summary><label>Voice <select id="voiceChoice"></select></label><label>Reading pace <input id="voiceRate" type="range" min="0.75" max="1.1" step="0.05" value="0.95"></label><button class="button" id="voicePreview">Hear a sample</button><p>Voices come from this device. Enhanced voices sound more natural when installed.</p>';document.querySelector('footer').after(voicePanel);
function availableVoices(){return 'speechSynthesis'in window?speechSynthesis.getVoices().filter(v=>/^en(?:-|_)/i.test(v.lang)&&! /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Ralph|Trinoids|Whisper|Wobble|Zarvox/i.test(v.name)):[]}
function voiceScore(v){return (/Karen/i.test(v.name)?1000:0)+(/natural|enhanced|premium|neural/i.test(v.name)?100:0)+(/Karen|Samantha|Moira|Daniel|Google/i.test(v.name)?20:0)+(v.lang==='en-AU'?10:0)}
function fillVoices(){const voices=availableVoices().sort((a,b)=>voiceScore(b)-voiceScore(a));const s=$('#voiceChoice');s.replaceChildren();const auto=new Option(voices.some(v=>/Karen/i.test(v.name))?'Default · Karen (Australian English)':'Default · best available English voice','');s.add(auto);voices.forEach(v=>s.add(new Option(v.name+' · '+v.lang,v.voiceURI)));s.value=selectedVoice;if(s.selectedIndex<0)s.value=''}
let activeUtterance=null;
const previousStopVoice=stopVoice;
stopVoice=function(){activeUtterance=null;previousStopVoice()};
speak=function(text){
 if(!sound){feedback('Sound is off. Tap Sound off at the top to turn reading on.');return}
 if(!('speechSynthesis' in window)){feedback('Read-aloud is unavailable in this browser. Try Safari, Chrome or Edge.');return}
 stopVoice();
 const voices=availableVoices().sort((a,b)=>voiceScore(b)-voiceScore(a));
 function read(voice,retry){
  const u=new SpeechSynthesisUtterance(String(text));activeUtterance=u;
  u.voice=voice;u.lang=voice?.lang||'en-AU';u.rate=voiceRate;u.pitch=1;
  let started=false;const watch=setTimeout(()=>{if(activeUtterance===u&&!started){activeUtterance=null;speechSynthesis.cancel();window.sparkVoiceStatus?.('The browser reading voice did not start. Try recorded audio in Grown-up settings.',true)}},5000);
  u.onstart=()=>{started=true;clearTimeout(watch);window.sparkVoiceStatus?.('Reading with '+(voice?.name||'the device voice')+'.')};
  u.onend=()=>{clearTimeout(watch);if(activeUtterance===u){activeUtterance=null;window.sparkVoiceStatus?.('Finished reading.')}};
  u.onerror=e=>{clearTimeout(watch);if(activeUtterance!==u)return;activeUtterance=null;
   if(['canceled','interrupted'].includes(e.error))return;
   if(retry){read(null,false);return}
   feedback('The reading voice could not start. Try another voice in Grown-up settings or reopen this page in Safari, Chrome or Edge.');
  };
  if(speechSynthesis.paused)speechSynthesis.resume();
  speechSynthesis.speak(u);
 }
 read(voices.find(v=>v.voiceURI===selectedVoice)||voices[0]||null,true);
};
$('#voiceChoice').onchange=e=>{selectedVoice=e.target.value;try{sessionStorage.setItem('spark-voice',selectedVoice)}catch{}speak('Hello! Let’s read a little story together.')};$('#voiceRate').oninput=e=>voiceRate=+e.target.value;$('#voicePreview').onclick=()=>speak('Hello, little reader! Let’s learn and play together.');if('speechSynthesis'in window)speechSynthesis.addEventListener('voiceschanged',fillVoices);fillVoices();render();
