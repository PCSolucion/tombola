// Configuración de premios
const prizes = [
    { matches: 10, name: "", description: "15x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 9, name: "", description: "13x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 8, name: "", description: "11x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 7, name: "", description: "9x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 6, name: "", description: "7x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 5, name: "", description: "5x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 4, name: "", description: "4x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 3, name: "", description: "3x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 2, name: "", description: "2x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" },
    { matches: 1, name: "", description: "1x Piedras de Afilar Potentes", image: "https://res.cloudinary.com/pcsolucion/image/upload/v1745981510/honingstonet5_crjf7s.png" }
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

// Configuración y funcionalidad de la ruleta
const rouletteOptions = [
    { text: "+1 🏆", color: "#121212", isMultiplier: true },
    { text: "+2 🏆", color: "#121212", isMultiplier: true },
    { text: "+1 🏆", color: "#121212", isMultiplier: true },
    { text: "+1 🏆", color: "#121212", isMultiplier: true },
    { text: "+3 🏆", color: "#121212", isMultiplier: true },
    { text: "+1 🏆", color: "#121212", isMultiplier: true },
    { text: "+2 🏆", color: "#121212", isMultiplier: true },
    { text: "+3 🏆", color: "#121212", isMultiplier: true }
];

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

    // Inicializar la ruleta
    initializeRouletteWheel();
    
    // Evento para girar la ruleta
    document.getElementById('spin-wheel').addEventListener('click', spinWheel);
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
    playerNumbers = generateUniqueNumbers(12, 100);
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
        if (drawnNumbers.length >= 30) {
            generateNewCard(); // Reiniciar si ya se jugaron los 30 números
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
        
        // Intervalo más rápido: 1000ms en lugar de 1500ms
        gameInterval = setInterval(drawNumber, 1000);
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
    if (drawnNumbers.length >= 30) {
        endGame();
        // Verificar si es el último número sorteado
        if (drawnNumbers.length === 30) {
            // Esperar un momento para que el usuario vea el último número
            setTimeout(() => {
                // Girar la ruleta automáticamente
                const wheelButton = document.getElementById('spin-wheel');
                if (wheelButton) {
                    // Simular un click en el botón de la ruleta
                    wheelButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Añadir efecto de pulsación al botón
                    wheelButton.classList.add('highlight');
                    setTimeout(() => {
                        wheelButton.classList.remove('highlight');
                    }, 500);
                    
                    // Girar la ruleta después de un breve retraso
                    setTimeout(() => {
                        spinWheel();
                    }, 1000);
                }
            }, 2000);
        }
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
    numberStatusDisplay.textContent = `${drawnNumbers.length} de 30 números sorteados`;

    // Verificar si el jugador tiene el número
    checkNumber(newNumber);
    
    // Si es el último número sorteado, girar la ruleta automáticamente
    if (drawnNumbers.length === 30) {
        // Añadir indicación visual
        numberStatusDisplay.textContent = `¡Último número! Girando la ruleta de premios...`;
    }
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
        
        // Actualizar resaltado de premio actual, máximo 10 premios
        updatePrizeHighlight();
        
        // Actualizar estado
        numberStatusDisplay.textContent = `¡Número encontrado! Tienes ${markedNumbers.length} aciertos`;
        
        // Si se completan los 10 aciertos, finalizar el juego
        // Aunque la tarjeta tenga 12 números, el juego se gana con 10
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
        // Índice del premio actual (0-based, por eso es 10 - markedNumbers.length)
        const currentPrizeIndex = 10 - markedNumbers.length;
        
        // Resaltar solo el premio actual
        rows[currentPrizeIndex].classList.add('current-prize');
        
        // Hacer scroll suave hasta el premio actual en la tabla
        rows[currentPrizeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Finalizar el juego
function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startButton.innerHTML = '<i class="fas fa-redo"></i> Nuevo Juego';
    
    // Cambiar el mensaje solo si no es el último número
    // Si es el último número, el mensaje ya está configurado en drawNumber
    if (drawnNumbers.length !== 30) {
        numberStatusDisplay.textContent = 'Juego finalizado';
    }
    
    newCardButton.disabled = false;
    
    // Eliminar resaltado actual y establecer premio final
    const rows = document.querySelectorAll('#prizesTable tbody tr');
    rows.forEach(row => row.classList.remove('current-prize'));
    
    if (markedNumbers.length > 0) {
        const actualPrizeIndex = 10 - markedNumbers.length;
        
        // Marcar solo el premio final como ganado
        rows[actualPrizeIndex].classList.add('winner-prize');
        
        // Scroll al premio ganado
        rows[actualPrizeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Actualizar estado con mensaje de premio sólo si no es el último número
        if (drawnNumbers.length !== 30) {
            const mainPrize = prizes[actualPrizeIndex];
            numberStatusDisplay.textContent = `¡Ganaste! Premio: ${mainPrize.description}`;
        }
    }
}

// Función para reproducir el sonido final cuando termine la ruleta
function playFinalSound() {
    // Reproducir sonido de finalización
    finalSound.currentTime = 0;
    finalSound.play().catch(e => console.log("Error al reproducir sonido final:", e));
}

// Evento para mostrar números restantes al hacer hover sobre el contenedor de números sorteados
document.addEventListener('DOMContentLoaded', () => {
    const drawnNumbersContainer = document.querySelector('.drawn-numbers');
    const originalTitle = drawnNumbersContainer.querySelector('h3').textContent;
    
    drawnNumbersContainer.addEventListener('mouseenter', () => {
        if (isGameRunning) {
            const remaining = 30 - drawnNumbers.length;
            drawnNumbersContainer.querySelector('h3').textContent = 
                `Números Sorteados (Faltan: ${remaining})`;
        }
    });
    
    drawnNumbersContainer.addEventListener('mouseleave', () => {
        drawnNumbersContainer.querySelector('h3').textContent = originalTitle;
    });
});

// Inicializar el canvas de la ruleta
function initializeRouletteWheel() {
    const canvas = document.getElementById('wheel');
    if (!canvas) {
        console.error('No se encontró el elemento canvas con id "wheel"');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('No se pudo obtener el contexto 2d del canvas');
        return;
    }
    
    // Asegurar que el canvas sea visible
    canvas.style.display = 'block';
    
    // Ajustar el canvas al tamaño real del elemento
    resizeCanvas(canvas);
    
    // Dibujar la ruleta
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    drawWheel(ctx, centerX, centerY, radius);
    
    // Agregar listener para redimensionar
    window.addEventListener('resize', function() {
        resizeCanvas(canvas);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        drawWheel(canvas.getContext('2d'), centerX, centerY, radius);
    });
    
    console.log('Ruleta inicializada correctamente');
}

// Función para ajustar el tamaño del canvas
function resizeCanvas(canvas) {
    // Obtener el tamaño del contenedor
    const container = canvas.parentElement;
    const displayWidth = container.clientWidth;
    const displayHeight = container.clientHeight;
    
    // Verificar si es necesario cambiar el tamaño
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

// Dibujar la ruleta en el canvas
function drawWheel(ctx, centerX, centerY, radius) {
    // Limpiar el canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Dibujar cada segmento de la ruleta
    const totalOptions = rouletteOptions.length;
    const anglePerOption = 2 * Math.PI / totalOptions;
    
    for (let i = 0; i < totalOptions; i++) {
        const option = rouletteOptions[i];
        // Todos los premios son multiplicadores, determinar tipo
        let prizeValue = 0;
        if (option.text.includes("+3")) {
            prizeValue = 2000; // Máximo valor para +3
        } else if (option.text.includes("+2")) {
            prizeValue = 1500; // Alto valor para +2
        } else if (option.text.includes("+1")) {
            prizeValue = 1000; // Valor medio para +1
        }
        
        const isPremiumPrize = option.isMultiplier; // Todos son premios especiales ahora
        
        // El marcador está en la parte superior (ángulo 270 grados o -Math.PI/2)
        // Necesitamos que el marcador apunte al centro de cada segmento
        const startAngle = i * anglePerOption;
        const endAngle = (i + 1) * anglePerOption;
        
        // Dibujar segmento
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Crear un patrón de degradado radial para los premios especiales
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        // Colores según sea +3, +2 o +1
        if (option.text.includes("+3")) {
            // Degradado para +3 (rojo dorado)
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.7, '#300000');
            gradient.addColorStop(0.9, '#600000');
            gradient.addColorStop(1, '#900000');
        } else if (option.text.includes("+2")) {
            // Degradado para +2 (naranja dorado)
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.7, '#302000');
            gradient.addColorStop(0.9, '#603000');
            gradient.addColorStop(1, '#904000');
        } else if (option.text.includes("+1")) {
            // Degradado para +1 (verde dorado)
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.7, '#203000');
            gradient.addColorStop(0.9, '#406000');
            gradient.addColorStop(1, '#609000');
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Dibujar línea divisoria
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(endAngle) * radius,
            centerY + Math.sin(endAngle) * radius
        );
        // Línea divisoria especial para el premio
        if (option.text.includes("+3")) {
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.4)';
            ctx.lineWidth = 2;
        } else if (option.text.includes("+2")) {
            ctx.strokeStyle = 'rgba(255, 170, 0, 0.4)';
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = 'rgba(100, 255, 0, 0.3)';
            ctx.lineWidth = 1;
        }
        ctx.stroke();
        
        // Dibujar texto
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Rotamos el texto para que esté correctamente orientado en el segmento
        // (en el centro del segmento)
        const textAngle = startAngle + anglePerOption / 2;
        ctx.rotate(textAngle);
        
        // Colores especiales para los textos
        if (option.text.includes("+3")) {
            ctx.fillStyle = '#ff5050'; // Rojo para +3
            ctx.font = 'bold 20px "Rubik", sans-serif';
            ctx.shadowColor = 'rgba(255, 80, 80, 0.7)';
            ctx.shadowBlur = 10;
        } else if (option.text.includes("+2")) {
            ctx.fillStyle = '#ffaa00'; // Naranja para +2
            ctx.font = 'bold 18px "Rubik", sans-serif';
            ctx.shadowColor = 'rgba(255, 170, 0, 0.7)';
            ctx.shadowBlur = 8;
        } else {
            ctx.fillStyle = '#90ff00'; // Verde para +1
            ctx.font = 'bold 16px "Rubik", sans-serif';
            ctx.shadowColor = 'rgba(144, 255, 0, 0.7)';
            ctx.shadowBlur = 6;
        }
        
        // Configurar la alineación del texto
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        
        // Distancia desde el centro para el texto
        const textDistance = radius * 0.75;
        
        // Dibujar el texto simplemente alineado a la derecha
        ctx.fillText(option.text, textDistance, 0);
        
        // Restaurar sombra
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Restaurar transformaciones
        ctx.restore();
        
        // Añadir efecto de destellos para los premios
        // Calcular el punto medio del segmento para dibujar destellos
        const midAngle = startAngle + anglePerOption / 2;
        const midRadius = radius * 0.7;
        
        // Más destellos para +3, menos para +1
        let numDestellos = 5; // Para +1
        let brilloMax = 0.6;
        
        if (option.text.includes("+3")) {
            numDestellos = 15;
            brilloMax = 1.0;
        } else if (option.text.includes("+2")) {
            numDestellos = 10;
            brilloMax = 0.8;
        }
        
        // Dibujar destellos - más apartados de los números
        for (let j = 0; j < numDestellos; j++) {
            // Ajustamos el rango de distribución para alejar los destellos del texto
            // El texto está a textDistance = radius * 0.75
            // Colocamos los destellos más cerca del centro y del borde
            
            // Determinar si el destello va en la zona interna o externa
            const zonaInterna = Math.random() > 0.5;
            
            let sparkRadius;
            if (zonaInterna) {
                // Zona interna: 20% a 45% del radio
                sparkRadius = radius * (0.2 + Math.random() * 0.25);
            } else {
                // Zona externa: 80% a 95% del radio
                sparkRadius = radius * (0.8 + Math.random() * 0.15);
            }
            
            const sparkAngle = midAngle + (Math.random() * 0.8 - 0.4);
            const sparkX = centerX + Math.cos(sparkAngle) * sparkRadius;
            const sparkY = centerY + Math.sin(sparkAngle) * sparkRadius;
            
            // Estrellas más grandes y coloridas
            const sparkSize = 1 + Math.random() * 3;
            
            // Colores según el tipo de premio
            let hue = 120; // Verde para +1
            if (option.text.includes("+3")) {
                hue = 0; // Rojo para +3
            } else if (option.text.includes("+2")) {
                hue = 35; // Naranja para +2
            }
            
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${0.6 + Math.random() * brilloMax})`;
            ctx.fill();
        }
    }
    
    // Dibujar círculo central
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 0.15
    );
    centerGradient.addColorStop(0, '#362d46');
    centerGradient.addColorStop(1, '#1e1e1e');
    ctx.fillStyle = centerGradient;
    ctx.fill();
    
    // Borde del círculo central
    ctx.strokeStyle = 'rgba(187, 134, 252, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Dibujar círculo exterior
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Función para girar la ruleta
function spinWheel() {
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spin-wheel');
    
    // Verificar si los elementos existen
    if (!wheel || !spinButton) {
        console.error("No se pudieron encontrar todos los elementos necesarios para la ruleta");
        return;
    }
    
    // Desactivar el botón mientras gira
    spinButton.disabled = true;
    spinButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Girando...';
    spinButton.style.opacity = '0.7';
    
    // Ocultar cualquier texto de premio anterior
    hideRouletteResult();
    
    // Generar un ángulo aleatorio (número de grados a girar)
    const totalOptions = rouletteOptions.length;
    const degreePerOption = 360 / totalOptions;
    
    // Calcular un destino aleatorio con múltiples vueltas
    const spinCount = 8; // Aumentado de 5 a 8 vueltas para mayor tiempo de giro
    const selectedOption = Math.floor(Math.random() * totalOptions);
    
    // Calcular el ángulo para que el premio seleccionado quede en la parte superior (donde está el marcador)
    // El marcador está en la parte superior (ángulo 270°), así que necesitamos girar la ruleta
    // para que el centro del segmento seleccionado quede en la parte superior
    const baseRotation = 270; // El marcador está en la parte superior (270 grados)
    const targetPosition = selectedOption * degreePerOption + (degreePerOption / 2);
    const targetDegree = spinCount * 360 + (baseRotation - targetPosition);
    
    // Para debug - esto nos ayuda a verificar que el cálculo es correcto
    console.log(`Opción seleccionada: ${selectedOption} (${rouletteOptions[selectedOption].text})`);
    console.log(`Ángulo final de giro: ${targetDegree} grados`);
    
    // Configurar la variable CSS para el ángulo de giro final
    wheel.style.setProperty('--spin-angle', `${targetDegree}deg`);
    
    // Resetear cualquier animación anterior
    wheel.classList.remove('spinning');
    void wheel.offsetWidth; // Trigger reflow
    
    // Aplicar la clase con la animación
    wheel.classList.add('spinning');
    
    // Reproducir sonido si está disponible
    const rouletteSound = new Audio('https://res.cloudinary.com/pcsolucion/video/upload/v1742121077/premio_bsbuz9.m4a');
    rouletteSound.play().catch(e => console.log("Error al reproducir sonido:", e));
    
    // Duración de la animación (aumentada de 5s a 8s)
    const animationDuration = 8000;
    
    // Restaurar el botón después de que termine la animación
    setTimeout(() => {
        spinButton.disabled = false;
        spinButton.innerHTML = '<i class="fas fa-play"></i> Girar';
        spinButton.style.opacity = '1';
        
        // Mostrar el resultado
        const selectedPrizeText = rouletteOptions[selectedOption].text;
        
        // Identificar si es +3 o +2 usando includes para mayor seguridad
        const isJackpot = selectedPrizeText.includes("+3");
        const isMultiplier = selectedPrizeText.includes("+2") && !isJackpot;
        const isPlusOne = selectedPrizeText.includes("+1") && !isJackpot && !isMultiplier;
        
        // Todos los premios ahora son multiplicadores (+1, +2 o +3)
        // Obtener todas las filas de la tabla de premios
        const prizeTable = document.getElementById('prizesTable');
        if (!prizeTable) {
            console.error('No se encontró la tabla de premios');
            return;
        }
        
        const prizeRows = prizeTable.querySelectorAll('tbody tr');
        console.log(`Total de filas en la tabla de premios: ${prizeRows.length}`);
        
        // Obtener el estado actual de aciertos
        const currentMarkedCount = markedNumbers.length;
        
        if (currentMarkedCount > 0) {
            // Determinar cuántos niveles adicionales añadir
            const levelsToAdd = isJackpot ? 3 : (isMultiplier ? 2 : 1);
            
            // Calcular el nuevo número de aciertos simulados (limitado a 10)
            const newMarkedCount = Math.min(10, currentMarkedCount + levelsToAdd);
            
            // Calcular los índices de premios correspondientes
            const currentPrizeIndex = 10 - currentMarkedCount;
            const newPrizeIndex = 10 - newMarkedCount;
            
            // Logs de depuración
            console.log(`Premio seleccionado: ${selectedPrizeText}`);
            console.log(`Es +3: ${isJackpot}, Es +2: ${isMultiplier}, Es +1: ${isPlusOne}`);
            console.log(`Aciertos actuales: ${currentMarkedCount}, Aciertos a añadir: ${levelsToAdd}, Nuevos aciertos: ${newMarkedCount}`);
            console.log(`Índice premio actual: ${currentPrizeIndex}, Nuevo índice premio: ${newPrizeIndex}`);
            
            // Limpiar todos los resaltados actuales
            if (prizeRows.length > 0) {
                Array.from(prizeRows).forEach(row => {
                    row.classList.remove('current-prize');
                    row.classList.remove('winner-prize');
                });
                
                // Resaltar todos los premios correspondientes al nuevo número de aciertos
                // Iteramos desde el premio más bajo (índice 9) hasta el premio correspondiente
                // al nuevo número de aciertos (newPrizeIndex)
                for (let i = 9; i >= newPrizeIndex && i >= 0 && i < prizeRows.length; i--) {
                    prizeRows[i].classList.add('current-prize');
                    console.log(`Resaltando premio en posición ${i}`);
                }
                
                // Verificar cuántas filas terminaron resaltadas
                setTimeout(() => {
                    const highlightedRows = document.querySelectorAll('#prizesTable tbody tr.current-prize');
                    console.log(`Filas resaltadas después de aplicar +${levelsToAdd}: ${highlightedRows.length}`);
                }, 100);
                
                // Hacer scroll suave hasta el premio más alto iluminado
                if (newPrizeIndex >= 0 && newPrizeIndex < prizeRows.length) {
                    prizeRows[newPrizeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                console.error('No se encontraron filas en la tabla de premios');
            }
            
            // Mensaje para el usuario
            let message = "";
            if (isJackpot) {
                message = `¡+3! ¡Subiste de ${currentMarkedCount} a ${newMarkedCount} aciertos!`;
            } else if (isMultiplier) {
                message = `¡+2! ¡Subiste de ${currentMarkedCount} a ${newMarkedCount} aciertos!`;
            } else {
                message = `¡+1! ¡Subiste de ${currentMarkedCount} a ${newMarkedCount} aciertos!`;
            }
            numberStatusDisplay.textContent = message;
            
            // Mostrar texto con el premio
            const resultText = isJackpot ? "¡+3 ACIERTOS!" : (isMultiplier ? "¡+2 ACIERTOS!" : "¡+1 ACIERTO!");
            showRouletteResult(resultText, true);
        }
        
        // Efectos visuales adicionales
        if (isJackpot) {
            console.log(`¡¡¡+3!!! ¡¡¡PREMIO MÁXIMO!!! 🌟🎉✨`);
            
            // Añadir un efecto visual al botón para el premio máximo
            spinButton.style.transition = 'all 0.3s';
            spinButton.style.backgroundColor = '#ff0000';
            spinButton.style.color = '#ffffff';
            spinButton.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.7)';
            spinButton.innerHTML = '<i class="fas fa-trophy"></i> ¡¡¡+3!!!';
        } else if (isMultiplier) {
            console.log(`¡+2! ¡Subiste 2 niveles de premio! 🏆`);
            
            // Añadir un efecto visual al botón para +2
            spinButton.style.transition = 'all 0.3s';
            spinButton.style.backgroundColor = '#ffaa00';
            spinButton.style.color = '#ffffff';
            spinButton.style.boxShadow = '0 0 15px rgba(255, 170, 0, 0.7)';
            spinButton.innerHTML = '<i class="fas fa-trophy"></i> ¡+2!';
        } else {
            console.log(`¡+1! ¡Subiste 1 nivel de premio! 🏆`);
            
            // Añadir un efecto visual al botón para +1
            spinButton.style.transition = 'all 0.3s';
            spinButton.style.backgroundColor = '#60ff00';
            spinButton.style.color = '#ffffff';
            spinButton.style.boxShadow = '0 0 15px rgba(96, 255, 0, 0.7)';
            spinButton.innerHTML = '<i class="fas fa-trophy"></i> ¡+1!';
        }
        
        // Restaurar el botón después de 5 segundos
        setTimeout(() => {
            spinButton.style.backgroundColor = '';
            spinButton.style.color = '';
            spinButton.style.boxShadow = '';
            spinButton.innerHTML = '<i class="fas fa-play"></i> Girar';
        }, 5000);
    }, animationDuration); // Duración de la animación
}

// Funciones para mostrar y ocultar el resultado de la ruleta
function showRouletteResult(text, isSpecial = false) {
    // Buscar o crear el elemento que mostrará el resultado
    let resultElement = document.getElementById('roulette-result');
    
    if (!resultElement) {
        resultElement = document.createElement('div');
        resultElement.id = 'roulette-result';
        
        // Estilos para el elemento de resultado
        resultElement.style.position = 'absolute';
        resultElement.style.top = '50%';
        resultElement.style.left = '50%';
        resultElement.style.transform = 'translate(-50%, -50%)';
        resultElement.style.padding = '10px 20px';
        resultElement.style.borderRadius = '5px';
        resultElement.style.fontWeight = 'bold';
        resultElement.style.fontSize = '1.5rem';
        resultElement.style.textAlign = 'center';
        resultElement.style.zIndex = '10';
        resultElement.style.transition = 'all 0.3s ease';
        
        // Añadir al contenedor de la ruleta
        const rouletteContainer = document.querySelector('.roulette-container') || document.body;
        rouletteContainer.appendChild(resultElement);
    }
    
    // Aplicar estilos según si es premio especial o no
    if (isSpecial) {
        resultElement.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        resultElement.style.color = '#ffffff';
        resultElement.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.7)';
        resultElement.style.animation = 'pulse 1s infinite alternate';
    } else {
        resultElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        resultElement.style.color = '#ffd700';
        resultElement.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        resultElement.style.animation = 'none';
    }
    
    // Mostrar el texto
    resultElement.textContent = text;
    resultElement.style.display = 'block';
    resultElement.style.opacity = '1';
    
    // Asegurar que la animación de pulso esté disponible
    addPulseAnimation();
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        hideRouletteResult();
    }, 5000);
}

function hideRouletteResult() {
    const resultElement = document.getElementById('roulette-result');
    if (resultElement) {
        resultElement.style.opacity = '0';
        setTimeout(() => {
            resultElement.style.display = 'none';
        }, 300);
    }
}

// Añadir estilos CSS para la animación pulsante
function addPulseAnimation() {
    // Verificar si ya existe el estilo
    if (!document.getElementById('pulse-animation-style')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'pulse-animation-style';
        styleElement.textContent = `
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(1); }
                100% { transform: translate(-50%, -50%) scale(1.1); }
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Llamar a la función para asegurar que la animación esté disponible
addPulseAnimation();