import {
  h,
} from 'preact'
import {
  useState, 
} from 'preact/hooks'
import styles from './index.scss'
import {
  observer,
} from 'mobx-react-lite'
import {
  lobbyStore,
  authStore,
} from '../../store'

const Create = () => {
  const [name, setName] = useState('')

  const handleChange = event => {
    const target: HTMLInputElement = event.target

    setName(target.value)
  }

  const handleClick = () => {
    lobbyStore.create({
      name,
      private: false,
    })
  }

  return <div>
    <h2>create a game</h2>
    <input placeholder="lobby name.." />

    <span>
      <input id="private" type="checkbox" onChange={handleChange} />
      <label for="private">private</label>
    </span>

    <button onClick={handleClick}>start</button>
  </div>
}

const Lobbies = observer(() => {
  const list = lobbyStore.list.map(({
    name,
  }) => (
    <div>
      <h3>{name}</h3>
      <button>join</button>
    </div>
  ))

  return <div className={styles.lobbies}>{
    list.length === 0 ? <p>No games found</p> : list
  }</div>
})

const Browse = () => (
  <div>
    <h2>browse for games</h2>
    <Lobbies />
  </div>
)

const Auth = () => {
  const [nickname, setNickname] = useState('')

  const handleChange = event => {
    const target: HTMLInputElement = event.target

    setNickname(target.value)
  }

  const handleClick = () => {
    authStore.setNickname(nickname)
  }

  return <div>
    <input placeholder="nickname.." onChange={handleChange} />
    <button onClick={handleClick}>log in</button>
  </div>
}

export const Home = observer(() => <>
  <div className={styles.home}>
    <h1>Uno</h1>
    {
      authStore.loggedIn ? <>
        <Create />
        <Browse />
      </> : <Auth />
    }
  </div>
</>)
