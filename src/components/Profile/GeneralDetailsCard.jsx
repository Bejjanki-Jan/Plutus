import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import './GeneralDetailsCard.scss'

function GeneralDetailsCard() {
  const navigate = useNavigate()

  return (
    <div className="details-card details-card--general">
      <button 
        className="details-card__edit-btn"
        onClick={() => navigate('/profile/general')}
        aria-label="Edit general details"
      >
        <FiEdit2 size={18} />
      </button>
      
      <h2 className="details-card__title">General</h2>
      
      <div className="details-card__content">
        <div className="details-card__item">
          <span className="details-card__label">Full Name</span>
          <span className="details-card__value">John Doe</span>
        </div>
        <div className="details-card__item">
          <span className="details-card__label">Display Name</span>
          <span className="details-card__value">johndoe</span>
        </div>
        <div className="details-card__item">
          <span className="details-card__label">Date of Birth</span>
          <span className="details-card__value">January 15, 1990</span>
        </div>
        <div className="details-card__item">
          <span className="details-card__label">Phone</span>
          <span className="details-card__value">+1 (555) 123-4567</span>
        </div>
        <div className="details-card__item">
          <span className="details-card__label">Location</span>
          <span className="details-card__value">New York, USA</span>
        </div>
      </div>
    </div>
  )
}

export default GeneralDetailsCard
