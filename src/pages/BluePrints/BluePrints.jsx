import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { FiPlus, FiX, FiTarget, FiCalendar, FiDollarSign, FiTag, FiFileText, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi'
import './BluePrints.scss'

const BLUEPRINT_TYPES = [
  { value: 'emergency', label: 'Emergency Fund', icon: '🛡️' },
  { value: 'travel', label: 'Travel Fund', icon: '✈️' },
  { value: 'long-term', label: 'Long Term Savings', icon: '🏦' },
  { value: 'short-term', label: 'Short Term Savings', icon: '💰' },
  { value: 'education', label: 'Education Fund', icon: '🎓' },
  { value: 'other', label: 'Other', icon: '📋' }
]

const initialFormState = {
  name: '',
  type: '',
  targetAmount: '',
  targetDate: '',
  currentAmount: ''
}

function BluePrints() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [blueprints, setBlueprints] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(initialFormState)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const openCreateDialog = () => {
    setEditingId(null)
    setFormData(initialFormState)
    setIsDialogOpen(true)
  }

  const openEditDialog = (blueprint) => {
    setEditingId(blueprint.id)
    setFormData({
      name: blueprint.name,
      type: blueprint.type,
      targetAmount: blueprint.targetAmount.toString(),
      targetDate: blueprint.targetDate,
      currentAmount: blueprint.currentAmount.toString()
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.type || !formData.targetAmount || !formData.targetDate) {
      return
    }

    if (editingId) {
      // Update existing blueprint
      setBlueprints(prev => prev.map(bp => 
        bp.id === editingId 
          ? {
              ...bp,
              name: formData.name,
              type: formData.type,
              targetAmount: parseFloat(formData.targetAmount),
              targetDate: formData.targetDate,
              currentAmount: parseFloat(formData.currentAmount) || 0
            }
          : bp
      ))
    } else {
      // Create new blueprint
      const blueprint = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        targetAmount: parseFloat(formData.targetAmount),
        targetDate: formData.targetDate,
        createdAt: new Date().toISOString(),
        currentAmount: parseFloat(formData.currentAmount) || 0
      }
      setBlueprints(prev => [...prev, blueprint])
    }

    setFormData(initialFormState)
    setEditingId(null)
    setIsDialogOpen(false)
  }

  const handleDelete = (id) => {
    setBlueprints(prev => prev.filter(bp => bp.id !== id))
  }

  const handleDialogClose = (open) => {
    if (!open) {
      setEditingId(null)
      setFormData(initialFormState)
    }
    setIsDialogOpen(open)
  }

  const getTypeInfo = (typeValue) => {
    return BLUEPRINT_TYPES.find(t => t.value === typeValue) || BLUEPRINT_TYPES[5]
  }

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <div className="blueprints-page">
      <div className="blueprints-header">
        <div className="blueprints-header__title">
          <h1>BluePrints</h1>
          <p>Plan your financial future with custom goals</p>
        </div>
      </div>

      <div className="blueprints-grid">
        {/* Existing Blueprints */}
        {blueprints.map(blueprint => {
          const typeInfo = getTypeInfo(blueprint.type)
          const progress = calculateProgress(blueprint.currentAmount, blueprint.targetAmount)
          
          return (
            <div key={blueprint.id} className="blueprint-card">
              <div className="blueprint-card__header">
                <span className="blueprint-card__icon">{typeInfo.icon}</span>
                <span className="blueprint-card__type">{typeInfo.label}</span>
                <div className="blueprint-card__actions">
                  <button 
                    className="action-btn action-btn--edit"
                    onClick={() => openEditDialog(blueprint)}
                    title="Edit Blueprint"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="action-btn action-btn--delete"
                    onClick={() => handleDelete(blueprint.id)}
                    title="Delete Blueprint"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <h3 className="blueprint-card__name">{blueprint.name}</h3>
              <div className="blueprint-card__progress">
                <div className="progress-bar">
                  <div 
                    className="progress-bar__fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-info">
                  <span>{formatCurrency(blueprint.currentAmount)}</span>
                  <span>{formatCurrency(blueprint.targetAmount)}</span>
                </div>
              </div>
              <div className="blueprint-card__footer">
                <div className="target-date">
                  <FiCalendar />
                  <span>{new Date(blueprint.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <span className="progress-percent">{progress.toFixed(0)}%</span>
              </div>
            </div>
          )
        })}

        {/* Create Custom Blueprint Card */}
        <Dialog.Root open={isDialogOpen} onOpenChange={handleDialogClose}>
          <Dialog.Trigger asChild>
            <div className="blueprint-card blueprint-card--add" onClick={openCreateDialog}>
              <div className="add-icon">
                <FiPlus />
              </div>
              <h3>Create Blueprint</h3>
              <p>Build your own goal</p>
            </div>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="blueprint-dialog-overlay" />
            <Dialog.Content className="blueprint-dialog">
              <div className="blueprint-dialog__header">
                <Dialog.Title className="blueprint-dialog__title">
                  <FiTarget />
                  {editingId ? 'Edit Blueprint' : 'Create New Blueprint'}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="close-btn">
                    <FiX />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleSubmit} className="blueprint-form">
                <div className="form-group">
                  <label>
                    <FiFileText />
                    Blueprint Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Hawaii Vacation 2027"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FiTag />
                    Type of Blueprint
                  </label>
                  <div className="type-options">
                    {BLUEPRINT_TYPES.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        className={`type-option ${formData.type === type.value ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      >
                        <span className="type-option__icon">{type.icon}</span>
                        <span className="type-option__label">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FiDollarSign />
                      Target Amount
                    </label>
                    <div className="input-with-prefix">
                      <span className="prefix">$</span>
                      <input
                        type="number"
                        name="targetAmount"
                        value={formData.targetAmount}
                        onChange={handleInputChange}
                        placeholder="10,000"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      <FiCalendar />
                      Target Date
                    </label>
                    <input
                      type="date"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {editingId && (
                  <div className="form-group">
                    <label>
                      <FiDollarSign />
                      Current Saved Amount
                    </label>
                    <div className="input-with-prefix">
                      <span className="prefix">$</span>
                      <input
                        type="number"
                        name="currentAmount"
                        value={formData.currentAmount}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <Dialog.Close asChild>
                    <button type="button" className="btn-secondary">Cancel</button>
                  </Dialog.Close>
                  <button type="submit" className="btn-primary">
                    {editingId ? <FiSave /> : <FiPlus />}
                    {editingId ? 'Save Changes' : 'Create Blueprint'}
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  )
}

export default BluePrints
