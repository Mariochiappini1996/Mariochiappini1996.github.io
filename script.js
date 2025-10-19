document.addEventListener('DOMContentLoaded', () => { 
    const username = 'Mariochiappini1996';
    const selectedRepos = [
        'Vault_University-LM',
        'Vault_University-LT',
        'Scrapy_Pokedex-Project',
        'Laboratorio-Data-Mining',
        'Progetto-Ingegneria-del-Software',
        'ChatAppPro---Progetto-Tesi-di-Laurea'
    ];

    const grid = document.getElementById('repos-grid');
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore di rete o utente non trovato.');
            }
            return response.json();
        })
        .then(data => {
            const filtered = data.filter(repo => selectedRepos.includes(repo.name));

            filtered.forEach(repo => {
                const card = document.createElement('div');
                card.classList.add('repo-card');

                const description = repo.description || 'Nessuna descrizione disponibile.';

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">
                            <h3>${repo.name}</h3>
                            <p>${description.substring(0, 100)}...</p>
                        </div>
                        <div class="card-back">
                            <p>${description}</p>
                            <a href="${repo.html_url}" class="repo-link back-link" target="_blank">Vai al Repo</a>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });

            if (filtered.length === 0) {
                grid.innerHTML = `<p style="color: #ff6b6b;">Nessuna delle repository selezionate è stata trovata.</p>`;
            }
        })
        .catch(error => {
            console.error('Errore nel caricamento dei repository:', error);
            grid.innerHTML = `<p style="color: #ff6b6b;">Impossibile caricare i progetti da GitHub.</p>`;
        });
});
