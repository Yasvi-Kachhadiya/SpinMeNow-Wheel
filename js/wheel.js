let options = JSON.parse(localStorage.getItem('wheelOptions')) || [];
let spinSound = new Audio('assets/sounds/spin.mp3');
let colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#FFEB3B', '#795548', '#607D8B', '#E91E63', '#3F51B5', '#009688', '#CDDC39', '#FF5722', '#673AB7', '#00BCD4', '#8BC34A'];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("result").querySelector("span");
const result = document.getElementById("result");
const optionList = document.getElementById("optionList");

let startAngle = 0;
let arc = 0;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;


function drawWheel() {
    if (options.length === 0) {
        ctx.clearRect(0, 0, 500, 500);
        return;
    }

    arc = Math.PI * 2 / options.length;
    let outsideRadius = 220;
    let insideRadius = 10;

    ctx.clearRect(0, 0, 500, 500);

    for (let i = 0; i < options.length; i++) {
        let angle = startAngle + i * arc;
        ctx.fillStyle = colors[i % colors.length];

        // Draw the segment
        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.fill();

        // Calculate the exact center angle of the segment
        let textAngle = angle + arc / 2;

        // Calculate text position (polar to Cartesian)
        let textRadius = (outsideRadius + insideRadius) / 2 + 30;
        let textX = 250 + textRadius * Math.cos(textAngle);
        let textY = 250 + textRadius * Math.sin(textAngle);

        ctx.save();
        ctx.translate(textX, textY);

        // Rotate text to always face the same direction (upright)
        let rotationDegrees = (textAngle * 180 / Math.PI) % 360;
        ctx.rotate(textAngle);
        

        let text = options[i];
        let fontSize = 20;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Fit text to the segment width
        let maxWidth = arc * textRadius * 0.9;
        while (ctx.measureText(text).width > maxWidth && fontSize > 18) {
            fontSize--;
            ctx.font = `${fontSize}px Arial`;
        }

        ctx.fillText(text, 0, 0);
        ctx.restore();
    }

    // Draw the arrow
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(250 + (outsideRadius + 7), 250 - 4);
    ctx.lineTo(250 + (outsideRadius + 7), 250 + 4);
    ctx.lineTo(250 + (outsideRadius - 10), 250 + 4);
    ctx.lineTo(250 + (outsideRadius - 10), 250 + 9);
    ctx.lineTo(250 + (outsideRadius - 26), 250 + 0);
    ctx.lineTo(250 + (outsideRadius - 10), 250 - 9);
    ctx.lineTo(250 + (outsideRadius - 10), 250 - 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
}



function spin() {
    spinSound.play();
    spinAngleStart = Math.random() * 50 + 50;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 3000;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 28;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    // Arrow is at 0 degrees (east/right)
    let degrees = (startAngle * 180 / Math.PI) % 360;
    let arcd = arc * 180 / Math.PI;
    // The segment at the arrow is the one that covers 0 degrees
    // So we need to find which segment contains angle = 0
    let index = options.length - Math.floor((degrees % 360) / arcd) - 1;
    if (index < 0) index += options.length;
    result.innerHTML = `Eat: <span>${options[index]}</span>!`;
}

function easeOut(t, b, c, d) {
    let ts = (t /= d) * t;
    let tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

function renderOptions() {
    optionList.innerHTML = '';
    options.forEach((option, index) => {
        let li = document.createElement('li');
        li.textContent = option;

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.onclick = () => {
            options.splice(index, 1);
            localStorage.setItem('wheelOptions', JSON.stringify(options));
            if (options.length === 0) {
                spinBtn.disabled = true;
                result.innerHTML = "Please add options to spin!";
            }
            drawWheel();
            renderOptions();
        };

        li.appendChild(deleteBtn);
        optionList.appendChild(li);
    });

    spinBtn.disabled = options.length === 0;
}

document.getElementById('addBtn').addEventListener('click', () => {
    const newOption = document.getElementById('newOption').value.trim();
    if (newOption) {
        options.push(newOption);
        drawWheel();
        renderOptions();
        document.getElementById('newOption').value = '';
    }
    localStorage.setItem('wheelOptions', JSON.stringify(options));
});

spinBtn.addEventListener('click', spin);

window.onload = () => {
    drawWheel();
    renderOptions();
};
