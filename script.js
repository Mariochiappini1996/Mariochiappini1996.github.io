document.addEventListener('DOMContentLoaded', () => { 
    
    // --- 1. SMOOTH PAGE TRANSITIONS ---
    const pageWrapper = document.querySelector('.page-wrapper');
    // Select all internal links that don't open in a new tab
    const navLinks = document.querySelectorAll('a:not([target="_blank"])');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            // Ensure it's a valid, non-anchor link before animating
            if (href && (href.startsWith('/') || href.includes('.html'))) {
                e.preventDefault(); // Prevent immediate navigation
                pageWrapper.classList.add('fade-out');
                
                // Navigate after the animation finishes
                setTimeout(() => {
                    window.location.href = href;
                }, 500); // This duration should match the CSS animation
            }
        });
    });

    // --- 2. SCROLL REVEAL ANIMATIONS ---
    const sectionsToFade = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    sectionsToFade.forEach(section => {
        observer.observe(section);
    });

    // --- 3. GITHUB REPO FETCHER (Original functionality) ---
    const grid = document.getElementById('repos-grid');
    // Only run this code if we are on the index page (where the grid exists)
    if (grid) {
        const username = 'Mariochiappini1996';
        const selectedRepos = [
            'Vault_University-LM',
            'Vault_University-LT',
            'Scrapy_Pokedex-Project',
            'Laboratorio-Data-Mining',
            'Progetto-Ingegneria-del-Software',
            'ChatAppPro---Progetto-Tesi-di-Laurea'
        ];
        const apiUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Errore di rete o utente non trovato.');
                return response.json();
            })
            .then(data => {
                const filtered = data.filter(repo => selectedRepos.includes(repo.name));

                if (filtered.length === 0) {
                    grid.innerHTML = `<p style="color: #ff6b6b;">Nessuna delle repository selezionate è stata trovata.</p>`;
                    return;
                }
                
                filtered.forEach(repo => {
                    const card = document.createElement('div');
                    card.classList.add('repo-card');

                    const description = repo.description || 'Nessuna descrizione disponibile.';
                    const shortDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

                    card.innerHTML = `
                        <div class="card-inner">
                            <div class="card-front">
                                <h3>${repo.name}</h3>
                                <p>${shortDescription}</p>
                            </div>
                            <div class="card-back">
                                <p>${description}</p>
                                <a href="${repo.html_url}" class="repo-link back-link" target="_blank">Vai al Repo</a>
                            </div>
                        </div>
                    `;
                    grid.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Errore nel caricamento dei repository:', error);
                grid.innerHTML = `<p style="color: #ff6b6b;">Impossibile caricare i progetti da GitHub.</p>`;
            });

        // --- 4. 3D DYNAMIC CARD EFFECTS ---
        // Flip effect on click
        grid.addEventListener('click', (event) => {
            const card = event.target.closest('.repo-card');
            if (card && !event.target.matches('a, a *')) {
                card.classList.toggle('flipped');
                // Reset tilt transform when card is flipped to avoid conflict
                card.style.transform = ''; 
            }
        });

        // 3D Tilt effect on mouse move
        grid.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.repo-card');
            // Only apply tilt if the card exists and is not flipped
            if (card && !card.classList.contains('flipped')) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const { width, height } = rect;
                
                const rotateX = (y / height - 0.5) * -30; // Max rotation of 15 degrees
                const rotateY = (x / width - 0.5) * 30;  // Max rotation of 15 degrees

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        // Reset card state when mouse leaves the grid area
        grid.addEventListener('mouseleave', () => {
            const cards = grid.querySelectorAll('.repo-card');
            cards.forEach(card => {
                card.style.transform = ''; // Reset tilt
            });
        });
    }
});