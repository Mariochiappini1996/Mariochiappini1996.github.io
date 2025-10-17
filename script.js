document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('project-list');
    const username = 'Mariochiappini1996'; // Sostituisci con il tuo username GitHub

    async function fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
            if (!response.ok) throw new Error('Errore nella richiesta API');
            const repos = await response.json();

            const filteredRepos = repos.filter(repo => repo.description);

            container.innerHTML = '';

            filteredRepos.forEach(repo => {
                const div = document.createElement('div');
                div.className = 'project';
                div.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
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

    fetchGitHubRepos();
});
