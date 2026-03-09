/* ======================================================
   MIDNIGHT ECLIPSE — Portfolio JS
   Typing, scroll reveal, nav, count-up, cert modal
   ====================================================== */

import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    initTechCanvas();
    initTyping();
    initScrollReveal();
    initNav();
    initCountUp();
    initForm();
    initCertModal();
});

// ═══════════════════════════════
// FLOATING TECH CANVAS BACKGROUND
// ═══════════════════════════════
function initTechCanvas() {
    const canvas = document.getElementById('techCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let mouse = { x: -9999, y: -9999 };
    const symbols = ['⟨⟩', '//', '{}', 'λ', 'Δ', '∞', '::', '01', '&&', '=>', '[]', '<>', '++', '#', '0x', 'fn', '~/', '>>>', '===', '**', '0b', 'async', 'void'];
    const particles = [];
    const PARTICLE_COUNT = 70;

    // Shape types: 0=hexagon, 1=pentagon, 2=triangle, 3=diamond, 4=circle, 5=cross, 6=octagon, 7=star
    const SHAPE_TYPES = 8;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function drawPolygon(ctx, sides, size) {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    class TechParticle {
        constructor() { this.reset(true); }
        reset(initial) {
            this.x = Math.random() * W;
            this.y = initial ? Math.random() * H : H + 60;
            this.vy = -(0.12 + Math.random() * 0.5);
            this.vx = (Math.random() - 0.5) * 0.4;
            this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
            this.size = 10 + Math.random() * 6;
            this.alpha = 0.06 + Math.random() * 0.12;
            this.baseAlpha = this.alpha;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.008;
            this.isShape = Math.random() > 0.45;
            this.shapeType = Math.floor(Math.random() * SHAPE_TYPES);
            this.shapeSize = 5 + Math.random() * 9;
            // Color: mix of cyan and magenta
            const colorRoll = Math.random();
            if (colorRoll < 0.4) {
                this.color = '0, 240, 255'; // cyan
            } else if (colorRoll < 0.75) {
                this.color = '224, 64, 251'; // magenta
            } else {
                this.color = '124, 77, 255'; // deep violet
            }
            // Drift oscillation
            this.oscAmp = 0.3 + Math.random() * 0.8;
            this.oscSpeed = 0.005 + Math.random() * 0.015;
            this.oscOffset = Math.random() * Math.PI * 2;
            this.time = 0;
        }
        update() {
            this.time++;

            // Mouse parallax — stronger
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 280) {
                const force = (1 - dist / 280) * 1.5;
                this.x -= (dx / dist) * force;
                this.y -= (dy / dist) * force;
                this.alpha = Math.min(this.baseAlpha + force * 0.2, 0.35);
            } else {
                this.alpha += (this.baseAlpha - this.alpha) * 0.04;
            }

            // Oscillating drift
            this.x += this.vx + Math.sin(this.time * this.oscSpeed + this.oscOffset) * this.oscAmp * 0.1;
            this.y += this.vy;
            this.rotation += this.rotSpeed;

            if (this.y < -60 || this.x < -60 || this.x > W + 60) this.reset(false);
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.alpha;

            if (this.isShape) {
                ctx.strokeStyle = `rgba(${this.color}, 1)`;
                ctx.lineWidth = 0.8;

                switch (this.shapeType) {
                    case 0: // Hexagon
                        drawPolygon(ctx, 6, this.shapeSize);
                        ctx.stroke();
                        break;
                    case 1: // Pentagon
                        drawPolygon(ctx, 5, this.shapeSize);
                        ctx.stroke();
                        break;
                    case 2: // Triangle
                        drawPolygon(ctx, 3, this.shapeSize);
                        ctx.stroke();
                        break;
                    case 3: // Diamond
                        ctx.beginPath();
                        const s = this.shapeSize;
                        ctx.moveTo(0, -s); ctx.lineTo(s, 0); ctx.lineTo(0, s); ctx.lineTo(-s, 0);
                        ctx.closePath();
                        ctx.stroke();
                        break;
                    case 4: // Circle
                        ctx.beginPath();
                        ctx.arc(0, 0, this.shapeSize, 0, Math.PI * 2);
                        ctx.stroke();
                        break;
                    case 5: // Cross
                        ctx.beginPath();
                        const c = this.shapeSize * 0.7;
                        ctx.moveTo(-c, 0); ctx.lineTo(c, 0);
                        ctx.moveTo(0, -c); ctx.lineTo(0, c);
                        ctx.stroke();
                        break;
                    case 6: // Octagon
                        drawPolygon(ctx, 8, this.shapeSize);
                        ctx.stroke();
                        break;
                    case 7: // Star (4-pointed)
                        ctx.beginPath();
                        const r1 = this.shapeSize, r2 = this.shapeSize * 0.4;
                        for (let i = 0; i < 8; i++) {
                            const a = (Math.PI / 4) * i - Math.PI / 2;
                            const r = i % 2 === 0 ? r1 : r2;
                            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
                            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                        }
                        ctx.closePath();
                        ctx.stroke();
                        break;
                }
            } else {
                ctx.font = `${this.size}px 'JetBrains Mono', monospace`;
                ctx.fillStyle = `rgba(${this.color}, 1)`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, 0, 0);
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new TechParticle());

    function animate() {
        ctx.clearRect(0, 0, W, H);

        // Draw faint connection lines between nearby particles
        ctx.lineWidth = 0.3;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.04;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        for (const p of particles) { p.update(); p.draw(); }
        requestAnimationFrame(animate);
    }
    animate();
}

// ═══════════════════════════════
// TYPING EFFECT
// ═══════════════════════════════
function initTyping() {
    const el = document.getElementById('typeTarget');
    if (!el) return;

    const phrases = [
        'AI/ML Enthusiast',
        'Python Developer',
        'Cybersecurity Explorer',
        'Data Science Builder',
        'Computer Vision Tinkerer',
    ];

    let pi = 0, ci = 0, deleting = false, speed = 80;

    function tick() {
        const word = phrases[pi];
        if (deleting) {
            el.textContent = word.substring(0, ci - 1);
            ci--;
            speed = 30;
        } else {
            el.textContent = word.substring(0, ci + 1);
            ci++;
            speed = 70;
        }
        if (!deleting && ci === word.length) { speed = 2400; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; speed = 400; }
        setTimeout(tick, speed);
    }
    setTimeout(tick, 900);
}

// ═══════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════
function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );
    items.forEach((el) => io.observe(el));
}

// ═══════════════════════════════
// NAVBAR
// ═══════════════════════════════
function initNav() {
    const nav = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const links = document.getElementById('navLinks');
    const allLinks = document.querySelectorAll('.nl');

    // Scroll effect
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);

        // Active link highlighting
        let current = '';
        document.querySelectorAll('.sec, .hero').forEach((s) => {
            if (window.scrollY >= s.offsetTop - 150) current = s.id;
        });
        allLinks.forEach((l) => {
            const href = l.getAttribute('href');
            l.classList.toggle('active', href === '#' + current);
        });
    });

    // Mobile menu
    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            links.classList.toggle('open');
        });
        allLinks.forEach((l) =>
            l.addEventListener('click', () => {
                burger.classList.remove('active');
                links.classList.remove('open');
            })
        );
    }

    // Smooth scroll for anchor links (only internal ones)
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ═══════════════════════════════
// COUNT UP
// ═══════════════════════════════
function initCountUp() {
    const nums = document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const el = e.target;
                const target = parseInt(el.dataset.count);
                let cur = 0;
                const inc = Math.max(target / 25, 1);
                const timer = setInterval(() => {
                    cur += inc;
                    if (cur >= target) { cur = target; clearInterval(timer); }
                    el.textContent = Math.floor(cur);
                }, 45);
                io.unobserve(el);
            });
        },
        { threshold: 0.5 }
    );
    nums.forEach((n) => io.observe(n));
}

// ═══════════════════════════════
// CONTACT FORM
// ═══════════════════════════════
function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span style="color: var(--coral)">✓ Message Sent!</span>';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = orig;
            btn.disabled = false;
            form.reset();
            if (window.lucide) lucide.createIcons();
        }, 2500);
    });
}

// ═══════════════════════════════
// CERTIFICATE MODAL
// ═══════════════════════════════
function initCertModal() {
    const modal = document.getElementById('certModal');
    const certImg = document.getElementById('certImage');
    const downloadBtn = document.getElementById('certDownload');
    const closeBtn = document.getElementById('modalClose');

    if (!modal || !certImg) return;

    // Click handler for certificate buttons
    document.querySelectorAll('.cert-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = btn.getAttribute('href');
            certImg.src = url;
            downloadBtn.href = url;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        certImg.src = '';
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });
}
