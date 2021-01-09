import {
  lobbyStore, 
} from "../../store"

export const setActiveNametag = (): void => {
  Object.values(lobbyStore.players).forEach(({ nametag, player }) => {
    nametag.active = lobbyStore.current.turn === player.index
    nametag.update()
  })
}
