const t={gameMenuBtn:document.querySelector(".game-menu__btn"),cardGallery:document.querySelector(".card-gallery"),timer:document.querySelector(".timer"),score:document.querySelector(".score"),statsModal:document.querySelector(".stats-modal"),statsContainer:document.querySelector(".stats__container"),statsTitle:document.querySelector(".stats__title"),closeStatsModalBtn:document.querySelector(".stats__modal-close"),clearStatHistoryBtn:document.querySelector(".btn__clear-stats-memory"),resetBtn:document.querySelector(".reset__button"),pauseBtn:document.querySelector(".pause__button"),startBtn:document.querySelector(".start__button"),stopBtn:document.querySelector(".stop__button"),hintBtn:document.querySelector(".hint__button"),styleContainer:document.querySelector(".style__list-container"),styleList:document.querySelectorAll(".style__list-item"),difficultyContainer:document.querySelector(".difficulty__list-container"),difficultyList:document.querySelectorAll(".difficulty__list-item"),playBtn:document.querySelector(".play__button"),continueBtn:document.querySelector(".continue__button"),cardLoadingAnimation:document.querySelector(".card__loading-animation"),modal:document.querySelector(".login-modal__container"),loginBtn:document.querySelector(".open__login-modal"),submitBtn:document.querySelector(".submit__btn"),closeModalBtn:document.querySelector(".login__modal-close"),loginForm:document.querySelector(".login__form"),cardFlipSound:document.querySelector(".card-flip-sound"),cardMatchSound:document.querySelector(".card-match-sound"),buttonClickSound:document.querySelector(".button-click-sound")};let e,n,a=null,s=null,o=null,l=null,i=null,c=[],r=[],d=0,u=!1,m=1,f=null,y=null,_=`Guest ${S()}, login to save your stats!`,h=null,g=0;async function p(){t.cardGallery.innerHTML="",t.timer.innerHTML="00:00",t.score.innerHTML="0",t.statsModal.style.display="none",t.playBtn.disabled=!0,t.continueBtn.disabled=!1,t.difficultyList.forEach((t=>t.classList.add("disabled"))),t.styleList.forEach((t=>t.classList.add("disabled"))),t.cardLoadingAnimation.style.display="inline-block";try{if("classic"===s){const t=await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"),e=await t.json(),n=await fetch(`https://deckofcardsapi.com/api/deck/${e.deck_id}/draw/?count=52`);b((await n.json()).cards,o)}else if("marvel"===s){const t=await fetch(`https://gateway.marvel.com/v1/public/characters?limit=100&offset=${l}&ts=1&apikey=d8596d8ee4bccb85f124f5d8d10d70c6&hash=0f06deeb86b37aee2ba98815568fbf68`);b((await t.json()).data.results,o)}else if("pokemon"===s){const t=await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=52&offset=${i}`),e=(await t.json()).results;b(await Promise.all(e.map((async t=>(await fetch(t.url)).json()))),o)}}catch(t){console.log(t)}}function b(t,e){if("marvel"===s){const n=t.filter((t=>!t.thumbnail.path.includes("image_not_available")&&""!==t.thumbnail.path&&""!==t.thumbnail.extension&&"gif"!==t.thumbnail.extension)),a=Array.from({length:n.length},((t,e)=>e)).sort((()=>Math.random()-.5)).map((t=>n[t])).slice(0,e),s=a.map((t=>({...t})));T(a.concat(s))}else if("classic"===s){const n=t.slice(0,e),a=n.map((t=>({...t}))),s=n.concat(a);for(let t=s.length-1;t>0;t--){const e=Math.floor(Math.random()*(t+1));[s[t],s[e]]=[s[e],s[t]]}T(s)}else if("pokemon"===s){const n=t.slice(0,e),a=n.map((t=>({...t}))),s=n.concat(a);for(let t=s.length-1;t>0;t--){const e=Math.floor(Math.random()*(t+1));[s[t],s[e]]=[s[e],s[t]]}T(s)}}function S(){if("marvel"===s)l=Math.floor(1500*Math.random())+1;else{if("pokemon"!==s)return Math.floor(1e4*Math.random())+1;i=Math.floor(230*Math.random())+1}}function T(e){const n=function(t){if("classic"===s)return t.map((t=>`\n      <li class="card__container">\n        <div class="card">\n          <div class="card__front card__front-classic">\n          </div>\n          <div class="card__back">\n          <img class="card__img" src="${t.image}" alt="classic stlye playing card" width="50"/>\n          </div>\n        </div>\n      </li>`)).join("");if("marvel"===s)return t.map((t=>`\n      <li class="card__container marvel-card__container">\n        <div class="card card__marvel">\n          <div class="card__front card__front-marvel"> \n          </div>\n          <div class="card__back card__back-marvel">\n            <img src="${t.thumbnail.path}.${t.thumbnail.extension}" alt="${t.name}" width="50" class="card__img card__img-marvel">\n          </div>\n        </div>\n      </li>\n    `)).join("");if("pokemon"===s)return t.map((t=>`\n      <li class="card__container">\n        <div class="card">\n          <div class="card__front card__front-pokemon"> \n          </div>\n          <div class="card__back">\n              <img src="${t.sprites.other.dream_world.front_default}" class="card__img" alt="${t.name}"/>\n          </div>\n        </div>\n      </li>\n    `)).join("")}(e);t.cardGallery.insertAdjacentHTML("beforeend",n),t.cardLoadingAnimation.style.display="none",w()}function v(e){t.score.textContent=e}function L(){null!==s&&null!==a&&(t.playBtn.disabled=!1)}function k(){r.length===a&&(M(_,h,f,y,g),q(),function(){const e=function(){const t=JSON.parse(localStorage.getItem(_));return`\n    <div class="user-stats__list-container">\n      <h4 class="user-stats__title">${_}</h4>\n      <ul class="user-stats__list">\n        <li class="user-stats__item">Difficulty: ${h}</li>\n        <li class="user-stats__item">Fastest Time to Match: ${t[h].fastestTimeToMatch}</li>\n        <li class="user-stats__item">Longest Time to Match: ${t[h].longestTimeToMatch}</li>\n        <li class="user-stats__item">Fastest Total Game Time: ${t[h].fastestTotalGameTime}</li>\n        <li class="user-stats__item">Longest Total Game Time: ${t[h].longestTotalGameTime}</li>\n        <li class="user-stats__item">Highest Score: ${t[h].highestScore}</li>\n      </ul>\n    </div>\n  `}();t.statsContainer.innerHTML=e}())}function M(t,e,n,a,s){const o=JSON.parse(localStorage.getItem(t))||{};o[e]?(n&&(n<o[e].fastestTimeToMatch||"NO STATS"===o[e].fastestTimeToMatch)&&(o[e].fastestTimeToMatch=n.toFixed(2)),n&&(n>o[e].longestTimeToMatch||"NO STATS"===o[e].longestTimeToMatch)&&(o[e].longestTimeToMatch=n.toFixed(2)),a&&(a<o[e].fastestTotalGameTime||"NO STATS"===o[e].fastestTotalGameTime)&&(o[e].fastestTotalGameTime=a.toFixed(2)),a&&(a>o[e].longestTotalGameTime||"NO STATS"===o[e].longestTotalGameTime)&&(o[e].longestTotalGameTime=a.toFixed(2)),(s>o[e].highestScore||null===o[e].highestScore)&&(o[e].highestScore=s)):o[e]={fastestTimeToMatch:n?n.toFixed(2):"NO STATS",longestTimeToMatch:n?n.toFixed(2):"NO STATS",fastestTotalGameTime:a?a.toFixed(2):"NO STATS",longestTotalGameTime:a?a.toFixed(2):"NO STATS",highestScore:s};for(const[t,n]of Object.entries(o[e]))null===n&&(o[e][t]="NO STATS");localStorage.setItem(t,JSON.stringify(o))}function B(a){if(a.target.classList.contains("pause__button")||!u){t.buttonClickSound.play();const a=document.querySelectorAll(".card");clearInterval(n),d=Date.now()-e.getTime(),u=!0,a.forEach((t=>t.classList.add("disabled"))),t.hintBtn.disabled=!0}else if(!u){const a=document.querySelectorAll(".card");clearInterval(n),d=Date.now()-e.getTime(),u=!0,a.forEach((t=>t.classList.add("disabled"))),t.hintBtn.disabled=!0}}function w(){u?(e=new Date(Date.now()-d),u=!1):e=new Date,n=setInterval((()=>{d=Date.now()-e.getTime();const n=Math.floor(d/1e3/60%60),a=Math.floor(d/1e3%60);t.timer.innerHTML=E(n)+":"+E(a)}),1e3)}function q(a=null){if(a&&!a.target.classList.contains("stop__button"))return;t.buttonClickSound.play(),clearInterval(n);let s=(new Date).getTime();y=(s-e)/1e3%60,t.difficultyList.forEach((t=>t.classList.remove("disabled"))),t.styleList.forEach((t=>t.classList.remove("disabled"))),t.difficultyList.forEach((t=>t.classList.remove("chosen-difficulty"))),t.styleList.forEach((t=>t.classList.remove("chosen-style"))),t.continueBtn.disabled=!0,r=[],g=0,setTimeout((()=>{t.statsModal.style.display="flex"}),1e3)}function E(t){return t<10?"0"+t:t}t.playBtn.disabled=!0,t.continueBtn.disabled=!0,t.cardGallery.addEventListener("click",(function(n){let a=n.target.parentNode.classList.contains("card"),s=n.target.parentNode.classList.contains("disabled");if(!a||s)return;t.cardFlipSound.play(),n.target.parentElement.querySelector(".card__img").getAttribute("src");const o=n.target.closest(".card");o.style.transform="rotateY(.5turn)",c.push(o),1!==c.length&&function(n,a){let s=n.querySelector(".card__img").getAttribute("src"),o=a.querySelector(".card__img").getAttribute("src");if(s!==o)return v(g-=1),setTimeout((()=>{n.style.transform="none",a.style.transform="none"}),1e3),void(c.length=0);s===o&&(v(g+=1),k(),function(){const t=(new Date).getTime(),n=(t-e)/1e3;null===f&&(f=n);M(_,h,f,y,g)}(),r.push(n,a),k(),c.length=0,setTimeout((()=>{!function(t,e){const n=0,a=0,s=t.getBoundingClientRect(),o=e.getBoundingClientRect(),l=window.innerHeight-(s.top+s.height)-n,i=window.innerWidth-(s.left+s.width)-a,c=window.innerHeight-(o.top+o.height)-n,r=window.innerWidth-(o.left+o.width)-a;t.style.position="absolute",t.style.bottom=l+"px",t.style.right=i+"px",e.style.position="absolute",e.style.bottom=c+"px",e.style.right=r+"px"}(n,a),function(t,e){t.style.zIndex=""+m++,e.style.zIndex=""+m++}(n,a),n.classList.add("card__matched"),a.classList.add("card__matched"),t.cardMatchSound.play()}),1e3))}(c[0],c[1])})),t.resetBtn.addEventListener("click",(function(e){e.target.classList.contains("reset__button")&&(t.buttonClickSound.play(),q(),p())})),t.pauseBtn.addEventListener("click",B),t.startBtn.addEventListener("click",(function(e){if(e.target.classList.contains("start__button")){t.buttonClickSound.play();document.querySelectorAll(".card").forEach((t=>t.classList.remove("disabled"))),t.hintBtn.disabled=!1,w()}})),t.stopBtn.addEventListener("click",q),t.difficultyContainer.addEventListener("click",(function(e){"LI"!==e.target.nodeName||e.target.classList.contains("disabled")||(t.buttonClickSound.play(),t.difficultyList.forEach((t=>t.classList.remove("chosen-difficulty"))),a=Number(e.target.dataset.value),o=a/2,h=e.target.textContent,e.target.classList.add("chosen-difficulty"),L())})),t.styleContainer.addEventListener("click",(function(e){s=e.target.closest("li").dataset.value;const n=e.target.closest("li");n&&!n.classList.contains("disabled")&&(t.buttonClickSound.play(),t.styleList.forEach((t=>t.classList.remove("chosen-style"))),e.target.closest("li").classList.add("chosen-style"),"classic"===s?(document.body.classList.remove("pokemon"),document.body.classList.remove("marvel"),document.body.classList.add("classic")):"marvel"===s?(document.body.classList.remove("pokemon"),document.body.classList.remove("classic"),document.body.classList.add("marvel")):"pokemon"===s&&(document.body.classList.remove("marvel"),document.body.classList.remove("classic"),document.body.classList.add("pokemon")),L())})),t.playBtn.addEventListener("click",(function(){t.buttonClickSound.play(),S(),p()})),window.addEventListener("click",(function(e){e.target==t.modal&&(t.modal.style.display="none")})),t.loginBtn.addEventListener("click",(function(e){e.target===t.loginBtn&&(t.buttonClickSound.play(),t.modal.style.display="flex")})),t.closeModalBtn.addEventListener("click",(function(e){e.target===t.closeModalBtn&&(t.buttonClickSound.play(),t.modal.style.display="none")})),t.submitBtn.addEventListener("click",(function(e){e.preventDefault(),t.buttonClickSound.play(),t.modal.style.display="none";const n=new FormData(t.loginForm),a=Object.fromEntries(n).uname;_=a,t.loginForm.reset()})),t.hintBtn.addEventListener("click",(function(e){if(e.target.classList.contains("hint-btn"))return;t.buttonClickSound.play();const n=document.querySelectorAll(".card");n.forEach((t=>t.style.transform="rotateY(.5turn)")),setTimeout((()=>{n.forEach((t=>t.style.transform="none"))}),500)})),t.gameMenuBtn.addEventListener("click",(function(e){e.target.closest("BUTTON")&&(t.buttonClickSound.play(),u?u&&(u=!1,B(e)):B(e))})),t.closeStatsModalBtn.addEventListener("click",(function(e){e.target===t.closeStatsModalBtn&&(t.buttonClickSound.play(),t.statsModal.style.display="none")})),t.clearStatHistoryBtn.addEventListener("click",(function(e){e.target===t.clearStatHistoryBtn&&(t.buttonClickSound.play(),localStorage.clear(),t.statsContainer.innerHTML="",t.statsTitle.innerHTML="All stats earased!")}));
//# sourceMappingURL=index.90b1e7e2.js.map