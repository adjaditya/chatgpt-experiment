const rarities = {
  common: {
    key: 'common',
    label: 'Common',
    weight: 60,
    color: '#77d1f7'
  },
  rare: {
    key: 'rare',
    label: 'Rare',
    weight: 25,
    color: '#9c8cff'
  },
  epic: {
    key: 'epic',
    label: 'Epic',
    weight: 12,
    color: '#ff8ad6'
  },
  legendary: {
    key: 'legendary',
    label: 'Legendary',
    weight: 3,
    color: '#f6c350'
  }
};

const catPool = [
  {
    id: 'mochi',
    name: 'Mochi',
    rarity: 'common',
    weight: 4,
    description: 'A velvety pink kitten who naps inside teacups and hums soft melodies.',
    traits: {
      'Favorite Treat': 'Strawberry mochi',
      Mood: 'Dreamy'
    },
    colors: {
      base: '#ffe7f0',
      secondary: '#ffb7ce',
      innerEar: '#ffe1ed',
      accent: '#fffafc',
      patternColor: '#ff9fbb',
      patternOpacity: 0.2
    }
  },
  {
    id: 'poppy',
    name: 'Poppy',
    rarity: 'common',
    weight: 4,
    description: 'This marmalade mischief maker hides yarn balls all over the arcade.',
    traits: {
      'Favorite Treat': 'Pumpkin pie',
      Mood: 'Playful'
    },
    colors: {
      base: '#ffe9d1',
      secondary: '#ffb46b',
      innerEar: '#ffd5a6',
      accent: '#fff4e7',
      patternColor: '#ff993e',
      patternOpacity: 0.16
    }
  },
  {
    id: 'clover',
    name: 'Clover',
    rarity: 'common',
    weight: 3,
    description: 'A minty-fresh cuddle bug who brings lucky leaves to new friends.',
    traits: {
      'Favorite Treat': 'Matcha cookies',
      Mood: 'Helpful'
    },
    colors: {
      base: '#e9ffe8',
      secondary: '#8fe190',
      innerEar: '#d3fdd6',
      accent: '#f6fff5',
      patternColor: '#76d178',
      patternOpacity: 0.18
    }
  },
  {
    id: 'nimbus',
    name: 'Nimbus',
    rarity: 'rare',
    weight: 3,
    description: 'Floats through dreams on a tiny raincloud, sprinkling sparkles as it goes.',
    traits: {
      'Favorite Treat': 'Cloud meringue',
      Mood: 'Gentle'
    },
    colors: {
      base: '#e6f3ff',
      secondary: '#a6c4ff',
      innerEar: '#e1e9ff',
      accent: '#ffffff',
      patternColor: '#8babff',
      patternOpacity: 0.24
    }
  },
  {
    id: 'pixel',
    name: 'Pixel',
    rarity: 'rare',
    weight: 2,
    description: 'A calico coder cat who taps arcade buttons in perfect rhythm.',
    traits: {
      'Favorite Treat': 'Bubble tea pearls',
      Mood: 'Curious'
    },
    colors: {
      base: '#fff2dc',
      secondary: '#ffbfa3',
      innerEar: '#ffd8ba',
      accent: '#fffaf1',
      patternColor: 'linear-gradient(135deg, rgba(255,174,120,0.45), rgba(87,74,65,0.55))',
      patternOpacity: 0.28
    }
  },
  {
    id: 'marzipan',
    name: 'Marzipan',
    rarity: 'epic',
    weight: 2,
    description: 'A patisserie prodigy who sculpts sugar sculptures of their friends.',
    traits: {
      'Favorite Treat': 'Almond tarts',
      Mood: 'Artistic'
    },
    colors: {
      base: '#ffe9f5',
      secondary: '#ff9fd0',
      innerEar: '#ffd8ea',
      accent: '#fff4fb',
      patternColor: '#ff7fc3',
      patternOpacity: 0.26
    }
  },
  {
    id: 'nebula',
    name: 'Nebula',
    rarity: 'epic',
    weight: 1,
    description: 'Paints the night sky with swirling tails of stardust and comet trails.',
    traits: {
      'Favorite Treat': 'Cosmic cotton candy',
      Mood: 'Mystic'
    },
    colors: {
      base: '#ede7ff',
      secondary: '#b99bff',
      innerEar: '#e2d5ff',
      accent: '#f7f3ff',
      patternColor: 'linear-gradient(135deg, rgba(185,155,255,0.6), rgba(120,80,200,0.45))',
      patternOpacity: 0.32
    }
  },
  {
    id: 'queen-mallow',
    name: 'Queen Mallow',
    rarity: 'legendary',
    weight: 1,
    description: 'Royal guardian of the capsule realm, her purr echoes like soft chimes.',
    traits: {
      'Favorite Treat': 'Golden milk',
      Mood: 'Majestic'
    },
    colors: {
      base: '#fff4de',
      secondary: '#f6c350',
      innerEar: '#ffe6b4',
      accent: '#fff9ee',
      patternColor: 'linear-gradient(135deg, rgba(255,221,148,0.55), rgba(246,195,80,0.7))',
      patternOpacity: 0.34
    }
  }
];

const state = {
  busy: false,
  discovered: new Map()
};

const machine = document.querySelector('.machine');
const crane = document.getElementById('crane');
const craneClaw = document.getElementById('craneClaw');
const ballPit = document.getElementById('ballPit');
const revealSpot = document.getElementById('revealSpot');
const playButton = document.getElementById('playButton');
const resultPanel = document.getElementById('resultPanel');
const catCardContainer = document.getElementById('catCard');
const closeResultButton = document.getElementById('closeResult');
const collectionList = document.getElementById('collectionList');
const catCardTemplate = document.getElementById('catCardTemplate');

const craneTrack = document.querySelector('.crane-track');

playButton.addEventListener('click', () => {
  if (!state.busy) {
    playRound();
  }
});

closeResultButton.addEventListener('click', () => {
  hideResult();
});

resultPanel.addEventListener('click', (event) => {
  if (event.target === resultPanel) {
    hideResult();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !resultPanel.classList.contains('hidden')) {
    hideResult();
  }
});

function hideResult() {
  resultPanel.classList.add('hidden');
  if (playButton) {
    playButton.focus({ preventScroll: true });
  }
}

function weightedRarity() {
  const entries = Object.values(rarities);
  const total = entries.reduce((sum, rarity) => sum + rarity.weight, 0);
  let roll = Math.random() * total;
  for (const rarity of entries) {
    roll -= rarity.weight;
    if (roll <= 0) {
      return rarity.key;
    }
  }
  return entries[entries.length - 1].key;
}

function weightedCat(pool) {
  const total = pool.reduce((sum, cat) => sum + (cat.weight ?? 1), 0);
  let roll = Math.random() * total;
  for (const cat of pool) {
    roll -= (cat.weight ?? 1);
    if (roll <= 0) {
      return cat;
    }
  }
  return pool[pool.length - 1];
}

function drawCat() {
  const rarityKey = weightedRarity();
  const pool = catPool.filter((cat) => cat.rarity === rarityKey);
  return weightedCat(pool);
}

function createBall() {
  const ball = document.createElement('div');
  ball.className = 'ball';
  assignBallRarity(ball, weightedRarity());
  randomizeBallPosition(ball);
  ballPit.appendChild(ball);
  return ball;
}

function assignBallRarity(ball, rarityKey) {
  const rarity = rarities[rarityKey];
  ball.dataset.rarity = rarity.key;
  ball.style.setProperty('--ball-color', rarity.color);
}

function randomizeBallPosition(ball) {
  const left = 10 + Math.random() * 70;
  const top = 12 + Math.random() * 70;
  const scale = 0.85 + Math.random() * 0.2;
  ball.style.left = `${left}%`;
  ball.style.top = `${top}%`;
  ball.style.transform = `scale(${scale})`;
  ball.classList.remove('taken');
  ball.style.opacity = '';
}

function setupBalls() {
  for (let i = 0; i < 12; i += 1) {
    createBall();
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playRound() {
  state.busy = true;
  playButton.disabled = true;

  const cat = drawCat();
  const ball = findBallForRarity(cat.rarity);
  ball.classList.add('cooldown');

  const floatingBall = await animateCrane(ball);

  await wait(250);
  floatingBall.classList.add('burst');
  await wait(380);
  floatingBall.remove();
  revealSpot.innerHTML = '';
  crane.style.setProperty('--cable-length', '120px');

  revealCat(cat);
  await wait(200);

  ball.classList.remove('cooldown');
  assignBallRarity(ball, weightedRarity());
  randomizeBallPosition(ball);

  crane.classList.remove('grabbing');
  crane.classList.remove('lowering');

  state.busy = false;
  playButton.disabled = false;
}

function findBallForRarity(rarityKey) {
  const candidates = [...ballPit.querySelectorAll('.ball')].filter(
    (ball) => !ball.classList.contains('cooldown') && ball.dataset.rarity === rarityKey
  );
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  const available = [...ballPit.querySelectorAll('.ball')].filter(
    (ball) => !ball.classList.contains('cooldown')
  );
  return available.length ? available[Math.floor(Math.random() * available.length)] : createBall();
}

async function animateCrane(targetBall) {
  const machineRect = machine.getBoundingClientRect();
  const ballRect = targetBall.getBoundingClientRect();
  const craneRect = crane.getBoundingClientRect();
  const trackRect = craneTrack.getBoundingClientRect();
  const revealRect = revealSpot.getBoundingClientRect();

  const targetX = ballRect.left - machineRect.left + ballRect.width / 2 - craneRect.width / 2;
  crane.style.setProperty('--crane-x', `${targetX}px`);
  await wait(820);

  crane.classList.add('lowering');
  const dropLength = Math.min(280, Math.max(140, ballRect.top - trackRect.top + 40));
  crane.style.setProperty('--cable-length', `${dropLength}px`);
  await wait(520);

  crane.classList.remove('lowering');
  crane.classList.add('grabbing');
  targetBall.classList.add('taken');

  const floatingBall = targetBall.cloneNode(true);
  floatingBall.classList.add('floating-ball', 'carried');
  const computedColor = getComputedStyle(targetBall).getPropertyValue('--ball-color').trim();
  const fallbackColor = rarities[targetBall.dataset.rarity]?.color || '#ff8ad6';
  floatingBall.style.setProperty('--ball-color', computedColor || fallbackColor);
  craneClaw.appendChild(floatingBall);

  crane.style.setProperty('--cable-length', '120px');
  await wait(520);

  const revealX = revealRect.left - machineRect.left + revealRect.width / 2 - craneRect.width / 2;
  crane.style.setProperty('--crane-x', `${revealX}px`);
  await wait(720);

  crane.classList.add('lowering');
  const revealDrop = Math.min(260, Math.max(150, revealRect.top - trackRect.top + 60));
  crane.style.setProperty('--cable-length', `${revealDrop}px`);
  await wait(420);
  crane.classList.remove('lowering');

  await wait(160);
  floatingBall.classList.remove('carried');
  floatingBall.classList.add('on-platform');
  revealSpot.innerHTML = '';
  revealSpot.appendChild(floatingBall);

  return floatingBall;
}

function revealCat(cat) {
  const rarity = rarities[cat.rarity];
  const cardFragment = catCardTemplate.content.cloneNode(true);
  const cardInner = cardFragment.querySelector('.cat-card-inner');
  const portrait = cardFragment.querySelector('.cat-portrait');
  const rarityPill = cardFragment.querySelector('.rarity-pill');
  const catName = cardFragment.querySelector('h3');
  const description = cardFragment.querySelector('.cat-description');
  const traitList = cardFragment.querySelector('.cat-traits');

  portrait.style.setProperty('--cat-base', cat.colors.base);
  portrait.style.setProperty('--cat-secondary', cat.colors.secondary);
  portrait.style.setProperty('--cat-inner-ear', cat.colors.innerEar);
  portrait.style.setProperty('--cat-accent', cat.colors.accent);
  portrait.style.setProperty('--cat-pattern-color', cat.colors.patternColor || cat.colors.secondary);
  portrait.style.setProperty('--cat-pattern-opacity', cat.colors.patternOpacity ?? 0.18);

  rarityPill.textContent = rarity.label;
  rarityPill.classList.add(cat.rarity);
  cardInner.classList.add(`rarity-${cat.rarity}`);
  catName.textContent = cat.name;
  description.textContent = cat.description;
  traitList.innerHTML = '';

  Object.entries(cat.traits).forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    traitList.append(dt, dd);
  });

  catCardContainer.innerHTML = '';
  catCardContainer.appendChild(cardFragment);

  resultPanel.classList.remove('hidden');
  if (closeResultButton) {
    closeResultButton.focus({ preventScroll: true });
  }
  updateCollection(cat);
  updateCollectionList();
}

function updateCollection(cat) {
  const current = state.discovered.get(cat.id) ?? { cat, count: 0 };
  current.count += 1;
  state.discovered.set(cat.id, current);
}

function updateCollectionList() {
  collectionList.innerHTML = '';
  if (state.discovered.size === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No capsules opened yet. Give the claw a try!';
    collectionList.appendChild(empty);
    return;
  }

  const sorted = [...state.discovered.values()].sort((a, b) => {
    if (a.cat.rarity === b.cat.rarity) {
      return a.cat.name.localeCompare(b.cat.name);
    }
    return rarityOrder(a.cat.rarity) - rarityOrder(b.cat.rarity);
  });

  sorted.forEach(({ cat, count }) => {
    const item = document.createElement('li');
    const nameSpan = document.createElement('span');
    nameSpan.className = 'cat-name';
    nameSpan.textContent = `${cat.name}`;

    const badge = document.createElement('span');
    badge.className = `rarity-tag ${cat.rarity}`;
    badge.textContent = `${rarities[cat.rarity].label} ×${count}`;

    item.append(nameSpan, badge);
    collectionList.appendChild(item);
  });
}

function rarityOrder(key) {
  return ['common', 'rare', 'epic', 'legendary'].indexOf(key);
}

function init() {
  setupBalls();
  updateCollectionList();
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.error('Service worker registration failed', err);
    });
  });
}
