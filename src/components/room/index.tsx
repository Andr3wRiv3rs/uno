import {
  FunctionalComponent,
  h,
} from 'preact'
import styles from './index.scss'
import {
  authStore,
  lobbyStore,
} from '../../store'
import {
  observer, 
} from 'mobx-react-lite'
import {
  useEffect,
  useRef,
  useState, 
} from 'preact/hooks'
import {
  pixi,
  CardObject,
  ws,
  generateHands,
  testMatchingCards,
  alignAll,
  generateDiscardDrawPiles,
  setActiveNametag,
  generateHand,
} from '../../utils/index'
import {
  Player,
  Card,
  SafeLobby, 
} from '@types'

const isInGame = () => Boolean(lobbyStore.players[authStore.nickname])

window.addEventListener('resize', alignAll)

const processPlayers = (): void => {
  generateHands()
  alignAll()
  testMatchingCards()
}

// TODO: figure out why typescript isnt enforcing strict return types
const init = () => {
  generateDiscardDrawPiles()
  processPlayers()
  lobbyStore.subscribeToRoom(lobbyStore.current)
  lobbyStore.discard.color = lobbyStore.current.currentColor
  lobbyStore.discard.update()
  setActiveNametag()

  if (!lobbyStore.players[authStore.nickname]) {
    lobbyStore.join()
  }

  ws.onEvent<Player>('insert-player', (player) => {
    // TODO: convert "players" to a map
    generateHand(player, Object.values(lobbyStore.players).length)
    processPlayers()
  })

  ws.onEvent<{
    nickname: string
    card: Card
    wasForced: boolean
  }>('draw-card', ({ nickname, card }) => {
    const cardObject = new CardObject(card)

    cardObject.x = lobbyStore.draw.x
    cardObject.y = lobbyStore.draw.y

    cardObject.flipped = true

    lobbyStore.players[nickname].hand.push(cardObject)
  })

  ws.onEvent('insert-lobby', () => {
    requestAnimationFrame(() => {
      processPlayers()
    })
  })

  ws.onEvent<{
    lobby: SafeLobby
    payload: SafeLobby
  }>('lobby-update', ({ lobby, payload }) => {
    if (lobby.name !== lobbyStore.current.name) return

    requestAnimationFrame(() => {
      console.log(payload)
      Object.assign(lobbyStore.current, lobby)

      lobbyStore.discard.color = lobby.currentColor
      lobbyStore.discard.update()
      console.log(lobbyStore.current.currentColor)

      processPlayers()
      setActiveNametag()
    })
  })

  ws.onEvent<{
    nickname: string
    cardIndex: number
    card: Card
  }>('play-card', ({ nickname, cardIndex, card }) => {
    if (nickname === authStore.nickname) return

    const [cardObject] = lobbyStore.players[nickname].hand.splice(cardIndex, 1)

    cardObject.type = card.type
    cardObject.color = card.color

    cardObject.rotate(lobbyStore.discard.rotation)

    cardObject.moveTo(lobbyStore.discard.x, lobbyStore.discard.y).then(() => {
      lobbyStore.discard.color = cardObject.color
      lobbyStore.discard.type = cardObject.type

      lobbyStore.discard.update()
      cardObject.destroy()
    })
  })
}

const Picker: FunctionalComponent = () => (
  <div className={styles.picker}>
    <button className={styles.red} onClick={() => lobbyStore.chooseColor('red')} />
    <button className={styles.green} onClick={() => lobbyStore.chooseColor('green')} />
    <button className={styles.blue} onClick={() => lobbyStore.chooseColor('blue')} />
    <button className={styles.yellow} onClick={() => lobbyStore.chooseColor('yellow')} />
  </div>
)

let started = false

export const Room: FunctionalComponent<{
  name?: string
}> = observer((props) => {
  lobbyStore.current = lobbyStore.list.find(lobby => lobby.name === props.name)
  const pixiContainer = useRef(null)

  const [, setTick] = useState(null)

  const isMyTurn = isInGame() && lobbyStore.current?.turn === lobbyStore.players[authStore.nickname]?.index

  useEffect(() => {
    if (started || !pixiContainer || !lobbyStore.current || !authStore.nickname) return

    started = true

    pixiContainer.current.appendChild(pixi.view)
    pixi.resizeTo = pixiContainer.current

    setTick(0) // trigger render, there's definitely a more elegant way to do this

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixiContainer, lobbyStore.current, authStore.nickname])

  return <div className={styles.room}>
    { lobbyStore.current?.awaitingChoice && isMyTurn ? <Picker /> : '' }
    <div className={styles.container} ref={pixiContainer} />
  </div>
})
