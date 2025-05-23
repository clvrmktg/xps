let timeOfDay = document.getElementById('timeOfDay');
let today = new Date();
let hourNow = today.getHours();
let greeting; // Undefined 

if (hourNow > 18) {
  greeting = 'evening';
} else if (hourNow > 12) {
  greeting = 'afternoon';
} else if (hourNow > 0) {
  greeting = 'morning';
} else {
  greeting = 'day';
}

timeOfDay.innerHTML = greeting;


let seconds = 6;
    
    function countdown() {
        seconds = seconds - 1;
        if (seconds < 0) {
            // Chnage your redirection link here
            window.location = "/";
        } else {
            // Update remaining seconds
            document.getElementById("countdown").innerHTML = seconds;
            // Count down using javascript
            window.setTimeout("countdown()", 1000);
        }
    }
    
    // Run countdown function
    countdown();