// Configuración de premios con sus imágenes correspondientes
const prizes = [
    {
        name: "🏆 Royal Flush",
        description: "¡Premio mayor! Un viaje todo pagado",
        requiredMarks: 10,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "0 0" // Posición en el sprite de la imagen de Royal Flush
    },
    {
        name: "🎰 Escalera de Color",
        description: "¡Felicidades! Una consola de videojuegos",
        requiredMarks: 9,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-150px 0" // Ajusta según la posición en el sprite
    },
    {
        name: "🎲 Póker",
        description: "¡Increíble! Un smartphone de última generación",
        requiredMarks: 8,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-300px 0"
    },
    {
        name: "🎮 Full House",
        description: "¡Genial! Un set de auriculares gaming",
        requiredMarks: 7,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-450px 0"
    },
    {
        name: "🎯 Color",
        description: "¡Excelente! Una tarjeta de regalo de $100",
        requiredMarks: 6,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-600px 0"
    },
    {
        name: "🎪 Escalera",
        description: "¡Muy bien! Un juego de mesa premium",
        requiredMarks: 5,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-750px 0"
    },
    {
        name: "🎨 Trío",
        description: "¡Bien hecho! Una camiseta exclusiva",
        requiredMarks: 4,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-900px 0"
    },
    {
        name: "🎭 Doble Pareja",
        description: "¡Buen trabajo! Un llavero coleccionable",
        requiredMarks: 3,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-1050px 0"
    },
    {
        name: "🎪 Pareja",
        description: "¡Gracias por participar! Un sticker decorativo",
        requiredMarks: 2,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-1200px 0"
    },
    {
        name: "🃏 Carta Alta",
        description: "¡Sigue intentando! Una entrada para la próxima rifa",
        requiredMarks: 1,
        image: "https://raw.githubusercontent.com/PCSolucion/NW_poker_NW/main/cartas.png",
        spritePosition: "-1350px 0"
    }
];

// Variables del juego
let gameInterval;
let drawnNumbers = [];
let playerNumbers = [];
let markedNumbers = [];
let isGameRunning = false;

// Sonido de premio (reutilizado del juego original)
const premioSound = new Audio('https://res.cloudinary.com/pcsolucion/video/upload/v1742121077/premio_bsbuz9.m4a');
premioSound.preload = 'auto';

// Inicialización del juego
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', toggleGame);
    document.getElementById('newCardButton').addEventListener('click', generateNewCard);
    generateNewCard();
});

// Generar números aleatorios únicos
function generateUniqueNumbers(count, max) {
    const numbers = new Set();
    while(numbers.size < count) {
        numbers.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(numbers);
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

    updatePrizeDisplay();
}

// Actualizar visualización del premio
function updatePrizeDisplay() {
    const markedCount = markedNumbers.length;
    let currentPrize = prizes.find(prize => prize.requiredMarks === markedCount) || 
                      {name: "Sigue jugando", description: "¡Marca más números para ganar!", image: "", spritePosition: "0 0"};

    document.getElementById('prizeName').textContent = currentPrize.name;
    document.getElementById('prizeDescription').textContent = currentPrize.description;
    
    const prizeImage = document.getElementById('prizeImage');
    if (currentPrize.image) {
        prizeImage.style.backgroundImage = `url(${currentPrize.image})`;
        prizeImage.style.backgroundPosition = currentPrize.spritePosition;
    }
}

// Iniciar/Detener el juego
function toggleGame() {
    const startButton = document.getElementById('startButton');
    const newCardButton = document.getElementById('newCardButton');

    if (!isGameRunning) {
        // Iniciar juego
        isGameRunning = true;
        startButton.textContent = 'Detener';
        newCardButton.disabled = true;
        drawnNumbers = [];
        document.getElementById('drawnNumbersList').innerHTML = '';
        
        gameInterval = setInterval(drawNumber, 2000);
    } else {
        // Detener juego
        isGameRunning = false;
        startButton.textContent = 'Iniciar Juego';
        newCardButton.disabled = false;
        clearInterval(gameInterval);
    }
}

// Sortear un nuevo número
function drawNumber() {
    if (drawnNumbers.length >= 50) {
        endGame();
        return;
    }

    let newNumber;
    do {
        newNumber = Math.floor(Math.random() * 50) + 1;
    } while (drawnNumbers.includes(newNumber));

    drawnNumbers.push(newNumber);
    
    // Actualizar visualización
    document.getElementById('currentNumber').textContent = newNumber;
    
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
                
                // Reproducir sonido
                premioSound.currentTime = 0;
                premioSound.play().catch(e => console.log("Error al reproducir sonido:", e));
            }
        });

        updatePrizeDisplay();
        
        // Verificar si se completó la tarjeta
        if (markedNumbers.length === 10) {
            setTimeout(endGame, 1000);
        }
    }
}

// Finalizar el juego
function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    document.getElementById('startButton').textContent = 'Iniciar Juego';
    document.getElementById('newCardButton').disabled = false;
    
    if (markedNumbers.length === 10) {
        alert('¡FELICIDADES! ¡Has completado tu tarjeta!');
    } else {
        alert('Juego terminado. Has marcado ' + markedNumbers.length + ' números.');
    }
}