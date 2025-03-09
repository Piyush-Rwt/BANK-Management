// Function to generate a random 6-digit PNR number
function generatePNR() {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
}

// Function to book a ticket
function bookTicket() {
    let name = document.getElementById("name").value;
    let train = document.getElementById("train").value;

    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    let pnr = generatePNR(); // Generate a new PNR

    // Store booking details in localStorage
    localStorage.setItem("passengerName", name);
    localStorage.setItem("trainName", train);
    localStorage.setItem("pnrNumber", pnr);

    // Redirect to confirmation page
    window.location.href = "confirmation.html";
}

// Function to check PNR status
function checkPNR() {
    let enteredPNR = document.getElementById("pnr").value;
    let storedPNR = localStorage.getItem("pnrNumber");

    if (enteredPNR === storedPNR) {
        // Show booking details if PNR matches
        document.getElementById("pnrPassenger").innerText = localStorage.getItem("passengerName");
        document.getElementById("pnrTrain").innerText = localStorage.getItem("trainName");
        document.getElementById("pnrDetails").style.display = "block";
    } else {
        alert("PNR not found!");
    }
}
