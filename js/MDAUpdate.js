window.onload = function() {
    initializeCharCount('.inputBox', '.charCount', 400);
};

function initializeCharCount(inputSelector, countSelector, maxChars) {
    const inputBox = document.querySelector(inputSelector);
    const charCount = document.querySelector(countSelector);

    inputBox.addEventListener('input', function() {
        updateCharCount(inputBox, charCount, maxChars);
    });

    function updateCharCount(input, counter, max) {
        let currentLength = input.value.length;
        
        if (currentLength > max) {
            input.value = input.value.substring(0, max);
            currentLength = max;  // Adjust the length after truncation
        }

        counter.textContent = `${currentLength}/${max}`;
    }
}
