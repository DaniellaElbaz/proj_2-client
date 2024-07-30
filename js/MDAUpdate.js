window.onload = function() {
    initializeCharCount('.inputBox', '.charCount', 400);
    setupSubmitButton('#addEventUpdateFormButton', '.inputBox', '#errorMessage');
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
            currentLength = max; 
        }

        counter.textContent = `${currentLength}/${max}`;
    }
}

function setupSubmitButton(buttonSelector, inputSelector, errorSelector) {
    const submitBtn = document.querySelector(buttonSelector);
    const inputBox = document.querySelector(inputSelector);
    const errorMessage = document.querySelector(errorSelector);
    const closeBtn = document.querySelector('.closeBtn');

    submitBtn.addEventListener('click', function(event) {
        if (inputBox.value.trim() === "") {
            event.preventDefault();
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }
    });

    closeBtn.addEventListener('click', function() {
        errorMessage.style.display = 'none';
    });
}
