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

  // Home
  if(document.body.classList.contains('home')){
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var unlock=document.getElementById('unlock'),stage=document.getElementById('stage'),hole=document.getElementById('hole'),arc=document.getElementById('arc');
    var fld=document.querySelector('.unlock .field');var CX=800,CY=470,MAXS=90;
    function setP(p){
      stage.style.setProperty('--p',p.toFixed(4));if(fld)fld.style.opacity=String(Math.min(1,Math.max(0,(p-.12)/.3)));
      var e=Math.min(1,p/0.82),s=Math.exp(Math.log(MAXS)*e*e*(3-2*e)*1);
      hole.setAttribute('transform','translate('+CX+' '+CY+') scale('+s.toFixed(3)+') translate('+(-CX)+' '+(-CY)+')');
      arc.style.opacity=String(Math.max(0,1-p*2.2));
    }
    if(unlock&&stage){
      if(reduce){setP(1)}else{
        var upd=function(){var r=unlock.getBoundingClientRect(),span=unlock.offsetHeight-window.innerHeight;setP(Math.min(1,Math.max(0,-r.top/span)))};
        window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
      }
    }
    // Nav: hide on scroll down, return on scroll up
    var nav=document.querySelector('.nav'),lastY=window.scrollY;
    window.addEventListener('scroll',function(){var y=window.scrollY;if(nav){nav.classList.toggle('is-hidden',y>lastY&&y>160)}lastY=y},{passive:true});
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
    if(of&&fm){of.addEventListener('click',function(e){e.preventDefault();fm.scrollIntoView({behavior:'smooth',block:'center'});var f=document.getElementById('n');if(f)setTimeout(function(){f.focus({preventScroll:true})},500)})}
  }
})();
