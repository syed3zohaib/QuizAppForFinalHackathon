// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_b8WDU2LVW217FacVvz14exsJZSu44Xk",
  authDomain: "quizappforjsp.firebaseapp.com",
  projectId: "quizappforjsp",
  storageBucket: "quizappforjsp.firebasestorage.app",
  messagingSenderId: "420639255404",
  appId: "1:420639255404:web:0ba9d588f9fd632fb7e149",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = "home.html";
    })
    .catch((error) => {
      console.error("Error logging in:", error.message);
      Swal.fire({
        title: "Login Failed",
        text: "wrong",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "home.html";
  }
});

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });
