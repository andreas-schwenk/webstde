// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

import { GuiState, guiState, machine, mousePos } from ".";
import { Pos2D } from "./interfaces";

export function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "28px Arial";
  ctx.textAlign = "left";
  ctx.fillText("output vector = [y1, y2]", 10, 35); // TODO

  machine.draw(ctx);

  switch (guiState) {
    case GuiState.InsertMachineState:
      ctx.strokeStyle = "gray";
      drawState(ctx, true, machine.snap(mousePos), 220, 100);
      break;
  }
}

export function drawState(
  ctx: CanvasRenderingContext2D,
  selected: boolean,
  pos: Pos2D,
  width: number,
  height: number,
  label = ""
) {
  if (selected) {
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "blue";
    ctx.lineWidth = 4;
  } else {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
  }

  ctx.beginPath();
  ctx.ellipse(pos.x, pos.y, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.moveTo(pos.x - width / 2, pos.y);
  ctx.lineTo(pos.x + width / 2, pos.y);
  ctx.stroke();

  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, pos.x, pos.y - height / 6);
}
