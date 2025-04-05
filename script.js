let accounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    clearMessages();
}

function clearMessages() {
    document.querySelectorAll('.success-message').forEach(msg => {
        msg.style.display = 'none';
    });
}

function createAccount() {
    const accountNumber = `BANK-${Date.now().toString().slice(-6)}`;
    const name = document.getElementById('fullName').value;
    const balance = parseFloat(document.getElementById('initialDeposit').value);
    const successMessage = document.getElementById('accountCreated');

    if (balance < 50) {
        alert('Minimum initial deposit is $50');
        return;
    }

    accounts.push({
        accountNumber,
        name,
        balance,
        transactions: [{
            type: 'initial deposit',
            amount: balance,
            date: new Date().toISOString()
        }]
    });

    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    
    successMessage.innerHTML = `
        Account created successfully! 🎉<br>
        <strong>Account Number:</strong> ${accountNumber}<br>
        <strong>Account Holder:</strong> ${name}<br>
        <strong>Initial Balance:</strong> $${balance.toFixed(2)}
    `;
    successMessage.style.display = 'block';
    document.getElementById('createForm').reset();
}

function handleTransaction(type) {
    const accNumber = document.getElementById('accountNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const resultDiv = document.getElementById('transactionResult');
    const account = accounts.find(acc => acc.accountNumber === accNumber);

    if (!account) {
        resultDiv.style.backgroundColor = '#f8d7da';
        resultDiv.style.color = '#721c24';
        resultDiv.innerHTML = '❌ Account not found!';
        resultDiv.style.display = 'block';
        return;
    }

    if (type === 'deposit') {
        account.balance += amount;
        account.transactions.push({
            type: 'deposit',
            amount,
            date: new Date().toISOString()
        });
        resultDiv.innerHTML = `✅ $${amount.toFixed(2)} deposited successfully!<br>
                              New Balance: $${account.balance.toFixed(2)}`;
    } else if (type === 'withdraw') {
        if (account.balance >= amount) {
            account.balance -= amount;
            account.transactions.push({
                type: 'withdrawal',
                amount,
                date: new Date().toISOString()
            });
            resultDiv.innerHTML = `✅ $${amount.toFixed(2)} withdrawn successfully!<br>
                                  Remaining Balance: $${account.balance.toFixed(2)}`;
        } else {
            resultDiv.style.backgroundColor = '#f8d7da';
            resultDiv.style.color = '#721c24';
            resultDiv.innerHTML = '❌ Insufficient funds!';
            resultDiv.style.display = 'block';
            return;
        }
    }

    resultDiv.style.display = 'block';
    resultDiv.style.backgroundColor = '#d4edda';
    resultDiv.style.color = '#155724';
    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    document.getElementById('transactionForm').reset();
}

function viewAccountDetails() {
    const accNumber = document.getElementById('viewAccountNumber').value;
    const detailsDiv = document.getElementById('accountDetails');
    const account = accounts.find(acc => acc.accountNumber === accNumber);

    if (account) {
        detailsDiv.innerHTML = `
            <h3>Account Summary</h3>
            <p><strong>Account Number:</strong> ${account.accountNumber}</p>
            <p><strong>Account Holder:</strong> ${account.name}</p>
            <p><strong>Current Balance:</strong> $${account.balance.toFixed(2)}</p>
            <h4>Recent Transactions</h4>
            ${account.transactions.slice(-5).reverse().map(transaction => `
                <div class="transaction">
                    ${new Date(transaction.date).toLocaleDateString()} - 
                    ${transaction.type.toUpperCase()}: 
                    $${transaction.amount.toFixed(2)}
                </div>
            `).join('')}
        `;
    } else {
        detailsDiv.innerHTML = '<p style="color: var(--danger-color)">Account not found!</p>';
    }
    document.getElementById('viewForm').reset();
}

// Initialize default view
showSection('create');