document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('project-list');
    const username = 'Mariochiappini1996'; // sostituisci con il tuo nome utente GitHub

    async function fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
            if (!response.ok) throw new Error('Errore nella richiesta API');
            const repos = await response.json();

            // Filtra solo i progetti con descrizione
            const filteredRepos = repos.filter(repo => repo.description);

            container.innerHTML = ''; // pulisce il contenuto esistente

            filteredRepos.forEach(repo => {
                const div = document.createElement('div');
                div.className = 'project';
                div.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description}</p>
                    <p><em>Linguaggio principale: ${repo.language || 'N/A'}</em></p>
                `;
                container.appendChild(div);
            });

            if (filteredRepos.length === 0) {
                container.innerHTML = '<p>Nessun progetto trovato sul profilo GitHub.</p>';
            }

        } catch (error) {
            container.innerHTML = `<p class="error">Impossibile connettersi a GitHub. (${error.message})</p>`;
        }
    }

    // Progetti locali statici come fallback
    const localProjects = [
        { title: "Pokémon Web Scraper", desc: "Raccoglie dati Pokémon con Python.", tech: "Scrapy, JSON, Python" },
        { title: "Database Dispense Universitario", desc: "Vault Universitario", tech: "Vault" }
    ];

    async function loadProjects() {
        if (navigator.onLine) {
            await fetchGitHubRepos();
        } else {
            container.innerHTML = '';
            localProjects.forEach(proj => {
                const div = document.createElement('div');
                div.className = 'project';
                div.innerHTML = `<h3>${proj.title}</h3><p>${proj.desc}</p><em>${proj.tech}</em>`;
                container.appendChild(div);
            });
        }
    }

    loadProjects();
});
