document.addEventListener('DOMContentLoaded', () => {
    const addQuestionForm = document.getElementById('add-question-form');
    const questionList = document.getElementById('question-list');
    const noQuestionsMessage = document.getElementById('no-questions-message');
    const clearQuestionsBtn = document.getElementById('clear-questions-btn');
    const questionListContainer = document.getElementById('question-list-container');

    // Kunci untuk menyimpan data di localStorage
    const STORAGE_KEY = 'cbtQuestions';

    // Fungsi untuk mengambil soal dari localStorage
    const getQuestions = () => {
        const questions = localStorage.getItem(STORAGE_KEY);
        return questions ? JSON.parse(questions) : [];
    };

    // Fungsi untuk menyimpan soal ke localStorage
    const saveQuestions = (questions) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    };

    // Fungsi untuk menampilkan semua soal yang tersimpan
    const renderQuestions = () => {
        const questions = getQuestions();
        questionList.innerHTML = ''; // Kosongkan daftar sebelum render

        if (questions.length === 0) {
            noQuestionsMessage.style.display = 'block';
            questionListContainer.style.borderTop = 'none';
            clearQuestionsBtn.style.display = 'none';
        } else {
            noQuestionsMessage.style.display = 'none';
            questionListContainer.style.borderTop = '1px solid #eee';
            clearQuestionsBtn.style.display = 'block';
            
            questions.forEach((q, index) => {
                const listItem = document.createElement('li');
                const optionsHtml = q.options.map((opt, i) => 
                    `<span class="${i == q.correctAnswer ? 'correct' : ''}">${String.fromCharCode(65 + i)}. ${opt}</span>`
                ).join('<br>');
                
                listItem.innerHTML = `
                    <strong>${index + 1}. ${q.question}</strong>
                    ${optionsHtml}
                `;
                questionList.appendChild(listItem);
            });
        }
    };

    // Event listener untuk form penambahan soal
    addQuestionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const questionText = document.getElementById('question-text').value.trim();
        const options = [
            document.getElementById('option-a').value.trim(),
            document.getElementById('option-b').value.trim(),
            document.getElementById('option-c').value.trim(),
            document.getElementById('option-d').value.trim(),
        ];
        const correctAnswer = document.getElementById('correct-answer').value;

        // Validasi sederhana
        if (!questionText || options.some(opt => !opt) || correctAnswer === "") {
            alert('Harap isi semua kolom!');
            return;
        }

        const newQuestion = {
            question: questionText,
            options: options,
            correctAnswer: parseInt(correctAnswer, 10)
        };

        const questions = getQuestions();
        questions.push(newQuestion);
        saveQuestions(questions);

        // Reset form dan render ulang daftar soal
        addQuestionForm.reset();
        renderQuestions();
        alert('Soal berhasil disimpan!');
    });

    // Event listener untuk tombol hapus semua soal
    clearQuestionsBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua soal? Tindakan ini tidak dapat dibatalkan.')) {
            localStorage.removeItem(STORAGE_KEY);
            renderQuestions();
            alert('Semua soal telah dihapus.');
        }
    });

    // Panggil renderQuestions saat halaman pertama kali dimuat
    renderQuestions();
});
