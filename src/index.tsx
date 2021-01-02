// @ts-nocheck

import {
  h,
} from 'preact'
import './scss'
import {
  Home, 
} from './components/home'
import Router from 'preact-router'
import './utils/index.ts'

const app = () => (
  <Router>
    <Home path="/" />
  </Router>
)

export default app
