// Скрипт для страницы мастеров
document.addEventListener('DOMContentLoaded', function() {
    loadAllMasters();
});

// Загрузка всех мастеров с подробной информацией
async function loadAllMasters() {
    const container = document.getElementById('masters-container');
    if (!container) return;
    
    try {
        const masters = await window.beautySphereAPI.getMasters();
        
        if (!masters || masters.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1; padding: 40px;">
                    <h3>Информация о мастерах временно недоступна</h3>
                    <p>Пожалуйста, зайдите позже или свяжитесь с нами по телефону.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = masters.map(master => createMasterCard(master)).join('');
        
        // Добавляем обработчики для кнопок записи
        setupBookButtons();
        
    } catch (error) {
        console.error('Ошибка загрузки мастеров:', error);
        container.innerHTML = `
            <div class="text-center" style="grid-column: 1/-1; padding: 40px; color: #721c24;">
                <h3>Ошибка загрузки мастеров</h3>
                <p>Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.</p>
            </div>
        `;
    }
}

// Функция создания карточки мастера с полной информацией
function createMasterCard(master) {
    const initials = master.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const rating = getRandomRating();
    const certificates = generateCertificates(master.experience);
    
    return `
        <div class="master-card-detail" data-master-id="${master.id}">
            <div class="master-header">
                <div class="master-avatar">
                    ${initials}
                </div>
                <div class="master-info">
                    <h2 class="master-name">${master.name}</h2>
                    <div class="master-specialization">${master.specialization}</div>
                    <div class="master-rating">
                        <div class="stars">
                            ${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}
                        </div>
                        <span>${rating.toFixed(1)}/5.0</span>
                        <span class="master-experience">${master.experience} опыта</span>
                    </div>
                </div>
            </div>
            
            <div class="master-content">
                <p class="master-description">${master.description}</p>
                
                <div class="master-skills">
                    <h3 class="skills-title">Навыки и специализация</h3>
                    <div class="skills-list">
                        ${generateSkills(master.specialization).map(skill => `
                            <div class="skill-item">
                                <div class="skill-name">${skill.name}</div>
                                <div class="skill-level">
                                    <div class="skill-bar">
                                        <div class="skill-fill" style="width: ${skill.level}%"></div>
                                    </div>
                                    <span>${skill.level}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="certificates-section">
                    <h3 class="certificates-title">Сертификаты и награды</h3>
                    <div class="certificates-grid">
                        ${certificates.map(cert => `
                            <div class="certificate-card">
                                <div class="certificate-icon">
                                    <i class="fas fa-award"></i>
                                </div>
                                <div class="certificate-name">${cert.name}</div>
                                <div class="certificate-year">${cert.year}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="master-actions">
                    <a href="booking.html?master=${master.id}" class="btn btn-primary">
                        <i class="fas fa-calendar-check"></i> Записаться к мастеру
                    </a>
                    <button class="btn btn-outline view-portfolio-btn" data-master-id="${master.id}">
                        <i class="fas fa-images"></i> Посмотреть портфолио
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Генерация случайного рейтинга (для демо)
function getRandomRating() {
    return 4 + Math.random();
}

// Генерация сертификатов на основе опыта
function generateCertificates(experience) {
    const years = parseInt(experience);
    const certificates = [
        { name: "Мастер парикмахерского искусства", year: "2015" },
        { name: "Специалист по колористике", year: "2016" },
        { name: "Сертификат Vidal Sassoon", year: "2017" },
        { name: "Мастер стрижек и укладок", year: "2018" },
        { name: "Специалист по уходу за волосами", year: "2019" },
        { name: "Курс современного барберинга", year: "2020" },
        { name: "Сертификат L'Oréal Professionnel", year: "2021" },
        { name: "Мастер сложного окрашивания", year: "2022" },
        { name: "Курс по работе с кератином", year: "2023" },
        { name: "Специалист по наращиванию волос", year: "2024" }
    ];
    
    // Возвращаем сертификаты в зависимости от опыта
    return certificates.slice(0, Math.min(years + 2, certificates.length));
}

// Генерация навыков на основе специализации
function generateSkills(specialization) {
    const allSkills = {
        "Топ-стилист, колорист": [
            { name: "Сложное окрашивание", level: 95 },
            { name: "Колористика", level: 98 },
            { name: "Вечерние прически", level: 90 },
            { name: "Мелирование", level: 92 },
            { name: "Омбре", level: 88 },
            { name: "Шатуш", level: 85 }
        ],
        "Парикмахер-стилист": [
            { name: "Женские стрижки", level: 92 },
            { name: "Укладка", level: 90 },
            { name: "Детские стрижки", level: 88 },
            { name: "Стрижка горячими ножницами", level: 85 },
            { name: "Уход за волосами", level: 87 },
            { name: "Стрижка каре", level: 93 }
        ],
        "Барбер": [
            { name: "Мужские стрижки", level: 96 },
            { name: "Стрижка бороды", level: 94 },
            { name: "Королевское бритье", level: 90 },
            { name: "Уход за бородой", level: 92 },
            { name: "Моделирование усов", level: 88 },
            { name: "Стрижка машинкой", level: 95 }
        ],
        "Мастер по уходу": [
            { name: "Кератиновое выпрямление", level: 97 },
            { name: "Ламинирование волос", level: 94 },
            { name: "Восстановление волос", level: 96 },
            { name: "Пилинг кожи головы", level: 88 },
            { name: "SPA-процедуры", level: 92 },
            { name: "Ароматерапия", level: 85 }
        ]
    };
    
    return allSkills[specialization] || [
        { name: "Парикмахерское искусство", level: 90 },
        { name: "Стрижка", level: 85 },
        { name: "Окрашивание", level: 80 },
        { name: "Укладка", level: 75 }
    ];
}

// Настройка кнопок
function setupBookButtons() {
    // Обработчик для кнопки "Посмотреть портфолио"
    document.querySelectorAll('.view-portfolio-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const masterId = this.dataset.masterId;
            showMasterPortfolio(masterId);
        });
    });
}

// Показ портфолио мастера
function showMasterPortfolio(masterId) {
    // В реальном приложении здесь будет загрузка портфолио мастера
    alert('Портфолио мастера будет загружено в следующих версиях приложения. Сейчас вы можете посмотреть наши работы в разделе "Портфолио".');
}

// Добавляем обработчик для главной страницы (загрузка превью мастеров)
if (document.getElementById('masters-preview')) {
    document.addEventListener('DOMContentLoaded', async function() {
        try {
            const masters = await window.beautySphereAPI.getMasters();
            const container = document.getElementById('masters-preview');
            
            if (masters && masters.length > 0 && container) {
                const previewMasters = masters.slice(0, 4); // Показываем 4 мастера на главной
                
                container.innerHTML = previewMasters.map(master => `
                    <div class="master-card">
                        <div class="master-info">
                            <h3 class="master-name">${master.name}</h3>
                            <p class="master-specialization">${master.specialization}</p>
                            <p class="master-experience">Опыт: ${master.experience}</p>
                            <p class="master-description">${master.description}</p>
                            <div class="master-actions">
                                <a href="pages/masters.html#master-${master.id}" class="btn btn-outline">Подробнее</a>
                                <a href="pages/booking.html?master=${master.id}" class="btn btn-primary">Записаться</a>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Ошибка загрузки превью мастеров:', error);
        }
    });
}