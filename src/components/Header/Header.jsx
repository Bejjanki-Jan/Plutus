import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiLogOut } from 'react-icons/fi'
import './Header.scss'

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfileClick = () => {
    navigate('/profile')
    setIsDropdownOpen(false)
  }

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    console.log('Sign out clicked')
    setIsDropdownOpen(false)
  }

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__left">
          {/* Can add logo or title here */}
        </div>
        
        <div className="header__right" ref={dropdownRef}>
          <button 
            className="header__profile-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Profile menu"
          >
            <div className="header__avatar">
              <FiUser size={20} />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="header__dropdown">
              <button className="header__dropdown-item" onClick={handleProfileClick}>
                <FiUser size={18} />
                <span>Profile</span>
              </button>
              <button className="header__dropdown-item header__dropdown-item--signout" onClick={handleSignOut}>
                <FiLogOut size={18} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
