// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SafeCard {}

export interface Card {
  color: 'red' | 'green' | 'blue' | 'yellow'
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'skip' | 'reverse' | 'draw-2' | 'wild' | 'wild-draw-4'
}
