console.clear();

const sliderProps = {
    fill: "#5d68e2",
    background: "rgba(255, 255, 255, 0.214)",
};

const slider = document.querySelector(".range__slider input");
const sliderValue = document.querySelector(".length__title");
const resultEl = document.getElementById("result");
const lengthEl = document.getElementById("slider");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy-btn");
const resultContainer = document.querySelector(".result");
const copyInfo = document.querySelector(".result__info.right");
const copiedInfo = document.querySelector(".result__info.left");

const updateSliderFill = (slider) => {
    const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage}%)`;
    sliderValue.setAttribute("data-length", slider.value);
};

slider.addEventListener("input", (event) => {
    updateSliderFill(event.target);
});

const randomFunc = {
    lower: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),
    upper: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    number: () => String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48),
    symbol: () => {
        const symbols = '~!@#$%^&*()_+{}":?><;.,';
        return symbols[Math.floor(Math.random() * symbols.length)];
  },
};

const secureMathRandom = () => window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);

const generatePassword = (length, lower, upper, number, symbol) => {
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
        (item) => Object.values(item)[0]
    );

    if (typesArr.length === 0) return "Please select at least one option.";

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
        const type = typesArr[i % typesArr.length];
        const funcName = Object.keys(type)[0];
        generatedPassword += randomFunc[funcName]();
    }
    return generatedPassword.slice(0, length);
};

generateBtn.addEventListener("click", () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numberEl.checked;
    const hasSymbol = symbolEl.checked;

    resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);

    copyInfo.style.transform = "translateY(0%)";
    copyInfo.style.opacity = "0.75";
    copiedInfo.style.transform = "translateY(200%)";
    copiedInfo.style.opacity = "0";
});


copyBtn.addEventListener("click", () => {
    const password = resultEl.innerText;
    if (!password || password === "CLICK GENERATE") return;

    navigator.clipboard.writeText(password).then(() => {
        copyInfo.style.transform = "translateY(200%)";
        copyInfo.style.opacity = "0";
        copiedInfo.style.transform = "translateY(0%)";
        copiedInfo.style.opacity = "0.75";
    }).catch((err) => console.error("Error copying password: ", err));
});


let resultContainerBound = resultContainer.getBoundingClientRect();

resultContainer.addEventListener("mousemove", (e) => {
    copyBtn.style.setProperty("--x", `${e.clientX - resultContainerBound.left}px`);
    copyBtn.style.setProperty("--y", `${e.clientY - resultContainerBound.top}px`);
});

window.addEventListener("resize", () => {
    resultContainerBound = resultContainer.getBoundingClientRect();
});

updateSliderFill(slider);
