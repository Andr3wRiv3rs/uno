import {
  Card,
} from "./Card"

export interface SafePlayer {
  nickname: string
  hand?: Card[]
  index?: number
}

export interface Player extends SafePlayer {
  hand?: Card[]
}
