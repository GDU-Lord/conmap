export const LABELS = ["red", "green", "blue"];
export type LABELS = "red" | "green" | "blue";

export function getNumber(t: LABELS) {
  return LABELS.indexOf(t);
}

export function getLable(n: number) {
  return LABELS[n];
}