// Configuración de premios
const prizes = [
    { matches: 10, name: "🏆 Premio Legendario", description: "Viaje a Disneyland + 5000€" },
    { matches: 9, name: "👑 Premio Épico", description: "MacBook Pro última generación" },
    { matches: 8, name: "💎 Premio Supremo", description: "PlayStation 5 + TV 4K 55'" },
    { matches: 7, name: "🎮 Premio Élite", description: "Nintendo Switch OLED + 5 juegos" },
    { matches: 6, name: "📱 Premio Superior", description: "iPhone último modelo" },
    { matches: 5, name: "🎧 Premio Especial", description: "AirPods Pro + Apple Watch" },
    { matches: 4, name: "🎁 Premio Plus", description: "500€ en tarjeta regalo" },
    { matches: 3, name: "🎨 Premio Extra", description: "Set gaming (teclado + ratón + auriculares)" },
    { matches: 2, name: "🎭 Premio Básico", description: "50€ en Amazon" },
    { matches: 1, name: "🎪 Premio Inicial", description: "Poder jugar otra vez gratis" }
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

// Inicialización del juego
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', toggleGame);
    document.getElementById('newCardButton').addEventListener('click', generateNewCard);
    generateNewCard();
    initializePrizesTable();
});

// Inicializar tabla de premios
function initializePrizesTable() {
    const tbody = document.querySelector('#prizesTable tbody');
    tbody.innerHTML = '';
    
    // Crear filas en orden descendente (10 a 1)
    prizes.forEach(prize => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prize.matches} ✓</td>
            <td>${prize.name}</td>
            <td>${prize.description}</td>
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
    playerNumbers = generateUniqueNumbers(10, 50);
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
    document.getElementById('currentNumber').textContent = '--';
    document.getElementById('drawnNumbersList').innerHTML = '';
}

// Iniciar/Detener el juego
function toggleGame() {
    const startButton = document.getElementById('startButton');
    const newCardButton = document.getElementById('newCardButton');

    if (!isGameRunning) {
        // Iniciar juego
        if (drawnNumbers.length >= 20) {
            generateNewCard(); // Reiniciar si ya se jugaron los 20 números
        }
        
        isGameRunning = true;
        startButton.textContent = 'Detener';
        newCardButton.disabled = true;
        
        // Limpiar resaltados anteriores
        const rows = document.querySelectorAll('#prizesTable tbody tr');
        rows.forEach(row => {
            row.classList.remove('winner-prize');
        });
        
        gameInterval = setInterval(drawNumber, 2000);
    } else {
        // Detener juego
        isGameRunning = false;
        startButton.textContent = 'Continuar';
        clearInterval(gameInterval);
    }
}

// Sortear un nuevo número
function drawNumber() {
    if (drawnNumbers.length >= 20) {
        endGame();
        return;
    }

    let newNumber;
    do {
        newNumber = Math.floor(Math.random() * 50) + 1;
    } while (drawnNumbers.includes(newNumber));

    drawnNumbers.push(newNumber);
    
    // Actualizar visualización del número actual
    const currentNumberDisplay = document.getElementById('currentNumber');
    currentNumberDisplay.textContent = newNumber;
    currentNumberDisplay.classList.add('highlight');
    setTimeout(() => currentNumberDisplay.classList.remove('highlight'), 500);
    
    // Añadir a la lista de números sorteados
    const numberDiv = document.createElement('div');
    numberDiv.className = 'drawn-number';
    numberDiv.textContent = newNumber;
    document.getElementById('drawnNumbersList').appendChild(numberDiv);

    // Verificar si el jugador tiene el número
    checkNumber(newNumber);
}

// Verificar si el número sorteado está en la tarjeta del jugador
function checkNumber(number) {
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
        
        // Si se completan los 10 números, finalizar el juego
        if (markedNumbers.length === 10) {
            setTimeout(endGame, 500);
        }
    }
}

// Actualizar resaltado del premio actual
function updatePrizeHighlight() {
    const rows = document.querySelectorAll('#prizesTable tbody tr');
    
    // Eliminar todos los resaltados
    rows.forEach(row => {
        row.classList.remove('current-prize');
        row.classList.remove('winner-prize');
    });
    
    if (markedNumbers.length > 0) {
        // Resaltar el premio actual
        const currentPrizeRow = rows[10 - markedNumbers.length];
        currentPrizeRow.classList.add('current-prize');
        
        // Hacer scroll suave hasta el premio actual en la tabla
        currentPrizeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Finalizar el juego
function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    document.getElementById('startButton').textContent = 'Nuevo Juego';
    document.getElementById('newCardButton').disabled = false;
    
    // Eliminar resaltado actual y establecer premio final
    const rows = document.querySelectorAll('#prizesTable tbody tr');
    rows.forEach(row => row.classList.remove('current-prize'));
    
    if (markedNumbers.length > 0) {
        const winnerRow = rows[10 - markedNumbers.length];
        winnerRow.classList.add('winner-prize');
        winnerRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Reproducir sonido de finalización
        finalSound.currentTime = 0;
        finalSound.play().catch(e => console.log("Error al reproducir sonido final:", e));
    }
}

// Evento para mostrar números restantes al hacer hover sobre el contenedor de números sorteados
document.addEventListener('DOMContentLoaded', () => {
    const drawnNumbersContainer = document.querySelector('.drawn-numbers');
    const originalTitle = drawnNumbersContainer.querySelector('h3').textContent;
    
    drawnNumbersContainer.addEventListener('mouseenter', () => {
        if (isGameRunning) {
            const remaining = 20 - drawnNumbers.length;
            drawnNumbersContainer.querySelector('h3').textContent = 
                `Números Sorteados (Faltan: ${remaining})`;
        }
    });
    
    drawnNumbersContainer.addEventListener('mouseleave', () => {
        drawnNumbersContainer.querySelector('h3').textContent = originalTitle;
    });
});