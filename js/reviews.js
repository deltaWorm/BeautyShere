const API_URL = 'http://localhost:3000/api/reviews';

// Загрузка отзывов
async function loadReviews() {
    try {
        const response = await fetch(API_URL);
        const reviews = await response.json();
        
        // На главной странице
        const reviewsContainer = document.getElementById('reviews-container');
        if (reviewsContainer && reviews.length > 0) {
            reviewsContainer.innerHTML = reviews.slice(0, 3).map(review => `
                <div class="review-card">
                    <h3>${review.author}</h3>
                    <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    <p>${review.text}</p>
                    <small>${new Date(review.created_at).toLocaleDateString('ru-RU')}</small>
                </div>
            `).join('');
        }
        
        // На странице отзывов
        const reviewsList = document.getElementById('reviews-list');
        if (reviewsList) {
            reviewsList.innerHTML = reviews.map(review => `
                <div class="review-item">
                    <h3>${review.author}</h3>
                    <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    <p>${review.text}</p>
                    <small>${new Date(review.created_at).toLocaleDateString('ru-RU')}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

// Отправка отзыва
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const review = {
                author: document.getElementById('author').value,
                email: document.getElementById('email').value,
                rating: parseInt(document.getElementById('rating').value),
                text: document.getElementById('text').value
            };
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(review)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showMessage('✅ Отзыв успешно отправлен! Уведомление отправлено в Telegram.', 'success');
                    reviewForm.reset();
                    loadReviews();
                } else {
                    showMessage(`❌ Ошибка: ${result.error}`, 'error');
                }
            } catch (error) {
                showMessage('❌ Ошибка подключения к серверу', 'error');
            }
        });
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = type;
        messageDiv.innerHTML = text;
        
        setTimeout(() => {
            messageDiv.innerHTML = '';
            messageDiv.className = '';
        }, 5000);
    } else {
        alert(text);
    }
}