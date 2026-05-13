/* ============================================================
   MAIN.JS — 全部交互逻辑
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // LOADING SCREEN
  // ============================================================
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  applyTheme(getPreferredTheme());

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ============================================================
  // NAVIGATION — Scroll Spy
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));

  // ============================================================
  // MOBILE HAMBURGER MENU
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  // Close menu on link click
  navLinksEl.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('open');
    });
  });

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // ============================================================
  // EXPERIENCE CARDS — Expand/Collapse
  // ============================================================
  const expFigure = document.querySelector('.exp-figure');

  function updateExpFigure() {
    if (!expFigure) return;
    const anyOpen = document.querySelector('.exp-card-main.open, .exp-card-side.open');
    expFigure.classList.toggle('expanded', !!anyOpen);
  }

  document.querySelectorAll('.exp-header, .exp-hint').forEach((el) => {
    el.addEventListener('click', () => {
      const card = el.closest('.exp-card-main, .exp-card-side');
      if (card) {
        card.classList.toggle('open');
        updateExpFigure();
      }
    });
  });

  // ============================================================
  // WORK MODAL
  // ============================================================
  const modal = document.getElementById('workModal');
  const modalThumb = document.getElementById('modalThumb');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalClose = modal.querySelector('.modal-close');

  const workData = [
    {
      icon: '🎪',
      title: '季节主题橱窗与营销活动陈列项目',
      desc: '负责多季主题橱窗及多场营销活动的陈列方案制定与全国落地，协同空间设计部门完成方案优化，确保创意与执行的平衡，有效带动门店客流与销售额提升。'
    },
    {
      icon: '🔧',
      title: '店务陈列道具迭代升级项目',
      desc: '主导完成多代核心道具系统的研发与标准制定，兼顾品牌调性、终端实用性与成本管控，为公司节省大量采购成本。'
    },
    {
      icon: '🏛',
      title: '品牌样板展示空间打造项目',
      desc: '负责多季订货会静态展厅与多届宁波服装节展厅的设计与布场，打造品牌最高标准的视觉样板，为全国门店提供可复制的参考范本。'
    },
    {
      icon: '📸',
      title: '品牌视觉内容策划与拍摄统筹项目',
      desc: '统筹品牌画册、形象大片的视觉创意策划与现场监督指导，全流程把控成片风格与输出质量，为品牌市场推广提供高质量视觉素材支撑。'
    }
  ];

  function openModal(index) {
    const data = workData[index];
    modalThumb.textContent = data.icon;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('click', () => {
      openModal(parseInt(card.dataset.work));
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // ============================================================
  // FULL-PAGE PARTICLE BACKGROUND
  // ============================================================
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let width, height;
  let mouseX = -1000, mouseY = -1000;
  const particles = [];
  const PARTICLE_COUNT = 100;
  const CONNECT_DIST = 150;
  const MOUSE_RADIUS = 200;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.7
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const isDark = html.getAttribute('data-theme') === 'dark';
    const dotColor = isDark ? 'rgba(180,184,220,0.7)' : 'rgba(80,82,140,0.5)';
    const lineColor = isDark ? 'rgba(180,184,220,' : 'rgba(80,82,140,';

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.vx += (dx / dist) * force * 0.1;
        p.vy += (dy / dist) * force * 0.1;
        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 5) {
          p.vx = (p.vx / speed) * 5;
          p.vy = (p.vy / speed) * 5;
        }
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw mouse connections
    if (mouseX > 0 && mouseY > 0) {
      for (const p of particles) {
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  function initParticles() {
    resize();
    createParticles();
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  initParticles();
  draw();

})();
