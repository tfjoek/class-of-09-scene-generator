let dialogues = [];
let currentDialogueIndex = 0;
let characters = [];
let previewMode = false;
let backgroundAudio = null;

function updateBackground(background) {
    document.querySelector(".preview").style.backgroundImage = `url('/static/backgrounds/${background}')`;
}

function addCharacter() {
    const characterFile = document.getElementById("character-select").value;
    const characterName = document.getElementById("character-select").selectedOptions[0].textContent;

    if (!characters.some(char => char.file === characterFile)) {
        const img = document.createElement("img");
        img.src = `/static/characters/${characterFile}`;
        img.classList.add("character-display");
        img.style.position = "absolute";
        img.style.bottom = "0%";
        img.style.left = `${10 + characters.length * 20}%`;
        img.style.transform = "translateX(-50%)";
        document.querySelector(".preview").appendChild(img);

        characters.push({ file: characterFile, name: characterName, element: img });
        updatePlacementControls();
    }
}

function closeAllMenus() {
    document.getElementById("placement-editor").style.display = "none";
    document.getElementById("dialogue-creator").style.display = "none";
}

function togglePlacementEditor() {
    closeAllMenus();
    const editor = document.getElementById("placement-editor");
    editor.style.display = editor.style.display === "none" ? "block" : "none";
    if (editor.style.display === "block") {
        updatePlacementControls();
    }
}

function updatePlacementControls() {
    const container = document.getElementById("placement-controls");
    container.innerHTML = "";
    characters.forEach((character, index) => {
        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("slider-container");
        sliderContainer.innerHTML = `
            <label>Position for ${character.name}</label>
            <input type="range" min="0" max="100" value="${parseInt(character.element.style.left)}" oninput="moveCharacter(${index}, this.value)">
            <label for="flip-${index}">Flip</label>
            <input type="checkbox" id="flip-${index}" onchange="toggleFlip(${index})">
            <button onclick="removeCharacter(${index})" class="button-style">Delete</button>
        `;
        container.appendChild(sliderContainer);
    });
}

function moveCharacter(index, value) {
    characters[index].element.style.left = `${value}%`;
}

function toggleFlip(index) {
    const characterElement = characters[index].element;
    const flipCheckbox = document.getElementById(`flip-${index}`);
    if (flipCheckbox.checked) {
        characterElement.style.transform += " scaleX(-1)";
    } else {
        characterElement.style.transform = characterElement.style.transform.replace("scaleX(-1)", "");
    }
}

function removeCharacter(index) {
    const character = characters[index];
    character.element.remove(); 
    characters.splice(index, 1); 
    updatePlacementControls(); 
}

function toggleDialogueCreator() {
    closeAllMenus();
    const creator = document.getElementById("dialogue-creator");
    creator.style.display = creator.style.display === "none" ? "block" : "none";
}

function addDialogue() {
    const text = document.getElementById("dialogue-input").value;
    const characterFile = document.getElementById("character-select").value;
    const characterName = document.getElementById("character-select").selectedOptions[0].textContent;

    if (text) {
        const dialogue = { character: characterName, characterFile, text, audioFile: null };
        dialogues.push(dialogue);
        updateDialogueList();
        document.getElementById("dialogue-input").value = '';
    }
}

function updateCharacterForDialogue(index, characterFile) {
    const characterName = characters.find(char => char.file === characterFile).name;
    dialogues[index].character = characterName;
    dialogues[index].characterFile = characterFile;
}

function updateDialogueList() {
    const list = document.getElementById("dialogue-list");
    list.innerHTML = "";

    dialogues.forEach((dialogue, index) => {
        const item = document.createElement("div");
        item.className = "dialogue-item";
        item.innerHTML = `
            <b>Dialogue:</b> ${dialogue.text}
            <select onchange="updateCharacterForDialogue(${index}, this.value)">
                ${characters.map(({ file, name }) => `
                    <option value="${file}" ${dialogue.characterFile === file ? 'selected' : ''}>${name}</option>
                `).join('')}
            </select>
            <button class="button-style" onclick="deleteDialogue(${index})">Delete</button>
            <button class="button-style" onclick="addVoiceLineOption(${index})">
                ${dialogue.audioFile ? dialogue.audioFile.name : 'Voiceline'}
            </button>
        `;
        list.appendChild(item);
    });
}

function deleteDialogue(index) {
    dialogues.splice(index, 1);
    updateDialogueList();
}

function addVoiceLineOption(index) {
    const audioInput = document.createElement('input');
    audioInput.type = 'file';
    audioInput.accept = 'audio/*';
    audioInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            dialogues[index].audioFile = {
                url: URL.createObjectURL(file),
                name: file.name
            };
            updateDialogueList(); // Refresh to display the correct file name
        }
    };
    audioInput.click();
}

function startScenePreview() {
    if (dialogues.length > 0) {
        currentDialogueIndex = 0;
        displayCurrentDialogue();
        document.getElementById("dialogue-box").style.display = "block";
        document.getElementById("dialogue-creator").style.display = "none";
        document.getElementById("menu").style.display = "none";
        previewMode = true;
        startBackgroundAudio();
    } else {
        resetDialogueBox();
    }
}

function playCurrentDialogueAudio() {
    const dialogue = dialogues[currentDialogueIndex];
    if (dialogue.audioFile && dialogue.audioFile.url) {
        const audio = new Audio(dialogue.audioFile.url);
        audio.play();
    }
}

function displayCurrentDialogue() {
    if (dialogues.length > 0 && currentDialogueIndex < dialogues.length) {
        const dialogue = dialogues[currentDialogueIndex];
        document.getElementById("preview-character-name").value = dialogue.character;
        document.getElementById("preview-dialogue-text").value = dialogue.text;
        playCurrentDialogueAudio();
    }
}

function nextDialogue() {
    if (previewMode) {
        if (currentDialogueIndex < dialogues.length - 1) {
            currentDialogueIndex++;
            displayCurrentDialogue();
        } else {
            alert("End of scene.");
            resetDialogueBox();
            currentDialogueIndex = 0;
            previewMode = false;
            document.getElementById("menu").style.display = "flex";
            stopBackgroundAudio();
        }
    }
}

document.getElementById("preview-background").addEventListener("click", nextDialogue);

document.querySelectorAll(".button-style, #placement-editor, #dialogue-creator").forEach(el => {
    el.addEventListener("click", event => event.stopPropagation());
});

function resetDialogueBox() {
    document.getElementById("preview-character-name").value = '';
    document.getElementById("preview-dialogue-text").value = '';
}

function closeDialogueBox() {
    document.getElementById("dialogue-box").style.display = "none";
    previewMode = false;
    document.getElementById("menu").style.display = "flex";
    stopBackgroundAudio();
}

function addBackgroundAudioFile() {
    document.getElementById("background-audio-input").click();
}

function setBackgroundAudio(input) {
    const file = input.files[0];
    if (file) {
        if (backgroundAudio) {
            backgroundAudio.pause();
            backgroundAudio = null;
        }
        backgroundAudio = new Audio(URL.createObjectURL(file));
        backgroundAudio.loop = true;
    }
}

function startBackgroundAudio() {
    if (backgroundAudio) {
        backgroundAudio.play();
    }
}

function stopBackgroundAudio() {
    if (backgroundAudio) {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
    }
}

function addCustomBackground() {
    document.getElementById("custom-background-input").click();
}

function setCustomBackground(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector(".preview").style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}
