import React, {useState, useEffect} from "react"
import "../css/tailwind.css"

import ViewType from './viewtypes/ViewType'

function App() {
  let [userData, setUserData] = useState(false)
  let [viewType, setViewType] = useState('month')

  let fetchUser = async () =>
  {
    let user = await fetch((process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + '/is-api-key-valid', {credentials: 'include'}).then((res) =>  
    {
      if (res.status === 200)
      {
        return res.json()
      } else 
      {
        window.location.href = (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000') + '/login'
      }
    }).catch((err) => console.log(err))

    setUserData(user)
  }

  useEffect(() => 
  {
    fetchUser()
  }, [])

  let refreshUser = () =>
  {
    fetchUser()
  }

  if (!userData)
  {
    return (
      <div className="flex justify-center items-center h-screen">
        <img className="w-16" src="loader.svg" alt="loading"/>
      </div>
    )
  }

  return (
    <section className="h-full w-full">
      <header>
        <button onClick={() => setViewType('settings')} className={viewType === 'settings' ? "opacity-75 shadow outline-none w-10 absolute mt-2 ml-2" : "hover:opacity-75 shadow outline-none w-10 absolute mt-2 ml-2"}><img src="setting.svg" alt="Settings"/></button>
        <div className=" min-h-16 text-primary flex items-center mx-4">
          <h1 className="text-center font-bold text-2xl w-full">HELLO {userData.username.toUpperCase()}!</h1>
        </div>
      </header>

      <main className="m-auto w-full flex justify-center items-center flex-col">
        <div className="my-4 flex justify-between items-center w-10/12 lg:w-4/12">
          <div className="flex flex-1 justify-center items-center">
            <button onClick={() => setViewType('week')} className={viewType === 'week' ? "px-1 text-sm bg-secondary text-gray-100 rounded shadow mx-2 py-2 opacity-75" : "px-1 text-sm bg-secondary text-gray-100 rounded shadow mx-2 py-2 hover:opacity-75 "}>Week</button>
          </div>
          <div className="flex flex-1 justify-center items-center">
            <button onClick={() => setViewType('month')} className={viewType === 'month' ? "px-1 text-sm bg-secondary text-gray-100 rounded shadow mx-2 py-2 opacity-75" : "px-1 text-sm bg-secondary text-gray-100 rounded shadow mx-2 py-2 hover:opacity-75 "}>Month</button>
          </div>
          <div className="flex flex-1 justify-center items-center">
            <button onClick={() => setViewType('pay-period')} className={viewType === 'pay-period' ? "px-1 text-sm bg-secondary text-gray-100 rounded shadow mx-2 py-2 opacity-75" : "px-1 text-sm bg-secondary text-gray-100 rounded shadow mx-2 py-2 hover:opacity-75 "}>Pay Period</button>
          </div>
        </div>
        <ViewType refreshUser={refreshUser} user={userData} viewtype={viewType} />
      </main>

      <footer className="flex justify-center items-center flex-col bg-primary mt-4 py-4 w-screen">
        <h5 className="flex items-center">Made with <img className="w-5 ml-2" src="heart.svg" alt="love"/></h5>
        <h6 className="text-sm">Want to request a feature? <a className="text-accent underline cursor-pointer" href="/request-feature">Click here!</a></h6>
        <img className="w-32 ml-2 pt-2" src="count-my-hours-logo.svg" alt="love"/>
      </footer>
    </section>
  )
}

export default App
