import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignInForm from './components/Sign-in-form'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>
      Sign in to Continue
    </h1>
      <SignInForm />
      
    </>
  )
}

export default App
