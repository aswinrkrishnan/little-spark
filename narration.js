// Questions are read only when the child presses the Read question button.
(() => {
 const originalSpeak=speak;
 speak=function(text){const spoken=String(text).replace(/−/g,' minus ').replace(/\+/g,' plus ').replace(/=/g,' equals ').replace(/___/g,' blank ').replace(/●/g,' circle ').replace(/▲/g,' triangle ').replace(/■/g,' square ').replace(/\b(\d+)c\b/g,'$1 cents');originalSpeak(spoken)};
 function question(){const root=document.querySelector('#workspace');
  if(root.querySelector('#readQuestion'))return {anchor:root.querySelector('#readQuestion'),play:root.querySelector('#readQuestion').onclick};
  if(root.querySelector('.maths')){const anchor=root.querySelector('#hear');return {anchor,play:()=>{let text=root.querySelector('.area-head h2')?.textContent||'';const pattern=root.querySelector('.pattern');if(pattern)text+=' '+pattern.textContent.replace('?','What comes next?');text+=' Your choices are '+[...root.querySelectorAll('.answer')].map(b=>b.textContent).join(', ')+'.';speak(text)}}}
  if(root.querySelector('.book-question')){const anchor=root.querySelector('#hear');return {anchor,play:()=>{const card=root.querySelector('.book-question');if(!card)return;const text=card.querySelector('h3')?.textContent?.trim();if(!text)return;const choices=[...card.querySelectorAll('[data-choice]')].map(b=>b.textContent.trim());speak(text+' Your choices are '+choices.join(', ')+'.')}}}
  if(root.querySelector('.gap-sentence')){const anchor=root.querySelector('#hear');return {anchor,play:()=>speak('Find the missing word. '+root.querySelector('.gap-sentence').textContent+' Choose '+[...root.querySelectorAll('[data-word]')].map(b=>b.textContent).join(', ')+'.')}}
  return null;
 }
 function bindQuestion(){
  const q=question();if(!q||!q.anchor||q.anchor.dataset.narrationBound)return;
  const root=document.querySelector('#workspace');
  const heading=root.querySelector('.learning-question h3')||root.querySelector('.book-question h3')||root.querySelector('.gap-sentence')||root.querySelector('.maths .area-head h2');
  if(!heading)return;
  q.anchor.dataset.narrationBound='true';q.anchor.className='question-speaker';
  q.anchor.setAttribute('aria-label','Read question aloud');q.anchor.setAttribute('title','Read question aloud');
  q.anchor.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4Z" fill="currentColor"/><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  if(q.anchor.id!=='readQuestion')q.anchor.onclick=q.play;
  heading.classList.add('spoken-question');const row=document.createElement('div');row.className='question-with-audio';heading.before(row);row.append(heading,q.anchor);
 }
 new MutationObserver(bindQuestion).observe(document.querySelector('#workspace'),{childList:true,subtree:true});
 bindQuestion();
})();
