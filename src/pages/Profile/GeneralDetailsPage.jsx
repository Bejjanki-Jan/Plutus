import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import { useTheme, themes } from '../../context/ThemeContext'
import './GeneralDetailsPage.scss'

function GeneralDetailsPage() {
  const navigate = useNavigate()
  const { themeName, setTheme } = useTheme()

  const themeList = Object.values(themes)

  const handleSave = () => {
    // Theme is already saved via context
    navigate('/profile')
  }

  return (
    <div className="general-details-page">
      <div className="general-details-page__header">
        <button 
          className="general-details-page__back-btn"
          onClick={() => navigate('/profile')}
        >
          <FiArrowLeft size={20} />
          <span>Back to Profile</span>
        </button>
        <h1>Edit General Details</h1>
      </div>

      <div className="general-details-page__form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" defaultValue="John Doe" />
          </div>

          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input type="text" id="displayName" defaultValue="johndoe" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Contact Number</label>
            <input type="tel" id="phone" defaultValue="+1 (555) 123-4567" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" defaultValue="john.doe@email.com" />
          </div>
        </div>

        <div className="form-group form-group--full">
          <label>Color Theme</label>
          <div className="theme-chooser">
            {themeList.map((theme) => (
              <button
                key={theme.name}
                type="button"
                className={`theme-chooser__option ${themeName === theme.name ? 'theme-chooser__option--active' : ''}`}
                onClick={() => setTheme(theme.name)}
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                }}
                title={theme.name}
              >
                {themeName === theme.name && <span className="theme-chooser__check">✓</span>}
              </button>
            ))}
          </div>
          <span className="theme-chooser__label">Selected: {themeName}</span>
        </div>

        <button className="general-details-page__save-btn" onClick={handleSave}>
          <FiSave size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}

export default GeneralDetailsPage

