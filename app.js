// non-blocking Google Fonts (preloaded in <head>, applied here)
(function () {
  var p = document.querySelector('link[rel="preload"][as="style"]');
  if (p) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = p.href;
    document.head.appendChild(l);
  }
})();
if (!window.gsap) {
  var _l = document.getElementById("ld");
  if (_l) _l.style.display = "none";
  document.body.classList.add("go");
  throw new Error("animation library missing");
}
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches,
  lite = !fine || innerWidth < 800,
  reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
if (lite) document.documentElement.classList.add("lite");
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)],
  R = gsap.utils.random;
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
let ac,
  gn,
  fl,
  on = 1,
  K = 0,
  P = 0,
  warp = 0,
  mode = "build";
function mkAudio() {
  if (ac) return;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    gn = ac.createGain();
    gn.gain.value = 0.04;
    fl = ac.createBiquadFilter();
    fl.type = "lowpass";
    fl.frequency.value = 220;
    [55, 55.7, 82.4].forEach((f) => {
      const o = ac.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(fl);
      o.start();
    });
    fl.connect(gn);
    gn.connect(ac.destination);
  } catch (e) {}
}
function audio() {
  if (!ac) mkAudio();
  try {
    ac && ac.state === "suspended" && ac.resume();
  } catch (e) {}
}
function blip(f = 600, d = 0.07) {
  if (!ac || !on) return;
  const o = ac.createOscillator(),
    g = ac.createGain();
  o.frequency.value = f;
  g.gain.value = 0.05;
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d);
  o.connect(g);
  g.connect(ac.destination);
  o.start();
  o.stop(ac.currentTime + d);
}
let entered = false;
let ls = null;
if (window.Lenis && fine) {
  ls = new Lenis({ lerp: 0.085 });
  ls.on("scroll", ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const h = a.getAttribute("href"),
      t = h.length > 1 && $(h);
    if (!t) return;
    e.preventDefault();
    ls ? ls.scrollTo(t) : t.scrollIntoView({ behavior: "smooth" });
  }),
);
if (lite) {
  const h = $(".hint");
  if (h) h.textContent = "// PLAY · OUR GAMES — SWIPE →";
}
// loader
let lp = 0;
const li = setInterval(() => {
  lp += Math.random() * 18;
  if (lp >= 100) {
    lp = 100;
    clearInterval(li);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      document.body.classList.add("go");
      $("#en").style.display = "block";
      ScrollTrigger.refresh();
    });
  }
  $("#lp i").style.width = lp + "%";
}, 110);
gsap.set(".hl", { yPercent: 110 });
$("#en").onclick = () => {
  entered = true;
  try {
    sessionStorage.setItem("ss_in", "1");
  } catch (e) {}
  document.body.classList.add("go");
  audio();
  blip(440, 0.15);
  blip(880, 0.3);
  $("#ld").classList.add("x");
  gsap.to(".hl", {
    yPercent: 0,
    duration: 1.3,
    stagger: 0.12,
    ease: "expo.out",
    delay: 0.2,
  });
  warp += 8;
  P = 1;
};
// mode switch (PLAY <-> BUILD)
const WD = {
    build: ["websites", "apps", "products", "AI tools", "platforms"],
    play: ["worlds", "bosses", "levels", "legends", "games"],
  },
  SUB = {
    build:
      "A creative tech studio. We craft websites, mobile apps and AI tools for businesses — and our own games for players.",
    play: "We make games that bend your brain — and build games for brands, studios and creators who dream bigger.",
  };
let wi = 0;
function toast(t) {
  const e = $("#tt");
  e.textContent = t;
  gsap.fromTo(e, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
  gsap.to(e, { opacity: 0, delay: 1.4, duration: 0.4 });
}
function setMode(m, go) {
  if (m === mode && !go) return;
  mode = m;
  $("#sw").dataset.m = m;
  $$("#sw button").forEach((b) => b.classList.toggle("on", b.dataset.m === m));
  P = 1;
  warp += 7;
  blip(m === "play" ? 300 : 700, 0.25);
  toast("SHIFTED → " + m.toUpperCase());
  $("#hm").textContent = m.toUpperCase();
  wi = 0;
  $("#dy").textContent = WD[m][0];
  $("#hs2").textContent = SUB[m];
  paint();
  if (go) {
    const t = $(m === "play" ? "#games" : "#services");
    ls ? ls.scrollTo(t) : t.scrollIntoView({ behavior: "smooth" });
  }
}
$$("#sw button").forEach((b) => (b.onclick = () => setMode(b.dataset.m, true)));
setInterval(() => {
  const el = $("#dy");
  gsap.to(el, {
    y: -30,
    opacity: 0,
    duration: 0.22,
    onComplete: () => {
      wi++;
      el.textContent = WD[mode][wi % WD[mode].length];
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)" },
      );
    },
  });
}, 2600);
// particles
function parts(el) {
  const r = el.getBoundingClientRect(),
    x = r.left + r.width / 2,
    y = r.top + r.height / 2;
  for (let i = 0, n = lite ? 12 : 26; i < n; i++) {
    const p = document.createElement("i");
    p.className = "pt";
    p.style.left = x + "px";
    p.style.top = y + "px";
    document.body.appendChild(p);
    gsap.to(p, {
      x: R(-140, 140),
      y: R(-140, 90),
      scale: 0,
      opacity: 0,
      duration: R(0.6, 1.1),
      ease: "expo.out",
      onComplete: () => p.remove(),
    });
  }
}
$$(".sb").forEach((b) =>
  b.addEventListener("click", () => {
    parts(b);
    blip(520, 0.08);
  }),
);
// scroll animations
gsap.to("#hi", {
  ...(lite
    ? { scale: 1.7, opacity: 0 }
    : { scale: 5, opacity: 0, filter: "blur(14px)" }),
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});
$$(".rv").forEach((el) =>
  gsap.from(
    el,
    lite
      ? {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }
      : {
          y: 60,
          opacity: 0,
          filter: "blur(10px)",
          duration: 1.1,
          ease: "expo.out",
          clearProps: "filter",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
  ),
);
const tr = $("#track");
if (!lite) {
  const gs = $("#games"),
    gw = document.createElement("div");
  gw.id = "gwrap";
  gs.parentNode.insertBefore(gw, gs);
  gw.appendChild(gs);
  const setH = () => {
    gw.style.height = tr.scrollWidth - innerWidth + innerHeight + "px";
  };
  setH();
  ScrollTrigger.addEventListener("refreshInit", setH);
  gsap.to(tr, {
    x: () => -(tr.scrollWidth - innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: gw,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}
gsap.to("#pl", {
  scaleY: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".pr",
    start: "top 60%",
    end: "bottom 60%",
    scrub: true,
  },
});
if (fine)
  $$(".tl").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      c.style.transform = `rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 14}deg) translateY(-6px)`;
      c.style.setProperty("--mx", x * 100 + "%");
      c.style.setProperty("--my", y * 100 + "%");
    });
    c.addEventListener("pointerleave", () => (c.style.transform = ""));
  });
// fractal palette
const PB = [
    ["#00f0ff", "#2f6bff"],
    ["#00f0ff", "#00ff9d"],
    ["#7c5cff", "#00f0ff"],
    ["#00ff9d", "#00f0ff"],
    ["#2f6bff", "#7c5cff"],
    ["#00f0ff", "#ff2bd6"],
  ],
  PP = [
    ["#ff2bd6", "#ff7a00"],
    ["#ff7a00", "#fff23d"],
    ["#ff2bd6", "#7c5cff"],
    ["#fff23d", "#ff2bd6"],
    ["#ff7a00", "#ff2bd6"],
    ["#ff2bd6", "#00f0ff"],
  ],
  SC = [1, 0.8, 0.6, 1.4, 1.1, 2.1];
const hx = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16) / 255);
const pal = () => (mode === "play" ? PP : PB)[K];
function paint() {
  document.documentElement.style.setProperty("--a", pal()[0]);
}
$$("section[data-k]").forEach((s) =>
  ScrollTrigger.create({
    trigger: s,
    start: "top 55%",
    end: "bottom 55%",
    onToggle: (t) => {
      if (t.isActive) {
        K = +s.dataset.k;
        P = 0.6;
        warp += 2;
        paint();
      }
    },
  }),
);
// WebGL fractal
const cv = $("#gl"),
  root = document.documentElement;
let gl = null;
try {
  gl = cv.getContext("webgl", {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  });
} catch (e) {}
let Q = lite ? 0.5 : 0.66,
  QMIN = lite ? 0.28 : 0.4,
  QMAX = lite ? 0.6 : 0.8,
  locked = false,
  cw = innerWidth,
  ch = innerHeight;
function rs() {
  cv.width = Math.max(2, Math.floor(cw * Q));
  cv.height = Math.max(2, Math.floor(ch * Q));
  if (gl) gl.viewport(0, 0, cv.width, cv.height);
}
rs();
addEventListener("resize", () => {
  if (innerWidth !== cw || Math.abs(innerHeight - ch) > 160) {
    cw = innerWidth;
    ch = innerHeight;
    rs();
  }
});
function noGL() {
  gl = null;
  root.classList.add("nogl");
}
cv.addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  noGL();
});
const FS = `precision highp float;uniform vec2 uR,uM;uniform float uT,uZ,uS,uP;uniform vec3 uA,uB;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float gy(vec3 p){return abs(dot(sin(p),cos(p.zxy)));}
float map(vec3 p){p.xy*=rot(p.z*.06+uT*.04);float s=uS*(1.+uP*.55);float d1=gy(p*s)/s;float d2=gy(p*s*3.1+1.7)/(s*3.1);return min(d1,d2*1.8+.03)*.55;}
void main(){vec2 uv=(gl_FragCoord.xy-.5*uR)/uR.y;vec3 ro=vec3(.3*sin(uT*.2),.2*cos(uT*.17),uZ);vec3 rd=normalize(vec3(uv,1.1));
rd.xz*=rot(uM.x*.7);rd.yz*=rot(-uM.y*.5);rd.xy*=rot(uM.x*.15+sin(uT*.1)*.2);float t=0.;vec3 col=vec3(0.);
for(int i=0;i<${lite ? 36 : 64};i++){vec3 p=ro+rd*t;float d=map(p);float w=.006/(d+.02)*exp(-t*.1);vec3 c=mix(uA,uB,.5+.5*sin(p.z*.35+t*.4+uT*.3));col+=c*w;t+=max(d,.02);if(t>40.)break;}
col=1.-exp(-col*.8);col*=.92*(1.-.45*dot(uv,uv));col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233))+uT)*43758.5453)-.5)*.035;gl_FragColor=vec4(col,1.);}`;
let U = {};
if (!gl) noGL();
if (gl) {
  const mk = (ty, src) => {
    const s = gl.createShader(ty);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      noGL();
    }
    return s;
  };
  const pg = gl.createProgram();
  gl.attachShader(
    pg,
    mk(
      gl.VERTEX_SHADER,
      "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}",
    ),
  );
  gl.attachShader(pg, mk(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pg);
  gl.useProgram(pg);
  const bf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const lc = gl.getAttribLocation(pg, "p");
  gl.enableVertexAttribArray(lc);
  gl.vertexAttribPointer(lc, 2, gl.FLOAT, false, 0, 0);
  ["uR", "uM", "uT", "uZ", "uS", "uP", "uA", "uB"].forEach(
    (n) => (U[n] = gl.getUniformLocation(pg, n)),
  );
}
let z = 0,
  sN = 1,
  cA = hx("#00f0ff"),
  cB = hx("#2f6bff"),
  mm = [0, 0],
  lastY = 0,
  mx = innerWidth / 2,
  my = innerHeight / 2,
  cx = mx,
  cy = my,
  nx = 0,
  ny = 0;
addEventListener("pointermove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  nx = (mx / innerWidth) * 2 - 1;
  ny = -((my / innerHeight) * 2 - 1);
});
addEventListener("pointerdown", (e) => {
  if (e.target.closest("button,a,input")) return;
  P = 1;
  warp += 6;
  blip(160, 0.2);
});
const cg = $("#cg"),
  hs = $("#hs"),
  hw = $("#hw");
let ef = 0,
  fc = 0,
  acc = 0,
  fr = 0,
  good = 0,
  lastDraw = 0;
gsap.ticker.add((time, dtms) => {
  const dt = Math.min(0.05, dtms / 1000);
  if (ls) ls.raf(time * 1000);
  fc++;
  if (fine) {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cg.style.transform = `translate(${cx}px,${cy}px)`;
  }
  if (entered) ef++;
  if (gl && entered && ef > 90) {
    acc += dtms;
    fr++;
    if (fr === 40) {
      const avg = acc / fr;
      acc = fr = 0;
      if (avg > (lite ? 24 : 21)) {
        good = 0;
        locked = true;
        if (Q > QMIN) {
          Q = Math.max(QMIN, Q * 0.8);
          rs();
        } else root.classList.add("perf");
      } else if (!locked && avg < 17.5) {
        if (++good >= 2 && Q < QMAX) {
          Q = Math.min(QMAX, Q * 1.15);
          rs();
          good = 0;
        }
      } else good = 0;
    }
  }
  const dy = Math.abs(scrollY - lastY);
  lastY = scrollY;
  warp += (Math.min(9, dy * 0.12) - warp) * 0.06;
  P *= 0.94;
  z += (0.6 + warp) * dt;
  sN += (SC[K] - sN) * 0.03;
  mm[0] += (nx - mm[0]) * 0.05;
  mm[1] += (ny - mm[1]) * 0.05;
  const a = hx(pal()[0]),
    b = hx(pal()[1]);
  for (let i = 0; i < 3; i++) {
    cA[i] += (a[i] - cA[i]) * 0.05;
    cB[i] += (b[i] - cB[i]) * 0.05;
  }
  if (gl && entered && U.uR && !(lite && time - lastDraw < 0.03)) {
    lastDraw = time;
    gl.uniform2f(U.uR, cv.width, cv.height);
    gl.uniform2f(U.uM, mm[0], mm[1]);
    gl.uniform1f(U.uT, time);
    gl.uniform1f(U.uZ, z);
    gl.uniform1f(U.uS, sN);
    gl.uniform1f(U.uP, P);
    gl.uniform3f(U.uA, ...cA);
    gl.uniform3f(U.uB, ...cB);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  if (fl) fl.frequency.setTargetAtTime(180 + warp * 260, ac.currentTime, 0.1);
  if (fc % 6 === 0) {
    hs.textContent = (sN * (1 + P * 0.55)).toFixed(2);
    hw.textContent = (0.6 + warp).toFixed(1);
  }
});
document.addEventListener("visibilitychange", () => {
  if (!ac) return;
  try {
    document.hidden ? ac.suspend() : ac.resume();
  } catch (e) {}
});
// Studio Agent (quote assistant + receptionist)
const KB = {
  "\\b(timings?|hours|office hours)\\b":
    "Message us on Instagram or email hello@scaleshift.studio. We usually reply within a day.",
  "\\b(price|prices|pricing|cost|rates?|fees?|budget|charges?)\\b":
    "Every project is different, so we talk first. Message us directly on WhatsApp or Instagram and we will get back to you within 24 hours.",
  "\\b(where|location|address|office)\\b":
    "We are based in Vadodara, Gujarat, and work with clients remotely worldwide.",
  "\\b(jobs?|hiring|careers?|interns?|internships?)\\b":
    "We take interns and hire developers, designers, artists and QA. Email careers@scaleshift.studio with your portfolio or GitHub.",
  "\\b(contact|email|whatsapp|instagram|phone)\\b":
    "WhatsApp +91 9313070349, DM @scaleshift.studio on Instagram, or email hello@scaleshift.studio.",
  "\\b(your games|rocket|coconut|release|play store)\\b":
    "Rocket Booster (3D, Android) is launching soon on Google Play, and Coconut: Quest Island Empire is in development. See the Games section!",
};
const TY = {
  web: { n: "Website", w: 3, stack: "HTML/CSS/JS or React / Next.js",
    re: /\b(web|website|websites|site|landing|portal|shop|ecommerce|e-commerce|online store|dashboard|saas|blog|portfolio|dukan)\b/i,
    ft: [["Online payments", 1], ["Booking / forms", 0.5], ["Admin panel", 1.5], ["Blog / CMS", 0.5], ["Multi-language", 1], ["Rich animations", 0.5]] },
  app: { n: "Mobile App", w: 8, stack: "Flutter (Android + iOS)",
    re: /\b(apps?|android|ios|iphone|mobile|play store|app store)\b/i,
    ft: [["Login & profiles", 1], ["Payments", 1.5], ["Push notifications", 0.5], ["Maps / location", 1], ["Admin panel", 2], ["Offline mode", 1.5]] },
  game: { n: "Game", w: 12, stack: "Unity",
    re: /\b(games?|gaming|unity|2d|3d)\b/i,
    ft: [["Multiplayer", 4], ["3D graphics", 3], ["Leaderboards", 1], ["In-app purchases", 1.5], ["Ads", 0.5], ["Level editor", 3]] },
  ai: { n: "AI / Automation", w: 3, stack: "LLM APIs + automation tools",
    re: /\b(ai|bot|bots|chatbot|automation|automate|gpt|llm|workflow)\b/i,
    ft: [["WhatsApp / web chatbot", 1.5], ["Document Q&A", 2], ["Workflow automation", 1.5], ["Dashboards", 1]] },
  ux: { n: "UI / UX Design", w: 2, stack: "Figma",
    re: /\b(design|ui|ux|branding|logo|figma)\b/i,
    ft: [["Brand identity", 1], ["Design system", 1], ["Clickable prototype", 0.5], ["Landing page design", 0.5]] },
};
const SPD = [["Lean MVP", 0.6], ["Standard", 1], ["Full product", 1.4]];
const PH = [["Plan", 0.1], ["Design", 0.2], ["Build", 0.55], ["Ship", 0.15]];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let busy = false;
function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
}
function copyText(t) {
  if (navigator.clipboard && window.isSecureContext)
    return navigator.clipboard.writeText(t).catch(() => fallbackCopy(t));
  return Promise.resolve(fallbackCopy(t));
}
function fallbackCopy(t) {
  const x = el("textarea");
  x.value = t;
  x.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(x);
  x.select();
  try { document.execCommand("copy"); } catch (e) {}
  x.remove();
}
function plan(S) {
  const ws = S.t.map((k) => TY[k].w).sort((a, b) => b - a);
  let base = ws.length ? ws[0] + 0.5 * ws.slice(1).reduce((a, x) => a + x, 0) : 4;
  S.f.forEach((id) => { const p = id.split(":"); base += TY[p[0]].ft[p[1]][1]; });
  const w = Math.max(2, Math.round(base * SPD[S.s][1])),
    lo = Math.max(1, Math.round(w * 0.85));
  return { w, lo, hi: Math.max(lo + 1, Math.round(w * 1.2)) };
}
function briefText(S, p) {
  const feats = S.f.map((id) => { const q = id.split(":"); return TY[q[0]].ft[q[1]][0]; });
  return [
    "Hi Scale Shift Studio! 👋",
    "",
    (S.name ? "From: " + S.name : "From: (name not shared)"),
    "Project idea: " + S.q,
    "Type: " + (S.t.length ? S.t.map((k) => TY[k].n).join(" + ") : "Custom digital product"),
    "Key features: " + (feats.length ? feats.join(", ") : "to be discussed"),
    "Scope: " + SPD[S.s][0],
    "Suggested stack: " + (S.t.length ? S.t.map((k) => TY[k].stack).join(" | ") : "chosen after discovery"),
    "Indicative timeline: " + p.lo + "–" + p.hi + " weeks",
    "",
    "Could we set up a free discovery call?",
  ].join("\n");
}
function buildLab(q, S) {
  const C = el("div", "ib-card"),
    head = el("div", "ib-h", "STUDIO AGENT · PROJECT BLUEPRINT");
  C.appendChild(head);
  const tyRow = el("div", "ib-row");
  if (S.t.length) S.t.forEach((k) => tyRow.appendChild(el("span", "ib-t", TY[k].n)));
  else tyRow.appendChild(el("span", "ib-t", "Custom digital product"));
  C.appendChild(tyRow);
  const st = el("p", "ib-p");
  st.innerHTML = "<b>Suggested stack:</b> ";
  st.appendChild(document.createTextNode((S.t.length ? S.t.map((k) => TY[k].stack).join(" | ") : "chosen after discovery") + " (final choice fits your project)"));
  C.appendChild(st);
  const fts = S.t.filter((k) => TY[k].ft.length);
  if (fts.length) {
    C.appendChild(el("div", "ib-h ib-s", "TAP THE FEATURES YOU NEED"));
    const fr = el("div", "ib-row");
    fts.forEach((k) => TY[k].ft.forEach((f, i) => {
      const b = el("button", "ib-b", f[0]);
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.onclick = () => {
        const id = k + ":" + i, at = S.f.indexOf(id);
        at < 0 ? S.f.push(id) : S.f.splice(at, 1);
        b.classList.toggle("on", at < 0);
        b.setAttribute("aria-pressed", at < 0 ? "true" : "false");
        draw();
      };
      fr.appendChild(b);
    }));
    C.appendChild(fr);
  }
  C.appendChild(el("div", "ib-h ib-s", "HOW BIG DO YOU WANT TO START?"));
  const sg = el("div", "ib-seg");
  SPD.forEach((x, i) => {
    const b = el("button", i === S.s ? "on" : "", x[0]);
    b.type = "button";
    b.onclick = () => { S.s = i; sg.querySelectorAll("button").forEach((y, j) => y.classList.toggle("on", j === i)); draw(); };
    sg.appendChild(b);
  });
  C.appendChild(sg);
  const tlh = el("div", "ib-h ib-s"),
    bar = el("div", "ib-bar");
  const segs = PH.map((x) => {
    const d = el("div"), l = el("small", "", x[0]), n = el("b", "");
    d.append(l, n);
    bar.appendChild(d);
    return [d, n, x[1]];
  });
  C.append(tlh, bar);
  const nm = el("input", "ib-in");
  nm.placeholder = "Your name (optional)";
  nm.setAttribute("aria-label", "Your name");
  nm.autocomplete = "name";
  nm.maxLength = 40;
  nm.oninput = () => { S.name = nm.value.trim(); draw(); };
  C.appendChild(el("div", "ib-h ib-s", "ADD YOUR NAME, THEN SEND"));
  C.appendChild(nm);
  C.appendChild(el("div", "ib-h ib-s", "YOUR BRIEF (READY TO SEND)"));
  const br = el("div", "ib-br");
  C.appendChild(br);
  const ac = el("div", "ib-ac"),
    wa = el("a", "sb f", "Send on WhatsApp ↗"),
    cp = el("button", "sb", "Copy brief"),
    ig = el("a", "sb", "Copy + Instagram DM"),
    em = el("a", "sb", "Email");
  cp.type = "button";
  wa.target = ig.target = "_blank";
  wa.rel = ig.rel = "noopener";
  ig.href = "https://ig.me/m/scaleshift.studio";
  ac.append(wa, cp, ig, em);
  C.appendChild(ac);
  C.appendChild(el("p", "ib-n", "Pricing is shared after a short discovery call, because every project is different."));
  let txt = "";
  function draw() {
    const p = plan(S);
    txt = briefText(S, p);
    tlh.textContent = "INDICATIVE TIMELINE · " + p.lo + "–" + p.hi + " WEEKS";
    segs.forEach((x) => {
      x[0].style.setProperty("--g", x[2]);
      x[1].textContent = Math.max(1, Math.round(p.w * x[2])) + "w";
    });
    br.textContent = txt;
    wa.href = "https://wa.me/919313070349?text=" + encodeURIComponent(txt);
    em.href = "mailto:hello@scaleshift.studio?subject=" + encodeURIComponent("Project brief: " + S.q.slice(0, 50)) + "&body=" + encodeURIComponent(txt);
  }
  const flash = (b, m, o) => { b.textContent = m; setTimeout(() => (b.textContent = o), 1800); };
  cp.onclick = () => copyText(txt).then(() => flash(cp, "Copied ✓", "Copy brief"));
  ig.addEventListener("click", () => { copyText(txt); flash(ig, "Copied · paste in DM ✓", "Copy + Instagram DM"); });
  draw();
  return C;
}
const GREET = new Set("hi hii hiii hello helo hey heyy hola yo sup namaste namaskar good morning evening afternoon there bro sir mam".split(" "));
const STOP = new Set("i a an the me my for to and of is it in on at we you your our please need want like looking build make create develop get have help can could would hi hello hey hii hola yo namaste with some something thing want wanna should".split(" "));
const TYPEW = /^(web|website|websites|site|app|apps|android|ios|iphone|mobile|game|games|gaming|bot|chatbot|ai|design|ui|ux|logo|online|store|shop)$/;
const INTENT = /\b(need|want|wanna|build|make|create|develop|looking|start|launch|startup|business|idea|chahiye|banana|banwana|banwani|banao|banwa)\b/i;
let PEND = "",
  RID = 0;
function toks(q) { return q.toLowerCase().match(/[a-z\u0900-\u097f']+/g) || []; }
function kindOf(q) {
  const t = toks(q), low = q.toLowerCase();
  if (!t.length || /(.)\1{3,}/.test(low) || /[bcdfghjklmnpqrstvwxyz]{6,}/.test(low) || t.every((x) => !/[aeiou\u0900-\u097f]/.test(x))) return "gib";
  if (/\b(thanks|thank you|thx|shukriya|dhanyavad|dhanyawad)\b/.test(low) && t.length <= 5) return "thanks";
  const types = Object.keys(TY).filter((k) => TY[k].re.test(q));
  if (t.every((x) => GREET.has(x))) return "greet";
  if (!types.length && /\b(who are you|what can you do|what do you do|how does this work|how do you work|help me|help)\b/.test(low) && t.length <= 6) return "intro";
  const fk = Object.keys(KB).find((k) => new RegExp(k, "i").test(q)),
    isQ = /\?\s*$|^(what|when|where|how|do you|can you|are you|kya|kab|kahan|kitna|kitne)\b/i.test(q);
  if (fk && (!types.length || isQ)) return "faq";
  if (types.length) return "types";
  if (INTENT.test(q) && t.filter((x) => x.length > 2 && !STOP.has(x)).length >= 2) return "intent";
  return "other";
}
function say(Rn, text, qrs) {
  const my = RID;
  return new Promise((res) => {
    const d = el("div", "ib-dots");
    d.innerHTML = "<span></span><span></span><span></span>";
    Rn.appendChild(d);
    setTimeout(() => {
      d.remove();
      if (my !== RID) return res();
      const m = el("div", "ib-msg"),
        h = el("div", "ib-h", "STUDIO AGENT");
      m.append(h, el("p", "ib-p", text));
      if (qrs && qrs.length) {
        const r = el("div", "ib-row");
        qrs.forEach((x) => {
          const b = el("button", "ib-b", x[0]);
          b.type = "button";
          b.onclick = x[1];
          r.appendChild(b);
        });
        m.appendChild(r);
      }
      Rn.appendChild(m);
      gsap.from(m, { opacity: 0, y: 16, duration: 0.4 });
      res();
    }, 650);
  });
}
const EX = ["An app for my gym with bookings", "A website for my restaurant", "A 2D mobile game for my brand", "A WhatsApp bot for my customers"];
async function run(q, o) {
  o = o || {};
  const rid = ++RID;
  const Rn = $("#run");
  Rn.innerHTML = "";
  Rn.classList.add("o");
  let kind = kindOf(q);
  if (PEND && (kind === "types" || kind === "intent" || kind === "other")) {
    q = PEND + " — " + q;
    kind = kindOf(q);
  }
  PEND = "";
  const exQ = EX.map((x) => [x, () => run(x)]);
  let types = o.types || Object.keys(TY).filter((k) => TY[k].re.test(q));
  if (o.chip && types.length) kind = "types";
  if (kind === "gib") {
    await say(Rn, "Hmm, I couldn't make sense of that. Tell me in a sentence what you'd like to build, for example:", exQ);
  } else if (kind === "thanks") {
    await say(Rn, "You're welcome! Whenever you're ready, describe your idea and I'll draft a brief for you.", []);
  } else if (kind === "greet" || kind === "intro") {
    await say(Rn, "Hey, I'm the Studio Agent at Scale Shift. Describe what you want to build in a sentence and I'll draft a project brief with stack and timeline. You can also ask about location, jobs or how to reach us. For example:", exQ);
  } else if (kind === "faq") {
    const fk = Object.keys(KB).find((k) => new RegExp(k, "i").test(q));
    await say(Rn, KB[fk], [["I have a project idea", () => aiIn.focus()]]);
  } else if (kind === "intent") {
    await say(Rn, "That sounds interesting. What type of product is it?", [
      ["Website", () => run(q, { types: ["web"], chip: 1 })], ["Mobile app", () => run(q, { types: ["app"], chip: 1 })],
      ["Game", () => run(q, { types: ["game"], chip: 1 })], ["AI / automation", () => run(q, { types: ["ai"], chip: 1 })],
      ["UI / UX design", () => run(q, { types: ["ux"], chip: 1 })], ["Not sure yet", () => run(q, { types: [], chip: 1 })],
    ]);
  } else if (kind === "other") {
    await say(Rn, "I'm built to help with project ideas and questions about the studio, so I may have missed that one. Try describing what you'd like to build, or ask about timings, location or jobs.", exQ);
  } else {
    const detail = toks(q).filter((x) => x.length > 2 && !STOP.has(x) && !TYPEW.test(x));
    if (!o.chip && !detail.length) {
      PEND = q;
      await say(Rn, "Nice choice. Tell me a bit more: what will it do and who is it for? Even one line helps.", exQ);
    } else {
      for (const s of ["Reading your idea", "Matching it with our services", "Sizing the scope", "Building your blueprint"]) {
        const row = el("div", "st");
        row.innerHTML = '<i class="sn"></i><span>' + s + "…</span>";
        Rn.appendChild(row);
        gsap.from(row, { opacity: 0, x: -20, duration: 0.35 });
        await wait(380);
        if (rid !== RID) return;
        const i = row.querySelector("i");
        i.className = "ok";
        i.textContent = "✓";
      }
      if (rid !== RID) return;
      const out = buildLab(q, { q, t: types, f: [], s: 1, name: "" });
      Rn.appendChild(out);
      gsap.from(out, { opacity: 0, y: 24, scale: 0.96, duration: 0.55, ease: "back.out(1.6)" });
      setTimeout(() => (ls ? ls.scrollTo(out, { offset: -110 }) : out.scrollIntoView({ behavior: "smooth", block: "center" })), 250);
    }
  }
}
const aiIn = $("#ai");
$("#af").onsubmit = (e) => {
  e.preventDefault();
  const v = aiIn.value.trim();
  if (!v) {
    aiIn.focus();
    gsap.fromTo(aiIn, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1,0.3)" });
    return;
  }
  run(v);
};
$$(".chips button").forEach(
  (b) =>
    (b.onclick = () => {
      aiIn.value = b.textContent;
      run(b.textContent, { chip: 1 });
    }),
);
(function () {
  const ex = ["I need an app for my gym with bookings", "A website for my restaurant with online orders", "A 2D mobile game for my brand", "A WhatsApp bot that answers my customers"];
  let n = 0;
  setInterval(() => {
    if (document.activeElement !== aiIn && !aiIn.value && !document.hidden) aiIn.placeholder = "e.g. " + ex[++n % ex.length];
  }, 3200);
})();
const sndBtn = $("#snd");
if (sndBtn) sndBtn.onclick = () => {
  audio();
  const s = !on;
  on = s ? 1 : 0;
  if (gn) gn.gain.value = s ? 0.04 : 0;
  sndBtn.textContent = s ? "SOUND ON" : "SOUND OFF";
};
// coming back from a sub-page: skip the intro and land on the right section
(function () {
  var nv = (performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || {},
    seen = false,
    sub = false,
    t = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
  try {
    seen = sessionStorage.getItem("ss_in") === "1";
  } catch (e) {}
  var ref = document.referrer || "";
  if (seen && (nv.type === "back_forward" || (ref.indexOf(location.origin) === 0 && ref.replace(location.origin, "").length > 1))) sub = true;
  if (!t && !sub) return;
  clearInterval(li);
  entered = true;
  document.body.classList.add("go");
  $("#ld").style.display = "none";
  gsap.set(".hl", { yPercent: 0 });
  setTimeout(function () {
    ScrollTrigger.refresh();
    if (t) ls ? ls.scrollTo(t, { immediate: true }) : t.scrollIntoView();
  }, 400);
})();
