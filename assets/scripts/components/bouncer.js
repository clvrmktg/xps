
var bouncer = new Bouncer('[data-validate]', {
	disableSubmit: true  // Prevent submission until validation passes
});

// Manually trigger validation
console.log('Before validation');
bouncer.validate();  // Manually trigger form validation for testing

// Check if the form is valid
if (bouncer.isValid()) {
	console.log('Form is valid');
} else {
	console.log('Form is invalid');
}

// Listen for validation events
document.addEventListener("DOMContentLoaded", function () {
	var bouncer = new Bouncer("[data-validate]", {
		disableSubmit: true, // Prevents submission if invalid
		emitEvents: true
	});

	document.querySelector("[data-validate]").addEventListener("bouncerFormValid", function (event) {
		let form = event.target;
		
		// Check if Netlify reCAPTCHA exists
		if (form.querySelector('[data-netlify-recaptcha]')) {
			return; // Do NOT auto-submit, let Netlify handle it
		}

		form.submit(); // If no reCAPTCHA, submit normally
	});
});