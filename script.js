document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // GitHub repositories fetching
    async function fetchGitHubRepos() {
        const projectsGrid = document.getElementById('projects-grid');
        
        try {
            const response = await fetch('https://api.github.com/users/secgit/repos?sort=updated&per_page=6');
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            
            if (repos.length === 0) {
                projectsGrid.innerHTML = '<div class="no-repos">No public repositories found.</div>';
                return;
            }
            
            projectsGrid.innerHTML = repos.map(repo => {
                const technologies = [];
                if (repo.language) {
                    technologies.push(repo.language);
                }
                
                // Try to infer additional technologies from repo name and description
                const inferTech = (text) => {
                    const lowerText = text.toLowerCase();
                    const techMap = {
                        'react': 'React',
                        'vue': 'Vue.js',
                        'angular': 'Angular',
                        'node': 'Node.js',
                        'express': 'Express',
                        'mongo': 'MongoDB',
                        'sql': 'SQL',
                        'docker': 'Docker',
                        'kubernetes': 'Kubernetes',
                        'python': 'Python',
                        'django': 'Django',
                        'flask': 'Flask',
                        'fastapi': 'FastAPI',
                        'typescript': 'TypeScript',
                        'nextjs': 'Next.js',
                        'nuxt': 'Nuxt.js',
                        'svelte': 'Svelte',
                        'rust': 'Rust',
                        'go': 'Go',
                        'java': 'Java',
                        'spring': 'Spring',
                        'c++': 'C++',
                        'c#': 'C#',
                        '.net': '.NET'
                    };
                    
                    Object.keys(techMap).forEach(key => {
                        if (lowerText.includes(key) && !technologies.includes(techMap[key])) {
                            technologies.push(techMap[key]);
                        }
                    });
                };
                
                if (repo.description) {
                    inferTech(repo.description);
                }
                inferTech(repo.name);
                
                // Check for GitHub Pages
                const githubPagesUrl = `https://${repo.owner.login}.github.io/${repo.name}`;
                const hasGithubPages = repo.has_pages;
                
                return `
                    <div class="project-card">
                        <h3 class="project-title">${repo.name}</h3>
                        <p class="project-description">
                            ${repo.description || 'No description available.'}
                        </p>
                        ${technologies.length > 0 ? `
                            <div class="project-tech">
                                ${technologies.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" class="project-link">
                                <i class="fab fa-github"></i>
                                View Code
                            </a>
                            ${repo.homepage ? `
                                <a href="${repo.homepage}" target="_blank" class="project-link">
                                    <i class="fas fa-external-link-alt"></i>
                                    Live Demo
                                </a>
                            ` : ''}
                            ${hasGithubPages && !repo.homepage ? `
                                <a href="${githubPagesUrl}" target="_blank" class="project-link">
                                    <i class="fab fa-github"></i>
                                    GitHub Pages
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
            projectsGrid.innerHTML = `
                <div class="error-message">
                    <p>Unable to load repositories at the moment. Please visit my 
                    <a href="https://github.com/secgit" target="_blank">GitHub profile</a> 
                    to see my latest projects.</p>
                </div>
            `;
        }
    }

    // Load GitHub repositories
    fetchGitHubRepos();

    // Enhanced audio player controls
    const audioPlayer = document.querySelector('audio');
    if (audioPlayer) {
        // Add loading state
        audioPlayer.addEventListener('loadstart', function() {
            console.log('Audio loading started');
        });

        audioPlayer.addEventListener('canplay', function() {
            console.log('Audio can start playing');
        });

        audioPlayer.addEventListener('error', function(e) {
            console.error('Audio error:', e);
            const playerContainer = audioPlayer.closest('.audio-player');
            if (playerContainer) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'audio-error';
                errorMsg.innerHTML = '<p>Unable to load audio file. The file may be too large or in an unsupported format.</p>';
                errorMsg.style.cssText = 'color: var(--text-secondary); text-align: center; padding: 1rem; background: var(--bg-tertiary); border-radius: 8px; margin-top: 1rem;';
                playerContainer.appendChild(errorMsg);
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Theme preference detection
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for changes in color scheme preference
    prefersDarkScheme.addEventListener('change', function(e) {
        console.log('Color scheme preference changed:', e.matches ? 'dark' : 'light');
    });

    // Performance optimization: Lazy load images if any are added later
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }

    // Add subtle parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Decryption text animation
    function decryptText(element, startDelay = 0, targetDuration = 1500) {
        setTimeout(() => {
            // Check for reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                // Just show the element normally if reduced motion is preferred
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                return;
            }
            
            // Show the element before starting animation
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            
            const text = element.dataset.text;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
            let progress = 0;
            
            // Calculate timing based on text length for perfect synchronization
            // We want all texts to finish at exactly the same time regardless of length
            const totalSteps = Math.ceil(targetDuration / 30); // 30ms intervals for smooth animation
            const progressIncrement = text.length / totalSteps; // How many characters to reveal per step
            
            const interval = setInterval(() => {
                const charactersToShow = Math.floor(progress);
                
                element.textContent = text
                    .split('')
                    .map((char, index) => {
                        if (index < charactersToShow) {
                            return text[index];
                        }
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join('');
                
                progress += progressIncrement;
                
                if (progress >= text.length) {
                    clearInterval(interval);
                    // Ensure final text is correct
                    element.textContent = text;
                }
            }, 30);
        }, startDelay);
    }
    
    // Start decryption animation for all text elements
    setTimeout(() => {
        const decryptElements = document.querySelectorAll('.decrypt-text');
        const animationDuration = 1500; // All animations will take 1.5 seconds
        
        decryptElements.forEach((element, index) => {
            // All elements start at the same time (no stagger) and finish together
            decryptText(element, 0, animationDuration);
        });
    }, 800);

    console.log('Portfolio website loaded successfully!');
});