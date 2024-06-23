import './style.css'

let button = document.querySelector(".button");
let input = document.querySelector("#input");
let inputContainer = document.querySelector('#input-container')
let resultContainer = document.querySelector('#result-container')

let typingTimeout;

function ParseRSS() {
    if (inputContainer.className == "minimized") {
        inputContainer.className = "";
        resultContainer.className = "";
    } else {
        inputContainer.className = "minimized";
        resultContainer.className = "expanded";
    }
  }

function ButtonToggle(){
    if (input.value){
        button.className = 'button';
    } else {
        button.className = 'button disabled';
    }
}


button.addEventListener("click", ParseRSS);

input.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(ButtonToggle, 500);
});