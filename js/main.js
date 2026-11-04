(function(){
  function store(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
  // Work page: grid / list
  var work=document.querySelector('.work');
  if(work){
    var g=document.getElementById('v-grid'),l=document.getElementById('v-list');
    var setW=function(m){var list=m==='list';work.classList.toggle('is-list',list);g.classList.toggle('is-active',!list);l.classList.toggle('is-active',list);store('kl-work-view',m)};
    g.addEventListener('click',function(){setW('grid')});
    l.addEventListener('click',function(){setW('list')});
    setW(store('kl-work-view')||'grid');
  }
  // Case study: Defining Idea card and Visual / Reading view
  var cs=document.querySelector('.cs');
  if(cs){
    var idea=document.querySelector('.idea'),bar=idea&&idea.querySelector('.bar');
    var open=function(o){idea.classList.toggle('is-open',o);bar.setAttribute('aria-expanded',o);var ic=bar.querySelector('.ms');if(ic)ic.textContent=o?'remove':'add'};
    bar.addEventListener('click',function(){open(!idea.classList.contains('is-open'))});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')open(false)});
    var v=document.getElementById('v-visual'),r=document.getElementById('v-reading');
    var setV=function(m){var rd=m==='reading';cs.classList.toggle('is-reading',rd);v.classList.toggle('is-active',!rd);r.classList.toggle('is-active',rd);store('kl-view',m)};
    v.addEventListener('click',function(){setV('visual')});
    r.addEventListener('click',function(){setV('reading')});
    setV('visual');
  }

  // Home: scroll to unlock, and contact form reveal
  var kh=document.getElementById('keyhole');
  if(kh&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var tick=function(){var r=kh.getBoundingClientRect(),vh=window.innerHeight;var p=Math.min(1,Math.max(0,(vh-r.top)/(vh*.8)));kh.style.transform='scale('+(0.86+0.14*p).toFixed(3)+')'};
    window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick);tick();
  }else if(kh){kh.style.transform='none'}
  var of=document.getElementById('open-form'),fm=document.getElementById('form');
  if(of&&fm){of.addEventListener('click',function(e){e.preventDefault();fm.classList.add('open');var f=document.getElementById('n');if(f)f.focus()})}
})();
