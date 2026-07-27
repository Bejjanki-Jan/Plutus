import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar'
import { FiHome, FiTrendingUp, FiDollarSign, FiFileText } from 'react-icons/fi'
import { BsArrowsExpandVertical } from 'react-icons/bs'
import { useTheme } from '../context/ThemeContext'
import './Sidebar.scss'

function AppSidebar({ collapsed, setCollapsed, activeMenu, onMenuClick }) {
  const { theme } = useTheme()

  return (
    <Sidebar
      collapsed={collapsed}
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          background: `linear-gradient(180deg, ${theme.bgGradientStart} 0%, ${theme.bgGradientEnd} 100%)`,
          borderRight: `1px solid rgba(${theme.primaryRgb}, 0.15)`,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <div className="sidebar-header">
        <button 
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <BsArrowsExpandVertical size={20} />
        </button>
        {!collapsed && <span className="sidebar-title">💰 Plutus</span>}
      </div>
      
      <div className="sidebar-menu-wrapper">
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              backgroundColor: active ? `rgba(${theme.primaryRgb}, 0.2)` : 'transparent',
              color: active ? theme.primary : 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: `rgba(${theme.primaryRgb}, 0.15)`,
                color: theme.primary,
              },
              borderRadius: '8px',
              margin: '4px 8px',
              padding: '12px 16px',
            }),
          }}
        >
          <MenuItem 
            icon={<FiHome size={20} />}
            active={activeMenu === 'home' || activeMenu === ''}
            onClick={() => onMenuClick('home')}
          >
            Home
          </MenuItem>
          <MenuItem 
            icon={<FiTrendingUp size={20} />}
            active={activeMenu === 'insights'}
            onClick={() => onMenuClick('insights')}
          >
            Insights
          </MenuItem>
          <MenuItem 
            icon={<FiDollarSign size={20} />}
            active={activeMenu === 'savings'}
            onClick={() => onMenuClick('savings')}
          >
            Savings
          </MenuItem>
          <MenuItem 
            icon={<FiFileText size={20} />}
            active={activeMenu === 'blueprints'}
            onClick={() => onMenuClick('blueprints')}
          >
            BluePrints
          </MenuItem>
        </Menu>
      </div>
    </Sidebar>
  )
}

export default AppSidebar
