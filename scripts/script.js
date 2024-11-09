var firebaseConfig = {
  apiKey: "AIzaSyB_b8WDU2LVW217FacVvz14exsJZSu44Xk",
  authDomain: "quizappforjsp.firebaseapp.com",
  projectId: "quizappforjsp",
  storageBucket: "quizappforjsp.appspot.com",
  messagingSenderId: "420639255404",
  appId: "1:420639255404:web:0ba9d588f9fd632fb7e149",
  databaseURL: "https://quizappforjsp-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.database();

var questions = [
  {
    question: "Q1: What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Transfer Markup Language",
    ],
    answer: "Hyper Text Markup Language",
  },
  {
    question: "Q2: Which HTML tag is used to define an unordered list?",
    options: ["<ul>", "<ol>", "<li>", "<dl>"],
    answer: "<ul>",
  },
  {
    question: "Q3: Which CSS property is used to change the background color?",
    options: ["color", "bgcolor", "background-color", "background"],
    answer: "background-color",
  },
  {
    question:
      "Q4: Which JavaScript method is used to select an element by its ID?",
    options: [
      "getElementById()",
      "querySelector()",
      "getElement()",
      "getById()",
    ],
    answer: "getElementById()",
  },
  {
    question: "Q5: What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Colorful Style Sheets",
      "Creative Style Sheets",
      "Computer Style Sheets",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question: "Q6: Which symbol is used to select an ID in CSS?",
    options: ["#", ".", "@", "*"],
    answer: "#",
  },
  {
    question:
      "Q7: In JavaScript, which of the following is used to declare a variable?",
    options: ["var", "let", "const", "All of the above"],
    answer: "All of the above",
  },
  {
    question: "Q8: Which HTML attribute is used to define inline styles?",
    options: ["style", "class", "id", "font"],
    answer: "style",
  },
  {
    question: "Q9: Which JavaScript keyword is used to define a function?",
    options: ["def", "function", "method", "func"],
    answer: "function",
  },
  {
    question: "Q10: Which CSS property controls the text size?",
    options: ["font-size", "text-style", "text-size", "font-weight"],
    answer: "font-size",
  },
];

var currentQuestionIndex = 0;
var score = 0;
var timer;
var timeLeft = 30;

var quizElement = document.getElementById("quiz");
var nextButton = document.getElementById("nextButton");
var timerElement = document.getElementById("time");
var finalScoreElement = document.getElementById("finalScore");
var restartButton = document.getElementById("restartButton");
var hasAnswered = false;

function startTimer() {
  timer = setInterval(function () {
    timeLeft--;
    timerElement.textContent = "Time Left: " + timeLeft + " seconds";
    if (timeLeft <= 0) {
      clearInterval(timer);
      hideQuestion();
      showFinalScore();
    }
  }, 1000);
}

function showQuestion() {
  hasAnswered = false;
  var question = questions[currentQuestionIndex];
  quizElement.innerHTML = "<div class='question'>" + question.question + "</div>";

  var optionsList = document.createElement("ul");
  optionsList.classList.add("options");

  question.options.forEach(function (option) {
    var listItem = document.createElement("li");
    listItem.textContent = option;
    listItem.onclick = function () {
      if (!hasAnswered) {
        checkAnswer(option, listItem);
        hasAnswered = true;
      }
    };
    optionsList.appendChild(listItem);
  });

  quizElement.appendChild(optionsList);
}

function hideQuestion() {
  quizElement.innerHTML = "";
}

function checkAnswer(selectedAnswer, selectedElement) {
  var correctAnswer = questions[currentQuestionIndex].answer;
  var allOptions = document.querySelectorAll(".options li");
  allOptions.forEach(function (option) {
    option.classList.remove("borderop");
  });

  selectedElement.classList.add("borderop");

  if (selectedAnswer === correctAnswer) {
    score++;
    selectedElement.style.backgroundColor = "lightgreen";
  } else {
    selectedElement.style.backgroundColor = "lightcoral";
    allOptions.forEach(function (option) {
      if (option.textContent === correctAnswer) {
        option.style.backgroundColor = "lightgreen";
      }
    });
  }

  nextButton.style.display = "block";
}

nextButton.onclick = function () {
  if (currentQuestionIndex === questions.length - 1) {
    clearInterval(timer);
    showFinalScore();
    hideQuestion();
  } else {
    currentQuestionIndex++;
    showQuestion();
    nextButton.style.display = "none";
  }
};

function showFinalScore() {
  finalScoreElement.textContent = "Your Final Score: " + score + "/" + questions.length + "\n";
  finalScoreElement.style.display = "block";
  nextButton.style.display = "none";
  restartButton.style.display = "block";

  var userId = firebase.auth().currentUser.uid;
  saveScore(userId, score);

  if (score >= questions.length * 0.8) {
    Swal.fire({
      icon: "success",
      title: "You did well!",
      text: "Great job on completing the quiz!",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "You did not do well!",
      text: "Better luck next time!",
    });
  }
}

function saveScore(userId, score) {
  var timestamp = new Date().toISOString();
  db.ref("scores/" + userId).push({
    score: score,
    timestamp: timestamp,
  });
}

function fetchHistory(userId) {
  db.ref("scores/" + userId)
    .orderByChild("timestamp")
    .limitToLast(5)
    .once("value", function (snapshot) {
      var scores = snapshot.val();
      var scoreHistory = [];
      for (var key in scores) {
        if (scores.hasOwnProperty(key)) {
          scoreHistory.push(scores[key].score);
        }
      }
      Swal.fire({
        title: "Your Last 5 Scores",
        html: scoreHistory
          .map(function (score) {
            return "<p>Score: " + score + "</p>";
          })
          .join(""),
        icon: "info",
      });
    });
}

document.getElementById("historyBtn").onclick = function () {
  var userId = firebase.auth().currentUser.uid;
  fetchHistory(userId);
};

function logout() {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, log out",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          window.location.href = "index.html";
        })
        .catch(function (error) {
          console.log(error.message);
        });
    } else {
      console.log("Logout canceled");
    }
  });
}

restartButton.onclick = function () {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 30;
  finalScoreElement.style.display = "none";
  restartButton.style.display = "none";
  nextButton.style.display = "none";
  startTimer();
  showQuestion();
};

firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    window.location.href = "index.html";
  }
});

startTimer();
showQuestion();
