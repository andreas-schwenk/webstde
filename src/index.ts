// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

import {
  Signal,
  SignalDirection,
  SignalType,
  State,
  StateMachine,
} from "./machine";
import { draw } from "./draw";
import { Pos2D } from "./interfaces";

export enum GuiState {
  Select = "SELECT",
  InsertMachineState = "INSERT_STATE",
}
export let guiState = GuiState.Select;

export let mousePos: Pos2D = { x: 0, y: 0 };

export let machine = new StateMachine();

let canvas: HTMLCanvasElement = null;
let ctx: CanvasRenderingContext2D = null;

export function init(): void {
  // help button
  const helpButton = document.getElementById("help") as HTMLButtonElement;
  helpButton.onclick = function () {
    const url = "help.html";
    window.open(url, "_blank").focus();
  };

  // load / save buttons
  const saveButton = document.getElementById("save") as HTMLInputElement;
  saveButton.onclick = function () {
    console.log(JSON.stringify(machine.toJSON(), null, 2));
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

  // delete button
  const deleteButton = document.getElementById("delete") as HTMLButtonElement;
  deleteButton.onclick = function () {
    machine.deleteSelection();
    draw(canvas, ctx);
  };

  // number converter
  let numberConverterVisible = false;
  const numberConverter = document.getElementById("numberConverter");

  // selection
  const selection = document.getElementById("selection") as HTMLDivElement;
  /*const testState = new State({ x: 100, y: 100 }, "blub", "i++", "bla bla");
  const table = generateSelectionTable([testState]);
  selection.appendChild(table);*/

  // signals
  const signals = document.getElementById("signals") as HTMLDivElement;
  signals.innerHTML = "";
  signals.appendChild(generateSignalTable(machine.getSignals()));
  const addSignalButton = document.getElementById(
    "addSignal"
  ) as HTMLButtonElement;
  addSignalButton.addEventListener("onclick", (e) => {
    const sig = new Signal("", SignalType.Bit, 1, SignalDirection.Input, "");
    machine.addSignal(sig);
    signals.innerHTML = "";
    signals.appendChild(generateSignalTable(machine.getSignals()));
  });

  // collapse buttons
  const numberConverterCollapse = document.getElementById(
    "numberConverterCollapse"
  ) as HTMLSpanElement;
  numberConverterCollapse.onclick = function () {
    numberConverterVisible = !numberConverterVisible;
    numberConverterCollapse.innerHTML = numberConverterVisible
      ? '<i class="fa-solid fa-square-minus"></i>'
      : '<i class="fa-solid fa-square-plus"></i>';
    numberConverter.style.display = numberConverterVisible ? "block" : "none";
  };

  // canvas
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    mousePos.x = Math.round((event.clientX - rect.left) * dpr);
    mousePos.y = Math.round((event.clientY - rect.top) * dpr);
    draw(canvas, ctx);
  });

  canvas.addEventListener("mouseup", (event) => {
    switch (guiState) {
      case GuiState.Select:
        machine.select(mousePos);
        const s = machine.getSelectedStates();
        if (s.length == 0) {
          selection.innerHTML = "(empty)";
        } else {
          selection.innerHTML = "";
          const table = generateSelectionTable(s);
          selection.appendChild(table);
        }
        break;
      case GuiState.InsertMachineState:
        guiState = GuiState.Select;
        selectButton.checked = true;
        const machineState = new State(mousePos, "");
        machine.addState(machineState);
        break;
    }
    draw(canvas, ctx);
  });

  // draw one at begin // TODO: does not work!!
  draw(canvas, ctx);
}

function generateSignalTable(signals: Signal[]): HTMLTableElement {
  const table = document.createElement("table");
  table.classList.add("table", "table-bordered", "border-dark", "shadow");
  const thead = document.createElement("thead");
  table.appendChild(thead);
  let tr = document.createElement("tr");
  thead.appendChild(tr);
  tr.classList.add("m-0", "p-0");
  // ID header
  let th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "ID";
  // TYPE header
  th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "TYPE";
  // BITS header
  th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "BITS";
  // I/O header
  th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "I/O";
  // BUTTONS header
  th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "";
  // rows
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  for (const signal of signals) {
    // first row: id
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    th = document.createElement("th");
    tr.appendChild(th);
    th.classList.add("m-0", "p-0");
    th.scope = "row";
    let input = document.createElement("input");
    th.appendChild(input);
    input.type = "text";
    input.classList.add("form-control", "border-white");
    input.value = signal.getId();
    input.addEventListener("keyup", (e) => {
      const value = (<HTMLInputElement>e.target).value;
      signal.setId(value);
      draw(canvas, ctx);
    });
  }
  return table;
}

function generateSelectionTable(states: State[]): HTMLTableElement {
  const table = document.createElement("table");
  table.classList.add("table", "table-bordered", "border-dark", "shadow");
  const thead = document.createElement("thead");
  table.appendChild(thead);
  let tr = document.createElement("tr");
  thead.appendChild(tr);
  tr.classList.add("m-0", "p-0");
  let th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "STATE ID";
  // TODO: "th" for moore-output
  // rows
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  for (const state of states) {
    // first row: id and Moore output
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    th = document.createElement("th");
    tr.appendChild(th);
    th.classList.add("m-0", "p-0");
    th.scope = "row";
    let input = document.createElement("input");
    th.appendChild(input);
    input.type = "text";
    input.classList.add("form-control", "border-white");
    input.value = state.getId();
    input.addEventListener("keyup", (e) => {
      const value = (<HTMLInputElement>e.target).value;
      state.setId(value);
      draw(canvas, ctx);
    });
    // TODO: "td" for moore-output
    // second and third row: code (i==0) and description (i==1)
    for (let i = 0; i < 2; i++) {
      tr = document.createElement("tr");
      tbody.appendChild(tr);
      const td = document.createElement("td");
      tr.appendChild(td);
      td.colSpan = 1; // TODO: increment by one for each moore-output field
      td.classList.add("m-0", "p-0");
      const btnGroup = document.createElement("div");
      btnGroup.classList.add("btn-group");
      td.appendChild(btnGroup);
      btnGroup.style.width = "calc(100% - 15px)";
      const label = document.createElement("div");
      btnGroup.appendChild(label);
      label.classList.add("col", "mt-1", "ms-1", "p-0");
      label.style.maxWidth = "32px";
      if (i == 0)
        label.innerHTML = "&nbsp;&nbsp;" + '<i class="fa-solid fa-code"></i>';
      else
        label.innerHTML =
          "&nbsp;&nbsp;" + '<i class="fa-solid fa-quote-left"></i>';
      const div = document.createElement("div");
      btnGroup.append(div);
      div.classList.add("col", "m-0", "p-0");
      input = document.createElement("input");
      div.appendChild(input);
      input.type = "text";
      input.classList.add("form-control", "border-white", "m-1", "p-0");
      input.value = i == 0 ? state.getCode() : state.getDesc();
      input.addEventListener("keyup", (e) => {
        const value = (<HTMLInputElement>e.target).value;
        if (i == 0) state.setCode(value);
        else state.setDesc(value);
        draw(canvas, ctx);
      });
    }
  }
  return table;
}
