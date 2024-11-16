let dialogues = [];
let currentDialogueIndex = 0;
let characters = [];
let previewMode = false;
let image_counts = [];

function updateBackground(background) {
  document.querySelector(".preview").style.backgroundImage =
    `url('/static/backgrounds/${background}')`;
}

function getImageCounts() {
  fetch("../characters/people_images.json").then((data) => {
    console.log(data);
  });
}

getImageCounts();

function addCharacter() {
  const characterFile = document.getElementById("character-select").value;
  const characterName =
    document.getElementById("character-select").selectedOptions[0].textContent;

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
    console.log(character);
    characters.push(character);
    // pickOutfit(character);
    updatePlacementControls();
  }
}

// function pickOutfit(character) {
//   const characterName = document
//     .getElementById("character-select")
//     .selectedOptions[0].textContent.toLowerCase();
//   // Create the select element
//   const selectElement = document.createElement("select");
//   selectElement.id = "outfitSelect";

//   // Create options (0-9) and add them to the select element
//   for (let i = 0; i < 10; i++) {
//     const option = document.createElement("option");
//     option.value = i; // Set the option's value to i
//     option.textContent = `Outfit ${i}`; // Option text (Outfit 0, Outfit 1, etc.)
//     selectElement.appendChild(option);
//   }

//   // Append the select element to the container
//   const container = document.getElementById("outfit-container");
//   container.appendChild(selectElement);

//   // Add an event listener to update character's index when selection changes
//   selectElement.addEventListener("change", function () {
//     character.index = parseInt(selectElement.value, 10);
//     character.element.src = `/static/characters/${character.name.toLowerCase()}/${character.index}.png`;
//   });
// }

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
    characterElement.style.transform = characterElement.style.transform.replace(
      "scaleX(-1)",
      "",
    );
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
  const characterName =
    document.getElementById("character-select").selectedOptions[0].textContent;

  if (text) {
    dialogues.push({ character: characterName, characterFile, text });
    updateDialogueList();
    document.getElementById("dialogue-input").value = "";
  }
}

function updateCharacterForDialogue(index, characterFile) {
  const characterName = characters.find(
    (char) => char.file === characterFile,
  ).name;
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
                ${characters
                  .map(
                    ({ file, name }) => `
                    <option value="${file}" ${dialogue.characterFile === file ? "selected" : ""}>${name}</option>
                `,
                  )
                  .join("")}
            </select>
            <button class="button-style" onclick="deleteDialogue(${index})">Delete</button>
        `;
    list.appendChild(item);
  });
}

function deleteDialogue(index) {
  dialogues.splice(index, 1);
  updateDialogueList();
}

function startScenePreview() {
  if (dialogues.length > 0) {
    currentDialogueIndex = 0;
    displayCurrentDialogue();
    document.getElementById("dialogue-box").style.display = "block";
    document.getElementById("dialogue-creator").style.display = "none";
    document.getElementById("menu").style.display = "none";
    previewMode = true;
  } else {
    resetDialogueBox();
  }
}

function displayCurrentDialogue() {
  const dialogue = dialogues[currentDialogueIndex];
  document.getElementById("preview-character-name").value = dialogue.character;
  document.getElementById("preview-dialogue-text").value = dialogue.text;
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
    }
  }
}

document
  .getElementById("preview-background")
  .addEventListener("click", nextDialogue);

document
  .querySelectorAll(".button-style, #placement-editor, #dialogue-creator")
  .forEach((el) => {
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

const selectElement = document.getElementById("outfit-select");
for (let i = 0; i < 10; i++) {
  const option = document.createElement("option");
  option.value = i; // You can set a value that corresponds to each number (or any other attribute you need)
  option.textContent = `Outfit ${i}`; // Display text as "Option 0", "Option 1", etc.
  selectElement.appendChild(option);
}

selectElement.addEventListener("change", function () {
  let index = parseInt(selectElement.value, 10);
  const characterName =
    document.getElementById("character-select").selectedOptions[0].textContent;
  console.log(characterName);

  console.log(characters);
  let character = characters.find((character) => {
    return character.name === characterName;
  });

  console.log(character);
  character.element.src = `/static/characters/${character.name.toLowerCase()}/${index}.png`;
});
