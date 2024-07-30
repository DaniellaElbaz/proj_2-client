window.onload = function() {
    initializeCharCount('.inputBox', '.charCount', 400);
    setupSubmitButton('#addEventupdateFormButton', '.inputBox', '#errorMessage', '#successMessage');
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

function setupSubmitButton(buttonSelector, inputSelector, errorSelector, successSelector) {
    const submitBtn = document.querySelector(buttonSelector);
    const inputBox = document.querySelector(inputSelector);
    const errorMessage = document.querySelector(errorSelector);
    const successMessage = document.querySelector(successSelector);
    const closeErrorBtn = document.querySelector('.closeBtn');
    const closeSuccessBtn = document.querySelector('.closeBtnSuccess');

    submitBtn.addEventListener('click', function(event) {
        if (inputBox.value.trim() === "") {
            event.preventDefault();
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        } else {
            errorMessage.style.display = 'none';
            successMessage.style.display = 'block';
        }
    });

    closeErrorBtn.addEventListener('click', function() {
        errorMessage.style.display = 'none';
    });

    closeSuccessBtn.addEventListener('click', function() {
        successMessage.style.display = 'none';
        window.location.href = 'liveEventsMDA.html'; // Change this to the URL of the page you want to navigate to
    });
}
