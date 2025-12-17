import './App.css'
import Signup from '../components/signup/signup'
import {Route, Routes} from 'react-router-dom'
import Todo from '../components/todo/todo'
function App() {

  return (
    <Routes>
      <Route path='/' element =  {<Signup/>}/>
      <Route path='/home' element = {<Todo/>} />
    </Routes>
  )
}

export default App
