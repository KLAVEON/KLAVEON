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
    var open=function(o){idea.classList.toggle('is-open',o);bar.setAttribute('aria-expanded',o);var ic=bar.querySelector('.mstep');if(ic)ic.textContent=o?'remove':'add'};
    bar.addEventListener('click',function(){open(!idea.classList.contains('is-open'))});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')open(false)});
    var v=document.getElementById('v-visual'),r=document.getElementById('v-reading');
    var setV=function(m){var rd=m==='reading';cs.classList.toggle('is-reading',rd);v.classList.toggle('is-active',!rd);r.classList.toggle('is-active',rd);store('kl-view',m)};
    v.addEventListener('click',function(){setV('visual')});
    r.addEventListener('click',function(){setV('reading')});
    setV('visual');
  }

  // Home
  if(document.body.classList.contains('home')){
    var unlock=document.getElementById('unlock'),stage=document.getElementById('stage'),dark=document.getElementById('dark'),door=document.getElementById('door');
    var fld=document.querySelector('.unlock .field'),cr=document.getElementById('cr'),cap=document.getElementById('cap');
    var capH=16,W=0,H=0,top0=0,span=1,last=-1,ticking=false,pad=32;
    function ease(t){return t*t*(3-2*t)}
    function panelH(){return Math.min((W-2*pad)/1.63,H-96)}
    function draw(p){
      var e=ease(Math.min(1,p/0.85));
      var ph=panelH(),inset=1-p,m=(H-ph)/2;
      var x0=pad*inset,y0=m*inset,y1=H-m*inset;
      var mob=W<768,cx=W/2,cy=(y0+y1)/2;
      var r0=Math.max(9,W*(mob?0.032:0.0125));
      var smax=Math.hypot(W,H)*1.15/r0;
      var s=Math.exp(Math.log(smax)*e);
      var r=r0*s,nw=r0*0.5*s,bot=r0*3.4*s;
      var jy=Math.sqrt(r*r-nw*nw);
      var ccy=cy-r0*s*0.55;
      var d='M'+(x0-2)+' '+(y0-2)+'H'+(W-x0+2)+'V'+(y1+2)+'H'+(x0-2)+'Z'
        +'M'+(cx-nw)+' '+(ccy+jy)+'A'+r+' '+r+' 0 1 1 '+(cx+nw)+' '+(ccy+jy)+'L'+(cx+nw*1.55)+' '+(ccy+jy+bot)+'H'+(cx-nw*1.55)+'L'+(cx-nw)+' '+(ccy+jy)+'Z';
      dark.setAttribute('d',d);cr.setAttribute('x',x0);cr.setAttribute('y',y0);cr.setAttribute('width',Math.max(0,W-2*x0));cr.setAttribute('height',Math.max(0,y1-y0));
      if(fld)fld.style.opacity=String(Math.min(1,Math.max(0,(p-.14)/.3)));
      if(cap){cap.style.opacity=String(Math.max(0,1-p*7));cap.style.transform='translateY('+Math.max(0,y0-(mob?32:40)-capH)+'px)'}
    }
    function measure(){
      W=stage.clientWidth;H=stage.clientHeight;
      door.setAttribute('viewBox','0 0 '+W+' '+H);
      capH=cap?cap.offsetHeight:16;unlock.style.marginTop=((W<768?112:Math.round(Math.max(120,Math.min(W*0.14,230))))-(H-panelH())/2)+'px';
      top0=unlock.getBoundingClientRect().top+window.scrollY;span=Math.max(1,unlock.offsetHeight-H);
      last=-1;frame();
    }
    function frame(){
      ticking=false;
      var p=Math.min(1,Math.max(0,(window.scrollY-top0)/span));
      if(Math.abs(p-last)<0.001&&p>0&&p<1)return;
      last=p;draw(p);
    }
    function onScroll(){frame()}
    if(unlock&&stage){
      measure();
      window.addEventListener('scroll',onScroll,{passive:true});
      if('ResizeObserver' in window){var ro=new ResizeObserver(function(){var w=stage.clientWidth;if(w!==W||Math.abs(stage.clientHeight-H)>120)measure()});ro.observe(stage)}else{window.addEventListener('resize',measure)}
      window.addEventListener('load',measure);
    }
    // Nav: hide on scroll down, return on scroll up
    var nav=document.querySelector('.nav'),lastY=window.scrollY,mb=document.querySelector('.menu-btn');if(mb)mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o?'true':'false')});
    window.addEventListener('scroll',function(){var y=window.scrollY;if(nav){nav.classList.toggle('is-hidden',y>lastY&&y>160);nav.classList.toggle('is-solid',y>40);nav.classList.toggle('is-compact',y>window.innerWidth*0.05);if(y<=window.innerWidth*0.05){nav.classList.remove('is-open');mb&&mb.setAttribute('aria-expanded','false')}}lastY=y},{passive:true});
    // Process panel: the step under the pointer or focus is active
    var steps=[].slice.call(document.querySelectorAll('.panel .step'));
    steps.forEach(function(st){st.setAttribute('tabindex','0');['mouseenter','focus'].forEach(function(ev){st.addEventListener(ev,function(){steps.forEach(function(o){o.classList.toggle('is-active',o===st)})})})});
    if(steps[0])steps[0].classList.add('is-active');
    // Cursor label over the project
    var cur=document.getElementById('cur');
    if(cur&&window.matchMedia('(hover: hover)').matches){
      document.querySelectorAll('[data-cur]').forEach(function(el){
        el.addEventListener('mouseenter',function(){cur.textContent=el.getAttribute('data-cur');cur.classList.add('on')});
        el.addEventListener('mouseleave',function(){cur.classList.remove('on')});
        el.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'});
      });
    }
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
