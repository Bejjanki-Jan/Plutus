import { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Select from "react-select";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiCreditCard,
  FiPieChart,
  FiBarChart2,
  FiTarget,
  FiArrowRight,
  FiZap,
  FiShoppingBag,
  FiCoffee,
  FiHome,
  FiFilm,
  FiShoppingCart,
  FiTruck,
  FiPlus,
  FiX,
  FiEdit3,
  FiUpload,
  FiFileText,
  FiCalendar,
  FiTag,
  FiArrowLeft,
} from "react-icons/fi";
import { BsLightningCharge } from "react-icons/bs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./Home.scss";

// Dummy data for week view
const weekData = {
  totalSpend: 1245.8,
  totalIncome: 3500.0,
  netSavings: 2254.2,
  spendChange: -12.5,
  incomeChange: 0,
  savingsChange: 18.3,
  transactions: 47,
  avgDaily: 177.97,
};

// Dummy data for month view
const monthData = {
  totalSpend: 4892.35,
  totalIncome: 7500.0,
  netSavings: 2607.65,
  spendChange: 8.2,
  incomeChange: 5.0,
  savingsChange: -3.4,
  transactions: 156,
  avgDaily: 162.41,
};

// Category spend data
const categoryDataWeek = [
  { name: "Groceries", amount: 285.5, color: "#10b981" },
  { name: "Dining", amount: 198.3, color: "#f59e0b" },
  { name: "Shopping", amount: 342.0, color: "#8b5cf6" },
  { name: "Transport", amount: 145.0, color: "#3b82f6" },
  { name: "Entertainment", amount: 175.0, color: "#ec4899" },
  { name: "Utilities", amount: 100.0, color: "#06b6d4" },
];

const categoryDataMonth = [
  { name: "Groceries", amount: 1150.0, color: "#10b981" },
  { name: "Dining", amount: 685.5, color: "#f59e0b" },
  { name: "Shopping", amount: 1245.0, color: "#8b5cf6" },
  { name: "Transport", amount: 520.0, color: "#3b82f6" },
  { name: "Entertainment", amount: 650.0, color: "#ec4899" },
  { name: "Utilities", amount: 641.85, color: "#06b6d4" },
];

// Prediction data (AI generated - dummy)
const spendPredictionData = [
  { day: "Mon", actual: 145, predicted: null, week: "Week 1" },
  { day: "Tue", actual: 89, predicted: null, week: "Week 1" },
  { day: "Wed", actual: 234, predicted: null, week: "Week 1" },
  { day: "Thu", actual: 156, predicted: null, week: "Week 1" },
  { day: "Fri", actual: 312, predicted: null, week: "Week 1" },
  { day: "Sat", actual: 198, predicted: null, week: "Week 1" },
  { day: "Sun", actual: 112, predicted: null, week: "Week 1" },
  { day: "Mon", actual: 167, predicted: null, week: "Week 2" },
  { day: "Tue", actual: 95, predicted: null, week: "Week 2" },
  { day: "Wed", actual: 278, predicted: null, week: "Week 2" },
  { day: "Thu", actual: 134, predicted: null, week: "Week 2" },
  { day: "Fri", actual: 289, predicted: null, week: "Week 2" },
  { day: "Sat", actual: 176, predicted: null, week: "Week 2" },
  { day: "Sun", actual: 106, predicted: null, week: "Week 2" },
  { day: "Mon", actual: null, predicted: 155, week: "Next Week" },
  { day: "Tue", actual: null, predicted: 92, week: "Next Week" },
  { day: "Wed", actual: null, predicted: 248, week: "Next Week" },
  { day: "Thu", actual: null, predicted: 142, week: "Next Week" },
  { day: "Fri", actual: null, predicted: 295, week: "Next Week" },
  { day: "Sat", actual: null, predicted: 185, week: "Next Week" },
  { day: "Sun", actual: null, predicted: 108, week: "Next Week" },
];

// Plans/Blueprints data
const plansData = [
  {
    id: 1,
    name: "Emergency Fund",
    target: 10000,
    current: 7500,
    deadline: "2026-12-31",
    monthlyContribution: 500,
    color: "#10b981",
    icon: "shield",
  },
  {
    id: 2,
    name: "Vacation Trip",
    target: 5000,
    current: 2100,
    deadline: "2027-06-01",
    monthlyContribution: 300,
    color: "#3b82f6",
    icon: "plane",
  },
  {
    id: 3,
    name: "New Laptop",
    target: 2500,
    current: 1800,
    deadline: "2026-10-15",
    monthlyContribution: 250,
    color: "#8b5cf6",
    icon: "laptop",
  },
];

// AI Insights for plans
const planInsights = [
  {
    type: "saving",
    category: "Dining",
    reduceBy: 75,
    planBoost: "Emergency Fund",
    message:
      "Reduce dining out by $75/week to reach Emergency Fund 2 months earlier",
  },
  {
    type: "saving",
    category: "Entertainment",
    reduceBy: 50,
    planBoost: "Vacation Trip",
    message:
      "Cut entertainment by $50/week to fund your vacation 3 months sooner",
  },
  {
    type: "opportunity",
    category: "Shopping",
    reduceBy: 100,
    planBoost: "New Laptop",
    message: "Skip 2 shopping trips this month to get your laptop by September",
  },
];

const getCategoryIcon = (name) => {
  const icons = {
    Groceries: <FiShoppingCart size={16} />,
    Dining: <FiCoffee size={16} />,
    Shopping: <FiShoppingBag size={16} />,
    Transport: <FiTruck size={16} />,
    Entertainment: <FiFilm size={16} />,
    Utilities: <FiZap size={16} />,
  };
  return icons[name] || <FiDollarSign size={16} />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: ${entry.value?.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function Home() {
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'month'
  const [chartType, setChartType] = useState("bar"); // 'bar' or 'pie'
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addMode, setAddMode] = useState(null); // null, 'manual', 'upload'
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    account: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const summaryData = viewMode === "week" ? weekData : monthData;
  const categoryData =
    viewMode === "week" ? categoryDataWeek : categoryDataMonth;
  const totalCategorySpend = categoryData.reduce(
    (sum, cat) => sum + cat.amount,
    0,
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const handleDialogClose = (open) => {
    if (!open) {
      setAddMode(null);
      setTransactionForm({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        account: ''
      });
      setUploadedFile(null);
    }
    setIsAddDialogOpen(open);
  };

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    // Here you would handle saving the transaction
    console.log('Transaction submitted:', transactionForm);
    handleDialogClose(false);
  };

  const handleFileSubmit = () => {
    // Here you would handle file upload processing
    console.log('File uploaded:', uploadedFile);
    handleDialogClose(false);
  };

  const categoryOptions = [
    { value: 'groceries', label: 'Groceries' },
    { value: 'dining', label: 'Dining' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'transport', label: 'Transport' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'subscriptions', label: 'Subscriptions' },
    { value: 'other', label: 'Other' }
  ];

  const accountOptions = [
    { value: 'chase-checking', label: 'Chase Checking' },
    { value: 'boa-savings', label: 'Bank of America Savings' },
    { value: 'capital-one', label: 'Capital One Credit' },
    { value: 'amex', label: 'American Express' },
    { value: 'cash', label: 'Cash' }
  ];

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'rgba(var(--color-primary-rgb), 0.08)',
      borderColor: state.isFocused ? 'var(--color-primary)' : 'rgba(var(--color-primary-rgb), 0.2)',
      borderRadius: '12px',
      padding: '0.2rem 0.25rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(var(--color-primary-rgb), 0.1)' : 'none',
      '&:hover': {
        borderColor: 'rgba(var(--color-primary-rgb), 0.4)'
      }
    }),
    menu: (base) => ({
      ...base,
      background: '#1a1a2e',
      border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
      zIndex: 9999
    }),
    menuList: (base) => ({
      ...base,
      padding: '0.5rem'
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected 
        ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
        : state.isFocused 
          ? 'rgba(var(--color-primary-rgb), 0.15)'
          : 'transparent',
      color: 'white',
      borderRadius: '8px',
      padding: '0.6rem 0.75rem',
      marginBottom: '0.25rem',
      cursor: 'pointer',
      '&:last-child': {
        marginBottom: 0
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: 'white'
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.4)'
    }),
    input: (base) => ({
      ...base,
      color: 'white'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.5)',
      '&:hover': {
        color: 'white'
      }
    })
  };

  return (
    <div className="home-page">
      {/* Header with View Toggle */}
      <div className="dashboard-header">
        <div className="dashboard-header__title">
          <h1>Dashboard</h1>
          <p>Your financial overview at a glance</p>
        </div>
        <div className="view-toggle">
          <button
            className={`view-toggle__btn ${viewMode === "week" ? "active" : ""}`}
            onClick={() => setViewMode("week")}
          >
            This Week
          </button>
          <button
            className={`view-toggle__btn ${viewMode === "month" ? "active" : ""}`}
            onClick={() => setViewMode("month")}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card summary-card--income">
          <div className="summary-card__icon">
            <FiDollarSign size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">Earnings</span>
            <span className="summary-card__value">
              {formatCurrency(summaryData.totalIncome)}
            </span>
            <span
              className={`summary-card__change ${summaryData.incomeChange >= 0 ? "positive" : "negative"}`}
            >
              {summaryData.incomeChange >= 0 ? (
                <FiTrendingUp size={14} />
              ) : (
                <FiTrendingDown size={14} />
              )}
              {formatPercentage(summaryData.incomeChange)} vs last {viewMode}
            </span>
          </div>
        </div>

        <div className="summary-card summary-card--spend">
          <div className="summary-card__icon">
            <FiCreditCard size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">Expenses</span>
            <span className="summary-card__value">
              {formatCurrency(summaryData.totalSpend)}
            </span>
            <span
              className={`summary-card__change ${summaryData.spendChange <= 0 ? "positive" : "negative"}`}
            >
              {summaryData.spendChange <= 0 ? (
                <FiTrendingDown size={14} />
              ) : (
                <FiTrendingUp size={14} />
              )}
              {formatPercentage(summaryData.spendChange)} vs last {viewMode}
            </span>
          </div>
        </div>

        <div className="summary-card summary-card--savings">
          <div className="summary-card__icon">
            <FiTarget size={24} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">Savings</span>
            <span className="summary-card__value">
              {formatCurrency(summaryData.netSavings)}
            </span>
            <span
              className={`summary-card__change ${summaryData.savingsChange >= 0 ? "positive" : "negative"}`}
            >
              {summaryData.savingsChange >= 0 ? (
                <FiTrendingUp size={14} />
              ) : (
                <FiTrendingDown size={14} />
              )}
              {formatPercentage(summaryData.savingsChange)} vs last {viewMode}
            </span>
          </div>
        </div>

        <div className="summary-card summary-card--stats">
          <div className="summary-card__mini-stats">
            <div className="mini-stat">
              <span className="mini-stat__value">
                {summaryData.transactions}
              </span>
              <span className="mini-stat__label">Transactions</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat__value">
                {formatCurrency(summaryData.avgDaily)}
              </span>
              <span className="mini-stat__label">Avg/Day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Category Spend Chart */}
        <div className="chart-card">
          <div className="chart-card__header">
            <h2>Spending by Category</h2>
            <div className="chart-toggle">
              <button
                className={`chart-toggle__btn ${chartType === "bar" ? "active" : ""}`}
                onClick={() => setChartType("bar")}
                title="Bar Chart"
              >
                <FiBarChart2 size={18} />
              </button>
              <button
                className={`chart-toggle__btn ${chartType === "pie" ? "active" : ""}`}
                onClick={() => setChartType("pie")}
                title="Pie Chart"
              >
                <FiPieChart size={18} />
              </button>
            </div>
          </div>
          <div className="chart-card__content">
            {chartType === "bar" ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="pie-chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="pie-legend__item">
                      <span
                        className="pie-legend__color"
                        style={{ background: cat.color }}
                      />
                      <span className="pie-legend__name">{cat.name}</span>
                      <span className="pie-legend__value">
                        {((cat.amount / totalCategorySpend) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Prediction Chart */}
        <div className="chart-card chart-card--prediction">
          <div className="chart-card__header">
            <div className="chart-card__title-group">
              <h2>AI Spend Prediction</h2>
              <span className="ai-badge">
                <BsLightningCharge size={12} />
                AI Powered
              </span>
            </div>
            <span className="prediction-label">
              Next week forecast: ~$1,225
            </span>
          </div>
          <div className="chart-card__content">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={spendPredictionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="actualGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="predictedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#actualGradient)"
                  name="Actual"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#predictedGradient)"
                  name="Predicted"
                  connectNulls={false}
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="plans-section">
        <div className="plans-section__header">
          <h2>Your Blueprints</h2>
          <button className="plans-section__view-all">
            View All <FiArrowRight size={16} />
          </button>
        </div>

        <div className="plans-grid">
          {plansData.map((plan) => {
            const progress = (plan.current / plan.target) * 100;
            const remaining = plan.target - plan.current;
            const monthsLeft = Math.ceil(remaining / plan.monthlyContribution);

            return (
              <div key={plan.id} className="plan-card">
                <div className="plan-card__header">
                  <div
                    className="plan-card__icon"
                    style={{ background: plan.color }}
                  >
                    <FiTarget size={20} />
                  </div>
                  <div className="plan-card__info">
                    <h3>{plan.name}</h3>
                    <span className="plan-card__deadline">
                      Target:{" "}
                      {new Date(plan.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="plan-card__progress">
                  <div className="progress-bar">
                    <div
                      className="progress-bar__fill"
                      style={{ width: `${progress}%`, background: plan.color }}
                    />
                  </div>
                  <div className="progress-stats">
                    <span className="progress-stats__current">
                      {formatCurrency(plan.current)}
                    </span>
                    <span className="progress-stats__target">
                      of {formatCurrency(plan.target)}
                    </span>
                  </div>
                </div>

                <div className="plan-card__footer">
                  <span
                    className="plan-card__percentage"
                    style={{ color: plan.color }}
                  >
                    {progress.toFixed(0)}% complete
                  </span>
                  <span className="plan-card__remaining">
                    ~{monthsLeft} months left
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Insights for Plans */}
        <div className="plan-insights">
          <div className="plan-insights__header">
            <BsLightningCharge size={18} />
            <h3>AI Recommendations</h3>
          </div>
          <div className="plan-insights__list">
            {planInsights.map((insight, idx) => (
              <div key={idx} className="plan-insight">
                <div className="plan-insight__icon">
                  {getCategoryIcon(insight.category)}
                </div>
                <div className="plan-insight__content">
                  <p>{insight.message}</p>
                  <div className="plan-insight__action">
                    <span className="category-tag">{insight.category}</span>
                    <span className="arrow">→</span>
                    <span className="plan-tag">{insight.planBoost}</span>
                    <span className="savings-tag">
                      Save {formatCurrency(insight.reduceBy)}/week
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Dialog.Root open={isAddDialogOpen} onOpenChange={handleDialogClose}>
        <Dialog.Trigger asChild>
          <button className="fab-button" title="Add Transaction">
            <FiPlus size={24} />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="transaction-dialog-overlay" />
          <Dialog.Content className="transaction-dialog">
            <div className="transaction-dialog__header">
              {addMode && (
                <button className="back-btn" onClick={() => setAddMode(null)}>
                  <FiArrowLeft />
                </button>
              )}
              <Dialog.Title className="transaction-dialog__title">
                {!addMode && 'Add Transaction'}
                {addMode === 'manual' && 'Add Manually'}
                {addMode === 'upload' && 'Upload Statement'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="close-btn">
                  <FiX />
                </button>
              </Dialog.Close>
            </div>

            {/* Mode Selection */}
            {!addMode && (
              <div className="add-mode-selection">
                <button 
                  className="mode-card"
                  onClick={() => setAddMode('manual')}
                >
                  <div className="mode-card__icon">
                    <FiEdit3 size={28} />
                  </div>
                  <div className="mode-card__content">
                    <h3>Add Manually</h3>
                    <p>Enter transaction details yourself</p>
                  </div>
                  <FiArrowRight className="mode-card__arrow" />
                </button>

                <button 
                  className="mode-card"
                  onClick={() => setAddMode('upload')}
                >
                  <div className="mode-card__icon">
                    <FiUpload size={28} />
                  </div>
                  <div className="mode-card__content">
                    <h3>Upload Statement</h3>
                    <p>Import from CSV or bank statement</p>
                  </div>
                  <FiArrowRight className="mode-card__arrow" />
                </button>
              </div>
            )}

            {/* Manual Entry Form */}
            {addMode === 'manual' && (
              <form onSubmit={handleManualSubmit} className="transaction-form">
                <div className="form-group">
                  <label>Transaction Type</label>
                  <div className="type-toggle">
                    <button
                      type="button"
                      className={transactionForm.type === 'expense' ? 'active' : ''}
                      onClick={() => setTransactionForm(prev => ({ ...prev, type: 'expense' }))}
                    >
                      <FiTrendingDown />
                      Expense
                    </button>
                    <button
                      type="button"
                      className={transactionForm.type === 'income' ? 'active' : ''}
                      onClick={() => setTransactionForm(prev => ({ ...prev, type: 'income' }))}
                    >
                      <FiTrendingUp />
                      Income
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FiDollarSign /> Amount</label>
                    <div className="input-with-prefix">
                      <span className="prefix">$</span>
                      <input
                        type="number"
                        name="amount"
                        value={transactionForm.amount}
                        onChange={handleTransactionInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><FiCalendar /> Date</label>
                    <input
                      type="date"
                      name="date"
                      value={transactionForm.date}
                      onChange={handleTransactionInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label><FiTag /> Category</label>
                  <Select
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === transactionForm.category) || null}
                    onChange={(selected) => setTransactionForm(prev => ({ ...prev, category: selected?.value || '' }))}
                    placeholder="Select category"
                    styles={selectStyles}
                    isClearable
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="form-group">
                  <label><FiCreditCard /> Account</label>
                  <Select
                    options={accountOptions}
                    value={accountOptions.find(opt => opt.value === transactionForm.account) || null}
                    onChange={(selected) => setTransactionForm(prev => ({ ...prev, account: selected?.value || '' }))}
                    placeholder="Select account"
                    styles={selectStyles}
                    isClearable
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="form-group">
                  <label><FiFileText /> Description</label>
                  <input
                    type="text"
                    name="description"
                    value={transactionForm.description}
                    onChange={handleTransactionInputChange}
                    placeholder="e.g., Grocery shopping at Walmart"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setAddMode(null)}>
                    Back
                  </button>
                  <button type="submit" className="btn-primary">
                    <FiPlus />
                    Add Transaction
                  </button>
                </div>
              </form>
            )}

            {/* File Upload */}
            {addMode === 'upload' && (
              <div className="file-upload-section">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.pdf,.xlsx,.xls"
                  style={{ display: 'none' }}
                />
                
                <div 
                  className={`upload-dropzone ${uploadedFile ? 'has-file' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!uploadedFile ? (
                    <>
                      <div className="upload-dropzone__icon">
                        <FiUpload size={40} />
                      </div>
                      <h3>Drop your file here</h3>
                      <p>or click to browse</p>
                      <span className="supported-formats">
                        Supports CSV, PDF, Excel files
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="upload-dropzone__icon uploaded">
                        <FiFileText size={40} />
                      </div>
                      <h3>{uploadedFile.name}</h3>
                      <p>{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      <button 
                        className="change-file-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                      >
                        Change file
                      </button>
                    </>
                  )}
                </div>

                <div className="upload-info">
                  <h4>Supported Banks</h4>
                  <div className="bank-logos">
                    <span>Chase</span>
                    <span>Bank of America</span>
                    <span>Wells Fargo</span>
                    <span>Citi</span>
                    <span>Capital One</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setAddMode(null)}>
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={handleFileSubmit}
                    disabled={!uploadedFile}
                  >
                    <FiUpload />
                    Process File
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default Home;
