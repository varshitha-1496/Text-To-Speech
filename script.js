document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("input-text");
    const speakBtn = document.getElementById("speak-btn");
    const voiceSelect = document.getElementById("voice-select");

    let voices = [];

    function loadVoices() {
        voices = speechSynthesis.getVoices();
        
        // List of required Indian languages
        const indianLanguages = ["hi-IN", "ta-IN", "te-IN", "kn-IN", "ml-IN", "bn-IN", "gu-IN", "mr-IN", "pa-IN", "ur-IN"];
        let selectedVoices = {};

        // Pick only one voice per language
        voices.forEach(voice => {
            if (indianLanguages.includes(voice.lang) && !selectedVoices[voice.lang]) {
                selectedVoices[voice.lang] = voice;
            }
        });

        // Populate dropdown with only one voice per language
        voiceSelect.innerHTML = Object.values(selectedVoices)
            .map(voice => `<option value="${voice.name}" data-lang="${voice.lang}">${voice.name} (${voice.lang})</option>`)
            .join("");
    }

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    async function translateText(text, targetLang) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.responseData.translatedText;
    }

    speakBtn.addEventListener("click", async () => {
        const text = textInput.value;
        if (!text) return alert("Please enter text to speak");

        const selectedVoice = voiceSelect.selectedOptions[0];
        const voice = voices.find(voice => voice.name === selectedVoice.value);

        if (voice) {
            const targetLang = voice.lang.split("-")[0]; // Extract language code
            const translatedText = await translateText(text, targetLang);
            console.log("Translated Text:", translatedText);

            const speech = new SpeechSynthesisUtterance(translatedText);
            speech.voice = voice;
            speech.lang = voice.lang;
            speechSynthesis.speak(speech);
        } else {
            alert("Selected voice not found!");
        }
    });
});
