// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SafeCard {}

export type CardColor = 'red' | 'green' | 'blue' | 'yellow' | 'special'
export type CardType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'skip' | 'reverse' | 'draw-2' | 'wild' | 'wild-draw-4'

export interface Card {
  color: CardColor
  type: CardType
}
