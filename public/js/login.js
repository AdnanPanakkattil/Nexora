// Password


function togglePasswordVisibility(passwordId, icon) {
  var passwordField = document.getElementById(passwordId);
  var iconClasses = icon.classList;

  if (passwordField.type === 'password') {
      passwordField.type = 'text';
      iconClasses.add('hidden');
      icon.nextElementSibling.classList.remove('hidden');
      passwordField.placeholder = passwordField.value;
  } else {
      passwordField.type = 'password';
      iconClasses.add('hidden');
      icon.previousElementSibling.classList.remove('hidden');
      passwordField.placeholder = '**********';
  }
}

// loader

function showLoader() {
  document.querySelector('.loader-wrapper').style.display = 'flex';
}
function hideLoader() {
  document.querySelector('.loader-wrapper').style.display = 'none';
}




//login Alert message

// document.addEventListener("DOMContentLoaded", function () {
//     var loginButton = document.getElementById("loginBtn");
//     var loginMessage = document.getElementById("loginMessage");

//     // loginButton.addEventListener("click", function (event) {
//       event.preventDefault();

//       loginMessage.classList.add("show");

//       setTimeout(function () {
//         loginMessage.classList.remove("show");
//       }, 3000);
//     // });
//   });

//   forgot alert message

// document.addEventListener("DOMContentLoaded", function () {
//     var forgotButton = document.getElementById("forgotBtn");
//     var forgotMessage = document.getElementById("forgotMessage");

//     // forgotButton.addEventListener("click", function (event) {
//       event.preventDefault();

//       forgotMessage.classList.add("show");

//       setTimeout(function () {
//         forgotMessage.classList.remove("show");
//       }, 3000);
//     // });
//   });
