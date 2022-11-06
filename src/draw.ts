// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

import { GuiState, guiState, mouseX, mouseY, machine } from ".";

export function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  machine.draw(ctx);

  switch (guiState) {
    case GuiState.InsertMachineState:
      ctx.strokeStyle = "gray";
      drawState(ctx, true, mouseX, mouseY, 220, 100);
      break;
  }
}

export function drawState(
  ctx: CanvasRenderingContext2D,
  selected: boolean,
  x: number,
  y: number,
  width: number,
  height: number,
  label = ""
) {
  if (selected) {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;
  } else {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
  }

  ctx.beginPath();
  ctx.ellipse(x, y, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();

  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y - height / 6);
}
