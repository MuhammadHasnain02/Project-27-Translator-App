// -------------<<< Elements >>>---------------

let txtSectTab = document.getElementById("txtSectTab")
let imgSectTab = document.getElementById("imgSectTab")
let documSectTab = document.getElementById("documSectTab")
let webSectTab = document.getElementById("webSectTab")

let txtSection = document.getElementById("txtSection")
let imgSection = document.getElementById("imgSection")
let documSection = document.getElementById("documSection")
let webSection = document.getElementById("webSection")

let userTranlTxt = document.getElementById("userTranlTxt")
let translatedTxt = document.getElementById("translatedTxt")
let charCount = document.getElementById("charCount")

let leftEng = document.getElementById("leftEng")
let leftUr = document.getElementById("leftUr")
let rightEng = document.getElementById("rightEng")
let rightUr = document.getElementById("rightUr")

let switchArrow = document.getElementById("switchArrow")
let currentLang = "en"


// -------------<<< toggle Section Activated >>>---------------

// CONTENT BOXES & TAB BUTTONS
let sectionsTab = [txtSectTab, imgSectTab, documSectTab, webSectTab];
let sections = [txtSection, imgSection, documSection, webSection];

function activateSect(tab) {

    sectionsTab.forEach(sec => {
        sec.classList.remove("text-blue-600", "border-b-2", "border-blue-600");
        sec.classList.add("text-gray-600");
    });

    sections.forEach(content => content.classList.add("hidden"));

    tab.classList.remove("text-gray-600");
    tab.classList.add("text-blue-600", "border-b-2", "border-blue-600");

    let contentId = tab.dataset.target;
    document.getElementById(contentId).classList.remove("hidden");

    localStorage.setItem("activeTab" , tab.id)

}

sectionsTab.forEach(tab => {
    tab.addEventListener("click", () => activateSect(tab));
});

// -------------<<< Translation Logic >>>---------------

async function translateText(text) {

    try {
        let langPair = currentLang === "en" ? "en|ur" : "ur|en"
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();
        translatedTxt.innerHTML = data.responseData.translatedText
        translatedTxt.classList.add("text-right")
        
        console.log("Translated Text:", data.responseData.translatedText);
        return data.responseData.translatedText;
    }
    catch (err) {
        console.error("Translate error:", err);
        return null;
    }

}

// -------------<<< 5000 Characters Handling >>>---------------

userTranlTxt.addEventListener("input" , () => {

    let txt = userTranlTxt.value.trim()
    txt.length >= 5000 ? charCount.classList.add("text-red-500") : charCount.classList.remove("text-red-500")

    if (txt.length > 5000) {
        txt = txt.slice(0 , 5000)
        userTranlTxt.value = txt
    }

    charCount.innerText = txt.length
    translateText(txt || "Enter Sentence")
    localStorage.setItem("translationText", txt);

})

// -------------<<< LOAD SAVED Data >>>---------------

window.addEventListener("load" , () => {

    let savedTab = localStorage.getItem("activeTab")
    let savedText = localStorage.getItem("translationText");

    if (savedTab) {
        let tab = document.getElementById(savedTab);
        if (tab) activateSect(tab)
    }
    if (savedText) {
        userTranlTxt.value = savedText;
    }

})

// ----------<<< English => Urdu & Urdu => English Handling >>>------------

function setActive(lang) {
    
    // Reset all buttons first
    leftEng.className = "text-gray-600 text-[15px] cursor-pointer"
    leftUr.className  = "text-gray-600 text-[15px] cursor-pointer"
    rightEng.className= "text-gray-600 text-[15px] cursor-pointer"
    rightUr.className = "text-gray-600 text-[15px] cursor-pointer"

    // Active button logic
    if (lang === "en") {
        leftEng.className = "text-blue-600 text-[15px] font-semibold border-b-2 border-blue-600 pb-1 cursor-pointer";
        rightUr.className = "text-blue-600 text-[15px] font-semibold border-b-2 border-blue-600 pb-1 cursor-pointer";
        currentLang = "en"
    }
    else if (lang === "ur") {
        leftUr.className = "text-blue-600 text-[15px] font-semibold border-b-2 border-blue-600 pb-1 cursor-pointer";
        rightEng.className = "text-blue-600 text-[15px] font-semibold border-b-2 border-blue-600 pb-1 cursor-pointer";
        currentLang = "ur"
    }

    // Re-translate current text when language changes
    if (userTranlTxt.value.trim()) {
        translateText(userTranlTxt.value.trim());
    }

}

// ----------<<< Click Events >>>------------

leftEng.addEventListener("click", () => setActive("en"));
rightUr.addEventListener("click", () => setActive("en"));

leftUr.addEventListener("click", () => setActive("ur"));
rightEng.addEventListener("click", () => setActive("ur"));

// ----------<<< Switch Arrow Click >>>------------

switchArrow.addEventListener("click", () => currentLang === "en" ? setActive("ur") : setActive("en"))

// ----------<<< Saved & History Button >>>------------

let savedIcon = document.getElementById("savedIcon")
let historyIcon = document.getElementById("historyIcon")

function toggleBlueGray(icon) {

    if (icon.classList.contains("text-blue-500")) {
        icon.classList.remove("text-blue-500");
        icon.classList.add("text-gray-500");

    } else {
        icon.classList.remove("text-gray-500");
        icon.classList.add("text-blue-500");
    }

}

savedIcon.addEventListener("click" , () => toggleBlueGray(savedIcon))
historyIcon.addEventListener("click" , () => toggleBlueGray(historyIcon))
