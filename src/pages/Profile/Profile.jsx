import { FiUser } from 'react-icons/fi'
import GeneralDetailsCard from '../../components/Profile/GeneralDetailsCard'
import AccountDetailsCard from '../../components/Profile/AccountDetailsCard'
import './Profile.scss'

function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-page__user-section">
        <div className="profile-page__avatar">
          <FiUser size={40} />
        </div>
        <div className="profile-page__user-info">
          <h1>John Doe</h1>
          <p>john.doe@email.com</p>
        </div>
      </div>

      <div className="profile-page__cards">
        <GeneralDetailsCard />
        <AccountDetailsCard />
      </div>
    </div>
  )
}

export default Profile
