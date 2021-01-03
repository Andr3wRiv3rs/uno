import {
  makeAutoObservable,
} from 'mobx'
import {
  SafePlayer, 
} from '../../@types'
import {
  api, 
} from '../utils'

class AuthStore {
  loggedIn = false
  nickname: string

  constructor () {
    makeAutoObservable(this)
  }

  setAuth (nickname: string) {
    authStore.nickname = nickname
    authStore.loggedIn = true
  }

  async setNickname (nickname: string) {
    return await api.post('/auth/set-nickname', { nickname })
      .then(() => window.location.reload())
      .catch(r => r)
  }
}

api.get<SafePlayer>('/auth')
  .then(({ data: player }) => authStore.setAuth(player.nickname))
  .catch(r => r)

export const authStore = new AuthStore()
