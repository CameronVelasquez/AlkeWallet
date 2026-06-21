//LOGIN
/*Login Validator*/
const btnLogin = document.getElementById('btnLogin');

if (btnLogin) {
    btnLogin.addEventListener( 'click', () => {

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if(email === 'admin@alkewallet.com' && 
        password === 'n2^n66zE#&%x') {

        location.href = 'menu.html';
}   else {

        alert('Email or Password is incorrect');
        document.getElementById('password').value = '';
            //return(email);
} 
    });
}

// MENU
/*Menu Redirect*/
const buttons = document.querySelectorAll('button[data-page]');
const mssg = document.getElementById('mssgPages');

if(buttons.length > 0 && mssg) {

    for (const button of buttons) {  
        button.addEventListener('click', () => {
            mssg.textContent = `Redirecting to ${button.dataset.screen} page...`;

            setTimeout(() => {
                window.location.href = button.dataset.page; 
            }, 2000);
        });
    };
}


// DEPOSIT  

/*Show Current Balance.*/
const balanceLabel = document.getElementById('currentBalance');

if (balanceLabel) {
    
    let balance = Number(localStorage.getItem('balance')) || 0.00; 
    balanceLabel.textContent = `$${balance.toFixed(2)} USD`;
    
}

/*Make a Deposit */
const makeDeposit = document.getElementById('makeDeposit');

if (makeDeposit) {

    makeDeposit.addEventListener('click', () => {

        let depositAmount = Number(document.getElementById('depositAmount').value);

         if (isNaN(depositAmount)) {
            alert('Please enter a numeric value for the deposit amount.');
            return;
        } else if (depositAmount <= 0) {
            alert('Please enter a valid amount to deposit.');
            return;
        } else if (depositAmount > 1000000) {
            alert('Deposit amount exceeds the maximum limit of $1.000.000,00 USD.');
            return;
        } else {
            
            const currentBalance = document.getElementById('currentBalance');
            
            if (currentBalance) {
                
                let balance = Number(localStorage.getItem('balance')) || 0.00;
                /* deposit: */
                balance += depositAmount;
                /* update the balance: */
                localStorage.setItem('balance', balance); 
                currentBalance.textContent = `$${balance.toFixed(2)} USD`;
                /* Save transaction history: */
                let transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
                let newTransaction = {
                    alias: 'Myself Alias',
                    name: 'Name Test',
                    CBU: "12345678-k",
                    type: 'Deposit',
                    amount: depositAmount,
                    bank: "Bank Test",
                    date: new Date().toDateString()
                };
                /* Add the new transaction to the beginning of the history array: */
                transactionHistory.unshift(newTransaction);
                /* Show last 10  */
                let transactionsHistory = transactionHistory.slice(0, 10);
                localStorage.setItem('transactionHistory', JSON.stringify(transactionsHistory));
                alert(`You have successfully deposited $${depositAmount.toFixed(2)} USD in your account.`);
                location.reload();
          }; 
            
        };
    });
}

// SEND MONEY
/* Save new contact form */ 
const saveContact = document.getElementById('saveContact');

if(saveContact){

    saveContact.addEventListener('click', () => {

        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        let firstName = document.getElementById('contactFirstName').value;
        let lastName = document.getElementById('contactLastName').value;
        let CBU = document.getElementById('contactCBU').value;
        let email = document.getElementById('contactEmail').value;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let bank = document.getElementById('contactBank').value;

         if (firstName === "" || lastName === "") {
            alert('Please enter both first and last name for the contact.');
            return;
        } else if (CBU === "") {
            alert('CBU is required for the contact.');
            return;
        } else if (CBU.length < 9 || CBU.length > 12) {
            alert('CBU must contain at least 9 characters.');
            return;
        } else if (bank === "") {
            alert('Please enter the bank name for the contact.');
            return;
        } else if (email === "") {
            alert('Please enter an email address for the contact.');
            return;
        } else if (email !== "" && !emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        let newContact = {

            name: `${firstName} ${lastName}`,
            alias: document.getElementById('contactAlias').value,
            CBU: document.getElementById('contactCBU').value,
            bank: document.getElementById('contactBank').value,
            email: document.getElementById('contactEmail').value

        };

        contacts.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        alert('Contact added successfully.');
        location.reload();
    });
}

/* Show contact list */ 
const contactList = document.getElementById('contactList');

if (contactList) {

    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    
    if (contacts.length === 0 || contacts === '[]') {
        
        let noContactsMessage = document.createElement('h5');
        noContactsMessage.className = 'text-muted text-center mt-4 mb-4';
        noContactsMessage.textContent = 'You have no contacts saved.';
        contactList.appendChild(noContactsMessage);
    } else {    
        contacts.forEach(contact => {
        

        let contactCard = document.createElement('li');
        contactCard.className = 'list-group-item';       
        
        contactCard.innerHTML = `
        <input type="radio" name="selectedContact" value="${contact.alias}">
        <section class="contact-info">
                <h5>Name: ${contact.name}</h5>
                <hr class="my-2 border-top border-secondary">
                <p>Alias: ${contact.alias}</p>
                <p>CBU: ${contact.CBU}</p>
                <p>Bank: ${contact.bank}</p>
                <p>Email: ${contact.email}</p>
            </section>
        `;
       // renderContactList();
        contactList.appendChild(contactCard);
        
    });

}}

/* Send Money */
const sendMoneyButton = document.getElementById('sendMoneyButton');

if (sendMoneyButton) {
   
    sendMoneyButton.addEventListener('click', () => {        
        const selectedRadio = document.querySelector('input[name="selectedContact"]:checked');
        const transferAmount = document.getElementById('transferAmount').value;

        if (!selectedRadio) {
            alert('Please select a contact.');
            return;
        } else if (transferAmount === "") {
            alert('Please enter a valid amount.');
            return;
        } else if (isNaN(transferAmount) || parseFloat(transferAmount) <= 0) {
            alert('Please enter a valid transfer amount.');
            return;
        } else if (transferAmount > 1000000){
            alert('The transfer amount exceeds the maximum limit of $1.000.000 USD.')
        }
        // Proceed with the money transfer logic
        // Deduct the transfer amount from the balance
        let balance = Number(localStorage.getItem('balance')) || 0.00;
        
        if (parseFloat(transferAmount) > balance) {
            alert('Insufficient balance for this transfer.');
            return;
        }
        // Search for the selected contact
        // from you current list of contacts
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        const selectedContact = contacts.find(contact => contact.alias === selectedRadio.value);

        if (!selectedContact) {
            alert('Contact not found.');
            return;
        }
        // Send Money
        // Update balance amount
        // Get transaction history to show
        balance -= parseFloat(transferAmount);
        localStorage.setItem('balance', balance);
        let transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
        const newTransaction = {
            alias: selectedContact.alias,
            type: 'Transfer Sent',
            amount: parseFloat(transferAmount),
            bank: selectedContact.bank,
            date: new Date().toDateString(),
            name: selectedContact.name,
            CBU: selectedContact.CBU
        };

        /* Update transactions.html */
        transactionHistory.unshift(newTransaction);
        transactionHistory = transactionHistory.slice(0,10);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
        alert(`You have successfully sent $${parseFloat(transferAmount).toFixed(2)} USD to ${selectedContact.name}.`);        
        location.reload();
    });
}

// TRANSACTIONS
/*Show Transaction History*/
const transactionList = document.getElementById('transactionList');
       
if (transactionList) {

    const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
    transactionHistory.forEach(transaction => {

        let card = document.createElement('li');
        card.className = 'list-group-item';
        card.onmouseover = function() { this.style.backgroundColor = 'lightgray'; };
        card.onmouseout = function() { this.style.backgroundColor = 'white'; };
        card.innerHTML = `
             <h5 style="color: cadetblue; text-align: center"><strong>${transaction.alias}</strong></h5>
             <hr class="my-2 border-top border-secondary">
             <p>Type: ${transaction.type}</p>
             <p>Amount: $${transaction.amount.toFixed(2)} USD</p>
             <p>Bank: ${transaction.bank}</p>
             <p>Date: ${transaction.date}</p>
             <p>Name: ${transaction.name}</p>
             <p>CBU: ${transaction.CBU}</p>
        `;
      
            transactionList.appendChild(card);
    });
}    





// FORM VALIDATION
/*
function validarFormulario() {
let name = document.getElementById("name").value;
let cbu = document.getElementById("cbu").value;
let email = document.getElementById("email").value;
let phone = document.getElementById("phone").value;

if(name === "") {
alert("You must enter a name.");
return false;
}

if(cbu === "") {
alert("cbu is required.");
return false;
}

if(cbu.length < 9) {
alert("cbu must contains at least 9 characters");
return false;
}

if(email !== "") {
if(!email.includes("@") && !email.includes(".")) {
alert("Invalid email, please try again.");
return false;
}
}

if(phone !== "") {
if(phone.length < 11) {
alert("You must enter a valid phone number of 11 characters");
return false;
}
}

alert("New Contact Added.");
return true;
}*/