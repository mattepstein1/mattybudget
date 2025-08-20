import React from 'react';

interface IncomeCardProps {
  incomeAmount: string;
  incomeFrequency: string;
  incomeLoading: boolean;
  incomeError: string;
  showIncomeInput: boolean;
  editingIncome: boolean;
  blurIncome: boolean;
  setEditingIncome: (v: boolean) => void;
  setShowIncomeInput: (v: boolean) => void;
  setBlurIncome: (v: boolean) => void;
  setIncomeAmount: (v: string) => void;
  setIncomeFrequency: (v: string) => void;
  handleSaveIncome: (e: React.FormEvent) => void;
}

const IncomeCard: React.FC<IncomeCardProps> = ({
  incomeAmount,
  incomeFrequency,
  incomeLoading,
  incomeError,
  showIncomeInput,
  editingIncome,
  blurIncome,
  setEditingIncome,
  setShowIncomeInput,
  setBlurIncome,
  setIncomeAmount,
  setIncomeFrequency,
  handleSaveIncome,
}) => (
  <div className="income-section" style={{ minWidth: 220, padding: '12px 16px', boxSizing: 'border-box', width: '100%' }}>
    <h6 className="mb-2">Income (after tax)</h6>
    {!showIncomeInput && !editingIncome && incomeAmount ? (
      <div className="d-flex align-items-center gap-2 flex-wrap" style={{ width: '100%' }}>
        <span style={{ fontWeight: 'bold', fontSize: 18, filter: blurIncome ? 'blur(6px)' : 'none', transition: 'filter 0.2s' }}>${parseFloat(incomeAmount).toFixed(2)}</span>
        <button className="btn btn-outline-primary btn-sm d-flex align-items-center" onClick={() => setEditingIncome(true)} title="Edit income">
          <span className="material-icons">edit</span>
        </button>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center" onClick={() => setBlurIncome(!blurIncome)} title={blurIncome ? 'Show income' : 'Hide income'}>
          <span className="material-icons">{blurIncome ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
    ) : (
  <form className="d-flex flex-column gap-2" onSubmit={handleSaveIncome} style={{ width: '100%' }}>
  <div className="input-group" style={{ width: '100%' }}>
          <span className="input-group-text">$</span>
          <input
            type="number"
            className="form-control"
            placeholder="Enter income"
            min="0"
            step="0.01"
            value={incomeAmount}
            onChange={e => setIncomeAmount(e.target.value)}
            disabled={incomeLoading}
          />
        </div>
  <div className="d-flex gap-2 align-items-center flex-wrap" style={{ width: '100%' }}>
          <label className="me-2 mb-0">Frequency:</label>
          <select
            className="form-select"
            style={{ maxWidth: 140 }}
            value={incomeFrequency}
            onChange={e => setIncomeFrequency(e.target.value)}
            disabled={incomeLoading}
          >
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button type="submit" className="btn btn-success ms-2" disabled={incomeLoading}>
            {incomeLoading ? 'Saving...' : (editingIncome ? 'Update' : 'Save')}
          </button>
          {(editingIncome || showIncomeInput) && (
            <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingIncome(false); setShowIncomeInput(false); }}>
              Cancel
            </button>
          )}
        </div>
        {incomeError && <div className="text-danger mt-1">{incomeError}</div>}
      </form>
    )}
    {!incomeAmount && !showIncomeInput && !editingIncome && (
      <button className="btn btn-outline-success mt-2" onClick={() => setShowIncomeInput(true)}>
        Enter Income
      </button>
    )}
  </div>
);

export default IncomeCard;
