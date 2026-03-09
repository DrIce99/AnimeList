const animeContainer = document.getElementById("anime-container");
const searchBar = document.getElementById("searchName");
const searchChar = document.getElementById("searchCharre");

const menuContainer = document.querySelector('.action-menu-container');
const mainBtn = document.querySelector('.main-action-btn');

const editModal = document.getElementById('editModal');
const modalSearch = document.getElementById('modalSearch');
const modalResults = document.getElementById('modalSearchResults');
const editableContainer = document.getElementById('editableCardContainer');
let animeInModifica = null;

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

fetch('http://127.0.0.1:5000/api/anime')
  .then((res) => res.json())
  .then((data) => {
    // 1. SVUOTA L'ARRAY GLOBALE (Fondamentale!)
    listaAnime.length = 0; 

    // 2. POPOLA L'ARRAY CON I NUOVI DATI
    data.forEach((anime, index) => {
      // Usiamo l'indice originale del JSON come ID per Flask
      anime.id = index; 
      listaAnime.push(anime);
    });

    // 3. DISEGNA LA DASHBOARD
    elaborate(listaAnime);
    updateAnimeCount(listaAnime.length);
  })
  .catch(err => console.error("Errore fetch:", err));

function elaborate(data) {
  // let temp;
  // temp.innerHTML = data.nome;
  // animeContainer.push(temp);

  animeContainer.innerHTML = "";

  data.forEach((anime, i) => {
    if (anime.id === undefined) {
      anime.id = i;
    }

    let color;
    let imgcolor;
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
      case "Azione": color = "bg-green-box"; imgcolor = "bgimg-green-box"; break;
      case "Sci-Fi": color = "bg-blue-box"; imgcolor = "bgimg-blue-box"; break;
      case "Ecchi":
      case "Harem": color = "bg-pink-box"; imgcolor = "bgimg-pink-box"; break;
      case "Avventura": color = "bg-brown-box"; imgcolor = "bgimg-brown-box"; break;
      case "Scolastico": color = "bg-red-box"; imgcolor = "bgimg-red-box"; break;
      case "Horror":
      case "Mistero": color = "bg-white-box"; imgcolor = "bgimg-white-box"; break;
      case "Storico":
      case "Guerra":
      case "Militari": color = "bg-yellow-box"; imgcolor = "bgimg-yellow-box"; break;
      case "Romantico":
      case "Sentimentale": color = "bg-purple-box"; imgcolor = "bgimg-purple-box"; break;
      case "Sport": color = "bg-light-blue-box"; imgcolor = "bgimg-light-blue-box"; break;
      default: color = "bg-gray-box"; imgcolor = "bgimg-gray-box";
    }
    anime.id = i;
    console.log(data['id'])
    let temp = document.createElement("div");
    let genre = `<div class="card-description">`;
    anime.generi.forEach((genere, j) => {
      genre += genere.genere
      if (j < (anime.generi.length - 1)) {
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
}

// ricerca
// searchBar.addEventListener("keyup", (e) => {
//   const input = normalizeText(e.target.value.toLowerCase());

//   const generi = listaAnime.filter(data => {
//     const matchNome = data.nome.toLowerCase().includes(input);
//     const matchOriginale = data.nome_originale.toLowerCase().includes(input);
//     return matchNome || matchOriginale;
//   });

//   console.log(generi.length);
//   animeContainer.innerHTML = "";
//   elaborate(generi);
//   updateAnimeCount(generi.length);
// });

// searchChar.addEventListener("keyup", (e) => {
//   const input = e.target.value.toLowerCase();

//   const characters = listaAnime.filter(data => {
//     return data.personaggi.some(gen => 
//       gen.character.toLowerCase().startsWith(input)
//     );
//   });

//   console.log(characters.length);
//   animeContainer.innerHTML = "";
//   elaborate(characters);
//   updateAnimeCount(characters.length);
// });

function applyFilters() {
  const nameInput = normalizeText(searchBar.value);
  const charInput = searchChar.value.toLowerCase();
  const selectedGenres = Array.from(document.querySelectorAll(".genre-checkbox:checked"))
    .map(cb => cb.value.toLowerCase());

  const filtrati = listaAnime.filter(anime => {
    // 1. Filtro Nome
    const matchNome = normalizeText(anime.nome).includes(nameInput) ||
      normalizeText(anime.nome_originale).includes(nameInput);

    // 2. Filtro Personaggi
    const matchChar = charInput === "" || anime.personaggi.some(c =>
      c.character.toLowerCase().includes(charInput)
    );

    // 3. Filtro Generi (AND logic: deve averli tutti)
    const animeGenres = anime.generi.map(g => g.genere.toLowerCase());
    const matchGenres = selectedGenres.every(gen => animeGenres.includes(gen));

    return matchNome && matchChar && matchGenres;
  });

  animeContainer.innerHTML = "";
  elaborate(filtrati);
  updateAnimeCount(filtrati.length);
}

// Collega tutto alla stessa funzione
searchBar.addEventListener("keyup", applyFilters);
searchChar.addEventListener("keyup", applyFilters);
// Per le checkbox, usa l'evento change nella delega o nel loop


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

genreList.sort();

let lastLetter = "";
genreList.forEach(gen => {
  const currentLetter = gen.charAt(0).toUpperCase();

  // Se la lettera cambia, aggiungi uno spazio maggiore o un separatore
  if (currentLetter !== lastLetter) {
    const spacer = document.createElement("div");
    spacer.style.gridColumn = "1 / -1"; // Occupa tutta la riga
    spacer.style.marginTop = "15px";
    spacer.style.borderBottom = "1px solid #333";
    spacer.style.color = "#555";
    spacer.innerText = currentLetter;
    genreListDiv.appendChild(spacer);
    lastLetter = currentLetter;
  }

  const label = document.createElement("label");
  label.classList.add("genre-label");

  // Recupera la classe colore
  let colorClass = getColorClass(gen);

  label.innerHTML = `
    <input type="checkbox" value="${gen}" class="genre-checkbox hidden-checkbox"> 
    <span class="custom-checkbox ${colorClass}">${gen}</span>
  `;
  genreListDiv.appendChild(label);
});

function getColorClass(gen) {
  switch (gen) {
    case "Azione":
      return "bg-green-box";
    case "Avventura":
      return "bg-brown-box";
    case "Commedia":
      return "bg-gray-box";
    case "Ecchi":
    case "Harem":
      return "bg-pink-box";
    case "Horror":
    case "Mistero":
      return "bg-white-box";
    case "Militari":
    case "Storico":
      return "bg-yellow-box";
    case "Romantico":
    case "Sentimentale":
      return "bg-purple-box";
    case "Sci-Fi":
      return "bg-blue-box";
    case "Scolastico":
      return "bg-red-box";
    case "Sport":
      return "bg-light-blue-box";
    default:
      return "bg-gray-box";
  };
}
// label.innerHTML = `
//   <input type="checkbox" value="${gen}" class="genre-checkbox hidden-checkbox ${colorClass}"> 
//   <span class="custom-checkbox ${colorClass}">${gen}</span>
// `;


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

mainBtn.addEventListener('click', () => {
  menuContainer.classList.toggle('open');
  mainBtn.classList.toggle('active');
});

// Esempio per l'eliminazione (usando l'ID dinamico)
document.getElementById("deleteAnime").addEventListener("click", () => {
  const idDaCercare = prompt("Inserisci l'ID dell'anime da eliminare (es: anime-42):");
  // Logica per filtrare listaAnime e ricaricare la vista
});

// Apri modale
document.getElementById('editAnime').addEventListener('click', () => {
  editModal.style.display = 'flex';
});

// Chiudi modale
document.querySelector('.close-modal').addEventListener('click', () => {
  editModal.style.display = 'none';
});

// Ricerca dinamica nella modale
modalSearch.addEventListener('keyup', (e) => {
  const term = e.target.value.toLowerCase();
  if (term.length < 2) { modalResults.innerHTML = ""; return; }

  const matches = listaAnime.filter(a => a.nome.toLowerCase().includes(term)).slice(0, 5);
  modalResults.innerHTML = matches.map(a => `<div class="search-item" onclick="caricaAnimeInModale(${a.id})">${a.nome}</div>`).join('');
});

// Funzione globale per caricare i dati (chiamata dal click sui risultati)
window.caricaAnimeInModale = function (id) {
  const anime = listaAnime.find(a => a.id === id);
  animeInModifica = anime;
  modalResults.innerHTML = "";
  modalSearch.value = anime.nome;

  // Generiamo la card con INPUT al posto dei testi
  editableContainer.innerHTML = `
    <div class="container-card" style="border: 1px solid #ff5fcb; padding: 20px; border-radius: 20px;">
      <label>Titolo:</label>
      <input type="text" class="edit-input" id="edit-nome" value="${anime.nome}">
      
      <label>Copertina (URL):</label>
      <input type="text" class="edit-input" id="edit-img" value="${anime.copertina}">
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label>Anno:</label>
          <input type="text" class="edit-input" id="edit-anno" value="${anime.anno_uscita}">
        </div>
        <div>
          <label>Episodi:</label>
          <input type="text" class="edit-input" id="edit-ep" value="${anime.episodi}">
        </div>
      </div>

      <label>Studio:</label>
      <input type="text" class="edit-input" id="edit-studio" value="${anime.studio}">

      <label>Rating (x/10):</label>
      <input type="text" class="edit-input" id="edit-rating" value="${anime.rating_personale}">
    </div>
  `;
};

// Salvataggio temporaneo in memoria
document.getElementById('saveAnimeChanges').addEventListener('click', () => {
  if (!animeInModifica) return;

  const updatedData = {
    ...animeInModifica,
    nome: document.getElementById('edit-nome').value,
    copertina: document.getElementById('edit-img').value,
    anno_uscita: document.getElementById('edit-anno').value,
    episodi: document.getElementById('edit-ep').value,
    studio: document.getElementById('edit-studio').value,
    rating_personale: document.getElementById('edit-rating').value
  };

  // Invia al backend via PUT
  fetch(`http://127.0.0.1{animeInModifica.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        alert("JSON aggiornato correttamente sul server!");
        location.reload(); // Ricarica per vedere le modifiche
      }
    });
});

// Download del file JSON finale
document.getElementById('downloadJson').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaAnime, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "anime_aggiornato.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});