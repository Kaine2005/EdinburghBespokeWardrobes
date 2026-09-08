/* ═══════════════════════════════════════════════════════════════
   E.B.W — shared interactions
   ═══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    // ─── Nav: solid on scroll (skipped when nav is already .solid) ───
    var nav = document.getElementById('nav');
    if (nav && !nav.classList.contains('solid')) {
        var onScroll = function () {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ─── Mobile menu ───
    var menu = document.getElementById('mobileMenu');
    var hamburger = document.getElementById('hamburger');
    var closeBtn = document.getElementById('mobileClose');

    if (menu && hamburger) {
        var openMenu = function () {
            menu.classList.add('open');
            document.body.style.overflow = 'hidden';
        };
        var closeMenu = function () {
            menu.classList.remove('open');
            document.body.style.overflow = '';
        };
        hamburger.addEventListener('click', openMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }

    // ─── Scroll reveal ───
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    // Above-the-fold reveals fire immediately
    setTimeout(function () {
        document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach(function (el) {
            el.classList.add('in');
        });
    }, 80);

    // ─── FAQ accordion ───
    document.querySelectorAll('.faq-item').forEach(function (item) {
        var q = item.querySelector('.faq-q');
        var a = item.querySelector('.faq-a');
        if (!q || !a) return;
        q.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');
            if (isOpen) {
                item.classList.remove('open');
                a.style.maxHeight = null;
                q.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
                q.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ─── Before/after compare slider ───
    document.querySelectorAll('.compare-viewport').forEach(function (vp) {
        var dragging = false;

        var setPos = function (pct) {
            pct = Math.max(1, Math.min(99, pct));
            vp.style.setProperty('--pos', pct + '%');
            vp.setAttribute('aria-valuenow', Math.round(pct));
        };

        var track = function (e) {
            var rect = vp.getBoundingClientRect();
            setPos(((e.clientX - rect.left) / rect.width) * 100);
        };

        vp.addEventListener('pointerdown', function (e) {
            dragging = true;
            vp.setPointerCapture(e.pointerId);
            track(e);
        });
        vp.addEventListener('pointermove', function (e) {
            if (dragging) track(e);
        });
        var stop = function () { dragging = false; };
        vp.addEventListener('pointerup', stop);
        vp.addEventListener('pointercancel', stop);

        vp.addEventListener('keydown', function (e) {
            var cur = parseFloat(vp.getAttribute('aria-valuenow')) || 50;
            if (e.key === 'ArrowLeft') { setPos(cur - 4); e.preventDefault(); }
            else if (e.key === 'ArrowRight') { setPos(cur + 4); e.preventDefault(); }
        });
    });
})();
