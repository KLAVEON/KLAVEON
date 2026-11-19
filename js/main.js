(function(){
  function store(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
  // Work page: grid / explore / list
  var work=document.querySelector('.work');
  if(work){
    var tg=document.querySelector('.work-tg'),ind=tg.querySelector('.ind');
    var btns={grid:document.getElementById('v-grid'),explore:document.getElementById('v-explore'),list:document.getElementById('v-list')};
    var cur=null;
    var place=function(){var b=btns[cur];ind.style.left=b.offsetLeft+'px';ind.style.right=(tg.clientWidth-b.offsetLeft-b.offsetWidth)+'px'};
    var order=['grid','explore','list'];
    var setW=function(m,first){
      if(m===cur)return;var prev=cur;cur=m;
      Object.keys(btns).forEach(function(k){btns[k].classList.toggle('is-active',k===m)});
      if(first){ind.classList.add('sync');place();void ind.offsetWidth;ind.classList.remove('sync')}
      else{ind.classList.remove('sync','to-l','to-r');ind.classList.add(order.indexOf(m)>order.indexOf(prev)?'to-r':'to-l');place()}
      work.setAttribute('data-v',m);window.scrollTo(0,0);store('kl-work-view',m);
    };
    order.forEach(function(k){btns[k].addEventListener('click',function(){setW(k)})});
    setW(store('kl-work-view')||'grid',true);
    window.addEventListener('resize',place);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(place);
    // grid: arrow follows cursor
    document.querySelectorAll('.card').forEach(function(c){var a=c.querySelector('.arrow'),w=c.querySelector('.imgw');
      w.addEventListener('mousemove',function(e){var r=w.getBoundingClientRect();a.style.left=(e.clientX-r.left)+'px';a.style.top=(e.clientY-r.top)+'px'})});
    // explore: depth drift with the pointer
    var ex=document.querySelector('.explore'),items=[].slice.call(ex.querySelectorAll('a')),tx=0,ty=0,cx=0,cy=0,run=false;
    var loop=function(){cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;
      items.forEach(function(it){var d=+it.getAttribute('data-d');it.style.transform='translate3d('+(cx*d*-60).toFixed(1)+'px,'+(cy*d*-40).toFixed(1)+'px,0)'});
      if(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001)requestAnimationFrame(loop);else run=false};
    ex.addEventListener('mousemove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;if(!run){run=true;requestAnimationFrame(loop)}});
    // filter pill
    var fl=document.querySelector('.filter'),fb=fl.querySelector('.bar'),lab=document.getElementById('f-label');
    var fo=function(o){fl.classList.toggle('is-open',o);fb.setAttribute('aria-expanded',o)};
    fb.addEventListener('click',function(){fo(!fl.classList.contains('is-open'))});
    document.addEventListener('click',function(e){if(!fl.contains(e.target))fo(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')fo(false)});
    fl.querySelectorAll('.menu button').forEach(function(b){b.addEventListener('click',function(){
      var f=b.getAttribute('data-f'),n=0;
      fl.querySelectorAll('.menu button').forEach(function(x){x.classList.toggle('is-on',x===b)});
      document.querySelectorAll('.card').forEach(function(c){var ok=!f||c.getAttribute('data-cat')===f;c.style.display=ok?'':'none';if(ok)n++});
      lab.textContent=(f||'All Projects')+' ('+n+')';fo(false)})});
  }
  // Case study: Defining Idea card and Visual / Reading view
  var cs=document.querySelector('.cs');
  if(cs){
    var idea=document.querySelector('.idea'),bar=idea&&idea.querySelector('.bar');
    var touch=window.matchMedia('(hover:none)');
    var open=function(o){idea.classList.toggle('is-open',o);bar.setAttribute('aria-expanded',o)};
    bar.addEventListener('click',function(){if(touch.matches)open(!idea.classList.contains('is-open'))});
    idea.addEventListener('mouseenter',function(){if(!touch.matches)bar.setAttribute('aria-expanded','true')});
    idea.addEventListener('mouseleave',function(){if(!touch.matches)bar.setAttribute('aria-expanded','false')});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){open(false);bar.blur()}});
    document.addEventListener('click',function(e){if(!idea.contains(e.target))open(false)});
    var tg=document.querySelector('.toggle'),ind=tg.querySelector('.ind');
    var v=document.getElementById('v-visual'),r=document.getElementById('v-reading');
    var cur=null,busy=false,raf=0;
    var place=function(btn){
      var l=btn.offsetLeft,rt=tg.clientWidth-(l+btn.offsetWidth);
      ind.style.left=l+'px';ind.style.right=rt+'px';
    };
    var active=function(){return cur==='reading'?r:v};
    var follow=function(ms){
      cancelAnimationFrame(raf);ind.classList.add('sync');
      var t0=performance.now();
      (function step(t){place(active());if(t-t0<ms)raf=requestAnimationFrame(step);else{ind.classList.remove('sync')}})(t0);
    };
    ['mouseenter','mouseleave','focusin','focusout','touchend'].forEach(function(ev){tg.addEventListener(ev,function(){follow(650)})});
    var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var setV=function(m,first){
      if(m===cur)return;
      var rd=m==='reading',prev=cur;cur=m;
      v.classList.toggle('is-active',!rd);r.classList.toggle('is-active',rd);
      v.setAttribute('aria-pressed',!rd);r.setAttribute('aria-pressed',rd);
      cancelAnimationFrame(raf);
      if(first){ind.classList.add('sync');place(active());void ind.offsetWidth;ind.classList.remove('sync');cs.classList.toggle('is-reading',rd);return}
      ind.classList.remove('sync','to-l','to-r');ind.classList.add(rd?'to-r':'to-l');place(active());
      var top=document.querySelector('.cover');top=top?top.getBoundingClientRect().bottom+window.scrollY:0;
      var swap=function(){
        cs.classList.toggle('is-reading',rd);
        if(window.scrollY>top)window.scrollTo(0,top);
        requestAnimationFrame(function(){cs.classList.remove('is-swapping')});
      };
      if(reduce){swap();return}
      cs.classList.add('is-swapping');setTimeout(swap,240);
      store('kl-view',m);
    };
    v.addEventListener('click',function(){setV('visual')});
    r.addEventListener('click',function(){setV('reading')});
    setV('visual',true);
    window.addEventListener('resize',function(){place(active())});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){place(active())});
  }

  // Home
  if(document.body.classList.contains('home')){
    var unlock=document.getElementById('unlock'),stage=document.getElementById('stage'),dark=document.getElementById('dark'),door=document.getElementById('door');
    var fld=document.querySelector('.unlock .field'),cr=document.getElementById('cr'),cap=document.getElementById('cap'),lensP=document.getElementById('lens'),iris=document.getElementById('iris'),glint=document.getElementById('glint'),irisG=document.getElementById('irisg');
    var capH=16,W=0,H=0,top0=0,span=1,last=-1,ticking=false,pad=32;
    function ease(t){return t*t*(3-2*t)}
    function panelH(){return Math.min((W-2*pad)/1.63,H-96)}
    var idleO=1;
    function draw(p){
      var e=ease(Math.min(1,Math.max(0,(p-0.14)/0.71)));
      var o=p<0.14?1-0.93*Math.sin(Math.PI*p/0.14):1;o=Math.min(o,idleO);
      var ph=panelH(),inset=1-p,m=(H-ph)/2;
      var x0=pad*inset,y0=m*inset,y1=H-m*inset;
      var mob=W<768,cx=W/2,cy=(y0+y1)/2;
      var r0=Math.max(9,W*(mob?0.032:0.0125));
      var smax=Math.hypot(W,H)*1.15/r0;
      var s=Math.exp(Math.log(smax)*e);
      var a=r0*3.4*s,h=r0*1.75*s*o,ri=r0*1.35*s;
      var lens='M'+(cx-a)+' '+cy+'Q'+cx+' '+(cy-2*h)+' '+(cx+a)+' '+cy+'Q'+cx+' '+(cy+2*h)+' '+(cx-a)+' '+cy+'Z';
      var d='M'+(x0-2)+' '+(y0-2)+'H'+(W-x0+2)+'V'+(y1+2)+'H'+(x0-2)+'Z'+lens;
      dark.setAttribute('d',d);lensP.setAttribute('d',lens);
      iris.setAttribute('cx',cx);iris.setAttribute('cy',cy);iris.setAttribute('r',ri);
      glint.setAttribute('cx',cx-ri*0.32);glint.setAttribute('cy',cy-ri*0.32);glint.setAttribute('r',ri*0.17);
      var iv=Math.min(1,Math.max(0,(p-0.2)/0.3));irisG.style.opacity=String(1-iv*iv*(3-2*iv));
      cr.setAttribute('x',x0);cr.setAttribute('y',y0);cr.setAttribute('width',Math.max(0,W-2*x0));cr.setAttribute('height',Math.max(0,y1-y0));
      if(fld)fld.style.opacity=String(Math.min(1,Math.max(0,(p-.3)/.3)));
      if(cap){cap.style.opacity=String(Math.max(0,1-p*7));cap.style.transform='translateY('+Math.max(0,y0-(mob?32:40)-capH)+'px)'}
    }
    function measure(){pad=window.innerWidth<768?16:32;
      W=stage.clientWidth;H=stage.clientHeight;
      door.setAttribute('viewBox','0 0 '+W+' '+H);
      capH=cap?cap.offsetHeight:16;unlock.style.marginTop=((W<768?112:Math.round(Math.max(120,Math.min(W*0.14,230))))-(H-panelH())/2)+'px';
      top0=unlock.getBoundingClientRect().top+window.scrollY;span=Math.max(1,unlock.offsetHeight-H);
      last=-1;frame();
    }
    function frame(y){
      var p=Math.min(1,Math.max(0,((y===undefined?window.scrollY:y)-top0)/span));
      if(Math.abs(p-last)<0.001&&p>0&&p<1)return;
      last=p;draw(p);
    }
    if(unlock&&stage){
      measure();
      if('ResizeObserver' in window){var ro=new ResizeObserver(function(){var w=stage.clientWidth;if(w!==W||Math.abs(stage.clientHeight-H)>120)measure()});ro.observe(stage)}else{window.addEventListener('resize',measure)}
      window.addEventListener('load',measure);
      if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){setInterval(function(){if(last>0.02||document.hidden)return;var t0=performance.now();(function step(t){var k=(t-t0)/340;if(k>=1){idleO=1;draw(Math.max(0,last));return}idleO=1-0.93*Math.sin(Math.PI*k);draw(Math.max(0,last));requestAnimationFrame(step)})(t0)},4200)}
      if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
    }
    // Nav: hide on scroll down, return on scroll up
    var nav=document.querySelector('.nav'),lastY=window.scrollY,mb=document.querySelector('.menu-btn');if(mb)mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o?'true':'false')});
    function navState(y){if(!nav)return;var h=y>lastY&&y>160,s=y>40,c=y>window.innerWidth*0.05;if(h!==nav._h){nav.classList.toggle('is-hidden',h);nav._h=h}if(s!==nav._s){nav.classList.toggle('is-solid',s);nav._s=s}if(c!==nav._c){nav.classList.toggle('is-compact',c);nav._c=c}if(!c&&nav._o){nav.classList.remove('is-open');mb&&mb.setAttribute('aria-expanded','false');nav._o=false}lastY=y}
    if(mb)mb.addEventListener('click',function(){nav._o=nav.classList.contains('is-open')});
    function navDark(){if(!nav||!document.elementsFromPoint)return;var els=document.elementsFromPoint(Math.round(innerWidth/2),Math.round(nav.offsetHeight/2)),t=null;for(var i=0;i<els.length;i++){if(!nav.contains(els[i])){t=els[i];break}}var d=!!(t&&t.closest&&t.closest('.unlock,.cta2'));if(d!==nav._d){nav.classList.toggle('on-dark',d);nav._d=d}}
    var q=false;function tick(){q=false;var y=window.scrollY;navState(y);navDark();if(unlock&&stage)frame(y)}
    window.addEventListener('scroll',function(){if(!q){q=true;requestAnimationFrame(tick)}},{passive:true});
    tick();
    // Process panel: the step under the pointer or focus is active
    var steps=[].slice.call(document.querySelectorAll('.panel .step'));
    steps.forEach(function(st){st.setAttribute('tabindex','0');['mouseenter','focus'].forEach(function(ev){st.addEventListener(ev,function(){steps.forEach(function(o){o.classList.toggle('is-active',o===st)})})})});
    if(steps[0])steps[0].classList.add('is-active');
    // Cursor label over the project
    var cur=document.getElementById('cur'),mx=0,my=0,mq=false;
    if(cur&&window.matchMedia('(hover: hover)').matches){
      var place=function(){mq=false;cur.style.setProperty('--cx',mx+'px');cur.style.setProperty('--cy',my+'px')};
      document.querySelectorAll('[data-cur]').forEach(function(el){
        el.addEventListener('mouseenter',function(e){mx=e.clientX;my=e.clientY;place();var l=el.getAttribute('data-cur');if(l==='arrow'){cur.innerHTML='<svg viewBox="0 0 32 32" width="36" height="36" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"><path d="M5 16h21M18 8l8 8-8 8"/></svg>'}else{cur.textContent=l}cur.classList.add('on')});
        el.addEventListener('mouseleave',function(){cur.classList.remove('on')});
        el.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!mq){mq=true;requestAnimationFrame(place)}},{passive:true});
      });
    }
    // Pause looping animations when offscreen
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('is-off',!e.isIntersecting)})},{rootMargin:'100px'});document.querySelectorAll('.htile,.mq').forEach(function(el){io.observe(el)})}
    // Contact form
    var of=document.getElementById('open-form'),fm=document.getElementById('form');
    if(fm){fm.addEventListener('submit',function(e){e.preventDefault();var msg=document.getElementById('fmsg'),bad=[].slice.call(fm.querySelectorAll('[required]')).filter(function(x){x.removeAttribute('aria-invalid');return !x.value.trim()||(x.type==='email'&&!/^\S+@\S+\.\S+$/.test(x.value))});
      if(bad.length){bad.forEach(function(x){x.setAttribute('aria-invalid','true')});msg.className='fmsg err';msg.textContent='That did not send. Check the marked fields and try again.';bad[0].focus();return}
      var b=fm.querySelector('.submit');b.disabled=true;msg.className='fmsg';msg.textContent='';
      fetch('https://formsubmit.co/ajax/klaveonfoundry@gmail.com',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(fm)}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(){fm.reset();msg.className='fmsg ok';msg.textContent='Received. KLAVEON reviews every submission within 48 hours.';b.disabled=false}).catch(function(){msg.className='fmsg err';msg.textContent='That did not send. Check the marked fields and try again.';b.disabled=false})})}
    if(of&&fm){of.addEventListener('click',function(e){e.preventDefault();fm.scrollIntoView({behavior:'smooth',block:'center'});var f=document.getElementById('n');if(f)setTimeout(function(){f.focus({preventScroll:true})},500)})}
  }
})();
(function(){
  var md=document.getElementById('mdiag');if(!md)return;
  var stage=md.querySelector('.mstage'),orbit=md.querySelector('.orbit'),nodes=[].slice.call(md.querySelectorAll('.nd')),items=[].slice.call(md.querySelectorAll('.mstep'));
  var N=nodes.length,cur=-1,ang=[0,90,180,270],base=0;
  function R(){return orbit.clientWidth/2}
  function layout(rot){nodes.forEach(function(n,i){n.style.transform='rotate('+ang[i]+'deg) translateY(-'+R()+'px) rotate('+(-(ang[i]+rot))+'deg)'});orbit.style.transform='rotate('+rot+'deg)'}
  function set(i){if(i===cur)return;var first=cur<0;cur=i;
    if(first){nodes.forEach(function(n){n.style.transition='none'});orbit.style.transition='none'}
    layout(-ang[i]);
    if(first){void orbit.offsetWidth;nodes.forEach(function(n){n.style.transition=''});orbit.style.transition=''}
    nodes.forEach(function(n,k){n.classList.toggle('on',k===i)});items.forEach(function(m,k){m.classList.toggle('on',k===i)})}
  function idx(){var r=md.getBoundingClientRect(),span=md.offsetHeight-window.innerHeight,p=Math.min(1,Math.max(0,-r.top/Math.max(1,span)));return Math.min(N-1,Math.floor(p*N*0.999))}
  function go(i){var span=md.offsetHeight-window.innerHeight,top=md.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:top+span*((i+.5)/N),behavior:'smooth'})}
  var t=false;function onS(){if(t)return;t=true;requestAnimationFrame(function(){t=false;set(idx())})}
  window.addEventListener('scroll',onS,{passive:true});window.addEventListener('resize',function(){var c=cur;cur=-1;set(c<0?0:c)});
  nodes.forEach(function(n,i){n.addEventListener('click',function(){go(i)})});
  items.forEach(function(m,i){var a=m.querySelector('.nx');a.addEventListener('click',function(e){if(i<N-1){e.preventDefault();go(i+1)}else{a.setAttribute('href','../index.html#contact')}})});
  set(idx());
})();
