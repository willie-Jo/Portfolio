/*******************************************************
 * Compound-Interest
 * Author: William Adejoh
 * Description:
 *   Validates with alert(), calculates compound 
 *   interest year by year and 
 *   renders the result into an HTML table.
 *   Uses DOM manipulation and modern JS methods.
 *******************************************************/

// Grab DOM elements
const form = document.getElementById('interestForm');
const resultContainer = document.getElementById('result-container');
const resultBody = document.querySelector('#result tbody');   // gets <tbody> inside #result
const resetBtn = document.getElementById('resetBtn');
let growthChart = null;    // store chart instance

const formatCurrency = (num) =>   // Helper function to format numbers as USD currency
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);  //built-in JS object for formatting

// clear red borders
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// This function validates the form
function validateForm() {
    clearErrors();
    const deposit = document.getElementById('deposit');
    const rate = document.getElementById('rate');
    const years = document.getElementById('years');

    if(deposit.value === '' || deposit.value <= 0) {
        deposit.classList.add('error');   // add red border
        alert('Error: Initial Deposit must be greater than 0');
        deposit.focus();  
        return false;
    }
    if(rate.value === '' || rate.value <= 0 || rate.value > 100) {
        rate.classList.add('error');   // add red border
        alert('Error: Annual Rate must be between 0.1 and 100%');
        rate.focus();  
        return false;
    }
    if(years.value === '' || years.value < 1 || years.value > 50) {
        years.classList.add('error');   // add red border
        alert('Error: Years must be between 1 and 50');
        years.focus();  
        return false;
    }
    return true;   // all good
}

// Event listener runs when form is submitted
form.addEventListener('submit', (e) => { 
	e.preventDefault();    // stops page from reloading
	if(validateForm()){
        generateTable();
    }
});

// Event listener clears table and resets form
resetBtn.addEventListener('click', () => {
    clearErrors();
	resultContainer.classList.add('hidden');  // hides results section
	resultBody.innerHTML = '';     // clear all table rows
	form.reset();      //resets form inputs to empty
    if(growthChart) growthChart.destroy();  // destroy old chart
});

// generateTable function reads inputs, calculates compound interest
function generateTable() {
	const deposit = parseFloat(document.getElementById('deposit').value);
	const rate = parseFloat(document.getElementById('rate').value);
	const years = parseInt(document.getElementById('years').value);

	resultBody.innerHTML = '';    // clear previous results before generating new ones
	let amount = deposit;       // starting amount

    // Arrays for chart
    const labels = [];
    const data = [];

	for(let year = 1; year <= years; year++) {
		const startingValue = amount;     // value at start of year
		const interest = startingValue * (rate / 100);  // interest earned this year
		amount += interest;    // add interest to get ending value

        // create a new table row
		const row = `
			<tr>
				<td>${year}</td>
				<td>${formatCurrency(startingValue)}</td>
				<td>${formatCurrency(interest)}</td>
				<td><strong>${formatCurrency(amount)}</strong></td>
			</tr>
		`;
		resultBody.insertAdjacentHTML('beforeend', row);    // add row to end of tbody

        // push data for chart
        labels.push(`Year ${year}`);
        data.push(amount.toFixed(2));
	}

	resultContainer.classList.remove('hidden');   // show the results
    drawChart(labels, data);
}

// Chart function
function drawChart(labels, data) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    if(growthChart) growthChart.destroy();  // prevent duplicate charts

    growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Account Growth',
                data: data,
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {labels: {color: '#e2e8f0'}}
            },
            scales: {
                x: {ticks: {color: '#94a3b8'}},
                y: {ticks: {color: '#94a3b8'}}
            }
        }
    });
}