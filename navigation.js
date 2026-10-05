// Compact, consistent navigation keeps activities close to the practice area.
(() => {
 const nav=document.querySelector('nav[aria-label="Activities"]');
 const labels={adventure:['⌂','Home','Daily adventures'],write:['Aa','Write','Trace & try'],read:['▤','Read','Books & words'],draw:['✎','Draw','Make something'],math:['123','Maths','Numbers & shapes']};
 for(const button of nav.querySelectorAll('[data-mode]')){const [icon,title,hint]=labels[button.dataset.mode];button.innerHTML=`<span class="tile-icon" aria-hidden="true">${icon}</span><span><b>${title}</b><small>${hint}</small></span>`;button.setAttribute('aria-label',title+' · '+hint);const go=button.onclick;button.onclick=()=>{go();document.querySelector('#workspace').scrollIntoView({block:'start',behavior:'auto'})}}
 nav.prepend(nav.querySelector('[data-mode="adventure"]'));
 const brand=document.querySelector('.brand');brand.onclick=e=>{e.preventDefault();switchMode('adventure');window.scrollTo({top:0,behavior:'auto'})};
 document.querySelector('.welcome h1').textContent='A little adventure awaits!';
 document.querySelector('.welcome p').textContent='Read, create, and discover something new.';
 document.querySelector('.session small').textContent='Your effort stars';
 switchMode('adventure');
})();
