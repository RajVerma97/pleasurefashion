
var uploadImage = document.querySelector('.upload__image');
var uploadContainer = document.querySelector('.upload__container');
var uploadText = document.querySelector('.upload__text');
var signupForm = document.getElementById('signup-form');
var emailInput = document.getElementById('emailInput');
var usernameInput = document.getElementById('usernameInput');
var fileInput = document.getElementById('fileInput');
var passwordInput = document.getElementById('passwordInput');
var errorList = document.querySelector('.error__list');
var errors = [];

function preview() {

    uploadImage.src = URL.createObjectURL(event.target.files[0]);

    var fileSizeBytes = fileInput.files.item(0).size;
    var fileSizeKb = fileSizeBytes / 1024;

    if (fileSizeKb > 1024) {
        errors.push('profile image size should be less than 1mb');
    }

}


function setValidFor(input) {
    input.classList.add('valid');

}
function setInvalidFor(input) {
    input.classList.add('invalid');
}

function validateEmail(email) {

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


signupForm.addEventListener('submit', (e) => {


    let email = emailInput.value;
    let username = usernameInput.value;
    let password = passwordInput.value;


    let user = {
        email,
        username,
        password

    }
    console.log(user);

    //if a profileIMage is not entered
    if (fileInput.files.length === 0) {

        errors.push('please upload a profile image');


    }


    //if an email is not  entered

    if (email.length === 0) {
        setInvalidFor(emailInput);
        errors.push('email can\'t be blank');

    }
    else {
        if (validateEmail(email)) {
            setValidFor(emailInput);

        }
        else {
            setInvalidFor(emailInput);
            errors.push('please enter an valid email');

        }

    }

    // //if a username is not entered
    if (username.length === 0) {
        setInvalidFor(usernameInput);

        errors.push('username can\'t be blank');

    }
    else {
        setValidFor(usernameInput);

    }

    //if a password of length bw 5 and 10 is not entered

    if (password.length === 0) {
        setInvalidFor(passwordInput);
        errors.push('password can\'t be blank');




    }
    else {
        if (password.length >= 5 && password.length <= 10) {

            setValidFor(passwordInput);

        }
        else {
            setInvalidFor(passwordInput);
            errors.push('password should be of length bw 5 and 10');

        }

    }


    if (errors.length > 0) {

        e.preventDefault();
        errorList.innerHTML = '';

        errors.forEach(error => {
            var li = document.createElement('li');
            li.textContent = error;
            li.classList.add('error__item');

            errorList.appendChild(li);

        });

        errors = [];

    }


});
