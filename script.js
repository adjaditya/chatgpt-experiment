// -------------------- Capsule Rarity Definitions --------------------
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

// -------------------- Cat Capsule Catalog --------------------
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

// -------------------- Global Game State --------------------
const gameState = {
  busy: false,
  discovered: new Map()
};

// -------------------- Cached DOM References --------------------
const machineElement = document.querySelector('.machine');
const craneElement = document.getElementById('crane');
const craneClawElement = document.getElementById('craneClaw');
const ballPitElement = document.getElementById('ballPit');
const revealSpotElement = document.getElementById('revealSpot');
const playButton = document.getElementById('playButton');
const resultPanelElement = document.getElementById('resultPanel');
const catCardContainer = document.getElementById('catCard');
const closeResultButton = document.getElementById('closeResult');
const collectionListElement = document.getElementById('collectionList');
const catCardTemplate = document.getElementById('catCardTemplate');

// -------------------- Gameplay Constants --------------------
const CRANE_BASE_CABLE = 120;
const CRANE_MIN_CABLE = 120;
const CRANE_MAX_CABLE = 360;
const BALL_TOUCH_CLEARANCE = 4;
const PLATFORM_TOUCH_OFFSET = 26;
const BALL_COUNT = 12;
const RARITY_SEQUENCE = ['common', 'rare', 'epic', 'legendary'];

// -------------------- Weighted Distribution Helpers --------------------
function buildDistribution(items, weightAccessor) {
  const distribution = [];
  let cumulativeWeight = 0;
  items.forEach((item) => {
    const weight = weightAccessor(item);
    cumulativeWeight += weight;
    distribution.push({ item, cumulativeWeight });
  });
  return { distribution, totalWeight: cumulativeWeight };
}

const rarityEntries = Object.values(rarities);
const rarityDistribution = buildDistribution(rarityEntries, (rarity) => rarity.weight);
const catsByRarity = catPool.reduce((acc, cat) => {
  const bucket = acc.get(cat.rarity) ?? [];
  bucket.push(cat);
  acc.set(cat.rarity, bucket);
  return acc;
}, new Map());
const catDistributions = new Map(
  [...catsByRarity.entries()].map(([rarityKey, cats]) => [
    rarityKey,
    buildDistribution(cats, (cat) => cat.weight ?? 1)
  ])
);

// -------------------- Utility Functions --------------------
function clampCableLength(length) {
  return Math.min(CRANE_MAX_CABLE, Math.max(CRANE_MIN_CABLE, length));
}

function selectFromDistribution({ distribution, totalWeight }) {
  if (distribution.length === 0) {
    return undefined;
  }
  const roll = Math.random() * totalWeight;
  return distribution.find(({ cumulativeWeight }) => roll < cumulativeWeight)?.item ?? distribution[distribution.length - 1].item;
}

function selectRarityByWeight() {
  return selectFromDistribution(rarityDistribution).key;
}

function selectCatByWeight(rarityKey) {
  const distribution = catDistributions.get(rarityKey);
  if (!distribution) {
    return undefined;
  }
  return selectFromDistribution(distribution);
}

function drawCapsuleCat() {
  const rarityKey = selectRarityByWeight();
  return selectCatByWeight(rarityKey) ?? catPool[catPool.length - 1];
}

function createBallElement() {
  const ball = document.createElement('div');
  ball.className = 'ball';
  applyBallRarity(ball, selectRarityByWeight());
  randomizeBallPlacement(ball);
  ballPitElement.appendChild(ball);
  return ball;
}

function applyBallRarity(ball, rarityKey) {
  const rarity = rarities[rarityKey];
  ball.dataset.rarity = rarity.key;
  ball.style.setProperty('--ball-color', rarity.color);
}

function randomizeBallPlacement(ball) {
  const left = 10 + Math.random() * 70;
  const top = 12 + Math.random() * 70;
  const scale = 0.85 + Math.random() * 0.2;
  ball.style.left = `${left}%`;
  ball.style.top = `${top}%`;
  ball.style.transform = `scale(${scale})`;
  ball.classList.remove('taken');
  ball.style.opacity = '';
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// -------------------- Game Flow --------------------
async function runClawRound() {
  gameState.busy = true;
  playButton.disabled = true;

  const cat = drawCapsuleCat();
  const ball = locateBallForRarity(cat.rarity);
  ball.classList.add('cooldown');

  const floatingBall = await animateCraneToBall(ball);

  await delay(250);
  floatingBall.classList.add('burst');
  await delay(380);
  floatingBall.remove();
  revealSpotElement.innerHTML = '';
  craneElement.style.setProperty('--cable-length', '120px');

  presentCat(cat);
  await delay(200);

  ball.classList.remove('cooldown');
  applyBallRarity(ball, selectRarityByWeight());
  randomizeBallPlacement(ball);

  craneElement.classList.remove('grabbing');
  craneElement.classList.remove('lowering');

  gameState.busy = false;
  playButton.disabled = false;
}

function locateBallForRarity(rarityKey) {
  const availableBalls = [...ballPitElement.querySelectorAll('.ball:not(.cooldown)')];
  const rarityMatches = availableBalls.filter((ball) => ball.dataset.rarity === rarityKey);
  if (rarityMatches.length > 0) {
    return rarityMatches[Math.floor(Math.random() * rarityMatches.length)];
  }
  return availableBalls.length
    ? availableBalls[Math.floor(Math.random() * availableBalls.length)]
    : createBallElement();
}

async function animateCraneToBall(targetBall) {
  const machineRect = machineElement.getBoundingClientRect();
  const ballRect = targetBall.getBoundingClientRect();
  const craneRect = craneElement.getBoundingClientRect();
  const revealRect = revealSpotElement.getBoundingClientRect();

  const targetX = ballRect.left - machineRect.left + ballRect.width / 2 - craneRect.width / 2;
  craneElement.style.setProperty('--crane-x', `${targetX}px`);
  await delay(820);

  craneElement.classList.add('lowering');
  const updatedBallRect = targetBall.getBoundingClientRect();
  const clawRestRect = craneClawElement.getBoundingClientRect();
  const ballTouchPoint = updatedBallRect.bottom - BALL_TOUCH_CLEARANCE;
  const dropDelta = ballTouchPoint - clawRestRect.bottom;
  const dropLength = clampCableLength(CRANE_BASE_CABLE + dropDelta);
  craneElement.style.setProperty('--cable-length', `${dropLength}px`);
  await delay(520);

  craneElement.classList.remove('lowering');
  craneElement.classList.add('grabbing');
  targetBall.classList.add('taken');

  const floatingBall = targetBall.cloneNode(true);
  floatingBall.classList.add('floating-ball', 'carried');
  const computedColor = getComputedStyle(targetBall).getPropertyValue('--ball-color').trim();
  const fallbackColor = rarities[targetBall.dataset.rarity]?.color || '#ff8ad6';
  floatingBall.style.setProperty('--ball-color', computedColor || fallbackColor);
  craneClawElement.appendChild(floatingBall);

  craneElement.style.setProperty('--cable-length', '120px');
  await delay(520);

  const revealX = revealRect.left - machineRect.left + revealRect.width / 2 - craneRect.width / 2;
  craneElement.style.setProperty('--crane-x', `${revealX}px`);
  await delay(720);

  craneElement.classList.add('lowering');
  const clawRestAtReveal = craneClawElement.getBoundingClientRect();
  const platformTarget = revealRect.top + PLATFORM_TOUCH_OFFSET;
  const revealDrop = clampCableLength(
    CRANE_BASE_CABLE + (platformTarget - clawRestAtReveal.bottom)
  );
  craneElement.style.setProperty('--cable-length', `${revealDrop}px`);
  await delay(420);
  craneElement.classList.remove('lowering');

  await delay(160);
  floatingBall.classList.remove('carried');
  floatingBall.classList.add('on-platform');
  revealSpotElement.innerHTML = '';
  revealSpotElement.appendChild(floatingBall);

  return floatingBall;
}

// -------------------- UI Rendering --------------------
function renderCatDetails(cat) {
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

  resultPanelElement.classList.remove('hidden');
  if (closeResultButton) {
    closeResultButton.focus({ preventScroll: true });
  }
}

function presentCat(cat) {
  renderCatDetails(cat);
  recordCatDiscovery(cat);
  renderCollectionList();
}

function recordCatDiscovery(cat) {
  const current = gameState.discovered.get(cat.id) ?? { cat, count: 0 };
  current.count += 1;
  gameState.discovered.set(cat.id, current);
}

function renderCollectionList() {
  collectionListElement.innerHTML = '';
  if (gameState.discovered.size === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No capsules opened yet. Give the claw a try!';
    collectionListElement.appendChild(empty);
    return;
  }

  const sorted = [...gameState.discovered.values()].sort((a, b) => {
    if (a.cat.rarity === b.cat.rarity) {
      return a.cat.name.localeCompare(b.cat.name);
    }
    return getRarityOrder(a.cat.rarity) - getRarityOrder(b.cat.rarity);
  });

  sorted.forEach(({ cat, count }) => {
    const item = document.createElement('li');
    const nameButton = document.createElement('button');
    nameButton.type = 'button';
    nameButton.className = 'cat-name';
    nameButton.textContent = `${cat.name}`;
    nameButton.addEventListener('click', () => {
      renderCatDetails(cat);
    });

    const badge = document.createElement('span');
    badge.className = `rarity-tag ${cat.rarity}`;
    badge.textContent = `${rarities[cat.rarity].label} ×${count}`;

    item.append(nameButton, badge);
    collectionListElement.appendChild(item);
  });
}

function getRarityOrder(key) {
  return RARITY_SEQUENCE.indexOf(key);
}

function hideResultPanel() {
  resultPanelElement.classList.add('hidden');
  if (playButton) {
    playButton.focus({ preventScroll: true });
  }
}

// -------------------- Initialization --------------------
function initializeBallPit() {
  for (let i = 0; i < BALL_COUNT; i += 1) {
    createBallElement();
  }
}

function initializeGame() {
  initializeBallPit();
  renderCollectionList();
}

initializeGame();

// -------------------- Event Wiring --------------------
playButton.addEventListener('click', () => {
  if (!gameState.busy) {
    runClawRound();
  }
});

closeResultButton.addEventListener('click', () => {
  hideResultPanel();
});

resultPanelElement.addEventListener('click', (event) => {
  if (event.target === resultPanelElement) {
    hideResultPanel();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !resultPanelElement.classList.contains('hidden')) {
    hideResultPanel();
  }
});

// -------------------- Service Worker Registration --------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.error('Service worker registration failed', err);
    });
  });
}
