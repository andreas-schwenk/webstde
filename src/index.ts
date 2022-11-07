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
  const signalsElement = document.getElementById("signals") as HTMLDivElement;
  signalsElement.innerHTML = "";
  signalsElement.appendChild(generateSignalTable(machine.getSignals()));
  const addSignalButton = document.getElementById(
    "addSignal"
  ) as HTMLButtonElement;
  addSignalButton.onclick = function () {
    console.log("add");
    const sig = new Signal("", SignalType.Bit, 1, SignalDirection.Input, "");
    machine.addSignal(sig);
    signalsElement.innerHTML = "";
    signalsElement.appendChild(generateSignalTable(machine.getSignals()));
  };

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
  table.style.tableLayout = "fixed";
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
  //th.style.width = "75px";
  //th.style.maxWidth = "75px";
  // TYPE header
  th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "TYPE";
  //th.style.width = "75px";
  //th.style.maxWidth = "75px";
  // BITS header
  th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "BITS";
  //th.style.width = "50x";
  //th.style.minWidth = "50px";
  //th.style.maxWidth = "50px";
  // I/O header
  th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "I/O";
  //th.style.width = "75px";
  //th.style.maxWidth = "75px";
  // BUTTONS header
  th = document.createElement("th");
  tr.appendChild(th);
  th.classList.add("bg-light", "text-dark", "my-1", "py-1");
  th.scope = "col";
  th.innerHTML = "";
  //th.style.width = "100px";
  //th.style.minWidth = "100px";
  //th.style.maxWidth = "100px";
  // rows
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  for (const signal of signals) {
    // first row
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    // id
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
    // type
    let types = ["BIT", "BIT_N", "SIGNED", "UNSIGNED"];
    let td = document.createElement("td");
    tr.appendChild(td);
    td.classList.add("m-0", "p-1");
    let dropdown = document.createElement("div");
    td.appendChild(dropdown);
    dropdown.classList.add("dropdown");
    let button = document.createElement("button");
    dropdown.appendChild(button);
    button.classList.add(
      "btn",
      "btn-sm",
      "btn-outline-secondary",
      "text-dark",
      "dropdown-toggle",
      "border-white"
    );
    button.type = "button";
    button.setAttribute("data-bs-toggle", "dropdown");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = signal.getType();
    let ul = document.createElement("ul");
    dropdown.appendChild(ul);
    ul.classList.add("dropdown-menu");
    for (const t of types) {
      const li = document.createElement("li");
      ul.appendChild(li);
      const a = document.createElement("a");
      li.appendChild(a);
      a.classList.add("dropdown-item");
      a.style.cursor = "pointer";
      a.innerHTML = t;
      const b = button;
      a.onclick = function () {
        switch (t) {
          case "BIT":
            signal.setType(SignalType.Bit);
            break;
          case "BIT_N":
            signal.setType(SignalType.BitN);
            break;
          case "SIGNED":
            signal.setType(SignalType.Signed);
            break;
          case "UNSIGNED":
            signal.setType(SignalType.Unsigned);
            break;
        }
        b.innerHTML = t;
      };
    }
    // bits
    td = document.createElement("td");
    tr.appendChild(td);
    td.classList.add("m-0", "p-0");
    input = document.createElement("input");
    td.appendChild(input);
    input.type = "text";
    input.classList.add("form-control", "border-white");
    input.value = "" + signal.getBits();
    input.addEventListener("keyup", (e) => {
      const value = (<HTMLInputElement>e.target).value;
      signal.setBits(parseInt(value)); // TODO: check if string is a valid number
      draw(canvas, ctx);
    });
    // DIRECTION
    const dirs = ["IN", "OUT", "INOUT"];
    td = document.createElement("td");
    tr.appendChild(td);
    td.classList.add("m-0", "p-1");
    dropdown = document.createElement("div");
    td.appendChild(dropdown);
    dropdown.classList.add("dropdown");
    button = document.createElement("button");
    dropdown.appendChild(button);
    button.classList.add(
      "btn",
      "btn-sm",
      "btn-outline-secondary",
      "text-dark",
      "dropdown-toggle",
      "border-white"
    );
    button.type = "button";
    button.setAttribute("data-bs-toggle", "dropdown");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = signal.getDirection();
    ul = document.createElement("ul");
    dropdown.appendChild(ul);
    ul.classList.add("dropdown-menu");
    for (const d of dirs) {
      const li = document.createElement("li");
      ul.appendChild(li);
      const a = document.createElement("a");
      li.appendChild(a);
      a.classList.add("dropdown-item");
      a.style.cursor = "pointer";
      a.innerHTML = d;
      const b = button;
      a.onclick = function () {
        switch (d) {
          case "IN":
            signal.setDirection(SignalDirection.Input);
            break;
          case "OUT":
            signal.setDirection(SignalDirection.Output);
            break;
          case "INOUT":
            signal.setDirection(SignalDirection.InputOutput);
            break;
        }
        b.innerHTML = d;
      };
    }
    // BUTTONS
    td = document.createElement("td");
    tr.appendChild(td);
    td.classList.add("m-0", "p-1", "text-center");
    const buttonLabels = [
      '<i class="fa-solid fa-arrow-up"></i>',
      '<i class="fa-solid fa-arrow-down"></i>',
      '<i class="fa-solid fa-trash-can"></i>',
    ];
    const buttonTitles = ["move up", "move down", "delete"];
    for (let i = 0; i < buttonLabels.length; i++) {
      const label = buttonLabels[i];
      button = document.createElement("button");
      td.appendChild(button);
      button.classList.add("btn", "btn-sm", "btn-outline-dark", "text-dark");
      button.setAttribute("data-bs-toggle", "tooltip");
      button.setAttribute("data-bs-placement", "bottom");
      button.title = buttonTitles[i];
      button.innerHTML = (i > 0 ? "&nbsp;" : "") + label;
      if (i == 0 || i == 1) {
        button.onclick = function () {
          // arrow up / down
          if (i == 0) machine.moveUpSignal(signal);
          else machine.moveDownSignal(signal);
          const signalsElement = document.getElementById(
            "signals"
          ) as HTMLDivElement;
          signalsElement.innerHTML = "";
          signalsElement.appendChild(generateSignalTable(machine.getSignals()));
        };
      } else {
        button.onclick = function () {
          // delete signal
          machine.removeSignal(signal);
          const signalsElement = document.getElementById(
            "signals"
          ) as HTMLDivElement;
          signalsElement.innerHTML = "";
          signalsElement.appendChild(generateSignalTable(machine.getSignals()));
        };
      }
    }
    // second row: description
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    td = document.createElement("td");
    tr.appendChild(td);
    td.colSpan = 5;
    td.classList.add("m-0", "p-0");
    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");
    td.appendChild(btnGroup);
    btnGroup.style.width = "calc(100% - 15px)";
    const label = document.createElement("div");
    btnGroup.appendChild(label);
    label.classList.add("col", "mt-1", "ms-1", "p-0");
    label.style.maxWidth = "32px";
    label.innerHTML = "&nbsp;&nbsp;" + '<i class="fa-solid fa-quote-left"></i>';
    const div = document.createElement("div");
    btnGroup.append(div);
    div.classList.add("col", "m-0", "p-0");
    input = document.createElement("input");
    div.appendChild(input);
    input.type = "text";
    input.classList.add("form-control", "border-white", "m-1", "p-0");
    input.value = signal.getDesc();
    input.addEventListener("keyup", (e) => {
      const value = (<HTMLInputElement>e.target).value;
      signal.setDesc(value);
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
