import {
  Card,
  CardColor,
  CardType,
  Player, 
} from "../../@types"

export const generateCards = (count: number, type: CardType): Card[] => {
  const colors: CardColor[] = ['red', 'green', 'blue', 'yellow', 'special']  

  const cards: Card[] = []

  for(let i = 0; i < count; i++) {
    for (const color of colors) {
      cards.push({
        color,
        type,
      })
    }
  }

  return cards
}

export const generateSpecialCards = (count: number, type: CardType): Card[] => {
  const cards: Card[] = []

  for(let i = 0; i < count; i++) {
    cards.push({
      color: 'special',
      type,
    })
  }

  return cards
}

export const generateDeck = (): Card[] => [
  ...generateCards(2, 0),
  ...generateCards(2, 1),
  ...generateCards(2, 2),
  ...generateCards(2, 3),
  ...generateCards(2, 4),
  ...generateCards(2, 5),
  ...generateCards(2, 6),
  ...generateCards(2, 7),
  ...generateCards(2, 8),
  ...generateCards(2, 9),
  ...generateCards(2, 'skip'),
  ...generateCards(2, 'reverse'),
  ...generateCards(2, 'draw-2'),
  ...generateSpecialCards(4, 'wild'),
  ...generateSpecialCards(4, 'wild-draw-4'),
]

export const generatePlayer = (nickname: string, index: number): Player => {
  return {
    nickname,
    hand: [],
    index,
  }
}

export const drawCards = (player: Player, count: number, draw: Card[]): void => {
  player.hand.push(...draw.splice(0, count))
}
