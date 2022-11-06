/* TODO: JSON format
{
  "signals": [
    {"id":"x","type":"bit_n","bits":8,"io":"in","desc":"This is my desc text..."}
  ],
  "states": [
    {"id":"start","x":100,"y":200,"q":{"y1":"1100","y2":"1100"},"desc":"Start state"}
  ],
  "transitions" [
    {"u":0,"v":1,"u.angle":0,"v.angle":1,"cond":"x"}
  ]
}
*/

export class StateMachine {
  states: State[] = [];
  transitions: Transition[] = [];
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

export class Signal {
  id = "";
  type = SignalType.Bit;
  bits = 1;
  direction = SignalDirection.Input;
  desc = "";
}

export class State {
  x = 0;
  y = 0;
  id = "";
  idx = 0;
  desc = "";
  mooreOutput: { [signalId: string]: string };
}

export class Transition {
  from: State;
  to: State;
  fromAngle = 0;
  toAngle = 0;
  condition = "";
  mealyOutput: { [signalId: string]: string };

  constructor(from: State, to: State) {
    this.from = from;
    this.to = to;
  }

  toJSON(): JSON {
    return {
      u: this.from.idx,
      v: this.to.idx,
      "u.angle": this.fromAngle,
      "v.angle": this.toAngle,
      cond: this.condition,
    };
  }
}
