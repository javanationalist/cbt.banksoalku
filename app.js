document.addEventListener('DOMContentLoaded', () => {
    // Kunci localStorage yang sama dengan di admin.js
    const STORAGE_KEY = 'cbtQuestions';

    // Elemen-elemen UI
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');

    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreText = document.getElementById('score-text');
    const feedbackText = document.getElementById('feedback-text');
    const timerEl = document.getElementById('timer');

    // Variabel state kuis
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;

    // Fungsi untuk memuat soal dari localStorage
    const loadQuestions = () => {
        const storedQuestions = localStorage.getItem(STORAGE_KEY);
        if (storedQuestions && JSON.parse(storedQuestions).length > 0) {
            questions = JSON.parse(storedQuestions);
        } else {
            // Jika tidak ada soal, tampilkan pesan
            startScreen.innerHTML = `
                <h1>Kuis Belum Tersedia</h1>
                <p>Belum ada soal yang ditambahkan. Silakan hubungi admin.</p>
                <a href="admin.html" class="nav-link">Tambah Soal Sekarang</a>
            `;
        }
    };
    
    // Fungsi untuk memulai kuis
    const startQuiz = () => {
        if (questions.length === 0) return;

        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        
        currentQuestionIndex = 0;
        score = 0;
        nextBtn.classList.add('hidden');
        
        startTimer();
        showQuestion();
    };

    // Fungsi untuk menampilkan pertanyaan
    const showQuestion = () => {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        questionCounter.innerText = `Soal ${currentQuestionIndex + 1} dari ${questions.length}`;
        questionText.innerText = currentQuestion.question;

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.innerText = `${String.fromCharCode(65 + index)}. ${option}`;
            button.classList.add('option-btn');
            button.dataset.index = index;
            button.addEventListener('click', selectAnswer);
            optionsContainer.appendChild(button);
        });
    };

    // Fungsi untuk mereset state tampilan soal
    const resetState = () => {
        nextBtn.classList.add('hidden');
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
    };

    // Fungsi saat jawaban dipilih
    const selectAnswer = (e) => {
        const selectedBtn = e.target;
        const selectedAnswerIndex = parseInt(selectedBtn.dataset.index);
        const correctAnswerIndex = questions[currentQuestionIndex].correctAnswer;

        if (selectedAnswerIndex === correctAnswerIndex) {
            score++;
            selectedBtn.classList.add('correct');
        } else {
            selectedBtn.classList.add('incorrect');
        }

        // Tandai jawaban yang benar
        Array.from(optionsContainer.children).forEach(button => {
            if (parseInt(button.dataset.index) === correctAnswerIndex) {
                button.classList.add('correct');
            }
            button.disabled = true; // Nonaktifkan semua tombol setelah memilih
        });

        nextBtn.classList.remove('hidden');
    };
    
    // Fungsi untuk pindah ke soal berikutnya
    const handleNextButton = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    };
    
    // Fungsi untuk menampilkan hasil akhir
    const showResult = () => {
        clearInterval(timerInterval);
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        const percentage = Math.round((score / questions.length) * 100);
        scoreText.innerText = `${percentage}%`;

        let feedback = '';
        if (percentage >= 80) {
            feedback = 'Luar Biasa! Pengetahuan Anda sangat baik.';
        } else if (percentage >= 60) {
            feedback = 'Bagus! Terus tingkatkan lagi.';
        } else {
            feedback = 'Jangan menyerah, coba lagi untuk hasil yang lebih baik!';
        }
        feedbackText.innerText = feedback;
    };

    // Fungsi timer
    const startTimer = () => {
        let seconds = 0;
        timerEl.innerText = "00:00";
        timerInterval = setInterval(() => {
            seconds++;
            const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            timerEl.innerText = `${mins}:${secs}`;
        }, 1000);
    };

    // Event Listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', handleNextButton);
    restartBtn.addEventListener('click', () => location.reload()); // Cara mudah untuk restart

    <body oncontextmenu="return false;">

    // Muat soal saat halaman dimuat
    loadQuestions();
});
