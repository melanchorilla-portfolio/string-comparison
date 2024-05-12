import React from 'react'
import { NavBar } from '../components/NavBar'

const MainLayout = (props) => {
  return (
    <>
        <NavBar />
        {props.children}
    </>
  )
}

export default MainLayout