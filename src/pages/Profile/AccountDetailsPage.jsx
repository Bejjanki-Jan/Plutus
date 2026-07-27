import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { FiArrowLeft, FiPlus, FiStar, FiTrendingUp, FiTrendingDown, FiAlertCircle, FiCreditCard, FiDollarSign, FiX, FiShoppingBag, FiCoffee, FiHome, FiZap, FiFilm, FiShoppingCart, FiCalendar } from 'react-icons/fi'
import { BsBank, BsCashCoin } from 'react-icons/bs'
import './AccountDetailsPage.scss'

// Dummy accounts data with extended details
const accountsData = [
  {
    id: 1,
    name: 'Chase Checking',
    type: 'bank',
    balance: 12450.00,
    isPrimary: true,
    accountNumber: '****4521',
    lastTransaction: 'Grocery Store - $45.20',
    insights: [
      { type: 'positive', text: 'Spending is 15% lower than last month' },
      { type: 'info', text: 'Upcoming bill: Netflix $15.99 on Aug 1' }
    ],
    extendedInsights: [
      { type: 'positive', text: 'Your average daily balance increased by $230' },
      { type: 'info', text: 'Most transactions occur on weekends' },
      { type: 'positive', text: 'No overdraft fees in the last 6 months' }
    ],
    recentTransactions: [
      { id: 1, merchant: 'Whole Foods Market', amount: -45.20, date: '2026-07-24', category: 'Groceries' },
      { id: 2, merchant: 'Shell Gas Station', amount: -52.00, date: '2026-07-23', category: 'Transportation' },
      { id: 3, merchant: 'Direct Deposit - Salary', amount: 3500.00, date: '2026-07-22', category: 'Income' }
    ],
    topCategories: [
      { name: 'Groceries', amount: 485.30, percentage: 35, icon: 'shopping-cart' },
      { name: 'Utilities', amount: 245.00, percentage: 18, icon: 'zap' },
      { name: 'Dining', amount: 198.50, percentage: 14, icon: 'coffee' }
    ]
  },
  {
    id: 2,
    name: 'Visa Credit Card',
    type: 'credit',
    balance: -2340.50,
    isPrimary: false,
    accountNumber: '****8832',
    creditLimit: 10000,
    lastTransaction: 'Amazon - $129.99',
    insights: [
      { type: 'warning', text: 'Credit utilization at 23%' },
      { type: 'positive', text: 'Payment due in 12 days' }
    ],
    extendedInsights: [
      { type: 'info', text: 'Minimum payment: $47.00' },
      { type: 'positive', text: 'On-time payment streak: 24 months' },
      { type: 'warning', text: 'Interest charge estimate: $38.50' }
    ],
    recentTransactions: [
      { id: 1, merchant: 'Amazon.com', amount: -129.99, date: '2026-07-24', category: 'Shopping' },
      { id: 2, merchant: 'Spotify Premium', amount: -9.99, date: '2026-07-20', category: 'Entertainment' },
      { id: 3, merchant: 'Uber Eats', amount: -34.50, date: '2026-07-19', category: 'Dining' }
    ],
    topCategories: [
      { name: 'Shopping', amount: 890.50, percentage: 42, icon: 'shopping-bag' },
      { name: 'Entertainment', amount: 325.00, percentage: 15, icon: 'film' },
      { name: 'Dining', amount: 278.25, percentage: 13, icon: 'coffee' }
    ]
  },
  {
    id: 3,
    name: 'Savings Account',
    type: 'bank',
    balance: 28750.00,
    isPrimary: false,
    accountNumber: '****7823',
    interestRate: 4.5,
    lastTransaction: 'Transfer from Checking - $500',
    insights: [
      { type: 'positive', text: 'On track to reach savings goal' },
      { type: 'info', text: 'Interest earned: $42.30 this month' }
    ],
    extendedInsights: [
      { type: 'positive', text: 'APY is above national average (0.45%)' },
      { type: 'info', text: 'Total interest earned this year: $487.20' },
      { type: 'positive', text: '92% progress towards $30,000 goal' }
    ],
    recentTransactions: [
      { id: 1, merchant: 'Transfer from Checking', amount: 500.00, date: '2026-07-22', category: 'Transfer' },
      { id: 2, merchant: 'Interest Payment', amount: 42.30, date: '2026-07-01', category: 'Interest' },
      { id: 3, merchant: 'Transfer from Checking', amount: 500.00, date: '2026-06-22', category: 'Transfer' }
    ],
    topCategories: [
      { name: 'Transfers In', amount: 2500.00, percentage: 85, icon: 'home' },
      { name: 'Interest', amount: 127.50, percentage: 15, icon: 'trending-up' }
    ]
  },
  {
    id: 4,
    name: 'Cash Wallet',
    type: 'cash',
    balance: 450.00,
    isPrimary: false,
    lastTransaction: 'ATM Withdrawal - $200',
    insights: [
      { type: 'info', text: 'Cash spending increased this week' }
    ],
    extendedInsights: [
      { type: 'warning', text: 'Cash withdrawals up 25% this month' },
      { type: 'info', text: 'Average cash spend: $180/week' }
    ],
    recentTransactions: [
      { id: 1, merchant: 'ATM Withdrawal', amount: -200.00, date: '2026-07-23', category: 'Cash' },
      { id: 2, merchant: 'Farmers Market', amount: -35.00, date: '2026-07-21', category: 'Groceries' },
      { id: 3, merchant: 'ATM Withdrawal', amount: -100.00, date: '2026-07-15', category: 'Cash' }
    ],
    topCategories: [
      { name: 'Cash Withdrawals', amount: 600.00, percentage: 65, icon: 'dollar-sign' },
      { name: 'Groceries', amount: 120.00, percentage: 20, icon: 'shopping-cart' },
      { name: 'Dining', amount: 85.00, percentage: 15, icon: 'coffee' }
    ]
  },
  {
    id: 5,
    name: 'Amex Platinum',
    type: 'credit',
    balance: -890.25,
    isPrimary: false,
    accountNumber: '****3001',
    creditLimit: 25000,
    lastTransaction: 'Restaurant - $85.00',
    insights: [
      { type: 'positive', text: 'Earned 2,500 points this month' },
      { type: 'info', text: 'Annual fee due in 45 days' }
    ],
    extendedInsights: [
      { type: 'positive', text: 'Total rewards: 125,000 points ($1,250 value)' },
      { type: 'info', text: 'Lounge access used 3 times this year' },
      { type: 'warning', text: 'Annual fee: $695 due Sept 8' }
    ],
    recentTransactions: [
      { id: 1, merchant: 'The Capital Grille', amount: -85.00, date: '2026-07-24', category: 'Dining' },
      { id: 2, merchant: 'Delta Airlines', amount: -425.00, date: '2026-07-18', category: 'Travel' },
      { id: 3, merchant: 'Marriott Hotels', amount: -289.00, date: '2026-07-17', category: 'Travel' }
    ],
    topCategories: [
      { name: 'Travel', amount: 1850.00, percentage: 55, icon: 'home' },
      { name: 'Dining', amount: 680.00, percentage: 25, icon: 'coffee' },
      { name: 'Entertainment', amount: 245.00, percentage: 10, icon: 'film' }
    ]
  }
]

const getAccountIcon = (type, size = 24) => {
  switch (type) {
    case 'bank':
      return <BsBank size={size} />
    case 'credit':
      return <FiCreditCard size={size} />
    case 'cash':
      return <BsCashCoin size={size} />
    default:
      return <FiDollarSign size={size} />
  }
}

const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'shopping-cart':
      return <FiShoppingCart size={16} />
    case 'shopping-bag':
      return <FiShoppingBag size={16} />
    case 'coffee':
      return <FiCoffee size={16} />
    case 'zap':
      return <FiZap size={16} />
    case 'home':
      return <FiHome size={16} />
    case 'film':
      return <FiFilm size={16} />
    case 'trending-up':
      return <FiTrendingUp size={16} />
    case 'dollar-sign':
      return <FiDollarSign size={16} />
    default:
      return <FiShoppingBag size={16} />
  }
}

const getInsightIcon = (type) => {
  switch (type) {
    case 'positive':
      return <FiTrendingUp size={14} />
    case 'warning':
      return <FiAlertCircle size={14} />
    default:
      return <FiAlertCircle size={14} />
  }
}

function AccountDetailsPage() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)

  const formatBalance = (balance) => {
    const isNegative = balance < 0
    const formatted = Math.abs(balance).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    return isNegative ? `-${formatted}` : formatted
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="account-details-page">
      <div className="account-details-page__header">
        <button 
          className="account-details-page__back-btn"
          onClick={() => navigate('/profile')}
        >
          <FiArrowLeft size={20} />
          <span>Back to Profile</span>
        </button>
        <h1>Your Accounts</h1>
        <p className="account-details-page__subtitle">Manage and monitor all your financial accounts</p>
      </div>

      <div className="accounts-grid">
        {accountsData.map((account, index) => (
          <Dialog.Root key={account.id} onOpenChange={(open) => open && setSelectedAccount(account)}>
            <Dialog.Trigger asChild>
              <div
                className={`account-card ${hoveredCard === account.id ? 'account-card--expanded' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(account.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="account-card__header">
                  <div className="account-card__icon" data-type={account.type}>
                    {getAccountIcon(account.type)}
                  </div>
                  <div className="account-card__title-section">
                    <h3 className="account-card__name">
                      {account.name}
                      {account.isPrimary && (
                        <span className="account-card__primary-badge">
                          <FiStar size={12} />
                          Primary
                        </span>
                      )}
                    </h3>
                    <span className="account-card__type">{account.type}</span>
                  </div>
                </div>

                <div className="account-card__balance">
                  <span className="account-card__balance-label">Available Balance</span>
                  <span className={`account-card__balance-value ${account.balance < 0 ? 'negative' : ''}`}>
                    {formatBalance(account.balance)}
                  </span>
                </div>

                <div className="account-card__details">
                  <div className="account-card__last-transaction">
                    <span className="label">Last Transaction</span>
                    <span className="value">{account.lastTransaction}</span>
                  </div>

                  <div className="account-card__insights">
                    <span className="insights-title">AI Insights</span>
                    {account.insights.map((insight, idx) => (
                      <div key={idx} className={`insight insight--${insight.type}`}>
                        {getInsightIcon(insight.type)}
                        <span>{insight.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="dialog-content">
                <div className="dialog-header">
                  <div className="dialog-header__icon" data-type={account.type}>
                    {getAccountIcon(account.type, 32)}
                  </div>
                  <div className="dialog-header__info">
                    <Dialog.Title className="dialog-title">
                      {account.name}
                      {account.isPrimary && (
                        <span className="dialog-primary-badge">
                          <FiStar size={12} />
                          Primary
                        </span>
                      )}
                    </Dialog.Title>
                    <Dialog.Description className="dialog-subtitle">
                      {account.accountNumber && `Account ${account.accountNumber}`}
                      {account.type === 'credit' && account.creditLimit && ` • Limit: ${formatBalance(account.creditLimit)}`}
                      {account.interestRate && ` • ${account.interestRate}% APY`}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button className="dialog-close" aria-label="Close">
                      <FiX size={20} />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="dialog-balance-section">
                  <div className="dialog-balance">
                    <span className="dialog-balance__label">Current Balance</span>
                    <span className={`dialog-balance__value ${account.balance < 0 ? 'negative' : ''}`}>
                      {formatBalance(account.balance)}
                    </span>
                  </div>
                  {account.type === 'credit' && account.creditLimit && (
                    <div className="dialog-credit-meter">
                      <div className="credit-meter__bar">
                        <div 
                          className="credit-meter__fill" 
                          style={{ width: `${(Math.abs(account.balance) / account.creditLimit) * 100}%` }}
                        />
                      </div>
                      <span className="credit-meter__text">
                        {((Math.abs(account.balance) / account.creditLimit) * 100).toFixed(0)}% utilized
                      </span>
                    </div>
                  )}
                </div>

                <div className="dialog-sections">
                  <div className="dialog-section">
                    <h3 className="dialog-section__title">
                      <FiCalendar size={16} />
                      Recent Transactions
                    </h3>
                    <div className="transactions-list">
                      {account.recentTransactions.map((txn, idx) => (
                        <div key={txn.id} className="transaction-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                          <div className="transaction-item__info">
                            <span className="transaction-item__merchant">{txn.merchant}</span>
                            <span className="transaction-item__category">{txn.category} • {formatDate(txn.date)}</span>
                          </div>
                          <span className={`transaction-item__amount ${txn.amount > 0 ? 'positive' : ''}`}>
                            {txn.amount > 0 ? '+' : ''}{formatBalance(txn.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dialog-section">
                    <h3 className="dialog-section__title">
                      <FiShoppingBag size={16} />
                      Top Spending Categories
                    </h3>
                    <div className="categories-list">
                      {account.topCategories.map((cat, idx) => (
                        <div key={idx} className="category-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                          <div className="category-item__icon">
                            {getCategoryIcon(cat.icon)}
                          </div>
                          <div className="category-item__info">
                            <div className="category-item__header">
                              <span className="category-item__name">{cat.name}</span>
                              <span className="category-item__amount">{formatBalance(cat.amount)}</span>
                            </div>
                            <div className="category-item__bar">
                              <div 
                                className="category-item__fill" 
                                style={{ width: `${cat.percentage}%`, animationDelay: `${idx * 0.15}s` }}
                              />
                            </div>
                          </div>
                          <span className="category-item__percentage">{cat.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dialog-section dialog-section--insights">
                    <h3 className="dialog-section__title">
                      <FiTrendingUp size={16} />
                      AI Insights
                    </h3>
                    <div className="insights-grid">
                      {[...account.insights, ...account.extendedInsights].map((insight, idx) => (
                        <div key={idx} className={`insight-card insight-card--${insight.type}`} style={{ animationDelay: `${idx * 0.08}s` }}>
                          {getInsightIcon(insight.type)}
                          <span>{insight.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ))}

        <div className="account-card account-card--add">
          <div className="add-account-content">
            <div className="add-icon">
              <FiPlus size={32} />
            </div>
            <span>Add New Account</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountDetailsPage
