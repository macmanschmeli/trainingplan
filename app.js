async function initTrainingPlan() {
  const error = document.querySelector('#load-error');
  try {
    const response = await fetch('./config.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`config.json: HTTP ${response.status}`);
    const config = await response.json();
    render(config);
  } catch (err) {
    console.error('Trainingsplan-Konfiguration konnte nicht geladen werden:', err);
    error.hidden = false;
  }
}

function render(config) {
  document.title = config.pageTitle || 'Trainingsplan';
  setText('#eyebrow', config.eyebrow || '');
  setText('#title-prefix', config.titlePrefix || 'Trainings');
  setText('#title-accent', config.titleAccent || 'plan.');
  setText('#description', config.description || '');
  setText('#week-title', config.weekTitle || 'Deine Woche');
  setText('#hall-label', config.hallFilterLabel || 'Halle');

  const chips = document.querySelector('#chips');
  chips.replaceChildren();
  (config.teamFilters || []).forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `chip${index === 0 ? ' active' : ''}`;
    button.dataset.team = item.value;
    button.textContent = item.label;
    button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    chips.append(button);
  });

  const hallSelect = document.querySelector('#hall');
  hallSelect.replaceChildren();
  addOption(hallSelect, 'all', config.allHallsLabel || 'Alle Hallen');
  (config.halls || []).forEach(hall => addOption(hallSelect, hall, hall));

  const schedule = document.querySelector('#schedule');
  schedule.replaceChildren();
  (config.days || []).forEach((day, dayIndex) => {
    const dayCard = document.createElement('article');
    dayCard.className = 'day reveal';
    dayCard.dataset.day = day.name;
    dayCard.style.transitionDelay = `${Math.min(dayIndex * 0.06, 0.3)}s`;

    const head = document.createElement('div');
    head.className = 'day-head';
    const titleWrap = document.createElement('div');
    titleWrap.className = 'day-title';
    const title = document.createElement('h3');
    title.textContent = day.name;
    titleWrap.append(title);
    head.append(titleWrap);

    const eventsWrap = document.createElement('div');
    eventsWrap.className = 'events';
    (day.events || []).forEach(event => eventsWrap.append(createEvent(event)));
    dayCard.append(head, eventsWrap);
    schedule.append(dayCard);
  });

  let selectedTeam = 'all';
  const filter = () => {
    let visible = 0;
    document.querySelectorAll('.event').forEach(eventEl => {
      const teamValues = (eventEl.dataset.team || '').split(/\s+/).filter(Boolean);
      const hallValue = eventEl.dataset.hall || '';
      const teamOK = selectedTeam === 'all' || teamValues.includes(selectedTeam);
      const hallOK = hallSelect.value === 'all' || hallValue.toLowerCase().includes(hallSelect.value.toLowerCase());
      const show = teamOK && hallOK;
      eventEl.classList.toggle('hide', !show);
      if (show) visible++;
    });
    document.querySelectorAll('.day').forEach(day => {
      day.style.display = [...day.querySelectorAll('.event')].some(e => !e.classList.contains('hide')) ? '' : 'none';
    });
    document.querySelector('#result-count').textContent = `${visible} TRAININGSEINHEIT${visible === 1 ? '' : 'EN'}`;
  };

  chips.addEventListener('click', event => {
    const button = event.target.closest('button[data-team]');
    if (!button) return;
    selectedTeam = button.dataset.team;
    chips.querySelectorAll('.chip').forEach(chip => {
      const active = chip === button;
      chip.classList.toggle('active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    filter();
  });
  hallSelect.addEventListener('change', filter);
  filter();

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }
}

function createEvent(event) {
  const row = document.createElement('div');
  row.className = 'event';
  row.dataset.team = (event.filterTeams || []).join(' ');
  row.dataset.hall = event.hallFilter || event.hall || '';
  row.dataset.start = event.start || '';

  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = event.start || '';
  const node = document.createElement('div');
  node.className = 'node';
  node.setAttribute('aria-hidden', 'true');

  const card = document.createElement('div');
  card.className = 'event-card';
  const top = document.createElement('div');
  top.className = 'event-top';
  const team = document.createElement('div');
  team.className = 'team';
  team.textContent = event.team || '';
  const category = document.createElement('div');
  category.className = 'category';
  category.textContent = event.category || '';
  top.append(team, category);

  const hall = document.createElement('div');
  hall.className = 'hall';
  hall.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><path d="M3 10 12 3l9 7v10H3z"></path><path d="M9 20v-6h6v6"></path></svg>';
  const hallName = document.createElement('span');
  hallName.textContent = event.hall || '';
  hall.append(hallName);

  const duration = document.createElement('span');
  duration.className = 'duration';
  duration.textContent = event.end || '';
  duration.setAttribute('aria-label', `Trainingszeit ${event.start || ''} bis ${event.end || ''}`);
  card.append(top, hall, duration);
  row.append(time, node, card);
  return row;
}

function addOption(select, value, label) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  select.append(option);
}
function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

document.addEventListener('DOMContentLoaded', initTrainingPlan);
