import React from 'react';

interface SummaryProps {
    budget: number;
    totalExpenses: number;
    remainingBudget: number;
}

const Summary: React.FC<SummaryProps> = ({ budget, totalExpenses, remainingBudget }) => {
    return (
        <div>
            <h2>Budget Summary</h2>
            <p>Budget: ${budget}</p>
            <p>Total Expenses: ${totalExpenses}</p>
            <p>Remaining Budget: ${remainingBudget}</p>
        </div>
    );
};

export default Summary;