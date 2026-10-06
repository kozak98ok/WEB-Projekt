(function () {
    function makeCanvas(id) {
        const c = document.createElement('canvas');
        c.id = id;
        c.className = 'fx-canvas';
        c.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:' + (id === 'fx-walkers' ? 40 : 50);
        document.body.appendChild(c);
        return c;
    }

    const wc = makeCanvas('fx-walkers'), bc = makeCanvas('fx-bombs');
    const wx = wc.getContext('2d'), bx = bc.getContext('2d');
    let W = 0, H = 0;

    function resize() {
        const d = window.devicePixelRatio || 1;
        W = window.innerWidth; H = window.innerHeight;
        [wc, bc].forEach(c => { c.width = W * d; c.height = H * d; });
        wx.setTransform(d, 0, 0, d, 0, 0);
        bx.setTransform(d, 0, 0, d, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    /* ---------- walking crabs ---------- */

    const shades = ['#e4572e', '#c9441f', '#f07b3f', '#d94a2b'];
    const walkers = Array.from({ length: 8 }, (_, i) => ({
        x: Math.random() * W,
        y: H - 24 - (i % 4) * 34,
        s: 0.8 + Math.random() * 0.7,
        v: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.1),
        t: Math.random() * 10,
        c: shades[i % shades.length]
    }));

    function drawWalker(w) {
        const s = w.s * 22, ph = Math.sin(w.t), ph2 = Math.cos(w.t);
        wx.save();
        wx.translate(w.x, w.y);
        wx.fillStyle = w.c;
        wx.strokeStyle = w.c;
        wx.lineCap = 'round';
        wx.lineWidth = s * 0.14;
        // legs (3 per side)
        for (let side = -1; side <= 1; side += 2) {
            for (let k = 0; k < 3; k++) {
                const p = (k % 2 ? ph : ph2) * s * 0.25;
                wx.beginPath();
                wx.moveTo(side * s * 0.5, -s * 0.4 + k * s * 0.15);
                wx.lineTo(side * s * 1.0, -s * 0.7 + k * s * 0.3 + p);
                wx.lineTo(side * s * 1.25, s * 0.05 + p * 0.5);
                wx.stroke();
            }
        }
        // claws
        for (let side = -1; side <= 1; side += 2) {
            const lift = (side < 0 ? ph : ph2) * s * 0.15;
            wx.beginPath();
            wx.moveTo(side * s * 0.45, -s * 0.8);
            wx.lineTo(side * s * 0.9, -s * 1.3 + lift);
            wx.stroke();
            wx.beginPath();
            wx.arc(side * s * 0.95, -s * 1.5 + lift, s * 0.3, 0.3, Math.PI * 1.7);
            wx.lineTo(side * s * 0.95, -s * 1.5 + lift);
            wx.fill();
        }
        // body
        wx.beginPath();
        wx.ellipse(0, -s * 0.5, s * 0.75, s * 0.5, 0, 0, Math.PI * 2);
        wx.fill();
        // eyes
        wx.strokeStyle = w.c;
        for (let side = -1; side <= 1; side += 2) {
            wx.beginPath(); wx.moveTo(side * s * 0.25, -s * 0.9); wx.lineTo(side * s * 0.25, -s * 1.2); wx.stroke();
            wx.fillStyle = '#fff';
            wx.beginPath(); wx.arc(side * s * 0.25, -s * 1.25, s * 0.14, 0, Math.PI * 2); wx.fill();
            wx.fillStyle = '#12262e';
            wx.beginPath(); wx.arc(side * s * 0.25, -s * 1.25, s * 0.06, 0, Math.PI * 2); wx.fill();
        }
        wx.restore();
    }

    function stepWalkers() {
        wx.clearRect(0, 0, W, H);
        walkers.forEach(w => {
            w.x += w.v; w.t += 0.25 * Math.abs(w.v);
            if (w.x > W + 60) w.x = -60;
            if (w.x < -60) w.x = W + 60;
            drawWalker(w);
        });
    }

    /* ---------- bombs ---------- */

    let bombs = [], sparks = [], rings = [], active = false, spawnTimer = 0;

    function spawnBomb() {
        bombs.push({
            x: 30 + Math.random() * (W - 60),
            y: -20,
            vy: 3 + Math.random() * 3,
            r: 9 + Math.random() * 8,
            target: H * (0.3 + Math.random() * 0.65)
        });
    }

    function explode(b) {
        const n = 36 + Math.floor(b.r * 2);
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 7;
            sparks.push({
                x: b.x, y: b.y,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                life: 1, hue: 10 + Math.random() * 40
            });
        }
        rings.push({ x: b.x, y: b.y, r: b.r, max: b.r * 7, life: 1 });
        if (document.body.animate) {
            document.body.animate(
                [{ transform: 'translate(0,0)' }, { transform: 'translate(-3px,2px)' }, { transform: 'translate(2px,-2px)' }, { transform: 'translate(0,0)' }],
                { duration: 120 }
            );
        }
    }

    function stepBombs() {
        bx.clearRect(0, 0, W, H);

        bombs = bombs.filter(b => {
            b.y += b.vy; b.vy += 0.05;
            if (b.y >= b.target) { explode(b); return false; }
            bx.fillStyle = '#12262e';
            bx.beginPath(); bx.arc(b.x, b.y, b.r, 0, Math.PI * 2); bx.fill();
            bx.strokeStyle = '#12262e'; bx.lineWidth = 2;
            bx.beginPath(); bx.moveTo(b.x, b.y - b.r); bx.lineTo(b.x + 5, b.y - b.r - 8); bx.stroke();
            bx.fillStyle = Math.random() < 0.5 ? '#ffb020' : '#e4572e';
            bx.beginPath(); bx.arc(b.x + 5, b.y - b.r - 9, 3, 0, Math.PI * 2); bx.fill();
            return true;
        });

        rings = rings.filter(r => {
            r.r += (r.max - r.r) * 0.18; r.life -= 0.05;
            if (r.life <= 0) return false;
            bx.globalAlpha = r.life;
            bx.fillStyle = '#ffd36b';
            bx.beginPath(); bx.arc(r.x, r.y, r.r, 0, Math.PI * 2); bx.fill();
            bx.globalAlpha = 1;
            return true;
        });

        sparks = sparks.filter(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.vx *= 0.98; p.life -= 0.02;
            if (p.life <= 0) return false;
            bx.globalAlpha = p.life;
            bx.fillStyle = 'hsl(' + p.hue + ',95%,55%)';
            bx.fillRect(p.x, p.y, 4, 4);
            bx.globalAlpha = 1;
            return true;
        });

        if (active && --spawnTimer <= 0) {
            spawnBomb();
            spawnTimer = 8 + Math.random() * 18;
        }
    }

    /* ---------- loop ---------- */

    function loop() {
        stepWalkers();
        stepBombs();
        requestAnimationFrame(loop);
    }
    loop();

    /* ---------- button + text ---------- */

    const text = document.createElement('div');
    text.className = 'ultra-text';
    text.textContent = 'ULTRA KRADEZ';
    text.setAttribute('aria-hidden', 'true');
    document.body.appendChild(text);

    const btn = document.getElementById('ultra-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
        active = !active;
        btn.textContent = active ? 'Zastavit' : 'Spustit';
        btn.setAttribute('aria-pressed', active);
        if (active) {
            text.classList.add('show');
            setTimeout(function () { if (active) text.classList.add('shake'); }, 800);
        } else {
            text.classList.remove('show', 'shake');
        }
    });
})();
