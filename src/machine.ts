// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

import { drawState } from "./draw";
import { JSON_Signal, JSON_State, JSON_Transition } from "./interfaces";

export class StateMachine {
  private id = "";
  private states: State[] = [];
  private transitions: Transition[] = [];

  public addState(state: State) {
    this.states.push(state);
    this.recalculateStateIndices();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const state of this.states) state.draw(ctx);
  }

  public select(x: number, y: number): void {
    for (const state of this.states) state.select(x, y);
  }

  private recalculateStateIndices(): void {
    const n = this.states.length;
    for (let i = 0; i < n; i++) {
      this.states[i].setIdx(i);
    }
  }
}

export class Signal {
  private id = "";
  private type = SignalType.Bit;
  private bits = 1;
  private direction = SignalDirection.Input;
  private desc = "";

  public toJSON(): JSON_Signal {
    return {
      id: this.id,
      type: this.type,
      bits: this.bits,
      io: this.direction,
      desc: this.desc,
    };
  }
}

export enum SignalType {
  Bit = "bit",
  BitN = "bit_n",
  Signed = "signed",
  Unsigned = "unsigned",
}

export enum SignalDirection {
  Input = "input",
  Output = "output",
  InputOutput = "inputOutput",
}

export class State {
  private selected = false;
  private x = 0;
  private y = 0;
  private width = 220;
  private height = 110;
  private id = "";
  private idx = 0;
  private desc = "";
  private mooreOutput: { [signalId: string]: string };

  public constructor(x: number, y: number, id: string, desc = "") {
    this.x = x;
    this.y = y;
    this.id = id;
    this.desc = desc;
  }

  public getIdx(): number {
    return this.idx;
  }
  public setIdx(idx: number): void {
    this.idx = idx;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    drawState(
      ctx,
      this.selected,
      this.x,
      this.y,
      this.width,
      this.height,
      this.id
    );
  }

  public select(x: number, y: number): void {
    this.selected =
      x >= this.x - this.width / 2 &&
      x <= this.x + this.width / 2 &&
      y >= this.y - this.height / 2 &&
      y <= this.y + this.height / 2;
  }

  public toJSON(): JSON_State {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      desc: this.desc,
      q: this.mooreOutput,
    };
  }
}

export class Transition {
  private from: State;
  private to: State;
  private fromAngle = 0;
  private toAngle = 0;
  private condition = "";
  private mealyOutput: { [signalId: string]: string };

  constructor(from: State, to: State) {
    this.from = from;
    this.to = to;
  }

  public toJSON(): JSON_Transition {
    return {
      u: this.from.getIdx(),
      v: this.to.getIdx(),
      "u.angle": this.fromAngle,
      "v.angle": this.toAngle,
      cond: this.condition,
    };
  }
}
