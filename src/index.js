const refs = {
  cardGallery: document.querySelector('.card-gallery'),
}

let BASE_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?cards=9H,0H,JH,QH,KH,AH,9H,0H,JH,QH,KH,AH,9H,0H,JH,QH,KH,AH,9H,0H,JH,QH,KH,AH';
let NUMBER_OF_CARDS = 24;
let clickedCards = [];
let matchedCards = [];

// 2H,3H,4H,5H,6H,7H,8H,9H,10,JH,QH,KH,AH
// 2H,3H,4H,5H,6H,7H,8H,9H,10,JH,QH,KH,AH
function onCardClick(e) {
  let card = e.target.parentNode.classList.contains('card');
  if (!card) {
    return;
  } else {
    const img = e.target.parentElement.querySelector('.card-img');
    const imgSrc = img.getAttribute('src');
    const cardContainer = e.target.closest('.card');
    cardContainer.style.transform = 'rotateY(.5turn)';
    clickedCards.push(cardContainer);
    if (clickedCards.length < 2) {
      return
    } else {
      doCardsMatch(clickedCards[0], clickedCards[1])
    };
  }
};

function doCardsMatch(firstCard, secondCard) {
  let firstCardImgSrc = firstCard.querySelector('.card-img').getAttribute('src');
  let secondCardImgSrc = secondCard.querySelector('.card-img').getAttribute('src');
  if (firstCardImgSrc !== secondCardImgSrc) {
    setTimeout(() => {
      firstCard.style.transform = 'none';
      secondCard.style.transform = 'none';
    }, 2000);
    clickedCards.length = 0;
    return;
  } else {
    matchedCards.push(firstCard, secondCard)
    clickedCards.length = 0;
    console.log(matchedCards);
    endOfGame();
  }
};

function endOfGame() {
  if (matchedCards.length !== NUMBER_OF_CARDS) {
    return;
  } else {
    console.log('end of game');
  }
}


function getCards() {
  fetch(`${BASE_URL}`)
    .then(response => {
      return response.json();
    })
    .then((data) => {
      let DECK_ID = data.deck_id;
      let DECK_URL = `https://deckofcardsapi.com/api/deck/${DECK_ID}/draw/?count=${NUMBER_OF_CARDS}`
      return fetch(`${DECK_URL}`);
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let cards = data.cards;
      renderCardmarkup(cards)
    })
    .catch((error) => {
      console.log(error);
    });
};

function cardMarkup(data) {
  return data.map(card => {
    return `<li class="card-container">
        <div class="card">
          <div class="card-front">
          </div>
          <div class="card-back">
          <img class="card-img" src="${card.image}" width="100"/>
          </div>
        </div>
      </li>`
  }).join('')
};

function renderCardmarkup(data) {
  const cardGalleryMarkup = cardMarkup(data);
  refs.cardGallery.insertAdjacentHTML('beforeend', cardGalleryMarkup);
};

// getCards();

refs.cardGallery.addEventListener('click', onCardClick);
