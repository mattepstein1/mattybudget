import React from 'react';

import IncomeCard from './IncomeCard';

interface SpendSummaryProps {
  totalSpend: number;
  income: number;
  percent: number;
  incomeLeft: number;
  periodLabel: string;
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


const SpendSummary: React.FC<SpendSummaryProps> = ({
  totalSpend,
  income,
  percent,
  incomeLeft,
  periodLabel,
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
  handleSaveIncome
}) => (
  <div className="card shadow-sm total-spend-card flex-fill d-flex flex-column justify-content-center">
    <div className="card-body">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-3">
        <div className="text-center text-md-start flex-fill">
          <h5 className="card-title mb-2">Total Spend for {periodLabel}</h5>
          <h2 className="display-5 mb-3 total-spend-amount">
            ${totalSpend.toFixed(2)}
          </h2>
          <div className="progress animated-progress" style={{ height: 28, background: 'var(--progress-bg)' }}>
            <div
              className={`progress-bar total-spend-bar ${percent > 80 ? 'bg-danger' : percent > 50 ? 'bg-warning' : 'bg-success'}`}
              role="progressbar"
              style={{ width: `${percent}%`, fontWeight: 'bold', fontSize: 16, transition: 'width 1s cubic-bezier(.4,2,.3,1)' }}
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {percent}%
            </div>
          </div>
          <div className="mt-2 text-muted total-spend-budget" style={{ fontSize: 14 }}>
            Income: ${income.toFixed(2)}<br />
            Used: {percent}%<br />
            Left: ${incomeLeft.toFixed(2)}
          </div>
        </div>
        <div className="d-flex align-items-center ms-md-4 mt-4 mt-md-0">
          <IncomeCard
            incomeAmount={incomeAmount}
            incomeFrequency={incomeFrequency}
            incomeLoading={incomeLoading}
            incomeError={incomeError}
            showIncomeInput={showIncomeInput}
            editingIncome={editingIncome}
            blurIncome={blurIncome}
            setEditingIncome={setEditingIncome}
            setShowIncomeInput={setShowIncomeInput}
            setBlurIncome={setBlurIncome}
            setIncomeAmount={setIncomeAmount}
            setIncomeFrequency={setIncomeFrequency}
            handleSaveIncome={handleSaveIncome}
          />
        </div>
      </div>
    </div>
  </div>
);

export default SpendSummary;
