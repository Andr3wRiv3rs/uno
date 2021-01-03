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
import {
  Link, 
} from 'preact-router/match'
import {
  route, 
} from 'preact-router'

const Create = () => {
  const [name, setName] = useState('')
  const [isPrivate, setPrivate] = useState(false)

  const handleChange = event => {
    const target: HTMLInputElement = event.target

    setName(target.value)
  }

  const handleCheckboxChange = event => {
    const target: HTMLInputElement = event.target

    setPrivate(target.value === 'on')
  }

  const handleClick = () => {
    lobbyStore.create({
      name,
      isPrivate,
    }).then(({ data: lobby }) => {
      route(`/room/${lobby.name}`)
    })
  }

  return <div>
    <h2>create a game</h2>
    <input placeholder="lobby name.." onChange={handleChange} />

    <span>
      <input id="private" type="checkbox" onChange={handleCheckboxChange} />
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
      <Link href={`/room/${name}`}>
        <button>join</button>
      </Link>
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
