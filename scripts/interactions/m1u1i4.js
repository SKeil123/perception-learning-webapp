$(function () {
    init();
    if (sessionStorage.getItem('settings') != '') {
        loadSettings();
    } else {
        resetSettings();
    }
    animate();
});


// ~-_-~ INITIALIZE ~-_-~
function init() {
    initElements(),
    initEventListeners()
}

function initElements() {
    amountOfBallsSlider = document.getElementById('amountOfBalls');
    speedSlider = document.getElementById('speed');
    canvas = document.getElementById('interaction');
    canvContext = canvas.getContext('2d');

    // otherwise canvas resolution scales too low
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 2; // alternatively: = window.innerHeight
}

function initEventListeners() {
    amountOfBallsSlider.oninput = function () {
        amountOfBalls = parseInt(this.value);
        ballStates = generateRandomBallStates();
        started = false;
        document.getElementById('start').value = '⏵';
        draw();
        saveSettings();
    }
    speedSlider.oninput = function () {
        speed = parseInt(this.value);
        saveSettings();
    }
    document.getElementById('start').onclick = function () {
        startStop();
    }
    document.getElementById('generateNewMovement').onclick = function () {
        generateNewMovement();
    }
    document.getElementById('reset').onclick = function () {
        resetSettings();
    }
    window.addEventListener('keydown', function (k) {
        switch (k.keyCode) {
            case 82: // r key
                resetSettings();
                break;
            case 70: //f key
                generateNewMovement();
                break;
            case 84: //t key
                startStop();
                break;
            case 69: // e key
                addOrRemoveBallState(1);
                break;
            case 81: // q key
                addOrRemoveBallState(0);
                break;
            case 87: // w key
                speed += 10;
                if (speed > 1000) {
                    speed = 1000;
                }
                speedSlider.value = speed;
                saveSettings();
                break;
            case 83: // s key
                speed -= 10;
                if (speed < 1) {
                    speed = 1;
                }
                speedSlider.value = speed;
                saveSettings();
                break;
        }
    });
}

function startStop() {
    started = !started;
    if (started) {
        document.getElementById('start').value = '⏸';
    } else {
        document.getElementById('start').value = '⏵';
    }
}

// generate a random array of size amountOfBalls with only 0 or 1 but at least one 1 and one 0
function generateRandomBallStates() {
    satisfied = false;
    while (!satisfied) {
        result = []
        for (i = 0; i < amountOfBalls; i++) {
            result.push(Math.round(Math.random()));
        }
        satisfied = result.includes(0) && result.includes(1);
    }
    return result;
}

function addOrRemoveBallState(state) {
    switch (state) {
        case 0: //remove state
            if (amountOfBalls > 2) {
                amountOfBalls--;
                lastBallPos.pop();
                ballStates.pop();
            }
            break;
        case 1: //add state
            if (amountOfBalls < 20) {
                delay = Infinity;
                newState = Math.round(Math.random());
                storedStates = sessionStorage.getItem('settings').split('&')[5].split('=')[1].split(',').map(Number);
                lastBallPos.push(lastBallPos[storedStates.findIndex(ball => ball === newState)]);
                ballStates.push(newState);
                amountOfBalls++;
                draw();
                delay = 1;
            }
            break;
    }
    saveSettings();
    draw();
}

function generateNewMovement() {
    ballStates = generateRandomBallStates();
    saveSettings();
    started = false;
    draw();
}


// ~-_-~ SETTINGS ~-_-~
function loadSettings() {
    var paramList = sessionStorage.getItem('settings').split('&'); //[amountOfBalls=9, ballSize=30, ...]
    console.log(paramList);
    if (paramList.length == 7) {
        fps = parseInt(paramList[0].split('=')[1]);
        speed = parseInt(paramList[1].split('=')[1]);
        speedSlider.value = speed;
        canvasPadding = parseInt(paramList[2].split('=')[1]);
        amountOfBalls = parseInt(paramList[3].split('=')[1]);
        amountOfBallsSlider.value = amountOfBalls;
        ballDistance = parseInt(paramList[4].split('=')[1]);
        offset = parseInt(paramList[5].split('=')[1]);
        ballStates = paramList[6].split('=')[1].split(',')[0].split('%2C').map(Number);
        saveSettings();
        started = false;
        then = Date.now();
        lastBallPos = Array(amountOfBalls);
        delay = 1;
        draw();
    } else {
        resetSettings();
    }
}

function resetSettings() {
    fps = 30;
    speed = 200;
    speedSlider.value = speed;
    canvasPadding = 50; //50 = 5% padding left + 5% padding right
    amountOfBalls = 9;
    amountOfBallsSlider.value = amountOfBalls;
    ballDistance = 100; //100 = 10%
    offset = 200; //200 = 20%
    ballStates = generateRandomBallStates();
    saveSettings();
    started = false;
    then = Date.now();
    lastBallPos = Array(amountOfBalls);
    delay = 1;
    draw();
    console.log('resetted!')
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + fps + '&speed=' + speed + '&canvasPadding=' + canvasPadding + '&amountOfBalls=' + amountOfBalls + '&ballDistance=' + ballDistance + '&offset=' + offset  + '&ballStates=' + ballStates);
}


// ~-_-~ VISUALIZATION ~-_-~
function draw() {
    canvContext.clearRect(0, 0, canvas.width, canvas.height);
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fillRect(0, 0, canvas.width, canvas.height);
    canvContext.fillStyle = getDefaultColor('shape');
    canWidth = canvas.width * (1 - 2 * canvasPadding / 1000);
    leftBorder = getLeftBorder(canWidth);
    ballRadius = getBallRadius(canWidth);
    for (i = 0; i <= amountOfBalls - 1; i++) {
        if (i == 0) {
            currentWidth = leftBorder;
        } else {
            currentWidth = currentWidth + 2 * ballRadius;
        }
        if (started) {
            minY =  canvas.height / 2 - offset / 1000 * canvas.height / 2;
            maxY =  canvas.height / 2 - offset / 1000 * canvas.height / 2 + 2 * (offset / 1000 * canvas.height / 2);

            if (ballStates[i] == 0 && lastBallPos[i] < maxY) {
                ballY = lastBallPos[i] + 1;
            } else if (ballStates[i] == 0 && lastBallPos[i] >= maxY) {
                ballStates[i] = 1;
                ballY = lastBallPos[i] - 1;
            } else if (ballStates[i] == 1 && lastBallPos[i] > minY) {
                ballY = lastBallPos[i] - 1;
            } else if (ballStates[i] == 1 && lastBallPos[i] <= minY) {
                ballStates[i] = 0;
                ballY = lastBallPos[i] + 1;
            }
            lastBallPos[i] = ballY;
        } else {
            ballY = canvas.height / 2 - offset / 1000 * canvas.height / 2 + ballStates[i] * 2 * (offset / 1000 * canvas.height / 2);
            lastBallPos[i] = ballY;
        }
        canvContext.beginPath();
        canvContext.arc(currentWidth, ballY, ballRadius, 0, 2 * Math.PI);
        canvContext.fill();
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

function getLeftBorder(canWidth) {
    return (canvas.width - canWidth) / 2 + getBallRadius(canWidth);
}

function getBallRadius(canWidth) {
    return canWidth / amountOfBalls / 2;
}

function animate() {
    requestAnimationFrame(animate);
    
    now = Date.now();
    elapsed = now - then;
        
    if (elapsed > (speed / fps) * delay) {
        then = now;
        draw();
    }
}


// ~-_-~ CURRENT VERSION ~-_-~ 
console.log('<m1u1i4> v1.0.1')
