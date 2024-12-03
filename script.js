// Check for page reload
function checkReload() {
    // Check if page is actually reloaded, not just navigated to
    if (performance.navigation.type === 1) {
        // Create welcome message container
        const welcomeOverlay = document.createElement('div');
        welcomeOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #4158D0, #C850C0);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        // Create message content
        const messageContent = document.createElement('div');
        messageContent.style.cssText = `
            text-align: center;
            color: white;
            transform: translateY(20px);
            transition: transform 0.5s ease;
        `;

        // Add logo
        const logo = document.createElement('img');
        logo.src = 'logo.png';
        logo.alt = 'Ceylon Vidu Tours Logo';
        logo.style.cssText = `
            width: 200px;
            margin-bottom: 20px;
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;

        // Add welcome text
        const welcomeText = document.createElement('h1');
        welcomeText.textContent = 'Welcome Back to Ceylon Vidu Tours';
        welcomeText.style.cssText = `
            font-size: 2.5rem;
            margin-bottom: 15px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;

        const subText = document.createElement('p');
        subText.textContent = 'Discover the Magic of Sri Lanka';
        subText.style.cssText = `
            font-size: 1.2rem;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;

        // Append elements
        messageContent.appendChild(logo);
        messageContent.appendChild(welcomeText);
        messageContent.appendChild(subText);
        welcomeOverlay.appendChild(messageContent);
        document.body.appendChild(welcomeOverlay);

        // Prevent scrolling
        document.body.style.overflow = 'hidden';

        // Trigger animations
        requestAnimationFrame(() => {
            welcomeOverlay.style.opacity = '1';
            messageContent.style.transform = 'translateY(0)';
            
            // Sequence the animations
            setTimeout(() => {
                logo.style.opacity = '1';
                logo.style.transform = 'scale(1)';
            }, 100);

            setTimeout(() => {
                welcomeText.style.opacity = '1';
                welcomeText.style.transform = 'translateY(0)';
            }, 300);

            setTimeout(() => {
                subText.style.opacity = '1';
                subText.style.transform = 'translateY(0)';
            }, 500);

            // Remove welcome message
            setTimeout(() => {
                welcomeOverlay.style.opacity = '0';
                messageContent.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    document.body.removeChild(welcomeOverlay);
                    document.body.style.overflow = '';
                }, 500);
            }, 2500);
        });
    }
}

// Add event listener for page load
window.addEventListener('load', checkReload);

// Store the fact that we've loaded the page
if (!sessionStorage.getItem('pageLoaded')) {
    sessionStorage.setItem('pageLoaded', 'true');
    checkReload();
}

// Initialize AOS (Animate On Scroll) with more options
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out',
    delay: 100,
    mirror: true
});

// Sidebar functionality with transitions
function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
    // Allow transition to take effect
    setTimeout(() => {
        sidebar.style.opacity = '1';
        sidebar.style.transform = 'translateX(0)';
    }, 10);
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.opacity = '0';
    sidebar.style.transform = 'translateX(-100%)';
    // Wait for transition to complete before hiding
    setTimeout(() => {
        sidebar.style.display = 'none';
    }, 300);
}

// Add necessary styles for sidebar transitions
const style = document.createElement('style');
style.textContent = `
    .sidebar {
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateX(-100%);
    }
`;
document.head.appendChild(style);

// Enhanced smooth scroll with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            // Easing function
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }
    });
});

// Enhanced booking form with loading animation
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    try {
        // Add loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Sending...';

        const formData = new FormData(form);
        const response = await fetch('process-form.php', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        // Animate success/error message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${result.status}`;
        messageDiv.textContent = result.message;
        messageDiv.style.animation = 'slideDown 0.5s ease-out';

        form.appendChild(messageDiv);

        if (result.status === "success") {
            form.reset();
            // Fade out message after 5 seconds
            setTimeout(() => {
                messageDiv.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => messageDiv.remove(), 500);
            }, 5000);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// Enhanced review form with animations
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const review = document.getElementById('review').value.trim();
    
    if (!name || !review) {
        alert('Please fill in all fields');
        return;
    }

    // Create a new review element with animation
    const reviewList = document.getElementById('review-list');
    const newReview = document.createElement('div');
    newReview.classList.add('review-item');
    newReview.style.opacity = '0';
    newReview.style.transform = 'translateY(20px)';
    newReview.innerHTML = `
        <h4>${name}</h4>
        <p>${review}</p>
    `;

    // Add to DOM and animate
    reviewList.insertBefore(newReview, reviewList.firstChild);
    
    // Trigger animation
    requestAnimationFrame(() => {
        newReview.style.transition = 'all 0.5s ease-out';
        newReview.style.opacity = '1';
        newReview.style.transform = 'translateY(0)';
    });

    // Reset form with animation
    this.reset();
    this.style.animation = 'shake 0.5s ease-out';
    setTimeout(() => {
        this.style.animation = '';
    }, 500);
});

// Add necessary CSS animations
const animations = document.createElement('style');
animations.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .form-message {
        padding: 10px;
        margin-top: 10px;
        border-radius: 4px;
    }

    .form-message.success {
        background-color: #d4edda;
        color: #155724;
    }

    .form-message.error {
        background-color: #f8d7da;
        color: #721c24;
    }

    .review-item {
        transition: all 0.3s ease-out;
    }
`;
document.head.appendChild(animations);
