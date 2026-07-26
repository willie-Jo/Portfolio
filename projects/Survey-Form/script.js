/* 
  File: script.js
  Description: Handles form validation for survey form project.
  Checks for required fields, valid email, and shows success message
*/

document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('survey-form');

    // this function runs when form is submitted
    form.addEventListener('submit', (e)=>{
        e.preventDefault();   //stop form submitting to a server

        // get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const source = document.getElementById('source').value;

        let isValid = true;
        let errorMessage = '';

        // Validate name
        if(name === ''){
            isValid = false;
            errorMessage += 'Please enter your name. \n';
        }

        // Validate email
        if(email === ''){
            isValid = false;
            errorMessage += 'Please enter your email. \n';
        } else if(!email.includes('@') || !email.includes('.')){
            isValid = false;
            errorMessage += 'Please enter a valid email address. \n';
        }

        // Validate dropdown: must select an option
        if(source === ''){
            isValid = false;
            errorMessage += 'Please select how you found my portfolio. \n';
        }

        // if everything is valid
        if(isValid){
            alert('Thank you for your feedback!');
            form.reset(); // clears the form
        } else{
            alert('Please fix the following: \n\n' + errorMessage);
        }
    });
});