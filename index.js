// Database for users and tickets
        const usersDB = JSON.parse(localStorage.getItem('railwayUsers')) || [];
        let currentUser = null;
        let tickets = [];
        
        // DOM Elements
        const authContainer = document.getElementById('authContainer');
        const appContainer = document.getElementById('appContainer');
        const loginBox = document.getElementById('loginBox');
        const signupBox = document.getElementById('signupBox');
        const showSignup = document.getElementById('showSignup');
        const showLogin = document.getElementById('showLogin');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const logoutBtn = document.getElementById('logoutBtn');
        const homeLink = document.getElementById('homeLink');
        const bookTicketLink = document.getElementById('bookTicketLink');
        const myTicketsLink = document.getElementById('myTicketsLink');
        
        // Booking elements
        const bookingForm = document.getElementById('bookingForm');
        const bookingFormSection = document.getElementById('bookingFormSection');
        const paymentSection = document.getElementById('paymentSection');
        const payNowBtn = document.getElementById('payNow');
        const ticketContainer = document.getElementById('ticketContainer');
        const myTicketsSection = document.getElementById('myTickets');
        const ticketList = document.getElementById('ticketList');
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Check if user is already logged in
            checkLogin();
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('journeyDate').value = today;
            
            // Event listeners for auth
            showSignup.addEventListener('click', function() {
                loginBox.style.display = 'none';
                signupBox.style.display = 'block';
                clearFormErrors();
            });
            
            showLogin.addEventListener('click', function() {
                signupBox.style.display = 'none';
                loginBox.style.display = 'block';
                clearFormErrors();
            });
            
            // Password visibility toggle
            document.getElementById('toggleLoginPassword').addEventListener('click', function() {
                togglePasswordVisibility('loginPassword', this);
            });
            
            document.getElementById('toggleSignupPassword').addEventListener('click', function() {
                togglePasswordVisibility('signupPassword', this);
            });
            
            document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
                togglePasswordVisibility('signupConfirmPassword', this);
            });
            
            // Form submissions
            loginForm.addEventListener('submit', handleLogin);
            signupForm.addEventListener('submit', handleSignup);
            bookingForm.addEventListener('submit', showPaymentSection);
            payNowBtn.addEventListener('click', processPayment);
            
            // Navigation
            logoutBtn.addEventListener('click', handleLogout);
            homeLink.addEventListener('click', showHome);
            bookTicketLink.addEventListener('click', showBookingForm);
            myTicketsLink.addEventListener('click', showMyTickets);
        });
        
        // Check if user is logged in
        function checkLogin() {
            const loggedInUser = localStorage.getItem('railwayCurrentUser');
            if (loggedInUser) {
                currentUser = JSON.parse(loggedInUser);
                tickets = currentUser.tickets || [];
                authContainer.style.display = 'none';
                appContainer.style.display = 'block';
                showHome();
            }
        }
        
        // Toggle password visibility
        function togglePasswordVisibility(inputId, icon) {
            const input = document.getElementById(inputId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
        
        // Clear form errors
        function clearFormErrors() {
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
            });
        }
        
        // Form validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }
        
        function validateMobile(mobile) {
            const re = /^\d{10}$/;
            return re.test(mobile);
        }
        
        // Handle login
        function handleLogin(e) {
            e.preventDefault();
            clearFormErrors();
        
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            let isValid = true;
        
            if (!validateEmail(email)) {
                document.getElementById('loginEmailError').style.display = 'block';
                isValid = false;
            }
        
            if (password.length < 6) {
                document.getElementById('loginPasswordError').style.display = 'block';
                isValid = false;
            }
        
            if (isValid) {
                const user = usersDB.find(u => u.email === email && u.password === password);
                if (user) {
                    currentUser = user;
                    tickets = user.tickets || [];
                    localStorage.setItem('railwayCurrentUser', JSON.stringify(user));
                    authContainer.style.display = 'none';
                    appContainer.style.display = 'block';
                    loginForm.reset();
                    showHome();
                } else {
                    alert('Invalid email or password');
                }
            }
        }
        
        // Handle signup
        function handleSignup(e) {
            e.preventDefault();
            clearFormErrors();
        
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const mobile = document.getElementById('signupMobile').value;
            let isValid = true;
        
            if (name.trim() === '') {
                document.getElementById('signupNameError').style.display = 'block';
                isValid = false;
            }
        
            if (!validateEmail(email)) {
                document.getElementById('signupEmailError').style.display = 'block';
                isValid = false;
            }
        
            if (password.length < 6) {
                document.getElementById('signupPasswordError').style.display = 'block';
                isValid = false;
            }
        
            if (password !== confirmPassword) {
                document.getElementById('signupConfirmPasswordError').style.display = 'block';
                isValid = false;
            }
        
            if (!validateMobile(mobile)) {
                document.getElementById('signupMobileError').style.display = 'block';
                isValid = false;
            }
        
            if (isValid) {
                if (usersDB.some(u => u.email === email)) {
                    alert('User with this email already exists');
                    return;
                }
        
                const newUser = {
                    name,
                    email,
                    password,
                    mobile,
                    tickets: []
                };
        
                usersDB.push(newUser);
                localStorage.setItem('railwayUsers', JSON.stringify(usersDB));
                currentUser = newUser;
                tickets = [];
                localStorage.setItem('railwayCurrentUser', JSON.stringify(newUser));
        
                authContainer.style.display = 'none';
                appContainer.style.display = 'block';
                signupForm.reset();
                showHome();
        
                alert('Account created successfully!');
            }
        }
        
        // Show payment section
        function showPaymentSection(e) {
            e.preventDefault();
            bookingFormSection.style.display = 'none';
            paymentSection.style.display = 'block';
            paymentSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Process payment
        function processPayment() {
            const upiId = document.getElementById('upiId').value;
            
            if (!upiId) {
                alert('Please enter UPI ID');
                return;
            }
            
            // Simulate payment processing
            setTimeout(function() {
                generateTicket();
                paymentSection.style.display = 'none';
                ticketContainer.style.display = 'block';
                ticketContainer.scrollIntoView({ behavior: 'smooth' });
                alert('Payment successful! Your ticket has been generated.');
            }, 2000);
        }
        
        // Generate ticket
        function generateTicket() {
            // Get form values
            const fromStation = document.getElementById('fromStation').value;
            const toStation = document.getElementById('toStation').value;
            const journeyDate = document.getElementById('journeyDate').value;
            const passengers = document.getElementById('passengers').value;
            const trainType = document.getElementById('trainType').value;
            const ticketClass = document.getElementById('class').value;
            
            // Generate PNR
            const pnr = 'UTS' + Math.floor(10000000 + Math.random() * 90000000);
            
            // Format dates
            const dateObj = new Date(journeyDate);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-IN', options);
            const bookingDate = new Date().toLocaleDateString('en-IN', options);
            
            // Generate QR code
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${pnr}`;
            
            // Create ticket object
            const newTicket = {
                pnr,
                fromStation,
                toStation,
                journeyDate: formattedDate,
                bookingDate,
                passengers,
                trainType,
                ticketClass,
                qrCodeUrl
            };
            
            // Add to current user's tickets
            if (!currentUser.tickets) {
                currentUser.tickets = [];
            }
            currentUser.tickets.push(newTicket);
            
            // Update database
            const userIndex = usersDB.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                usersDB[userIndex].tickets = currentUser.tickets;
                localStorage.setItem('railwayUsers', JSON.stringify(usersDB));
                localStorage.setItem('railwayCurrentUser', JSON.stringify(currentUser));
            }
            
            // Update ticket display
            updateTicketDisplay(newTicket);
            
            // Update my tickets display
            loadTickets();
        }
        
        // Update ticket display
        function updateTicketDisplay(ticket) {
            document.getElementById('ticketFrom').textContent = `${ticket.fromStation.toUpperCase()} (${getStationCode(ticket.fromStation)})`;
            document.getElementById('ticketTo').textContent = `${ticket.toStation.toUpperCase()} (${getStationCode(ticket.toStation)})`;
            document.getElementById('ticketDate').textContent = ticket.journeyDate;
            document.getElementById('ticketPassengers').textContent = ticket.passengers;
            document.getElementById('ticketTrainType').textContent = ticket.trainType.toUpperCase();
            document.getElementById('ticketClass').textContent = ticket.ticketClass.toUpperCase();
            document.getElementById('ticketPnr').textContent = ticket.pnr;
            document.getElementById('ticketBookingDate').textContent = ticket.bookingDate;
            document.getElementById('ticketQr').src = ticket.qrCodeUrl;
        }
        
        // Helper function to get station codes
        function getStationCode(station) {
            const codes = {
                'delhi': 'NDLS',
                'mumbai': 'CSTM',
                'chennai': 'MAS',
                'kolkata': 'HWH',
                'bangalore': 'SBC',
                'hyderabad': 'HYB',
                'ahmedabad': 'ADI',
                'pune': 'PUNE',
                'jaipur': 'JP',
                'lucknow': 'LKO'
            };
            return codes[station.toLowerCase()] || 'XXXX';
        }
        
        // Load tickets for My Tickets section
        function loadTickets() {
            ticketList.innerHTML = '';
            
            // Get latest user data from localStorage
            const updatedUser = JSON.parse(localStorage.getItem('railwayCurrentUser'));
            if (updatedUser) {
                currentUser = updatedUser;
                tickets = updatedUser.tickets || [];
            }
            
            if (!currentUser || !currentUser.tickets || currentUser.tickets.length === 0) {
                ticketList.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No tickets booked yet.</p>';
                return;
            }
            
            currentUser.tickets.forEach(ticket => {
                const ticketElement = document.createElement('div');
                ticketElement.className = 'ticket-container';
                ticketElement.style.marginBottom = '20px';
                ticketElement.innerHTML = `
                    <div class="ticket-header">
                        <h2>HAPPY JOURNEY</h2>
                        <p>INDIAN RAILWAYS - UNRESERVED TICKET</p>
                    </div>
                    <div class="ticket-body">
                        <div class="ticket-info">
                            <div class="ticket-info-item">
                                <small>FROM</small>
                                <p>${ticket.fromStation.toUpperCase()} (${getStationCode(ticket.fromStation)})</p>
                            </div>
                            <div class="ticket-info-item">
                                <small>TO</small>
                                <p>${ticket.toStation.toUpperCase()} (${getStationCode(ticket.toStation)})</p>
                            </div>
                            <div class="ticket-info-item">
                                <small>DATE</small>
                                <p>${ticket.journeyDate}</p>
                            </div>
                            <div class="ticket-info-item">
                                <small>PNR</small>
                                <p>${ticket.pnr}</p>
                            </div>
                            <div class="ticket-info-item">
                                <small>TRAIN TYPE</small>
                                <p>${ticket.trainType.toUpperCase()}</p>
                            </div>
                            <div class="ticket-info-item">
                                <small>CLASS</small>
                                <p>${ticket.ticketClass.toUpperCase()}</p>
                            </div>
                        </div>
                        <div class="ticket-actions" style="justify-content: center;">
                            <button class="btn btn-orange" onclick="viewTicket('${ticket.pnr}')" style="padding: 8px 15px;">View Ticket</button>
                        </div>
                    </div>
                `;
                ticketList.appendChild(ticketElement);
            });
        }
        
        // View ticket details
        function viewTicket(pnr) {
            const ticket = currentUser.tickets.find(t => t.pnr === pnr);
            if (ticket) {
                updateTicketDisplay(ticket);
                bookingFormSection.style.display = 'none';
                paymentSection.style.display = 'none';
                myTicketsSection.style.display = 'none';
                ticketContainer.style.display = 'block';
                ticketContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Print ticket
        function printTicket() {
            const printContent = document.getElementById('ticketContainer').innerHTML;
            const originalContent = document.body.innerHTML;
            
            document.body.innerHTML = `
                <style>
                    @media print {
                        @page { size: auto; margin: 0mm; }
                        body { margin: 10mm; }
                        button { display: none !important; }
                    }
                    .ticket-container { 
                        border: 2px solid #000 !important; 
                        max-width: 100% !important;
                        margin: 0 !important;
                    }
                </style>
                ${printContent}
            `;
            window.print();
            document.body.innerHTML = originalContent;
        }
        
        // Save ticket
        function saveTicket() {
            const ticketData = {
                from: document.getElementById('ticketFrom').textContent,
                to: document.getElementById('ticketTo').textContent,
                date: document.getElementById('ticketDate').textContent,
                pnr: document.getElementById('ticketPnr').textContent,
                qrCode: document.getElementById('ticketQr').src
            };
            
            // Save to localStorage
            const savedTickets = JSON.parse(localStorage.getItem('savedTickets')) || [];
            savedTickets.push(ticketData);
            localStorage.setItem('savedTickets', JSON.stringify(savedTickets));
            
            alert('Ticket saved to your device');
        }
        
        // Show My Tickets
        function showMyTickets(e) {
            e.preventDefault();
            bookingFormSection.style.display = 'none';
            paymentSection.style.display = 'none';
            ticketContainer.style.display = 'none';
            myTicketsSection.style.display = 'block';
            
            // Refresh tickets from localStorage
            const updatedUser = JSON.parse(localStorage.getItem('railwayCurrentUser'));
            if (updatedUser) {
                currentUser = updatedUser;
                tickets = updatedUser.tickets || [];
            }
            
            loadTickets();
            myTicketsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Navigation functions
        function showHome() {
            bookingFormSection.style.display = 'block';
            paymentSection.style.display = 'none';
            ticketContainer.style.display = 'none';
            myTicketsSection.style.display = 'none';
            bookingForm.reset();
        }
        
        function showBookingForm() {
            bookingFormSection.style.display = 'block';
            paymentSection.style.display = 'none';
            ticketContainer.style.display = 'none';
            myTicketsSection.style.display = 'none';
            bookingFormSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Handle logout
        function handleLogout() {
            currentUser = null;
            tickets = [];
            localStorage.removeItem('railwayCurrentUser');
            authContainer.style.display = 'flex';
            appContainer.style.display = 'none';
            loginBox.style.display = 'block';
            signupBox.style.display = 'none';
            document.getElementById('loginForm').reset();
            document.getElementById('signupForm').reset();
            document.getElementById('bookingForm').reset();
        }