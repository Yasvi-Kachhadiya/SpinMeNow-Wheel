document.getElementById('resetBtn').addEventListener('click', () => {
    // Clear all saved options
    localStorage.removeItem('wheelOptions');
    localStorage.removeItem('wheelColors'); // If colors saved in future

    // Clear options array and redraw wheel
    options = [];
    drawWheel();
    renderOptions();

    // Clear result text
    document.getElementById('result').innerHTML = "Please add options to spin!";

    // Disable spin button
    document.getElementById('spinBtn').disabled = true;
});
