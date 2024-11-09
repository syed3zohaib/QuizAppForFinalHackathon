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

function signUp() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    Swal.fire({
      title: "Password Mismatch",
      text: "The passwords do not match. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "signup.html";
    });
    return;
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      firebase
        .database()
        .ref("tasks/" + user.uid)
        .set({});

      Swal.fire({
        title: "Signup Successful!",
        text: "Welcome to the To-Do app!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "home.html";
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "Signup Failed!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "home.html";
  }
});
