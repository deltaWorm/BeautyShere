// Скрипт для страницы портфолио
document.addEventListener('DOMContentLoaded', function() {
    setupFilterTabs();
    setupViewButtons();
    setupModal();
    preloadImages();
});

// Настройка фильтров
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Обновляем активную вкладку
            updateActiveTab(filter);
            
            // Фильтруем работы
            filterPortfolioItems(filter);
            
            // Прокручиваем к галерее
            document.querySelector('.portfolio-gallery').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// Обновление активной вкладки
function updateActiveTab(activeFilter) {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        if (tab.dataset.filter === activeFilter) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Фильтрация работ портфолио
function filterPortfolioItems(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const categories = item.dataset.category.split(' ');
        
        if (filter === 'all' || categories.includes(filter)) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Настройка кнопок просмотра
function setupViewButtons() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Данные для модального окна
    const portfolioData = {
        1: {
            title: "Стильная стрижка каре",
            description: "Идеальное каре с градуировкой для тонких волос. Форма подобрана с учетом особенностей лица и типа волос.",
            master: "Анна Волкова",
            date: "15.01.2025",
            service: "Женская стрижка",
            categories: ["Стрижки", "Женские"]
        },
        2: {
            title: "Сложное окрашивание блонд",
            description: "Переход из темного в блонд с тонированием холодными оттенками. Использована технология мелирования.",
            master: "Марина Смирнова",
            date: "20.01.2025",
            service: "Окрашивание волос",
            categories: ["Окрашивание", "Женские"]
        },
        3: {
            title: "Мужская стрижка с fade",
            description: "Модная стрижка с плавным переходом от коротких к длинным волосам. Точная работа машинкой и ножницами.",
            master: "Сергей Иванов",
            date: "18.01.2025",
            service: "Мужская стрижка",
            categories: ["Стрижки", "Мужские"]
        },
        4: {
            title: "Вечерняя укладка",
            description: "Укладка на выпускной вечер с использованием профессиональных средств для фиксации и блеска.",
            master: "Елена Петрова",
            date: "22.01.2025",
            service: "Вечерняя укладка",
            categories: ["Укладки", "Женские"]
        },
        5: {
            title: "Кератиновое выпрямление",
            description: "Восстановление и выпрямление волос с помощью бразильского кератина. Волосы стали гладкими и блестящими.",
            master: "Анна Волкова",
            date: "25.01.2025",
            service: "Кератиновое выпрямление",
            categories: ["Уход", "Женские"]
        },
        6: {
            title: "Окрашивание в рыжий",
            description: "Яркое медное окрашивание с эффектом омбре. Цвет подобран под теплый цветотип внешности.",
            master: "Марина Смирнова",
            date: "12.01.2025",
            service: "Медное окрашивание",
            categories: ["Окрашивание", "Женские"]
        },
        7: {
            title: "Стрижка боб",
            description: "Асимметричный боб на средние волосы с текстурной обработкой концов.",
            master: "Елена Петрова",
            date: "28.01.2025",
            service: "Стрижка боб",
            categories: ["Стрижки", "Женские"]
        },
        8: {
            title: "Мужская стрижка классика",
            description: "Классическая мужская стрижка с точными линиями и аккуратным оформлением.",
            master: "Сергей Иванов",
            date: "30.01.2025",
            service: "Классическая стрижка",
            categories: ["Стрижки", "Мужские"]
        }
        
        
    };
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = parseInt(this.dataset.id);
            
            if (portfolioData[itemId]) {
                showPortfolioItem(itemId, portfolioData[itemId]);
            }
        });
    });
    
    // Также можно кликнуть на всю карточку
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.view-btn')) {
                const itemId = parseInt(this.querySelector('.view-btn')?.dataset.id);
                if (itemId && portfolioData[itemId]) {
                    showPortfolioItem(itemId, portfolioData[itemId]);
                }
            }
        });
    });
}

// Показ детальной информации о работе
function showPortfolioItem(itemId, itemData) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalInfo = document.getElementById('modal-info');
    
    // Находим оригинальное изображение
    const originalImg = document.querySelector(`.view-btn[data-id="${itemId}"]`)?.closest('.portfolio-item')?.querySelector('.portfolio-image img');
    
    // Устанавливаем изображение
    if (originalImg && originalImg.src) {
        modalImage.src = originalImg.src;
        modalImage.alt = originalImg.alt;
    } else {
        modalImage.src = '';
        modalImage.alt = itemData.title;
    }
    
    // Устанавливаем информацию
    modalInfo.innerHTML = `
        <h3>${itemData.title}</h3>
        <p class="modal-description">${itemData.description}</p>
        <div class="modal-details">
            <p><strong>Мастер:</strong> ${itemData.master}</p>
            <p><strong>Дата выполнения:</strong> ${itemData.date}</p>
            <p><strong>Услуга:</strong> ${itemData.service}</p>
            <p><strong>Категории:</strong> ${itemData.categories.join(', ')}</p>
        </div>
        <a href="booking.html?service=${encodeURIComponent(itemData.service)}" class="btn btn-primary">
            <i class="fas fa-calendar-check"></i> Записаться на эту услугу
        </a>
    `;
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Настройка модального окна
function setupModal() {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    
    // Закрытие по кнопке
    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику вне контента
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Предзагрузка изображений
function preloadImages() {
    const images = document.querySelectorAll('.portfolio-image img, .ba-img, .story-image img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.classList.add('loading');
            img.addEventListener('load', function() {
                this.classList.remove('loading');
                this.classList.add('loaded');
            });
            img.addEventListener('error', function() {
                this.classList.remove('loading');
                // Обработка ошибки уже в HTML через onerror
            });
        }
    });
}
  