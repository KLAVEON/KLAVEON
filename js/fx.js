(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var d=document.documentElement;
  // Slide-up reveals
  if(!rm&&'IntersectionObserver' in window){
    d.classList.add('js-rv');
    var sel='.sec-title,.pr,.brow,.pc,.sub,.proj,.cta2 .cols>*,.vtx,.vgrid,.rs,.card,.lst li,.hsteps li,main section:not(.lc):not(.unlock):not(.h-hero)>h2,main section:not(.lc):not(.unlock):not(.h-hero)>p';
    var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){return !e.closest('.lc,.unlock,.h-hero,.mq')});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rv-in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(e){
      var sibs=e.parentNode?[].slice.call(e.parentNode.children).filter(function(c){return els.indexOf(c)>-1}):[e];
      e.style.setProperty('--rd',Math.min(sibs.indexOf(e),4)*90+'ms');
      e.classList.add('rv');io.observe(e);
    });
  }
})();
