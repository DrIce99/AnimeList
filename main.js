const animeContainer = document.getElementById("anime-container");
const searchBar = document.getElementById("searchName");
const searchChar = document.getElementById("searchCharre");

const menuContainer = document.querySelector('.action-menu-container');
const mainBtn = document.querySelector('.main-action-btn');

const editModal = document.getElementById('editModal');
const editableContainer = document.getElementById('editFormContainer');
let animeInModifica = null;
let editSelectedGenres = [];

const addModal = document.getElementById('addModal');

const listaAnime = []

let addOnce = false

const colorPicker = document.getElementById("themeColor");
const saved = localStorage.getItem('selectedContainer') || 'none';
document.querySelector(`input[name="mainContainer"][value="${saved}"]`).checked = true;
document.querySelector(`input[name="mainContainer"][value="${saved}"]`).dispatchEvent(new Event('change'));

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
});

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

listaAnime.forEach((anime, i) => {
  if (anime.id === undefined) anime.id = i; // ID fisso
});

function elaborate(data) {
  // let temp;
  // temp.innerHTML = data.nome;
  // animeContainer.push(temp);

  animeContainer.innerHTML = "";

  data.forEach((anime, i) => {
    

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
        <div class="container-card ${color}" onclick="apriModifica(${anime.id})">
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

// Apri modale
document.getElementById('editAnime').addEventListener('click', () => {
  editModal.style.display = 'flex';
  bloccaScroll();
});

document.getElementById('closeEdit').addEventListener('click', () => {
  editModal.style.display = 'none';
  riabilitaScroll();
});

// Aggiunta anime
let selectedGenresData = [];

const soloNumeri = (e) => {
  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
    e.preventDefault();
  }
};
document.getElementById('add-anno').addEventListener('keydown', soloNumeri);
document.getElementById('add-ep').addEventListener('keydown', soloNumeri);

const ratingInput = document.getElementById('add-rating');
ratingInput.value = "/10";
ratingInput.addEventListener('click', function() {
    this.setSelectionRange(0, 0); // Posiziona il cursore all'inizio al click
});

const studioInput = document.getElementById('add-studio');
const studioList = document.createElement('div');
studioList.classList.add('search-dropdown'); // Usa la classe che avevamo per la ricerca
studioInput.parentNode.appendChild(studioList);

studioInput.addEventListener('input', (e) => {
  const val = e.target.value.toLowerCase();
  studioList.innerHTML = "";
  if (!val) return;

  // Estrae studi univoci dalla listaAnime
  const studiPresenti = [...new Set(listaAnime.map(a => a.studio))];
  const suggerimenti = studiPresenti.filter(s => s.toLowerCase().includes(val)).slice(0, 5);

  suggerimenti.forEach(s => {
    const div = document.createElement('div');
    div.classList.add('search-item');
    div.innerText = s;
    div.onclick = () => {
      studioInput.value = s;
      studioList.innerHTML = "";
    };
    studioList.appendChild(div);
  });
});

document.getElementById('btnSearchImg').addEventListener('click', () => {
  const nome = document.getElementById('add-nome').value;
  if (!nome) return alert("Inserisci prima il nome dell'anime!");
  
  // Apre Google Immagini filtrando per AnimeClick
  const query = encodeURIComponent(`${nome} animeclick`);
  window.open(`https://www.google.com{query}&tbm=isch`, '_blank');
});

document.getElementById('addAnime').addEventListener('click', () => {
  addModal.style.display = 'flex';
  bloccaScroll();
});

document.getElementById('closeAdd').addEventListener('click', () => {
  addModal.style.display = 'none';
  riabilitaScroll();
});

document.getElementById('confirmAdd').addEventListener('click', () => {
  // 1. Raccoglie i dati
  const nuovoAnime = {
    nome: document.getElementById('add-nome').value,
    nome_originale: document.getElementById('add-originale').value,
    copertina: document.getElementById('add-img').value,
    anno_uscita: document.getElementById('add-anno').value,
    episodi: document.getElementById('add-ep').value,
    studio: document.getElementById('add-studio').value,
    rating_personale: document.getElementById('add-rating').value,
    generi: selectedGenresData.map(g => ({ genere: g })), 
    personaggi: []
  };

  if (!nuovoAnime.nome) {
    alert("Inserisci almeno il nome dell'anime!");
    return;
  }

  fetch('http://127.0.0.1:5000/api/anime', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuovoAnime)
  })
  .then(res => {
    if (!res.ok) throw new Error("Errore del server");
    return res.json();
  })
  .then(response => {
    if (response.status === "success") {

      addModal.style.display = 'none';
      riabilitaScroll(); 

      window.location.reload();
    
      alert("Sium! Anime aggiunto correttamente.");
    }
  })
  .catch(err => {
    console.error("Errore durante l'aggiunta:", err);
    alert("C'è stato un problema, ma controlla se l'anime è apparso");
  });
  
});

// Funzione per aggiornare la vista dei Tag
function renderGenreTags() {
  const container = document.getElementById('selectedGenresContainer');
  container.innerHTML = "";
  
  selectedGenresData.forEach(gen => {
    const tag = document.createElement('div');
    tag.className = 'genre-tag';
    tag.innerHTML = `
      ${gen} 
      <span class="remove-btn" onclick="removeGenreTag('${gen}')">&times;</span>
    `;
    container.appendChild(tag);
  });
}

// Funzione per rimuovere un genere
window.removeGenreTag = function(gen) {
  selectedGenresData = selectedGenresData.filter(item => item !== gen);
  renderGenreTags();
};

// Funzione per aggiungere un genere
window.addGenreTag = function(gen) {
  if (!selectedGenresData.includes(gen)) {
    selectedGenresData.push(gen);
    renderGenreTags();
  }
};

// Popola la lista dei generi disponibili (usa l'array genreList che hai già)
function initGenreSelector() {
  const availableList = document.getElementById('availableGenresList');
  availableList.innerHTML = "";
  
  genreList.sort().forEach(gen => {
    const item = document.createElement('div');
    item.className = 'search-item';
    item.innerText = gen;
    item.onclick = () => addGenreTag(gen);
    availableList.appendChild(item);
  });
}

// Inizializza al caricamento della modale "Aggiungi"
document.getElementById('addAnime').addEventListener('click', () => {
  selectedGenresData = []; // Reset
  renderGenreTags();
  initGenreSelector();
  addModal.style.display = 'flex';
});

// Modifica nella funzione di salvataggio (confirmAdd)
// Cambia la parte dei generi così:
const nuovoAnime = {
  // ... altri campi ...
  generi: selectedGenresData.map(g => ({ genere: g })), // Adattato al tuo formato JSON
  personaggi: []
};

function bloccaScroll() {
  document.body.style.overflow = 'hidden';
}

function riabilitaScroll() {
  document.body.style.overflow = 'auto';
}

window.apriModifica = function(index) {

  const anime = listaAnime[index];
  if (!anime){
    return;
  } 

  animeInModifica = index;

  document.getElementById("editModal").style.display = "flex";

  document.getElementById("edit-nome").value = anime.nome || "";
  document.getElementById("edit-originale").value = anime.nome_originale || "";
  document.getElementById("edit-img").value = anime.copertina || "";
  document.getElementById("edit-anno").value = anime.anno_uscita || "";
  document.getElementById("edit-ep").value = anime.episodi || "";
  document.getElementById("edit-studio").value = anime.studio || "";
  document.getElementById("edit-rating").value = anime.rating_personale || "";

  editSelectedGenres = (anime.generi || []).map(g => g.genere);

  renderEditGenreTags();
}

function renderEditGenreTags() {

  const container = document.getElementById("editSelectedGenresContainer");
  container.innerHTML = "";

  editSelectedGenres.forEach(gen => {

    const tag = document.createElement("div");
    tag.className = "genre-tag";

    tag.innerHTML = `
      ${gen}
      <span class="remove-btn">&times;</span>
    `;

    tag.querySelector(".remove-btn").onclick = () => {
      editSelectedGenres = editSelectedGenres.filter(g => g !== gen);
      renderEditGenreTags();
    };

    container.appendChild(tag);

  });

}

document.getElementById("confirmUpdate").addEventListener("click", async () => {

  if (animeInModifica === null) {
    alert("Seleziona prima un anime");
    return;
  }

  const animeAggiornato = {

    nome: document.getElementById("edit-nome").value,
    nome_originale: document.getElementById("edit-originale").value,
    copertina: document.getElementById("edit-img").value,
    anno_uscita: document.getElementById("edit-anno").value,
    episodi: document.getElementById("edit-ep").value,
    studio: document.getElementById("edit-studio").value,
    rating_personale: document.getElementById("edit-rating").value,

    generi: editSelectedGenres.map(g => ({ genere: g })),

    personaggi: listaAnime[animeInModifica].personaggi || []

  };

  try {

    const res = await fetch(
      `http://127.0.0.1:5000/api/anime/${animeInModifica}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(animeAggiornato)
      }
    );

    const data = await res.json();

    if (data.status === "success") {

      listaAnime[animeInModifica] = animeAggiornato;

      elaborate(listaAnime);

      document.getElementById("editModal").style.display = "none";

      alert("Modifica salvata!");

    } else {

      alert("Errore: " + data.message);

    }

  } catch (err) {

    console.error(err);
    alert("Errore nel server");

  }

});

function loadSettings() {

  const savedColor = localStorage.getItem("themeColor");
  const bgEnabled = localStorage.getItem("animatedBg");

  if (savedColor) {
    document.documentElement.style.setProperty("--theme-color", savedColor);
    colorPicker.value = savedColor;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[name="mainContainer"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const value = e.target.value;
      const main = document.querySelector('.main-content');
      if (!main) return;

      main.classList.remove('container', 'container2');

      if (value === '1') {
        main.classList.remove('no-animated-bg');
        main.classList.add('container');
      } 
      if (value === '2') {
        main.classList.remove('no-animated-bg');
        main.classList.add('container2');
      }
      if (value === 'none') main.classList.add('no-animated-bg');

      localStorage.setItem('selectedContainer', value);
    });
  });

  // ripristina container salvato
  const saved = localStorage.getItem('selectedContainer') || 'none';
  const savedRadio = document.querySelector(`input[name="mainContainer"][value="${saved}"]`);
  if (savedRadio) savedRadio.checked = true;
  if (savedRadio) savedRadio.dispatchEvent(new Event('change'));
});
colorPicker.addEventListener("input", () => {

  const color = colorPicker.value;

  document.documentElement.style.setProperty("--theme-color", color);
  localStorage.setItem("themeColor", color);

});

loadSettings();