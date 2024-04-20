const dictWrapper = document.querySelector(".dictionary-wrapper"),
  searchInput = dictWrapper.querySelector("input"),
  volumeIcon = dictWrapper.querySelector(".word-info i"),
  infoText = dictWrapper.querySelector(".information-text"),
  synonymsList = dictWrapper.querySelector(".synonyms-info .synonym-list"),
  removeIcon = dictWrapper.querySelector(".search-box span");
let audio;

function processData(result, word) {
  if (result.title) {
    infoText.innerHTML = `Unable to find the meaning of "${word}". Please try another word.`;
  } else {
    dictWrapper.classList.add("active");
    let definitions = result[0].meanings[0].definitions[0],
      phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;
    document.querySelector(".word-info p").innerText = result[0].word;
    document.querySelector(".word-info span").innerText = phonetics;
    document.querySelector(".meaning-info span").innerText =
      definitions.definition;
    // Check if example is available
    if (definitions.example) {
      document.querySelector(".example-info span").innerText =
        definitions.example;
    } else {
      document.querySelector(".example-info span").innerText =
        "Example not available.";
    }
    audio = new Audio("https:" + result[0].phonetics[0].audio);

    if (definitions.synonyms[0] == undefined) {
      synonymsList.parentElement.style.display = "none";
    } else {
      synonymsList.parentElement.style.display = "block";
      synonymsList.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        let tag = `<span onclick="searchWord('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
        tag =
          i == 4
            ? `<span onclick="searchWord('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`
            : tag;
        synonymsList.insertAdjacentHTML("beforeend", tag);
      }
    }
  }
}

function searchWord(word) {
  fetchData(word);
  searchInput.value = word;
}

function fetchData(word) {
  dictWrapper.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching for the meaning of "${word}"...`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => processData(result, word))
    .catch(() => {
      infoText.innerHTML = `Unable to find the meaning of "${word}". Please try another word.`;
    });
}

searchInput.addEventListener("keyup", (e) => {
  let word = e.target.value.replace(/\s+/g, " ");
  if (e.key == "Enter" && word) {
    fetchData(word);
  }
});

volumeIcon.addEventListener("click", () => {
  volumeIcon.style.color = "#4D59FB";
  audio.play();
  setTimeout(() => {
    volumeIcon.style.color = "#999";
  }, 800);
});

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  dictWrapper.classList.remove("active");
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML =
    "Enter a word and press enter to get meaning, example, synonyms, etc.";
});

