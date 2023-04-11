const refs = {
  gameMenuBtn: document.querySelector(".game-menu__btn"),
  cardGallery: document.querySelector('.card-gallery'),
  timer: document.querySelector(".timer"),
  score: document.querySelector(".score"),
  statsModal: document.querySelector(".stats-modal"),
  statsContainer: document.querySelector(".stats__container"),
  statsTitle: document.querySelector(".stats__title"),
  closeStatsModalBtn: document.querySelector(".stats__modal-close"),
  clearStatHistoryBtn: document.querySelector(".btn__clear-stats-memory"),
  resetBtn: document.querySelector(".reset__button"),
  pauseBtn: document.querySelector(".pause__button"),
  startBtn: document.querySelector(".start__button"),
  stopBtn: document.querySelector(".stop__button"),
  hintBtn: document.querySelector(".hint__button"),
  styleContainer: document.querySelector(".style__list-container"),
  styleList: document.querySelectorAll(".style__list-item"),
  difficultyContainer: document.querySelector(".difficulty__list-container"),
  difficultyList: document.querySelectorAll(".difficulty__list-item"),
  playBtn: document.querySelector(".play__button"),
  continueBtn: document.querySelector(".continue__button"),
  cardLoadingAnimation: document.querySelector(".card__loading-animation"),
  modal: document.querySelector(".login-modal__container"),
  loginBtn: document.querySelector(".open__login-modal"),
  submitBtn: document.querySelector(".submit__btn"),
  closeModalBtn: document.querySelector(".login__modal-close"),
  loginForm: document.querySelector(".login__form"),
  cardFlipSound: document.querySelector(".card-flip-sound"),
  cardMatchSound: document.querySelector(".card-match-sound"),
  buttonClickSound: document.querySelector(".button-click-sound"),
};
let NUMBER_OF_CARDS = null;
let CHOSEN_STYLE = null;
let HALF_SELECTED_CARD_COUNT = null;
let CLASSIC_CARDS_BASE_URL = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
let MARVEL_API_KEY = `ts=1&apikey=d8596d8ee4bccb85f124f5d8d10d70c6&hash=0f06deeb86b37aee2ba98815568fbf68`;
let MARVEL_RANDOM_OFFSET = null;
let MARVEL_CARDS_BASE_URL = `https://gateway.marvel.com/v1/public/characters?limit=100`;
let POKEMON_CARDS_BASE_URL = `https://pokeapi.co/api/v2/pokemon/?limit=52&`;
let POKEMON_RANDOM_OFFSET = null;
let clickedCards = [];
let matchedCards = [];
let startTime;
let timerInterval;
let elapsedTime = 0;
let isPaused = false;
let zIndex = 1;
let firstMatchTime = null;
let totalGameTime = null;
let lastUsername = `Guest ${getRandomNum()}, login to save your stats!`;
let difficulty = null;
let score = 0;
let userStats = [];
refs.playBtn.disabled = true;
refs.continueBtn.disabled = true;

async function getCards() {
  refs.cardGallery.innerHTML = '';
  refs.timer.innerHTML = '00:00';
  refs.score.innerHTML = '0';
  refs.statsModal.style.display = 'none';
  refs.playBtn.disabled = true;
  refs.continueBtn.disabled = false;
  refs.difficultyList.forEach(difficulty => difficulty.classList.add('disabled'));
  refs.styleList.forEach(style => style.classList.add('disabled'));
  refs.cardLoadingAnimation.style.display = 'inline-block';
  refs.startBtn.disabled = true;
  try {
    if (CHOSEN_STYLE === 'classic') {
      const classicCardsFetch = await fetch(`${CLASSIC_CARDS_BASE_URL}`);
      const classicCardsDeck = await classicCardsFetch.json();
      const classicCardsDraw = await fetch(`https://deckofcardsapi.com/api/deck/${classicCardsDeck.deck_id}/draw/?count=52`);
      const classicCards = await classicCardsDraw.json();
      shuffleDrawCards(classicCards.cards, HALF_SELECTED_CARD_COUNT);
    } else if (CHOSEN_STYLE === 'marvel') {
      const marvelCardsFetch = await fetch(`${MARVEL_CARDS_BASE_URL}&offset=${MARVEL_RANDOM_OFFSET}&${MARVEL_API_KEY}`);
      const marvelCards = await marvelCardsFetch.json();
      shuffleDrawCards(marvelCards.data.results, HALF_SELECTED_CARD_COUNT);
    } else if (CHOSEN_STYLE === 'pokemon') {
      const pokemonCardsFetch = await fetch(`${POKEMON_CARDS_BASE_URL}offset=${POKEMON_RANDOM_OFFSET}`);
      const pokemonCards = await pokemonCardsFetch.json();
      const pokemonCardData = pokemonCards.results
      const pokemonCardImageData = await Promise.all(
        pokemonCardData.map(async (pokemonCard) => {
          const detailResponse = await fetch(pokemonCard.url);
          return detailResponse.json();
        })
      );
      shuffleDrawCards(pokemonCardImageData, HALF_SELECTED_CARD_COUNT);
    };
  } catch (error) {
    console.log(error);
  };
};

function shuffleDrawCards(data, numCards) {
  if (CHOSEN_STYLE === 'marvel') {
    const filteredCards = data.filter(marvelCard =>
      !marvelCard.thumbnail.path.includes('image_not_available') &&
      marvelCard.thumbnail.path !== '' &&
      marvelCard.thumbnail.extension !== '' &&
      marvelCard.thumbnail.extension !== 'gif'
    );
    const randomIndices = Array.from({ length: filteredCards.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    const shuffledMarvelCards = randomIndices.map(i => filteredCards[i]);
    const selectedMarvelCards = shuffledMarvelCards.slice(0, numCards);
    const duplicatedMarvelCards = selectedMarvelCards.map(card => ({ ...card }));
    const drawnMarvelCards = selectedMarvelCards.concat(duplicatedMarvelCards);
    renderCardmarkup(drawnMarvelCards);
  } else if (CHOSEN_STYLE === 'classic') {
    const selectedClassicCards = data.slice(0, numCards);
    const duplicatedClassicCards = selectedClassicCards.map(card => ({ ...card }));
    const drawnClassicCards = selectedClassicCards.concat(duplicatedClassicCards);
    for (let i = drawnClassicCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [drawnClassicCards[i], drawnClassicCards[j]] = [drawnClassicCards[j], drawnClassicCards[i]];
    }
    renderCardmarkup(drawnClassicCards);
  } else if (CHOSEN_STYLE === 'pokemon') {
    const selectedPokemonCards = data.slice(0, numCards);
    const duplicatedPokemonCards = selectedPokemonCards.map(card => ({ ...card }));
    const drawnPokemonCards = selectedPokemonCards.concat(duplicatedPokemonCards);
    for (let i = drawnPokemonCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [drawnPokemonCards[i], drawnPokemonCards[j]] = [drawnPokemonCards[j], drawnPokemonCards[i]];
    }
    renderCardmarkup(drawnPokemonCards);
  };
};

function getRandomNum() {
  if (CHOSEN_STYLE === 'marvel') {
    MARVEL_RANDOM_OFFSET = Math.floor(Math.random() * 1500) + 1;
  } else if (CHOSEN_STYLE === 'pokemon') {
    POKEMON_RANDOM_OFFSET = Math.floor(Math.random() * 230) + 1;
  } else {
    return Math.floor(Math.random() * 10000) + 1;
  };
};

function onPlayBtnClick() {
  refs.buttonClickSound.play();
  getRandomNum();
  getCards();
}

function onStyleClick(e) {
  CHOSEN_STYLE = e.target.closest('li').dataset.value;
  const closestLi = e.target.closest('li');
  if (!closestLi || closestLi.classList.contains('disabled')) {
    return;
  };
  refs.buttonClickSound.play();
  refs.styleList.forEach(item => item.classList.remove('chosen-style'));
  e.target.closest('li').classList.add('chosen-style');

  if (CHOSEN_STYLE === 'classic') {
    document.body.classList.remove('pokemon');
    document.body.classList.remove('marvel');
    document.body.classList.add('classic');
  } else if (CHOSEN_STYLE === 'marvel') {
    document.body.classList.remove('pokemon');
    document.body.classList.remove('classic');
    document.body.classList.add('marvel');
  } else if (CHOSEN_STYLE === 'pokemon') {
    document.body.classList.remove('marvel');
    document.body.classList.remove('classic');
    document.body.classList.add('pokemon');
  };
  playBtnEnable();
};

function onDifficultyClick(e) {
  if (e.target.nodeName !== 'LI' || e.target.classList.contains('disabled')) {
    return;
  };
  refs.buttonClickSound.play();
  refs.difficultyList.forEach(item => item.classList.remove('chosen-difficulty'));
  NUMBER_OF_CARDS = Number(e.target.dataset.value);
  HALF_SELECTED_CARD_COUNT = NUMBER_OF_CARDS / 2;
  difficulty = e.target.textContent;
  e.target.classList.add('chosen-difficulty');
  playBtnEnable();
};

function renderCardmarkup(data) {
  const cardGalleryMarkup = cardMarkup(data);
  refs.cardGallery.insertAdjacentHTML('beforeend', cardGalleryMarkup);
  refs.cardLoadingAnimation.style.display = 'none';
  startTimer();
};

function cardMarkup(data) {
  if (CHOSEN_STYLE === 'classic') {
    return data.map(classicCard => {
      return `
      <li class="card__container">
        <div class="card">
          <div class="card__front card__front-classic">
          </div>
          <div class="card__back">
          <img class="card__img" src="${classicCard.image}" alt="classic stlye playing card" width="50"/>
          </div>
        </div>
      </li>`
    }).join('')
  } else if (CHOSEN_STYLE === 'marvel') {
    return data.map(marvelCard => {
      return `
      <li class="card__container marvel-card__container">
        <div class="card card__marvel">
          <div class="card__front card__front-marvel"> 
          </div>
          <div class="card__back card__back-marvel">
            <img src="${marvelCard.thumbnail.path}.${marvelCard.thumbnail.extension}" alt="${marvelCard.name}" width="50" class="card__img card__img-marvel">
          </div>
        </div>
      </li>
    `;
    }).join('');
  } else if (CHOSEN_STYLE === 'pokemon') {
    return data.map(pokemonCard => {
      return `
      <li class="card__container">
        <div class="card">
          <div class="card__front card__front-pokemon"> 
          </div>
          <div class="card__back">
              <img src="${pokemonCard.sprites.other.dream_world.front_default}" class="card__img" alt="${pokemonCard.name}"/>
          </div>
        </div>
      </li>
    `;
    }).join('');
  };
};

function onCardClick(e) {
  let cardClicked = e.target.parentNode.classList.contains('card');
  let disabledCard = e.target.parentNode.classList.contains('disabled');
  if (!cardClicked || disabledCard) {
    return;
  };
  refs.cardFlipSound.play();
  const img = e.target.parentElement.querySelector('.card__img');
  const imgSrc = img.getAttribute('src');
  const cardContainer = e.target.closest('.card');
  cardContainer.style.transform = 'rotateY(.5turn)';
  clickedCards.push(cardContainer);
  if (clickedCards.length === 1) {
    return
  } else {
    doCardsMatch(clickedCards[0], clickedCards[1])
  };
};

function doCardsMatch(firstCard, secondCard) {
  let firstCardImgSrc = firstCard.querySelector('.card__img').getAttribute('src');
  let secondCardImgSrc = secondCard.querySelector('.card__img').getAttribute('src');
  if (firstCardImgSrc !== secondCardImgSrc) {
    scoreKeeper(score -= 1);
    setTimeout(() => {
      firstCard.style.transform = 'none';
      secondCard.style.transform = 'none';
    }, 1000);
    clickedCards.length = 0;
    return;
  } else if (firstCardImgSrc === secondCardImgSrc) {
    scoreKeeper(score += 1);
    endOfGame();
    matchedCardSplits();
    matchedCards.push(firstCard, secondCard);
    endOfGame();
    clickedCards.length = 0;
    setTimeout(() => {
      matchedCardsAbsolutePosition(firstCard, secondCard);
      stackedMatchedCards(firstCard, secondCard);
      firstCard.classList.add('card__matched');
      secondCard.classList.add('card__matched');
      refs.cardMatchSound.play();
    }, 1000);
  };
};

function matchedCardsAbsolutePosition(firstCard, secondCard) {
  const cardBottomDelta = 0;
  const cardRightDelta = 0;

  const firstCardRect = firstCard.getBoundingClientRect();
  const secondCardRect = secondCard.getBoundingClientRect();

  const firstCardAbsoluteBottom = window.innerHeight - (firstCardRect.top + firstCardRect.height) - cardBottomDelta;
  const firstCardAbsoluteRight = window.innerWidth - (firstCardRect.left + firstCardRect.width) - cardRightDelta;
  const secondCardAbsoluteBottom = window.innerHeight - (secondCardRect.top + secondCardRect.height) - cardBottomDelta;
  const secondCardAbsoluteRight = window.innerWidth - (secondCardRect.left + secondCardRect.width) - cardRightDelta;

  firstCard.style.position = 'absolute';
  firstCard.style.bottom = firstCardAbsoluteBottom + 'px';
  firstCard.style.right = firstCardAbsoluteRight + 'px';

  secondCard.style.position = 'absolute';
  secondCard.style.bottom = secondCardAbsoluteBottom + 'px';
  secondCard.style.right = secondCardAbsoluteRight + 'px';
};

function stackedMatchedCards(firstCard, secondCard) {
  firstCard.style.zIndex = `${zIndex++}`;
  secondCard.style.zIndex = `${zIndex++}`;
};

function scoreKeeper(score) {
  refs.score.textContent = score;
};

function onHintBtnClick(e) {
  if (e.target.classList.contains('hint-btn')) {
    return;
  }
  refs.buttonClickSound.play();
  const cardList = document.querySelectorAll('.card');
  cardList.forEach(card => card.style.transform = 'rotateY(.5turn)')

  setTimeout(() => {
    cardList.forEach(card => card.style.transform = 'none');
  }, 500);
};

function playBtnEnable() {
  if (CHOSEN_STYLE !== null && NUMBER_OF_CARDS !== null) {
    refs.playBtn.disabled = false;
  };
}

function submitForm(e) {
  e.preventDefault();
  refs.buttonClickSound.play();
  refs.modal.style.display = "none";
  const formData = new FormData(refs.loginForm);
  const data = Object.fromEntries(formData);
  const username = data.uname;
  lastUsername = username;
  refs.loginForm.reset();
};

function matchedCardSplits() {
  const currentTime = new Date().getTime();
  const timePassed = currentTime - startTime;
  const timePassedInSeconds = timePassed / 1000;
  if (firstMatchTime === null) {
    firstMatchTime = timePassedInSeconds;
  }
  updateUserStats(lastUsername, difficulty, firstMatchTime, totalGameTime, score);
};

function endOfGame() {
  if (matchedCards.length !== NUMBER_OF_CARDS) {
    return;
  } else {
    updateUserStats(lastUsername, difficulty, firstMatchTime, totalGameTime, score);
    stopGame();
    renderStats();
  };
};

function updateUserStats(lastUsername, difficulty, firstMatchTime, totalGameTime, score) {
  const userStats = JSON.parse(localStorage.getItem(lastUsername)) || {};
  if (!userStats[difficulty]) {
    userStats[difficulty] = {
      fastestTimeToMatch: firstMatchTime ? firstMatchTime.toFixed(2) : "NO STATS",
      longestTimeToMatch: firstMatchTime ? firstMatchTime.toFixed(2) : "NO STATS",
      fastestTotalGameTime: totalGameTime ? totalGameTime.toFixed(2) : "NO STATS",
      longestTotalGameTime: totalGameTime ? totalGameTime.toFixed(2) : "NO STATS",
      highestScore: score
    };
  } else {
    if (firstMatchTime && (firstMatchTime < userStats[difficulty].fastestTimeToMatch || userStats[difficulty].fastestTimeToMatch === "NO STATS")) {
      userStats[difficulty].fastestTimeToMatch = firstMatchTime.toFixed(2);
    }
    if (firstMatchTime && (firstMatchTime > userStats[difficulty].longestTimeToMatch || userStats[difficulty].longestTimeToMatch === "NO STATS")) {
      userStats[difficulty].longestTimeToMatch = firstMatchTime.toFixed(2);
    }
    if (totalGameTime && (totalGameTime < userStats[difficulty].fastestTotalGameTime || userStats[difficulty].fastestTotalGameTime === "NO STATS")) {
      userStats[difficulty].fastestTotalGameTime = totalGameTime.toFixed(2);
    }
    if (totalGameTime && (totalGameTime > userStats[difficulty].longestTotalGameTime || userStats[difficulty].longestTotalGameTime === "NO STATS")) {
      userStats[difficulty].longestTotalGameTime = totalGameTime.toFixed(2);
    }
    if (score > userStats[difficulty].highestScore || userStats[difficulty].highestScore === null) {
      userStats[difficulty].highestScore = score;
    }
  }
  // Replace any null values with "NO STATS"
  for (const [key, value] of Object.entries(userStats[difficulty])) {
    if (value === null) {
      userStats[difficulty][key] = "NO STATS";
    }
  }
  localStorage.setItem(lastUsername, JSON.stringify(userStats));
}

function markupStats() {
  const currentUserStats = JSON.parse(localStorage.getItem(lastUsername));
  const markup = `
    <div class="user-stats__list-container">
      <h4 class="user-stats__title">${lastUsername}</h4>
      <ul class="user-stats__list">
        <li class="user-stats__item">Difficulty: ${difficulty}</li>
        <li class="user-stats__item">Fastest Time to Match: ${currentUserStats[difficulty].fastestTimeToMatch}</li>
        <li class="user-stats__item">Longest Time to Match: ${currentUserStats[difficulty].longestTimeToMatch}</li>
        <li class="user-stats__item">Fastest Total Game Time: ${currentUserStats[difficulty].fastestTotalGameTime}</li>
        <li class="user-stats__item">Longest Total Game Time: ${currentUserStats[difficulty].longestTotalGameTime}</li>
        <li class="user-stats__item">Highest Score: ${currentUserStats[difficulty].highestScore}</li>
      </ul>
    </div>
  `;
  return markup;
};

function renderStats() {
  const markup = markupStats();
  refs.statsContainer.innerHTML = markup;
};

function resetGame(e) {
  if (!e.target.classList.contains('reset__button')) {
    return;
  }
  refs.buttonClickSound.play();
  stopGame();
  getCards();
};

function pauseGame(e) {
  if (e.target.classList.contains('pause__button') || !isPaused) {
    refs.buttonClickSound.play();
    refs.startBtn.disabled = false;
    const cardList = document.querySelectorAll('.card');
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime.getTime();
    isPaused = true;
    cardList.forEach(card => card.classList.add('disabled'));
    refs.hintBtn.disabled = true;
  } else if (!isPaused) {
    const cardList = document.querySelectorAll('.card');
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime.getTime();
    isPaused = true;
    cardList.forEach(card => card.classList.add('disabled'));
    refs.hintBtn.disabled = true;
  };
};

function startTimer() {
  if (!isPaused) {
    startTime = new Date();
  } else {
    startTime = new Date(Date.now() - elapsedTime);
    isPaused = false;
  }
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime.getTime();
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    refs.timer.innerHTML = addLeaderingZero(minutes) + ":" + addLeaderingZero(seconds);
  }, 1000);
};

function continueGame(e) {
  if (e.target.classList.contains('start__button')) {
    refs.buttonClickSound.play();
    const cardList = document.querySelectorAll('.card');
    cardList.forEach(card => card.classList.remove('disabled'));
    refs.hintBtn.disabled = false;
    startTimer();
    refs.startBtn.disabled = true;
  };
};

function stopGame(e = null) {
  if (e && !e.target.classList.contains('stop__button')) {
    return;
  } if (matchedCards.length === NUMBER_OF_CARDS) {
  refs.buttonClickSound.play();
  clearInterval(timerInterval);
  let currentTime = new Date().getTime();
  totalGameTime = ((currentTime - startTime) / 1000) % 60;
  refs.difficultyList.forEach(difficulty => difficulty.classList.remove('disabled'));
  refs.styleList.forEach(style => style.classList.remove('disabled'));
  refs.difficultyList.forEach(difficulty => difficulty.classList.remove('chosen-difficulty'));
  refs.styleList.forEach(style => style.classList.remove('chosen-style'));
  refs.continueBtn.disabled = true;
  matchedCards = [];
  score = 0;
  setTimeout(() => {
    refs.statsModal.style.display = 'flex';
  }, 1000);
  };
  if (matchedCards !== NUMBER_OF_CARDS) {
    refs.buttonClickSound.play();
    clearInterval(timerInterval);
    let currentTime = new Date().getTime();
    totalGameTime = ((currentTime - startTime) / 1000) % 60;
    refs.difficultyList.forEach(difficulty => difficulty.classList.remove('disabled'));
    refs.styleList.forEach(style => style.classList.remove('disabled'));
    refs.difficultyList.forEach(difficulty => difficulty.classList.remove('chosen-difficulty'));
    refs.styleList.forEach(style => style.classList.remove('chosen-style'));
    refs.continueBtn.disabled = true;
    matchedCards = [];
    score = 0;
  }
};

function addLeaderingZero(time) {
  if (time < 10) {
    return "0" + time;
  } else {
    return time;
  };
};

function loginModalClick(e) {
  if (e.target === refs.loginBtn) {
    refs.buttonClickSound.play();
    refs.modal.style.display = 'flex';
  }
};

function closeModal(e) {
  if (e.target === refs.closeModalBtn) {
    refs.buttonClickSound.play();
    refs.modal.style.display = 'none';
  }
};

function modalOutsideClick(e) {
  if (e.target == refs.modal) {
    refs.modal.style.display = 'none';
  }
};

function onGameMenuClick(e) {
  if (e.target.closest('BUTTON')) {
    refs.buttonClickSound.play();
    if (!isPaused) {
      pauseGame(e);
    } else if (isPaused) {
      isPaused = false;
      pauseGame(e);
    };
  };
};

function closeStatsModal(e) {
  if (e.target === refs.closeStatsModalBtn) {
    refs.buttonClickSound.play();
    refs.statsModal.style.display = 'none';
  };
};

function clearStatsHistory(e) {
  if (e.target === refs.clearStatHistoryBtn) {
    refs.buttonClickSound.play();
    localStorage.clear();
    refs.statsContainer.innerHTML = '';
    refs.statsTitle.innerHTML = 'All stats earased!'
  };
};

refs.cardGallery.addEventListener('click', onCardClick);
refs.resetBtn.addEventListener('click', resetGame);
refs.pauseBtn.addEventListener('click', pauseGame);
refs.startBtn.addEventListener('click', continueGame);
refs.stopBtn.addEventListener('click', stopGame);
refs.difficultyContainer.addEventListener('click', onDifficultyClick);
refs.styleContainer.addEventListener('click', onStyleClick);
refs.playBtn.addEventListener('click', onPlayBtnClick);
window.addEventListener('click', modalOutsideClick);
refs.loginBtn.addEventListener('click', loginModalClick);
refs.closeModalBtn.addEventListener('click', closeModal);
refs.submitBtn.addEventListener("click", submitForm);
refs.hintBtn.addEventListener('click', onHintBtnClick);
refs.gameMenuBtn.addEventListener('click', onGameMenuClick);
refs.closeStatsModalBtn.addEventListener('click', closeStatsModal);
refs.clearStatHistoryBtn.addEventListener('click', clearStatsHistory);
