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
    let textRadius = 160;
    let insideRadius = 10;

    ctx.clearRect(0, 0, 500, 500);

    for (let i = 0; i < options.length; i++) {
        let angle = startAngle + i * arc;
        ctx.fillStyle = colors[i % colors.length];

        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 250 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);

        // Calculate max possible font size based on segment width
        let maxWidth = arc * textRadius * 1.6; // 1.6 factor for safe spacing
        let text = options[i];
        let fontSize = 18; // Start with large font

        // Reduce font size until text fits
        while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
            fontSize--;
            ctx.font = `${fontSize}px Arial`;
        }

        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();

    }

    // Draw arrow on the east side
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
    spinTime += 30;
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
    let degrees = startAngle * 180 / Math.PI + 90;
    let arcd = arc * 180 / Math.PI;
    let index = Math.floor((360 - degrees % 360) / arcd);
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


