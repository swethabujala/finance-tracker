let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
let pieChart = null;

form.addEventListener("submit", e => {
  e.preventDefault();
  const desc = document.getElementById("desc").value.trim();
  const amount = +document.getElementById("amount").value.trim();
  const type = document.getElementById("type").value;
  const date = new Date().toISOString().split("T")[0];

  if (desc === "" || isNaN(amount)) return;

  transactions.push({
    description: desc,
    amount: type === "income" ? amount : -amount,
    date: date
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderList();
  form.reset();
});

function renderList() {
  list.innerHTML = "";

  if (transactions.length === 0) {
    list.innerHTML = `<li class="list-group-item text-center text-muted">No transactions yet.</li>`;
    updateValues();
    renderChart();
    return;
  }

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center ${t.amount > 0 ? "income" : "expense"}`;
    li.innerHTML = `
      <span>${t.description}</span>
      <span>
        ₹${Math.abs(t.amount)} 
        <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeTransaction(${index})">x</button>
      </span>
    `;
    list.appendChild(li);
  });

  updateValues();
  renderChart();
}

function updateValues() {
  const total = transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2);
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0).toFixed(2);

  balance.innerText = `₹${total}`;
  income.innerText = `₹${totalIncome}`;
  expense.innerText = `₹${totalExpense}`;
}

function removeTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderList();
}

function renderChart() {
  const incomeSum = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenseSum = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const ctx = document.getElementById("pieChart").getContext("2d");
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [incomeSum, expenseSum],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Initial load
renderList();
