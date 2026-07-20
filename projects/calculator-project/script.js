const result = document.getElementById('result');    // input box to display calculation
const history = document.getElementById('history');  // displays calculation history
const buttons = document.querySelectorAll('.btn');   // retrieves all buttons at once
const themeBtn = document.getElementById('themeBtn'); // retrieves toggle button
let historyList = [];   // Empty array to store last 3 calculations

buttons.forEach(btn => {        // forEach loops through every button
  btn.addEventListener('click', () => {     // listens for button clicks
    const value = btn.dataset.value;     // gets clicked data-value

    if(value === 'C'){result.value = '';}    // clears the display
    else if(value === 'DEL'){
      result.value = result.value.slice(0, -1);  // delete last character
    }
    else if(value === '=') {   //equal button does the calculation
      try {
        const calc = eval(result.value);    // eval() calculates
        addToHistory(`${result.value} = ${calc}`);   // calls addToHistory function(hoisted)
        result.value = calc;      // show answer in display
      } catch { result.value = 'Error'; }  //catches an eror and show on display
    }
    else {result.value += value;} // displays characters on screen
  });
});

// This function stores calculation to the historyList array
function addToHistory(item) {    
  historyList.unshift(item);      // adds new calc to the start of array
  if(historyList.length > 3) historyList.pop();    // remove the oldest item stored if they are more than 3
  history.innerText = historyList[0] || ''; // only show the most recent one on screen
}

// Keyboard support
document.addEventListener('keydown', e => {      // listens for keydown event
  if(e.key === 'Enter'){     // checks for keydown = Enter key
    document.querySelector('.equals').click();
  }   
  if(!isNaN(e.key) || ['+','-','*','/','.','%'].includes(e.key)){result.value += e.key;}
  if(e.key === 'Backspace'){result.value = result.value.slice(0, -1);}  // Backspace = delete
});

// Dark/Light Toggle
themeBtn.onclick = () => {
  document.body.classList.toggle('dark');
  themeBtn.innerText = document.body.classList.contains('dark')? '☀️' : '🌙';
}