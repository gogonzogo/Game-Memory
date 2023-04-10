const refs = {
  difficultyListTitle: document.querySelector('.difficulty__list-title'),
  difficultyList: document.querySelector('.difficulty__list'),
  styleListTitle: document.querySelector('.style__list-title'),
  styleList: document.querySelector('.style__list'),
  rankingTitle: document.querySelector('.ranking__list-title'),
  rankingList: document.querySelector('.ranking__list'),
}

refs.difficultyList.addEventListener('click', chooseDifficulty);

function chooseDifficulty(e) {
  console.log(e.target);
  
}