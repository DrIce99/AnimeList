const animeContainer = document.getElementById("anime-container");
const searchBar = document.getElementById("searchName");
const searchChar = document.getElementById("searchCharre");

const listaAnime = []

let addOnce = false

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/ō/g, "ou")  // o lunga
    .replace(/ū/g, "uu")  // u lunga (opzionale, se vuoi gestire anche questa)
    .replace(/ā/g, "aa")  // a lunga
    .replace(/ī/g, "ii")  // i lunga
    .replace(/ē/g, "ee"); // e lunga
}

fetch('./anime.json')
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    elaborate(data);
    updateAnimeCount(data.length);
  });

function elaborate(data) {
  // let temp;
  // temp.innerHTML = data.nome;
  // animeContainer.push(temp);

  data.forEach((anime, i) => {
    if (!addOnce) {
      listaAnime.push(anime)
    }
    
    let color;
    let imgcolor;
    // for (let i = 0; i < anime.generi.length; i++) {
    //   if (anime.generi[i].genere == "Azione") {
    //     color = "bg-green-box";
    //     imgcolor = "bgimg-green-box";
    //     break;
    //   } else if (anime.generi[i].genere == "Sci-Fi") {
    //     color = "bg-blue-box";
    //     imgcolor = "bgimg-blue-box";
    //     break;
    //   } else if (anime.generi[i].genere == "Ecchi" || anime.generi[i].genere == "Harem") {
    //     color = "bg-pink-box";
    //     imgcolor = "bgimg-pink-box";
    //     break;
    //   } else if (anime.generi[i].genere == "Avventura") {
    //     color = "bg-brown-box";
    //     imgcolor = "bgimg-brown-box";
    //     break;
    //   } else if (anime.generi[i].genere == "Scolastico") {
    //     color = "bg-red-box";
    //     imgcolor = "bgimg-red-box";
    //     break;
    //   } else if (anime.generi[i].genere == "Horror" || anime.generi[i].genere == "Mistero") {
    //     color = "bg-white-box";
    //     imgcolor = "bgimg-white-box";
    //     break;
    //   } else if (anime.generi[i].genere == "Storico" || anime.generi[i].genere == "Guerra" || anime.generi[i].genere == "Militari") {
    //     color = "bg-yellow-box";
    //     imgcolor = "bgimg-yellow-box";
    //     break;
    //   } else if (anime.generi[i].genere == "Romantico" || anime.generi[i].genere == "Sentimentale") {
    //     color = "bg-purple-box";
    //     imgcolor = "bgimg-purple-box";
    //     break;
    //   } else {
    //     color = "bg-gray-box";
    //     imgcolor = "bgimg-gray-box";
    //   }
    // }
    let highestPriority = -1;
    let selectedGenre = "";

    anime.generi.forEach(g => {
      const genreName = g.genere;
      const priority = genrePriority[genreName] ?? -1;
      if (priority > highestPriority) {
        highestPriority = priority;
        selectedGenre = genreName;
      }
    });

    // Ora assegna il colore in base al selectedGenre
    switch (selectedGenre) {
      case "Azione":
        color = "bg-green-box";
        imgcolor = "bgimg-green-box";
        break;
      case "Sci-Fi":
        color = "bg-blue-box";
        imgcolor = "bgimg-blue-box";
        break;
      case "Ecchi":
      case "Harem":
        color = "bg-pink-box";
        imgcolor = "bgimg-pink-box";
        break;
      case "Avventura":
        color = "bg-brown-box";
        imgcolor = "bgimg-brown-box";
        break;
      case "Scolastico":
        color = "bg-red-box";
        imgcolor = "bgimg-red-box";
        break;
      case "Horror":
      case "Mistero":
        color = "bg-white-box";
        imgcolor = "bgimg-white-box";
        break;
      case "Storico":
      case "Guerra":
      case "Militari":
        color = "bg-yellow-box";
        imgcolor = "bgimg-yellow-box";
        break;
      case "Romantico":
      case "Sentimentale":
        color = "bg-purple-box";
        imgcolor = "bgimg-purple-box";
        break;
      case "Sport":
        color = "bg-light-blue-box";
        imgcolor = "bgimg-light-blue-box";
        break;
      default:
        color = "bg-gray-box";
        imgcolor = "bgimg-gray-box";
    }
    data['id'] = i;
    console.log(data['id'])
    let temp = document.createElement("div");
    let genre = `<div class="card-description">`;
    anime.generi.forEach((genere, j) => {
      genre += genere.genere
      if (j < (anime.generi.length - 1)){
        genre += ", "
      } 
    });
    genre += `</div>`;
    const rating = anime.rating_personale.split("/")[0];
    // console.log(genre);
      temp.innerHTML = 
      `<div class="card" id="${i}">
        <div class="image invisible"><button class="draw ${imgcolor}"><img src="${anime.copertina}"></button>
          <div class="character-list-wrapper invisible">
            <div class="character-list-border ${color}">
                <h4>Personaggi</h4>
                <ul>
                  ${anime.personaggi.map(char => `<li>${char.character}</li>`).join('')}
                </ul>
            </div>
          </div>
        </div>
        <div class="container-card ${color}">
          <div class="card-title">${anime.nome}</div>
          <div class="card-description subtitle">${anime.nome_originale}</div>
          <div class="card-description invisible" style="text-align: right">Anno: ${anime.anno_uscita}</div>
          <div class="card-description switch" style="text-align: right">${anime.anno_uscita}</div>
          <div class="card-description invisible">Generi: ${genre}</div>
          <div class="card-description switch">${genre}</div>
          <div class="card-description invisible" >Episodi: ${anime.episodi}</div>
          <div class="card-description invisible" >Studio: ${anime.studio}</div>
          <div class="card-description double switch">
            <div class="card-description">${anime.studio}</div>
            <div class="card-description">${anime.episodi}</div>
          </div>
          <div class="card-description" style="text-align: right">${rating}/10</div>
        </div>
      </div>
      <br />`;
    animeContainer.appendChild(temp);
  });
  addOnce = true
}

// ricerca
searchBar.addEventListener("keyup", (e) => {
  const input = normalizeText(e.target.value.toLowerCase());

  const generi = listaAnime.filter(data => {
    const matchNome = data.nome.toLowerCase().includes(input);
    const matchOriginale = data.nome_originale.toLowerCase().includes(input);
    return matchNome || matchOriginale;
  });

  console.log(generi.length);
  animeContainer.innerHTML = "";
  elaborate(generi);
  updateAnimeCount(generi.length);
});

searchChar.addEventListener("keyup", (e) => {
  const input = e.target.value.toLowerCase();

  const characters = listaAnime.filter(data => {
    return data.personaggi.some(gen => 
      gen.character.toLowerCase().startsWith(input)
    );
  });

  console.log(characters.length);
  animeContainer.innerHTML = "";
  elaborate(characters);
  updateAnimeCount(characters.length);
});

/////////////////////////////////////////////////////////////////////////////////

let genrePriority = {
  "Azione": 1,
  "Avventura": 1,
  "Commedia": 0,
  "Combattimento": 0,
  "Drammatico": 1,
  "Ecchi": 3,
  "Fantasy": 0,
  "Gioco": 0,
  "Harem": 3,
  "Horror": 3,
  "Magia": 0,
  "Militari": 3,
  "Mistero": 3,
  "Psicologico": 2,
  "Romantico": 3,
  "Scolastico": 3,
  "Sentimentale": 3,
  "Soprannaturale": 0,
  "Sci-Fi": 2,
  "Shounen": 0,
  "Shoujo": 0,
  "Seinen": 0,
  "Slice of Life": 1,
  "Sport": 2,
  "Storico": 3,
  "Superpoteri": 0,
  "Thriller": 3
};

let genreList = [
  "Azione",
  "Avventura",
  "Commedia",
  "Combattimento",
  "Drammatico",
  "Ecchi",
  "Fantasy",
  "Gioco",
  "Harem",
  "Horror",
  "Magia",
  "Militari",
  "Mistero",
  "Psicologico",
  "Romantico",
  "Scolastico",
  "Sentimentale",
  "Soprannaturale",
  "Sci-Fi",
  "Shounen",
  "Shoujo",
  "Seinen",
  "Slice of Life",
  "Sport",
  "Storico",
  "Superpoteri",
  "Thriller"
];

const genreListDiv = document.getElementById("genreList");

genreList.forEach(gen => {
  const label = document.createElement("label");
  label.classList.add("genre-label");
  let colorClass = "";
  switch (gen) {
    case "Azione":
      colorClass = "bg-green-box";
      break;
    case "Avventura":
      colorClass = "bg-brown-box";
      break;
    case "Commedia":
      colorClass = "bg-gray-box";
      break;
    case "Ecchi":
    case "Harem":
      colorClass = "bg-pink-box";
      break;
    case "Horror":
    case "Mistero":
      colorClass = "bg-white-box";
      break;
    case "Militari":
    case "Storico":
      colorClass = "bg-yellow-box";
      break;
    case "Romantico":
    case "Sentimentale":
      colorClass = "bg-purple-box";
      break;
    case "Sci-Fi":
      colorClass = "bg-blue-box";
      break;
    case "Scolastico":
      colorClass = "bg-red-box";
      break;
    case "Sport":
      colorClass = "bg-light-blue-box";
      break;
    default:
      colorClass = "bg-gray-box";
  };
  label.innerHTML = `
    <input type="checkbox" value="${gen}" class="genre-checkbox hidden-checkbox ${colorClass}"> 
    <span class="custom-checkbox ${colorClass}">${gen}</span>
  `;
  genreListDiv.appendChild(label);
  genreListDiv.appendChild(document.createElement("br"));
});

function filterBySelectedGenres() {
  const selectedGenres = Array.from(document.querySelectorAll(".genre-checkbox:checked"))
                              .map(cb => cb.value.toLowerCase());

  const filtrati = listaAnime.filter(anime => {
    const animeGenres = anime.generi.map(g => g.genere.toLowerCase());
    return selectedGenres.every(gen => animeGenres.includes(gen)); // tutti i generi selezionati
    // Se vuoi che basti almeno uno, usa .some() invece di .every()
  });

  animeContainer.innerHTML = "";
  elaborate(filtrati);
  updateAnimeCount(filtrati.length);
}

// Event listener per ogni checkbox
document.querySelectorAll(".genre-checkbox").forEach(cb => {
  cb.addEventListener("change", filterBySelectedGenres);
});

function updateAnimeCount(filteredCount) {
  const countBox = document.getElementById("anime-count");
  countBox.textContent = `${filteredCount}/${listaAnime.length}`;
}