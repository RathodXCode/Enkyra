document.addEventListener('DOMContentLoaded', function() {
    // Cursor animations disabled

    // Create encryption background
    createEncryptionBackground();

    // Create binary rain effect
    createBinaryRain();

    // Create encryption particles
    createEncryptionParticles();

    // Create encryption glow effects
    createEncryptionGlows();

    // Add encryption key animation on click
    document.addEventListener('click', createEncryptionKey);
});

// Create the encryption background container
function createEncryptionBackground() {
    const background = document.createElement('div');
    background.className = 'encryption-background';
    document.body.appendChild(background);

    // Add grid effect
    const grid = document.createElement('div');
    grid.className = 'encryption-grid';
    background.appendChild(grid);
}

// Create binary rain columns
function createBinaryRain() {
    const binaryRain = document.createElement('div');
    binaryRain.className = 'binary-rain';
    document.querySelector('.encryption-background').appendChild(binaryRain);

    const columnCount = Math.floor(window.innerWidth / 30);

    for (let i = 0; i < columnCount; i++) {
        createBinaryColumn(binaryRain, i * 30);
    }
}

// Create a single binary column
function createBinaryColumn(container, xPos) {
    const column = document.createElement('div');
    column.className = 'binary-column';
    column.style.left = xPos + 'px';

    // Generate random binary string
    let binaryString = '';
    const length = 100 + Math.floor(Math.random() * 200);

    for (let i = 0; i < length; i++) {
        if (Math.random() > 0.5) {
            binaryString += '1';
        } else {
            binaryString += '0';
        }

        // Add occasional encryption symbols
        if (Math.random() > 0.95) {
            const symbols = ['$', '#', '@', '*', '&', '%', '+', '=', '?'];
            binaryString += symbols[Math.floor(Math.random() * symbols.length)];
        }

        if (i % 20 === 19) {
            binaryString += '<br>';
        }
    }

    column.innerHTML = binaryString;
    container.appendChild(column);

    // Animate the column
    const speed = 1 + Math.random() * 3;
    const delay = Math.random() * 10;

    column.style.animation = `binary-fall ${speed}s linear ${delay}s infinite`;

    // Define the animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes binary-fall {
            0% {
                transform: translateY(-100%);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(100vh);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Create encryption particles
function createEncryptionParticles() {
    const background = document.querySelector('.encryption-background');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'encryption-particle';

        // Random position
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';

        // Random size
        const size = 1 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random opacity
        particle.style.opacity = 0.1 + Math.random() * 0.5;

        // Animation
        const duration = 20 + Math.random() * 40;
        const delay = Math.random() * 20;

        particle.style.animation = `particle-float ${duration}s ease-in-out ${delay}s infinite alternate`;

        background.appendChild(particle);
    }

    // Define the animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes particle-float {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(${Math.random() > 0.5 ? '+' : '-'}${20 + Math.random() * 30}px,
                                    ${Math.random() > 0.5 ? '+' : '-'}${20 + Math.random() * 30}px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Create encryption glow effects
function createEncryptionGlows() {
    const background = document.querySelector('.encryption-background');
    const glowCount = 3;

    for (let i = 0; i < glowCount; i++) {
        const glow = document.createElement('div');
        glow.className = 'encryption-glow';

        // Random position
        glow.style.left = Math.random() * 100 + 'vw';
        glow.style.top = Math.random() * 100 + 'vh';

        // Random size
        const size = 200 + Math.random() * 300;
        glow.style.width = size + 'px';
        glow.style.height = size + 'px';

        // Animation with delay
        const delay = i * 5;
        glow.style.animationDelay = delay + 's';

        background.appendChild(glow);
    }
}

// Create encryption key animation on click
function createEncryptionKey(e) {
    const background = document.querySelector('.encryption-background');
    const key = document.createElement('div');
    key.className = 'encryption-key';

    // Position at click
    key.style.left = e.clientX + 'px';
    key.style.top = e.clientY + 'px';

    // Generate random encryption key
    let keyString = '';
    const keyLength = 16 + Math.floor(Math.random() * 16);
    const chars = '0123456789ABCDEF';

    for (let i = 0; i < keyLength; i++) {
        keyString += chars[Math.floor(Math.random() * chars.length)];
        if (i % 4 === 3 && i < keyLength - 1) {
            keyString += '-';
        }
    }

    key.textContent = keyString;

    // Random direction
    const angle = Math.random() * 360;
    const distance = 50 + Math.random() * 100;
    key.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    // Animation
    key.style.animation = 'fade-out 3s forwards, key-float 3s forwards';

    // Define the animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes key-float {
            0% {
                transform: translate(-50%, -50%) rotate(${angle}deg);
            }
            100% {
                transform: translate(
                    calc(-50% + ${Math.cos(angle * Math.PI / 180) * distance}px),
                    calc(-50% + ${Math.sin(angle * Math.PI / 180) * distance}px)
                ) rotate(${angle + 20}deg);
            }
        }
    `;
    document.head.appendChild(style);

    background.appendChild(key);

    // Remove after animation completes
    setTimeout(() => {
        key.remove();
        style.remove();
    }, 3000);
}
