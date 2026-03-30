/* ─── PRELOADER ─── */
        (function () {
            const lines = [
                { id: 'pl1', txt: 'npm run build:portfolio --prod' },
                { id: 'pl2', txt: '✓ Compiled 1842 modules  Ready in 1.9s' },
                { id: 'pl3', txt: 'Launching prajwal.exe ✓' },
            ];
            let li = 0, ci = 0;
            function type() {
                if (li >= lines.length) return;
                const el = document.getElementById(lines[li].id);
                const t = lines[li].txt;
                if (ci < t.length) { el.textContent += t[ci++]; setTimeout(type, 22); }
                else { li++; ci = 0; setTimeout(type, 180); }
            }
            setTimeout(type, 250);
            window.addEventListener('load', () => {
                setTimeout(() => {
                    document.getElementById('preloader').classList.add('loaded');
                    document.body.style.overflow = '';
                    // show deco shapes on wider screens
                    if (window.innerWidth >= 768) {
                        ['dsh1', 'dsh2', 'dsh3'].forEach(id => { const e = document.getElementById(id); if (e) e.style.display = 'block'; });
                    }
                }, 2300);
            });
            document.body.style.overflow = 'hidden';
        })();

        /* ─── THEME ─── */
        const root = document.documentElement;
        const themeBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        let dark = localStorage.getItem('pp-theme') === 'dark';
        function applyTheme() {
            root.setAttribute('data-theme', dark ? 'dark' : 'light');
            themeIcon.className = dark ? 'ri-sun-line' : 'ri-moon-line';
            localStorage.setItem('pp-theme', dark ? 'dark' : 'light');
        }
        applyTheme();
        themeBtn.addEventListener('click', () => { dark = !dark; applyTheme(); });

        /* ─── CURSOR — no mix-blend-mode ─── */
        const cur = document.getElementById('cursor');
        const ctr = document.getElementById('cursor-trail');
        let mx = 0, my = 0, tx = 0, ty = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cur.style.left = mx + 'px'; cur.style.top = my + 'px'; cur.style.transform = 'translate(-50%,-50%)';
        });
        (function anim() {
            tx += (mx - tx) * .13; ty += (my - ty) * .13;
            ctr.style.left = tx + 'px'; ctr.style.top = ty + 'px'; ctr.style.transform = 'translate(-50%,-50%)';
            requestAnimationFrame(anim);
        })();
        // hover expand on interactive elements
        document.querySelectorAll('a,button,input,textarea,.skill-tab,.skill-cell').forEach(el => {
            el.addEventListener('mouseenter', () => { cur.classList.add('cursor-expand'); });
            el.addEventListener('mouseleave', () => { cur.classList.remove('cursor-expand'); });
        });
        document.addEventListener('mousedown', () => { cur.style.transform = 'translate(-50%,-50%) scale(.65)'; });
        document.addEventListener('mouseup', () => { cur.style.transform = 'translate(-50%,-50%)'; });
        // hide system cursor only on desktop
        if (window.innerWidth >= 1024) document.documentElement.style.cursor = 'none';
        window.addEventListener('resize', () => {
            if (window.innerWidth < 1024) document.documentElement.style.cursor = '';
            else document.documentElement.style.cursor = 'none';
        });

        /* ─── MOBILE MENU ─── */
        const mBtn = document.getElementById('menu-toggle');
        const mMenu = document.getElementById('mobile-menu');
        let mOpen = false;
        function openMobile() { mOpen = true; mBtn.classList.add('open'); mMenu.classList.add('open'); mBtn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; document.querySelectorAll('.mob-link').forEach(l => l.setAttribute('tabindex', '0')); }
        function closeMobile() { mOpen = false; mBtn.classList.remove('open'); mMenu.classList.remove('open'); mBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; document.querySelectorAll('.mob-link').forEach(l => l.setAttribute('tabindex', '-1')); }
        mBtn.addEventListener('click', () => { mOpen ? closeMobile() : openMobile(); });
        document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMobile));
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && mOpen) closeMobile(); });

        /* ─── COMMAND PALETTE ─── */
        const CMDS = [
            { icon: 'ri-home-line', label: 'Go to Home', kbd: 'H', fn: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { icon: 'ri-user-line', label: 'About Me', kbd: 'A', fn: () => sTo('about') },
            { icon: 'ri-flashlight-line', label: 'Impact Highlights', kbd: 'I', fn: () => sTo('highlights') },
            { icon: 'ri-code-line', label: 'Tech Stack', kbd: 'S', fn: () => sTo('skills') },
            { icon: 'ri-briefcase-line', label: 'Experience', kbd: 'E', fn: () => sTo('experience') },
            { icon: 'ri-folder-line', label: 'Projects', kbd: 'P', fn: () => sTo('projects') },
            { icon: 'ri-book-line', label: 'Education', kbd: 'U', fn: () => sTo('education') },
            { icon: 'ri-mail-line', label: 'Contact Me', kbd: 'C', fn: () => sTo('contact') },
            { icon: 'ri-download-line', label: 'Download CV', kbd: 'D', fn: () => { const a = document.createElement('a'); a.href = 'Assets/Resume/Resume_Prajwal_SinglePage_ATS.pdf'; a.download = 'Resume_Prajwal.pdf'; a.click(); } },
            { icon: 'ri-github-fill', label: 'Open GitHub', kbd: 'G', fn: () => window.open('https://github.com/prajwalpatil2204', '_blank') },
            { icon: 'ri-linkedin-fill', label: 'Open LinkedIn', kbd: 'L', fn: () => window.open('https://www.linkedin.com/in/prajwal-patil2204/', '_blank') },
            { icon: 'ri-contrast-2-line', label: 'Toggle Dark Mode', kbd: 'T', fn: () => { dark = !dark; applyTheme(); } },
        ];
        function sTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }

        const cmdOv = document.getElementById('cmd-overlay');
        const cmdIn = document.getElementById('cmd-input');
        const cmdLi = document.getElementById('cmd-list');
        let ci2 = 0, filtered = [];

        function renderCmds(q = '') {
            const f = q.toLowerCase();
            filtered = CMDS.filter(c => c.label.toLowerCase().includes(f));
            cmdLi.innerHTML = filtered.map((c, i) => `
    <div class="cmd-item${i === 0 ? ' ca' : ''}" data-i="${i}">
      <i class="${c.icon}"></i>
      <span class="cl">${c.label}</span>
      <span class="ck">${c.kbd}</span>
    </div>`).join('');
            ci2 = 0;
            cmdLi.querySelectorAll('.cmd-item').forEach((el, i) => el.addEventListener('click', () => { filtered[i].fn(); closeCmd(); }));
        }
        function openCmd() { cmdOv.classList.add('open'); cmdIn.value = ''; renderCmds(); setTimeout(() => cmdIn.focus(), 40); }
        function closeCmd() { cmdOv.classList.remove('open'); }
        function updateActive() { cmdLi.querySelectorAll('.cmd-item').forEach((el, i) => el.classList.toggle('ca', i === ci2)); }

        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); cmdOv.classList.contains('open') ? closeCmd() : openCmd(); return; }
            if (!cmdOv.classList.contains('open')) return;
            if (e.key === 'Escape') closeCmd();
            if (e.key === 'ArrowDown') { e.preventDefault(); ci2 = Math.min(ci2 + 1, filtered.length - 1); updateActive(); }
            if (e.key === 'ArrowUp') { e.preventDefault(); ci2 = Math.max(ci2 - 1, 0); updateActive(); }
            if (e.key === 'Enter') { e.preventDefault(); filtered[ci2]?.fn(); closeCmd(); }
        });
        cmdIn.addEventListener('input', () => renderCmds(cmdIn.value));
        cmdOv.addEventListener('click', e => { if (e.target === cmdOv) closeCmd(); });
        document.getElementById('cmd-hint').addEventListener('click', openCmd);

        /* ─── SKILL FILTER ─── */
        document.querySelectorAll('.skill-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const f = tab.dataset.f;
                document.querySelectorAll('.skill-cell').forEach(cell => {
                    cell.classList.toggle('hidden', f !== 'all' && cell.dataset.c !== f);
                });
            });
        });

        /* PROJECT FILTER */
        document.querySelectorAll('.proj-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.proj-tab').forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-pressed', 'true');
                const filter = tab.dataset.pf;
                document.querySelectorAll('.proj-card').forEach(card => {
                    if (filter === 'all') {
                        card.classList.remove('hidden');
                        return;
                    }
                    const stack = card.dataset.tech || '';
                    card.classList.toggle('hidden', !stack.includes(filter));
                });
            });
        });

        /* ─── TYPING ─── */
        const phrases = [
            'Building robust .NET Core & SQL systems.',
            'Python • TensorFlow • OpenCV • Miniconda.',
            'Clean code. Bold design. Real-world solutions.',
            'Full Stack Developer — Chinchwad, India.',
            'Complex stored procedures securely handled.',
        ];
        let pi = 0, tci = 0, del = false;
        const tel = document.getElementById('typing-text');
        function type2() {
            if (!tel) return;
            const p = phrases[pi];
            if (del) { tel.textContent = p.substring(0, --tci); }
            else { tel.textContent = p.substring(0, ++tci); }
            let sp = del ? 28 : 58;
            if (!del && tci === p.length) { sp = 2200; del = true; }
            else if (del && tci === 0) { del = false; pi = (pi + 1) % phrases.length; sp = 400; }
            setTimeout(type2, sp);
        }
        setTimeout(type2, 2500);

        /* ─── REVEAL ─── */
        const revEls = document.querySelectorAll('.rev,.rev-l,.rev-r,.rev-s');
        const revObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }), { threshold: .07 });
        revEls.forEach(el => revObs.observe(el));

        /* ─── COUNTER ─── */
        let counted = false;
        const cntEl = document.querySelector('.stat-row');
        if (cntEl) {
            new IntersectionObserver(es => {
                if (es[0].isIntersecting && !counted) {
                    counted = true;
                    document.querySelectorAll('.counter').forEach(el => {
                        const t = +el.dataset.target; let c = 0; const inc = t / (1800 / 16);
                        const upd = () => { c += inc; if (c < t) { el.textContent = Math.ceil(c) + '+'; requestAnimationFrame(upd); } else el.textContent = t + '+'; };
                        upd();
                    });
                }
            }, { threshold: .5 }).observe(cntEl);
        }

        /* ─── ACTIVE NAV ─── */
        document.querySelectorAll('section[id]').forEach(sec => {
            new IntersectionObserver(es => {
                if (es[0].isIntersecting) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active-section', l.getAttribute('href') === '#' + sec.id));
                }
            }, { threshold: .25, rootMargin: '-76px 0px -40% 0px' }).observe(sec);
        });

        /* ─── PROGRESS + BTT ─── */
        const btt = document.getElementById('btt');
        window.addEventListener('scroll', () => {
            const s = (window.scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100;
            document.getElementById('progress-bar').style.width = s + '%';
            btt.classList.toggle('on', window.scrollY > 500);
        }, { passive: true });
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        /* ─── PARALLAX SHAPES ─── */
        window.addEventListener('scroll', () => {
            const speeds = [.05, -.04, .06];
            const rots = [14, 0, 45];
            ['dsh1', 'dsh2', 'dsh3'].forEach((id, i) => {
                const el = document.getElementById(id); if (!el || el.style.display === 'none') return;
                el.style.transform = `translateY(${window.scrollY * speeds[i]}px) rotate(${rots[i] + window.scrollY * speeds[i] * 1.5}deg)`;
            });
        }, { passive: true });

        /* ─── TESTIMONIALS ─── */
        const tData = [
            { color: '#33FF57', log: 'REPORT_001', from: 'Student @ L J University', quote: 'Prajwal proved that no matter the pressure or time constraint — he delivers outstandingly.' },
            { color: '#3B82F6', log: 'REPORT_002', from: 'CEO @ Alpha Consultancy', quote: 'Fast, reliable, and actually has good taste in design. A rare combination.' },
            { color: '#FF70A6', log: 'REPORT_003', from: 'Student @ L J University', quote: 'Cleanest code I\'ve seen in years. He handles complex state management with ease.' },
            { color: '#A855F7', log: 'REPORT_004', from: 'Dev @ CreativeChaos', quote: 'Creative design ideas and a truly unique UI experience — well above expectations.' },
            { color: '#FF9F1C', log: 'REPORT_005', from: 'UX Designer @ TechFlow', quote: 'Highly intuitive UX. Delivered exactly what we needed before we even knew we needed it.' },
        ];
        const tr = document.getElementById('test-track');
        tr.innerHTML = [...tData, ...tData].map(t => `
  <div class="test-card">
    <div class="test-bar" style="background:${t.color};"></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
      <span class="test-log" style="color:${t.color};">${t.log}.log</span>
      <span class="test-yr">2025.txt</span>
    </div>
    <div class="test-from">${t.from}</div>
    <div class="test-q">"${t.quote}"</div>
    <div class="test-stars" style="color:${t.color};">
      <i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i>
      <i class="ri-star-fill"></i><i class="ri-star-fill"></i>
    </div>
  </div>`).join('');

        /* ─── CONTACT FORM ─── */
        document.getElementById('contact-form').addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('c-name').value.trim();
            const email = document.getElementById('c-email').value.trim();
            const msg = document.getElementById('c-msg').value.trim();
            const st = document.getElementById('form-status');
            if (!name || !email || !msg) {
                Object.assign(st.style, { display: 'block', background: '#FF2A2A', color: '#fff', border: '2px solid #000' });
                st.textContent = 'All fields are required.'; return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                Object.assign(st.style, { display: 'block', background: '#FF2A2A', color: '#fff', border: '2px solid #000' });
                st.textContent = 'Invalid email address.'; return;
            }
            const btn = e.target.querySelector('.fsub');
            btn.disabled = true;
            btn.textContent = 'TRANSMITTING...';

            const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
            const body = encodeURIComponent(
                `Hi Prajwal,\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n\n` +
                `Message:\n${msg}\n\n` +
                `Sent from your portfolio contact form.`
            );

            window.location.href = `mailto:prajwalpatil852@gmail.com?subject=${subject}&body=${body}`;
            Object.assign(st.style, {
                display: 'block',
                background: '#33FF57',
                color: '#000',
                border: '2px solid #000',
                padding: '10px 12px',
                marginTop: '10px',
                fontWeight: '700'
            });
            st.textContent = 'Mail draft opened. Please send it to complete your message.';
            btn.disabled = false;
            btn.textContent = 'TRANSMIT DATA ->';
            showToast('Mail draft ready');
        });

        function showToast(msg) {
            document.getElementById('toast-msg').textContent = msg;
            const t = document.getElementById('toast');
            t.classList.add('on');
            setTimeout(() => t.classList.remove('on'), 3800);
        }

        /* ─── GITHUB API ─── */
        (async () => {
            try {
                const r = await fetch('https://api.github.com/users/prajwalpatil2204', { headers: { 'Accept': 'application/vnd.github.v3+json' } });
                if (!r.ok) throw 0;
                const d = await r.json();
                animN('repos-count', d.public_repos || 0);
                animN('followers-count', d.followers || 0);
                if (d.created_at) document.getElementById('created-at').textContent = new Date(d.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                const c = (d.public_repos * 20) + (d.followers * 5);
                animN('total-contributions', c, '+'); animN('total-contributions-grid', c, '+');
            } catch {
                ['repos-count', 'followers-count', 'total-contributions', 'total-contributions-grid'].forEach(id => {
                    const e = document.getElementById(id); if (e) e.textContent = '—';
                });
                const e = document.getElementById('created-at'); if (e) e.textContent = 'N/A';
            }
        })();
        function animN(id, target, sfx = '') {
            const el = document.getElementById(id); if (!el) return;
            let c = 0; const inc = target / (1500 / 16);
            const upd = () => { c += inc; if (c < target) { el.textContent = Math.ceil(c) + sfx; requestAnimationFrame(upd); } else el.textContent = target + sfx; };
            upd();
        }

        /* ─── KONAMI ─── */
        const KK = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; let ki = 0;
        document.addEventListener('keydown', e => { ki = e.keyCode === KK[ki] ? ki + 1 : 0; if (ki === KK.length) { document.getElementById('egg').classList.add('on'); ki = 0; } });

        /* ─── MAGNETIC BUTTONS ─── */
        document.querySelectorAll('.h-btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                btn.style.boxShadow = `${x * 0.1 + 4}px ${y * 0.1 + 4}px 0 var(--border)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
        });

        /* ─── CARD TILT ─── */
        document.querySelectorAll('.exp-card, .edu-card, .proj-card, .about-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left, y = e.clientY - r.top;
                const xc = r.width/2, yc = r.height/2;
                const dx = (x - xc) / xc;
                const dy = (y - yc) / yc;
                card.style.transform = `perspective(1000px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateZ(5px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        /* ─── MISC ─── */
        document.getElementById('cur-year').textContent = new Date().getFullYear();

