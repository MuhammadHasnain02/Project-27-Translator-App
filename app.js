async function translateText(text = "Hello, how are you?") {

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ur`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();
        console.log("Full response:", data)
        console.log("Translated Text:", data.responseData.translatedText);

        return data.responseData.translatedText;
    }
    catch (err) {
        console.error("Translate error:", err);
        return null;
    }
 
}

translateText("Good morning, my friend!");



