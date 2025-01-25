$(document).ready(function() {
    // Define columns and initial data
    const tableConfig = {
        columns: [
            { title: "Home Price" },
            { title: "Loan Amount"},
            { title: "Down Payment" },
            { title: "Monthly Property Tax" },
            { title: "PMI" },
            { title: "Monthly Payment" },
            { title: "Remaining Monthly Funds"}
        ],
        data: [],
        responsive: true, // Enable responsiveness
        scrollX: true // Enable horizontal scrolling if necessary
    };
    
    const table = $('#resultsTable').DataTable(tableConfig);
    
    //Not currently used
    function calculateElegablePionts(homePrice, sellersCredits){
        let costPerPoint = homePrice * 0.01;
        let elegablePoints = Math.trunc(sellersCredits / costPerPoint);
        let remainingFunds = sellersCredits - (costPerPoint * elegablePoints);
        return {elegablePoints: elegablePoints, remainingFunds: remainingFunds};
    }

    function calculatePMI(homePrice, annualPMIPercentage){
        let monthlyPMI = (homePrice * annualPMIPercentage)/12; // Convert annual percentage to monthly
        return monthlyPMI;
    }

    document.getElementById("calculate").onclick = function() {
        // Retrieve and convert input values to numbers
        let homePrice = parseFloat(document.getElementById("homePrice").value);
        let percentDown = parseFloat(document.getElementById("percentDown").value) / 100;
        let annualInterestrate = parseFloat(document.getElementById("annualInterestrate").value) / 100;
        let loantermYears = parseFloat(document.getElementById("loantermYears").value);
        let propertyTaxRate = parseFloat(document.getElementById("propertyTaxRate").value) / 100;
        let other = parseFloat(document.getElementById("other").value);
        let availableMonthlyFunds = parseFloat(document.getElementById("availableMonthlyFunds").value);
        
        // Calculate monthly interest rate and total number of payments
        let interestrate = annualInterestrate / 12;
        let loanterm = loantermYears * 12;
        let loanamount = homePrice - (homePrice * percentDown);
        let monthlyPropertyTax = homePrice * (propertyTaxRate / 12);
        let pmi = percentDown <.2 ? calculatePMI(loanamount, 0.00308) : 0;
        let monthlypayment;
        if (interestrate === 0) {
            // Handle case where interest rate is 0
            monthlypayment = loanamount / loanterm;
        } else {
            // Calculate monthly payment using the correct formula
            monthlypayment = (loanamount * interestrate) / (1 - Math.pow(1 + interestrate, -loanterm));
        }

        // Update the DataTable with new data
        table.clear().draw(); // Clear existing data
        table.row.add([
            homePrice.toFixed(2),
            loanamount.toFixed(2),
            (homePrice * percentDown).toFixed(2),
            monthlyPropertyTax.toFixed(2),
            pmi.toFixed(2),
            (monthlypayment + monthlyPropertyTax + other + pmi).toFixed(2), 
            ((availableMonthlyFunds) - (monthlypayment + monthlyPropertyTax + other + pmi)).toFixed(2)
        ]).draw();
    };
});