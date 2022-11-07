// webSTDE - 2022 by Andreas Schwenk <contact@compiler-construction.com>
// LICENSE: GPLv3

/* TODO: JSON format
{
  "id": "test",
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

export interface JSON_Signal {
  id: string;
  type: string;
  bits: number;
  io: string;
  desc: string;
}

export interface JSON_State {
  id: string;
  x: number;
  y: number;
  q: { [signalName: string]: string };
  code: string;
  desc: string;
}

export interface JSON_Transition {
  u: number;
  v: number;
  "u.angle": number;
  "v.angle": number;
  cond: string;
}

export interface JSON_StateMachine {
  id: string;
  signals: JSON_Signal[];
  states: JSON_State[];
}

export interface Pos2D {
  x: number;
  y: number;
}
