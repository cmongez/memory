const URL = "https://rickandmortyapi.com/api/character";
let cards = [];
let cards2 = [];
let cards3 = [];
let cardsEasy = [];
let cardFlip1,
  cardFlip1Front,
  cardFlip1Back,
  cardFlip2,
  cardFlip2Front,
  cardFlip2Back;
let failures = 0;
let success = 0;
let active = 0;
let cardsContainer = document.getElementById("cardsContainer");
let result = document.getElementById("result");
let btnStart = document.getElementById("start");

let nFlip = false;

const getApiCards = async () => {
  const request = await fetch(URL);
  const response = await request.json();

  renderCards(response);
  return response;
};

const renderCards = (response) => {
  cardsContainer.innerHTML = "";
  cardsEasy = [];
  cards = response.results;
  for (let i = 0; i < 5; i++) {
    cardsEasy.push(cards[i]);
  }
  cards2 = [...cardsEasy, ...cardsEasy];

  let cardsRandom = cards2.sort(() => Math.random() - 0.5);

  let i = 1;
  cardsRandom.forEach((element) => {
    cardsContainer.innerHTML += `
    <div id="card${i}" class="cardsContainer__card" > 
        <img id="card${i}front" class="front" src="${element.image}">
        <img id="card${i}back" onclick="flipCard('card${i}',${element.id})" class="back" src="img/memory.jpg">
    </div>
    `;
    i++;
  });
};

const startGame = () => {
  init();
  cronometrar();
  active = 1;
  document.getElementById(
    "btnStartContainer"
  ).innerHTML = `<button onclick="reiniciar(),cronometrar()" >Reiniciar</button>`;
};
btnStart.addEventListener("click", startGame);

const flipCard = (idCardContainer, idCard) => {
  if (active == 1) {
    result.innerHTML = "";
    if (!nFlip) {
      cardFlip1 = {
        idCardContainer: document.getElementById(idCardContainer),
        idCard: idCard,
      };
      cardFlip1Front = document.getElementById(idCardContainer + "front");
      cardFlip1Front.style.display = "block";
      cardFlip1Back = document.getElementById(idCardContainer + "back");
      cardFlip1Back.style.display = "none";
      nFlip = true;
    } else {
      cardFlip2 = {
        idCardContainer: document.getElementById(idCardContainer),
        idCard: idCard,
      };
      cardFlip2Front = document.getElementById(idCardContainer + "front");
      cardFlip2Front.style.display = "block";
      cardFlip2Back = document.getElementById(idCardContainer + "back");
      cardFlip2Back.style.display = "none";

      if (cardFlip1.idCard != cardFlip2.idCard) {
        failures++;
        active = 2;
        result.innerHTML = `No son iguales`;
        setTimeout(() => {
          cardFlip1Front.style.display = "none";
          cardFlip1Back.style.display = "block";
          cardFlip2Front.style.display = "none";
          cardFlip2Back.style.display = "block";

          cardFlip1Front = null;
          cardFlip2Front = null;
          cardFlip1Back = null;
          cardFlip2Back = null;

          cardFlip1 = {};
          cardFlip2 = {};
          nFlip = false;
          active = 1;
        }, 600);
      } else {
        success++;
        result.innerHTML = `Son iguales`;
        cardFlip1Front = null;
        cardFlip2Front = null;
        cardFlip1Back = null;
        cardFlip2Back = null;

        cardFlip1 = {};
        cardFlip2 = {};
        nFlip = false;
        active = 1;
      }
    }
    renderData();
  }
};

let renderData = () => {
  document.getElementById("data").innerHTML = `

            <p>Errores: ${failures}</p>
            <p>Aciertos: ${success}</p>`;
};

function init() {
  document.querySelector(".start").addEventListener("click", cronometrar);
  document.querySelector(".stop").addEventListener("click", parar);
  document.querySelector(".reiniciar").addEventListener("click", reiniciar);
  h = 0;
  m = 0;
  s = 0;
  document.getElementById("hms").innerHTML = "00:00:00";
}
function cronometrar() {
  id = setInterval(escribir, 1000);
  document.querySelector(".start").removeEventListener("click", cronometrar);
}
function escribir() {
  var hAux, mAux, sAux;
  s++;
  if (s > 59) {
    m++;
    s = 0;
  }
  if (m > 59) {
    h++;
    m = 0;
  }
  if (h > 24) {
    h = 0;
  }

  if (s < 10) {
    sAux = "0" + s;
  } else {
    sAux = s;
  }
  if (m < 10) {
    mAux = "0" + m;
  } else {
    mAux = m;
  }
  if (h < 10) {
    hAux = "0" + h;
  } else {
    hAux = h;
  }

  document.getElementById("hms").innerHTML = hAux + ":" + mAux + ":" + sAux;
}
function parar() {
  clearInterval(id);
  document.querySelector(".start").addEventListener("click", cronometrar);
}
function reiniciar() {
  getApiCards();
  failures = 0;
  success = 0;
  renderData();
  clearInterval(id);
  document.getElementById("hms").innerHTML = "00:00:00";
  h = 0;
  m = 0;
  s = 0;
  document.querySelector(".start").addEventListener("click", cronometrar);
}
getApiCards();
