// -------------<<< Elements >>>---------------

let userTranlTxt = document.getElementById("userTranlTxt")
let translatedTxt = document.getElementById("translatedTxt")
let charCount = document.getElementById("charCount")

let leftEng = document.getElementById("leftEng")
let leftUr = document.getElementById("leftUr")
let rightEng = document.getElementById("rightEng")
let rightUr = document.getElementById("rightUr")

let switchArrow = document.getElementById("switchArrow")
let currentLang = "en"

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
    if (txt.length > 5000) txt = txt.slice(0 , 5000)

    charCount.innerText = txt.length
    translateText(txt || "Enter Sentence")

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
