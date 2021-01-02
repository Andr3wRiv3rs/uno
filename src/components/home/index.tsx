import {
  h,
} from 'preact'
import styles from './index.scss'
import {
  observer,
} from 'mobx-react-lite'
import {
  lobbies,
} from '../../store'

const Create = () => (
  <div>
    <h2>create a game</h2>
    <input placeholder="lobby name.." />
    <button>start</button>
  </div>
)

const Lobbies = observer(() => {
  const list = lobbies.list.map(({
    name,
  }) => (
    <div>
      <h3>{ name }</h3>
      <button>join</button>
    </div>
  ))

  return <div className={styles.lobbies}>{list}</div>
})

const Browse = () => (
  <div>
    <h2>browse for games</h2>
    <Lobbies />
  </div>
)

export const Home = () => (
  <div className={styles.home}>
    <input placeholder="nickname.." />
    <div>
      <Create />
      <Browse />
    </div>
  </div>
)
