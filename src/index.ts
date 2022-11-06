// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

export function init() {
  // help button
  const helpButton = document.getElementById("help") as HTMLButtonElement;
  helpButton.onclick = function () {
    const url = "help.html";
    window.open(url, "_blank").focus();
  };

  // select / insert buttons
  const selectButton = document.getElementById("select");
  selectButton.onclick = function () {
    console.log("clicked select!");
  };
  const insertStartStateButton = document.getElementById("insertStartState");
  insertStartStateButton.onclick = function () {
    console.log("clicked insert start state!");
  };
  const insertStateButton = document.getElementById("insertState");
  insertStateButton.onclick = function () {
    console.log("clicked insert state!");
  };
  const insertTransitionButton = document.getElementById("insertTransition");
  insertTransitionButton.onclick = function () {
    console.log("clicked insert transition!");
  };

  // canvas
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.addEventListener("mousemove", (event) => {
    console.log(".");
  });

  /*// main menu
  const mainMenu = document.getElementById("mainMenu");
  mainMenu.innerHTML = "";
  addSpacing(mainMenu);
  addButton(mainMenu, '<i class="fa-regular fa-circle-question"></i>', "help");*/
}

/*
export function addSpacing(mainMenu: HTMLElement) {
  const spacing = document.createElement("span");
  spacing.innerHTML = "&nbsp;";
  mainMenu.appendChild(spacing);
}

export function addButton(
  mainMenu: HTMLElement,
  text: string,
  tooltipText: string
) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("btn", "btn-outline-dark");
  button.title = tooltipText;
  button.setAttribute("data-bs-toggle", "tooltip");
  button.setAttribute("data-bs-placement", "button");
  button.innerHTML = text;
  mainMenu.appendChild(button);
}
*/
