// ...existing code...

// ...existing code...

type Expense = {
    id?: string;
    _id?: string;
    title: string;
    description: string;
    amount: number;
    date: string;
};

type ExpenseListProps = {
    expenses: Expense[];
    onDelete: (id: string) => void;
    onEdit: (id: string, updatedExpense: Partial<Expense>) => void;
};

import React, { useState } from 'react';

const ExpenseList = ({ expenses, onDelete, onEdit }: ExpenseListProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFields, setEditFields] = useState<Partial<Expense>>({});
    const [editTime, setEditTime] = useState<string>('');

    const startEdit = (expense: Expense) => {
        setEditingId(expense.id || expense._id || null);
        // Split ISO date into date and time for editing
        const d = new Date(expense.date);
        const dateStr = d.toISOString().slice(0, 10); // yyyy-mm-dd
        const timeStr = d.toTimeString().slice(0, 5); // hh:mm
        setEditFields({
            title: expense.title,
            description: expense.description,
            amount: expense.amount,
            date: dateStr,
        });
        setEditTime(timeStr);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditFields({});
        setEditTime('');
    };

    const saveEdit = (id: string | undefined) => {
        // Combine date and time to ISO string
        let updatedFields = { ...editFields };
        if (editFields.date && editTime) {
            // NZT offset
            const iso = new Date(`${editFields.date}T${editTime}:00+12:00`).toISOString();
            updatedFields.date = iso;
        }
    if (id) onEdit(id, updatedFields);
        setEditingId(null);
        setEditFields({});
        setEditTime('');
    };

    return (
        <div className="mt-4">
            <h2 className="mb-3">Expenses</h2>
            <ul className="list-group">
                {expenses.map((expense: Expense, idx: number) => (
                    <li key={expense.id || expense._id || idx} className="list-group-item d-flex justify-content-between align-items-center mb-2">
                        {editingId === expense.id ? (
                            <div className="w-100">
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        value={editFields.title || ''}
                                        onChange={e => setEditFields(fields => ({ ...fields, title: e.target.value }))}
                                        placeholder="Title"
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        value={editFields.description || ''}
                                        onChange={e => setEditFields(fields => ({ ...fields, description: e.target.value }))}
                                        placeholder="Description"
                                    />
                                    <input
                                        type="number"
                                        className="form-control mb-1"
                                        value={editFields.amount !== undefined ? editFields.amount : ''}
                                        onChange={e => setEditFields(fields => ({ ...fields, amount: Number(e.target.value) }))}
                                        placeholder="Amount"
                                    />
                                    <div className="d-flex gap-2">
                                        <input
                                            type="date"
                                            className="form-control mb-1"
                                            value={editFields.date || ''}
                                            onChange={e => setEditFields(fields => ({ ...fields, date: e.target.value }))}
                                            placeholder="Date"
                                            style={{ maxWidth: 140 }}
                                        />
                                        <input
                                            type="time"
                                            className="form-control mb-1"
                                            value={editTime}
                                            onChange={e => setEditTime(e.target.value)}
                                            placeholder="Time"
                                            style={{ maxWidth: 100 }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-success btn-sm" onClick={() => saveEdit(expense.id || expense._id)}>
                                        Save
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <strong>{expense.title}</strong> <span className="text-muted">(${expense.amount})</span>
                                    <br />
                                    <small className="text-secondary">
                                        {new Date(expense.date).toLocaleString('en-NZ', {
                                            timeZone: 'Pacific/Auckland',
                                            year: 'numeric',
                                            month: 'short',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </small>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm btn-round d-flex align-items-center justify-content-center"
                                        onClick={() => startEdit(expense)}
                                        title="Edit"
                                    >
                                        <span className="material-icons">edit</span>
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm btn-round d-flex align-items-center justify-content-center"
                                        onClick={() => onDelete(expense.id || expense._id || '')}
                                        title="Delete"
                                    >
                                        <span className="material-icons">delete</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;