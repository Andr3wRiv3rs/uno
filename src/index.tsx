import {
  FunctionalComponent,
  h,
} from 'preact'
import './scss'
import {
  Home, 
} from './components/home'
import {
  Room, 
} from './components/Room'
import Router from 'preact-router'
import './utils/index.ts'

const app: FunctionalComponent = () => (
  <Router>
    <Home path="/" />
    <Room path="/room/:name" />
  </Router>
)

export default app
