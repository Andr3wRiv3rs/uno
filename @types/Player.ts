import {
  Card,
  SafeCard, 
} from "./Card"

export interface SafePlayer {
  nickname: string
  hand?: SafeCard[]
  index?: number
}

export interface Player extends SafePlayer {
  hand?: Card[]
}
