document.addEventListener('DOMContentLoaded', () => {
    const username = 'Mariochiappini1996'; // <-- INSERISCI QUI IL TUO USERNAME GITHUB
    const grid = document.getElementById('repos-grid');
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore di rete o utente non trovato.');
            }
            return response.json();
        })
        .then(data => {
            // Limita il numero di repository da mostrare, ad esempio i 6 più recenti
            const recentRepos = data.slice(0, 6);

            recentRepos.forEach(repo => {
                const card = document.createElement('div');
                card.classList.add('repo-card');

                // Gestisce descrizioni nulle o vuote
                const description = repo.description || 'Nessuna descrizione disponibile.';

                card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <h3>${repo.name}</h3>
                        <p>${description.substring(0, 100)}...</p> <a href="${repo.html_url}" class="repo-link" target="_blank">Vedi su GitHub</a>
                    </div>
                    <div class="card-back">
                        <p>${description}</p> <a href="${repo.html_url}" class="repo-link back-link" target="_blank">Vai al Repo</a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Errore nel caricamento dei repository:', error);
            grid.innerHTML = `<p style="color: #ff6b6b;">Impossibile caricare i progetti da GitHub. Controlla il tuo username e la connessione.</p>`;
        });
});