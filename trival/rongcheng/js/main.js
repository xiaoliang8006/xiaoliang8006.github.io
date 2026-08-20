// 荣成亲子游 · 精简移动版渲染入口
import { ROUTE, DAYS, SPOTS, MEALS, BUDGET, CORE_TIPS } from './data.js';

const $ = (s) => document.querySelector(s);
const yuan = (n) => '¥' + n.toLocaleString();

const ZONE_COLOR = {
  '南': 'bg-emerald-500', '中': 'bg-ocean-500', '东北': 'bg-violet-500', '北': 'bg-rose-500'
};
const TYPE_STYLE = {
  交通: { c: 'bg-slate-100 text-slate-600', i: 'ri-car-line' },
  餐饮: { c: 'bg-rose-100 text-rose-700', i: 'ri-restaurant-2-line' },
  景点: { c: 'bg-ocean-100 text-ocean-700', i: 'ri-landscape-line' },
  休息: { c: 'bg-emerald-100 text-emerald-700', i: 'ri-moon-clear-line' },
  购物: { c: 'bg-amber-100 text-amber-700', i: 'ri-shopping-bag-3-line' }
};

function renderRoute() {
  $('#routeBar').innerHTML = ROUTE.map((r, i) => `
    <div class="flex gap-3">
      <div class="flex flex-col items-center">
        <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full ${ZONE_COLOR[r.zone]} text-xs font-bold text-white">${i + 1}</span>
        ${i < ROUTE.length - 1 ? '<span class="my-0.5 h-6 w-0.5 bg-ocean-200"></span>' : ''}
      </div>
      <div class="pb-1 pt-1">
        <p class="text-sm font-bold leading-none">${r.place}</p>
        <p class="mt-1 text-xs text-slate-500">${r.day} · ${r.zone}部</p>
      </div>
    </div>`).join('');

  $('#coreTips').innerHTML = `
    <p class="flex items-center gap-2 text-sm font-bold"><i class="ri-shield-check-line"></i> 本行程调整要点</p>
    <ul class="mt-2.5 space-y-2 text-xs leading-relaxed text-ocean-100">
      ${CORE_TIPS.map((t) => `<li class="flex gap-2"><i class="ri-check-line mt-0.5 shrink-0 text-ocean-300"></i><span>${t}</span></li>`).join('')}
    </ul>`;
}

function easeDots(n) {
  let s = '';
  for (let i = 0; i < 3; i++) s += `<span class="h-1.5 w-4 rounded-full ${i < n ? 'bg-ocean-600' : 'bg-ocean-200'}"></span>`;
  return s;
}

function renderDays() {
  let cur = 0;
  const tabs = $('#dayTabs');
  const panel = $('#dayPanel');

  function drawTabs() {
    tabs.innerHTML = DAYS.map((d, i) => `
      <button data-d="${i}" class="dtab shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition
        ${i === cur ? 'bg-ocean-700 text-white' : 'bg-white text-slate-600 ring-1 ring-ocean-100'}">
        <span class="block">${d.label}</span>
        <span class="mt-0.5 block text-[10px] font-medium ${i === cur ? 'text-ocean-200' : 'text-slate-400'}">${d.zone}</span>
      </button>`).join('');
  }

  function drawPanel() {
    const d = DAYS[cur];
    panel.innerHTML = `
      <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ocean-100">
        <div class="relative h-36">
          <img src="${d.img}" alt="${d.title}" class="h-full w-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-ocean-950/85 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 p-3.5 text-white">
            <p class="text-[11px] text-ocean-200">${d.label} · ${d.zone}</p>
            <p class="text-lg font-black leading-tight">${d.title}</p>
            <p class="text-[11px] text-ocean-100">${d.sub}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 divide-x divide-ocean-100 border-b border-ocean-100 text-center">
          <div class="p-2.5"><p class="text-[10px] text-slate-500">车程</p><p class="mt-0.5 text-xs font-bold">${d.drive}</p></div>
          <div class="p-2.5"><p class="text-[10px] text-slate-500">当日花费</p><p class="mt-0.5 text-xs font-bold text-ocean-700">${yuan(d.cost)}</p></div>
          <div class="p-2.5"><p class="text-[10px] text-slate-500">强度</p><div class="mt-1.5 flex justify-center gap-1">${easeDots(d.ease)}</div></div>
        </div>
        <div class="px-3.5 py-2 text-[11px] text-slate-500"><i class="ri-hotel-bed-line"></i> ${d.stay}</div>
        <div class="tl relative space-y-2 p-3.5 pt-1">
          ${d.items.map((it) => {
            const st = TYPE_STYLE[it.type] || TYPE_STYLE['景点'];
            return `<div class="relative flex gap-3">
              <div class="flex w-12 shrink-0 flex-col items-center">
                <span class="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-ocean-700 ring-2 ring-ocean-200"><i class="${st.i} text-sm"></i></span>
              </div>
              <div class="flex-1 rounded-xl bg-ocean-50 p-3">
                <div class="flex items-center gap-2">
                  <span class="rounded-md bg-ocean-900 px-1.5 py-0.5 text-[10px] font-bold text-white">${it.time}</span>
                  <span class="rounded-md px-1.5 py-0.5 text-[10px] font-bold ${st.c}">${it.type}</span>
                </div>
                <p class="mt-1.5 text-sm font-bold leading-snug">${it.title}</p>
                <p class="mt-1 text-xs leading-relaxed text-slate-600">${it.desc}</p>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="border-t border-amber-100 bg-amber-50 p-3.5">
          <p class="text-xs font-bold text-amber-900"><i class="ri-lightbulb-flash-line"></i> 提醒</p>
          <ul class="mt-1.5 space-y-1.5 text-xs leading-relaxed text-amber-900/85">
            ${d.notes.map((n) => `<li class="flex gap-1.5"><span>·</span><span>${n}</span></li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button id="pd" class="flex-1 rounded-xl bg-white py-2.5 text-sm font-bold text-ocean-700 ring-1 ring-ocean-200 active:bg-ocean-50">上一天</button>
        <button id="nd" class="flex-1 rounded-xl bg-ocean-700 py-2.5 text-sm font-bold text-white active:bg-ocean-800">下一天</button>
      </div>`;
    $('#pd').addEventListener('click', () => go(cur - 1));
    $('#nd').addEventListener('click', () => go(cur + 1));
  }

  function go(i) {
    cur = (i + DAYS.length) % DAYS.length;
    drawTabs();
    drawPanel();
    const t = tabs.querySelector(`[data-d="${cur}"]`);
    if (t) t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('.dtab');
    if (b) go(Number(b.dataset.d));
  });

  go(0);
}

function renderSpots() {
  $('#spotList').innerHTML = SPOTS.map((s) => `
    <div class="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-ocean-100">
      <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg ${ZONE_COLOR[s.zone]} text-[11px] font-bold text-white">${s.zone}</span>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-2">
          <p class="truncate text-sm font-bold">${s.name}</p>
          <span class="shrink-0 text-xs font-bold text-ocean-700">${s.price}</span>
        </div>
        <p class="mt-0.5 text-xs text-slate-500">${s.tip}</p>
      </div>
      <div class="shrink-0 text-right">
        <p class="text-[10px] text-slate-400">${s.dur}</p>
        <span class="mt-0.5 inline-block rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">${s.ok}</span>
      </div>
    </div>`).join('');
}

function renderMeals() {
  $('#mealList').innerHTML = MEALS.map((m, i) => `
    <div class="flex items-center gap-3 p-3.5 ${i ? 'border-t border-ocean-50' : ''}">
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-bold">${m.name}</p>
        <p class="mt-0.5 text-xs text-slate-500">${m.where}</p>
      </div>
      <span class="shrink-0 rounded-md bg-ocean-50 px-2 py-1 text-[10px] font-bold text-ocean-700">${m.baby}</span>
      <span class="w-20 shrink-0 text-right text-xs font-bold text-slate-700">${m.price}</span>
    </div>`).join('');
}

function renderBudget() {
  const sum = BUDGET.reduce((a, b) => a + b.money, 0);
  const max = Math.max(...BUDGET.map((b) => b.money));
  $('#budgetBox').innerHTML = `
    <div class="rounded-2xl bg-gradient-to-br from-ocean-700 to-ocean-900 p-4 text-white">
      <p class="text-xs text-ocean-200">全程合计预估</p>
      <p class="text-4xl font-black">${yuan(sum)}</p>
      <p class="mt-0.5 text-xs text-ocean-200">旺季参考 · 宝宝门票基本全免</p>
    </div>
    <div class="mt-2.5 space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ocean-100">
      ${BUDGET.map((b) => `
        <div>
          <div class="flex items-center justify-between text-xs">
            <span class="flex items-center gap-1.5 font-semibold"><i class="${b.icon} text-ocean-600"></i>${b.item}</span>
            <span class="shrink-0 font-bold text-ocean-800">${yuan(b.money)}</span>
          </div>
          <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-ocean-50">
            <div class="h-full rounded-full bg-gradient-to-r from-ocean-400 to-ocean-700" style="width:${(b.money / max * 100).toFixed(0)}%"></div>
          </div>
        </div>`).join('')}
    </div>`;
}

const TABS = [
  { id: 'route', label: '路线', icon: 'ri-map-2-line' },
  { id: 'days', label: '行程', icon: 'ri-calendar-2-line' },
  { id: 'spots', label: '景点', icon: 'ri-landscape-line' },
  { id: 'meals', label: '餐饮', icon: 'ri-restaurant-2-line' },
  { id: 'budget', label: '预算', icon: 'ri-wallet-3-line' }
];

function renderTabBar() {
  const bar = $('#tabBar');
  bar.innerHTML = TABS.map((t) => `
    <a href="#${t.id}" data-t="${t.id}" class="tb flex flex-col items-center gap-0.5 py-2.5 text-slate-400 transition">
      <i class="${t.icon} text-xl"></i>
      <span class="text-[10px] font-bold">${t.label}</span>
    </a>`).join('');

  const secs = TABS.map((t) => document.getElementById(t.id)).filter(Boolean);
  const io = new IntersectionObserver((en) => {
    en.forEach((e) => {
      if (!e.isIntersecting) return;
      bar.querySelectorAll('.tb').forEach((a) => {
        const on = a.dataset.t === e.target.id;
        a.classList.toggle('text-ocean-700', on);
        a.classList.toggle('text-slate-400', !on);
      });
    });
  }, { rootMargin: '-20% 0px -60% 0px' });
  secs.forEach((s) => io.observe(s));
}

function boot() {
  renderRoute();
  renderDays();
  renderSpots();
  renderMeals();
  renderBudget();
  renderTabBar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
