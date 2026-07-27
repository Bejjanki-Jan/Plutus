import { useState, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { 
  FiHeart, FiTrendingUp, FiTrendingDown, FiAlertCircle, 
  FiDollarSign, FiCreditCard, FiChevronDown, FiTarget,
  FiShoppingBag, FiCoffee, FiShoppingCart, FiFilm, FiZap, FiTruck,
  FiArrowRight, FiSave
} from 'react-icons/fi'
import { BsBank, BsCashCoin, BsLightningCharge } from 'react-icons/bs'
import './Insights.scss'

// Financial health data
const financialHealthData = {
  score: 72,
  totalIncome: 7500,
  totalExpenses: 4892,
  recurringPayments: 1250,
  savingsRate: 34.8,
  debtToIncome: 18.5,
  factors: [
    { name: 'Income Stability', score: 85, status: 'good' },
    { name: 'Expense Management', score: 68, status: 'moderate' },
    { name: 'Savings Rate', score: 75, status: 'good' },
    { name: 'Debt Management', score: 62, status: 'moderate' }
  ]
}

// Accounts data with spending history
const accountsData = [
  {
    id: 1,
    name: 'Chase Checking',
    type: 'bank',
    balance: 12450.00,
    interestRate: 0.01,
    recentActivity: 'high',
    spending15Days: [
      { day: 'Jul 12', amount: 145 },
      { day: 'Jul 13', amount: 89 },
      { day: 'Jul 14', amount: 234 },
      { day: 'Jul 15', amount: 56 },
      { day: 'Jul 16', amount: 312 },
      { day: 'Jul 17', amount: 178 },
      { day: 'Jul 18', amount: 92 },
      { day: 'Jul 19', amount: 267 },
      { day: 'Jul 20', amount: 134 },
      { day: 'Jul 21', amount: 189 },
      { day: 'Jul 22', amount: 245 },
      { day: 'Jul 23', amount: 167 },
      { day: 'Jul 24', amount: 298 },
      { day: 'Jul 25', amount: 123 },
      { day: 'Jul 26', amount: 156 }
    ],
    categorySpend: [
      { name: 'Groceries', amount: 485, percentage: 28 },
      { name: 'Utilities', amount: 345, percentage: 20 },
      { name: 'Dining', amount: 298, percentage: 17 },
      { name: 'Transport', amount: 245, percentage: 14 },
      { name: 'Shopping', amount: 212, percentage: 12 },
      { name: 'Entertainment', amount: 150, percentage: 9 }
    ],
    insights: [
      { type: 'saving', text: 'Reduce dining by 20% to save $60/month for Emergency Fund', impact: 60 },
      { type: 'positive', text: 'Utility bills are 15% lower than average', impact: null },
      { type: 'opportunity', text: 'Your grocery spending is consistent - consider bulk buying for 10% savings', impact: 48 }
    ]
  },
  {
    id: 2,
    name: 'Visa Credit Card',
    type: 'credit',
    balance: 2340.50,
    creditLimit: 10000,
    usagePercentage: 23.4,
    minPayment: 47,
    dueDate: '2026-08-15',
    spending15Days: [
      { day: 'Jul 12', amount: 89 },
      { day: 'Jul 13', amount: 234 },
      { day: 'Jul 14', amount: 0 },
      { day: 'Jul 15', amount: 156 },
      { day: 'Jul 16', amount: 78 },
      { day: 'Jul 17', amount: 345 },
      { day: 'Jul 18', amount: 0 },
      { day: 'Jul 19', amount: 123 },
      { day: 'Jul 20', amount: 267 },
      { day: 'Jul 21', amount: 0 },
      { day: 'Jul 22', amount: 189 },
      { day: 'Jul 23', amount: 45 },
      { day: 'Jul 24', amount: 312 },
      { day: 'Jul 25', amount: 0 },
      { day: 'Jul 26', amount: 178 }
    ],
    categorySpend: [
      { name: 'Shopping', amount: 890, percentage: 42 },
      { name: 'Dining', amount: 425, percentage: 20 },
      { name: 'Entertainment', amount: 340, percentage: 16 },
      { name: 'Subscriptions', amount: 245, percentage: 12 },
      { name: 'Travel', amount: 210, percentage: 10 }
    ],
    insights: [
      { type: 'warning', text: 'Shopping is draining 42% of your credit limit', impact: null },
      { type: 'saving', text: 'Cut subscription spending by 50% to save $122/month', impact: 122 },
      { type: 'positive', text: 'Credit utilization is healthy at 23.4%', impact: null }
    ]
  },
  {
    id: 3,
    name: 'Savings Account',
    type: 'bank',
    balance: 28750.00,
    interestRate: 4.5,
    recentActivity: 'low',
    spending15Days: [
      { day: 'Jul 12', amount: 0 },
      { day: 'Jul 13', amount: 0 },
      { day: 'Jul 14', amount: 0 },
      { day: 'Jul 15', amount: 0 },
      { day: 'Jul 16', amount: 0 },
      { day: 'Jul 17', amount: 0 },
      { day: 'Jul 18', amount: 0 },
      { day: 'Jul 19', amount: 0 },
      { day: 'Jul 20', amount: 0 },
      { day: 'Jul 21', amount: 0 },
      { day: 'Jul 22', amount: 500 },
      { day: 'Jul 23', amount: 0 },
      { day: 'Jul 24', amount: 0 },
      { day: 'Jul 25', amount: 0 },
      { day: 'Jul 26', amount: 0 }
    ],
    categorySpend: [
      { name: 'Transfers', amount: 500, percentage: 100 }
    ],
    insights: [
      { type: 'opportunity', text: 'Consider moving $10,000 to a high-yield investment (7-8% returns vs 4.5% savings APY)', impact: 300 },
      { type: 'info', text: 'Your savings are earning $107/month in interest', impact: null },
      { type: 'positive', text: 'Emergency fund is well-funded at 6 months of expenses', impact: null }
    ]
  },
  {
    id: 4,
    name: 'Amex Platinum',
    type: 'credit',
    balance: 8900.25,
    creditLimit: 15000,
    usagePercentage: 59.3,
    minPayment: 178,
    dueDate: '2026-08-08',
    spending15Days: [
      { day: 'Jul 12', amount: 425 },
      { day: 'Jul 13', amount: 0 },
      { day: 'Jul 14', amount: 289 },
      { day: 'Jul 15', amount: 567 },
      { day: 'Jul 16', amount: 0 },
      { day: 'Jul 17', amount: 834 },
      { day: 'Jul 18', amount: 123 },
      { day: 'Jul 19', amount: 0 },
      { day: 'Jul 20', amount: 456 },
      { day: 'Jul 21', amount: 0 },
      { day: 'Jul 22', amount: 678 },
      { day: 'Jul 23', amount: 234 },
      { day: 'Jul 24', amount: 0 },
      { day: 'Jul 25', amount: 912 },
      { day: 'Jul 26', amount: 345 }
    ],
    categorySpend: [
      { name: 'Travel', amount: 3200, percentage: 48 },
      { name: 'Dining', amount: 1450, percentage: 22 },
      { name: 'Shopping', amount: 980, percentage: 15 },
      { name: 'Entertainment', amount: 650, percentage: 10 },
      { name: 'Other', amount: 320, percentage: 5 }
    ],
    insights: [
      { type: 'danger', text: 'Credit utilization at 59.3% - aim to reduce below 30%', impact: null },
      { type: 'warning', text: 'Travel expenses are draining 48% of your limit', impact: null },
      { type: 'saving', text: 'Reduce travel spending by 30% to save $960/month', impact: 960 }
    ]
  },
  {
    id: 5,
    name: 'Cash Wallet',
    type: 'cash',
    balance: 450.00,
    recentActivity: 'moderate',
    spending15Days: [
      { day: 'Jul 12', amount: 25 },
      { day: 'Jul 13', amount: 45 },
      { day: 'Jul 14', amount: 0 },
      { day: 'Jul 15', amount: 35 },
      { day: 'Jul 16', amount: 60 },
      { day: 'Jul 17', amount: 0 },
      { day: 'Jul 18', amount: 40 },
      { day: 'Jul 19', amount: 25 },
      { day: 'Jul 20', amount: 0 },
      { day: 'Jul 21', amount: 55 },
      { day: 'Jul 22', amount: 30 },
      { day: 'Jul 23', amount: 0 },
      { day: 'Jul 24', amount: 45 },
      { day: 'Jul 25', amount: 35 },
      { day: 'Jul 26', amount: 20 }
    ],
    categorySpend: [
      { name: 'Dining', amount: 180, percentage: 44 },
      { name: 'Transport', amount: 120, percentage: 29 },
      { name: 'Miscellaneous', amount: 115, percentage: 27 }
    ],
    insights: [
      { type: 'info', text: 'Cash spending averages $28/day', impact: null },
      { type: 'saving', text: 'Track small purchases - they add up to $415/month', impact: 415 },
      { type: 'opportunity', text: 'Consider using cards for cashback rewards', impact: null }
    ]
  }
]

// Savings plans for insights
const savingsPlans = [
  { name: 'Emergency Fund', target: 10000, current: 7500 },
  { name: 'Vacation Trip', target: 5000, current: 2100 },
  { name: 'New Laptop', target: 2500, current: 1800 }
]

const getAccountIcon = (type) => {
  switch (type) {
    case 'bank': return <BsBank size={18} />
    case 'credit': return <FiCreditCard size={18} />
    case 'cash': return <BsCashCoin size={18} />
    default: return <FiDollarSign size={18} />
  }
}

const getCategoryIcon = (name) => {
  const icons = {
    'Groceries': <FiShoppingCart size={14} />,
    'Dining': <FiCoffee size={14} />,
    'Shopping': <FiShoppingBag size={14} />,
    'Transport': <FiTruck size={14} />,
    'Entertainment': <FiFilm size={14} />,
    'Utilities': <FiZap size={14} />,
    'Travel': <FiTarget size={14} />,
    'Subscriptions': <FiDollarSign size={14} />,
    'Transfers': <FiArrowRight size={14} />,
    'Miscellaneous': <FiDollarSign size={14} />,
    'Other': <FiDollarSign size={14} />
  }
  return icons[name] || <FiDollarSign size={14} />
}

const getHealthColor = (score) => {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

const getCreditUsageColor = (percentage) => {
  if (percentage <= 30) return '#10b981'
  if (percentage <= 40) return '#f59e0b'
  if (percentage <= 60) return '#f97316'
  return '#ef4444'
}

const getInsightIcon = (type) => {
  switch (type) {
    case 'positive': return <FiTrendingUp size={16} />
    case 'warning': return <FiAlertCircle size={16} />
    case 'danger': return <FiAlertCircle size={16} />
    case 'saving': return <FiSave size={16} />
    case 'opportunity': return <BsLightningCharge size={16} />
    default: return <FiAlertCircle size={16} />
  }
}

function Insights() {
  const [selectedAccountId, setSelectedAccountId] = useState(accountsData[0].id)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const selectedAccount = useMemo(() => 
    accountsData.find(acc => acc.id === selectedAccountId),
    [selectedAccountId]
  )

  const totalSpending = useMemo(() => 
    selectedAccount.spending15Days.reduce((sum, day) => sum + day.amount, 0),
    [selectedAccount]
  )

  const chartOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20, 20, 30, 0.95)',
      borderColor: 'rgba(var(--color-primary-rgb), 0.3)',
      textStyle: { color: '#fff' },
      formatter: (params) => {
        const data = params[0]
        return `<div style="font-size:12px;">
          <div style="color:rgba(255,255,255,0.6)">${data.name}</div>
          <div style="font-weight:600;font-size:14px;color:var(--color-accent)">$${data.value.toFixed(2)}</div>
        </div>`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: selectedAccount.spending15Days.map(d => d.day),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      axisLabel: { 
        color: 'rgba(255,255,255,0.5)', 
        fontSize: 10,
        formatter: '${value}'
      }
    },
    series: [{
      name: 'Spending',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      sampling: 'lttb',
      itemStyle: {
        color: selectedAccount.type === 'credit' ? getCreditUsageColor(selectedAccount.usagePercentage || 0) : 'var(--color-primary)'
      },
      lineStyle: {
        width: 3,
        color: selectedAccount.type === 'credit' ? getCreditUsageColor(selectedAccount.usagePercentage || 0) : 'var(--color-primary)'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: selectedAccount.type === 'credit' 
              ? `${getCreditUsageColor(selectedAccount.usagePercentage || 0)}40` 
              : 'rgba(var(--color-primary-rgb), 0.4)' },
            { offset: 1, color: 'rgba(0,0,0,0)' }
          ]
        }
      },
      data: selectedAccount.spending15Days.map(d => d.amount)
    }]
  }), [selectedAccount])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="insights-page">
      {/* Header */}
      <div className="insights-header">
        <div className="insights-header__title">
          <h1>Financial Insights</h1>
          <p>Deep dive into your financial health and spending patterns</p>
        </div>
      </div>

      {/* Financial Health Section */}
      <div className="health-section">
        <div className="health-card">
          <div className="health-card__header">
            <div className="health-card__icon">
              <FiHeart size={24} />
            </div>
            <div className="health-card__title">
              <h2>Financial Health Score</h2>
              <p>Based on income, expenses, and savings habits</p>
            </div>
          </div>

          <div className="health-card__score">
            <div className="score-circle" style={{ '--score-color': getHealthColor(financialHealthData.score) }}>
              <svg viewBox="0 0 100 100">
                <circle className="score-bg" cx="50" cy="50" r="45" />
                <circle 
                  className="score-fill" 
                  cx="50" cy="50" r="45"
                  style={{ 
                    strokeDasharray: `${financialHealthData.score * 2.83} 283`,
                    stroke: getHealthColor(financialHealthData.score)
                  }}
                />
              </svg>
              <div className="score-value">
                <span className="score-number">{financialHealthData.score}</span>
                <span className="score-label">/ 100</span>
              </div>
            </div>

            <div className="health-factors">
              {financialHealthData.factors.map((factor, idx) => (
                <div key={idx} className="health-factor">
                  <div className="health-factor__header">
                    <span className="health-factor__name">{factor.name}</span>
                    <span className="health-factor__score" style={{ color: getHealthColor(factor.score) }}>
                      {factor.score}%
                    </span>
                  </div>
                  <div className="health-factor__bar">
                    <div 
                      className="health-factor__fill"
                      style={{ 
                        width: `${factor.score}%`,
                        background: getHealthColor(factor.score)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="health-stats">
            <div className="health-stat">
              <span className="health-stat__label">Monthly Income</span>
              <span className="health-stat__value positive">{formatCurrency(financialHealthData.totalIncome)}</span>
            </div>
            <div className="health-stat">
              <span className="health-stat__label">Monthly Expenses</span>
              <span className="health-stat__value negative">{formatCurrency(financialHealthData.totalExpenses)}</span>
            </div>
            <div className="health-stat">
              <span className="health-stat__label">Recurring Payments</span>
              <span className="health-stat__value">{formatCurrency(financialHealthData.recurringPayments)}</span>
            </div>
            <div className="health-stat">
              <span className="health-stat__label">Savings Rate</span>
              <span className="health-stat__value positive">{financialHealthData.savingsRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Spending Section */}
      <div className="spending-section">
        <div className="spending-card">
          <div className="spending-card__header">
            <h2>Account Spending Analysis</h2>
            
            {/* Account Dropdown */}
            <div className="account-dropdown">
              <button 
                className="account-dropdown__trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="account-dropdown__icon">
                  {getAccountIcon(selectedAccount.type)}
                </span>
                <span className="account-dropdown__name">{selectedAccount.name}</span>
                <FiChevronDown className={`account-dropdown__chevron ${isDropdownOpen ? 'open' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="account-dropdown__menu">
                  {accountsData.map(account => (
                    <button
                      key={account.id}
                      className={`account-dropdown__item ${account.id === selectedAccountId ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedAccountId(account.id)
                        setIsDropdownOpen(false)
                      }}
                    >
                      <span className="account-dropdown__item-icon">
                        {getAccountIcon(account.type)}
                      </span>
                      <span className="account-dropdown__item-name">{account.name}</span>
                      <span className="account-dropdown__item-balance">
                        {account.type === 'credit' ? `-${formatCurrency(account.balance)}` : formatCurrency(account.balance)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Credit Card Usage Meter */}
          {selectedAccount.type === 'credit' && (
            <div className="credit-usage">
              <div className="credit-usage__header">
                <span className="credit-usage__label">Credit Utilization</span>
                <span 
                  className="credit-usage__percentage"
                  style={{ color: getCreditUsageColor(selectedAccount.usagePercentage) }}
                >
                  {selectedAccount.usagePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="credit-usage__bar">
                <div 
                  className="credit-usage__fill"
                  style={{ 
                    width: `${selectedAccount.usagePercentage}%`,
                    background: getCreditUsageColor(selectedAccount.usagePercentage)
                  }}
                />
                <div className="credit-usage__markers">
                  <span className="marker" style={{ left: '30%' }}>30%</span>
                  <span className="marker" style={{ left: '40%' }}>40%</span>
                </div>
              </div>
              <div className="credit-usage__info">
                <span>{formatCurrency(selectedAccount.balance)} of {formatCurrency(selectedAccount.creditLimit)} used</span>
                <span>Payment due: {new Date(selectedAccount.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          )}

          {/* Spending Chart */}
          <div className="spending-chart">
            <div className="spending-chart__header">
              <span>Last 15 Days Spending</span>
              <span className="spending-chart__total">Total: {formatCurrency(totalSpending)}</span>
            </div>
            <ReactECharts 
              option={chartOption} 
              style={{ height: '280px' }}
              opts={{ renderer: 'svg' }}
            />
          </div>

          {/* Category Breakdown */}
          <div className="category-breakdown">
            <h3>Top Spending Categories</h3>
            <div className="category-list">
              {selectedAccount.categorySpend.map((cat, idx) => (
                <div key={idx} className="category-item">
                  <div className="category-item__icon">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div className="category-item__info">
                    <span className="category-item__name">{cat.name}</span>
                    <div className="category-item__bar">
                      <div 
                        className="category-item__fill"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="category-item__stats">
                    <span className="category-item__amount">{formatCurrency(cat.amount)}</span>
                    <span className="category-item__percentage">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="ai-insights-section">
        <div className="ai-insights-card">
          <div className="ai-insights-card__header">
            <BsLightningCharge size={20} />
            <h2>AI-Powered Insights</h2>
            <span className="ai-badge">For {selectedAccount.name}</span>
          </div>

          <div className="ai-insights-list">
            {selectedAccount.insights.map((insight, idx) => (
              <div key={idx} className={`ai-insight ai-insight--${insight.type}`}>
                <div className="ai-insight__icon">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="ai-insight__content">
                  <p>{insight.text}</p>
                  {insight.impact && (
                    <div className="ai-insight__impact">
                      <FiSave size={14} />
                      <span>Potential savings: {formatCurrency(insight.impact)}/month</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Plan acceleration insights */}
            {selectedAccount.insights.some(i => i.impact) && (
              <div className="plan-acceleration">
                <h4>How This Helps Your Goals</h4>
                <div className="plan-acceleration__list">
                  {savingsPlans.map((plan, idx) => {
                    const potentialSavings = selectedAccount.insights
                      .filter(i => i.impact)
                      .reduce((sum, i) => sum + i.impact, 0)
                    const monthsAccelerated = Math.floor(potentialSavings / ((plan.target - plan.current) / 12))
                    
                    return (
                      <div key={idx} className="plan-acceleration__item">
                        <div className="plan-acceleration__info">
                          <FiTarget size={16} />
                          <span>{plan.name}</span>
                        </div>
                        <div className="plan-acceleration__benefit">
                          {monthsAccelerated > 0 ? (
                            <span className="positive">Reach {monthsAccelerated} months faster</span>
                          ) : (
                            <span>Add {formatCurrency(potentialSavings)}/month</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Special insights for low-activity bank accounts */}
            {selectedAccount.type === 'bank' && selectedAccount.recentActivity === 'low' && (
              <div className="investment-suggestion">
                <div className="investment-suggestion__header">
                  <FiTrendingUp size={18} />
                  <h4>Investment Opportunity</h4>
                </div>
                <p>
                  Your savings account earns {selectedAccount.interestRate}% APY. Consider moving excess funds to:
                </p>
                <div className="investment-options">
                  <div className="investment-option">
                    <span className="investment-option__name">Index Funds</span>
                    <span className="investment-option__return">~10% avg returns</span>
                  </div>
                  <div className="investment-option">
                    <span className="investment-option__name">Treasury Bonds</span>
                    <span className="investment-option__return">~5.5% guaranteed</span>
                  </div>
                  <div className="investment-option">
                    <span className="investment-option__name">High-Yield CDs</span>
                    <span className="investment-option__return">~5.2% fixed</span>
                  </div>
                </div>
                <p className="investment-suggestion__note">
                  Moving $10,000 could earn you an extra {formatCurrency((10000 * 0.05) - (10000 * selectedAccount.interestRate / 100))}/year
                </p>
              </div>
            )}

            {/* Credit card specific warnings */}
            {selectedAccount.type === 'credit' && selectedAccount.usagePercentage > 40 && (
              <div className="credit-warning">
                <div className="credit-warning__header">
                  <FiAlertCircle size={18} />
                  <h4>Credit Health Alert</h4>
                </div>
                <p>
                  Your credit utilization is at {selectedAccount.usagePercentage.toFixed(1)}%. 
                  High utilization can negatively impact your credit score.
                </p>
                <div className="credit-warning__recommendations">
                  <div className="recommendation">
                    <span className="recommendation__target">Target: Below 30%</span>
                    <span className="recommendation__action">
                      Pay down {formatCurrency(selectedAccount.balance - (selectedAccount.creditLimit * 0.3))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights
