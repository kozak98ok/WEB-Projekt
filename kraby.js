(function () {
    'use strict';

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;

    function layer(id) {
        var el = document.getElementById(id);
        return el ? { el: el, ctx: el.getContext('2d') } : null;
    }

    var bg = layer('fx-crabs');
    var walk = layer('fx-walkers');
    var bombs = layer('fx-bombs');
    var scene = layer('fx-scene');
    var layers = [scene, bg, walk, bombs].filter(Boolean);

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    var OUTLINE = '#0b1a20';
    var COLORS_BG = ['#e4572e', '#ff7a45', '#f2a65a', '#d6452a'];
    var COLORS_ULTRA = ['#e4572e', '#ff7a45', '#ffb703', '#c9441f'];
    var COLORS_BOOM = ['#e4572e', '#ffb703', '#ffffff', '#4fd1c5'];

    /* ---------- krab ---------- */

    function Crab(o) {
        this.size = o.size;
        this.x = o.x;
        this.y = o.y;
        this.vx = o.vx;
        this.color = o.color;
        this.alpha = o.alpha;
        this.wander = !!o.wander;
        this.phase = Math.random() * 6.28;
        this.pause = 0;
    }

    Crab.prototype.update = function (dt) {
        if (this.pause > 0) { this.pause -= dt; return; }
        this.x += this.vx * dt;
        this.phase += dt * Math.min(18, 4 + Math.abs(this.vx) * 0.04);
        if (this.wander) {
            if (Math.random() < dt * 0.3) this.pause = rand(0.6, 2.2);
            if (Math.random() < dt * 0.12) this.vx = -this.vx;
            if ((this.x < -60 && this.vx < 0) || (this.x > W + 60 && this.vx > 0)) this.vx = -this.vx;
        }
    };

    // končetina: nejdřív tmavý obrys, nnad ním barva
    function limb(ctx, pts, w, color) {
        var k;
        [[w + 3.5, OUTLINE], [w, color]].forEach(function (st) {
            ctx.lineWidth = st[0];
            ctx.strokeStyle = st[1];
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
            ctx.stroke();
        });
    }

    function blob(ctx, cx, cy, rx, ry, rot, color) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = OUTLINE;
        ctx.stroke();
    }

    function paintCrab(ctx, c, p, moving) {
        var side, i;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // nohy
        for (side = -1; side <= 1; side += 2) {
            for (i = 0; i < 3; i++) {
                var sw = moving ? Math.sin(p + i * 1.3 + (side > 0 ? Math.PI : 0)) * 5 : 0;
                var by = 6 + i * 5;
                limb(ctx, [
                    [side * 20, by],
                    [side * (38 + i * 3), by + 8 + sw * 0.4],
                    [side * (48 + i * 3), by + 20 + sw * 0.6]
                ], 4, c);
            }
        }

        // klepeta
        var lift = moving ? Math.sin(p * 0.5) * 3 : 0;
        for (side = -1; side <= 1; side += 2) {
            var cx = side * 44;
            var cy = -24 + lift * side;
            limb(ctx, [[side * 22, -6], [side * 30, -12], [cx, cy + 8]], 5, c);
            blob(ctx, cx + side * 3, cy - 6, 5.5, 11, side * 0.35, c);
            blob(ctx, cx, cy + 4, 8.5, 8.5, 0, c);
        }

        // tělo
        blob(ctx, 0, 0, 30, 20, 0, c);
        ctx.beginPath();
        ctx.ellipse(-6, -7, 15, 7, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fill();

        // pusa
        ctx.beginPath();
        ctx.arc(0, 4, 8, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = OUTLINE;
        ctx.stroke();

        // oči
        for (side = -1; side <= 1; side += 2) {
            limb(ctx, [[side * 8, -16], [side * 9, -27]], 3, c);
            ctx.beginPath();
            ctx.arc(side * 9, -29, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = OUTLINE;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(side * 9, -29, 2.3, 0, Math.PI * 2);
            ctx.fillStyle = OUTLINE;
            ctx.fill();
        }

    }

    // každý krab se vykreslí jen jednou do malého canvasu (16 fází chůze),
    // za běhu se pak jen kopíruje obrázek přes drawImage
    var FR = 16, RS = 1.6, SW = 128, SH = 96, OX = 64, OY = 50, cache = {};

    function sprite(color, frame) {
        var arr = cache[color] || (cache[color] = []), s = arr[frame + 1];
        if (s) return s;
        s = document.createElement('canvas');
        s.width = Math.ceil(SW * RS);
        s.height = Math.ceil(SH * RS);
        var c = s.getContext('2d');
        c.scale(RS, RS);
        c.translate(OX, OY);
        paintCrab(c, color, frame < 0 ? 0 : frame / FR * Math.PI * 4, frame >= 0);
        arr[frame + 1] = s;
        return s;
    }

    Crab.prototype.draw = function (ctx) {
        var s = this.size / 40;
        var f = (this.pause <= 0 && !reduce)
            ? Math.floor((this.phase % (Math.PI * 4)) / (Math.PI * 4) * FR) : -1;
        ctx.drawImage(sprite(this.color, f), Math.round(this.x - OX * s), Math.round(this.y - OY * s), Math.round(SW * s), Math.round(SH * s));
    };

    /* ---------- scéna: pláž v Mumbai při západu slunce ---------- */

    function qpt(p0, p1, p2, t) {
        var u = 1 - t;
        return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
                u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
    }

    // palma: zužující se zakřivený kmen, listy s lístky a kokosy (jen siluet, kreslí se jednou)
    function palm(c, x, y, h, dir) {
        var INK = '#14091a';
        var P0 = [x, y], P1 = [x - dir * h * 0.08, y - h * 0.55], P2 = [x + dir * h * 0.24, y - h];
        var tx = P2[0], ty = P2[1], N = 28, i, k, t, p, q, dx, dy, l, w;
        var wBase = Math.max(7, h * 0.034), wTop = wBase * 0.45;
        var L = [], R = [];

        // kmen
        for (i = 0; i <= N; i++) {
            t = i / N;
            p = qpt(P0, P1, P2, t);
            q = qpt(P0, P1, P2, Math.min(1, t + 0.01));
            dx = q[0] - p[0]; dy = q[1] - p[1];
            if (!dx && !dy) { q = qpt(P0, P1, P2, t - 0.01); dx = p[0] - q[0]; dy = p[1] - q[1]; }
            l = Math.sqrt(dx * dx + dy * dy) || 1;
            w = (wBase + (wTop - wBase) * t) / 2;
            L.push([p[0] - dy / l * w, p[1] + dx / l * w]);
            R.push([p[0] + dy / l * w, p[1] - dx / l * w]);
        }
        c.fillStyle = INK;
        c.beginPath();
        c.moveTo(L[0][0], L[0][1]);
        for (i = 1; i <= N; i++) c.lineTo(L[i][0], L[i][1]);
        for (i = N; i >= 0; i--) c.lineTo(R[i][0], R[i][1]);
        c.closePath();
        c.fill();

        // prstence na kmeni
        c.strokeStyle = 'rgba(70,40,90,0.55)';
        c.lineWidth = 1.5;
        c.lineCap = 'round';
        for (i = 2; i < N; i += 2) {
            c.beginPath();
            c.moveTo(L[i][0], L[i][1]);
            c.lineTo(R[i][0], R[i][1] - 2);
            c.stroke();
        }

        // listy: dlouhé, převislé, s lístky po obou stranách žebra
        var fronds = 11;
        for (k = 0; k < fronds; k++) {
            var a = Math.PI * (1.03 + 0.94 * k / (fronds - 1));
            var ca = Math.cos(a), sa = Math.sin(a);
            var len = h * (0.30 + 0.07 * Math.abs(ca)) * (0.9 + 0.2 * ((k * 7) % 5) / 4);
            var droop = len * (0.35 + 0.35 * Math.abs(ca));
            var A = [tx, ty];
            var B = [tx + ca * len * 0.55, ty + sa * len * 0.75 - len * 0.12];
            var E = [tx + ca * len, ty + sa * len * 0.25 + droop];
            var wd = len * 0.07, nx = -sa, ny = ca;

            // čepel listu
            c.fillStyle = INK;
            c.beginPath();
            c.moveTo(A[0], A[1]);
            c.quadraticCurveTo(B[0] + nx * wd, B[1] + ny * wd, E[0], E[1]);
            c.quadraticCurveTo(B[0] - nx * wd, B[1] - ny * wd, A[0], A[1]);
            c.fill();

            // lístky
            c.strokeStyle = INK;
            c.lineWidth = Math.max(1.4, h * 0.0055);
            c.beginPath();
            for (i = 1; i <= 12; i++) {
                t = 0.12 + 0.86 * i / 12;
                p = qpt(A, B, E, t);
                var ll = len * 0.2 * (1 - t * 0.6);
                c.moveTo(p[0], p[1]);
                c.lineTo(p[0] + nx * ll * 0.5 + ca * ll * 0.35, p[1] + ny * ll * 0.5 + 0.9 * ll);
                c.moveTo(p[0], p[1]);
                c.lineTo(p[0] - nx * ll * 0.5 + ca * ll * 0.35, p[1] - ny * ll * 0.5 + 0.9 * ll);
            }
            c.stroke();
        }

        // kokosy
        c.fillStyle = INK;
        for (k = 0; k < 3; k++) {
            c.beginPath();
            c.arc(tx + (k - 1) * h * 0.022, ty + h * 0.022 + (k % 2) * h * 0.012, Math.max(4, h * 0.018), 0, Math.PI * 2);
            c.fill();
        }
    }

    function drawScene() {
        if (!scene) return;
        var c = scene.ctx, hz = H * 0.58, sh = H * 0.8, g, i, x;
        var sx = W * 0.68, sr = Math.min(W, H) * 0.09;

        g = c.createLinearGradient(0, 0, 0, hz);
        g.addColorStop(0, '#2b1b4a'); g.addColorStop(0.45, '#8a3a6e');
        g.addColorStop(0.8, '#e4572e'); g.addColorStop(1, '#ffb26b');
        c.fillStyle = g; c.fillRect(0, 0, W, hz);

        g = c.createRadialGradient(sx, hz, 0, sx, hz, sr * 3.4);
        g.addColorStop(0, 'rgba(255,205,120,0.85)'); g.addColorStop(1, 'rgba(255,140,80,0)');
        c.fillStyle = g; c.fillRect(0, 0, W, hz);
        c.save(); c.beginPath(); c.rect(0, 0, W, hz); c.clip();
        c.beginPath(); c.arc(sx, hz - sr * 0.3, sr, 0, Math.PI * 2);
        c.fillStyle = '#ffd98a'; c.fill(); c.restore();

        g = c.createLinearGradient(0, hz, 0, sh);
        g.addColorStop(0, '#d9663a'); g.addColorStop(0.25, '#6b3a5c'); g.addColorStop(1, '#0d2f3f');
        c.fillStyle = g; c.fillRect(0, hz, W, sh - hz);

        for (i = 0; i < 14; i++) {
            var w = sr * 2 * (1 - i / 18) + 10;
            c.fillStyle = 'rgba(255,190,100,' + (0.5 - i * 0.032) + ')';
            c.fillRect(sx - w / 2 + Math.sin(i * 2.1) * 8, hz + 4 + i * (sh - hz) / 16, w, 2.5);
        }
        c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 1.5;
        for (i = 0; i < 26; i++) {
            var wx = ((i * 173) % 100) / 100 * W, wy = hz + 10 + ((i * 37) % 100) / 100 * (sh - hz - 14);
            c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + 30 + (i * 13) % 50, wy); c.stroke();
        }

        // Marine Drive: silueta města a řetěz světel podél zálivu
        var bw, bh, bx = 0; i = 0;
        c.fillStyle = '#1a0f24';
        while (bx < W * 0.4) {
            bw = 8 + (i * 7) % 14; bh = 10 + ((i * 11) % 7) * 5 * (1 - bx / (W * 0.55));
            c.fillRect(bx, hz - bh, bw, bh + 3); bx += bw + 1; i++;
        }
        for (x = 0; x < W * 0.4; x += 9) {
            var ly = hz + 3 - Math.sin(x / (W * 0.4) * Math.PI) * 5;
            c.fillStyle = '#ffe08a'; c.beginPath(); c.arc(x, ly, 1.7, 0, Math.PI * 2); c.fill();
            c.fillStyle = 'rgba(255,224,138,0.35)'; c.fillRect(x - 1, ly + 4, 2, 7);
        }

        g = c.createLinearGradient(0, sh, 0, H);
        g.addColorStop(0, '#e0b070'); g.addColorStop(1, '#a8743c');
        c.fillStyle = g; c.fillRect(0, sh, W, H - sh);
        c.fillStyle = 'rgba(80,40,20,0.25)'; c.fillRect(0, sh, W, 14);
        c.strokeStyle = 'rgba(255,255,255,0.65)'; c.lineWidth = 3;
        c.beginPath();
        for (x = 0; x <= W; x += 8) c.lineTo(x, sh + Math.sin(x / 40) * 3);
        c.stroke();

        palm(c, W * 0.05, H + 10, H * 0.42, 1);
        palm(c, W * 0.95, H + 10, H * 0.5, -1);
        palm(c, W * 0.89, H + 10, H * 0.3, -1);
    }

    /* ---------- stav ---------- */

    var crabs = [];
    var walkers = [];
    var particles = [];
    var ultraActive = false;
    var ultraEnd = 0;
    var bombTimer = 0;

    function spawnBackgroundCrabs() {
        crabs.length = 0;
        var n = Math.max(6, Math.min(14, Math.round(W / 130)));
        for (var i = 0; i < n; i++) {
            crabs.push(new Crab({
                size: rand(46, 84),
                x: rand(0, W),
                y: rand(H * 0.8, H - 30),
                vx: (Math.random() < 0.5 ? -1 : 1) * rand(18, 42),
                color: pick(COLORS_BG),
                alpha: 1,
                wander: true
            }));
        }
        // seřadit podle y, ať se "vzdálenější" kraby kreslí první
        crabs.sort(function (a, b) { return a.y - b.y; });
    }

    function drawStatic() {
        if (!bg) return;
        bg.ctx.clearRect(0, 0, W, H);
        crabs.forEach(function (c) { c.draw(bg.ctx); });
    }

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        layers.forEach(function (l) {
            var r = l === scene ? Math.min(dpr, 1.5) : Math.min(dpr, 1.5);
            l.el.width = Math.round(W * r);
            l.el.height = Math.round(H * r);
            l.ctx.setTransform(r, 0, 0, r, 0, 0);
        });
        crabs.forEach(function (c) { c.y = Math.min(Math.max(c.y, H * 0.8), H - 30); });
        drawScene();
        if (reduce) drawStatic();
    }

    /* ---------- ULTRA efekt ---------- */

    function burst(x, y) {
        for (var i = 0; i < 16; i++) {
            var a = Math.random() * Math.PI * 2;
            var sp = rand(120, 420);
            particles.push({
                x: x, y: y,
                vx: Math.cos(a) * sp,
                vy: Math.sin(a) * sp - 80,
                r: rand(2, 5),
                life: rand(0.7, 1.3),
                max: 1.3,
                color: pick(COLORS_BOOM)
            });
        }
    }

    function endUltra() {
        var txt = document.getElementById('ultra-text');
        if (txt) { txt.classList.remove('shake'); txt.classList.remove('show'); }
        setTimeout(function () { ultraActive = false; }, 800);
    }

    function startUltra() {
        if (ultraActive) return;
        ultraActive = true;
        var txt = document.getElementById('ultra-text');
        if (txt) txt.classList.add('show');

        if (reduce) {
            setTimeout(endUltra, 2500);
            return;
        }

        var n = Math.round(Math.min(40, Math.max(14, W / 30)));
        for (var i = 0; i < n; i++) {
            var fromLeft = Math.random() < 0.5;
            walkers.push(new Crab({
                size: rand(50, 110),
                x: fromLeft ? -rand(60, 600) : W + rand(60, 600),
                y: rand(40, Math.max(80, H - 30)),
                vx: (fromLeft ? 1 : -1) * rand(220, 520),
                color: pick(COLORS_ULTRA),
                alpha: 1
            }));
        }
        if (txt) setTimeout(function () { txt.classList.add('shake'); }, 800);
        ultraEnd = performance.now() + 5000;
        setTimeout(endUltra, 5000);
    }

    /* ---------- smyčka ---------- */

    var last = performance.now(), raf = 0;
    var bgAcc = 0;

    function frame(now) {
        var dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        if (bg) {
            bgAcc += dt;
            if (bgAcc >= 0.033) {
                bg.ctx.clearRect(0, 0, W, H);
                for (var j = 0; j < crabs.length; j++) {
                    var cb = crabs[j];
                    cb.update(bgAcc);
                    if (cb.x > -90 && cb.x < W + 90) cb.draw(bg.ctx);
                }
                bgAcc = 0;
            }
        }

        if (walk && walkers.length) {
            walk.ctx.clearRect(0, 0, W, H);
            for (var w = walkers.length - 1; w >= 0; w--) {
                var c = walkers[w];
                c.update(dt);
                if ((c.vx > 0 && c.x > W + 150) || (c.vx < 0 && c.x < -150)) walkers.splice(w, 1);
            }
            for (var q = 0; q < walkers.length; q++) walkers[q].draw(walk.ctx);
        }

        if (bombs && (ultraActive || particles.length)) {
            if (ultraActive && now < ultraEnd) {
                bombTimer -= dt;
                if (bombTimer <= 0) {
                    burst(rand(W * 0.1, W * 0.9), rand(H * 0.1, H * 0.8));
                    bombTimer = 0.15;
                }
            }
            var ctx = bombs.ctx;
            ctx.clearRect(0, 0, W, H);
            for (var i = particles.length - 1; i >= 0; i--) {
                var p = particles[i];
                p.life -= dt;
                if (p.life <= 0) { particles.splice(i, 1); continue; }
                p.vx *= 0.98;
                p.vy += 500 * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                ctx.globalAlpha = Math.max(0, p.life / p.max);
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2);
            }
            ctx.globalAlpha = 1;
        }

        raf = requestAnimationFrame(frame);
    }

    /* ---------- start ---------- */

    resize();
    spawnBackgroundCrabs();
    var rt;
    window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
            if (window.innerWidth !== W || Math.abs(window.innerHeight - H) > 150) resize();
        }, 150);
    });

    var btn = document.getElementById('ultra-btn');
    if (btn) btn.addEventListener('click', startUltra);

    if (reduce) {
        drawStatic();
    } else {
        raf = requestAnimationFrame(function (t) { last = t; frame(t); });
        // skrytá záložka = nulová zátěž
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
            else if (!raf) raf = requestAnimationFrame(function (t) { last = t; frame(t); });
        });
    }
})();