import { memoryDeck, loader, timer, indicator } from './selectors.js';
import marvels from './data.js';

// GLOBALS
let cards = [];
let counter = null;
let firstCard = null;
let secondCard = null;
let lockedGamePlan = false;
let sessionPoint = 0;
let isSame = false;
let isStarted = false;
let win = false;
let isNewPlayer = true;
let currentPlayer = { username: '', points: 0 };
let players = [];

function generateCard({ img, name }) {
  const backImg = './assets/svg/marvelLogo.svg';

  return `
      <div class="card" data-heroname=${name} >
      <img class="card-back-img" src="${backImg}" alt="logo">
      <img class="card-front-img" src="${img}" alt="${name}">
      </div>`;
}

function startCountdown() {
  let seconds = '60';
  let minutes = '00';

  counter = setInterval(() => {
    --seconds;

    timer.innerHTML = `${minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
    if (indicator.innerHTML === ' minutes') {
      indicator.innerHTML = ' seconds';
    }

    if (seconds === 0) {
      isStarted = false;
      timer.innerHTML = '01:00';
      indicator.innerHTML = ' minutes';
      clearInterval(counter);
      lost();
    }
  }, 1000);
}

function loading(loading = false) {
  shuffleButton.disabled = true;

  loading
    ? loader.classList.add('loading')
    : loader.classList.remove('loading');

  loader.classList.toggle('hidden');
}

function flipCard() {
  if (lockedGamePlan || this === firstCard) {
    return;
  }

  if (!isStarted) {
    isStarted = true;
    startCountdown();
  }

  this.classList.add('flip');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  if (firstCard && !secondCard) {
    secondCard = this;
    lockedGamePlan = true;
  }

  lockedGamePlan = true;

  isSame =
    firstCard.dataset.heroname === secondCard.dataset.heroname ? true : false;

  setTimeout(() => {
    if (isSame) {
      sessionPoint++;
      firstCard.removeEventListener('click', flipCard);
      firstCard.classList.add('match');

      secondCard.classList.add('match');
      secondCard.removeEventListener('click', flipCard);

      if (sessionPoint === 6) {
        won();
      }
    } else {
      firstCard.classList.add('no-match');
      secondCard.classList.add('no-match');
    }
  }, 500);

  setTimeout(() => {
    if (!isSame) {
      firstCard.classList.remove('flip');
      firstCard.classList.remove('no-match');

      secondCard.classList.remove('flip');
      secondCard.classList.remove('no-match');
    }
    lockedGamePlan = false;
    firstCard = null;
    secondCard = null;
  }, 1500);
}

function lost() {
  finishedGame.classList.remove('hidden');
  finishedGame.classList.add('lost');
  finishedGameMessage.innerHTML = 'Heroes never give up! Try again!';
}

function won() {
  clearInterval(counter);

  sessionPoint += currentPlayer.points;

  finishedGame.classList.remove('hidden');
  finishedGame.classList.add('won');
  timer.innerHTML = '01:00';
  finishedGameMessage.innerHTML = "Congratulations! You're a true hero!";
  win = true;

  players = players.filter(
    player => player.username !== currentPlayer.username
  );
  players = [...players, currentPlayer];

  localStorage.setItem('players', players);
  sessionStorage.setItem('currentPlayer', currentPlayer);
}

export function checkCache() {
  const storedPlayers = localStorage.getItem('players');
  const storedPlayer = sessionStorage.getItem('currentPlayer');

  storedPlayers ? (players = storedPLayer) : null;
  storedPlayer ? ((currentPlayer = storedPlayer), (isNewPlayer = false)) : null;
}

export function restart() {
  firstCard = null;
  secondCard = null;
  isStarted = false;
  renderCards(false);
  clearInterval(counter);
  timer.innerHTML = '01:00';
  finishedGame.classList.add('hidden');
  win
    ? finishedGame.classList.remove('won')
    : finishedGame.classList.remove('lost');
}

export function renderCards() {
  memoryDeck.innerHTML = null;

  const shuffledMarvels = [...marvels];
  for (let i = shuffledMarvels.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    const currentCard = shuffledMarvels[i];
    const swapCard = shuffledMarvels[swapIndex];

    shuffledMarvels[i] = swapCard;
    shuffledMarvels[swapIndex] = currentCard;
  }

  shuffledMarvels.forEach(marvel => {
    const marvelCard = generateCard(marvel);

    memoryDeck.insertAdjacentHTML('beforeend', marvelCard);
  });

  cards = document.querySelectorAll('.card');

  cards.forEach(card => card.addEventListener('click', flipCard));
}

export function shuffleCards() {
  clearInterval(counter);
  timer.innerHTML = '01:00';
  loading(true);
  setTimeout(() => {
    loading(false);
  }, 3000);

  renderCards();
}
