document.addEventListener('DOMContentLoaded', function() {
    let customers = [];
    let transactions = [];
  
    // Fetch data from local JSON file
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        customers = data.customers;
        transactions = data.transactions;
        displayTable(transactions);
      });
  
    const filterNameInput = document.getElementById('filterName');
    const filterAmountInput = document.getElementById('filterAmount');
  
    filterNameInput.addEventListener('input', filterTable);
    filterAmountInput.addEventListener('input', filterTable);
  
    function filterTable() {
      const filterName = filterNameInput.value.toLowerCase();
      const filterAmount = parseFloat(filterAmountInput.value);
      const filteredTransactions = transactions.filter(transaction => {
        const customer = customers.find(c => c.id === transaction.customer_id);
        return (
          (!filterName || customer.name.toLowerCase().includes(filterName)) &&
          (!filterAmount || transaction.amount === filterAmount)
        );
      });
      displayTable(filteredTransactions);
    }
  
    function displayTable(transactions) {
      const tbody = document.querySelector('#customerTable tbody');
      tbody.innerHTML = '';
      transactions.forEach(transaction => {
        const customer = customers.find(c => c.id === transaction.customer_id);
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${customer.name}</td>
          <td>${transaction.date}</td>
          <td>${transaction.amount}</td>
        `;
        row.addEventListener('click', () => displayChart(customer.id));
        tbody.appendChild(row);
      });
    }
  
    function displayChart(customerId) {
      const customerTransactions = transactions.filter(t => t.customer_id === customerId);
      const dates = [...new Set(customerTransactions.map(t => t.date))];
      const amounts = dates.map(date => {
        return customerTransactions
          .filter(t => t.date === date)
          .reduce((sum, t) => sum + t.amount, 0);
      });
  
      const ctx = document.getElementById('transactionChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Transaction Amount',
            data: amounts,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
          }]
        },
        options: {
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true }
          }
        }
      });
    }
  });
  