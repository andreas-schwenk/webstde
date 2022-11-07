// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

import { drawState, drawTransition } from "./draw";
import {
  JSON_Signal,
  JSON_State,
  JSON_StateMachine,
  JSON_Transition,
  Pos2D,
} from "./interfaces";

export class StateMachine {
  private id = "";
  private signals: Signal[] = [];
  private states: State[] = [];
  private transitions: Transition[] = [];

  public addSignal(signal: Signal) {
    this.signals.push(signal);
  }

  public addState(state: State) {
    this.states.push(state);
    this.recalculateStateIndices();
  }

  public addTransition(t: Transition) {
    this.transitions.push(t);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const state of this.states) state.draw(ctx);
    for (const t of this.transitions) t.draw(ctx);
  }

  public select(pos: Pos2D): void {
    for (const state of this.states) state.select(pos);
  }

  public pickState(pos: Pos2D): State {
    for (const state of this.states) {
      if (state.pick(pos)) return state;
    }
    return null;
  }

  public getSignals(): Signal[] {
    return this.signals;
  }

  public getStates(): State[] {
    return this.states;
  }

  public getSelectedStates(): State[] {
    const list: State[] = [];
    for (const state of this.states) {
      if (state.isSelected()) list.push(state);
    }
    return list;
  }

  public deleteSelection(): void {
    const newStates: State[] = [];
    for (const state of this.states)
      if (state.isSelected() == false) newStates.push(state);
    this.states = newStates;
    this.recalculateStateIndices();
  }

  public snap(mousePos: Pos2D): Pos2D {
    const delta = 25; // TODO: configure / parameter
    let pos = mousePos;
    for (const state of this.states) {
      if (Math.abs(state.getPos().x - mousePos.x) <= delta)
        pos.x = state.getPos().x;
      if (Math.abs(state.getPos().y - mousePos.y) <= delta)
        pos.y = state.getPos().y;
    }
    return pos;
  }

  public removeSignal(signal: Signal): void {
    const idx = this.signals.indexOf(signal);
    if (idx !== -1) {
      this.signals.splice(idx, 1);
    }
  }

  public moveUpSignal(signal: Signal): void {
    const idx = this.signals.indexOf(signal);
    if (idx > 0) {
      const tmp = this.signals[idx];
      this.signals[idx] = this.signals[idx - 1];
      this.signals[idx - 1] = tmp;
    }
  }

  public moveDownSignal(signal: Signal): void {
    const idx = this.signals.indexOf(signal);
    if (idx >= 0 && idx + 1 < this.signals.length) {
      const tmp = this.signals[idx];
      this.signals[idx] = this.signals[idx + 1];
      this.signals[idx + 1] = tmp;
    }
  }

  private recalculateStateIndices(): void {
    const n = this.states.length;
    for (let i = 0; i < n; i++) {
      this.states[i].setIdx(i);
    }
  }

  public toJSON(): JSON_StateMachine {
    return {
      id: this.id,
      signals: this.signals.map((e) => {
        return e.toJSON();
      }),
      states: this.states.map((e) => {
        return e.toJSON();
      }),
    };
  }
}

export class Signal {
  private id = "";
  private type = SignalType.Bit;
  private bits = 1;
  private direction = SignalDirection.Input;
  private desc = "";

  public constructor(
    id: string,
    type: SignalType,
    bits: number,
    direction: SignalDirection,
    desc = ""
  ) {
    this.id = id;
    this.type = type;
    this.bits = bits;
    this.direction = direction;
    this.desc = desc;
  }

  public setId(id: string): void {
    this.id = id;
  }
  public setType(type: SignalType): void {
    this.type = type;
  }
  public getType(): SignalType {
    return this.type;
  }
  public getId(): string {
    return this.id;
  }
  public setBits(bits: number): void {
    this.bits = bits;
  }
  public getBits(): number {
    return this.bits;
  }
  public setDirection(dir: SignalDirection): void {
    this.direction = dir;
  }
  public getDirection(): SignalDirection {
    return this.direction;
  }
  public setDesc(desc: string): void {
    this.desc = desc;
  }
  public getDesc(): string {
    return this.desc;
  }

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
  Bit = "BIT",
  BitN = "BIT_N",
  Signed = "SIGNED",
  Unsigned = "UNSIGNED",
}

export enum SignalDirection {
  Input = "IN",
  Output = "OUT",
  InputOutput = "INOUT",
}

export class State {
  private selected = false;
  private pos: Pos2D = {
    x: 0,
    y: 0,
  };
  private width = 220;
  private height = 110;
  private id = "";
  private idx = 0;
  private code = "";
  private desc = "";
  private mooreOutput: { [signalId: string]: string } = {};

  public constructor(pos: Pos2D, id: string, code = "", desc = "") {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.id = id;
    this.code = code;
    this.desc = desc;
  }

  public setId(id: string) {
    this.id = id;
  }
  public getId(): string {
    return this.id;
  }
  public getIdx(): number {
    return this.idx;
  }
  public setIdx(idx: number): void {
    this.idx = idx;
  }
  public setCode(code: string): void {
    this.code = code;
  }
  public getCode(): string {
    return this.code;
  }
  public setDesc(desc: string): void {
    this.desc = desc;
  }
  public getDesc(): string {
    return this.desc;
  }
  public getPos(): Pos2D {
    return this.pos;
  }
  public isSelected(): boolean {
    return this.selected;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    drawState(ctx, this.selected, this.pos, this.width, this.height, this.id);
  }

  public pick(pos: Pos2D): boolean {
    return (
      pos.x >= this.pos.x - this.width / 2 &&
      pos.x <= this.pos.x + this.width / 2 &&
      pos.y >= this.pos.y - this.height / 2 &&
      pos.y <= this.pos.y + this.height / 2
    );
  }

  public select(pos: Pos2D): void {
    this.selected = this.pick(pos);
  }

  public toJSON(): JSON_State {
    return {
      id: this.id,
      x: this.pos.x,
      y: this.pos.y,
      code: this.code,
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
  private selected = false;

  constructor(from: State, to: State) {
    this.from = from;
    this.to = to;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    //drawState(ctx, this.selected, this.pos, this.width, this.height, this.id);
    drawTransition(ctx, this.selected, this.from.getPos(), this.to.getPos());
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
