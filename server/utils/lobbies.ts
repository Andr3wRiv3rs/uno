import {
  Lobby,
  SafeLobby, 
} from "../../@types"

export const getSafeLobby = (lobby: Lobby): SafeLobby => {
  const {
    name,
    isPrivate,
    host,
    players,
    turn,
    discard,
    order,
    started,
    chat,
    currentColor,
  } = lobby

  return {
    name,
    isPrivate,
    host,
    players,
    turn,
    discard,
    order,
    started,
    chat,
    currentColor,
  }
}
