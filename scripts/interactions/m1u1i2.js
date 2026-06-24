$(function () {
    init();
    if (sessionStorage.getItem('settings') != '') {
        loadSettings();
    } else {
        resetSettings();
    }
});


// ~-_-~ INITIALIZE ~-_-~
function init() {
    initElements(),
        initEventListeners()
}

function initElements() {
    instructionField = document.getElementById('instructionField');
    modeLabel = document.getElementById('mode');
    saturationDiv = document.getElementById('saturationDiv')
    canvas = document.getElementById('interaction');
    canvContext = canvas.getContext('2d');

    // otherwise canvas resolution scales too low
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 2; // alternatively: = window.innerHeight

    amountOfBallsSlider = document.getElementById('amountOfBalls');
    amountOfBallsSlider.value = amountOfBalls;

    saturationSlider = document.getElementById('saturation');
    saturationSlider.value = saturation;
}

function initEventListeners() {
    amountOfBallsSlider.oninput = function () {
        amountOfBalls = parseInt(this.value);
        draw();
        saveSettings();
    }
    saturationSlider.oninput = function () {
        saturation = parseInt(this.value);
        draw();
        saveSettings();
    }
    document.getElementById('horizontal').onclick = function () {
        activateHorizontalMode();
    }
    document.getElementById('vertical').onclick = function () {
        activateVerticalMode();
    }
    document.getElementById('switchMode').onclick = function () {
        switchMode();
    }
    window.addEventListener('keydown', function (k) {
        switch (k.keyCode) {
            case 82: // r key
                if (direction == 1 || direction == 2) {
                    switchMode();
                }
                break;
            case 65: // a key
                if (mode == 1) {
                    saturation -= 10;
                    if (saturation < 0) {
                        saturation = 0;
                    }
                    saturationSlider.value = saturation;
                    saveSettings();
                    draw();
                }
                break;
            case 68: // d key
                if (mode == 1) {
                    saturation += 10;
                    if (saturation > 1000) {
                        saturation = 1000;
                    }
                    saturationSlider.value = saturation;
                    saveSettings();
                    draw();
                }
                break;
            case 87: // w key
                activateHorizontalMode();
                break;
            case 83: // s key
                activateVerticalMode();
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

function activateHorizontalMode() {
    switch (direction) {
        case 0:
            direction = 1;
            break;
        case 1: //impossible because button gets disabled when direction == 1
            break;
        case 2:
            direction = 1;
            document.getElementById('vertical').disabled = false;
            break;
    }
    saveSettings();
    draw();
    document.getElementById('horizontal').disabled = true;
    document.getElementById('switchMode').disabled = false;
}

function activateVerticalMode() {
    switch (direction) {
        case 0:
            direction = 2;
            break;
        case 1:
            direction = 2
            document.getElementById('horizontal').disabled = false;
            break;
        case 2: //impossible because button gets disabled when direction == 2
            break;
    }
    saveSettings();
    draw();
    document.getElementById('vertical').disabled = true;
    document.getElementById('switchMode').disabled = false;
}

function switchMode() {
    if (mode == 1) {
        instructionField.textContent = languages[localStorage.getItem('lang')]['instructions'];
        modeLabel.textContent = languages[localStorage.getItem('lang')]['switchToMonochromeButton'];
        saturationDiv.style.visibility = 'hidden';
        mode = 0;
    } else if (mode == 0) {
        instructionField.textContent = languages[localStorage.getItem('lang')]['explanation'];
        modeLabel.textContent = languages[localStorage.getItem('lang')]['switchToNormalButton'];
        saturationDiv.style.visibility = 'visible';
        mode = 1;
    }
    saveSettings();
    draw();
}


// ~-_-~ SETTINGS ~-_-~
function loadSettings() {
    var paramList = sessionStorage.getItem('settings').split('&'); //[amountOfBalls=9, ballSize=30, ...]
    console.log(paramList);
    if (paramList.length == 6) {
        amountOfBalls = parseInt(paramList[0].split('=')[1]);
        amountOfBallsSlider.value = amountOfBalls;
        ballSize = parseInt(paramList[1].split('=')[1]);
        distance = parseInt(paramList[2].split('=')[1]);
        direction = parseInt(paramList[3].split('=')[1]);
        if (![0, 1, 2].includes(direction)) {
            console.log('Invalid "direction" URL-parameter! | direction="' + direction + '" [Valid value = "0", "1" and "2"]');
            direction = 0;
            document.getElementById('switchMode').disabled = true;
        } else if (direction == 0) {
            document.getElementById('switchMode').disabled = true;
        } else if (direction == 1) {
            document.getElementById('horizontal').disabled = true;
        } else if (direction == 2) {
            document.getElementById('vertical').disabled = true;
        }
        mode = parseInt(paramList[4].split('=')[1]);
        if (![0, 1].includes(mode)) {
            console.log('Invalid "mode" URL-parameter! | mode="' + mode + '" [Valid value = "0" and "1"]');
            mode = 0;
        } else if (mode == 1 && direction == 0) {
            console.log('Invalid "direction" URL-parameter! | direction="' + direction + '" [Valid value = "1" and "2"]');
            mode = 0;
        }
        if (mode == 1) {
            instructionField.textContent = languages[localStorage.getItem('lang')]['explanation'];
            modeLabel.textContent = languages[localStorage.getItem('lang')]['switchToNormalButton'];
            saturationDiv.style.visibility = 'visible';
        } else if (mode == 0) {
            instructionField.textContent = languages[localStorage.getItem('lang')]['instructions'];
            modeLabel.textContent = languages[localStorage.getItem('lang')]['switchToMonochromeButton'];
        }
        saturation = parseInt(paramList[5].split('=')[1]);
        if (saturation < 0 || saturation > 100) {
            if (saturation < 0) {
                saturation = 0;
            } else if (saturation > 100) {
                saturation = 100;
            }
            console.log('Invalid "saturation" URL-parameter! | saturation="' + saturation + '" [Valid value = between "0" and "100"]');
        }
        saturationSlider.value = saturation;
        saveSettings();
        draw();
    } else {
        resetSettings();
    }
}

function resetSettings() {
    amountOfBalls = 9;
    document.getElementById('amountOfBalls').value = amountOfBalls;
    ballSize = 30;
    distance = 1000;
    direction = 0;
    mode = 0;
    saturation = 0;
    document.getElementById('saturation').value = saturation;
    document.getElementById('switchMode').disabled = true;
    draw();
    saveSettings();
    console.log('resetted!')
}

function saveSettings() {
    sessionStorage.setItem('settings', 'amountOfBalls=' + amountOfBalls + '&ballSize=' + ballSize + '&distance=' + distance + '&direction=' + direction + '&mode=' + mode + '&saturation=' + saturation);
}


// ~-_-~ VISUALIZATION ~-_-~
function draw() {
    canvContext.clearRect(0, 0, canvas.width, canvas.height);
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fillRect(0, 0, canvas.width, canvas.height);
    leftBorder = (0.5 * canvas.width - 0.5 * canvas.height);
    for (i = 1; i <= amountOfBalls; i++) { //rows
        if (i == 1) {
            currentHeight = (canvas.height / amountOfBalls) - ((canvas.height / amountOfBalls) / 2);
        } else {
            currentHeight = currentHeight + (distance / 1000) * (canvas.height / amountOfBalls);
        }
        for (j = 0; j <= amountOfBalls - 1; j++) { //columns
            if (j % 2 != 0 && direction == 2 || i % 2 == 0 && direction == 1) {
                if (mode == 1) {
                    canvContext.fillStyle = `rgb(${256 - saturation * .256}, ${256 - saturation * .256}, ${256 - saturation * .256})`
                } else {
                    canvContext.fillStyle = getDefaultColor('secondary');
                }
            } else {
                if (mode == 1) {
                    canvContext.fillStyle = getDefaultColor('secondary');
                } else {
                    canvContext.fillStyle = getDefaultColor('shape');
                }
            }

            if (j == 0) {
                currentWidth = leftBorder;
            } else {
                currentWidth = currentWidth + (distance / 1000) * (canvas.height / amountOfBalls);
            }
            canvContext.beginPath();
            canvContext.arc(currentWidth, currentHeight, (0.005 * ballSize * canvas.height) / amountOfBalls, 0, 2 * Math.PI);
            canvContext.fill();
        }
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


// ~-_-~ CURRENT VERSION ~-_-~ 
console.log('<m1u1i2> v1.0.0')
