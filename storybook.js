let bookQuestion=0, bookDone=false, bookDrawingOpen=false;
const bookDrawings=new Map();
const extraQuestions=[
 [['Who pats the cat?',['Sam','Meg','Dad'],0],['What does the cat do at the end?',['Runs','Has a nap','Swims'],1]],
 [['What colour is the bus?',['Blue','Green','Red'],2],['Who gets on the bus with the child?',['Mum','A bear','A frog'],0]],
 [['What kind of animal is Pip?',['A kitten','A pup','A duck'],1],['What does the child do with the ball?',['Hides it','Eats it','Rolls it'],2]],
 [['What does the frog see?',['A bug','A bus','A hat'],0],['Where does the frog jump?',['Into bed','Into the pond','Into a box'],1]],
 [['Where does the seed go?',['In a shoe','In a bag','In a pot'],2],['What does the child give the seed?',['Water','Milk','Juice'],0]],
 [['What makes the tapping sound?',['A cat','Rain','A ball'],1],['Who goes out with the child?',['Mum','Meg','Dad'],2]],
 [['What blows the hat off?',['The wind','A dog','A bus'],0],['What does Meg do at the end?',['Leaves the hat','Puts her hat on','Goes swimming'],1]],
 [['Where do Ben and Mum sit?',['On a bus','In bed','Under a tree'],2],['Who do they wave to?',['A bird','A frog','A bear'],0]],
 [['Where does Mia walk?',['In a cave','By the sea','In a shop'],1],['Where does Mia put the shell?',['In a pot','In a tree','In her pocket'],2]],
 [['What does the bear do first?',['Yawns','Swims','Claps'],0],['What does the bear curl up on?',['A chair','Leaves','A boat'],1]],
 [['What makes the puddle?',['A kite','The sun','Rain'],2],['What does Nina do in the puddle?',['Jumps','Sleeps','Reads'],0]],
 [['What does the ant find?',['A leaf','A crumb','A shell'],1],['Where do the ants take the crumb?',['To the sea','To the park','Home'],2]],
 [['What helps the kite go up?',['The wind','The rain','A fish'],0],['How does Ollie feel?',['Sad','Happy','Scared'],1]],
 [['What colour is the pollen?',['Blue','Red','Yellow'],2],['Where does the bee live?',['In a hive','In a shoe','In a bus'],0]],
 [['What does Luca make?',['A cake','A card','A kite'],1],['What colour is the wrapping paper?',['Green','Red','Blue'],2]],
 [['What does the worm see?',['A seed','A boat','A hat'],0],['What does the worm make?',['A nest','A tunnel','A card'],1]],
 [['What does Sofia mix?',['Milk and fruit','Sand and leaves','Flour and water'],2],['What does Sofia knead?',['Dough','A blanket','A ball'],0]],
 [['Who swims beside the boat?',['A frog','A duck','A bear'],1],['Where is the boat?',['In a garden','On a road','On a lake'],2]]
];
stories.forEach((s,i)=>{
 s.pages=s.pages.map((p,j)=>({text:typeof p==='string'?p:p.text,image:`assets/books/atlas-${Math.floor(i/3)+1}.png`,row:i%3,column:i===0?[0,2,1,3][j]:j,alt:typeof p==='string'?p:p.text}));
 s.questions=[{question:s.question,choices:s.choices,answer:s.answer},...extraQuestions[i].map(([question,choices,answer])=>({question,choices,answer}))];
});
function bookPicture(page,cover=false){
 const edges=page.image.endsWith('atlas-1.png')?[0,.218,.4,.6,.8,1]:[0,.2,.4,.6,.8,1];
 const inset=.003,left=edges[page.column]+inset,width=edges[page.column+1]-edges[page.column]-inset*2,top=page.row/3+inset,height=1/3-inset*2;
 return `<div class="book-picture ${cover?'book-cover-picture':''}" role="img" aria-label="${page.alt}" style="background-image:url('${page.image}');background-size:${100/width}% ${100/height}%;background-position:${100*left/(1-width)}% ${100*top/(1-height)}%"></div>`;
}
function openBook(id){stopVoice();storyId=id;storyPage=0;storyQuiz=false;bookQuestion=0;bookDone=false;bookDrawingOpen=false;render()}
function renderReading(){
 if(readView==='words'){renderWordPlay();return}
 const root=$('#workspace');
 if(storyId===null){
  root.innerHTML=readTabs()+`<div class="library"><div class="area-head"><div><h2>Open a picture book</h2><p>18 little adventures. Read a page, look at the picture, and tell your own story.</p></div></div><div class="story-grid">${stories.map((s,i)=>`<button class="story-cover illustrated-cover" data-story="${i}">${bookPicture(s.pages[0],true)}<span class="mini-label">${s.level}</span><strong>${s.title}</strong><span>${s.pages.length} pages · 3 questions ${earned.has('story'+i)?'· Read':''}</span></button>`).join('')}</div></div>`;
  bindReadTabs();document.querySelectorAll('[data-story]').forEach(b=>b.onclick=()=>openBook(+b.dataset.story));return;
 }
 const s=stories[storyId],page=s.pages[storyPage],q=s.questions[bookQuestion];
 root.innerHTML=readTabs()+`<article class="picture-book"><div class="book-top"><button class="button" id="library">All books</button><div><h2>${s.title}</h2><span>${bookDone?'Book complete!':storyQuiz?`Question ${bookQuestion+1} of ${s.questions.length}`:`Page ${storyPage+1} of ${s.pages.length}`}</span></div><button class="button" id="hear">♪ ${bookDone?'Hear drawing idea':storyQuiz?'Hear question':'Read page'}</button></div>
 ${bookDone?`<div class="book-complete"><h2>You read a whole book!</h2><p>You thought about all three questions. Lovely effort.</p><div class="toolbar"><button class="button" id="reread">Read again</button><button class="button primary" id="nextBook">Next book</button></div></div>`:storyQuiz?`<div class="book-question"><div class="question-picture">${bookPicture(page)}</div><div class="question-card"><p>Think back to the story.</p><h3>${q.question}</h3><div class="answer-list">${q.choices.map((c,i)=>`<button class="button answer" data-choice="${i}">${c}</button>`).join('')}</div><button class="button" id="nextBookQuestion" hidden>Next question</button><button class="button" id="lookBack">Look at the story again</button></div></div>`:`<div class="book-spread">${bookPicture(page)}<div class="book-page-text"><div class="sentence-words">${wordButtons(page.text)}</div><p>Tap a word to hear it.</p></div></div><div class="toolbar book-navigation"><button class="button" id="backPage" ${storyPage===0?'disabled':''}>Previous page</button><div class="page-dots" aria-label="Page ${storyPage+1} of ${s.pages.length}">${s.pages.map((_,i)=>`<span class="${i<=storyPage?'filled':''}"></span>`).join('')}</div><button class="button primary" id="nextPage">${storyPage===s.pages.length-1?'Let’s try the questions':'Next page'}</button></div>`}
 <div class="feedback" id="feedback" role="status"></div>
 <section class="book-art"><div class="area-head"><div><h3>My story picture</h3><p>${s.draw}</p></div><button class="button" id="drawStory" aria-expanded="${bookDrawingOpen}">${bookDrawingOpen?'Close drawing pad':'Draw here'}</button></div><div id="bookDrawing" ${bookDrawingOpen?'':'hidden'}><div class="book-palette">${['#7450d4','#ef6392','#ef8143','#edbf35','#45a680','#489ed3','#343048'].map((c,i)=>`<button class="swatch ${ink===c?'selected':''}" style="background:${c}" data-book-ink="${c}" aria-label="${['Purple','Pink','Orange','Yellow','Green','Blue','Dark purple'][i]}" aria-pressed="${ink===c}"></button>`).join('')}<label>Brush <input id="bookBrush" type="range" min="3" max="24" value="${width}"></label></div><div class="paper book-drawing-paper"><canvas aria-label="Draw a picture for ${s.title}"></canvas></div><div class="toolbar"><button class="button" id="bookUndo">Undo</button><button class="button" id="bookClear">Clear picture</button><button class="button primary" id="bookSave">Save picture</button></div></div></section></article>`;
 bindReadTabs();bindWordHelp();
 $('#library').onclick=()=>{stopVoice();storyId=null;render()};
 const readText=bookDone?s.draw:storyQuiz?q.question+' Your choices are '+q.choices.join(', ')+'.':page.text;
 $('#hear').onclick=()=>speak(readText);
 if(bookDone){$('#reread').onclick=()=>openBook(storyId);$('#nextBook').onclick=()=>openBook((storyId+1)%stories.length)}
 else if(storyQuiz){
  let solved=false;const next=()=>{if(bookQuestion<s.questions.length-1)bookQuestion++;else{bookDone=true;bookDrawingOpen=true}render()};
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{if(solved)return;if(+b.dataset.choice===q.answer){solved=true;award('book-question-'+storyId+'-'+bookQuestion);b.classList.add('correct');feedback('That’s right! You remembered the story.');speak('That’s right!');$('#nextBookQuestion').hidden=false;$('#nextBookQuestion').textContent=bookQuestion===s.questions.length-1?'Finish book':'Next question';advanceAfterCorrect(next,bookQuestion===s.questions.length-1?'Finish book':'Next question')}else{b.classList.add('try-again');feedback('Have another try, or look at the story again.');speak('Have another try, or look at the story again.')}});
  $('#nextBookQuestion').onclick=next;$('#lookBack').onclick=()=>{stopVoice();storyQuiz=false;storyPage=0;render()};
 }else{
  $('#backPage').onclick=()=>{stopVoice();storyPage--;render()};$('#nextPage').onclick=()=>{stopVoice();if(storyPage===s.pages.length-1){award('story'+storyId);storyQuiz=true;bookQuestion=0}else storyPage++;render()};
 }
 $('#drawStory').onclick=()=>{bookDrawingOpen=!bookDrawingOpen;cancelAdvance();render();if(bookDrawingOpen)$('#bookDrawing').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'})};
 if(bookDrawingOpen)setupBookDrawing();
}
function setupBookDrawing(){
 if(!bookDrawings.has(storyId))bookDrawings.set(storyId,[]);strokes=bookDrawings.get(storyId);setupCanvas();
 document.querySelectorAll('[data-book-ink]').forEach(b=>b.onclick=()=>{ink=b.dataset.bookInk;document.querySelectorAll('[data-book-ink]').forEach(s=>{s.classList.toggle('selected',s===b);s.setAttribute('aria-pressed',s===b)})});
 $('#bookBrush').oninput=e=>width=+e.target.value;$('#bookUndo').onclick=()=>{strokes.pop();redraw()};$('#bookClear').onclick=()=>{strokes.length=0;redraw()};
 $('#bookSave').onclick=()=>{if(!strokes.length){feedback('Add a little colour first.');return}const c=$('#bookDrawing canvas'),out=document.createElement('canvas');out.width=c.width;out.height=c.height;const x=out.getContext('2d');x.fillStyle='white';x.fillRect(0,0,out.width,out.height);x.drawImage(c,0,0);const a=document.createElement('a');a.download='my-story-picture.png';a.href=out.toDataURL('image/png');a.click();feedback('Your story picture is ready to keep.')};
}
