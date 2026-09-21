console.log("script loaded");

//LOGIN
/*Login Validator*/
$(document).ready(function() {
    $('#loginForm').submit( function(event) {
         event.preventDefault();

         let email = $('#email').val();
         let password = $('#password').val();

         if ( email === 'admin@alkewallet.com' && 
            password === 'n2^n66zE#&%x')
         {
              alert('You are successfully logged')
              window.location.href = 'menu.html';
         } else {

              alert('Email or Password is incorrect');
              $('password').val();
              return(email);
         } 
    });

});

// MENU
//Menu Redirect
//if(buttons.length > 0 && !mssg) 

    $(document).ready(function() {  
        $('button[data-page]').on('click', function() {
            $('#mssgPages').text(`Redirecting to ${$(this).data('screen')} page...`);

            let page = $(this).data('page')

            setTimeout(function() {
                window.location.href = page; 
            }, 2000);
        });
    });



// DEPOSIT  
/*Show Current Balance.*/
    $(document).ready(function() {    
    
    let balance = Number(localStorage.getItem('balance')) || 0.00; 
    $('#currentBalance').text(`$${balance.toFixed(2)} USD`);
});

/*Make a Deposit */
 $(document).ready(function() {
    
    $('#depositAmountForm').submit( function (event) {
        event.preventDefault();

        let depositAmount = parseFloat($('#depositAmount').val());

        if (isNaN(depositAmount) || ![] ) {
            $('#alertContainer').html(`
            <div class="alert alert-success alert-dismissible fade show">

    Please enter a numeric value.

                <button
                type="button"
                class="close"
                data-dismiss="alert">

                &times;

                </button>

            </div>
            `);
            //alert('Please enter a numeric value.');
            return;
        } else if (depositAmount <= 0) {
            alert('Please enter a valid amount to deposit.');
            return;
        } else if (depositAmount > 1000000) {
             $('#alertContainer').html(`
            <div class="alert alert-success alert-dismissible fade show">

                Deposit amount exceeds the maximum limit of $1.000.000,00 USD.

                <button
                type="button"
                class="close"
                data-dismiss="alert">

                &times;

                </button>

            </div>
            `);
            //alert('Deposit amount exceeds the maximum limit of $1.000.000,00 USD.');
            return;
        } 
                let balance = parseFloat(localStorage.getItem('balance')) || 0.00;
                /* deposit: */
                balance += depositAmount;
                /* update the balance: */
                localStorage.setItem('balance', balance); 
                
                $('#currentBalance').text(`$${balance.toFixed(2)} USD`);

                /* Save transaction history: */
                let transactionsHistory = JSON.parse(localStorage.getItem('transactionsHistory')) || [] ;
                transactionsHistory.unshift({
                    alias: 'Myself Alias',
                    name: 'Name Test',
                    CBU: "12345678-k",
                    type: 'Deposit',
                    amount: depositAmount,
                    bank: "Bank Test",
                    date: new Date().toDateString()
                });
                //$('#depositMessage').html(`<strong>Great!</strong> You have successfully deposited $${depositAmount.toFixed(2)} USD in your account.`);
                // Add the new transaction to the beginning of the history array:
                // Showing last 10 
                localStorage.setItem('transactionsHistory', JSON.stringify(transactionsHistory.slice(0, 10)));
                $('#alertContainer').html(`
                <div class="alert alert-success alert-dismissible fade show d-flex flex-wrap">

                        <strong>Great!</strong> You have successfully deposited $${depositAmount.toFixed(2)} USD in your account.

                        <button
                        type="button"
                        class="close"
                        data-dismiss="alert">

                        &times;

                        </button>

                </div>
                `);
                
                
                setTimeout(function() {
                    window.location.href = 'menu.html';
            }, 4000);
        });
    });

  

// SEND MONEY
/* Save contact form */ 
$(document).ready(function() {

    $('#saveContact').on('click', function() {

        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];        
        /* Each contact on card info */
        let firstName = $('#contactFirstName').val();
        let lastName = $('#contactLastName').val();
        let CBU = $('#contactCBU').val();
        let alias = $('#contactAlias').val();
        let email = $('#contactEmail').val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; /* email validator */
        let bank = $('#contactBank').val();
        let createdAt = new Date().toDateString();
        
                 
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
        } else if (!email === "" || !emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        contacts.push({

            name: `${firstName} ${lastName}`,
            alias: alias,
            CBU: CBU,
            bank: bank,
            email: email,
            createdAt: createdAt

        });
    
        localStorage.setItem('contacts', JSON.stringify(contacts));
        alert('Contact added successfully.');
        location.reload();   

   });

});

/* Show contact list */
$(document).ready(function() {

    if ($('#contactList').length > 0) {
        
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];        
        
        contacts.forEach( contact => {            
            
            let card = document.createElement('li');       
            card.className = 'list-group-item';
            card.innerHTML = `
            <input type="radio" style="height:25px; width: 25px;" name="selectedContact" value="${contact.alias}">
            <h5 class='text-center mt-4 mb-4';><strong>${contact.alias}</strong></h5>
            <hr class="my-2 border-top border-secondary">
            <p>Name: ${contact.name}</p>
            <p>Bank: ${contact.bank}</p>
            <p>Email: ${contact.email}
            <p>CBU: ${contact.CBU}</p>
            <p>Creation Date: ${contact.createdAt}</p>
            `;
            
            $('#contactList').append(card);
            
        });
    };
});

/* Contacts filter */
$('#searchContact').click(function(event){
    event.preventDefault();

    let search = $('input[name="searchContact"]').val().toLowerCase();

    $('.list-group-item').each(function(){

        let text = $(this).text().toLowerCase();

        if(text.includes(search))
            $(this).show();
        else
            $(this).hide();

    });

});

 $('#sendMoneyButton').hide();

 $(document).on('change','input[name="selectedContact"]',function(){

    $('#sendMoneyButton').fadeIn();
});

/* Send Money */ 
$(document).ready(function() {
    
   
    console.log('READY');
    
    console.log('LLEGUE AL FINAL SENDMONEY');
    $('#sendMoneyButton').on('click', function() {
        console.log('BOTON CLICK');
        
        let selectedRadio = $('input[name="selectedContact"]:checked');
        let transferAmount = parseFloat($('#transferAmount').val());
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];    
        let selectedContact = contacts.find( contact => contact.alias === selectedRadio.val());
        let balance = Number(localStorage.getItem('balance')) || 0;    
        let noContacts = $('#noContacts');
    
    if(!contacts || contacts.length === 0 ) {
            let noContacts = document.createElement('h5');
            noContacts.className = 'text-muted text-center mt-4 mb-4';
            noContacts.textContent = 'You have no contacts saved.';
            return;    
    } else if (selectedRadio.length === 0 || selectedRadio === '[]'){
        alert('Select a contact.')
        return;        
    } else if (isNaN(transferAmount) || transferAmount <= 0){
        alert('Invalid amount.');
        return;
    } else if (transferAmount > 1000000){
        alert('The transfer amount exceeds the maximum limit of $1.000.000 USD.')
        return;
    } else if( transferAmount > balance ) {
        alert('Insufficient balance');
        return;    
    }       
        balance -= transferAmount;    
        localStorage.setItem('balance', balance);
        let transactionsHistory = JSON.parse(localStorage.getItem('transactionsHistory')) || [];
                    
        
        transactionsHistory.unshift({
            alias: selectedContact.alias,
            name: selectedContact.name,
            type: 'Transfer Sent',
            amount: transferAmount,
            bank: selectedContact.bank,
            date: new Date().toDateString(),
            CBU: selectedContact.CBU
        });      
            
        localStorage.setItem('transactionsHistory', JSON.stringify(transactionsHistory.slice(0, 10)));
        alert(`You have successfully transfered $${transferAmount.toFixed(2)} USD to ${selectedContact.name}.`);
        console.log(selectedContact);
        console.log(balance);
        console.log(transactionsHistory);
        location.reload();           
        
    });
});


// TRANSACTIONS
/*Show Transaction History*/
function showTransactions(filter = 'All') {
    let transactionsHistory = JSON.parse(localStorage.getItem('transactionsHistory')) || [];

    $('#transactionList').empty();

    transactionsHistory.forEach(transaction => {
        if (filter !== 'All' && transaction.type !== filter) {
            return;
        }

        $('#transactionList').append(`
            <li class="list-group-item" onmouseover="this.style.backgroundColor='lightgray'" onmouseout="this.style.backgroundColor='white'">
                <h5 style="text-align:center"><strong>${transaction.alias}</strong></h5>
                <hr class="my-2 border-top border-secondary">
                <p><strong>Type:</strong> ${transaction.type}</p>
                <p><strong>Amount:</strong> $${transaction.amount.toFixed(2)} USD</p>
                <p><strong>Bank:</strong> ${transaction.bank}</p>
                <p><strong>Date:</strong> ${transaction.date}</p>
                <p><strong>Name:</strong> ${transaction.name}</p>
                <p><strong>CBU:</strong> ${transaction.CBU}</p>
            </li>
            <br>
        `);
    });
}

/* Captures the select value */
$(document).ready(function(){

    showTransactions();

    $('#filterTransaction').change(function(){

        showTransactions($(this).val());

    });

});





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