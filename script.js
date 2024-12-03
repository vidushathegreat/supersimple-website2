
function showSidebar(){
    const sidebar =document.querySelector('.sidebar')
    sidebar.style.display = 'flex' 
}
function hideSidebar(){
    const sidebar =document.querySelector('.sidebar')
    sidebar.style.display = 'none' 
}

AOS.init({
    duration: 1000,
    once: true
});

document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will contact you soon.');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
document.getElementById('bookingForm').addEventListener('submit', async function (e) {
e.preventDefault();

const formData = new FormData(this);

const response = await fetch('process-form.php', {
method: 'POST',
body: formData,
});

const result = await response.json();

if (result.status === "success") {
alert(result.message);
this.reset(); // Reset the form
} else {
alert(result.message);
}
});
document.getElementById('reviewForm').addEventListener('submit', function(e) {
e.preventDefault();

const name = document.getElementById('name').value;
const review = document.getElementById('review').value;

// Create a new review element
const reviewList = document.getElementById('review-list');
const newReview = document.createElement('div');
newReview.classList.add('review-item');
newReview.innerHTML = `
<h4>${name}</h4>
<p>${review}</p>
`;

// Append the new review
reviewList.appendChild(newReview);

// Reset the form
this.reset();
});
