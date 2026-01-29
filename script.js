document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(async response => {
            const text = await response.text();
            let data = null;
            try { data = JSON.parse(text); } catch (err) { /* not JSON */ }

            if (response.ok) {
                alert('Thank you for your message. I\'ll get back to you soon!');
                form.reset();
            } else {
                console.error('Form submission error:', response.status, data || text);
                if (response.status === 403) {
                    alert('Form submission rejected (403). Please verify your Formspree form is active and your email is verified in the Formspree dashboard.');
                } else {
                    const message = (data && data.error) ? data.error : 'There was a problem submitting your form. Please try again.';
                    alert('Oops! ' + message);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Oops! There was a problem submitting your form. Please try again.');
        });
    });

    // You can add more JavaScript functionality here as needed
});