/* KLAVEON interactions: tabs, programme selector, FAQ accordion, gallery slider, stacking cards. Vanilla JS, no dependencies. */
(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Tabs (used by "What we do" and the programme selector) */
  [].forEach.call(document.querySelectorAll('[data-tabs]'),function(root){
    var tabs=[].slice.call(root.querySelectorAll('[role=tab]')),panels=[].slice.call(root.querySelectorAll('[role=tabpanel]'));
    function set(i,focus){
      tabs.forEach(function(t,k){var on=k===i;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;panels[k].classList.toggle('is-on',on)});
      root.style.setProperty('--i',i);
      if(focus)tabs[i].focus();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){set(i,false)});
      t.addEventListener('keydown',function(e){
        var k=e.key,n=tabs.length,c=tabs.indexOf(t);
        if(k==='ArrowDown'||k==='ArrowRight'){e.preventDefault();set((c+1)%n,true)}
        else if(k==='ArrowUp'||k==='ArrowLeft'){e.preventDefault();set((c-1+n)%n,true)}
        else if(k==='Home'){e.preventDefault();set(0,true)}
        else if(k==='End'){e.preventDefault();set(n-1,true)}
      });
    });
    set(0,false);
  });

  /* FAQ accordion: one answer open at a time */
  var fq=[].slice.call(document.querySelectorAll('.fq button'));
  fq.forEach(function(b){b.addEventListener('click',function(){
    var open=b.getAttribute('aria-expanded')==='true';
    fq.forEach(function(o){o.setAttribute('aria-expanded','false');o.closest('.fq').classList.remove('is-open')});
    if(!open){b.setAttribute('aria-expanded','true');b.closest('.fq').classList.add('is-open')}
  })});
  fq.forEach(function(b){if(b.getAttribute('aria-expanded')==='true')b.closest('.fq').classList.add('is-open')});

  /* Gallery slider: arrows, keyboard, drag with a mouse, native swipe on touch */
  var gl=document.querySelector('.gl');
  if(gl){
    var figs=[].slice.call(gl.children),cnt=document.querySelector('.gl-count'),prev=document.querySelector('.gl-prev'),next=document.querySelector('.gl-next');
    function step(){return figs[0]?figs[0].getBoundingClientRect().width+parseFloat(getComputedStyle(gl).columnGap||0):300}
    function idx(){return Math.min(figs.length-1,Math.max(0,Math.round(gl.scrollLeft/step())))}
    function upd(){
      var i=idx(),pad=function(n){return(n<10?'0':'')+n};
      if(cnt)cnt.textContent=pad(i+1)+' / '+pad(figs.length);
      prev.disabled=gl.scrollLeft<4;next.disabled=gl.scrollLeft>gl.scrollWidth-gl.clientWidth-4;
    }
    function go(d){gl.scrollBy({left:d*step(),behavior:rm?'auto':'smooth'})}
    prev.addEventListener('click',function(){go(-1)});next.addEventListener('click',function(){go(1)});
    gl.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});
    gl.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
    var down=false,sx=0,sl=0,moved=false;
    gl.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=gl.scrollLeft;gl.classList.add('is-drag')});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>3)moved=true;gl.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;gl.classList.remove('is-drag');if(moved){var t=idx()*step();gl.scrollTo({left:t,behavior:rm?'auto':'smooth'})}});
    gl.addEventListener('click',function(e){if(moved){e.preventDefault();moved=false}},true);
    addEventListener('resize',upd);upd();
  }

  /* Stacking cards: each .cs section sticks when its bottom reaches the screen, and the next card slides up over it */
  var cards=[].slice.call(document.querySelectorAll('main > .stk'));
  if(cards.length&&!rm){
    var main=cards[0].parentNode,kids=[].slice.call(main.children),first=kids.indexOf(cards[0]);
    document.documentElement.classList.add('has-stack');
    kids.forEach(function(k,i){if(i>=first)k.style.zIndex=String(i-first+2)});
    var vh=innerHeight,ticking=false;
    function layout(){
      vh=innerHeight;
      cards.forEach(function(c){c.style.top=Math.min(0,vh-c.offsetHeight)+'px'});
      frame();
    }
    function frame(){
      ticking=false;
      cards.forEach(function(c,i){
        var n=null,ci=kids.indexOf(c);
        for(var k=ci+1;k<kids.length;k++){var t=kids[k];if(t.offsetHeight>0){n=t;break}}
        var p=0;
        if(n){p=Math.min(1,Math.max(0,(vh-n.getBoundingClientRect().top)/vh))}
        var stuck=c.getBoundingClientRect().bottom<=vh+1||c.offsetHeight<=vh;
        p=stuck?p:0;
        c.style.setProperty('--dim',p.toFixed(3));
        c.style.transform=p>0?'scale('+(1-.045*p).toFixed(4)+')':'';
        c.style.transformOrigin='50% '+(c.offsetHeight>vh?'100%':'0%');
      });
    }
    function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
    addEventListener('scroll',req,{passive:true});addEventListener('resize',layout);addEventListener('load',layout);
    if('ResizeObserver' in window){var ro=new ResizeObserver(layout);cards.forEach(function(c){ro.observe(c)})}
    layout();
  }
})();
