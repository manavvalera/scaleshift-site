if(!window.gsap){var _l=document.getElementById('ld');if(_l)_l.style.display='none';document.body.classList.add('go');throw new Error('animation library missing')}
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches,lite=!fine||innerWidth<800,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(lite)document.documentElement.classList.add('lite');
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],R=gsap.utils.random;gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
let ac,gn,fl,mo,lastF=200,lastB=0,on=1,K=0,P=0,warp=0,mode='build';
function mkAudio(){if(ac)return;try{ac=new(window.AudioContext||window.webkitAudioContext)();gn=ac.createGain();gn.gain.value=.03;mo=ac.createDynamicsCompressor();fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=200;fl.Q.value=.3;[55,55.7,82.4].forEach(f=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(fl);o.start()});fl.connect(gn);gn.connect(mo);mo.connect(ac.destination)}catch(e){}}
function audio(){if(!ac)mkAudio();try{ac&&ac.state==='suspended'&&ac.resume()}catch(e){}}
(window.requestIdleCallback||setTimeout)(()=>setTimeout(mkAudio,400));
function blip(f=600,d=.07){if(!ac||!on||!mo)return;const t=ac.currentTime;if(t-lastB<.09)return;lastB=t;const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.045,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d+.012);o.connect(g);g.connect(mo);o.start(t);o.stop(t+d+.03)}
let ls=null;if(window.Lenis&&fine){ls=new Lenis({lerp:.085});ls.on('scroll',ScrollTrigger.update);gsap.ticker.lagSmoothing(0)}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href'),t=h.length>1&&$(h);if(!t)return;e.preventDefault();ls?ls.scrollTo(t):t.scrollIntoView({behavior:'smooth'})}));
if(lite){const h=$('.hint');if(h)h.textContent='// PLAY · OUR GAMES — SWIPE →'}
// loader
let lp=0;const li=setInterval(()=>{lp+=Math.random()*18;if(lp>=100){lp=100;clearInterval(li);(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{document.body.classList.add('go');$('#en').style.display='block';ScrollTrigger.refresh()})}$('#lp i').style.width=lp+'%'},110);
gsap.set('.hl',{yPercent:110});
$('#en').onclick=()=>{document.body.classList.add('go');audio();blip(440,.15);blip(880,.3);$('#ld').classList.add('x');gsap.to('.hl',{yPercent:0,duration:1.3,stagger:.12,ease:'expo.out',delay:.2});warp+=8;P=1};
// mode switch (PLAY <-> BUILD)
const WD={build:['websites','apps','products','AI tools','platforms'],play:['worlds','bosses','levels','legends','games']},SUB={build:'A creative tech studio. We craft websites, mobile apps and AI tools for businesses — and our own games for players.',play:'We make games that bend your brain — and build games for brands, studios and creators who dream bigger.'};
let wi=0;function toast(t){const e=$('#tt');e.textContent=t;gsap.fromTo(e,{opacity:0,y:-10},{opacity:1,y:0,duration:.3});gsap.to(e,{opacity:0,delay:1.4,duration:.4})}
function setMode(m,go){if(m===mode&&!go)return;mode=m;$('#sw').dataset.m=m;$$('#sw button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));P=1;warp+=7;blip(m==='play'?300:700,.25);toast('SHIFTED → '+m.toUpperCase());$('#hm').textContent=m.toUpperCase();wi=0;$('#dy').textContent=WD[m][0];$('#hs2').textContent=SUB[m];paint();
 if(go){const t=$(m==='play'?'#games':'#services');ls?ls.scrollTo(t):t.scrollIntoView({behavior:'smooth'})}}
$$('#sw button').forEach(b=>b.onclick=()=>setMode(b.dataset.m,true));
setInterval(()=>{const el=$('#dy');gsap.to(el,{y:-30,opacity:0,duration:.22,onComplete:()=>{wi++;el.textContent=WD[mode][wi%WD[mode].length];gsap.fromTo(el,{y:30,opacity:0},{y:0,opacity:1,duration:.4,ease:'back.out(2)'})}})},2600);
// particles
function parts(el){const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;for(let i=0,n=lite?12:26;i<n;i++){const p=document.createElement('i');p.className='pt';p.style.left=x+'px';p.style.top=y+'px';document.body.appendChild(p);gsap.to(p,{x:R(-140,140),y:R(-140,90),scale:0,opacity:0,duration:R(.6,1.1),ease:'expo.out',onComplete:()=>p.remove()})}}
$$('.sb').forEach(b=>b.addEventListener('click',()=>{parts(b);blip(520,.08)}));
// scroll animations
gsap.to('#hi',{...(lite?{scale:1.7,opacity:0}:{scale:5,opacity:0,filter:'blur(14px)'}),ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}});
$$('.rv').forEach(el=>gsap.from(el,lite?{y:30,opacity:0,duration:.7,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}:{y:60,opacity:0,filter:'blur(10px)',duration:1.1,ease:'expo.out',clearProps:'filter',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
const tr=$('#track');
if(!lite){const gs=$('#games'),gw=document.createElement('div');gw.id='gwrap';gs.parentNode.insertBefore(gw,gs);gw.appendChild(gs);
 const setH=()=>{gw.style.height=(tr.scrollWidth-innerWidth+innerHeight)+'px'};setH();ScrollTrigger.addEventListener('refreshInit',setH);
 gsap.to(tr,{x:()=>-(tr.scrollWidth-innerWidth),ease:'none',scrollTrigger:{trigger:gw,start:'top top',end:'bottom bottom',scrub:1,invalidateOnRefresh:true}})}
gsap.to('#pl',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.pr',start:'top 60%',end:'bottom 60%',scrub:true}});
if(fine)$$('.tl').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.transform=`rotateY(${(x-.5)*14}deg) rotateX(${(.5-y)*14}deg) translateY(-6px)`;c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%')});c.addEventListener('pointerleave',()=>c.style.transform='')});
// fractal palette
const PB=[['#00f0ff','#2f6bff'],['#00f0ff','#00ff9d'],['#7c5cff','#00f0ff'],['#00ff9d','#00f0ff'],['#2f6bff','#7c5cff'],['#00f0ff','#ff2bd6']],PP=[['#ff2bd6','#ff7a00'],['#ff7a00','#fff23d'],['#ff2bd6','#7c5cff'],['#fff23d','#ff2bd6'],['#ff7a00','#ff2bd6'],['#ff2bd6','#00f0ff']],SC=[1,.8,.6,1.4,1.1,2.1];
const hx=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255);const pal=()=>(mode==='play'?PP:PB)[K];
function paint(){document.documentElement.style.setProperty('--a',pal()[0])}
$$('section[data-k]').forEach(s=>ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',onToggle:t=>{if(t.isActive){K=+s.dataset.k;P=.6;warp+=2;paint()}}}));
// WebGL fractal
const cv=$('#gl'),root=document.documentElement;let gl=null;try{gl=cv.getContext('webgl',{antialias:false,alpha:false,depth:false,stencil:false,powerPreference:'high-performance'})}catch(e){}
let Q=lite?.5:.66,QMIN=lite?.28:.4,QMAX=lite?.6:.8,locked=false,cw=innerWidth,ch=innerHeight;
function rs(){cv.width=Math.max(2,Math.floor(cw*Q));cv.height=Math.max(2,Math.floor(ch*Q));if(gl)gl.viewport(0,0,cv.width,cv.height)}rs();
addEventListener('resize',()=>{if(innerWidth!==cw||Math.abs(innerHeight-ch)>160){cw=innerWidth;ch=innerHeight;rs()}});
function noGL(){gl=null;root.classList.add('nogl')}
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();noGL()});
const FS=`precision highp float;uniform vec2 uR,uM;uniform float uT,uZ,uS,uP;uniform vec3 uA,uB;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float gy(vec3 p){return abs(dot(sin(p),cos(p.zxy)));}
float map(vec3 p){p.xy*=rot(p.z*.06+uT*.04);float s=uS*(1.+uP*.55);float d1=gy(p*s)/s;float d2=gy(p*s*3.1+1.7)/(s*3.1);return min(d1,d2*1.8+.03)*.55;}
void main(){vec2 uv=(gl_FragCoord.xy-.5*uR)/uR.y;vec3 ro=vec3(.3*sin(uT*.2),.2*cos(uT*.17),uZ);vec3 rd=normalize(vec3(uv,1.1));
rd.xz*=rot(uM.x*.7);rd.yz*=rot(-uM.y*.5);rd.xy*=rot(uM.x*.15+sin(uT*.1)*.2);float t=0.;vec3 col=vec3(0.);
for(int i=0;i<${lite?36:64};i++){vec3 p=ro+rd*t;float d=map(p);float w=.006/(d+.02)*exp(-t*.1);vec3 c=mix(uA,uB,.5+.5*sin(p.z*.35+t*.4+uT*.3));col+=c*w;t+=max(d,.02);if(t>40.)break;}
col=1.-exp(-col*.8);col*=.92*(1.-.45*dot(uv,uv));col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233))+uT)*43758.5453)-.5)*.035;gl_FragColor=vec4(col,1.);}`;
let U={};if(!gl)noGL();if(gl){const mk=(ty,src)=>{const s=gl.createShader(ty);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));noGL()}return s};const pg=gl.createProgram();gl.attachShader(pg,mk(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));gl.attachShader(pg,mk(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pg);gl.useProgram(pg);
const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const lc=gl.getAttribLocation(pg,'p');gl.enableVertexAttribArray(lc);gl.vertexAttribPointer(lc,2,gl.FLOAT,false,0,0);['uR','uM','uT','uZ','uS','uP','uA','uB'].forEach(n=>U[n]=gl.getUniformLocation(pg,n))}
let z=0,sN=1,cA=hx('#00f0ff'),cB=hx('#2f6bff'),mm=[0,0],lastY=0,mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,nx=0,ny=0;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;nx=mx/innerWidth*2-1;ny=-(my/innerHeight*2-1)});
addEventListener('pointerdown',e=>{if(e.target.closest('button,a,input'))return;P=1;warp+=6;if(e.pointerType!=='touch')blip(160,.2)});
const cg=$('#cg'),hs=$('#hs'),hw=$('#hw');let fc=0,acc=0,fr=0,good=0,lastDraw=0;
gsap.ticker.add((time,dtms)=>{const dt=Math.min(.05,dtms/1000);if(ls)ls.raf(time*1000);fc++;
 if(fine){cx+=(mx-cx)*.12;cy+=(my-cy)*.12;cg.style.transform=`translate(${cx}px,${cy}px)`}
 if(gl&&fc>90){acc+=dtms;fr++;if(fr===40){const avg=acc/fr;acc=fr=0;
  if(avg>(lite?24:21)){good=0;locked=true;if(Q>QMIN){Q=Math.max(QMIN,Q*.8);rs()}else root.classList.add('perf')}
  else if(!locked&&avg<17.5){if(++good>=2&&Q<QMAX){Q=Math.min(QMAX,Q*1.15);rs();good=0}}else good=0}}
 const dy=Math.abs(scrollY-lastY);lastY=scrollY;warp+=(Math.min(9,dy*.12)-warp)*.06;P*=.94;z+=(.6+warp)*dt;sN+=(SC[K]-sN)*.03;mm[0]+=(nx-mm[0])*.05;mm[1]+=(ny-mm[1])*.05;
 const a=hx(pal()[0]),b=hx(pal()[1]);for(let i=0;i<3;i++){cA[i]+=(a[i]-cA[i])*.05;cB[i]+=(b[i]-cB[i])*.05}
 if(gl&&U.uR&&!(lite&&time-lastDraw<.03)){lastDraw=time;gl.uniform2f(U.uR,cv.width,cv.height);gl.uniform2f(U.uM,mm[0],mm[1]);gl.uniform1f(U.uT,time);gl.uniform1f(U.uZ,z);gl.uniform1f(U.uS,sN);gl.uniform1f(U.uP,P);gl.uniform3f(U.uA,...cA);gl.uniform3f(U.uB,...cB);gl.drawArrays(gl.TRIANGLES,0,3)}
 if(fl&&ac){const tf=200+Math.min(1,warp/9)*160;if(Math.abs(tf-lastF)>5){lastF=tf;fl.frequency.setTargetAtTime(tf,ac.currentTime,.45)}}if(fc%6===0){hs.textContent=(sN*(1+P*.55)).toFixed(2);hw.textContent=(.6+warp).toFixed(1)}});
document.addEventListener('visibilitychange',()=>{if(!ac)return;try{document.hidden?ac.suspend():ac.resume()}catch(e){}});
// countdown
const TG=new Date('2026-11-14T18:00:00').getTime();setInterval(()=>{const d=Math.max(0,TG-Date.now())/1000,p=n=>String(Math.floor(n)).padStart(2,'0');$('#cdn').textContent=Math.floor(d/86400)+'d '+p(d%86400/3600)+':'+p(d%3600/60)+':'+p(d%60)},1000);
// Studio Agent (quote assistant + receptionist)
const KB={'time|open|hour|timing':"We're open Mon–Sat, 9 AM – 9 PM. Sundays by appointment.",'price|cost|rate|fee|budget':'Every project is different, so we talk first. Message us directly on WhatsApp or Instagram and we will get back to you within 24 hours.','where|location|address|office':'Scale Shift Studio, 3rd Floor, Orbit Tower, Alkapuri, Vadodara, Gujarat 390007. Remote projects welcome.','job|hiring|career':'We hire devs, designers, artists & QA — send a portfolio to careers@scaleshift.studio','contact|mail|email|call|whatsapp':'WhatsApp +91 98765 43210, DM @scaleshiftstudio on Instagram, or email hello@scaleshift.studio.'};
const TY=[['Website',/web|site|landing|portal|shop|ecom|store/i,'React / Next.js · Node · Postgres',[3,8]],['Mobile App',/app|android|ios|mobile|booking/i,'Flutter or React Native · Firebase',[8,16]],['Game',/game|unity|unreal|play|level/i,'Unity / Unreal · custom tools',[12,40]],['AI / Automation',/ai|bot|automat|chat|gpt|workflow/i,'LLM APIs · Python · automation stack',[2,6]],['UI / UX Design',/design|ui|ux|brand|logo/i,'Figma · design system',[2,5]]];
const wait=ms=>new Promise(r=>setTimeout(r,ms));let busy=false;
async function run(q){if(busy)return;busy=true;const Rn=$('#run');Rn.innerHTML='';Rn.classList.add('o');const faq=Object.keys(KB).find(k=>new RegExp(k,'i').test(q)),hit=TY.filter(t=>t[1].test(q));
 const steps=faq?['Reading your question','Searching studio knowledge','Drafting the answer']:['Reading your idea','Matching it with our services','Estimating scope & timeline','Drafting your project brief'];
 for(const s of steps){const row=document.createElement('div');row.className='st';row.innerHTML='<i class="sn"></i><span>'+s+'…</span>';Rn.appendChild(row);gsap.from(row,{opacity:0,x:-20,duration:.4});await wait(520);const i=row.querySelector('i');i.className='ok';i.textContent='✓'}
 const c=document.createElement('div');c.className='rc';
 if(faq)c.innerHTML='<b class="m">STUDIO AGENT · ANSWER</b><p>'+KB[faq]+'</p>';
 else{const t=hit.length?hit:[['Custom Digital Product','','Discovery first — we recommend the best stack',[4,12]]],lo=Math.min(...t.map(x=>x[3][0])),hi=t.reduce((s,x)=>s+x[3][1],0)*.7|0;
  c.innerHTML='<b class="m">STUDIO AGENT · PROJECT BRIEF</b><p><b>Type:</b> '+t.map(x=>x[0]).join(' + ')+'</p><p><b>Suggested stack:</b> '+t.map(x=>x[2]).join(' | ')+'</p><p><b>Indicative timeline:</b> '+lo+'–'+Math.max(lo+2,hi)+' weeks</p><p><b>Next step:</b> free 30-min discovery call</p><a href="mailto:hello@scaleshift.studio?subject=Project%20brief&body='+encodeURIComponent('Hi! Idea: '+q+'\nType: '+t.map(x=>x[0]).join(', '))+'">Send brief by email →</a> &nbsp; <a href="https://wa.me/919876543210?text='+encodeURIComponent('Hi! Project idea: '+q)+'">or WhatsApp us →</a>'}
 Rn.appendChild(c);gsap.from(c,{opacity:0,y:24,scale:.94,duration:.6,ease:'back.out(2)'});busy=false}
$('#af').onsubmit=e=>{e.preventDefault();run($('#ai').value.trim()||'I have a project idea')};$$('.chips button').forEach(b=>b.onclick=()=>{$('#ai').value=b.textContent;run(b.textContent)});
