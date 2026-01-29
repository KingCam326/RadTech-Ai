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
        // If we've flagged to allow a native submit (fallback), let it proceed
        if (form.dataset.allowNativeSubmit === 'true') return;

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
                // If Formspree complains about AJAX/reCAPTCHA, fallback to a native submit (page reload)
                const errStr = (data && data.error) ? data.error : text;
                if (response.status === 403 && errStr && errStr.indexOf('custom key') !== -1 || (errStr && errStr.indexOf('reCAPTCHA') !== -1)) {
                    const useNative = confirm('Formspree blocks AJAX submissions for this form (reCAPTCHA/custom key). Submit using a standard page POST instead (the page will reload)?');
                    if (useNative) {
                        // allow native submit and retry
                        form.dataset.allowNativeSubmit = 'true';
                        form.submit();
                        return;
                    } else {
                        alert('Form not submitted. Please adjust your Formspree settings (disable reCAPTCHA for this form or set a custom AJAX key) and try again.');
                    }
                } else if (response.status === 403) {
                    alert('Form submission rejected (403). Check your Formspree form settings and email verification.');
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