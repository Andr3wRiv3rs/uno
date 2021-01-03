import {
  h,
} from 'preact'
import styles from './index.scss'
import {
  lobbyStore,
} from '../../store'
import {
  observer, 
} from 'mobx-react-lite'
// import {
//   SafeLobby, 
// } from '/@/../@types/Lobby'
import {
  useEffect,
  useRef, 
} from 'preact/hooks'
import {
  pixi,
} from '../../utils'

// const init = (lobby: SafeLobby) => {

// }

export const Room = observer((props: {
  name: string
}) => {
  const lobby = lobbyStore.list.find(lobby => lobby.name === props.name)
  const pixiContainer = useRef(null)

  lobby

  useEffect(() => {
    // if (!pixiContainer || !lobby) return

    pixiContainer.current.appendChild(pixi.view)
    pixi.resizeTo = pixiContainer.current

    // init(lobby)
  // }, [pixiContainer, lobby])
  }, [])

  return <div className={styles.room}>
    <div className={styles.container} ref={pixiContainer} />
  </div>
})
