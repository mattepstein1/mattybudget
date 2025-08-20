import React, { useState } from 'react';

interface AddExpenseFormProps {
    onAddExpense: (expense: { title: string; description: string; amount: number; date: string }) => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAddExpense }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddExpense({ title, description, amount, date });
        setTitle('');
        setDescription('');
        setAmount(0);
        setDate('');
    };

    return (
        <form onSubmit={handleSubmit} className="add-expense-form">
            <input
                type="text"
                placeholder="Expense Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default AddExpenseForm;