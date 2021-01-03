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
import {
  SafeLobby, 
} from '/@/../@types/Lobby'

const Game = (props: {
  lobby: SafeLobby,
}) => {
  return <div />
}

export const Room = observer((props: {
  name: string
}) => {
  const lobby = lobbyStore.list.find(lobby => lobby.name === props.name)

  return <div className={styles.room}>
    <Game lobby={lobby} />
  </div>
})
