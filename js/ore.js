(function(){
  var N=16,R=100;
  function pts(radii,jit){var a=[];for(var i=0;i<N;i++){var th=(i/N)*Math.PI*2-Math.PI/2+(jit?jit[i]:0);a.push([Math.cos(th)*R*radii[i],Math.sin(th)*R*radii[i]])}return a}
  var S=[
    pts([.78,1,.68,.95,.6,.92,.8,1,.64,.9,.74,1,.58,.88,.72,.96],[.05,-.08,.1,-.04,.07,-.1,.03,.08,-.06,.09,-.03,.06,-.09,.04,.08,-.05]),
    pts([1,.84,1,.84,1,.84,1,.84,1,.84,1,.84,1,.84,1,.84]),
    pts([1,.96,1,.96,1,.96,1,.96,1,.96,1,.96,1,.96,1,.96]),
    pts([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1])
  ];
  var smooth=[0,0,.75,1],col=[[139,134,128],[176,172,168],[218,216,214],[255,255,255]];
  var path=document.getElementById('lcp'),hl=document.getElementById('lcf'),cuts=document.getElementById('lcc');
  function lerp(a,b,t){return a+(b-a)*t}
  function build(P,s){
    var n=P.length,d='';
    for(var i=0;i<n;i++){
      var p0=P[(i-1+n)%n],p1=P[i],p2=P[(i+1)%n],p3=P[(i+2)%n];
      if(i===0)d+='M'+p1[0].toFixed(1)+' '+p1[1].toFixed(1);
      var k=s/6;
      var c1=[p1[0]+(p2[0]-p0[0])*k,p1[1]+(p2[1]-p0[1])*k],c2=[p2[0]-(p3[0]-p1[0])*k,p2[1]-(p3[1]-p1[1])*k];
      d+='C'+c1[0].toFixed(1)+' '+c1[1].toFixed(1)+' '+c2[0].toFixed(1)+' '+c2[1].toFixed(1)+' '+p2[0].toFixed(1)+' '+p2[1].toFixed(1);
    }
    return d+'Z';
  }
  var sec=document.getElementById('lc'),tx=[].slice.call(document.querySelectorAll('.lc-tx')),nav=[].slice.call(document.querySelectorAll('.lc-nav li')),last=-1,tick=false;
  function upd(){tick=false;
    var r=sec.getBoundingClientRect(),span=sec.offsetHeight-innerHeight,p=Math.min(3,Math.max(0,-r.top/span*3.2));
    var i=Math.min(2,Math.floor(p)),t=p-i;if(p>=3){i=2;t=1}
    t=t*t*(3-2*t);
    var P=S[i].map(function(a,j){var b=S[i+1][j];return [lerp(a[0],b[0],t),lerp(a[1],b[1],t)]});
    var s=lerp(smooth[i],smooth[i+1],t);
    var d=build(P,s);path.setAttribute('d',d);hl.setAttribute('d',d);
    var c=col[i].map(function(v,j){return Math.round(lerp(v,col[i+1][j],t))});
    path.setAttribute('fill','rgb('+c.join(',')+')');
    var fa=Math.max(0,1-Math.abs(p-1)*1.6),g='';
    if(fa>0.01){for(var j=0;j<N;j+=2){g+='<path d="M0 0L'+P[j][0].toFixed(1)+' '+P[j][1].toFixed(1)+'" opacity="'+fa.toFixed(2)+'"/>'}}
    cuts.innerHTML=g;
    var k=Math.min(3,Math.round(p));
    if(k!==last){last=k;tx.forEach(function(e,m){e.classList.toggle('on',m===k)});nav.forEach(function(e,m){e.classList.toggle('on',m===k)})}
  }
  function req(){if(!tick){tick=true;requestAnimationFrame(upd)}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);upd();
})();
