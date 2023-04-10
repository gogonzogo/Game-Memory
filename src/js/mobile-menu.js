(() => {
  const mobileMenu = document.querySelector('.js-menu-container');
  const gameBoard = document.querySelector('.js-game-container');
  const openMenuBtn = document.querySelector('.js-open-menu');
  const openGameBoardBtn = document.querySelector('.js-open-game');
  const closeMenuBtn = document.querySelector('.js-close-menu');
  const closeGameBoardBtn = document.querySelector('.js-open-game-menu');
  const stopGameBtn = document.querySelector('.js-stop-game');

  const toggleMenu = () => {
    const isMenuOpen =
      openMenuBtn.getAttribute('aria-expanded') === 'true' || false;
    openMenuBtn.setAttribute('aria-expanded', !isMenuOpen);
    mobileMenu.classList.toggle('is-open');

    const scrollLockMethod = !isMenuOpen
      ? 'disableBodyScroll'
      : 'enableBodyScroll';
    bodyScrollLock[scrollLockMethod](document.body);
  };

  const toggleGameBoard = () => {
    const isGameBoardOpen =
      openGameBoardBtn.getAttribute('aria-expanded') === 'true' || false;
    openGameBoardBtn.setAttribute('aria-expanded', !isGameBoardOpen);
    gameBoard.classList.toggle('is-open');

    const scrollLockMethod = !isGameBoardOpen
      ? 'disableBodyScroll'
      : 'enableBodyScroll';
    bodyScrollLock[scrollLockMethod](document.body);
  };

  openMenuBtn.addEventListener('click', toggleMenu);
  closeMenuBtn.addEventListener('click', toggleMenu);
  openGameBoardBtn.addEventListener('click', toggleGameBoard);
  closeGameBoardBtn.addEventListener('click', toggleGameBoard);
  stopGameBtn.addEventListener('click', toggleGameBoard);


  // Close the mobile menu on wider screens if the device orientation changes
  window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
    if (!e.matches) return;
    mobileMenu.classList.remove('is-open');
    openMenuBtn.setAttribute('aria-expanded', false);
    bodyScrollLock.enableBodyScroll(document.body);
  });
})();