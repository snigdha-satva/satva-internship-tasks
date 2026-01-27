const questions = [
    {
        type: 'radio',
        question: 'Which language runs in the browser?',
        options: ['Python', 'Java', 'JavaScript', 'C++'],
        answer: 'JavaScript'
    },
    {
        type: 'text',
        question: 'What does HTML stand for?',
        answer: 'Hyper Text Markup Language'
    },
    {
        type: 'radio',
        question: 'Which company created jQuery?',
        options: ['Google', 'Facebook', 'Microsoft', 'John Resig'],
        answer: 'John Resig'
    },
    {
        type: 'radio',
        question: 'Which of the following is a single global function defined in the jQuery library?',
        options: ['$()', 'jQuery()', 'Queryanalysis()', 'global()'],
        answer: '$()'
    },
    {
        type: 'radio',
        question: 'Which of the following is a factory function?',
        options: ['Queryanalysis()', 'jQuery()', '$()', 'onclick()'],
        answer: 'jQuery()'
    }
]

let currentIndex = 0
let score = 0
let answersLog = [] // For total correct & incorrect answers.

$(function () {
    loadQuestion() // Loading the question
    setupValidation() // For validating the question

    $('#quizForm').on('submit', function (e) {
        e.preventDefault()
        if (!$(this).valid()) return
        handleAnswer() // Checking the answer
        moveToNextQuestion() // For going to next question.
    })
})

// This is to load the next question
function loadQuestion() {
    const currentQuestion = questions[currentIndex] // For getting the current question
    $('#questionTitle')
        .hide() // Hides the previous question
        .text(`Question ${currentIndex + 1}: ${currentQuestion.question}`) // Shows new question
        .fadeIn(400)

    $('#optionsContainer').hide().empty() // Hides the previous questions' options

    // For loading options
    if (currentQuestion.type === 'radio') {
        renderRadioOptions(currentQuestion.options)
    } else {
        renderTextInput()
    }

    renderNextButton(); // To generate the next button
    $('#optionsContainer').fadeIn(400)
}

function renderRadioOptions(options) {
    options.forEach((option, index) => {
        $('#optionsContainer').append(`
            <div class="form-check mb-2">
                <input class="form-check-input" 
                       type="radio" 
                       name="answer" 
                       id="option${index}" 
                       value="${option}">
                <label class="form-check-label" for="option${index}">
                    ${option}
                </label>
            </div>
        `)
    })
}

function renderTextInput() {
    $('#optionsContainer').append(`
        <input type="text"
               class="form-control"
               name="answer"
               id="textAnswer"
               placeholder="Type your answer">
    `)
}

function setupValidation() {
    $('#quizForm').validate({
        rules: {
            answer: {
                required: true
            }
        },
        messages: {
            answer: 'Please answer before continuing'
        },
        errorElement: 'small',
        errorClass: 'text-danger d-block mt-2',
        // For selecting the error placement.
        errorPlacement: function (error) {
            error.insertAfter('#optionsContainer') // This means that the error will be after the form and before the next button
        }
    })
}

function handleAnswer() {
    const q = questions[currentIndex]
    let userAnswer = ''

    if (q.type === 'text') {
        userAnswer = $('#textAnswer').val()
    } else {
        userAnswer = $('[name="answer"]:checked').val() || ''
    }

    const normalize = str => str.toLowerCase().replace(/\s/g, ' ')
    const correct = normalize(userAnswer) === normalize(q.answer)

    // Makes an answer log of user's input and the corrext answer.
    answersLog.push({
        question: q.question,
        userAnswer: userAnswer,
        correctAnswer: q.answer,
        isCorrect: correct
    })

    if (correct) score++ // Increases the score for correct answer
    $('#scoreDisplay').text(score) // Displays the score
    updateProgress() // Updates the progress bar
}


// This is for the final score
function showFinalScore() {
    // Filters the correct answer
    const correctList = answersLog
        .filter(a => a.isCorrect)
        .map(a => `
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <span>${a.question}</span>
            </li>
        `).join('')

    // Filters all the wrong answer
    const wrongList = answersLog
        .filter(a => !a.isCorrect)
        .map(a => `
            <li class="list-group-item">
                <div class="fw-semibold">${a.question}</div>
                <div class="text-danger small">Your answer: ${a.userAnswer}</div>
                <div class="text-success small">Correct answer: ${a.correctAnswer}</div>
            </li>
        `).join('')

    $('#questionTitle').hide() // Hides the question title
    // Displays score, correct & incorrect answers
    $('#optionsContainer').html(`
        <div class="text-center mb-4">
            <div class="fs-3 fw-bold">Final Score</div>
            <div class="fs-4 text-primary">${score} / ${questions.length}</div>
        </div>

        <div class="row g-4">
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-success text-white fw-semibold">
                        Correct Answers
                    </div>
                    <ul class="list-group list-group-flush">
                        ${correctList || '<li class="list-group-item text-muted">None</li>'}
                    </ul>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-danger text-white fw-semibold">
                        Incorrect Answers
                    </div>
                    <ul class="list-group list-group-flush">
                        ${wrongList || '<li class="list-group-item text-muted">None</li>'}
                    </ul>
                </div>
            </div>
        </div>
    `)

    renderRestartButton() // This will generate the restart button instead of next
}

// For adding the next button
function renderNextButton() {
    $('#nextButtonWrapper').html(`
        <button type="submit"
                class="btn btn-primary btn-lg rounded-pill"
                id="nextButton">
            Next
        </button>
    `)
}

// For adding the restart button
function renderRestartButton() {
    $('#nextButtonWrapper').html(`
        <button type="button"
                class="btn btn-success btn-lg rounded-pill"
                id="restartButton">
            Restart Quiz
        </button>
    `)

    $('#restartButton').on('click', resetQuiz)
}


function moveToNextQuestion() {
    currentIndex++ // Increases the current index
    if (currentIndex >= questions.length) {
        showFinalScore()
        return
    }
    // Makes the current question disappear.
    $('#quizForm').fadeOut(300, function () {
        $(this)[0].reset()
        $(this).fadeIn(300)
        loadQuestion()
    })
}

// Resets the quiz
function resetQuiz() {
    currentIndex = 0
    score = 0
    answersLog = []
    $('#scoreDisplay').text(score)
    $('#progressBar').css('width', '0%')

    $('#quizForm')[0].reset()
    $('#quizForm').fadeIn(300)
    $('#questionTitle').fadeIn(300)
    loadQuestion()
}

// Updates the progress bar as times goes on.
function updateProgress() {
    const progressPercent = ((currentIndex + 1) / questions.length) * 100
    $('#progressBar').animate({ width: progressPercent + '%' }, 500)
}
