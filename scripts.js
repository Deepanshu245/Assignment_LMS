document.getElementById('login').addEventListener('click', loginUser);
document.getElementById('logout').addEventListener('click', logoutUser);
document.getElementById('book-form').addEventListener('submit', addBook);
document.getElementById('book-list').addEventListener('click', handleBookActions);
document.getElementById('clear-history').addEventListener('click', clearHistory);

let currentUser = null;
const users = {};

function loginUser() {
    const username = document.getElementById('username').value;
    if (username.trim() === '') {
        alert('Please enter a username');
        return;
    }

    currentUser = username;
    if (!users[username]) {
        users[username] = [];
    }

    document.getElementById('user-form').style.display = 'none';
    document.getElementById('user-logs').style.display = 'none';
    // In your scripts.js, after the user logs in successfully
    document.getElementById('logged-in-form').style.display = 'block';
    document.getElementById('table-header').style.display = 'table-header-group';
    document.getElementById('welcome-message').textContent = `Welcome, ${username}`;
    document.getElementById('book-form').style.display = 'flex';

    displayBooks();
}

function logoutUser() {
    currentUser = null;
    document.getElementById('user-form').style.display = 'flex';
    document.getElementById('user-logs').style.display = 'block';   
        // When the user logs out
    document.getElementById('logged-in-form').style.display = 'none';
    document.getElementById('table-header').style.display = 'none';

    document.getElementById('book-form').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('book-list').querySelector('tbody').innerHTML = '';
    displayUserLogs();
}

function addBook(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const issueDate = document.getElementById('issue-date').value;
    const returnDate = document.getElementById('return-date').value;

    if (!title || !author || !issueDate || !returnDate) {
        alert('Please fill in all fields');
        return;
    }

    const daysRemaining = calculateDaysRemaining(returnDate);

    const book = {
        title,
        author,
        issueDate,
        returnDate,
        daysRemaining
    };

    users[currentUser].push(book);

    displayBooks();
    displayUserLogs();

    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('issue-date').value = '';
    document.getElementById('return-date').value = '';
}

function handleBookActions(e) {
    e.preventDefault();

    if (e.target.parentElement.classList.contains('delete')) {
        if (confirm('Are you sure you want to delete this book?')) {
            const row = e.target.parentElement.parentElement.parentElement;
            const title = row.children[0].textContent;
            users[currentUser] = users[currentUser].filter(book => book.title !== title);
            displayBooks();
            displayUserLogs();
        }
    }

    if (e.target.parentElement.classList.contains('renew')) {
        const row = e.target.parentElement.parentElement.parentElement;
        const title = row.children[0].textContent;
        const book = users[currentUser].find(book => book.title === title);
        const newReturnDate = prompt('Enter new return date (YYYY-MM-DD):', book.returnDate);

        if (newReturnDate) {
            book.returnDate = newReturnDate;
            book.daysRemaining = calculateDaysRemaining(newReturnDate);
            displayBooks();
            displayUserLogs();
        }
    }
}

function calculateDaysRemaining(returnDate) {
    const currentDate = new Date();
    const returnDateObj = new Date(returnDate);
    const timeDiff = returnDateObj.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining;
}

function displayBooks() {
    const list = document.getElementById('book-list').querySelector('tbody');
    list.innerHTML = '';

    users[currentUser].forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.issueDate}</td>
            <td>${book.returnDate}</td>
            <td class="days-remaining">${book.daysRemaining}</td>
            <td>
                <a href="#" class="renew"><i class="fas fa-sync-alt"></i></a>
                <a href="#" class="delete"><i class="fas fa-trash-alt"></i></a>
            </td>
        `;
        list.appendChild(row);
    });
}

function displayUserLogs() {
    const userBooksList = document.getElementById('user-books-list');
    userBooksList.innerHTML = '';

    Object.keys(users).forEach(username => {
        const userBooks = document.createElement('div');
        userBooks.classList.add('user-books');

        const userTitle = document.createElement('h3');
        userTitle.textContent = username;
        userBooks.appendChild(userTitle);

        const bookList = document.createElement('ul');
        users[username].forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = `${book.title} by ${book.author} (Issue Date: ${book.issueDate}, Return Date: ${book.returnDate}, Days Remaining: ${book.daysRemaining})`;
            bookList.appendChild(listItem);
        });

        userBooks.appendChild(bookList);
        userBooksList.appendChild(userBooks);
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear the history for all users?')) {
        Object.keys(users).forEach(username => {
            users[username] = [];
        });
        displayUserLogs();
    }
}

// Display user logs on page load
displayUserLogs();
