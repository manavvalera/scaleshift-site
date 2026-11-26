(function () {
  var cv = document.getElementById("sim");
  if (!cv || !cv.getContext) return;
  var cx = cv.getContext("2d"), W = 300, H = 400, dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr; cv.height = H * dpr; cx.scale(dpr, dpr);
  var GY = H - 34, LP = { x: 26, w: 76 }, TP = { x: 196, w: 78 };
  var keys = { l: 0, r: 0, t: 0 }, R, parts, coins, fuel, state, msg, shake = 0, over = 0, best = 0, stars = [];
  for (var i = 0; i < 46; i++) stars.push([Math.random() * W, Math.random() * (GY - 20), Math.random() * 1.4 + 0.3, Math.random() * 6]);
  function reset() {
    R = { x: LP.x + LP.w / 2, y: GY - 15, vx: 0, vy: 0, a: 0 };
    fuel = 100; parts = []; state = "idle"; msg = "HOLD THRUST|TO LAUNCH";
    coins = [[150, 270], [92, 178], [226, 140]].map(function (c) { return { x: c[0], y: c[1], got: 0 }; });
  }
  function boom(n, c) {
    for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, s = 40 + Math.random() * 150; parts.push({ x: R.x, y: R.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, l: 0, m: 0.6 + Math.random() * 0.7, c: c[i % c.length], r: 1.5 + Math.random() * 2.5 }); }
  }
  function crash() {
    state = "crash"; over = performance.now(); shake = 9; boom(46, ["#ff7a00", "#ffd23f", "#ff3b5c", "#fff"]);
    msg = "CRASH!|TAP THRUST TO RETRY";
    if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) {}
  }
  function got() { var n = 0; coins.forEach(function (c) { n += c.got; }); return n; }
  function step(dt) {
    if (state === "idle" && keys.t) { state = "fly"; msg = ""; }
    var th = keys.t && fuel > 0 && state === "fly";
    if ((state === "crash" || state === "land") && keys.t && performance.now() - over > 700) reset();
    if (state === "fly") {
      var turn = (keys.r - keys.l) * 2.7;
      R.a += turn * dt;
      if (!keys.l && !keys.r) R.a *= Math.max(0, 1 - 1.1 * dt);
      R.a = Math.max(-1.1, Math.min(1.1, R.a));
      var ax = 0, ay = 82;
      if (th) {
        ax += Math.sin(R.a) * 225; ay -= Math.cos(R.a) * 225; fuel = Math.max(0, fuel - 12 * dt);
        for (var k = 0; k < 2; k++) parts.push({ x: R.x - Math.sin(R.a) * 15, y: R.y + Math.cos(R.a) * 15, vx: -Math.sin(R.a) * (90 + Math.random() * 60) + (Math.random() - 0.5) * 36 + R.vx * 0.3, vy: Math.cos(R.a) * (90 + Math.random() * 60) + R.vy * 0.3, l: 0, m: 0.35 + Math.random() * 0.25, c: Math.random() < 0.5 ? "#ff7a00" : "#ffd23f", r: 2 + Math.random() * 2 });
      }
      R.vx += ax * dt; R.vy += ay * dt; R.vx *= 1 - 0.18 * dt;
      R.x += R.vx * dt; R.y += R.vy * dt;
      if (R.x < 12) { R.x = 12; R.vx = Math.abs(R.vx) * 0.4; }
      if (R.x > W - 12) { R.x = W - 12; R.vx = -Math.abs(R.vx) * 0.4; }
      if (R.y < 16) { R.y = 16; R.vy = Math.max(0, R.vy); }
      coins.forEach(function (c) {
        if (!c.got && Math.abs(c.x - R.x) < 18 && Math.abs(c.y - R.y) < 20) { c.got = 1; boom(0, []); for (var j = 0; j < 12; j++) parts.push({ x: c.x, y: c.y, vx: (Math.random() - 0.5) * 120, vy: (Math.random() - 0.5) * 120, l: 0, m: 0.5, c: "#ffd23f", r: 2 }); }
      });
      if (R.y + 15 >= GY && R.vy >= 0) {
        var onT = R.x > TP.x && R.x < TP.x + TP.w, onL = R.x > LP.x && R.x < LP.x + LP.w,
          soft = R.vy < 95 && Math.abs(R.a) < 0.6 && Math.abs(R.vx) < 80;
        if (soft && (onT || onL)) {
          R.y = GY - 15; R.vx = R.vy = 0; R.a = 0;
          if (onT) {
            state = "land"; over = performance.now(); var n = got(); best = Math.max(best, n);
            msg = n === 3 ? "PERFECT LANDING!|3/3 COINS · TAP TO PLAY AGAIN" : "LANDED! " + n + "/3 COINS|TAP THRUST TO GO AGAIN";
            boom(0, []); for (var q = 0; q < 40; q++) parts.push({ x: R.x, y: R.y - 20, vx: (Math.random() - 0.5) * 220, vy: -Math.random() * 200, l: 0, m: 1, c: ["#00f0ff", "#ffd23f", "#ff2bd6", "#fff"][q % 4], r: 2 });
          } else { state = "idle"; msg = "BACK ON THE PAD|HOLD THRUST TO GO"; }
        } else crash();
      }
    }
    parts = parts.filter(function (p) { p.l += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 60 * dt; return p.l < p.m; });
    shake *= Math.max(0, 1 - 6 * dt);
  }
  function draw(t) {
    cx.save();
    if (shake > 0.3) cx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    var g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#050716"); g.addColorStop(1, "#1a0f3a");
    cx.fillStyle = g; cx.fillRect(-10, -10, W + 20, H + 20);
    stars.forEach(function (s) { cx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.4 + s[3])); cx.fillStyle = "#fff"; cx.fillRect(s[0], s[1], s[2], s[2]); });
    cx.globalAlpha = 1;
    cx.fillStyle = "#0d1230"; cx.fillRect(-10, GY, W + 20, H - GY + 10);
    cx.fillStyle = "#ff7a00"; cx.fillRect(LP.x, GY - 4, LP.w, 4);
    cx.fillStyle = "#00f0ff"; cx.shadowColor = "#00f0ff"; cx.shadowBlur = 14; cx.fillRect(TP.x, GY - 4, TP.w, 4); cx.shadowBlur = 0;
    cx.font = "700 9px 'Space Mono',monospace"; cx.textAlign = "center"; cx.fillStyle = "#c3cde6";
    cx.fillText("LAUNCH", LP.x + LP.w / 2, GY + 16); cx.fillStyle = "#00f0ff"; cx.fillText("LAND HERE", TP.x + TP.w / 2, GY + 16);
    coins.forEach(function (c) { if (c.got) return; var p = 1 + 0.12 * Math.sin(t * 5 + c.x); cx.beginPath(); cx.arc(c.x, c.y, 8 * p, 0, 6.28); cx.fillStyle = "#ffd23f"; cx.shadowColor = "#ffd23f"; cx.shadowBlur = 12; cx.fill(); cx.shadowBlur = 0; cx.fillStyle = "#b8860b"; cx.fillRect(c.x - 1.5, c.y - 4, 3, 8); });
    parts.forEach(function (p) { cx.globalAlpha = Math.max(0, 1 - p.l / p.m); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r * (1 - 0.5 * p.l / p.m), 0, 6.28); cx.fill(); });
    cx.globalAlpha = 1;
    if (state !== "crash") {
      cx.save(); cx.translate(R.x, R.y); cx.rotate(R.a);
      var fl = (keys.t && fuel > 0 && state === "fly") ? 1 : (state === "idle" ? 0.15 : 0);
      if (fl) { cx.beginPath(); cx.moveTo(-4.5, 11); cx.lineTo(4.5, 11); cx.lineTo(0, 11 + (10 + Math.random() * 10) * fl * 1.4); cx.fillStyle = "#ffb000"; cx.fill(); }
      cx.fillStyle = "#ff3b5c"; cx.beginPath(); cx.moveTo(-8, 1); cx.lineTo(-15, 13); cx.lineTo(-8, 11); cx.fill(); cx.beginPath(); cx.moveTo(8, 1); cx.lineTo(15, 13); cx.lineTo(8, 11); cx.fill();
      cx.fillStyle = "#f2f6ff"; cx.beginPath(); cx.moveTo(0, -17); cx.quadraticCurveTo(10, -7, 8.5, 11); cx.lineTo(-8.5, 11); cx.quadraticCurveTo(-10, -7, 0, -17); cx.fill();
      cx.fillStyle = "#ff3b5c"; cx.beginPath(); cx.moveTo(0, -17); cx.lineTo(5.6, -9); cx.lineTo(-5.6, -9); cx.fill();
      cx.beginPath(); cx.arc(0, -1, 3.4, 0, 6.28); cx.fillStyle = "#3aa0ff"; cx.fill();
      cx.restore();
    }
    cx.textAlign = "left"; cx.font = "700 9px 'Space Mono',monospace"; cx.fillStyle = "#c3cde6"; cx.fillText("FUEL", 10, 17);
    cx.strokeStyle = "rgba(255,255,255,.4)"; cx.strokeRect(38.5, 9.5, 80, 8);
    cx.fillStyle = fuel < 25 ? "#ff3b5c" : "#00f0ff"; cx.fillRect(40, 11, 77 * fuel / 100, 5);
    cx.textAlign = "right"; cx.fillStyle = "#ffd23f"; cx.fillText("★ " + got() + "/3", W - 10, 17);
    if (msg) {
      var ls = msg.split("|"); cx.textAlign = "center"; cx.shadowColor = "#000"; cx.shadowBlur = 6;
      cx.font = "900 17px Unbounded,system-ui,sans-serif"; cx.fillStyle = state === "crash" ? "#ff3b5c" : "#fff"; cx.fillText(ls[0], W / 2, H * 0.3);
      if (ls[1]) { cx.font = "700 10px 'Space Mono',monospace"; cx.fillStyle = "#00f0ff"; cx.fillText(ls[1], W / 2, H * 0.3 + 20); }
      cx.shadowBlur = 0;
    }
    cx.restore();
  }
  var vis = true, raf = 0, last = 0;
  function frame(ts) {
    raf = 0; if (!vis || document.hidden) return;
    var dt = Math.min(0.033, (ts - last) / 1000 || 0); last = ts; step(dt); draw(ts / 1000); raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && vis && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; kick(); }, { threshold: 0.2 }).observe(cv);
  document.addEventListener("visibilitychange", kick);
  var btns = {};
  document.querySelectorAll(".ctrl button").forEach(function (b) {
    var k = b.dataset.k; btns[k] = b;
    b.addEventListener("pointerdown", function (e) { e.preventDefault(); keys[k] = 1; b.classList.add("on"); try { b.setPointerCapture(e.pointerId); } catch (x) {} });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { b.addEventListener(ev, function () { keys[k] = 0; b.classList.remove("on"); }); });
    b.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  });
  var KM = { ArrowLeft: "l", KeyA: "l", ArrowRight: "r", KeyD: "r", ArrowUp: "t", KeyW: "t", Space: "t" };
  function key(e, v) {
    var k = KM[e.code]; if (!k || !vis || /input|textarea|select/i.test((e.target.tagName || ""))) return;
    e.preventDefault(); keys[k] = v; if (btns[k]) btns[k].classList.toggle("on", !!v);
  }
  window.addEventListener("keydown", function (e) { key(e, 1); });
  window.addEventListener("keyup", function (e) { key(e, 0); });
  reset(); kick();
})();
