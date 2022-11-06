// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

import { JSON_Signal, JSON_State, JSON_Transition } from "./interfaces";

export class StateMachine {
  private id = "";
  private states: State[] = [];
  private transitions: Transition[] = [];
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
  private x = 0;
  private y = 0;
  private id = "";
  private idx = 0;
  private desc = "";
  private mooreOutput: { [signalId: string]: string };

  public getIdx(): number {
    return this.idx;
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
