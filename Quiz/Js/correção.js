
        const questions = [
            {
                question: "What is the capital of France?",
                options: ["Paris", "London", "Berlin", "Madrid"],
                answer: "Paris"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Earth", "Mars", "Venus", "Jupiter"],
                answer: "Mars"
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["Elephant", "Giraffe", "Blue Whale", "Hippopotamus"],
                answer: "Blue Whale"
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["Go", "Au", "Ag", "Ge"],
                answer: "Au"
            }
        ];

        let currentQuestionIndex = 0;
        let score = 0;

        const questionElement = document.getElementById('question');
        const optionsElement = document.getElementById('options');
        const scoreElement = document.getElementById('score');

        function displayQuestion() {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            optionsElement.innerHTML = '';

            currentQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => checkAnswer(option));
                optionsElement.appendChild(button);
            });
        }

        function checkAnswer(selectedOption) {
            const currentQuestion = questions[currentQuestionIndex];
            if (selectedOption === currentQuestion.answer) {
                score++;
            }

            currentQuestionIndex++;

            if (currentQuestionIndex < questions.length) {
                displayQuestion();
            } else {
                showResult();
            };
        }

        function showResult() {
            questionElement.textContent = 'Quiz Completed!';
            optionsElement.innerHTML = '';
            scoreElement.textContent = `Your Score: ${score} / ${questions.length}`;
        }

        displayQuestion();
