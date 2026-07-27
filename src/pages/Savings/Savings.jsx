import { useState, useMemo } from 'react'
import { 
  FiTrendingUp, FiDollarSign, FiPlus, FiEdit2, FiTrash2,
  FiCalendar, FiPercent, FiRefreshCw, FiTarget, FiPieChart,
  FiCheckCircle, FiX, FiInfo
} from 'react-icons/fi'
import { BsBank, BsGraphUp, BsLightningCharge } from 'react-icons/bs'
import './Savings.scss'

// Dummy investments data (would be detected from bank statements)
const initialInvestments = [
  {
    id: 1,
    name: 'Mutual Fund SIP',
    type: 'recurring',
    monthlyAmount: 500,
    months: 24,
    interestRate: 12,
    category: 'Mutual Funds',
    detectedFrom: 'Chase Checking',
    icon: 'mutual-fund'
  },
  {
    id: 2,
    name: 'Fixed Deposit',
    type: 'one-time',
    amount: 10000,
    interestRate: 6.5,
    months: 12,
    category: 'Fixed Deposit',
    detectedFrom: 'Savings Account',
    icon: 'fd'
  },
  {
    id: 3,
    name: '401(k) Contribution',
    type: 'recurring',
    monthlyAmount: 750,
    months: 36,
    interestRate: 8,
    category: 'Retirement',
    detectedFrom: 'Chase Checking',
    icon: 'retirement'
  },
  {
    id: 4,
    name: 'Stock Investment',
    type: 'one-time',
    amount: 5000,
    interestRate: 15,
    months: 18,
    category: 'Stocks',
    detectedFrom: 'Chase Checking',
    icon: 'stocks'
  },
  {
    id: 5,
    name: 'Index Fund',
    type: 'recurring',
    monthlyAmount: 300,
    months: 12,
    interestRate: 10,
    category: 'Index Funds',
    detectedFrom: 'Chase Checking',
    icon: 'index-fund'
  }
]

const getInvestmentIcon = (icon) => {
  switch (icon) {
    case 'mutual-fund': return <BsGraphUp size={20} />
    case 'fd': return <BsBank size={20} />
    case 'retirement': return <FiTarget size={20} />
    case 'stocks': return <FiTrendingUp size={20} />
    case 'index-fund': return <FiPieChart size={20} />
    default: return <FiDollarSign size={20} />
  }
}

// Calculate future value for recurring investment (SIP formula)
const calculateRecurringValue = (monthlyAmount, months, annualRate) => {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return monthlyAmount * months
  const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  return futureValue
}

// Calculate future value for one-time investment (Compound Interest)
const calculateOneTimeValue = (principal, months, annualRate) => {
  const rate = annualRate / 100
  const years = months / 12
  return principal * Math.pow(1 + rate, years)
}

function Savings() {
  const [investments, setInvestments] = useState(initialInvestments)
  const [editingId, setEditingId] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'recurring',
    monthlyAmount: '',
    amount: '',
    months: '',
    interestRate: '',
    category: 'Other',
    icon: 'default'
  })

  // Calculate totals
  const totals = useMemo(() => {
    let totalInvested = 0
    let totalValue = 0
    let monthlyInvestment = 0

    investments.forEach(inv => {
      if (inv.type === 'recurring') {
        const invested = inv.monthlyAmount * inv.months
        const value = calculateRecurringValue(inv.monthlyAmount, inv.months, inv.interestRate)
        totalInvested += invested
        totalValue += value
        monthlyInvestment += inv.monthlyAmount
      } else {
        totalInvested += inv.amount
        totalValue += calculateOneTimeValue(inv.amount, inv.months || 12, inv.interestRate)
      }
    })

    return {
      totalInvested,
      totalValue,
      totalReturns: totalValue - totalInvested,
      monthlyInvestment,
      avgReturn: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0
    }
  }, [investments])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleUpdateInvestment = (id, field, value) => {
    setInvestments(prev => prev.map(inv => 
      inv.id === id ? { ...inv, [field]: parseFloat(value) || value } : inv
    ))
  }

  const handleDeleteInvestment = (id) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id))
  }

  const handleAddInvestment = () => {
    if (!newInvestment.name) return
    
    const investment = {
      id: Date.now(),
      name: newInvestment.name,
      type: newInvestment.type,
      category: newInvestment.category,
      icon: 'default',
      detectedFrom: 'Manual Entry',
      interestRate: parseFloat(newInvestment.interestRate) || 0,
      months: parseInt(newInvestment.months) || 12,
      ...(newInvestment.type === 'recurring' 
        ? { monthlyAmount: parseFloat(newInvestment.monthlyAmount) || 0 }
        : { amount: parseFloat(newInvestment.amount) || 0 }
      )
    }

    setInvestments(prev => [...prev, investment])
    setIsAddingNew(false)
    setNewInvestment({
      name: '',
      type: 'recurring',
      monthlyAmount: '',
      amount: '',
      months: '',
      interestRate: '',
      category: 'Other',
      icon: 'default'
    })
  }

  return (
    <div className="savings-page">
      {/* Header */}
      <div className="savings-header">
        <div className="savings-header__title">
          <h1>
            Savings & Investments
            <div className="info-tooltip">
              <FiInfo className="info-icon" size={18} />
              <div className="info-tooltip__content">
                <strong>How it works:</strong> We detect recurring investment amounts from your linked bank statements. 
                You can adjust the interest rate and duration to see estimated returns. 
                Note: These are projections based on the rates you enter, not actual market returns.
              </div>
            </div>
          </h1>
          <p>Track your investments detected from bank statements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="savings-summary">
        <div className="summary-card summary-card--invested">
          <div className="summary-card__icon">
            <FiDollarSign size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">Total Invested</span>
            <span className="summary-card__value">{formatCurrency(totals.totalInvested)}</span>
            <span className="summary-card__sub">Principal amount</span>
          </div>
        </div>

        <div className="summary-card summary-card--value">
          <div className="summary-card__icon">
            <FiTrendingUp size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">Estimated Value</span>
            <span className="summary-card__value">{formatCurrency(totals.totalValue)}</span>
            <span className="summary-card__sub positive">+{formatCurrency(totals.totalReturns)} returns</span>
          </div>
        </div>

        <div className="summary-card summary-card--monthly">
          <div className="summary-card__icon">
            <FiRefreshCw size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">Monthly Investment</span>
            <span className="summary-card__value">{formatCurrency(totals.monthlyInvestment)}</span>
            <span className="summary-card__sub">Recurring SIPs</span>
          </div>
        </div>

        <div className="summary-card summary-card--returns">
          <div className="summary-card__icon">
            <BsGraphUp size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">Avg. Returns</span>
            <span className="summary-card__value">{totals.avgReturn.toFixed(1)}%</span>
            <span className="summary-card__sub">Overall growth</span>
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="investments-section">
        <div className="investments-section__header">
          <h2>Your Investments</h2>
          <span className="detected-badge">
            <BsLightningCharge size={12} />
            Detected from statements
          </span>
        </div>

        <div className="investments-list">
          {investments.map((investment) => {
            const isEditing = editingId === investment.id
            const investedAmount = investment.type === 'recurring' 
              ? investment.monthlyAmount * investment.months 
              : investment.amount
            const currentValue = investment.type === 'recurring'
              ? calculateRecurringValue(investment.monthlyAmount, investment.months, investment.interestRate)
              : calculateOneTimeValue(investment.amount, investment.months || 12, investment.interestRate)
            const returns = currentValue - investedAmount
            const returnPercentage = (returns / investedAmount) * 100

            return (
              <div key={investment.id} className={`investment-card ${isEditing ? 'editing' : ''}`}>
                <div className="investment-card__header">
                  <div className="investment-card__icon">
                    {getInvestmentIcon(investment.icon)}
                  </div>
                  <div className="investment-card__info">
                    <h3>{investment.name}</h3>
                    <div className="investment-card__meta">
                      <span className={`type-badge type-badge--${investment.type}`}>
                        {investment.type === 'recurring' ? <FiRefreshCw size={12} /> : <FiCheckCircle size={12} />}
                        {investment.type === 'recurring' ? 'Recurring' : 'One-time'}
                      </span>
                      <span className="category-badge">{investment.category}</span>
                      <span className="source-badge">via {investment.detectedFrom}</span>
                    </div>
                  </div>
                  <div className="investment-card__actions">
                    <button 
                      className="action-btn"
                      onClick={() => setEditingId(isEditing ? null : investment.id)}
                    >
                      {isEditing ? <FiX size={16} /> : <FiEdit2 size={16} />}
                    </button>
                    <button 
                      className="action-btn action-btn--delete"
                      onClick={() => handleDeleteInvestment(investment.id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="investment-card__body">
                  <div className="investment-card__values">
                    <div className="value-item">
                      <span className="value-item__label">
                        {investment.type === 'recurring' ? 'Monthly Amount' : 'Principal'}
                      </span>
                      {isEditing ? (
                        <div className="input-group">
                          <span className="input-prefix">$</span>
                          <input
                            type="number"
                            value={investment.type === 'recurring' ? investment.monthlyAmount : investment.amount}
                            onChange={(e) => handleUpdateInvestment(
                              investment.id, 
                              investment.type === 'recurring' ? 'monthlyAmount' : 'amount',
                              e.target.value
                            )}
                          />
                        </div>
                      ) : (
                        <span className="value-item__value">
                          {formatCurrency(investment.type === 'recurring' ? investment.monthlyAmount : investment.amount)}
                          {investment.type === 'recurring' && <small>/month</small>}
                        </span>
                      )}
                    </div>

                    {investment.type === 'recurring' && (
                      <div className="value-item">
                        <span className="value-item__label">
                          <FiCalendar size={14} />
                          Duration (Months)
                        </span>
                        {isEditing ? (
                          <div className="input-group">
                            <input
                              type="number"
                              value={investment.months}
                              onChange={(e) => handleUpdateInvestment(investment.id, 'months', e.target.value)}
                            />
                            <span className="input-suffix">months</span>
                          </div>
                        ) : (
                          <span className="value-item__value">{investment.months} months</span>
                        )}
                      </div>
                    )}

                    <div className="value-item">
                      <span className="value-item__label">
                        <FiPercent size={14} />
                        Interest Rate (Annual)
                      </span>
                      {isEditing ? (
                        <div className="input-group">
                          <input
                            type="number"
                            step="0.1"
                            value={investment.interestRate}
                            onChange={(e) => handleUpdateInvestment(investment.id, 'interestRate', e.target.value)}
                          />
                          <span className="input-suffix">%</span>
                        </div>
                      ) : (
                        <span className="value-item__value">{investment.interestRate}%</span>
                      )}
                    </div>
                  </div>

                  <div className="investment-card__results">
                    <div className="result-item">
                      <span className="result-item__label">Total Invested</span>
                      <span className="result-item__value">{formatCurrency(investedAmount)}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-item__label">Estimated Value</span>
                      <span className="result-item__value highlight">{formatCurrency(currentValue)}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-item__label">Expected Returns</span>
                      <span className="result-item__value positive">
                        +{formatCurrency(returns)}
                        <small>({returnPercentage.toFixed(1)}%)</small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add New Investment */}
        {isAddingNew ? (
          <div className="add-investment-form">
            <div className="add-investment-form__header">
              <h3>Add New Investment</h3>
              <button className="close-btn" onClick={() => setIsAddingNew(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="add-investment-form__body">
              <div className="form-row">
                <div className="form-group">
                  <label>Investment Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Mutual Fund SIP"
                    value={newInvestment.name}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Investment Type</label>
                  <div className="type-toggle">
                    <button
                      className={newInvestment.type === 'recurring' ? 'active' : ''}
                      onClick={() => setNewInvestment(prev => ({ ...prev, type: 'recurring' }))}
                    >
                      <FiRefreshCw size={14} />
                      Recurring
                    </button>
                    <button
                      className={newInvestment.type === 'one-time' ? 'active' : ''}
                      onClick={() => setNewInvestment(prev => ({ ...prev, type: 'one-time' }))}
                    >
                      <FiCheckCircle size={14} />
                      One-time
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                {newInvestment.type === 'recurring' ? (
                  <div className="form-group">
                    <label>Monthly Amount ($)</label>
                    <input
                      type="number"
                      placeholder="500"
                      value={newInvestment.monthlyAmount}
                      onChange={(e) => setNewInvestment(prev => ({ ...prev, monthlyAmount: e.target.value }))}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Principal Amount ($)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={newInvestment.amount}
                      onChange={(e) => setNewInvestment(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                )}

                {newInvestment.type === 'recurring' && (
                  <div className="form-group">
                    <label>Duration (Months)</label>
                    <input
                      type="number"
                      placeholder="24"
                      value={newInvestment.months}
                      onChange={(e) => setNewInvestment(prev => ({ ...prev, months: e.target.value }))}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="12"
                    value={newInvestment.interestRate}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, interestRate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newInvestment.category}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Stocks">Stocks</option>
                    <option value="Fixed Deposit">Fixed Deposit</option>
                    <option value="Index Funds">Index Funds</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Bonds">Bonds</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleAddInvestment}>
                  <FiPlus size={16} />
                  Add Investment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="add-investment-btn" onClick={() => setIsAddingNew(true)}>
            <FiPlus size={20} />
            <span>Add New Investment</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Savings
