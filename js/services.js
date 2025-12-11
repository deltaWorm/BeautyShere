// Скрипт для страницы услуг
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация страницы
    loadAllServices();
    setupCategoryTabs();
    setupCalculator();
    setupFAQ();
    
    // Загружаем услуги в калькулятор
    loadCalculatorServices();
});

// Загрузка всех услуг
async function loadAllServices() {
    const container = document.getElementById('services-container');
    if (!container) return;
    
    try {
        const services = await window.beautySphereData.getServices();
        
        if (!services || services.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1; padding: 40px;">
                    <h3>Услуги временно недоступны</h3>
                    <p>Пожалуйста, проверьте позже или свяжитесь с нами по телефону.</p>
                </div>
            `;
            return;
        }
        
        // Группируем услуги по категориям
        const groupedServices = groupServicesByCategory(services);
        
        // Создаем HTML для каждой категории
        let html = '';
        
        // Сначала отображаем все услуги в "Все услуги"
        html += `
            <div class="category-section" data-category="all" style="display: block;">
                <h2 class="category-title">Все услуги</h2>
                <p class="category-description">Полный перечень услуг нашей парикмахерской с ценами</p>
                <div class="services-grid">
                    ${services.map(service => createServiceCard(service)).join('')}
                </div>
            </div>
        `;
        
        // Теперь для каждой категории создаем отдельную секцию
        Object.entries(groupedServices).forEach(([category, categoryServices]) => {
            html += `
                <div class="category-section" data-category="${category}" style="display: none;">
                    <h2 class="category-title">${category}</h2>
                    <p class="category-description">${getCategoryDescription(category)}</p>
                    <div class="services-grid">
                        ${categoryServices.map(service => createServiceCard(service)).join('')}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Добавляем обработчики для кнопок добавления в калькулятор
        setupAddToCalculatorButtons();
        
    } catch (error) {
        console.error('Ошибка загрузки услуг:', error);
        container.innerHTML = `
            <div class="text-center" style="grid-column: 1/-1; padding: 40px; color: #721c24;">
                <h3>Ошибка загрузки услуг</h3>
                <p>Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.</p>
            </div>
        `;
    }
}

// Функция создания карточки услуги
function createServiceCard(service) {
    return `
        <div class="service-card" data-service-id="${service.id}" data-service-category="${service.category}">
            <div class="service-card-content">
                <div class="service-card-header">
                    <h3>${service.name}</h3>
                    <div class="service-price-badge">${service.price} руб.</div>
                </div>
                <div class="service-card-category">${service.category}</div>
                <div class="service-card-description">${service.description}</div>
                <div class="service-card-details">
                    <div class="service-duration">
                        <i class="fas fa-clock"></i> ${service.duration} мин.
                    </div>
                    <div class="service-popular">
                        <i class="fas fa-star"></i> Популярно
                    </div>
                </div>
                <div class="service-card-actions">
                    <button class="btn btn-primary add-to-calculator" data-service-id="${service.id}">
                        <i class="fas fa-calculator"></i> В калькулятор
                    </button>
                    <a href="booking.html?service=${service.id}" class="btn btn-secondary">
                        <i class="fas fa-calendar-check"></i> Записаться
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Описание категорий
function getCategoryDescription(category) {
    const descriptions = {
        "Мужские стрижки": "Современные мужские стрижки от опытных барберов",
        "Женские стрижки": "Стильные женские стрижки на любой вкус",
        "Окрашивание": "Профессиональное окрашивание волос",
        "Укладки": "Укладки для повседневных и праздничных образов",
        "Уход": "Процедуры по уходу и восстановлению волос",
        "Брови и ресницы": "Уход за бровями и ресницами",
        "Ногтевой сервис": "Маникюр и педикюр"
    };
    return descriptions[category] || "Профессиональные услуги";
}

// Группировка услуг по категориям
function groupServicesByCategory(services) {
    return services.reduce((groups, service) => {
        const category = service.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(service);
        return groups;
    }, {});
}

// Настройка вкладок категорий
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    const servicesContainer = document.getElementById('services-container');
    
    if (!tabs.length || !servicesContainer) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Обновляем активную вкладку
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Показываем/скрываем услуги
            const categorySections = servicesContainer.querySelectorAll('.category-section');
            
            categorySections.forEach(section => {
                if (category === 'all' || section.dataset.category === category) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Прокручиваем к началу секции
            window.scrollTo({
                top: servicesContainer.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
}

// Настройка кнопок добавления в калькулятор
function setupAddToCalculatorButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-calculator')) {
            const button = e.target.closest('.add-to-calculator');
            const serviceId = button.dataset.serviceId;
            
            // Находим карточку услуги
            const serviceItem = document.querySelector(`.service-card[data-service-id="${serviceId}"]`);
            
            if (serviceItem) {
                const serviceName = serviceItem.querySelector('h3').textContent;
                const servicePriceText = serviceItem.querySelector('.service-price-badge').textContent;
                const servicePrice = parseInt(servicePriceText.replace(' руб.', ''));
                const serviceCategory = serviceItem.dataset.serviceCategory;
                
                // Добавляем услугу в калькулятор
                addServiceToCalculator(serviceId, serviceName, servicePrice, serviceCategory);
                
                // Показываем уведомление
                showNotification(`Услуга "${serviceName}" добавлена в калькулятор`, 'success');
                
                // Делаем кнопку неактивной на 2 секунды
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = '<i class="fas fa-calculator"></i> В калькулятор';
                }, 2000);
            }
        }
    });
}

// Загрузка услуг для калькулятора
async function loadCalculatorServices() {
    try {
        const services = await window.beautySphereData.getServices();
        initCalculatorServices(services);
    } catch (error) {
        console.error('Ошибка загрузки услуг для калькулятора:', error);
    }
}

// Инициализация калькулятора услуг
function initCalculatorServices(services) {
    const calculatorContainer = document.getElementById('calculator-services');
    if (!calculatorContainer || !services) return;
    
    // Очищаем калькулятор
    calculatorContainer.innerHTML = '';
    
    // Создаем горизонтальный контейнер для услуг калькулятора
    const servicesScroll = document.createElement('div');
    servicesScroll.className = 'calculator-services-scroll';
    
    // Добавляем услуги в калькулятор
    services.forEach(service => {
        const serviceElement = document.createElement('div');
        serviceElement.className = 'calculator-service';
        serviceElement.dataset.serviceId = service.id;
        serviceElement.dataset.price = service.price;
        serviceElement.dataset.name = service.name;
        serviceElement.dataset.category = service.category;
        
        serviceElement.innerHTML = `
            <div class="calculator-service-content">
                <h4>${service.name}</h4>
                <div class="calculator-service-category">${service.category}</div>
                <div class="calculator-service-details">
                    <div class="price">${service.price} руб.</div>
                    <div class="duration">${service.duration} мин.</div>
                </div>
                <div class="calculator-service-select">
                    <button class="select-service-btn">
                        <i class="fas fa-plus"></i> Выбрать
                    </button>
                </div>
            </div>
        `;
        
        servicesScroll.appendChild(serviceElement);
    });
    
    calculatorContainer.appendChild(servicesScroll);
    
    // Добавляем кнопки управления калькулятором
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'calculator-controls';
    controlsDiv.innerHTML = `
        <div class="calculator-quick-actions">
            <button class="btn btn-outline" id="select-all-services">
                <i class="fas fa-check-double"></i> Выбрать все
            </button>
            <button class="btn btn-outline" id="clear-all-services">
                <i class="fas fa-times"></i> Очистить все
            </button>
            <button class="btn btn-primary" id="book-selected-services">
                <i class="fas fa-calendar-alt"></i> Записаться на выбранное
            </button>
        </div>
    `;
    
    calculatorContainer.appendChild(controlsDiv);
    
    // Инициализируем обработчики калькулятора
    setupCalculatorHandlers();
}

// Настройка обработчиков калькулятора
function setupCalculatorHandlers() {
    const calculator = document.getElementById('calculator-services');
    if (!calculator) return;
    
    // Обработчик выбора услуги в калькуляторе
    calculator.addEventListener('click', function(e) {
        // Выбор услуги
        if (e.target.closest('.select-service-btn')) {
            const button = e.target.closest('.select-service-btn');
            const serviceElement = button.closest('.calculator-service');
            
            if (serviceElement) {
                serviceElement.classList.toggle('selected');
                
                if (serviceElement.classList.contains('selected')) {
                    button.innerHTML = '<i class="fas fa-check"></i> Выбрано';
                    button.classList.add('selected');
                } else {
                    button.innerHTML = '<i class="fas fa-plus"></i> Выбрать';
                    button.classList.remove('selected');
                }
                
                updateTotalPrice();
            }
        }
    });
    
    // Кнопка "Выбрать все"
    document.getElementById('select-all-services')?.addEventListener('click', function() {
        const serviceElements = calculator.querySelectorAll('.calculator-service');
        serviceElements.forEach(element => {
            element.classList.add('selected');
            const button = element.querySelector('.select-service-btn');
            if (button) {
                button.innerHTML = '<i class="fas fa-check"></i> Выбрано';
                button.classList.add('selected');
            }
        });
        updateTotalPrice();
    });
    
    // Кнопка "Очистить все"
    document.getElementById('clear-all-services')?.addEventListener('click', function() {
        const serviceElements = calculator.querySelectorAll('.calculator-service');
        serviceElements.forEach(element => {
            element.classList.remove('selected');
            const button = element.querySelector('.select-service-btn');
            if (button) {
                button.innerHTML = '<i class="fas fa-plus"></i> Выбрать';
                button.classList.remove('selected');
            }
        });
        updateTotalPrice();
        localStorage.removeItem('selectedServices');
    });
    
    // Кнопка "Записаться на выбранное"
    document.getElementById('book-selected-services')?.addEventListener('click', function() {
        const selectedServices = calculator.querySelectorAll('.calculator-service.selected');
        
        if (selectedServices.length === 0) {
            showNotification('Пожалуйста, выберите хотя бы одну услугу', 'error');
            return;
        }
        
        // Собираем данные о выбранных услугах
        const servicesData = Array.from(selectedServices).map(service => ({
            id: service.dataset.serviceId,
            name: service.dataset.name,
            price: parseInt(service.dataset.price),
            category: service.dataset.category
        }));
        
        // Сохраняем в localStorage для страницы записи
        localStorage.setItem('selectedServicesForBooking', JSON.stringify(servicesData));
        
        // Перенаправляем на страницу записи
        window.location.href = 'booking.html';
    });
}

// Функция добавления услуги в калькулятор
function addServiceToCalculator(serviceId, serviceName, price, category) {
    const calculatorContainer = document.getElementById('calculator-services');
    if (!calculatorContainer) return;
    
    // Ищем, есть ли уже такая услуга в калькуляторе
    const servicesScroll = calculatorContainer.querySelector('.calculator-services-scroll');
    if (!servicesScroll) return;
    
    const existingService = servicesScroll.querySelector(`.calculator-service[data-service-id="${serviceId}"]`);
    
    if (existingService) {
        // Если услуга уже есть, просто выделяем ее
        existingService.classList.add('selected');
        const button = existingService.querySelector('.select-service-btn');
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> Выбрано';
            button.classList.add('selected');
        }
    } else {
        // Создаем новую карточку услуги в калькуляторе
        const serviceElement = document.createElement('div');
        serviceElement.className = 'calculator-service selected';
        serviceElement.dataset.serviceId = serviceId;
        serviceElement.dataset.price = price;
        serviceElement.dataset.name = serviceName;
        serviceElement.dataset.category = category;
        
        serviceElement.innerHTML = `
            <div class="calculator-service-content">
                <h4>${serviceName}</h4>
                <div class="calculator-service-category">${category}</div>
                <div class="calculator-service-details">
                    <div class="price">${price} руб.</div>
                </div>
                <div class="calculator-service-select">
                    <button class="select-service-btn selected">
                        <i class="fas fa-check"></i> Выбрано
                    </button>
                </div>
            </div>
        `;
        
        // Добавляем в начало
        servicesScroll.insertBefore(serviceElement, servicesScroll.firstChild);
    }
    
    // Обновляем общую стоимость
    updateTotalPrice();
}

// Обновление общей стоимости
function updateTotalPrice() {
    const calculator = document.getElementById('calculator-services');
    if (!calculator) return;
    
    const selectedServices = calculator.querySelectorAll('.calculator-service.selected');
    let total = 0;
    let servicesCount = 0;
    
    selectedServices.forEach(service => {
        const price = parseInt(service.dataset.price);
        if (!isNaN(price)) {
            total += price;
            servicesCount++;
        }
    });
    
    // Обновляем отображение цены
    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `${total} руб.`;
        
        // Обновляем кнопку записи
        const bookButton = document.getElementById('book-selected-services');
        if (bookButton) {
            bookButton.innerHTML = `<i class="fas fa-calendar-alt"></i> Записаться (${servicesCount} услуг${servicesCount === 1 ? 'а' : ''})`;
        }
    }
}

// Настройка FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');
        
        if (question && toggle && answer) {
            // Изначально скрываем ответ
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease';
            
            question.addEventListener('click', function() {
                // Закрываем другие открытые вопросы
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherToggle = otherItem.querySelector('.faq-toggle');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                        if (otherToggle) {
                            otherToggle.textContent = '+';
                        }
                    }
                });
                
                // Переключаем текущий вопрос
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    toggle.textContent = '−';
                } else {
                    answer.style.maxHeight = '0';
                    toggle.textContent = '+';
                }
            });
        }
    });
}

// Показ уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Обработка URL параметров
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
}

// При загрузке страницы
window.addEventListener('load', function() {
    const params = getUrlParams();
    if (params.category) {
        const tab = document.querySelector(`.category-tab[data-category="${params.category}"]`);
        if (tab) {
            tab.click();
        }
    }
    
    // Восстанавливаем выбранные услуги из localStorage
    const selectedServices = JSON.parse(localStorage.getItem('selectedServicesForBooking') || '[]');
    selectedServices.forEach(service => {
        addServiceToCalculator(service.id, service.name, service.price, service.category);
    });
    
    // Очищаем localStorage после восстановления
    localStorage.removeItem('selectedServicesForBooking');
    
    updateTotalPrice();
});

// Добавляем CSS стили для страницы услуг
const serviceStyles = `
    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
        margin-top: 20px;
    }
    
    .service-card {
        background: white;
        border: 2px solid #e0e6ef;
        border-radius: 12px;
        padding: 25px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    
    .service-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        border-color: #4db6ac;
    }
    
    .service-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
    }
    
    .service-card-header h3 {
        color: #2c3e50;
        margin: 0;
        font-size: 18px;
        flex: 1;
    }
    
    .service-price-badge {
        background: linear-gradient(135deg, #4db6ac 0%, #2c8c99 100%);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 16px;
        margin-left: 10px;
    }
    
    .service-card-category {
        background: rgba(77, 182, 172, 0.1);
        color: #4db6ac;
        padding: 6px 12px;
        border-radius: 15px;
        display: inline-block;
        margin-bottom: 15px;
        font-size: 13px;
        font-weight: 600;
    }
    
    .service-card-description {
        color: #7f8c8d;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 20px;
        min-height: 60px;
    }
    
    .service-card-details {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    
    .service-duration, .service-popular {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #f8f9fa;
        color: #7f8c8d;
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 13px;
    }
    
    .service-popular {
        background: #fff8e1;
        color: #ff9800;
    }
    
    .service-card-actions {
        display: flex;
        gap: 10px;
    }
    
    .service-card-actions .btn {
        flex: 1;
        padding: 10px 15px;
        font-size: 14px;
    }
    
    .category-title {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 28px;
    }
    
    .category-description {
        color: #7f8c8d;
        margin-bottom: 30px;
        font-size: 16px;
        line-height: 1.6;
    }
    
    .category-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 40px;
        flex-wrap: wrap;
        border-bottom: 2px solid #e0e6ef;
        padding-bottom: 20px;
    }
    
    .category-tab {
        padding: 12px 24px;
        background: #f8f9fa;
        border: 2px solid #e0e6ef;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        color: #7f8c8d;
        transition: all 0.3s ease;
    }
    
    .category-tab:hover {
        background: #e9ecef;
        color: #495057;
        border-color: #4db6ac;
    }
    
    .category-tab.active {
        background: #4db6ac;
        color: white;
        border-color: #4db6ac;
    }
    
    .calculator-services-scroll {
        display: flex;
        overflow-x: auto;
        padding: 20px 10px;
        gap: 20px;
        margin-bottom: 20px;
        scrollbar-width: thin;
        scrollbar-color: #4db6ac #f0f0f0;
    }
    
    .calculator-services-scroll::-webkit-scrollbar {
        height: 8px;
    }
    
    .calculator-services-scroll::-webkit-scrollbar-track {
        background: #f0f0f0;
        border-radius: 4px;
    }
    
    .calculator-services-scroll::-webkit-scrollbar-thumb {
        background: #4db6ac;
        border-radius: 4px;
    }
    
    .calculator-services-scroll::-webkit-scrollbar-thumb:hover {
        background: #26a69a;
    }
    
    .calculator-service {
        background: white;
        border: 2px solid #e0e6ef;
        border-radius: 10px;
        padding: 20px;
        transition: all 0.3s ease;
        min-width: 250px;
        max-width: 300px;
        flex-shrink: 0;
    }
    
    .calculator-service:hover {
        border-color: #4db6ac;
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .calculator-service.selected {
        background: rgba(77, 182, 172, 0.05);
        border-color: #4db6ac;
    }
    
    .calculator-service-content h4 {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 16px;
    }
    
    .calculator-service-category {
        background: rgba(77, 182, 172, 0.1);
        color: #4db6ac;
        padding: 5px 10px;
        border-radius: 15px;
        display: inline-block;
        margin-bottom: 15px;
        font-size: 12px;
    }
    
    .calculator-service-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
    }
    
    .calculator-service-details .price {
        font-size: 18px;
        font-weight: 700;
        color: #4db6ac;
    }
    
    .calculator-service-details .duration {
        color: #7f8c8d;
        font-size: 14px;
    }
    
    .select-service-btn {
        width: 100%;
        padding: 10px;
        background: #f8f9fa;
        border: 2px solid #e0e6ef;
        border-radius: 8px;
        color: #2c3e50;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .select-service-btn:hover {
        border-color: #4db6ac;
        color: #4db6ac;
    }
    
    .select-service-btn.selected {
        background: #4db6ac;
        border-color: #4db6ac;
        color: white;
    }
    
    .calculator-controls {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #e0e6ef;
    }
    
    .calculator-quick-actions {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    
    .calculator-quick-actions .btn {
        flex: 1;
        min-width: 150px;
    }
    
    .total-price {
        font-size: 24px;
        font-weight: 700;
        color: #4db6ac;
        text-align: center;
        margin: 20px 0;
    }
    
    @media (max-width: 768px) {
        .services-grid {
            grid-template-columns: 1fr;
        }
        
        .category-tabs {
            justify-content: center;
        }
        
        .category-tab {
            padding: 10px 20px;
            font-size: 14px;
        }
        
        .calculator-quick-actions {
            flex-direction: column;
        }
        
        .calculator-quick-actions .btn {
            width: 100%;
        }
        
        .service-card-actions {
            flex-direction: column;
        }
        
        .service-card-actions .btn {
            width: 100%;
        }
    }
`;
const serviceStyleElement = document.createElement('style');
serviceStyleElement.textContent = serviceStyles;
document.head.appendChild(serviceStyleElement);