// Скрипт для страницы акций и новостей
document.addEventListener('DOMContentLoaded', function() {
    loadNews('all');
    loadArchive();
    setupFilters();
    setupNewsletter();
    initNewsSlider();
});

// Данные для акций и новостей
const newsData = [
    // Акции
    {
        id: 1,
        title: "Скидка 20% на первый визит",
        description: "Для новых клиентов при записи через сайт. Действует до конца месяца.",
        details: "Акция распространяется на все услуги салона. Для получения скидки необходимо при записи указать промокод WELCOME20. Скидка действует на первую услугу для новых клиентов.",
        date: "2024-01-15",
        type: "promotion",
        category: "discount",
        badge: "Акция",
        badgeClass: "promotion",
        color: "#ff5722",
        image: "../images/promo1.jpg",
        active: true,
        endDate: "2024-02-28"
    },
    {
        id: 2,
        title: "Комплекс услуг со скидкой 15%",
        description: "Стрижка + окрашивание + уход. Идеальный вариант для полного преображения.",
        details: "В комплекс входит: консультация мастера, стрижка, окрашивание в один тон, кератиновое восстановление. Действует до 31 января. Предварительная запись обязательна.",
        date: "2024-01-10",
        type: "promotion",
        category: "complex",
        badge: "Комплекс",
        badgeClass: "promotion",
        color: "#4CAF50",
        image: "../images/promo2.jpg",
        active: true,
        endDate: "2024-01-31"
    },
    {
        id: 3,
        title: "Приведи друга - получи скидку 25%",
        description: "При записи друга вы получаете скидку 25% на любую услугу.",
        details: "Акция действует для постоянных клиентов. Друг должен совершить первую запись через сайт и указать ваш номер телефона. Скидка активируется после первого визита друга.",
        date: "2024-01-05",
        type: "promotion",
        category: "discount",
        badge: "Скидка",
        badgeClass: "promotion",
        color: "#FF9800",
        image: "../images/promo3.jpg",
        active: true,
        endDate: "2024-03-01"
    },
    // Новости
    {
        id: 4,
        title: "Новая услуга - биоармирование волос",
        description: "Представляем новую услугу по укреплению и восстановлению волос.",
        details: "Биоармирование - это процедура глубокого восстановления волос с использованием натуральных компонентов. Результат: укрепленные, блестящие и послушные волосы. Запись уже открыта!",
        date: "2024-01-12",
        type: "news",
        category: "service",
        badge: "Новинка",
        badgeClass: "news",
        color: "#2196F3",
        image: "../images/news1.jpg",
        active: true
    },
    {
        id: 5,
        title: "Мастер-класс от Анны Волковой",
        description: "15 февраля состоится мастер-класс по вечерним прическам.",
        details: "Мастер-класс пройдет в нашем салоне. Количество мест ограничено. Требуется предварительная запись. Стоимость участия: 2000 рублей. Все материалы включены в стоимость.",
        date: "2024-01-08",
        type: "event",
        category: "education",
        badge: "Мероприятие",
        badgeClass: "event",
        color: "#9C27B0",
        image: "../images/news2.jpg",
        active: true,
        eventDate: "2024-02-15"
    },
    {
        id: 6,
        title: "Обновление коллекции косметики",
        description: "Мы обновили линейку профессиональной косметики L'Oreal Professionnel.",
        details: "Теперь в нашем арсенале самые современные средства для ухода за волосами. Новые продукты: сыворотки, маски, спреи для укладки. Приходите и протестируйте!",
        date: "2024-01-03",
        type: "news",
        category: "update",
        badge: "Обновление",
        badgeClass: "news",
        color: "#00BCD4",
        image: "../images/news3.jpg",
        active: true
    },
    // Дополнительные акции
    {
        id: 7,
        title: "Стрижка + укладка по специальной цене",
        description: "Только по понедельникам и вторникам специальное предложение.",
        details: "Каждый понедельник и вторник с 10:00 до 15:00 действует специальная цена на комплекс стрижка + укладка. Акция не суммируется с другими скидками.",
        date: "2024-01-18",
        type: "promotion",
        category: "complex",
        badge: "Спецпредложение",
        badgeClass: "promotion",
        color: "#FF5722",
        image: "../images/promo4.jpg",
        active: true,
        endDate: "2024-03-31"
    },
    {
        id: 8,
        title: "День рождения - скидка 30%",
        description: "В день рождения и неделю после - специальная скидка для именинников.",
        details: "Предъявите паспорт в день вашего рождения или в течение недели после, и получите скидку 30% на любую услугу. Акция действует для всех клиентов.",
        date: "2024-01-22",
        type: "promotion",
        category: "discount",
        badge: "Именинникам",
        badgeClass: "discount",
        color: "#E91E63",
        image: "../images/promo5.jpg",
        active: true,
        endDate: "2024-12-31"
    },
    {
        id: 9,
        title: "Акция на мужские стрижки",
        description: "Каждую среду скидка 20% на все мужские стрижки.",
        details: "Акция действует каждую среду с 9:00 до 20:00. Запись по предварительной записи обязательна. Скидка не распространяется на комплексные услуги.",
        date: "2024-01-25",
        type: "promotion",
        category: "discount",
        badge: "Мужская скидка",
        badgeClass: "discount",
        color: "#3F51B5",
        image: "../images/promo6.jpg",
        active: true,
        endDate: "2024-06-30"
    },
    {
        id: 10,
        title: "Открытие нового филиала",
        description: "Сообщаем об открытии нового филиала в центре города.",
        details: "С 1 февраля мы открываем новый салон по адресу: ул. Ленина, 45. Приглашаем всех на день открытых дверей с 10:00 до 18:00. Вас ждут подарки и скидки!",
        date: "2024-01-28",
        type: "news",
        category: "event",
        badge: "Новость",
        badgeClass: "event",
        color: "#009688",
        image: "../images/news4.jpg",
        active: true
    }
];

// Загрузка акций и новостей
function loadNews(filter = 'all') {
    const slider = document.getElementById('news-slider');
    if (!slider) return;
    
    // Фильтрация данных
    let filteredData = newsData;
    if (filter !== 'all') {
        filteredData = newsData.filter(item => 
            item.type === filter || item.category === filter
        );
    }
    
    // Сортировка по дате (новые первыми)
    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Если нет данных для выбранного фильтра
    if (filteredData.length === 0) {
        slider.innerHTML = `
            <div class="no-results" style="
                flex: 0 0 100%;
                text-align: center;
                padding: 60px 20px;
                color: var(--gray);
            ">
                <h3>Нет результатов</h3>
                <p>Пока нет акций в выбранной категории. Попробуйте выбрать другую категорию или зайдите позже.</p>
                <button class="btn btn-primary" onclick="loadNews('all')">Показать все</button>
            </div>
        `;
        return;
    }
    
    // Отображение слайдов
    slider.innerHTML = filteredData.map(item => {
        const formattedDate = formatDate(item.date);
        const endDate = item.endDate ? formatDate(item.endDate) : null;
        const eventDate = item.eventDate ? formatDate(item.eventDate) : null;
        
        return `
            <div class="news-slide" data-type="${item.type}" data-category="${item.category}">
                <div class="news-image">
                    <div class="image-placeholder" style="
                        background: linear-gradient(135deg, ${item.color || 'var(--primary)'}, var(--secondary));
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        font-size: 32px;
                    ">
                        ${item.title.split(' ').map(word => word[0]).join('').toUpperCase()}
                    </div>
                    <span class="news-badge ${item.badgeClass}">${item.badge}</span>
                </div>
                <div class="news-content">
                    <div class="news-date">
                        <i class="far fa-calendar"></i>
                        ${formattedDate}
                        ${endDate ? ` - ${endDate}` : ''}
                    </div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-description">${item.description}</p>
                    <div class="news-meta">
                        <span class="news-category">${getCategoryName(item.category)}</span>
                        <div class="news-action">
                            <button class="read-more-btn" onclick="showNewsDetails(${item.id})">
                                <span>Подробнее</span>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                            <a href="booking.html" class="btn btn-primary book-btn">Записаться</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Настройка фильтров
function setupFilters() {
    const filterSelect = document.getElementById('news-filter');
    if (!filterSelect) return;
    
    filterSelect.addEventListener('change', function() {
        const filter = this.value;
        loadNews(filter);
        
        // Показать индикатор скролла
        showScrollIndicator();
    });
}

// Инициализация горизонтального слайдера
function initNewsSlider() {
    const sliderWrapper = document.getElementById('news-slider-wrapper');
    if (!sliderWrapper) return;
    
    // Скрыть индикатор скролла через 5 секунд
    setTimeout(() => {
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }, 5000);
    
    // Добавить обработчик скролла
    sliderWrapper.addEventListener('scroll', function() {
        // Скрыть индикатор при начале скролла
        const indicator = document.getElementById('scroll-indicator');
        if (indicator && indicator.style.display !== 'none') {
            indicator.style.display = 'none';
        }
    });
    
    // Включить горизонтальный скролл колесиком мыши
    sliderWrapper.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            return; // Уже есть горизонтальный скролл
        }
        
        e.preventDefault();
        this.scrollLeft += e.deltaY;
    }, { passive: false });
}

// Показать индикатор скролла
function showScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
        indicator.style.display = 'block';
        indicator.style.animation = 'none';
        void indicator.offsetWidth; // Перезапуск анимации
        indicator.style.animation = 'fadeInOut 5s ease-in-out';
        
        // Скрыть через 5 секунд
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 5000);
    }
}

// Загрузка архивных акций
function loadArchive() {
    const container = document.getElementById('archive-list');
    if (!container) return;
    
    const archiveData = [
        {
            date: "2023-12-20",
            title: "Новогодние скидки до 30%",
            description: "Специальные предложения к новогодним праздникам на все услуги салона"
        },
        {
            date: "2023-11-15",
            title: "Черная пятница",
            description: "Скидки на все услуги в течение недели. Самые выгодные предложения года!"
        },
        {
            date: "2023-10-01",
            title: "Осеннее преображение",
            description: "Скидка 20% на окрашивание и стрижку в октябре"
        },
        {
            date: "2023-09-10",
            title: "День красоты",
            description: "Специальные цены на все услуги в честь Дня красоты"
        },
        {
            date: "2023-08-01",
            title: "Летний марафон скидок",
            description: "Каждую неделю новая акция на разные услуги"
        },
        {
            date: "2023-07-15",
            title: "Скидка на детские стрижки",
            description: "Все лето детские стрижки со скидкой 15%"
        }
    ];
    
    // Сортировка по дате (новые первыми)
    archiveData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = archiveData.map(item => `
        <div class="archive-item">
            <div class="archive-date">
                <i class="far fa-calendar"></i>
                ${formatDate(item.date)}
            </div>
            <h3 class="archive-title">${item.title}</h3>
            <p class="archive-description">${item.description}</p>
        </div>
    `).join('');
}

// Настройка формы подписки
function setupNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const agreeCheckbox = this.querySelector('input[type="checkbox"]');
        const email = emailInput.value.trim();
        
        // Валидация
        if (!email) {
            showNotification('Пожалуйста, введите email', 'error');
            emailInput.focus();
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            emailInput.focus();
            return;
        }
        
        if (!agreeCheckbox.checked) {
            showNotification('Пожалуйста, согласитесь на обработку персональных данных', 'error');
            agreeCheckbox.focus();
            return;
        }
        
        // Имитация отправки
        showNotification('Подписка оформлена! Теперь вы будете получать наши новости.', 'success');
        form.reset();
        
        // Сохранение в localStorage
        saveSubscription(email);
    });
}

// Сохранение подписки
function saveSubscription(email) {
    try {
        const subscriptions = JSON.parse(localStorage.getItem('beautySphereSubscriptions') || '[]');
        if (!subscriptions.includes(email)) {
            subscriptions.push(email);
            localStorage.setItem('beautySphereSubscriptions', JSON.stringify(subscriptions));
        }
    } catch (error) {
        console.error('Ошибка сохранения подписки:', error);
    }
}

// Показать детали новости
function showNewsDetails(itemId) {
    const item = newsData.find(i => i.id === itemId);
    if (!item) return;
    
    const modalHTML = `
        <div class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 600px; width: 90%;">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="news-detail-modal">
                    <div class="news-detail-header">
                        <span class="news-badge ${item.badgeClass}" style="display: inline-block; margin-bottom: 15px;">${item.badge}</span>
                        <h2>${item.title}</h2>
                        <div class="news-date">
                            <i class="far fa-calendar"></i>
                            ${formatDate(item.date)}
                            ${item.endDate ? ` - ${formatDate(item.endDate)}` : ''}
                        </div>
                    </div>
                    <div class="news-detail-body">
                        <div class="news-image-placeholder" style="
                            background: linear-gradient(135deg, ${item.color || 'var(--primary)'}, var(--secondary));
                            height: 200px;
                            border-radius: 10px;
                            margin: 20px 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: 48px;
                        ">
                            ${item.title.split(' ').map(word => word[0]).join('').toUpperCase()}
                        </div>
                        <h3>Описание</h3>
                        <p>${item.description}</p>
                        <h3>Подробности</h3>
                        <p>${item.details}</p>
                        ${item.eventDate ? `<p><strong>Дата проведения:</strong> ${formatDate(item.eventDate)}</p>` : ''}
                    </div>
                    <div class="news-detail-footer">
                        <a href="booking.html" class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                            <i class="fas fa-calendar-check"></i> Записаться по этой акции
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
}

// Закрыть модальное окно
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return date.toLocaleDateString('ru-RU', options);
}

// Получение названия категории
function getCategoryName(category) {
    const categoryNames = {
        'all': 'Все',
        'promotion': 'Акция',
        'news': 'Новость',
        'event': 'Событие',
        'discount': 'Скидка',
        'complex': 'Комплекс',
        'service': 'Услуга',
        'education': 'Обучение',
        'update': 'Обновление'
    };
    
    return categoryNames[category] || category;
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Удаляем старые уведомления
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    `;
    
    // Автоматическое закрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

// Добавляем стили для страницы новостей
const newsStyles = `
    .news-filters {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        padding: 10px 25px;
        background-color: var(--light);
        border: 2px solid var(--light-gray);
        border-radius: var(--radius);
        color: var(--dark);
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .filter-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
    }
    
    .filter-btn.active {
        background-color: var(--primary);
        color: var(--white);
        border-color: var(--primary);
    }
    
    .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
    }
    
    .news-read-more {
        display: inline-block;
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        margin-top: 15px;
        transition: var(--transition);
    }
    
    .news-read-more:hover {
        color: var(--primary-dark);
    }
    
    .newsletter {
        padding: 80px 0;
        background: linear-gradient(135deg, rgba(44, 140, 153, 0.1) 0%, rgba(77, 182, 172, 0.1) 100%);
        text-align: center;
    }
    
    .newsletter-content {
        max-width: 600px;
        margin: 0 auto;
    }
    
    .newsletter h2 {
        color: var(--dark);
        margin-bottom: 20px;
        font-size: 28px;
    }
    
    .newsletter p {
        color: var(--gray);
        margin-bottom: 30px;
        line-height: 1.6;
    }
    
    .newsletter-form .form-group {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .newsletter-form input {
        flex: 1;
        padding: 15px 20px;
        border: 2px solid var(--light-gray);
        border-radius: var(--radius);
        font-size: 16px;
    }
    
    .newsletter-form button {
        padding: 15px 30px;
    }
    
    .form-check {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    .form-check input {
        width: 18px;
        height: 18px;
    }
    
    .form-check label {
        color: var(--gray);
        font-size: 14px;
        cursor: pointer;
    }
    
    .archive {
        padding: 80px 0;
        background-color: var(--white);
    }
    
    .archive-list {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .archive-item {
        padding: 25px 0;
        border-bottom: 1px solid var(--light-gray);
    }
    
    .archive-item:last-child {
        border-bottom: none;
    }
    
    .archive-date {
        color: var(--primary);
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 10px;
    }
    
    .archive-title {
        color: var(--dark);
        margin-bottom: 10px;
        font-size: 18px;
    }
    
    .archive-description {
        color: var(--gray);
        line-height: 1.6;
    }
    
    @media (max-width: 768px) {
        .newsletter-form .form-group {
            flex-direction: column;
        }
        
        .newsletter-form input,
        .newsletter-form button {
            width: 100%;
        }
    }
`;

// Добавляем стили в документ
const styleElement = document.createElement('style');
styleElement.textContent = newsStyles;
document.head.appendChild(styleElement);