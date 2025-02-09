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

    if (!characters.some((char) => char.file === characterFile)) {
        const img = document.createElement("img");
        img.src = `/static/characters/${characterName.toLowerCase()}/1.png`;
        img.classList.add("character-display");
        img.style.position = "absolute";
        img.style.bottom = "0%";
        img.style.left = `${10 + characters.length * 20}%`;
        img.style.transform = "translateX(-50%)";
        document.querySelector(".preview").appendChild(img);

        let character = {
            file: characterFile,
            name: characterName,
            element: img,
            image: 1,
        };
        characters.push(character);
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

        // Ensure custom characters always stay custom (even after renaming)
        if (character.isCustom === undefined) {
            character.isCustom = character.name.toLowerCase() === "custom character";
        }

        // Rename button (always appears for custom characters)
        let renameButton = character.isCustom
            ? `<button class="button-style" onclick="renameCharacter(${index})">Rename</button>`
            : "";

        // Outfits button (hidden for custom characters)
        let outfitsButton = character.isCustom
            ? ""  // Hide outfits button for custom characters
            : `<button class="dropdown-btn" onclick="toggleDropdown(${index})">Outfits</button>`;

        sliderContainer.innerHTML = `
            <label>Position for ${character.name}</label>
            <input type="range" min="0" max="100" value="${parseInt(character.element.style.left)}"
                   oninput="moveCharacterHorizontally(${index}, this.value)">
            <label>Vertical</label>
            <input type="range" min="0" max="100" value="${parseInt(character.element.style.bottom)}"
                   oninput="moveCharacterVertically(${index}, this.value)">
            <label>Scale</label>
            <input type="range" min="0.5" max="2" step="0.1" value="1"
                   oninput="scaleCharacter(${index}, this.value)">
            <label for="flip-${index}">Flip</label>
            <input type="checkbox" id="flip-${index}" onchange="toggleFlip(${index})">
            <button onclick="removeCharacter(${index})" class="button-style">Delete</button>
            <div class="outfit-dropdown">
                ${outfitsButton}
                <div class="dropdown-content" id="dropdown-outfits-${index}"></div>
            </div>
            ${renameButton}
        `;

        if (!character.isCustom) {
            const dropdownContent = sliderContainer.querySelector(`#dropdown-outfits-${index}`);
            for (let i = 1; i <= image_counts[character.name.toLowerCase()]; i++) {
                const img = document.createElement("img");
                img.src = `/static/characters/${character.name.toLowerCase()}/${i}.png`;
                img.alt = `Outfit ${i}`;
                img.title = `Outfit ${i}`;
                img.onclick = function () {
                    character.element.src = `/static/characters/${character.name.toLowerCase()}/${i}.png`;
                    toggleDropdown(index);
                };
                dropdownContent.appendChild(img);
            }
        }

        container.appendChild(sliderContainer);
    });
}

// Function to rename a character (only for custom characters)
function renameCharacter(index) {
    let newName = prompt("Enter a new name for this character:");
    if (newName) {
        characters[index].name = newName;

        // Ensure the character remains custom even after renaming
        characters[index].isCustom = true;

        // Update placement controls to reflect the new name
        updatePlacementControls();
    }
}


// Function to rename a character (only for custom characters)
function renameCharacter(index) {
    let newName = prompt("Enter a new name for this character:");
    if (newName) {
        characters[index].name = newName;

        // Update placement controls to reflect the new name
        updatePlacementControls();
    }
}


function toggleDropdown(index) {
    const dropdown = document.getElementById(`dropdown-outfits-${index}`);
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function moveCharacterHorizontally(index, value) {
    characters[index].element.style.left = `${value}%`;
}

function moveCharacterVertically(index, value) {
    characters[index].element.style.bottom = `${value}%`;
}

function scaleCharacter(index, value) {
    characters[index].element.style.transform = `scale(${value})`;
}

function toggleFlip(index) {
    const characterElement = characters[index].element;
    const flipCheckbox = document.getElementById(`flip-${index}`);
    characterElement.style.transform = flipCheckbox.checked
        ? `${characterElement.style.transform} scaleX(-1)`
        : characterElement.style.transform.replace("scaleX(-1)", "");
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
        dialogues.push({
            character: characterName,
            characterFile,
            text,
            audioFile: null,
        });
        updateDialogueList();
        document.getElementById("dialogue-input").value = "";
    }
}

function updateDialogueList() {
    const list = document.getElementById("dialogue-list");
    list.innerHTML = "";

    dialogues.forEach((dialogue, index) => {
        const item = document.createElement("div");
        item.className = "dialogue-item";

        let innerHTML = `
            <b>Dialogue:</b> ${dialogue.text}
            <select onchange="updateCharacterForDialogue(${index}, this.value)">
                ${characters
                    .map(
                        ({ file, name }) =>
                            `<option value="${file}" ${
                                dialogue.characterFile === file ? "selected" : ""
                            }>${name}</option>`
                    )
                    .join("")}
            </select>
            <button class="button-style" onclick="deleteDialogue(${index})">Delete</button>
            <button class="button-style" onclick="addVoiceLineOption(${index})">
                ${dialogue.audioFile ? dialogue.audioFile.name : "Voiceline"}
            </button>
        `;

        if (dialogue.character === "Custom Character") {
            innerHTML += `
                <button class="button-style" onclick="changeCharacterName(${index})">Change Name</button>
            `;
        }

        item.innerHTML = innerHTML;
        list.appendChild(item);
    });
}

function changeCharacterName(index) {
    const newName = prompt("Enter a new name for this custom character:");
    if (newName) {
        dialogues[index].character = newName;
        updateDialogueList();
    }
}

function updateCharacterForDialogue(index, characterFile) {
    const character = characters.find((char) => char.file === characterFile);
    dialogues[index].character = character.name;
    dialogues[index].characterFile = characterFile;
}

function deleteDialogue(index) {
    dialogues.splice(index, 1);
    updateDialogueList();
}

function addVoiceLineOption(index) {
    const audioInput = document.createElement("input");
    audioInput.type = "file";
    audioInput.accept = "audio/*";
    audioInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            dialogues[index].audioFile = {
                url: URL.createObjectURL(file),
                name: file.name,
            };
            updateDialogueList();
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

function displayCurrentDialogue() {
    const dialogue = dialogues[currentDialogueIndex];
    document.getElementById("preview-character-name").value = dialogue.character;
    document.getElementById("preview-dialogue-text").value = dialogue.text;
    playCurrentDialogueAudio();
}

function nextDialogue() {
    if (previewMode) {
        if (currentDialogueIndex < dialogues.length - 1) {
            currentDialogueIndex++;
            displayCurrentDialogue();
        } else {
            alert("End of scene.");
            resetDialogueBox();
            previewMode = false;
            document.getElementById("menu").style.display = "flex";
            stopBackgroundAudio();
        }
    }
}

function playCurrentDialogueAudio() {
    const dialogue = dialogues[currentDialogueIndex];
    if (dialogue.audioFile && dialogue.audioFile.url) {
        const audio = new Audio(dialogue.audioFile.url);
        audio.play();
    }
}

document.getElementById("preview-background").addEventListener("click", nextDialogue);

document.querySelectorAll(".button-style, #placement-editor, #dialogue-creator").forEach((el) => {
    el.addEventListener("click", (event) => event.stopPropagation());
});

function resetDialogueBox() {
    document.getElementById("preview-character-name").value = "";
    document.getElementById("preview-dialogue-text").value = "";
}

function closeDialogueBox() {
    document.getElementById("dialogue-box").style.display = "none";
    previewMode = false;
    document.getElementById("menu").style.display = "flex";
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
        reader.onload = function (e) {
            document.querySelector(".preview").style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}

function addCustomCharacter() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("character-display");
                img.style.position = "absolute";
                img.style.bottom = "0%";
                img.style.left = `${10 + characters.length * 20}%`;
                img.style.transform = "translateX(-50%)";
                document.querySelector(".preview").appendChild(img);

                let character = {
                    file: file.name,
                    name: "Custom Character",
                    element: img,
                    image: 1,
                };
                characters.push(character);
                updatePlacementControls();
            };
            reader.readAsDataURL(file);
        }
    });

    fileInput.click();
}

