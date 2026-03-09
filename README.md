# 🏯 Le Siummate del Disgraz

Le Siummate del Disgraz è una dashboard interattiva e futuristica per la gestione e la consultazione di un database personale di anime. L'applicazione vanta un'estetica retro-futuristica con effetti neon, animazioni dinamiche e un potente sistema di filtraggio.

## Caratteristiche Principali

* Visualizzazione Dinamica: Oltre 300 titoli caricati istantaneamente con card animate, effetti skew e gradienti cromatici basati sui generi.
* Sistema di Ricerca Avanzato:
* Filtro per titolo (anche originale/giapponese) con normalizzazione dei caratteri.
   * Ricerca specifica per nomi dei personaggi.
   * Filtro multi-genere con logica "AND" e raggruppamento alfabetico nella sidebar.
* Hover Effetti "Pro": Passando il mouse sulle card, appaiono la lista dei personaggi, lo studio di animazione e i dettagli tecnici.
* Action Menu: Un pulsante fluttuante in stile "Cyberpunk" che permette di:
    * Aggiungere nuovi anime.
    * Modificare i dati esistenti tramite una finestra modale centrale.
    * Eliminare titoli dal database.
* Backend Integrato: Gestione persistente dei dati tramite un server Python Flask che sovrascrive direttamente il file anime.json.

<br>

## Tech Stack

* Frontend: HTML5, CSS3 (Custom Gradients & Animations), JavaScript (ES6+).
* Build Tool: Vite per uno sviluppo rapido.
* Backend: Flask (Python) con estensione Flask-CORS.
* Database: JSON file statico per una gestione portatile e veloce.

<br>

## Guida all'Avvio (Cheat Sheet per il Disgraz)
Per far funzionare l'app, devi avere due terminali aperti contemporaneamente.
1. Avvia il Backend (Database & API)

    Apri il primo terminale nella cartella del progetto:

        # Se è la prima volta, installa le dipendenze:
        pip install flask flask-cors

        # Avvia il server:
        python app.py

    Il server sarà attivo su: http://127.0.0.1:5000
2. Avvia il Frontend (Interfaccia)
    
    Apri un secondo terminale nella cartella del progetto:

        # Se non l'hai fatto, installa i moduli:
        npm install
        # Avvia Vite:
        npm run dev

    Vite ti darà un link (solitamente http://localhost:5173). Cliccaci sopra e goditi le Siummate!

<br>

##  Struttura del Progetto

* index.html: Struttura della pagina e della sidebar.
* main.js: Logica di filtraggio, fetch API e gestione modale.
* style.css: Il "cuore" grafico (neon, scrollbar futuristiche, grid layout).
* app.py: Server Flask per le operazioni CRUD sul JSON.
* anime.json: Il tuo prezioso database di anime.

<br>

Siumma con responsabilità! ⚡
------------------------------