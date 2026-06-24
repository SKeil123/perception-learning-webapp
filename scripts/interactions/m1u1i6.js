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
    canvas = document.getElementById('interaction');
    canvContext = canvas.getContext('2d');

    // otherwise canvas resolution scales too low
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 2; // alternatively: = window.innerHeight*/
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canWidth = canvas.width * (1 - 2 * canvasPadding / 1000);
    figWidth = canWidth / 3;
    spacing = figWidth * (shapeDistance / 1000);
    figWidth = figWidth - 2 * spacing;

    rectangle = {
        x: .5 * canvas.width - .5 * figWidth - spacing - 1.3 * figWidth,
        y: .5 * canvas.height - .5 * figWidth,
        width: 1.3 * figWidth,
        height: figWidth
    };

    circle = {
        x: .5 * canvas.width,
        y: .5 * canvas.height,
        radius: .5 * figWidth,
        startAngle: 0,
        endAngle: 2 * Math.PI
    };

    circleRectangle = { //used as button
        x: .5 * canvas.width - .5 * figWidth,
        y: .5 * canvas.height - .5 * figWidth,
        width: 2 * .5 * figWidth,
        height: 2 * .5 * figWidth
    }

    triangle = {
        p1: { //upper
            //x: .5 * canvas.width + 3 * .75 * figWidth,
            x: .5 * canvas.width + .5 * figWidth + spacing + .65 * figWidth,
            y: .5 * canvas.height - .5 * 1 * figWidth
        },
        p2: { //bottom right
            //x: .5 * canvas.width + 4 * .75 * figWidth,
            x: .5 * canvas.width + .5 * figWidth + spacing + 1.3 * figWidth,
            y: .5 * canvas.height + .5 * 1 * figWidth
        },
        p3: { //bottom left
            //x: .5 * canvas.width + 2 * .75 * figWidth,
            x: .5 * canvas.width + .5 * figWidth + spacing,
            y: .5 * canvas.height + .5 * 1 * figWidth
        }
    }

    triangleRectangle = { //used as button
        x: .5 * canvas.width + .5 * figWidth + spacing,
        y: .5 * canvas.height - .5 * 1 * figWidth,
        width: 1.3 * figWidth,
        height: figWidth
    }
}

function initEventListeners() {
    canvas.addEventListener('click', function (event) {
        var canvasRect = canvas.getBoundingClientRect();
        posX = event.pageX - canvasRect.left - scrollX;
        posY = event.pageY - canvasRect.top - scrollY;


        // normalize mouse click coordinates
        posX /= canvasRect.width;
        posY /= canvasRect.height;


        // scale the normalized coordinates to canvas size
        posX *= canvasRect.width;
        posY *= canvasRect.height;

        mousePosition = {
            /**x: Math.abs(event.clientX - canvasRect.left),
            y: Math.abs(event.clientY - canvasRect.top)*/
            x: event.offsetX,
            y: event.offsetY
            //x: posX,
            //y: posY
        };

        if (showClicks != 0 && showClicks != 1) {
            console.log('Invalid "showClicks" URL-parameter! | showClicks="' + showClicks + '" [Valid value = "0" and "1"]');
        } else if (showClicks == 1) {
            canvContext.beginPath();
            canvContext.strokeStyle = 'red';
            canvContext.lineWidth = 5;
            canvContext.arc(mousePosition.x, mousePosition.y, 5, 0, 2 * Math.PI);
            canvContext.stroke();
        }
        if (isShape(mousePosition)) {
            //alert('mousePosition inside shape');
        } else {
            //alert('clicked outside shape');
        }
    }, false);
}

function isShape(mousePosition) {
    if (mousePosition.x > rectangle.x && mousePosition.x < rectangle.x + rectangle.width
        && mousePosition.y > rectangle.y && mousePosition.y < rectangle.y + rectangle.height) {
        //alert('mousePosition inside rectangle!');
        if (isRectangle == 1) {7
            isRectangle = 0;
            saveSettings();
        } else if (isRectangle == 0) {
            isRectangle = 1;
            saveSettings();
        }
        drawRectangle(isRectangle);
        return true;
    }
    if (mousePosition.x > circleRectangle.x && mousePosition.x < circleRectangle.x + circleRectangle.width
        && mousePosition.y > circleRectangle.y && mousePosition.y < circleRectangle.y + circleRectangle.height) {
       // alert('mousePosition inside circle!');
        if (isCircle == 1) {
            isCircle = 0;
            saveSettings();
        } else if (isCircle == 0) {
            isCircle = 1;
            saveSettings();
        }
        drawCircle(isCircle);
        return true;
    }
    if (mousePosition.x > triangleRectangle.x && mousePosition.x < triangleRectangle.x + triangleRectangle.width
        && mousePosition.y > triangleRectangle.y && mousePosition.y < triangleRectangle.y + triangleRectangle.height) {
        //alert('mousePosition inside triangle!');
        if (isTriangle == 1) {
            isTriangle = 0;
            saveSettings();
        } else if (isTriangle == 0) {
            isTriangle = 1;
            saveSettings();
        }
        drawTriangle(isTriangle);
        return true;
    }
    return false;
}


// ~-_-~ SETTINGS ~-_-~
function loadSettings() {
    var paramList = sessionStorage.getItem('settings').split('&'); //[canvasPadding=50, shapeDistance=100, ...]
    console.log(paramList);
    if (paramList.length == 9) {
        canvasPadding = parseInt(paramList[0].split('=')[1]);
        shapeDistance = parseInt(paramList[1].split('=')[1]);
        borderWidth = parseInt(paramList[2].split('=')[1]);
        dotFactor = parseInt(paramList[3].split('=')[1]);
        isRectangle = parseInt(paramList[4].split('=')[1]);
        isCircle = parseInt(paramList[5].split('=')[1]);
        isTriangle = parseInt(paramList[6].split('=')[1]);
        showHitboxes = parseInt(paramList[7].split('=')[1]);
        showClicks = parseInt(paramList[8].split('=')[1]);
    } else {
        resetSettings();
    }
}

function resetSettings() {
    canvasPadding = 50; // 50 = 5%
    shapeDistance = 100; //100 = 10%
    borderWidth = 5;
    dotFactor = 4; // 4 = .4%
    isRectangle = 1;
    isCircle = 1;
    isTriangle = 1;
    showHitboxes = 0;
    showClicks = 0;
    saveSettings();
}

function saveSettings() {
    sessionStorage.setItem('settings', 'canvasPadding=' + canvasPadding + '&shapeDistance=' + shapeDistance + '&borderWidth=' + borderWidth + '&dotFactor=' + dotFactor + '&isRectangle=' + isRectangle + '&isCircle=' + isCircle + '&isTriangle=' + isTriangle + '&showHitboxes=' + showHitboxes + '&showClicks=' + showClicks);
}


// ~-_-~ VISUALIZATION ~-_-~
function draw() {
    canvContext.clearRect(0, 0, canvas.width, canvas.height);
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fillRect(0, 0, canvas.width, canvas.height);

    drawRectangle(isRectangle);
    drawCircle(isCircle);
    drawTriangle(isTriangle);

    if (showHitboxes != 0 && showHitboxes != 1) {
        console.log('Invalid "showHitboxes" URL-parameter! | showHitboxes="' + showHitboxes + '" [Valid value = "0" and "1"]');
    } else if (showHitboxes == 1) {
        drawHitboxes();
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

function drawRectangle(isRectangle) {
    if (isRectangle != 0 && isRectangle != 1) {
        console.log('Invalid "isRectangle" URL-parameter! | isRectangle=' + isRectangle);
        isRectangle = 1;
    }
    canvContext.beginPath();
    canvContext.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fill();
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();

    if (isRectangle == 0) {
        drawDot(rectangle.x, rectangle.y + .5 * rectangle.height);
        drawDot(rectangle.x + .1 * rectangle.width, rectangle.y + rectangle.height);
        drawDot(rectangle.x + rectangle.width, rectangle.y + .4 * rectangle.height);
        drawDot(rectangle.x + .8 * rectangle.width, rectangle.y);
    }
}

function drawCircle(isCircle) {
    if (isCircle != 0 && isCircle != 1) {
        console.log('Invalid "isCircle" URL-parameter! | isCircle=' + isCircle);
        isCircle = 1;
    }
    canvContext.beginPath();
    canvContext.arc(circle.x, circle.y, circle.radius, circle.startAngle, circle.endAngle);
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fill();
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();

    if (isCircle == 0) {
        drawDot(circle.x, circle.y + circle.radius); // 180°
        drawDot(circle.x + circle.radius, circle.y) // 90°
        drawDot(circle.x + .70 * circle.radius, circle.y - .72 * circle.radius);
        drawDot(circle.x - .70 * circle.radius, circle.y - .72 * circle.radius);
    }
}

function drawTriangle(isTriangle) {
    if (isTriangle != 0 && isTriangle != 1) {
        console.log('Invalid "isTriangle" URL-parameter! | isTriangle=' + isTriangle);
        isTriangle = 1;
    }
    canvContext.beginPath();
    canvContext.moveTo(triangle.p1.x, triangle.p1.y); //upper point
    canvContext.lineTo(triangle.p2.x, triangle.p2.y); //bottom right point
    canvContext.lineTo(triangle.p3.x, triangle.p3.y); //bottom left point
    canvContext.closePath();
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fill();
    canvContext.strokeStyle = getDefaultColor('shape');
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();

    if (isTriangle == 0)  {
        drawDot(triangle.p3.x + .15 * (triangle.p2.x - triangle.p3.x), triangle.p1.y + .7 * (triangle.p3.y - triangle.p1.y));
        drawDot(triangle.p2.x - .15 * (triangle.p2.x - triangle.p3.x), triangle.p2.y);
        drawDot(triangle.p1.x + .2 * (triangle.p2.x - triangle.p3.x), triangle.p1.y + .4 * (triangle.p2.y - triangle.p1.y));
    }
}

function drawHitboxes() {
    canvContext.lineWidth = 3;
    // RECTANGLE
    canvContext.beginPath();
    canvContext.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    canvContext.strokeStyle = 'aquamarine';
    canvContext.stroke();

    // CIRCLE
    canvContext.beginPath();
    canvContext.rect(circleRectangle.x, circleRectangle.y, circleRectangle.width, circleRectangle.height);
    canvContext.strokeStyle = 'green';
    canvContext.stroke();

    // TRIANGLE
    canvContext.beginPath();
    canvContext.rect(triangleRectangle.x, triangleRectangle.y, triangleRectangle.width, triangleRectangle.height);
    canvContext.strokeStyle = 'red';
    canvContext.stroke();

    canvContext.lineWidth = 1; //reset to standard (1px)
}

function drawDot(posX, posY) {
    canvContext.beginPath();
    canvContext.strokeStyle = getDefaultColor('bg');
    canvContext.arc(posX, posY, borderWidth * (dotFactor / 1000) * canWidth, 0, 2 * Math.PI);
    canvContext.fillStyle = getDefaultColor('bg');
    canvContext.fill();
    canvContext.stroke();
}


// ~-_-~ CURRENT VERSION ~-_-~ 
console.log('<m1u1i6> v1.0.2');