// Configuración de premios
const prizes = [
    { matches: 10, name: "🏆 Premio Legendario", description: "50x Polvo de Gemas Potente", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981585/gemstonedustt5_umaswr.png" },
    { matches: 9, name: "👑 Premio Épico", description: "10x Piedra de Afilar Potente", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 8, name: "💎 Premio Supremo", description: "1x Escarabajo de Oro", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981450/goldenscarab_ujkn8w.png" },
    { matches: 7, name: "🎮 Premio Élite", description: "x10 Poción de protección de Corruptos", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981397/wardcorruptedt5_czrva0.png" },
    { matches: 6, name: "📱 Premio Superior", description: "x20 Revestimientos contra Corruptos", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981288/coatingcorruptedt5_rgalvp.png" },
    { matches: 5, name: "🎧 Premio Especial", description: "x15 Amanecer del Desierto", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981157/agavedrinkt5_r1whsb.png" },
    { matches: 4, name: "🎁 Premio Plus", description: "5x Arena Cargada", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981018/sandt4_se7d6p.png" },
    { matches: 3, name: "🧪 Premio Extra", description: "5x Azufre", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745980933/sulphurt1_pliugn.png" },
    { matches: 2, name: "🏺 Premio Básico", description: "20x Bloque de Arenisca", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745980834/sandstonechunk_vzasqt.png" },
    { matches: 1, name: "👻 Premio Inicial", description: "2x Pegote de Ectoplasma", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745980551/ancientectoplasm_qowcto.png" }
];

// Variables del juego
let gameInterval;
let drawnNumbers = [];
let playerNumbers = [];
let markedNumbers = [];
let isGameRunning = false;

// Sonidos del juego
const premioSound = new Audio('https://res.cloudinary.com/pcsolucion/video/upload/v1742121077/premio_bsbuz9.m4a');
const finalSound = new Audio('https://res.cloudinary.com/pcsolucion/video/upload/v1745595826/jv53ncinnbm45o3dasvi.mp3');
premioSound.preload = 'auto';
finalSound.preload = 'auto';

// Referencias DOM
const currentNumberDisplay = document.getElementById('currentNumber');
const numberStatusDisplay = document.querySelector('.number-status');
const startButton = document.getElementById('startButton');
const newCardButton = document.getElementById('newCardButton');

// Inicialización del juego
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', toggleGame);
    newCardButton.addEventListener('click', generateNewCard);
    generateNewCard();
    initializePrizesTable();
    
    // Iniciar el juego automáticamente después de un breve retraso
    setTimeout(() => {
        if (!isGameRunning) {
            toggleGame();
        }
    }, 1500);
});

// Inicializar tabla de premios
function initializePrizesTable() {
    const tbody = document.querySelector('#prizesTable tbody');
    tbody.innerHTML = '';
    
    // Crear filas en orden descendente (10 a 1)
    prizes.forEach(prize => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="match-count">${prize.matches}</span> <i class="fas fa-check"></i></td>
            <td>
                <div class="prize-info">
                    <div class="prize-name">${prize.name}</div>
                    <div class="prize-description">
                        ${prize.image ? `<div class="prize-content"><img src="${prize.image}" alt="${prize.description}" class="prize-image"><div class="prize-text">${prize.description}</div></div>` : prize.description}
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Generar números aleatorios únicos
function generateUniqueNumbers(count, max) {
    const numbers = new Set();
    while(numbers.size < count) {
        numbers.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b); // Ordenar números para mejor lectura
}

// Generar nueva tarjeta para el jugador
function generateNewCard() {
    playerNumbers = generateUniqueNumbers(10, 100);
    markedNumbers = [];
    const cardGrid = document.getElementById('playerCard');
    cardGrid.innerHTML = '';
    
    playerNumbers.forEach(number => {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'card-number';
        numberDiv.textContent = number;
        cardGrid.appendChild(numberDiv);
    });

    // Limpiar resaltados de la tabla de premios
    const rows = document.querySelectorAll('#prizesTable tbody tr');
    rows.forEach(row => {
        row.classList.remove('current-prize');
        row.classList.remove('winner-prize');
    });

    // Resetear número actual y números sorteados
    currentNumberDisplay.textContent = '--';
    numberStatusDisplay.textContent = 'Esperando sorteo...';
    document.getElementById('drawnNumbersList').innerHTML = '';
    drawnNumbers = [];
}

// Iniciar/Detener el juego
function toggleGame() {
    if (!isGameRunning) {
        // Iniciar juego
        if (drawnNumbers.length >= 42) {
            generateNewCard(); // Reiniciar si ya se jugaron los 42 números
        }
        
        isGameRunning = true;
        startButton.innerHTML = '<i class="fas fa-stop"></i> Detener';
        numberStatusDisplay.textContent = 'Sorteando...';
        newCardButton.disabled = true;
        
        // Limpiar resaltados anteriores
        const rows = document.querySelectorAll('#prizesTable tbody tr');
        rows.forEach(row => {
            row.classList.remove('winner-prize');
        });
        
        gameInterval = setInterval(drawNumber, 1500);
    } else {
        // Detener juego
        isGameRunning = false;
        startButton.innerHTML = '<i class="fas fa-play"></i> Continuar';
        numberStatusDisplay.textContent = 'Juego en pausa';
        clearInterval(gameInterval);
    }
}

// Sortear un nuevo número
function drawNumber() {
    if (drawnNumbers.length >= 42) {
        endGame();
        return;
    }

    let newNumber;
    do {
        newNumber = Math.floor(Math.random() * 100) + 1;
    } while (drawnNumbers.includes(newNumber));

    drawnNumbers.push(newNumber);
    
    // Actualizar visualización del número actual
    currentNumberDisplay.textContent = newNumber;
    currentNumberDisplay.classList.add('highlight');
    setTimeout(() => currentNumberDisplay.classList.remove('highlight'), 500);
    
    // Añadir a la lista de números sorteados
    const numberDiv = document.createElement('div');
    numberDiv.className = 'drawn-number';
    numberDiv.textContent = newNumber;
    document.getElementById('drawnNumbersList').appendChild(numberDiv);

    // Actualizar estado
    numberStatusDisplay.textContent = `${drawnNumbers.length} de 42 números sorteados`;

    // Verificar si el jugador tiene el número
    checkNumber(newNumber);
}

// Verificar si el número sorteado está en la tarjeta del jugador
function checkNumber(number) {
    // Código normal
    if (playerNumbers.includes(number) && !markedNumbers.includes(number)) {
        markedNumbers.push(number);
        
        // Marcar el número en la tarjeta
        const cardNumbers = document.querySelectorAll('.card-number');
        cardNumbers.forEach(div => {
            if (parseInt(div.textContent) === number) {
                div.classList.add('marked');
                div.classList.add('highlight');
                
                // Reproducir sonido de acierto
                premioSound.currentTime = 0;
                premioSound.play().catch(e => console.log("Error al reproducir sonido:", e));
            }
        });
        
        // Actualizar resaltado de premio actual
        updatePrizeHighlight();
        
        // Actualizar estado
        numberStatusDisplay.textContent = `¡Número encontrado! Tienes ${markedNumbers.length} aciertos`;
        
        // Si se completan los 10 números, finalizar el juego
        if (markedNumbers.length === 10) {
            setTimeout(endGame, 500);
        }
    }
}

// Actualizar resaltado del premio actual
function updatePrizeHighlight() {
    const rows = document.querySelectorAll('#prizesTable tbody tr');
    
    // Eliminar todos los resaltados de "current-prize"
    rows.forEach(row => {
        row.classList.remove('current-prize');
        row.classList.remove('winner-prize');
    });
    
    if (markedNumbers.length > 0) {
        // Índice del premio actual (0-based, por eso es 10 - markedNumbers.length)
        const currentPrizeIndex = 10 - markedNumbers.length;
        
        // Resaltar el premio actual y todos los premios anteriores
        for (let i = 9; i >= currentPrizeIndex; i--) {
            rows[i].classList.add('current-prize');
        }
        
        // Hacer scroll suave hasta el premio actual en la tabla
        rows[currentPrizeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Finalizar el juego
function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startButton.innerHTML = '<i class="fas fa-redo"></i> Nuevo Juego';
    numberStatusDisplay.textContent = 'Juego finalizado';
    newCardButton.disabled = false;
    
    // Eliminar resaltado actual y establecer premio final
    const rows = document.querySelectorAll('#prizesTable tbody tr');
    rows.forEach(row => row.classList.remove('current-prize'));
    
    if (markedNumbers.length > 0) {
        const winnerIndex = 10 - markedNumbers.length;
        
        // Marcar todos los premios ganados (el actual y los anteriores)
        for (let i = 9; i >= winnerIndex; i--) {
            rows[i].classList.add('winner-prize');
        }
        
        // Scroll al premio más alto ganado
        rows[winnerIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Reproducir sonido de finalización
        finalSound.currentTime = 0;
        finalSound.play().catch(e => console.log("Error al reproducir sonido final:", e));

        // Actualizar estado con mensaje de premio
        const mainPrize = prizes[winnerIndex];
        numberStatusDisplay.textContent = `¡Ganaste! Premio: ${mainPrize.name}`;
    }
}

// Evento para mostrar números restantes al hacer hover sobre el contenedor de números sorteados
document.addEventListener('DOMContentLoaded', () => {
    const drawnNumbersContainer = document.querySelector('.drawn-numbers');
    const originalTitle = drawnNumbersContainer.querySelector('h3').textContent;
    
    drawnNumbersContainer.addEventListener('mouseenter', () => {
        if (isGameRunning) {
            const remaining = 42 - drawnNumbers.length;
            drawnNumbersContainer.querySelector('h3').textContent = 
                `Números Sorteados (Faltan: ${remaining})`;
        }
    });
    
    drawnNumbersContainer.addEventListener('mouseleave', () => {
        drawnNumbersContainer.querySelector('h3').textContent = originalTitle;
    });
});