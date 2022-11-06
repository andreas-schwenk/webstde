// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

import { State, StateMachine } from "./machine";
import { draw } from "./draw";

export enum GuiState {
  Select = "SELECT",
  InsertMachineState = "INSERT_STATE",
}
export let guiState = GuiState.Select;

export let mouseX = 0;
export let mouseY = 0;

export let machine = new StateMachine();

export function init() {
  // help button
  const helpButton = document.getElementById("help") as HTMLButtonElement;
  helpButton.onclick = function () {
    const url = "help.html";
    window.open(url, "_blank").focus();
  };

  // select / insert buttons
  const selectButton = document.getElementById("select") as HTMLInputElement;
  selectButton.checked = true;
  selectButton.onclick = function () {
    guiState = GuiState.Select;
  };
  const insertStartStateButton = document.getElementById(
    "insertStartState"
  ) as HTMLInputElement;
  insertStartStateButton.onclick = function () {
    console.log("clicked insert start state!");
  };
  const insertStateButton = document.getElementById(
    "insertState"
  ) as HTMLInputElement;
  insertStateButton.onclick = function () {
    guiState = GuiState.InsertMachineState;
  };
  const insertTransitionButton = document.getElementById(
    "insertTransition"
  ) as HTMLInputElement;
  insertTransitionButton.onclick = function () {
    console.log("clicked insert transition!");
  };

  // canvas
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    mouseX = (event.clientX - rect.left) * dpr;
    mouseY = (event.clientY - rect.top) * dpr;
    draw(canvas, ctx);
  });
  canvas.addEventListener("mouseup", (event) => {
    switch (guiState) {
      case GuiState.Select:
        machine.select(mouseX, mouseY);
        break;
      case GuiState.InsertMachineState:
        guiState = GuiState.Select;
        selectButton.checked = true;
        const machineState = new State(mouseX, mouseY, "", "");
        machine.addState(machineState);
        break;
    }
    draw(canvas, ctx);
  });
}
