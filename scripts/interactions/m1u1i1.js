$(function () {
    init();
    if (sessionStorage.getItem('settings') != '') {
        loadSettings();
    } else {
        resetSettings();
    }
});

// TODO : mobile input
{
    window.addEventListener('touchstart', function (event) {
        //code for touchstart with event.pageX and event.pageY for location
    });

    window.addEventListener('touchmove', function (event) {
        //code for touchmove with event.pageX and event.pageY for location
    });

    window.addEventListener('touchend', function (event) {
        //code for touchend with event.pageX and event.pageY for location
    });
}


// ~-_-~ INITIALIZE ~-_-~
function init() {
    initElements(),
    initEventListeners()
}

function initElements() {
    canvas = document.getElementById('interaction');
    canvContext = canvas.getContext('2d');

    // otherwise canvas resolution scales too low
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 2; // alternatively: = window.innerHeight

    amountOfBallsSlider = document.getElementById('amountOfBalls');
    amountOfBallsSlider.value = amountOfBalls;

    horDistanceSlider = document.getElementById('horizontalDistance');
    horDistanceSlider.value = horizontalDistance;


    vertDistanceSlider = document.getElementById('verticalDistance');
    vertDistanceSlider.value = verticalDistance;
}

function initEventListeners() {
    amountOfBallsSlider.oninput = function () {
        amountOfBalls = parseInt(this.value);
        draw();
        saveSettings();
    }
    horDistanceSlider.oninput = function () {
        horizontalDistance = parseInt(this.value);
        draw();
        saveSettings();
    }
    vertDistanceSlider.oninput = function () {
        verticalDistance = parseInt(this.value);
        draw();
        saveSettings();
    }
    document.getElementById('reset').onclick = function () {
        resetSettings();
    }
    window.addEventListener('keydown', function (k) {
        switch (k.keyCode) {
            case 82: // r key
                resetSettings();
                break;
            case 65: // a key
                horizontalDistance -= 1;
                if (horizontalDistance < 300) {
                    horizontalDistance = 300;
                }
                horDistanceSlider.value = horizontalDistance;
                draw();
                saveSettings();
                break;
            case 68: // d key
                horizontalDistance += 1;
                if (horizontalDistance > 1000) {
                    horizontalDistance = 1000;
                }
                horDistanceSlider.value = horizontalDistance;
                draw();
                saveSettings();
                break;
            case 87: // w key
                verticalDistance += 1;
                if (verticalDistance > 1000) {
                    verticalDistance = 1000;
                }
                vertDistanceSlider.value = verticalDistance;
                draw();
                saveSettings();
                break;
            case 83: // s key
                verticalDistance -= 1;
                if (verticalDistance < 300) {
                    verticalDistance = 300;
                }
                vertDistanceSlider.value = verticalDistance;
                draw();
                saveSettings();
                break;
            case 69: // e key
                amountOfBalls += 1;
                if (amountOfBalls > 20) {
                    amountOfBalls = 20;
                }
                amountOfBallsSlider.value = amountOfBalls;
                draw();
                saveSettings();
                break;
            case 81: // q key
                amountOfBalls -= 1;
                if (amountOfBalls < 2) {
                    amountOfBalls = 2;
                }
                amountOfBallsSlider.value = amountOfBalls;
                draw();
                saveSettings();
                break;
        }
    });
}


// ~-_-~ SETTINGS ~-_-~
function loadSettings() {
    var paramList = sessionStorage.getItem('settings').split('&'); //[FPS=30, visibilitySwitched=false, ...]
    console.log(paramList);
    if (paramList.length == 4) {
        amountOfBalls = parseInt(paramList[0].split('=')[1]);
        amountOfBallsSlider.value = amountOfBalls;
        ballSize = parseInt(paramList[1].split('=')[1]);
        horizontalDistance = parseInt(paramList[2].split('=')[1]);
        horDistanceSlider.value = horizontalDistance;
        verticalDistance = parseInt(paramList[3].split('=')[1]);
        vertDistanceSlider.value = verticalDistance;
        draw();
    } else {
        resetSettings();
    }
}

function resetSettings() {
    amountOfBalls = 9;
    document.getElementById('amountOfBalls').value = amountOfBalls;
    ballSize = 30;
    horizontalDistance = 1000;
    document.getElementById('horizontalDistance').value = horizontalDistance;
    verticalDistance = 1000;
    document.getElementById('verticalDistance').value = verticalDistance;
    draw();
    saveSettings();
    console.log('resetted!')
}

function saveSettings() {
    sessionStorage.setItem('settings', 'amountOfBalls=' + amountOfBalls + '&ballSize=' + ballSize + '&horizontalDistance=' + horizontalDistance + '&verticalDistance=' + verticalDistance);
}


// ~-_-~ VISUALIZATION ~-_-~
function draw() {
    canvContext.clearRect(0, 0, canvas.width, canvas.height);
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fillRect(0, 0, canvas.width, canvas.height);
    canvContext.fillStyle = getDefaultColor('shape');
    leftBorder = (0.5 * canvas.width - 0.5 * canvas.height);
    for (i = 1; i <= amountOfBalls; i++) { //rows
        if (i == 1) {
            currentHeight = (canvas.height / amountOfBalls) - ((canvas.height / amountOfBalls) / 2);
        } else {
            currentHeight = currentHeight + (verticalDistance / 1000) * (canvas.height / amountOfBalls);
        }
        for (j = 0; j <= amountOfBalls - 1; j++) { //columns
            if (j == 0) {
                currentWidth = leftBorder;
            } else {
                currentWidth = currentWidth + (horizontalDistance / 1000) * (canvas.height / amountOfBalls);
            }
            canvContext.beginPath();
            canvContext.arc(currentWidth, currentHeight, (0.005 * ballSize * canvas.height) / amountOfBalls, 0, 2 * Math.PI);
            canvContext.fill();
        }
    }
    //requestAnimationFrame(draw);
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

//setInterval(draw(), 1000);


// ~-_-~ CURRENT VERSION ~-_-~ 
console.log('<m1u1i1> v1.0.4')
