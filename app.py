# app.py - Complete Flask Backend for Expense Tracker Pro

import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, render_template

# Initialize Flask app
app = Flask(__name__)

# ============================================
# DATABASE SETUP
# ============================================

def init_database():
    """Create database and expenses table if they don't exist"""
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Create expenses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL
        )
    ''')
    
    # Add some sample data if table is empty
    cursor.execute("SELECT COUNT(*) FROM expenses")
    count = cursor.fetchone()[0]
    
    if count == 0:
        today = datetime.now().strftime('%Y-%m-%d')
        sample_data = [
            ('Grocery Shopping', 'Food', 85.50, today),
            ('Uber Ride', 'Transport', 32.00, today),
            ('New Jeans', 'Shopping', 59.99, today),
            ('Electricity Bill', 'Bills', 120.00, today),
            ('Coffee', 'Food', 4.50, today)
        ]
        cursor.executemany(
            'INSERT INTO expenses (description, category, amount, date) VALUES (?, ?, ?, ?)',
            sample_data
        )
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully!")

# Initialize database
init_database()

# ============================================
# DATABASE HELPER FUNCTION
# ============================================

def get_db_connection():
    """Return database connection with row factory"""
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# ============================================
# ROUTES - Pages
# ============================================

@app.route('/')
def index():
    """Dashboard page"""
    return render_template('index.html')

@app.route('/add')
def add_expense_page():
    """Add expense page"""
    return render_template('add_expense.html')

# ============================================
# API ROUTES - Backend Operations
# ============================================

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses or filter by category"""
    category = request.args.get('category')
    conn = get_db_connection()
    
    if category and category != 'all':
        expenses = conn.execute(
            'SELECT * FROM expenses WHERE category = ? ORDER BY date DESC',
            (category,)
        ).fetchall()
    else:
        expenses = conn.execute(
            'SELECT * FROM expenses ORDER BY date DESC'
        ).fetchall()
    
    conn.close()
    
    # Convert to list of dictionaries
    expense_list = [dict(expense) for expense in expenses]
    total = sum(exp['amount'] for exp in expense_list)
    
    return jsonify({
        'expenses': expense_list,
        'total': total,
        'count': len(expense_list)
    })

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    """Add a new expense"""
    data = request.get_json()
    
    # Validate data
    description = data.get('description', '').strip()
    category = data.get('category', 'Other')
    amount = data.get('amount')
    
    if not description:
        return jsonify({'success': False, 'error': 'Description is required'}), 400
    
    if amount is None:
        return jsonify({'success': False, 'error': 'Amount is required'}), 400
    
    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({'success': False, 'error': 'Amount must be positive'}), 400
    except ValueError:
        return jsonify({'success': False, 'error': 'Invalid amount'}), 400
    
    # Insert into database
    date = datetime.now().strftime('%Y-%m-%d')
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO expenses (description, category, amount, date) VALUES (?, ?, ?, ?)',
        (description, category, amount, date)
    )
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'message': 'Expense added successfully'})

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense by ID"""
    conn = get_db_connection()
    conn.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'message': 'Expense deleted'})

# ============================================
# RUN THE APPLICATION
# ============================================

if __name__ == '__main__':
    print("\n🚀 Starting Expense Tracker Pro...")
    print("📍 Open your browser and go to: http://127.0.0.1:5000")
    print("📝 Press Ctrl+C to stop the server\n")
    app.run(debug=True, port=5000)

    # app.py - Add to the top with other imports

# Currency conversion rates (approximate)
CURRENCY_RATES = {
    'PKR': 1.0,
    'USD': 0.0036,  # 1 PKR = 0.0036 USD
}

def convert_currency(amount, from_currency='PKR', to_currency='PKR'):
    """Convert amount between currencies"""
    if from_currency == to_currency:
        return amount
    # Convert to PKR first, then to target
    amount_in_pkr = amount / CURRENCY_RATES[from_currency]
    return amount_in_pkr * CURRENCY_RATES[to_currency]