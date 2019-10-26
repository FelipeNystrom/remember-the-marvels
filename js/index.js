import { restartButton, shuffleButton } from './selectors.js';
import { renderCards, shuffleCards, restart } from './functions.js';

shuffleButton.addEventListener('click', shuffleCards);
restartButton.addEventListener('click', restart);

window.addEventListener('DOMContentLoaded', () => {
  renderCards(false);
});
