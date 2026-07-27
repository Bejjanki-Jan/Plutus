import { useState, Suspense } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './App.scss'
import AppSidebar from './components/Sidebar'
import Header from './components/Header/Header'
import Loading from './components/Loading/Loading'

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get active menu from current path
  const getActiveMenu = () => {
    const path = location.pathname.slice(1) || 'home'
    return path
  }

  const handleMenuClick = (menu) => {
    navigate(`/${menu === 'home' ? '' : menu}`)
  }

  return (
    <div className="app-container">
      <AppSidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        activeMenu={getActiveMenu()}
        onMenuClick={handleMenuClick}
      />
      <div className="app">
        <Header />
        <main className="main">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
