const memoryDeck = document.querySelector('#memoryDeck');
const shuffleButton = document.querySelector('#shuffleButton');
const loader = document.querySelector('#loader ');
const timer = document.querySelector('#timer');
const indicator = document.querySelector('#indicator');
const restartButton = document.querySelector('#restartButton');
const finishedGame = document.querySelector('#finishedGame');

const marvels = [
  {
    img: './assets/svg/batman.svg',
    name: 'batman'
  },
  {
    img: './assets/svg/cyclops.svg',
    name: 'cyclops'
  },
  {
    img: './assets/svg/daredevil.svg',
    name: 'daredevil'
  },
  {
    img: './assets/svg/deadpool.svg',
    name: 'deadpool'
  },
  {
    img: './assets/svg/ironman.svg',
    name: 'ironman'
  },
  {
    img: './assets/svg/wolverine.svg',
    name: 'wolverine'
  },
  {
    img: './assets/svg/batman.svg',
    name: 'batman'
  },
  {
    img: './assets/svg/cyclops.svg',
    name: 'cyclops'
  },
  {
    img: './assets/svg/daredevil.svg',
    name: 'daredevil'
  },
  {
    img: './assets/svg/deadpool.svg',
    name: 'deadpool'
  },
  {
    img: './assets/svg/ironman.svg',
    name: 'ironman'
  },
  {
    img: './assets/svg/wolverine.svg',
    name: 'wolverine'
  }
];

let cards = [];
let counter = null;
let firstCard = null;
let secondCard = null;
let lockedGamePlan = false;
let sessionPoint = 0;
let isSame = false;
let isShuffle = false;
let isStarted = false;
let win = false;

function renderCards() {
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

function generateCard({ img, name }) {
  const backImg = './assets/svg/marvelLogo.svg';

  return `
    <div class="card" data-heroname=${name} >
    <img class="card-back-img" src="${backImg}" alt="logo">
    <img class="card-front-img" src="${img}" alt="${name}">
    </div>`;
}

function startCountdown() {
  let seconds = 60;
  let minutes = '00';

  counter = setInterval(() => {
    --seconds;
    timer.innerHTML = `${minutes}:${seconds}`;
    if (indicator.innerHTML === ' minutes') {
      indicator.innerHTML = 'seconds';
    }

    if (seconds === 00) {
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

function shuffleCards() {
  clearInterval(counter);
  timer.innerHTML = '01:00';
  loading(true);
  setTimeout(() => {
    loading(false);
  }, 3000);

  renderCards();
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
  finishedGame.classList.remove('hidden');
  finishedGame.classList.add('won');
  clearInterval(counter);
  timer.innerHTML = '01:00';
  finishedGameMessage.innerHTML = "Congratulations! You're a true hero!";

  win = true;
}

function restart() {
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

shuffleButton.addEventListener('click', shuffleCards);
restartButton.addEventListener('click', restart);

renderCards(false);
