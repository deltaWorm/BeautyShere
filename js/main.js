// Главный скрипт для сайта
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Загрузка данных на главную
    loadPopularServices();
    loadMastersPreview();
    loadReviews();
    loadPromotions();
    loadContactsPreview();
    setupReviewForm();
    checkAuth();
    
    // Инициализация карты если есть
    if (document.getElementById('map')) {
        initMap();
    }
});

// Загрузка популярных услуг на главную
async function loadPopularServices() {
    const container = document.getElementById('popular-services');
    if (!container) return;
    
    try {
        const services = await window.beautySphereData.getServices();
        
        if (!services || services.length === 0) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Не удалось загрузить услуги. Пожалуйста, попробуйте позже.</p>
                </div>
            `;
            return;
        }
        
        // Берем 6 популярных услуг
        const popularServices = services.slice(0, 6);
        
        container.innerHTML = popularServices.map(service => `
            <div class="service-card">
                <div class="service-image">
                    <div class="image-placeholder" style="background: linear-gradient(135deg, #4db6ac, #2c8c99); color: white; padding: 20px; border-radius: 8px; text-align: center; font-weight: bold; height: 120px; display: flex; align-items: center; justify-content: center;">
                        ${service.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                    </div>
                </div>
                <div class="service-content">
                    <h3 class="service-name">${service.name}</h3>
                    <p class="service-category">${service.category}</p>
                    <p class="service-price">${service.price} руб.</p>
                    <p class="service-duration">${service.duration} мин.</p>
                    <p class="service-description">${service.description}</p>
                    <a href="pages/booking.html?service=${service.id}" class="btn btn-secondary service-button">Записаться</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки услуг:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Не удалось загрузить услуги. Пожалуйста, попробуйте позже.</p>
            </div>
        `;
    }
}

// Загрузка мастеров в горизонтальный слайдер на главной
async function loadMastersPreview() {
    const container = document.getElementById('masters-preview');
    if (!container) return;
    
    try {
        const masters = await window.beautySphereData.getMasters();
        
        if (!masters || masters.length === 0) {
            container.innerHTML = `
                <div class="no-masters" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p>Не удалось загрузить мастеров. Приходите к нам и познакомьтесь лично!</p>
                </div>
            `;
            return;
        }
        
        // Берем 6 мастеров для превью
        const previewMasters = masters.slice(0, 6);
        
        container.innerHTML = previewMasters.map(master => {
            const initials = master.name.split(' ').map(word => word[0]).join('').toUpperCase();
            const rating = getRandomRating();
            
            return `
                <div class="master-slide">
                    <div class="master-avatar">
                        ${initials}
                    </div>
                    <div class="master-info">
                        <h3 class="master-name">${master.name}</h3>
                        <p class="master-specialization">${master.specialization}</p>
                        <p class="master-experience">
                            <i class="fas fa-clock"></i> Опыт: ${master.experience}
                        </p>
                        <div class="master-rating">
                            ${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}
                            <span style="color: var(--gray); font-size: 14px; margin-left: 5px;">${rating.toFixed(1)}</span>
                        </div>
                        <p class="master-description">${master.description.substring(0, 100)}...</p>
                        <div class="master-actions">
                            <a href="pages/masters.html#master-${master.id}" class="btn btn-outline">Подробнее</a>
                            <a href="pages/booking.html?master=${master.id}" class="btn btn-primary">Записаться</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Инициализация слайдера
        initMastersSlider();
        
    } catch (error) {
        console.error('Ошибка загрузки мастеров:', error);
        container.innerHTML = `
            <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray);">
                <p>Не удалось загрузить мастеров. Пожалуйста, попробуйте позже.</p>
            </div>
        `;
    }
}

// Инициализация слайдера мастеров
function initMastersSlider() {
    const slider = document.querySelector('.masters-slider');
    const slides = document.querySelectorAll('.master-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!slider || slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    
    let currentIndex = 0;
    const slidesToShow = getSlidesToShow();
    const totalSlides = slides.length;
    let autoSlideInterval;
    
    // Создаем индикаторы точек
    function createDots() {
        dotsContainer.innerHTML = '';
        const dotsCount = Math.ceil(totalSlides / slidesToShow);
        
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function getSlidesToShow() {
        if (window.innerWidth >= 1200) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth + 30; // включая gap
        const translateX = -currentIndex * slideWidth * slidesToShow;
        slider.style.transform = `translateX(${translateX}px)`;
        
        // Обновляем активную точку
        const activeDotIndex = Math.floor(currentIndex / slidesToShow);
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
        
        // Обновляем состояние кнопок
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) {
            const maxIndex = Math.max(0, Math.ceil(totalSlides / slidesToShow) - 1);
            nextBtn.disabled = currentIndex >= maxIndex;
        }
    }
    
    function nextSlide() {
        const maxIndex = Math.max(0, Math.ceil(totalSlides / slidesToShow) - 1);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        } else {
            currentIndex = 0;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        } else {
            const maxIndex = Math.max(0, Math.ceil(totalSlides / slidesToShow) - 1);
            currentIndex = maxIndex;
            updateSlider();
        }
    }
    
    function goToSlide(index) {
        currentIndex = index * slidesToShow;
        updateSlider();
    }
    
    // Инициализация
    createDots();
    updateSlider();
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Автоматическая прокрутка (только на десктопе)
    if (window.innerWidth >= 768) {
        autoSlideInterval = setInterval(nextSlide, 5000);
        
        // Остановка автослайда при наведении
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Обновление при изменении размера окна
    window.addEventListener('resize', () => {
        const newSlidesToShow = getSlidesToShow();
        if (newSlidesToShow !== slidesToShow) {
            currentIndex = 0;
            createDots();
            updateSlider();
        }
    });
    
    // Свайп для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                nextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                prevSlide();
            }
        }
    }
}

// Вспомогательная функция для генерации рейтинга
function getRandomRating() {
    return 4 + Math.random();
}

// Загрузка акций на главную
async function loadPromotions() {
    const container = document.getElementById('promotions-container');
    if (!container) return;
    
    try {
        const promotions = await window.beautySphereData.getPromotions();
        
        if (promotions.length === 0) {
            container.innerHTML = `
                <div class="promotion-card">
                    <h3 class="promotion-title">Следите за нашими акциями</h3>
                    <p class="promotion-text">Новые акции появляются регулярно. Подпишитесь на наши соцсети, чтобы быть в курсе!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = promotions.map(promo => `
            <div class="promotion-card">
                <div class="promotion-badge">Акция</div>
                <h3 class="promotion-title">${promo.title}</h3>
                <p class="promotion-text">${promo.description}</p>
                <div class="promotion-date">Действует до: ${new Date(promo.endDate).toLocaleDateString('ru-RU')}</div>
                <a href="pages/news.html" class="promotion-link">Подробнее <i class="fas fa-arrow-right"></i></a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки акций:', error);
        container.innerHTML = '<p>Не удалось загрузить акции</p>';
    }
}

// Загрузка отзывов на главную
async function loadReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    
    try {
        const reviews = await window.beautySphereData.getReviews();
        
        // Фильтруем только одобренные отзывы
        const approvedReviews = reviews.filter(review => review.approved);
        
        if (approvedReviews.length === 0) {
            container.innerHTML = `
                <div class="review-card">
                    <p>Пока нет отзывов. Будьте первым!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = approvedReviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
                <p class="review-text">${review.text}</p>
                <div class="review-date">${new Date(review.date).toLocaleDateString('ru-RU')}</div>
            </div>
        `).join('');
        
        // Инициализация слайдера
        initReviewsSlider();
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        container.innerHTML = '<p>Не удалось загрузить отзывы</p>';
    }
}

// Загрузка контактов на главную (превью)
async function loadContactsPreview() {
    const container = document.getElementById('contacts-preview');
    if (!container) return;
    
    try {
        const contacts = await window.beautySphereData.getContacts();
        
        container.innerHTML = `
            <div class="contacts-grid">
                <div class="contact-info">
                    <h3>Наши контакты</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${contacts.address}</p>
                    <p><i class="fas fa-phone"></i> ${contacts.phone}</p>
                    <p><i class="fas fa-envelope"></i> ${contacts.email}</p>
                    
                    <h4 style="margin-top: 30px;">Часы работы</h4>
                    <p><strong>Пн-Пт:</strong> ${contacts.workingHours.weekdays}</p>
                    <p><strong>Сб:</strong> ${contacts.workingHours.saturday}</p>
                    <p><strong>Вс:</strong> ${contacts.workingHours.sunday}</p>
                    
                    <div class="contact-buttons" style="margin-top: 30px;">
                        <a href="pages/contacts.html" class="btn btn-primary">Все контакты</a>
                        <a href="pages/booking.html" class="btn btn-outline">Записаться онлайн</a>
                    </div>
                </div>
                <div class="contact-map">
                    <div id="map-preview" style="width: 100%; height: 300px; border-radius: 8px; overflow: hidden;">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1394.782366663711!2d132.34909367668318!3d43.12193607112815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5fb3924b8c3b6f33%3A0x7ab0a9cf2f35e43a!2z0KPQu9C40YbQsCDQmtCw0YDQu9CwINGc0LDRgNC60YHQsCwgMTTQkCwg0JHQu9C-0LnQvdC40YbQsCwg0J_RgNC40LzQuNGA0L7QstGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCA2OTI4MDY!5e0!3m2!1sru!2sru!4v1700000000000!5m2!1sru!2sru" 
                            width="100%" 
                            height="100%" 
                            style="border:0;" 
                            allowfullscreen="" 
                            loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Ошибка загрузки контактов:', error);
        container.innerHTML = `
            <div class="contact-info">
                <h3>Контакты</h3>
                <p><i class="fas fa-map-marker-alt"></i> Улица Карла Маркса, 13а, 1 этаж</p>
                <p><i class="fas fa-phone"></i> +7 (423) 352-14-25</p>
                <p><i class="fas fa-envelope"></i> beauty-sphere@mail.ru</p>
            </div>
        `;
    }
}

// Упрощенная функция для отзывов (убираем слайдер)
function initReviewsSlider() {
    const container = document.querySelector('.reviews-container');
    const cards = container.querySelectorAll('.review-card');
    
    if (!cards.length || cards.length <= 1) {
        // Убираем стрелки если они есть
        const prevBtn = document.querySelector('.review-prev');
        const nextBtn = document.querySelector('.review-next');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    
    // Убираем автоматическую прокрутку и стрелки
    const controls = document.querySelector('.reviews-controls');
    if (controls) controls.style.display = 'none';
    
    // Добавляем индикатор скролла для мобильных устройств
    if (window.innerWidth < 768) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '<span>← Прокрутите в сторону →</span>';
        scrollIndicator.style.cssText = `
            text-align: center;
            color: var(--gray);
            font-size: 14px;
            margin-top: 10px;
            padding: 10px;
            opacity: 0.8;
        `;
        
        const reviewsSection = document.querySelector('.reviews .container');
        if (reviewsSection) {
            reviewsSection.appendChild(scrollIndicator);
            
            // Убираем индикатор через 5 секунд
            setTimeout(() => {
                scrollIndicator.style.transition = 'opacity 0.5s';
                scrollIndicator.style.opacity = '0';
                setTimeout(() => scrollIndicator.remove(), 500);
            }, 5000);
        }
    }
}
// Настройка формы отзыва
function setupReviewForm() {
    const addReviewBtn = document.getElementById('add-review-btn');
    const reviewModal = document.getElementById('review-modal');
    
    if (!addReviewBtn || !reviewModal) return;
    
    // Открытие модалки
    addReviewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        reviewModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Закрытие модалки
    const closeModalBtn = reviewModal.querySelector('.modal-close');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    function closeModal() {
        reviewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Закрытие по клику вне модалки
    reviewModal.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reviewModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Отправка формы
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const reviewData = {
                author: document.getElementById('review-name').value.trim(),
                rating: parseInt(document.getElementById('review-rating').value),
                text: document.getElementById('review-text').value.trim(),
                date: new Date().toISOString(),
                approved: false
            };
            
            try {
                // Сохраняем в localStorage
                const existingReviews = JSON.parse(localStorage.getItem('beautySphereReviews') || '[]');
                reviewData.id = Date.now();
                existingReviews.push(reviewData);
                localStorage.setItem('beautySphereReviews', JSON.stringify(existingReviews));
                
                alert('Отзыв успешно отправлен на модерацию!');
                reviewForm.reset();
                closeModal();
                
                // Перезагружаем отзывы
                loadReviews();
            } catch (error) {
                alert('Ошибка при отправке отзыва: ' + error.message);
            }
        });
    }
}

// Авторизация
function saveAuthState(user) {
    localStorage.setItem('beauty-sphere-user', JSON.stringify(user));
}

function getAuthState() {
    const user = localStorage.getItem('beauty-sphere-user');
    return user ? JSON.parse(user) : null;
}

function clearAuthState() {
    localStorage.removeItem('beauty-sphere-user');
}

// Проверка авторизации
function checkAuth() {
    const user = getAuthState();
    const cabinetLink = document.querySelector('.cabinet-link');
    
    if (user && cabinetLink) {
        cabinetLink.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
    }
}

// Валидация форм
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone.replace(/\D/g, ''));
}

// Инициализация карты
function initMap() {
    console.log('Карта инициализирована');

}

// Проверка активных акций
function checkActivePromotions() {
    const today = new Date();
    const activePromotions = [];
    
    // Здесь в реальном приложении будет загрузка акций с сервера
    // Пока используем тестовые данные
    const promotions = [
        {
            id: 1,
            title: "Скидка 20% на первый визит",
            endDate: "2024-02-28"
        },
        {
            id: 2,
            title: "Комплекс со скидкой 15%",
            endDate: "2024-01-31"
        }
    ];
    
    promotions.forEach(promo => {
        const endDate = new Date(promo.endDate);
        if (endDate >= today) {
            activePromotions.push(promo);
        }
    });
    
    return activePromotions;
}

// Показать уведомление об акциях (если есть активные)
function showPromotionNotification() {
    // Проверяем, когда последний раз показывали уведомление
    const lastShown = localStorage.getItem('lastPromoNotification');
    const today = new Date().toDateString();
    
    // Показываем не чаще 1 раза в день
    if (lastShown === today) return;
    
    const activePromotions = checkActivePromotions();
    
    if (activePromotions.length > 0 && window.location.pathname !== '/pages/news.html') {
        const notification = document.createElement('div');
        notification.className = 'promo-notification';
        notification.innerHTML = `
            <div class="promo-notification-content">
                <span>Активные акции: ${activePromotions.length}</span>
                <a href="pages/news.html" class="btn btn-primary">Посмотреть</a>
                <button class="promo-notification-close">&times;</button>
            </div>
        `;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: var(--primary);
            color: white;
            padding: 10px 20px;
            z-index: 1001;
            animation: slideDown 0.3s ease;
        `;
        
        notification.querySelector('.promo-notification-content').style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        `;
        
        notification.querySelector('.btn').style.cssText = `
            padding: 5px 15px;
            font-size: 14px;
            background-color: white;
            color: var(--primary);
        `;
        
        notification.querySelector('.btn:hover').style.cssText = `
            background-color: var(--light);
        `;
        
        notification.querySelector('.promo-notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Закрытие по кнопке
        notification.querySelector('.promo-notification-close').addEventListener('click', () => {
            localStorage.setItem('lastPromoNotification', today);
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Закрытие при клике на ссылку
        notification.querySelector('.btn').addEventListener('click', () => {
            localStorage.setItem('lastPromoNotification', today);
        });
        
        // Автоматическое закрытие через 10 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                localStorage.setItem('lastPromoNotification', today);
                notification.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 10000);
        
        // Анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
            @keyframes slideUp {
                from { transform: translateY(0); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Корректируем отступ для фиксированного header
        const header = document.querySelector('.header');
        if (header) {
            header.style.marginTop = '40px';
        }
    }
}

// Вызов функции при загрузке главной страницы
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', showPromotionNotification);
}

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Добавляем стили для контактов
const style = document.createElement('style');
style.textContent = `
    .contacts-preview {
        padding: 80px 0;
        background-color: var(--white);
    }
    
    .contacts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        align-items: start;
    }
    
    .contact-info {
        background: var(--light);
        padding: 40px;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .contact-info h3 {
        color: var(--primary);
        margin-bottom: 25px;
        font-size: 24px;
    }
    
    .contact-info p {
        margin-bottom: 15px;
        color: var(--dark);
        display: flex;
        align-items: flex-start;
        gap: 15px;
    }
    
    .contact-info p i {
        color: var(--primary);
        font-size: 18px;
        margin-top: 3px;
        min-width: 20px;
    }
    
    .contact-buttons {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    
    .contact-buttons .btn {
        flex: 1;
        min-width: 150px;
    }
    
    @media (max-width: 992px) {
        .contacts-grid {
            grid-template-columns: 1fr;
            gap: 30px;
        }
        
        .contact-info {
            padding: 30px;
        }
    }
    
    @media (max-width: 576px) {
        .contact-buttons {
            flex-direction: column;
        }
        
        .contact-buttons .btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);