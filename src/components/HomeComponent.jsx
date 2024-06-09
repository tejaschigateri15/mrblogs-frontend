
import { Outlet } from 'react-router-dom'
// import Nav from './Nav'
import Navbar from './Blog/tttts'

export default function Home() {

  return (
    <div>
        <Navbar/>      
        <Outlet/>
    </div>
  )
}
