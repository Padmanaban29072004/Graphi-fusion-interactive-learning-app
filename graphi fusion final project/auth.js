// Add this at the top of your file to test the connection
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('User is signed in:', user);
    } else {
        console.log('No user is signed in');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize floating elements
    initFloatingElements();
    
    // Initialize form interactions
    initFormInteractions();
    
    // Initialize progress bar
    initProgressBar();
    
    // Get the current page
    const isLoginPage = window.location.href.includes('login.html');
    
    // Initialize the appropriate form
    if (isLoginPage) {
        initLoginForm();
    } else {
        initSignupForm();
    }
});

function initFloatingElements() {
    const floatItems = document.querySelectorAll('.float-item');
    
    floatItems.forEach((item, index) => {
        // Random initial position
        item.style.left = `${Math.random() * 80 + 10}%`;
        item.style.top = `${Math.random() * 80 + 10}%`;
        
        // Different animation delays
        item.style.animationDelay = `${index * 0.5}s`;
        
        // Different speeds based on data-speed attribute
        const speed = item.getAttribute('data-speed');
        item.style.animationDuration = `${4 - speed}s`;
    });
}

function initFormInteractions() {
    const form = document.querySelector('.auth-form');
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Power bar animation on focus
        input.addEventListener('focus', () => {
            const powerBar = input.nextElementSibling;
            powerBar.style.width = '100%';
        });
        
        input.addEventListener('blur', () => {
            const powerBar = input.nextElementSibling;
            powerBar.style.width = input.value ? '100%' : '0';
        });
        
        // Password strength indicator
        if (input.type === 'password') {
            input.addEventListener('input', updatePasswordStrength);
        }
    });
    
    form.addEventListener('submit', handleSubmit);
}

function updatePasswordStrength(e) {
    const password = e.target.value;
    const strengthIndicator = document.querySelector('.password-strength');
    
    if (!strengthIndicator) return;
    
    let strength = 0;
    let feedback = '';
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Uppercase check
    if (password.match(/[A-Z]/)) strength += 25;
    
    // Lowercase check
    if (password.match(/[a-z]/)) strength += 25;
    
    // Number/Special char check
    if (password.match(/[0-9]/) || password.match(/[^A-Za-z0-9]/)) strength += 25;
    
    // Update feedback
    if (strength <= 25) feedback = 'Weak';
    else if (strength <= 50) feedback = 'Medium';
    else if (strength <= 75) feedback = 'Strong';
    else feedback = 'Very Strong';
    
    strengthIndicator.textContent = feedback;
    strengthIndicator.style.color = `hsl(${strength}, 100%, 50%)`;
}

function initProgressBar() {
    const progressBar = document.querySelector('.progress');
    let progress = 0;
    
    // Simulate progress
    const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 20);
}

function handleSubmit(e) {
    e.preventDefault();
    
    // Add submission animation
    const btn = e.target.querySelector('.submit-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Simulate API call
    setTimeout(() => {
        // Success animation
        btn.innerHTML = '<i class="fas fa-check"></i> Success!';
        btn.style.background = 'linear-gradient(135deg, #00ff9d, #00ff9d)';
        
        // Redirect after success
        setTimeout(() => {
            window.location.href = 'courses.html';
        }, 1000);
    }, 2000);
}

// Add parallax effect to floating elements
document.addEventListener('mousemove', (e) => {
    const floatItems = document.querySelectorAll('.float-item');
    
    floatItems.forEach(item => {
        const speed = item.getAttribute('data-speed');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        
        item.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
}); 

function initLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = form.querySelector('.submit-btn');
        
        try {
            // Show loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Attempt to sign in
            await firebase.auth().signInWithEmailAndPassword(email, password);
            
            // Show success
            btn.innerHTML = '<i class="fas fa-check"></i> Success!';
            btn.style.background = 'linear-gradient(135deg, #00ff9d, #00ff9d)';
            
            // Store user session
            const user = firebase.auth().currentUser;
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email
            }));
            
            // Redirect to courses page
            setTimeout(() => {
                window.location.href = 'courses.html';
            }, 1000);
            
        } catch (error) {
            // Show error
            btn.innerHTML = '<i class="fas fa-times"></i> Error';
            btn.style.background = 'linear-gradient(135deg, #ff5252, #ff1a1a)';
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = getErrorMessage(error.code);
            form.appendChild(errorMessage);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                btn.innerHTML = '<span>Enter Portal</span><i class="fas fa-arrow-right"></i>';
                btn.style.background = 'linear-gradient(135deg, #00ffc8, #00a8ff)';
                if (errorMessage) errorMessage.remove();
            }, 2000);
        }
    });
}

function initSignupForm() {
    const form = document.getElementById('signupForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;
        const btn = form.querySelector('.submit-btn');
        
        try {
            // Show loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Create user in Authentication
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Update profile with username
            await user.updateProfile({
                displayName: username
            });

            // Save user data to Firestore
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                username: username,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                progress: {
                    level: 1,
                    xp: 0,
                    completedCourses: [],
                    activeCourses: []
                }
            });
            
            // Show success
            btn.innerHTML = '<i class="fas fa-check"></i> Success!';
            btn.style.background = 'linear-gradient(135deg, #00ff9d, #00ff9d)';
            
            // Store user session
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                username: username
            }));
            
            // Redirect to courses page
            setTimeout(() => {
                window.location.href = 'courses.html';
            }, 1000);
            
        } catch (error) {
            console.error('Signup error:', error);
            
            // Show error
            btn.innerHTML = '<i class="fas fa-times"></i> Error';
            btn.style.background = 'linear-gradient(135deg, #ff5252, #ff1a1a)';
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = getErrorMessage(error.code);
            form.appendChild(errorMessage);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                btn.innerHTML = '<span>Create Character</span><i class="fas fa-plus-circle"></i>';
                btn.style.background = 'linear-gradient(135deg, #00ffc8, #00a8ff)';
                if (errorMessage) errorMessage.remove();
            }, 2000);
        }
    });
}

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        default:
            return 'An error occurred. Please try again.';
    }
}

// Add this style to auth-style.css
const style = document.createElement('style');
style.textContent = `
    .error-message {
        color: #ff5252;
        text-align: center;
        margin-top: 1rem;
        padding: 0.5rem;
        background: rgba(255, 82, 82, 0.1);
        border-radius: 8px;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style); 

// Add this function to verify the saved data
async function checkUserData(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            console.log('User data saved successfully:', userDoc.data());
            return true;
        } else {
            console.error('User document not found');
            return false;
        }
    } catch (error) {
        console.error('Error checking user data:', error);
        return false;
    }
} 