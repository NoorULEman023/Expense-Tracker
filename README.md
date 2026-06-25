# 💰 Expense Tracker Pro - Mini Project

> A full-stack expense tracking web application built with Python Flask, SQLite, HTML, CSS, and JavaScript

## 📌 Project Overview

This is a **Mini Project** for tracking daily expenses. It allows users to add, view, and delete expenses with category filtering and data visualization.

### 🎯 Project Type
- **Mini Project**
- **Web Application**
- **Full-Stack Development**

---

## ✨ Features

### Core Features
- ✅ Add new expenses with description, category, and amount
- ✅ View all expenses in a modern table
- ✅ Delete expenses with confirmation
- ✅ Calculate and display total expenses
- ✅ Auto-date display
- ✅ Filter expenses by category

### Advanced Features
- ✅ **PKR and USD currency support**
- ✅ **Interactive charts (Pie chart & Bar chart)**
- ✅ **Export to CSV**
- ✅ **Toast notifications**
- ✅ **Modern SaaS UI with glassmorphism**
- ✅ **Responsive design for all devices**

---

## 🛠️ Technologies Used

| Category      | Technology       | Purpose |
|---------------|------------------|---------|
| Backend       | Python Flask     | Web framework |
| Database      | SQLite           | Data storage |
| Frontend      | HTML5            | Structure |
| Styling       | CSS3             | Design |
| Interactivity | JavaScript (ES6) | Functionality |
| Charts        | Chart.js         | Data visualization |
| Icons         | Font Awesome     | UI icons |
| Fonts         | Google Fonts     | Typography |

---

## 📁 Project Structure
```
Expense-Tracker/
│
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .gitignore         # Git ignore file
├── README.md          # Project documentation
├── LICENSE            # MIT License
│
├── templates/
│   ├── index.html      # Dashboard page
│   └── add_expense.html # Add expense page
│
└── static/
    ├── style.css       # Complete styling
    └── script.js       # JavaScript functionality
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher ([Download](https://python.org))
- pip (comes with Python)
- Git (optional, for cloning)

### Step 1: Clone the repository

**Using Git:**
```bash
git clone https://github.com/NoorULEman023/Expense-Tracker.git
cd Expense-Tracker
```

**OR Download ZIP:**
1. Go to: https://github.com/NoorULEman023/Expense-Tracker
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file

### Step 2: Create virtual environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the application
```bash
python app.py
```

### Step 5: Open in browser
Navigate to: `http://127.0.0.1:5000`

---

## 📸 Screenshots

### Dashboard View
![Dashboard](screenshots/dashboard.png)

### Add Expense Page
![Add Expense](screenshots/add-expense.png)

### Charts & Analytics
![Charts](screenshots/charts.png)

---

## 🎯 How to Use

1. **View Dashboard**: See all expenses, statistics, and charts
2. **Add Expense**: Click "Add Expense" → Fill in details → Submit
3. **Filter Expenses**: Use the category dropdown
4. **Delete Expense**: Click the trash icon next to any expense
5. **Switch Currency**: Toggle between PKR and USD
6. **Export Data**: Click "Export CSV" to download your expenses

---

## 🎨 Color Scheme

| Color | Hex Code | Usage |
|-------|----------|-------|
| Professional Blue | `#2563EB` | Primary buttons, navigation |
| Emerald Green | `#10B981` | Accent, success indicators |
| Dark Navy | `#1E293B` | Secondary, text |
| Background | `#F8FAFC` | Page background |
| White | `#FFFFFF` | Cards, containers |

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses?category=Food` | Get expenses by category |
| POST | `/api/expenses` | Add a new expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |

---

## 🧪 Sample Data

| Description | Category  | Amount |
|------------------|-----------|--------|
| Grocery Shopping | Food      | 85.50 |
| Uber Ride        | Transport | 32.00 |
| New Jeans        | Shopping  | 59.99 |
| Electricity Bill | Bills     | 120.00 |
| Coffee           | Food      | 4.50 |
| Bus Ticket       | Transport | 15.00 |
| Online Course    | Shopping  | 199.00 |

---

## 🐛 Troubleshooting

### Issue: "python is not recognized"
**Solution:** Install Python from https://python.org and check "Add Python to PATH"

### Issue: Database Error
**Solution:** Delete `database.db` and restart
```bash
del database.db  # Windows
rm database.db   # Mac/Linux
python app.py
```

### Issue: Port Already in Use
**Solution:** Change port in `app.py`
```python
app.run(debug=True, port=5001)
```

### Issue: Flask Not Found
**Solution:**
```bash
pip install flask
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Noor Uleman**
- GitHub: [@NoorULEman023](https://github.com/NoorULEman023)
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/noor-ul-eman-b0904b347/)

---

## 🙏 Acknowledgments

- Flask documentation
- Chart.js library
- Font Awesome icons
- Google Fonts
- SQLite

---

## 📊 Project Status

| Phase         | Status |
|---------------|--------|
| Planning      | ✅ Complete |
| Development   | ✅ Complete |
| Testing       | ✅ Complete |
| Documentation | ✅ Complete |
| Deployment    | ⬜ In Progress |

---

## 🚀 Future Enhancements

- [ ] User Authentication (Login/Signup)
- [ ] Budget Tracking (Set monthly limits)
- [ ] Email Reports (Weekly summaries)
- [ ] Dark Mode (Toggle theme)
- [ ] Mobile App (React Native/Flutter)
- [ ] Receipt Upload (Image recognition)
- [ ] Recurring Expenses (Monthly subscriptions)
- [ ] Multi-User Support (Family accounts)
- [ ] Data Backup (Cloud sync)

---

## 💡 Why This Project?

- ✅ Full-stack web development skills
- ✅ Python Flask backend with RESTful APIs
- ✅ SQLite database integration
- ✅ Modern UI/UX design principles
- ✅ Data visualization with charts
- ✅ Currency conversion (PKR/USD)
- ✅ Export functionality (CSV)
- ✅ Responsive design for all devices

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐!

---

**🔗 Project Link:** [https://github.com/NoorULEman023/Expense-Tracker](https://github.com/NoorULEman023/Expense-Tracker)
**Made with ❤️ by Noor Uleman**
