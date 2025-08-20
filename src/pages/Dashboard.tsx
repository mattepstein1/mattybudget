// ...existing code...

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ExpenseList from '../components/ExpenseList';
import SpendSummary from '../components/SpendSummary';
import IncomeCard from '../components/IncomeCard';
import { getNZTDateTime, getNZTDayString, getPeriodRange } from '../utils/dateUtils';

const Dashboard = () => {
    const [expenses, setExpenses] = useState<any[]>([]);

    // Error state for fetch
    const [fetchError, setFetchError] = useState<string | null>(null);
    // Fetch expenses from backend on mount
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setFetchError('You must be logged in to view expenses.');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/expenses', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExpenses(response.data);
                setFetchError(null);
            } catch (err) {
                console.error('Failed to fetch expenses:', err);
                setFetchError('Failed to fetch expenses. Please try again.');
            }
        };
        fetchExpenses();
    }, []);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(() => {
        const now = new Date(getNZTDateTime());
        return now.toISOString().slice(0, 10); // yyyy-mm-dd
    });
    const [time, setTime] = useState(() => {
        const now = new Date(getNZTDateTime());
        return now.toTimeString().slice(0, 5); // hh:mm
    });

    // Group expenses by day
    const groupExpensesByDay = (expenses: any[]) => {
        const grouped: { [day: string]: any[] } = {};
        expenses.forEach(exp => {
            const day = getNZTDayString(exp.date);
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(exp);
        });
        return grouped;
    };

    // Fetch expenses from backend (must be after state declarations)
    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setFetchError('You must be logged in to view expenses.');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/expenses', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExpenses(response.data);
            setFetchError(null);
        } catch (err) {
            setFetchError('Failed to fetch expenses. Please try again.');
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to delete an expense.');
                return;
            }

            await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await fetchExpenses();
            alert('Expense deleted successfully!');
        } catch (err) {
            console.error('Error deleting expense:', err);
            alert('Failed to delete expense. Please try again.');
        }
    };

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to add an expense.');
                return;
            }

            // Combine date and time to ISO string in NZT
            const isoDate = new Date(`${date}T${time}:00+12:00`).toISOString();

            const response = await axios.post(
                'http://localhost:5000/api/expenses',
                { title, description, amount: parseFloat(amount), date: isoDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setExpenses([response.data, ...expenses]);
            setTitle('');
            setDescription('');
            setAmount('');
            // Reset to current NZT date/time
            const now = new Date(getNZTDateTime());
            setDate(now.toISOString().slice(0, 10));
            setTime(now.toTimeString().slice(0, 5));
            alert('Expense added successfully!');
        } catch (err) {
            console.error('Error adding expense:', err);
            alert('Failed to add expense. Please try again.');
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Group and sort expenses by day
    const groupedExpenses = groupExpensesByDay(expenses);
    // Sort days newest to oldest
    const days = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const [selectedDay, setSelectedDay] = useState(days.length > 0 ? days[0] : '');
    const currentExpenses = groupedExpenses[selectedDay] || [];

    // Income state
    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeFrequency, setIncomeFrequency] = useState('weekly');
    const [incomeLoading, setIncomeLoading] = useState(false);
    const [incomeError, setIncomeError] = useState('');
    const [showIncomeInput, setShowIncomeInput] = useState(false);
    const [editingIncome, setEditingIncome] = useState(false);
    const [blurIncome, setBlurIncomeState] = useState(false);

    // Sync blurIncome with backend
    useEffect(() => {
        const fetchHideIncome = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get('http://localhost:5000/api/users/hide-income', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBlurIncomeState(!!response.data.hideIncome);
            } catch (err) {
                // ignore error
            }
        };
        fetchHideIncome();
    }, []);

    const setBlurIncome = async (v: boolean) => {
        setBlurIncomeState(v);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await axios.patch('http://localhost:5000/api/users/hide-income', { hideIncome: v }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            // ignore error
        }
    };

    // Fetch income on mount
    useEffect(() => {
        const fetchIncome = async () => {
            setIncomeLoading(true);
            setIncomeError('');
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get('http://localhost:5000/api/income', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data) {
                    setIncomeAmount(response.data.amount?.toString() || '');
                    setIncomeFrequency(response.data.frequency || 'weekly');
                }
            } catch (err) {
                setIncomeError('Failed to fetch income.');
            } finally {
                setIncomeLoading(false);
            }
        };
        fetchIncome();
    }, []);

    // Save income handler
    const handleSaveIncome = async (e: React.FormEvent) => {
        e.preventDefault();
        setIncomeLoading(true);
        setIncomeError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIncomeError('You must be logged in to save income.');
                setIncomeLoading(false);
                return;
            }
            const response = await axios.post('http://localhost:5000/api/income', {
                amount: parseFloat(incomeAmount),
                frequency: incomeFrequency,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIncomeAmount(response.data.amount?.toString() || '');
            setIncomeFrequency(response.data.frequency || 'weekly');
            setEditingIncome(false);
            setShowIncomeInput(false);
        } catch (err) {
            setIncomeError('Failed to save income.');
        } finally {
            setIncomeLoading(false);
        }
    };

    // Edit handler: update expense and refresh list
    const handleEditExpense = async (id: string, updatedExpense: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to edit an expense.');
                return;
            }
            await axios.put(`http://localhost:5000/api/expenses/${id}`, updatedExpense, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchExpenses();
            alert('Expense updated successfully!');
        } catch (err) {
            console.error('Error updating expense:', err);
            alert('Failed to update expense. Please try again.');
        }
    };

    // Get current period range based on selectedDay and incomeFrequency
    const selectedDateParts = selectedDay.split('/');
    const selectedDate = selectedDateParts.length === 3 ? new Date(`${selectedDateParts[2]}-${selectedDateParts[1]}-${selectedDateParts[0]}`) : new Date();
    const { start: periodStart, end: periodEnd } = getPeriodRange(selectedDate, incomeFrequency);

    // Filter expenses for the current period
    const periodExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= periodStart && expDate <= periodEnd;
    });

    // Calculate total spend for the period
    const totalSpend = periodExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    // Calculate percent of income used and remaining income
    const income = parseFloat(incomeAmount) || 0;
    const percentIncomeUsed = income > 0 ? Math.min(100, Math.round((totalSpend / income) * 100)) : 0;
    const incomeLeft = income - totalSpend;
    // For backward compatibility, keep percent for daily budget
    const percent = percentIncomeUsed;

    // Ref for Flatpickr input
    const flatpickrRef = useRef<HTMLInputElement>(null);

    // Inject Flatpickr script on mount
    useEffect(() => {
        if (window && (window as any).flatpickr && flatpickrRef.current) {
            // Convert NZ format (D/M/YYYY) to YYYY-MM-DD for Flatpickr
            const allowedDates = days.map(day => {
                const parts = day.split('/');
                if (parts.length === 3) {
                    // Pad day and month to 2 digits
                    const dd = parts[0].padStart(2, '0');
                    const mm = parts[1].padStart(2, '0');
                    return `${parts[2]}-${mm}-${dd}`;
                }
                return null;
            }).filter(Boolean);
            (window as any).flatpickr(flatpickrRef.current, {
                dateFormat: 'Y-m-d',
                enable: allowedDates,
                onChange: function(selectedDates: Date[]) {
                    if (selectedDates.length > 0) {
                        const d = selectedDates[0];
                        // Pad day and month to 2 digits for NZ format
                        const dayStr = String(d.getDate()).padStart(2, '0');
                        const monthStr = String(d.getMonth() + 1).padStart(2, '0');
                        const formatted = `${dayStr}/${monthStr}/${d.getFullYear()}`;
                        if (days.includes(formatted)) {
                            setSelectedDay(formatted);
                        } else {
                            alert('No expenses for that day.');
                        }
                    }
                },
            });
        }
    }, [days]);

    // Update selectedDay when expenses change (e.g., after add/delete)
    useEffect(() => {
        if (days.length > 0) {
            // Get today's date in NZ format (zero-padded)
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const todayNZ = `${day}/${month}/${year}`;
            if (days.includes(todayNZ)) {
                setSelectedDay(todayNZ);
            } else {
                setSelectedDay(days[0]); // fallback to newest
            }
        } else {
            setSelectedDay('');
        }
    }, [expenses]);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Dashboard</h1>
            <div className="row g-4 align-items-stretch">
                <div className="col-12 col-md-6 d-flex">
                    <form className="add-expense-form glass-card" onSubmit={handleAddExpense}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="form-group d-flex gap-2 align-items-end">
                            <div style={{ flex: 1 }}>
                                <label>Date (NZT)</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Time (NZT)</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                            Add Expense
                        </button>
                    </form>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column gap-3">
                    <div className="dashboard-summary-container glass-card d-flex flex-row align-items-stretch justify-content-center gap-4 mb-4">
                        <SpendSummary
                            totalSpend={totalSpend}
                            income={income}
                            percent={percent}
                            incomeLeft={incomeLeft}
                            periodLabel={incomeFrequency.charAt(0).toUpperCase() + incomeFrequency.slice(1)}
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
            {fetchError && (
                <div className="alert alert-danger text-center mt-4">{fetchError}</div>
            )}
            {days.length > 0 && selectedDay && (
                <div className="d-flex justify-content-center align-items-center mt-4 mb-2 gap-3" style={{ minHeight: 56 }}>
                    <button
                        className="btn btn-outline-secondary btn-round d-flex align-items-center justify-content-center"
                        disabled={days.indexOf(selectedDay) === 0}
                        onClick={() => setSelectedDay(days[days.indexOf(selectedDay) - 1])}
                        title="Previous Day (newer)"
                        style={{ width: 40, height: 40, borderRadius: '50%' }}
                    >
                        <span className="material-icons">chevron_left</span>
                    </button>
                    <div className="d-flex flex-column align-items-center" style={{ minWidth: 180 }}>
                        <label className="fw-bold mb-1" htmlFor="date-picker-input" style={{ fontSize: 16 }}></label>
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold" style={{ fontSize: 18 }}>{selectedDay}</span><br />
                            <input
                                id="date-picker-input"
                                type="text"
                                ref={flatpickrRef}
                                className="form-control"
                                style={{ maxWidth: 140, fontWeight: 'bold', textAlign: 'center' }}
                                placeholder="Select day"
                                readOnly
                            />
                        </div>
                    </div>
                    <button
                        className="btn btn-outline-secondary btn-round d-flex align-items-center justify-content-center"
                        disabled={days.indexOf(selectedDay) === days.length - 1}
                        onClick={() => setSelectedDay(days[days.indexOf(selectedDay) + 1])}
                        title="Next Day (older)"
                        style={{ width: 40, height: 40, borderRadius: '50%' }}
                    >
                        <span className="material-icons">chevron_right</span>
                    </button>
                </div>
            )}
            <h2 className="text-center mt-3">Expenses for {selectedDay}</h2>
            {expenses.length === 0 ? (
                <div className="text-center text-muted mt-4">No expenses found.</div>
            ) : currentExpenses.length === 0 ? (
                <div className="text-center text-muted mt-4">No expenses for this day.</div>
            ) : (
                <ExpenseList expenses={currentExpenses} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />
            )}
        </div>
    );
};

export default Dashboard;