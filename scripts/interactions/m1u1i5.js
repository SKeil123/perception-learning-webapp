$(function () {
    if (sessionStorage.getItem('settings') != '') {
        loadSettings();
    } else {
        resetSettings();
    }
    init();
    draw();
});


// ~-_-~ INITIALIZE ~-_-~
function init() {
    initElements();
    initEventListeners();
}

function initElements() {
    verticalSpacingSlider = document.getElementById('verticalSpacing');
    canvas = document.getElementById('interaction');
    canvContext = canvas.getContext('2d');

    // otherwise canvas resolution scales too low
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 2; // alternatively: = window.innerHeight*/
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canWidth = canvas.width * (1 - 2 * canvasPadding / 1000);
    figWidth = canWidth / 5;
}

function initEventListeners() {
    verticalSpacingSlider.oninput = function () {
        verticalSpacing = parseInt(this.value);
        draw();
        saveSettings();
    }
    document.getElementById('continuation').onclick = function () {
        switchMode();
    }
    document.getElementById('switchFigure').onclick = function () {
        switchFigure();
    }
    document.getElementById('reset').onclick = function () {
        resetSettings();
        draw();
    }
    window.addEventListener('keydown', function (k) {
        switch (k.keyCode) {
            case 82: // r key
                resetSettings();
                draw();
                break;
            case 70: //f key
                switchFigure();
                break;
            case 84: //t key
                switchMode();
                break;
            case 87: // w key
                verticalSpacing += 10;
                if (verticalSpacing > 1000) {
                    verticalSpacing = 1000;
                }
                verticalSpacingSlider.value = verticalSpacing;
                draw();
                saveSettings();
                break;
            case 83: // s key
                verticalSpacing -= 10;
                if (verticalSpacing < 1) {
                    verticalSpacing = 1;
                }
                verticalSpacingSlider.value = verticalSpacing;
                draw();
                saveSettings();
                break;
        }
    });
}

function switchMode() {
    if (mode == 0) {
        console.log("switchMode Mode 0"); // Debugging output
        //explanationLabel.textContent = languages[localStorage.getItem('lang')]['explanationButton'];
        mode = 1;
    } else if (mode == 1) {
        console.log("switchMode Mode 1"); // Debugging output
        //explanationLabel.textContent = languages[localStorage.getItem('lang')]['instructionButton'];
        mode = 0;
    }
    verticalSpacing = 0;
    verticalSpacingSlider.value = verticalSpacing;
    draw();
    saveSettings();
}

function switchFigure() {
    if (figure != 2) {
        figure++;
    } else {
        figure = 0;
    }
    console.log("Switched to figure:", figure); // Debugging output
    draw();
    saveSettings();
}


// ~-_-~ SETTINGS ~-_-~
function loadSettings() {
    var paramList = sessionStorage.getItem('settings').split('&'); //[canvasPadding=50, verticalSpacing=0, ...]
    console.log(paramList);
    if (paramList.length == 5) {
        canvasPadding = parseInt(paramList[0].split('=')[1]);
        verticalSpacing = parseInt(paramList[1].split('=')[1]);
        if (verticalSpacing < 0 || verticalSpacing > 1000) {
            console.log('Invalid "verticalSpacing" URL-parameter! | verticalSpacing="' + verticalSpacing + '" [Valid value = between "0" and "1000"]');
            verticalSpacing = 0;
        }
        borderWidth = parseInt(paramList[2].split('=')[1]);
        mode = parseInt(paramList[3].split('=')[1]);
        if (![0, 1, 2].includes(mode)) {
            console.log('Invalid "mode" URL-parameter! | mode="' + mode + '" [Valid value = "0", "1" and "2"]');
            mode = 0;
        }
        figure = parseInt(paramList[4].split('=')[1]);
        if (![0, 1, 2].includes(figure)) {
            console.log('Invalid "figure" URL-parameter! | figure="' + figure + '" [Valid value = "0", "1" and "2"]');
            mode = 0;
        }
    } else {
        resetSettings();
    }
}

function resetSettings() {
    canvasPadding = 50; // 50 = 5%
    verticalSpacing = 0; // 0 = 0%
    document.getElementById('verticalSpacing').value = verticalSpacing;
    borderWidth = 5;
    mode = 0; //0 = standard | 1 = version 1| 2 = version 2
    figure = 0;
    saveSettings();
}

function saveSettings() {
    sessionStorage.setItem('settings', 'canvasPadding=' + canvasPadding + '&verticalSpacing=' + verticalSpacing + '&borderWidth=' + borderWidth + '&mode=' + mode + '&figure=' + figure);
}


// ~-_-~ VISUALIZATION ~-_-~
function draw() {
    canvContext.clearRect(0, 0, canvas.width, canvas.height);
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fillRect(0, 0, canvas.width, canvas.height);

    newSpacing = -(canvas.height / 2 - .5 * figWidth - canvas.height * (canvasPadding / 1000)) * (verticalSpacing / 1000);
    switch (figure) {
        case 0:
            drawFigure1(newSpacing);
            break;
            case 1:
                drawFigure2(newSpacing); // Ensure this function is defined
                break;
            case 2:
                drawFigure3(newSpacing); // Ensure this function is defined
                break;
            default:
                console.log("Invalid figure value");
    }
}

function getDefaultColor(type) {
    const defaultColor = window.getComputedStyle(canvas).getPropertyValue('--default-' + type + '-color');
    if (defaultColor) {
        //console.log(type + ': ' + window.getComputedStyle(canvas).getPropertyValue('--default-' + type +'-color'));
        return defaultColor;
    } else {
        setTimeout(getDefaultColor(type), 250); // Retry after a delay of 250ms
    }
}

function drawFigure1(newSpacing) {
    //console.log("Drawing Figure 1 with newSpacing:", newSpacing);
    drawLine1();
    switch (mode) {
        case 0: 
            drawLine2(newSpacing);
            drawLine3();
            break;
        case 1: 
            drawLine2();
            drawLine3(newSpacing);
            break;
    }
    drawLine4(newSpacing);
}


// used to draw fig1
function drawLine1(spacing = 0) {
    startX = canvas.width * (canvasPadding / 1000);
    startY = (canvas.height / 2 + .5 * figWidth) + spacing;
    for (i = 0; i < 5; i++) {
        if (i % 2 == 0) {
            canvContext.beginPath();
            canvContext.moveTo(startX, startY);
            startX = startX + figWidth;
            canvContext.lineTo(startX, startY);
            canvContext.closePath();
            canvContext.fillStyle = getDefaultColor('bg');
            canvContext.fill();
            canvContext.strokeStyle = getDefaultColor('shape');
            canvContext.lineWidth = borderWidth;
            canvContext.stroke();
        } else {
            canvContext.beginPath();
            canvContext.moveTo(startX, startY);
            canvContext.lineTo(startX, startY - .5 * figWidth);
            startX = startX + figWidth;
            canvContext.moveTo(startX, startY);
            canvContext.lineTo(startX, startY - .5 * figWidth);
            canvContext.closePath();
            canvContext.fillStyle = getDefaultColor('bg');
            canvContext.fill();
            canvContext.strokeStyle = getDefaultColor('shape');
            canvContext.lineWidth = borderWidth;
            canvContext.stroke();
        }
    }
}

function drawLine2(spacing = 0) {
    startX = canvas.width * (canvasPadding / 1000) + figWidth;
    startY = (canvas.height / 2 - .5 * figWidth) + spacing;
    for (i = 0; i < 2; i++) {
        canvContext.beginPath();
        canvContext.moveTo(startX, startY);
        canvContext.lineTo(startX, startY + .5 * figWidth);
        canvContext.moveTo(startX, startY);
        startX = startX + figWidth;
        canvContext.lineTo(startX, startY);
        canvContext.moveTo(startX, startY);
        canvContext.lineTo(startX, startY + .5 * figWidth);
        canvContext.fillStyle = getDefaultColor('bg');
        canvContext.fill();
        canvContext.strokeStyle = getDefaultColor('shape');
        canvContext.lineWidth = borderWidth;
        canvContext.stroke();
        startX = startX + figWidth;
    }
}

function drawLine3(spacing = 0) {
    startX = canvas.width * (canvasPadding / 1000) + figWidth;
    startY = (canvas.height / 2) + spacing;
    for (i = 0; i < 2; i++) {
        canvContext.beginPath();
        canvContext.moveTo(startX, startY);
        canvContext.lineTo(startX + .5 * figWidth, startY + .5 * figWidth);
        startX = startX + figWidth;
        canvContext.moveTo(startX, startY);
        canvContext.lineTo(startX - .5 * figWidth, startY + .5 * figWidth);
        canvContext.fillStyle = getDefaultColor('bg');
        canvContext.fill();
        canvContext.strokeStyle = getDefaultColor('shape');
        canvContext.lineWidth = borderWidth;
        canvContext.stroke();
        startX = startX + figWidth;
    }
}

function drawLine4(spacing = 0) {
    startX = canvas.width * (canvasPadding / 1000) + figWidth;
    startY = (canvas.height / 2) + spacing;
    canvContext.beginPath();
    canvContext.moveTo(startX, startY);
    canvContext.lineTo(startX - .5 * figWidth, startY - .5 * figWidth);
    canvContext.moveTo(startX - figWidth, startY);
    canvContext.lineTo(startX - .5 * figWidth, startY - .5 * figWidth);
    canvContext.moveTo(startX + figWidth, startY);
    canvContext.lineTo(startX + 1.5 * figWidth, startY - .5 * figWidth);
    canvContext.moveTo(startX + 2 * figWidth, startY);
    canvContext.lineTo(startX + 1.5 * figWidth, startY - .5 * figWidth);
    canvContext.moveTo(startX + 3 * figWidth, startY);
    canvContext.lineTo(startX + 3.5 * figWidth, startY - .5 * figWidth);
    canvContext.moveTo(startX + 4 * figWidth, startY);
    canvContext.lineTo(startX + 3.5 * figWidth, startY - .5 * figWidth);
    canvContext.closePath();
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fill();
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
}

//the following functions are used to draw figure2

function drawFigure2(newSpacing) { 
    console.log("Drawing Figure 2");
    switch (mode) {
        case 0: 
            drawZigzagLine2(newSpacing);
            drawZigzagLine3(newSpacing);
            break;
        case 1: 
            drawZigzagLine1();
            drawHalfCircle(newSpacing);
            break;
    }
} 

function drawZigzagLine1(spacing = 0) {
      console.log("drawZigzagLine1 called");
    
    // Use relative measurements based on the canvas size
    const startY = (canvas.height / 2) + spacing; // Starting Y position
    const zigzagHeight = canvas.height * 0.05; // Height of each zigzag peak as a percentage of canvas height
    const segmentLength = canvas.width * 0.1; // Length of each zigzag segment as a percentage of canvas width

    // Calculate the starting X position to center the zigzag line
    const totalZigzagWidth = Math.floor((canvas.width / 2) / segmentLength) * segmentLength; // Total width of the zigzag pattern
    const startX = (canvas.width / 2) - (totalZigzagWidth / 2); // Center the zigzag line

    canvContext.beginPath();
    canvContext.moveTo(startX, startY); // Move to the starting point

    // Create a series of "V" shapes
    const numberOfZigzags = Math.floor(totalZigzagWidth / segmentLength); // Calculate how many zigzags fit
    for (let i = 0; i < numberOfZigzags; i++) { // Loop to create the zigzag shapes
        const newStartX = startX + (i * segmentLength); // Calculate new X position

        // Draw down to create the left side of the "V"
        canvContext.lineTo(newStartX + (segmentLength / 2), startY + zigzagHeight);

        // Draw up to create the right side of the "V"
        canvContext.lineTo(newStartX + segmentLength, startY);
    }

    canvContext.strokeStyle = getDefaultColor('shape'); // Set the stroke color
    canvContext.lineWidth = borderWidth; // Set the line width
    canvContext.stroke(); // Draw the zigzag line
}

function drawZigzagLine2(spacing = 0) {
    console.log("drawZigzagLine2 called");

    // Use relative measurements based on the canvas size
    const startY = (canvas.height / 2) + spacing; // Starting Y position
    const zigzagHeight = canvas.height * 0.05; // Height of each zigzag peak as a percentage of canvas height
    const segmentLength = canvas.width * 0.1; // Length of each zigzag segment as a percentage of canvas width

    // Calculate the starting X position to center the zigzag line
    const totalZigzagWidth = Math.floor((canvas.width / 2) / segmentLength) * segmentLength / 2; // Total width of the zigzag pattern (halved)
    const startX = (canvas.width / 2) - (totalZigzagWidth) + spacing; // Center the zigzag line

    canvContext.beginPath();
    canvContext.moveTo(startX, startY); // Move to the starting point

    // Create a series of "V" shapes
    const numberOfZigzags = Math.floor(totalZigzagWidth / segmentLength); // Calculate how many zigzags fit
    for (let i = 0; i < numberOfZigzags; i++) { // Loop to create the zigzag shapes
        const newStartX = startX + (i * segmentLength); // Calculate new X position

        // Draw down to create the left side of the "V"
        canvContext.lineTo(newStartX + (segmentLength / 2), startY + zigzagHeight);

        // Draw up to create the right side of the "V"
        canvContext.lineTo(newStartX + segmentLength, startY);
    }

    canvContext.strokeStyle = getDefaultColor('shape'); // Set the stroke color
    canvContext.lineWidth = borderWidth; // Set the line width
    canvContext.stroke(); // Draw the zigzag line

     // Draw quarter circle at the end of the zigzag line
     drawUpperQuarterCircle(spacing);

}

function drawZigzagLine3(spacing = 0) {
    console.log("drawZigzagLine3 called");

    // Use relative measurements based on the canvas size
    const startY = (canvas.height / 2) + spacing; // Starting Y position
    const zigzagHeight = canvas.height * 0.05; // Height of each zigzag peak as a percentage of canvas height
    const segmentLength = canvas.width * 0.1; // Length of each zigzag segment as a percentage of canvas width

    // Calculate the starting X position to center the zigzag line
    const totalZigzagWidth = Math.floor((canvas.width / 2) / segmentLength) * segmentLength / 2; // Total width of the zigzag pattern (halved)
    let startX = (canvas.width / 2) - (totalZigzagWidth); // Center the zigzag line
    // Create a series of "V" shapes
    const numberOfZigzags = Math.floor(totalZigzagWidth / segmentLength); // Calculate how many zigzags fit
    startX = startX + segmentLength*numberOfZigzags - spacing;

    // Draw quarter circle at the start of the zigzag line
    drawLowerQuarterCircle(spacing);

    canvContext.beginPath();
    canvContext.moveTo(startX, startY); // Move to the starting point

    for (let i = 0; i < numberOfZigzags; i++) { // Loop to create the zigzag shapes
        const newStartX = startX + (i * segmentLength); // Calculate new X position

        // Draw down to create the left side of the "V"
        canvContext.lineTo(newStartX + (segmentLength / 2), startY + zigzagHeight);

        // Draw up to create the right side of the "V"
        canvContext.lineTo(newStartX + segmentLength, startY);
    }

    canvContext.strokeStyle = getDefaultColor('shape'); // Set the stroke color
    canvContext.lineWidth = borderWidth; // Set the line width
    canvContext.stroke(); // Draw the zigzag line
}

function drawHalfCircle(spacing = 0){
    const radius = canvas.height*0.1;
    const centerX = canvas.width/2 - radius - spacing; //it can be moved right with spacing
    const zigY = (canvas.height / 2);
    const zigzagHeight = canvas.height * 0.05;
    const centerY = zigY + zigzagHeight;
   
    canvContext.beginPath();
    canvContext.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI / 2, false); // Draw half-circle opening to the left
    canvContext.strokeStyle = 'black'; // Set stroke color
    canvContext.lineWidth = borderWidth; // Set line width
    canvContext.stroke(); // Render the half-circle

}

function drawUpperQuarterCircle(spacing = 0){
    const radius = canvas.height * 0.1;
    const centerX = canvas.width / 2 - 1.6*radius + spacing;
    const zigY = (canvas.height / 2);
    const zigzagHeight = canvas.height * 0.05;
    const centerY = zigY + zigzagHeight - 0.5*radius + spacing;

    canvContext.beginPath();
    canvContext.arc(centerX, centerY, radius, -Math.PI / 2, 0, false); // Draw upper half-circle
    canvContext.strokeStyle = 'black';
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
}


function drawLowerQuarterCircle(spacing = 0){
    const radius = canvas.height * 0.1;
    const centerX = canvas.width / 2 - 1.6*radius - spacing;
    const zigY = (canvas.height / 2);
    const zigzagHeight = canvas.height * 0.05;
    const centerY = zigY + zigzagHeight - 0.5*radius + spacing;

    canvContext.beginPath();
    canvContext.arc(centerX, centerY, radius, 0, Math.PI / 2, false); // Draw lower half-circle
    canvContext.strokeStyle = 'black';
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
}

//Functions for figure3

function drawFigure3(newSpacing) {
    //console.log("Drawing Figure 3 with newSpacing:", newSpacing);
    switch (mode) {
        case 0: //not "good" continuation
            drawRightFacingPart(newSpacing);
            drawLeftFacingPart(newSpacing);
            break;
        case 1: //good continuation toggled on
            drawCosineWave(newSpacing);
            drawFlippedCosineWave(newSpacing);
            break;
    }
}


function drawCosineWave(spacing = 0) {
    const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
    const frequency = 1; // Frequency of the cosine wave
    const startY = (canvas.height / 2) + spacing; // Starting Y position
    
    // Calculate the padding from the canvas edges
    const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
    const rightPadding = leftPadding; // Equal distance from the right edge
    const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

    canvContext.beginPath();
    
    // Start at the peak
    const initialX = leftPadding; // Starting X position
    const initialY = startY - amplitude; // Start at the peak (y = startY - amplitude)

    // Draw the cosine wave from the peak to the first valley
    const step = 0.1; // Increment by small steps for smoothness

    // Draw from x = 0 to x = π (first valley)
    for (let x = 0; x <= Math.PI; x += step) { 
        const y = startY - amplitude * Math.cos(x); // Normal cosine wave calculation
        // Scale x to fit the usable width
        const scaledX = leftPadding + (x * (usableWidth / Math.PI)); 
        // Only move to the first point, then draw from there
        if (x === 0) {
            canvContext.moveTo(scaledX, y); // Move to the initial point
        } else {
            canvContext.lineTo(scaledX, y);
        }
    }

    // Set the dotted line style
    canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
    canvContext.setLineDash([]); // Reset to solid line
}

function drawFlippedCosineWave(spacing = 0) {
    const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
    const frequency = 1; // Frequency of the cosine wave
    const startY = (canvas.height / 2) - spacing; // Starting Y position
    
    // Calculate the padding from the canvas edges
    const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
    const rightPadding = leftPadding; // Equal distance from the right edge
    const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

    canvContext.beginPath();
    
    // Start at the valley
    const initialY = startY + amplitude; // Start at the valley (y = startY + amplitude)

    // Draw the flipped cosine wave from the valley to the first peak
    const step = 0.1; // Increment by small steps for smoothness

    // Draw from x = 0 to x = π (first peak)
    for (let x = 0; x <= Math.PI; x += step) { 
        const y = startY + amplitude * Math.cos(x); // Flipped cosine wave calculation
        // Scale x to fit the usable width
        const scaledX = leftPadding + (x * (usableWidth / Math.PI)); 
        // Only move to the first point, then draw from there
        if (x === 0) {
            canvContext.moveTo(scaledX, y); // Move to the initial point
        } else {
            canvContext.lineTo(scaledX, y);
        }
    }

    // Set the dotted line style
    canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
    canvContext.setLineDash([]); // Reset to solid line
}

function drawHalfCosineWave(spacing = 0) {
    const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
    const frequency = 1; // Frequency of the cosine wave
    const startY = (canvas.height / 2) + spacing; // Starting Y position
    
    // Calculate the padding from the canvas edges
    const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
    const rightPadding = leftPadding; // Equal distance from the right edge
    const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

    canvContext.beginPath();
    
    // Start at the peak
    const initialX = leftPadding; // Starting X position
    const initialY = startY - amplitude; // Start at the peak (y = startY - amplitude)

    // Draw the cosine wave only up to the midpoint
    const step = 0.1; // Increment by small steps for smoothness
    const halfPi = (Math.PI / 2) + 0.03; // Halfway point in the cosine wave (to the first valley)

    // Draw from x = 0 to x = π/2 (midpoint)
    for (let x = 0; x <= halfPi; x += step) { 
        const y = startY - amplitude * Math.cos(x); // Normal cosine wave calculation
        // Scale x to fit the usable width
        const scaledX = leftPadding + (x * (usableWidth / Math.PI)); 
        // Only move to the first point, then draw from there
        if (x === 0) {
            canvContext.moveTo(scaledX, y); // Move to the initial point
        } else {
            canvContext.lineTo(scaledX, y);
        }
    }

    // Set the dotted line style
    canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
    canvContext.setLineDash([]); // Reset to solid line
}

function drawFlippedFirstHalfCosineWave(spacing = 0) {
    const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
    const startY = (canvas.height / 2) - spacing; // Starting Y position
    
    // Calculate the padding from the canvas edges
    const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
    const rightPadding = leftPadding; // Equal distance from the right edge
    const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

    canvContext.beginPath();
    
    // Start at the valley
    const initialY = startY + amplitude; // Start at the valley (y = startY + amplitude)

    // Draw the flipped cosine wave from the valley to the midpoint (π/2)
    const step = 0.1; // Increment by small steps for smoothness
    const halfPi = (Math.PI / 2) + 0.03; // Midpoint

    // Draw from x = 0 to x = π/2 (first half)
    for (let x = 0; x <= halfPi; x += step) { 
        const y = startY + amplitude * Math.cos(x); // Flipped cosine wave calculation
        // Scale x to fit the usable width
        const scaledX = leftPadding + (x * (usableWidth / Math.PI)); 
        // Only move to the first point, then draw from there
        if (x === 0) {
            canvContext.moveTo(scaledX, y); // Move to the initial point
        } else {
            canvContext.lineTo(scaledX, y);
        }
    }

    // Set the dotted line style
    canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
    canvContext.setLineDash([]); // Reset to solid line
}



function drawSecondHalfCosineWave(spacing = 0) {
    const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
    const frequency = 1; // Frequency of the cosine wave
    const startY = (canvas.height / 2) + spacing; // Starting Y position
    
    // Calculate the padding from the canvas edges
    const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
    const rightPadding = leftPadding; // Equal distance from the right edge
    const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

    canvContext.beginPath();
    
    // Draw the cosine wave only from the midpoint to the first valley
    const step = 0.1; // Increment by small steps for smoothness
    const halfPi = Math.PI / 2; // Midpoint
    const fullPi = Math.PI; // First valley

    // Draw from x = π/2 to x = π (second half)
    for (let x = halfPi; x <= fullPi; x += step) { 
        const y = startY - amplitude * Math.cos(x); // Normal cosine wave calculation
        // Scale x to fit the usable width
        const scaledX = leftPadding + (x * (usableWidth / Math.PI)); 
        // Only move to the first point, then draw from there
        if (x === halfPi) {
            canvContext.moveTo(scaledX, y); // Move to the initial point
        } else {
            canvContext.lineTo(scaledX, y);
        }
    }

    // Set the dotted line style
    canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
    canvContext.setLineDash([]); // Reset to solid line
}

function drawFlippedSecondHalfCosineWave(spacing = 0) {
    const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
    const startY = (canvas.height / 2) - spacing; // Starting Y position
    
    // Calculate the padding from the canvas edges
    const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
    const rightPadding = leftPadding; // Equal distance from the right edge
    const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

    canvContext.beginPath();
    
    // Draw the flipped cosine wave from the first peak to the valley (π/2 to π)
    const step = 0.1; // Increment by small steps for smoothness
    const halfPi = Math.PI / 2; // First peak
    const fullPi = Math.PI; // Valley

    // Draw from x = π/2 to x = π (second half)
    for (let x = halfPi; x <= fullPi; x += step) { 
        const y = startY + amplitude * Math.cos(x); // Flipped cosine wave calculation
        // Scale x to fit the usable width
        const scaledX = leftPadding + (x * (usableWidth / Math.PI)); 
        // Only move to the first point, then draw from there (no straight lines to starting point of wave!)
        if (x === halfPi) {
            canvContext.moveTo(scaledX, y); // Move to the initial point
        } else {
            canvContext.lineTo(scaledX, y);
        }
    }

    // Set the dotted line style
    canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
    canvContext.setLineDash([]); // Reset to solid line
}


function drawRightFacingPart(spacing = 0) {
    drawHalfCosineWave(spacing);
    drawFlippedFirstHalfCosineWave(-spacing);
}

function drawLeftFacingPart(spacing = 0) {
    drawSecondHalfCosineWave(-spacing);
    drawFlippedSecondHalfCosineWave(spacing);
}



// ~-_-~ CURRENT VERSION ~-_-~ 
console.log('<m1u1i5> v1.0.0');