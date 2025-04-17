document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Navigation scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // Encryption Strength Comparison Chart
    const strengthCtx = document.getElementById('strengthChart').getContext('2d');
    const strengthChart = new Chart(strengthCtx, {
        type: 'bar',
        data: {
            labels: ['AES-256 (Enkyra)', 'AES-128', 'Triple DES', 'DES', 'Simple XOR'],
            datasets: [{
                label: 'Relative Strength (higher is better)',
                data: [100, 70, 40, 20, 5],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(217, 70, 239, 0.7)',
                    'rgba(236, 72, 153, 0.7)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(217, 70, 239, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });

    // Encryption Usage Statistics Chart removed

    // Feature cards animation
    const featureCards = document.querySelectorAll('.feature-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Encryption animation sequence
    function startEncryptionDemo() {
        const typingAnimation = document.querySelector('.typing-animation');
        const encryptionAnimation = document.querySelector('.encryption-animation');

        // Reset animations
        typingAnimation.style.animation = 'none';
        encryptionAnimation.style.opacity = '0';

        setTimeout(() => {
            // Start typing animation
            typingAnimation.style.animation = 'typing 3s steps(30, end), blink-caret 0.75s step-end infinite';

            // Start encryption animation after typing
            setTimeout(() => {
                encryptionAnimation.style.opacity = '1';
                encryptionAnimation.style.animation = 'encrypt 2s infinite';
            }, 3000);

            // Restart the sequence after a delay
            setTimeout(startEncryptionDemo, 10000);
        }, 100);
    }

    // Start the encryption demo
    startEncryptionDemo();
});
