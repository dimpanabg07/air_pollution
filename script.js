/* ══════════════════════════════════════════════════════
   AIR / PROJECT — interactions
   ══════════════════════════════════════════════════════ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── scroll progress bar ─────────────────────────── */
const progressBar = document.getElementById('progressBar');
const nav = document.getElementById('nav');

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = pct + '%';
  nav.classList.toggle('is-stuck', window.scrollY > 40);
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* ── mobile nav ──────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── active nav link ─────────────────────────────── */
const navAnchors = [...navLinks.querySelectorAll('a')];
const watched = navAnchors
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && watched.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) =>
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  watched.forEach((section) => navObserver.observe(section));
}

/* ── reveal on scroll ────────────────────────────── */
const revealEls = [...document.querySelectorAll('[data-reveal]')];
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = el.parentElement ? [...el.parentElement.children] : [];
        const index = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(index, 6) * 55 + 'ms';
        el.classList.add('is-in');
        revealObserver.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

/* ── hero counters ───────────────────────────────── */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix = el.dataset.suffix || '';
  const sep = el.dataset.sep === '1';
  const duration = reduceMotion ? 0 : 1500;
  const start = performance.now();

  function frame(now) {
    const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = target * eased;
    let text = sep
      ? Math.round(value).toLocaleString('en-US')
      : value.toFixed(decimals);
    if (duration === 0) {
      text = sep ? Math.round(target).toLocaleString('en-US') : target.toFixed(decimals);
    }
    el.textContent = text + suffix;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const heroNums = document.querySelectorAll('.hstat-num');
if ('IntersectionObserver' in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  heroNums.forEach((el) => countObserver.observe(el));
}

/* ── pollutant cards ─────────────────────────────── */
document.querySelectorAll('.pcard').forEach((card) => {
  card.setAttribute('aria-expanded', 'false');
  card.addEventListener('click', () => {
    const open = card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', String(open));
  });
});

/* ── causes ──────────────────────────────────────── */
const causeBtns = [...document.querySelectorAll('.cause-btn')];
const causePanels = [...document.querySelectorAll('.cause-panel')];

causeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    causeBtns.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');

    causePanels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === btn.dataset.cause));

    // restart bar animations
    const active = document.querySelector('.cause-panel.is-active');
    if (active) {
      active.querySelectorAll('.bar i').forEach((bar) => {
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = '';
      });
    }
  });
});

/* ── effects tabs ────────────────────────────────── */
const tabs = [...document.querySelectorAll('.tab')];
const tabPanels = [...document.querySelectorAll('.tab-panel')];

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');

    tabPanels.forEach((p) => p.classList.toggle('is-active', p.dataset.tabpanel === tab.dataset.tab));
  });
});

/* ── air quality index ───────────────────────────── */
const AQI = [
  {
    name: 'Good',
    color: '#00e400',
    pm: 'PM\u2082.\u2085 up to 9.0 \u00b5g/m\u00b3',
    desc: 'Air quality is satisfactory and poses little or no risk. This is what a healthy city sky should look like.',
    advice: 'Enjoy the outdoors — and notice how different this feels from a smoggy day.',
  },
  {
    name: 'Moderate',
    color: '#ffff00',
    pm: 'PM\u2082.\u2085 9.1\u201335.4 \u00b5g/m\u00b3',
    desc: 'Air quality is acceptable, but there may be a risk for people who are unusually sensitive to air pollution.',
    advice: 'Unusually sensitive people should consider reducing prolonged or heavy exertion outdoors.',
  },
  {
    name: 'Unhealthy for sensitive groups',
    color: '#ff7e00',
    pm: 'PM\u2082.\u2085 35.5\u201355.4 \u00b5g/m\u00b3',
    desc: 'Children, older adults, and people with heart or lung disease may experience health effects. The general public is less likely to be affected.',
    advice: 'Sensitive groups should limit long or intense outdoor activity and keep reliever medication close.',
  },
  {
    name: 'Unhealthy',
    color: '#ff0000',
    pm: 'PM\u2082.\u2085 55.5\u2013125.4 \u00b5g/m\u00b3',
    desc: 'Everyone may begin to feel effects. Sensitive groups are at serious risk of heart and lung problems.',
    advice: 'Reduce outdoor exercise, keep windows closed during peak hours, and wear a well-fitted mask if you must be outside for long.',
  },
  {
    name: 'Very unhealthy',
    color: '#8f3f97',
    pm: 'PM\u2082.\u2085 125.5\u2013225.4 \u00b5g/m\u00b3',
    desc: 'A health alert. The entire population is likely to be affected and serious health effects are possible.',
    advice: 'Stay indoors with windows shut, run a purifier if you have one, and avoid all strenuous outdoor activity.',
  },
  {
    name: 'Hazardous',
    color: '#7e0023',
    pm: 'PM\u2082.\u2085 above 225.5 \u00b5g/m\u00b3',
    desc: 'Emergency conditions. Everyone is at risk of serious health effects, and visibility and daily life are disrupted.',
    advice: 'Remain indoors, seal gaps, follow local emergency advice, and check on older neighbours and anyone with asthma.',
  },
];

const aqiSegs = [...document.querySelectorAll('.aqi-seg')];
const aqiDot = document.getElementById('aqiDot');
const aqiTitle = document.getElementById('aqiTitle');
const aqiPm = document.getElementById('aqiPm');
const aqiDesc = document.getElementById('aqiDesc');
const aqiAdvice = document.getElementById('aqiAdvice');
const aqiPanel = document.getElementById('aqiPanel');

function setAqi(index) {
  const data = AQI[index];
  if (!data) return;
  aqiSegs.forEach((seg) => {
    const on = Number(seg.dataset.aqi) === index;
    seg.classList.toggle('is-active', on);
    seg.setAttribute('aria-selected', String(on));
  });
  aqiTitle.textContent = data.name;
  aqiPm.textContent = data.pm;
  aqiDesc.textContent = data.desc;
  aqiAdvice.textContent = data.advice;
  aqiDot.style.background = data.color;
  aqiDot.style.boxShadow = `0 0 0 4px ${data.color}26, 0 0 18px ${data.color}80`;
  aqiPanel.style.borderColor = `${data.color}55`;
}

aqiSegs.forEach((seg) => {
  seg.addEventListener('click', () => setAqi(Number(seg.dataset.aqi)));
});
setAqi(3);

/* ── clean-air score ─────────────────────────────── */
const scoreInputs = [...document.querySelectorAll('#scoreActions input')];
const scoreNum = document.getElementById('scoreNum');
const scoreMsg = document.getElementById('scoreMsg');
const gaugeFill = document.getElementById('gaugeFill');
const GAUGE_LENGTH = 2 * Math.PI * 82;
const SCORE_KEY = 'airproject.score';

const SCORE_MESSAGES = [
  [0, 'Every action counts. Start with one.'],
  [1, 'A good first step — clean air is built one choice at a time.'],
  [26, 'You are already reducing your footprint. Bring a friend along.'],
  [51, 'Solid progress. Your daily habits are making a real difference.'],
  [76, 'Excellent — you are part of the solution, not the smoke.'],
  [100, 'You are a clean-air champion. Now help others get there.'],
];

function updateScore() {
  const earned = scoreInputs
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + Number(i.dataset.points), 0);
  const total = scoreInputs.reduce((sum, i) => sum + Number(i.dataset.points), 0) || 1;
  const pct = Math.round((earned / total) * 100);

  scoreNum.textContent = earned;
  gaugeFill.style.strokeDashoffset = String(GAUGE_LENGTH * (1 - pct / 100));

  let color = '#35c9a4';
  if (pct >= 80) color = '#7ee2a8';
  else if (pct < 30) color = '#e0a048';
  gaugeFill.style.stroke = color;

  let msg = SCORE_MESSAGES[0][1];
  SCORE_MESSAGES.forEach(([threshold, text]) => {
    if (pct >= threshold) msg = text;
  });
  scoreMsg.textContent = msg;

  try {
    localStorage.setItem(
      SCORE_KEY,
      JSON.stringify(scoreInputs.map((i) => i.checked))
    );
  } catch (e) { /* storage unavailable */ }
}

try {
  const saved = JSON.parse(localStorage.getItem(SCORE_KEY) || 'null');
  if (Array.isArray(saved)) {
    saved.forEach((checked, i) => {
      if (scoreInputs[i]) scoreInputs[i].checked = checked;
    });
  }
} catch (e) { /* ignore */ }

scoreInputs.forEach((input) => input.addEventListener('change', updateScore));
updateScore();

/* ── pledge ──────────────────────────────────────── */
const pledgeForm = document.getElementById('pledgeForm');
const pledgeName = document.getElementById('pledgeName');
const pledgeCount = document.getElementById('pledgeCount');
const pledgeWord = document.getElementById('pledgeWord');
const PLEDGE_KEY = 'airproject.pledges';

function readPledges() {
  try {
    const value = JSON.parse(localStorage.getItem(PLEDGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (e) {
    return [];
  }
}

function renderPledges() {
  const list = readPledges();
  pledgeCount.textContent = String(list.length);
  pledgeWord.textContent = list.length === 1 ? 'person' : 'people';
}

renderPledges();

if (pledgeForm) {
  pledgeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = pledgeName.value.trim() || 'Anonymous';
    const list = readPledges();

    if (list.some((entry) => entry.name.toLowerCase() === name.toLowerCase())) {
      pledgeCount.textContent = String(list.length);
      pledgeWord.textContent = list.length === 1 ? 'person' : 'people';
      pledgeForm.querySelector('button').textContent = 'You already pledged';
      setTimeout(() => { pledgeForm.querySelector('button').textContent = 'Take the pledge'; }, 2400);
      return;
    }

    list.push({ name, at: new Date().toISOString() });
    try {
      localStorage.setItem(PLEDGE_KEY, JSON.stringify(list));
    } catch (e) { /* ignore */ }

    renderPledges();
    pledgeName.value = '';
    const btn = pledgeForm.querySelector('button');
    btn.textContent = 'Pledge recorded \u2713';
    setTimeout(() => { btn.textContent = 'Take the pledge'; }, 2600);
  });
}

/* ── hero haze canvas ────────────────────────────── */
const canvas = document.getElementById('haze');

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  let raf = null;

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
  }

  function buildParticles() {
    const count = Math.min(34, Math.max(14, Math.round(width / 42)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 60 + Math.random() * 190,
      vx: 0.08 + Math.random() * 0.32,
      vy: (Math.random() - 0.5) * 0.06,
      a: 0.03 + Math.random() * 0.07,
      warm: Math.random() > 0.45,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      const tint = p.warm ? '224, 160, 72' : '150, 168, 182';
      g.addColorStop(0, `rgba(${tint}, ${p.a})`);
      g.addColorStop(1, `rgba(${tint}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x - p.r > width) {
        p.x = -p.r;
        p.y = Math.random() * height;
      }
      if (p.y < -p.r || p.y > height + p.r) p.y = Math.random() * height;
    });
    raf = requestAnimationFrame(draw);
  }

  sizeCanvas();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizeCanvas, 180);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      cancelAnimationFrame(raf);
      draw();
    }
  });
}

/* ── smooth scroll with reduced-motion fallback ──── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();

    const navHeight = nav.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - (id === '#top' ? 0 : navHeight);
    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });
});
