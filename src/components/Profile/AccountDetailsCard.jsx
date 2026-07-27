import { FiEdit2, FiCreditCard, FiDollarSign } from 'react-icons/fi'
import { BsBank } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import './AccountDetailsCard.scss'

const accounts = [
  {
    id: 1,
    name: 'Chase Bank',
    type: 'bank',
    balance: 12450.00,
    insight: 'Your savings increased by 12% this month!',
    icon: BsBank,
    color: '#667eea',
  },
  {
    id: 2,
    name: 'Visa Credit Card',
    type: 'credit',
    balance: -2340.50,
    insight: 'You have $7,659 available credit remaining.',
    icon: FiCreditCard,
    color: '#f43f5e',
  },
  {
    id: 3,
    name: 'Cash',
    type: 'cash',
    balance: 850.00,
    insight: 'Consider depositing excess cash to earn interest.',
    icon: FiDollarSign,
    color: '#10b981',
  },
]

function AccountDetailsCard() {
  const navigate = useNavigate()

  const formatBalance = (balance) => {
    const isNegative = balance < 0
    const formatted = Math.abs(balance).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    return isNegative ? `-${formatted}` : formatted
  }

  return (
    <div className="details-card details-card--account">
      <button 
        className="details-card__edit-btn"
        onClick={() => navigate('/profile/account')}
        aria-label="Edit account details"
      >
        <FiEdit2 size={18} />
      </button>
      
      <h2 className="details-card__title">Accounts</h2>
      
      <div className="accounts-list">
        {accounts.map((account) => {
          const IconComponent = account.icon
          return (
            <div key={account.id} className="account-card">
              <div className="account-card__header">
                <div 
                  className="account-card__icon"
                  style={{ background: `${account.color}20`, color: account.color }}
                >
                  <IconComponent size={16} />
                </div>
                <span className="account-card__name">{account.name}</span>
              </div>
              <div className="account-card__details">
                <div className="account-card__balance">
                  <span className="account-card__label">Balance</span>
                  <span 
                    className="account-card__value"
                    style={{ color: account.balance < 0 ? '#f87171' : '#a5b4fc' }}
                  >
                    {formatBalance(account.balance)}
                  </span>
                </div>
                <div className="account-card__insight">
                  <span className="account-card__label">AI Insight</span>
                  <span className="account-card__insight-text">{account.insight}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AccountDetailsCard
