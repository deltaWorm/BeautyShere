// Скрипт для личного кабинета
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    setupEventListeners();
});

// Проверка состояния авторизации
function checkAuthState() {
    const user = getAuthState();
    const container = document.getElementById('cabinet-container');
    
    if (!container) return;
    
    if (user) {
        // Пользователь авторизован - показываем личный кабинет
        showUserCabinet(user);
    } else {
        // Пользователь не авторизован - показываем форму входа
        showLoginForm();
    }
}

// Показ формы входа
function showLoginForm() {
    const container = document.getElementById('cabinet-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="login-form">
            <h2>Вход в личный кабинет</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" required>
                </div>
                
                <div class="form-group">
                    <label for="login-password">Пароль</label>
                    <input type="password" id="login-password" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Войти</button>
                
                <div class="form-links">
                    <p>Нет аккаунта? <a href="#" id="register-link">Зарегистрироваться</a></p>
                    <p><a href="#" id="forgot-password">Забыли пароль?</a></p>
                </div>
            </form>
        </div>
    `;
    
    // Настраиваем форму входа
    setupLoginForm();
}

// Показ личного кабинета пользователя
function showUserCabinet(user) {
    const container = document.getElementById('cabinet-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="cabinet-tabs">
            <button class="cabinet-tab active" data-tab="profile">Профиль</button>
            <button class="cabinet-tab" data-tab="appointments">Мои записи</button>
            <button class="cabinet-tab" data-tab="history">История посещений</button>
            <button class="cabinet-tab" data-tab="settings">Настройки</button>
            <button class="cabinet-tab" id="logout-btn">Выйти</button>
        </div>
        
        <div class="cabinet-content">
            <div class="cabinet-tab-content active" id="tab-profile">
                <div class="profile-info">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            ${user.name ? user.name.charAt(0).toUpperCase() : 'П'}
                        </div>
                        <div>
                            <h2>${user.name || user.email}</h2>
                            <p>${user.email}</p>
                        </div>
                    </div>
                    
                    <div class="profile-stats">
                        <div class="stat-card">
                            <div class="stat-number" id="total-appointments">0</div>
                            <div class="stat-label">Всего записей</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="completed-appointments">0</div>
                            <div class="stat-label">Завершено</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="upcoming-appointments">0</div>
                            <div class="stat-label">Предстоящие</div>
                        </div>
                    </div>
                    
                    <div class="profile-details">
                        <h3>Личная информация</h3>
                        <form id="profile-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="profile-name">Имя</label>
                                    <input type="text" id="profile-name" value="${user.name || ''}">
                                </div>
                                <div class="form-group">
                                    <label for="profile-phone">Телефон</label>
                                    <input type="tel" id="profile-phone" value="${user.phone || ''}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="profile-email">Email</label>
                                <input type="email" id="profile-email" value="${user.email}" readonly>
                            </div>
                            <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div class="cabinet-tab-content" id="tab-appointments">
                <h2>Мои записи</h2>
                <div class="appointments-list" id="appointments-list">
                    <!-- Записи загружаются через JS -->
                </div>
            </div>
            
            <div class="cabinet-tab-content" id="tab-history">
                <h2>История посещений</h2>
                <div class="history-list" id="history-list">
                    <!-- История загружается через JS -->
                </div>
            </div>
            
            <div class="cabinet-tab-content" id="tab-settings">
                <h2>Настройки</h2>
                <div class="settings-options">
                    <div class="setting-item">
                        <h3>Уведомления</h3>
                        <div class="setting-control">
                            <label class="switch">
                                <input type="checkbox" id="notifications-email" checked>
                                <span class="slider"></span>
                            </label>
                            <span>Email уведомления</span>
                        </div>
                        <div class="setting-control">
                            <label class="switch">
                                <input type="checkbox" id="notifications-sms">
                                <span class="slider"></span>
                            </label>
                            <span>SMS уведомления</span>
                        </div>
                    </div>
                    
                    <div class="setting-item">
                        <h3>Смена пароля</h3>
                        <form id="password-form">
                            <div class="form-group">
                                <label for="current-password">Текущий пароль</label>
                                <input type="password" id="current-password">
                            </div>
                            <div class="form-group">
                                <label for="new-password">Новый пароль</label>
                                <input type="password" id="new-password">
                            </div>
                            <div class="form-group">
                                <label for="confirm-password">Подтверждение пароля</label>
                                <input type="password" id="confirm-password">
                            </div>
                            <button type="submit" class="btn btn-primary">Сменить пароль</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Загружаем данные пользователя
    loadUserData(user);
    setupCabinetTabs();
    setupProfileForm();
    setupSettings();
    setupLogout();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Обработчик для регистрации
    document.addEventListener('click', function(e) {
        if (e.target.id === 'register-link') {
            e.preventDefault();
            showRegistrationForm();
        }
        
        if (e.target.id === 'forgot-password') {
            e.preventDefault();
            showPasswordResetForm();
        }
    });
}

// Настройка формы входа
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        // Валидация
        if (!email || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }
        
        try {
            // Имитация авторизации (в реальном приложении здесь будет запрос к API)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Создаем пользователя (для демо)
            const user = {
                id: Date.now(),
                email: email,
                name: email.split('@')[0],
                phone: '',
                role: 'user'
            };
            
            // Сохраняем данные пользователя
            saveAuthState(user);
            
            alert('Вход выполнен успешно!');
            location.reload();
            
        } catch (error) {
            console.error('Ошибка сети:', error);
            alert('Ошибка сети. Пожалуйста, попробуйте позже.');
        }
    });
}

// Показ формы регистрации
function showRegistrationForm() {
    const container = document.getElementById('cabinet-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="registration-form">
            <h2>Регистрация</h2>
            <form id="registration-form">
                <div class="form-group">
                    <label for="reg-name">Имя *</label>
                    <input type="text" id="reg-name" required>
                </div>
                
                <div class="form-group">
                    <label for="reg-email">Email *</label>
                    <input type="email" id="reg-email" required>
                </div>
                
                <div class="form-group">
                    <label for="reg-phone">Телефон *</label>
                    <input type="tel" id="reg-phone" required>
                </div>
                
                <div class="form-group">
                    <label for="reg-password">Пароль *</label>
                    <input type="password" id="reg-password" required>
                </div>
                
                <div class="form-group">
                    <label for="reg-confirm-password">Подтверждение пароля *</label>
                    <input type="password" id="reg-confirm-password" required>
                </div>
                
                <div class="form-check">
                    <input type="checkbox" id="reg-agree" required>
                    <label for="reg-agree">
                        Я согласен на обработку персональных данных
                    </label>
                </div>
                
                <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
                
                <div class="form-links">
                    <p>Уже есть аккаунт? <a href="#" id="login-link">Войти</a></p>
                </div>
            </form>
        </div>
    `;
    
    // Настраиваем форму регистрации
    setupRegistrationForm();
    
    // Обработчик для ссылки "Войти"
    document.getElementById('login-link').addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
}

// Показ формы восстановления пароля
function showPasswordResetForm() {
    const container = document.getElementById('cabinet-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="password-reset-form">
            <h2>Восстановление пароля</h2>
            <p>Введите email, указанный при регистрации</p>
            <form id="password-reset-form">
                <div class="form-group">
                    <label for="reset-email">Email</label>
                    <input type="email" id="reset-email" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Восстановить пароль</button>
                
                <div class="form-links">
                    <p><a href="#" id="back-to-login">Вернуться к входу</a></p>
                </div>
            </form>
        </div>
    `;
    
    // Настраиваем форму восстановления
    setupPasswordResetForm();
    
    // Обработчик для ссылки "Вернуться к входу"
    document.getElementById('back-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
}

// Настройка формы регистрации
function setupRegistrationForm() {
    const form = document.getElementById('registration-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        // Валидация
        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }
        
        if (password.length < 6) {
            alert('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        // Имитация регистрации
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Создаем пользователя
            const user = {
                id: Date.now(),
                email,
                name,
                phone,
                role: 'user'
            };
            
            // Сохраняем в localStorage
            saveAuthState(user);
            
            alert('Регистрация успешна! Добро пожаловать в личный кабинет.');
            location.reload();
            
        } catch (error) {
            alert('Ошибка регистрации. Пожалуйста, попробуйте позже.');
        }
    });
}

// Настройка формы восстановления пароля
function setupPasswordResetForm() {
    const form = document.getElementById('password-reset-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('reset-email').value.trim();
        
        if (!email || !validateEmail(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }
        
        // Имитация отправки
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Инструкции по восстановлению пароля отправлены на вашу почту.');
            showLoginForm();
        } catch (error) {
            alert('Ошибка отправки. Пожалуйста, попробуйте позже.');
        }
    });
}

// Загрузка данных пользователя
function loadUserData(user) {
    loadUserAppointments(user);
    updateUserStats();
}

// Загрузка записей пользователя
function loadUserAppointments(user) {
    const container = document.getElementById('appointments-list');
    const historyContainer = document.getElementById('history-list');
    
    if (!container) return;
    
    try {
        // Получаем все записи из localStorage
        let allAppointments = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
        
        // Фильтруем записи пользователя по нескольким критериям:
        // 1. По userId если пользователь авторизован
        // 2. По email пользователя
        // 3. По email в client.email
        let userAppointments = [];
        
        if (user && user.id) {
            // Ищем записи по userId
            userAppointments = allAppointments.filter(app => {
                // Проверяем несколько возможных мест хранения данных пользователя
                return app.userId === user.id || 
                       app.clientEmail === user.email ||
                       (app.client && app.client.email === user.email);
            });
        }
        
        // Также проверяем записи по email, если пользователь указал его при записи
        if (user && user.email) {
            const emailAppointments = allAppointments.filter(app => {
                return app.clientEmail === user.email || 
                       (app.client && app.client.email === user.email);
            });
            
            // Объединяем, убирая дубликаты по id
            const combined = [...userAppointments, ...emailAppointments];
            const uniqueIds = new Set();
            userAppointments = [];
            
            combined.forEach(app => {
                if (!uniqueIds.has(app.id)) {
                    uniqueIds.add(app.id);
                    userAppointments.push(app);
                }
            });
        }
        
        // Если записей нет, показываем пустое состояние
        if (userAppointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <h3>У вас пока нет записей</h3>
                    <p>Запишитесь на услугу, чтобы увидеть ее здесь</p>
                    <a href="../pages/booking.html" class="btn btn-primary">Записаться сейчас</a>
                </div>
            `;
            
            if (historyContainer) {
                historyContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <h3>История посещений пуста</h3>
                        <p>После завершения услуг они появятся здесь</p>
                    </div>
                `;
            }
            
            return;
        }
        
        // Разделяем на активные (будущие) и историю (прошлые/отмененные)
        const now = new Date();
        const activeAppointments = [];
        const historyAppointments = [];
        
        userAppointments.forEach(app => {
            if (!app.date || !app.time) {
                historyAppointments.push({...app, type: 'unknown'});
                return;
            }
            
            try {
                const appointmentDate = new Date(`${app.date}T${app.time}`);
                
                if (app.status === 'cancelled' || app.status === 'completed') {
                    historyAppointments.push({...app, type: app.status});
                } else if (appointmentDate < now) {
                    // Прошедшие записи считаем завершенными
                    historyAppointments.push({...app, type: 'completed'});
                } else {
                    activeAppointments.push(app);
                }
            } catch (error) {
                console.error('Ошибка обработки даты записи:', app, error);
                historyAppointments.push({...app, type: 'error'});
            }
        });
        
        // Сортируем активные записи по дате
        activeAppointments.sort((a, b) => {
            try {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            } catch (error) {
                return 0;
            }
        });
        
        // Сортируем исторические записи по дате (новые первыми)
        historyAppointments.sort((a, b) => {
            try {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateB - dateA;
            } catch (error) {
                return 0;
            }
        });
        
        // Отображаем активные записи
        if (activeAppointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-check"></i>
                    <h3>Нет активных записей</h3>
                    <p>У вас нет предстоящих визитов</p>
                    <a href="../pages/booking.html" class="btn btn-primary">Записаться сейчас</a>
                </div>
            `;
        } else {
            container.innerHTML = activeAppointments.map(app => renderAppointmentCard(app)).join('');
            // Настраиваем обработчики кнопок для активных записей
            setTimeout(() => {
                setupAppointmentActions();
            }, 100);
        }
        
        // Отображаем историю
        if (historyContainer) {
            if (historyAppointments.length === 0) {
                historyContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <h3>История посещений пуста</h3>
                        <p>После завершения услуг они появятся здесь</p>
                    </div>
                `;
            } else {
                historyContainer.innerHTML = historyAppointments.map(app => renderHistoryItem(app)).join('');
            }
        }
        
        // Обновляем статистику
        updateUserStats(activeAppointments, historyAppointments);
        
    } catch (error) {
        console.error('Ошибка загрузки записей:', error);
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Ошибка загрузки записей</h3>
                <p>Пожалуйста, попробуйте позже</p>
                <button onclick="location.reload()" class="btn btn-outline" style="margin-top: 20px;">
                    Обновить страницу
                </button>
            </div>
        `;
    }
}

// Обновление статистики пользователя
function updateUserStats(activeAppointments = [], historyAppointments = []) {
    const completed = historyAppointments.filter(item => item.type === 'completed').length;
    const cancelled = historyAppointments.filter(item => item.type === 'cancelled').length;
    const upcoming = activeAppointments.length;
    const total = upcoming + completed + cancelled;
    
    document.getElementById('total-appointments').textContent = total;
    document.getElementById('completed-appointments').textContent = completed;
    document.getElementById('upcoming-appointments').textContent = upcoming;
}

// Функция для рендеринга карточки записи
function renderAppointmentCard(appointment) {
    const date = new Date(`${appointment.date}T${appointment.time}`);
    const formattedDate = date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let servicesText = '';
    if (appointment.services && appointment.services.length > 0) {
        if (appointment.services.length === 1) {
            servicesText = appointment.services[0].name;
        } else {
            servicesText = `${appointment.services.length} услуг`;
        }
    }
    
    return `
        <div class="appointment-item" data-id="${appointment.id}">
            <div class="appointment-header">
                <h3>${servicesText}</h3>
                <span class="appointment-status ${getStatusClass(appointment.status)}">
                    ${getStatusText(appointment.status)}
                </span>
            </div>
            
            <div class="appointment-details">
                <div class="detail-item">
                    <span class="detail-label">Мастер:</span>
                    <span class="detail-value">${appointment.master?.name || 'Не указан'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Дата и время:</span>
                    <span class="detail-value">
                        ${formattedDate}, ${formattedTime}
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Стоимость:</span>
                    <span class="detail-value">${appointment.totalPrice || '0'} руб.</span>
                </div>
                ${appointment.clientComment ? `
                <div class="detail-item">
                    <span class="detail-label">Комментарий:</span>
                    <span class="detail-value">${appointment.clientComment}</span>
                </div>
                ` : ''}
            </div>
            
            ${appointment.status === 'pending' || appointment.status === 'confirmed' ? `
                <div class="appointment-actions">
                    <button type="button" class="btn btn-outline cancel-appointment-btn" data-id="${appointment.id}">
                        Отменить запись
                    </button>
                    <button type="button" class="btn btn-secondary edit-appointment-btn" data-id="${appointment.id}">
                        Перенести
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// Функция для рендеринга элемента истории
function renderHistoryItem(appointment) {
    const date = new Date(`${appointment.date}T${appointment.time}`);
    const formattedDate = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let servicesText = '';
    if (appointment.services && appointment.services.length > 0) {
        servicesText = appointment.services.map(s => s.name).join(', ');
    }
    
    return `
        <div class="history-item ${appointment.type}">
            <div class="history-date">
                ${formattedDate}
                <span class="history-type ${appointment.type}">
                    ${appointment.type === 'completed' ? 'Завершено' : 'Отменено'}
                </span>
            </div>
            <div class="history-content">
                <h4>${servicesText || 'Услуга'}</h4>
                <p><strong>Мастер:</strong> ${appointment.master?.name || 'Не указан'}</p>
                <p><strong>Стоимость:</strong> ${appointment.totalPrice || '0'} руб.</p>
                ${appointment.clientComment ? `
                    <div class="history-comment">
                        <strong>Комментарий:</strong> ${appointment.clientComment}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Обновление статистики пользователя
function updateUserStats(appointments = []) {
    const total = appointments.length;
    const completed = appointments.filter(apt => {
        if (!apt.date || !apt.time) return false;
        const appointmentDate = new Date(`${apt.date}T${apt.time}`);
        return appointmentDate < new Date() && apt.status !== 'cancelled';
    }).length;
    const upcoming = appointments.filter(apt => {
        if (!apt.date || !apt.time) return false;
        const appointmentDate = new Date(`${apt.date}T${apt.time}`);
        return appointmentDate >= new Date() && apt.status !== 'cancelled';
    }).length;
    
    document.getElementById('total-appointments').textContent = total;
    document.getElementById('completed-appointments').textContent = completed;
    document.getElementById('upcoming-appointments').textContent = upcoming;
}

// Настройка вкладок личного кабинета
function setupCabinetTabs() {
    const tabs = document.querySelectorAll('.cabinet-tab:not(#logout-btn)');
    const tabContents = document.querySelectorAll('.cabinet-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Обновляем активную вкладку
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Показываем соответствующий контент
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${tabId}`) {
                    content.classList.add('active');
                }
            });
            
            // При переключении на вкладку записей обновляем их
            if (tabId === 'appointments' || tabId === 'history') {
                const user = getAuthState();
                if (user) {
                    loadUserAppointments(user);
                }
            }
        });
    });
}

// Настройка формы профиля
function setupProfileForm() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('profile-name').value.trim();
        const phone = document.getElementById('profile-phone').value.trim();
        
        // Валидация
        if (!name) {
            alert('Пожалуйста, введите имя');
            return;
        }
        
        // Обновляем данные пользователя
        const user = getAuthState();
        if (user) {
            user.name = name;
            user.phone = phone;
            saveAuthState(user);
            
            // Обновляем отображение
            document.querySelector('.profile-header h2').textContent = name;
            document.querySelector('.profile-avatar').textContent = name.charAt(0).toUpperCase();
            
            showNotification('Данные профиля успешно обновлены', 'success');
        }
    });
}

// Настройка настроек
function setupSettings() {
    // Настройки уведомлений
    const emailNotify = document.getElementById('notifications-email');
    const smsNotify = document.getElementById('notifications-sms');
    
    // Загружаем сохраненные настройки
    const user = getAuthState();
    if (user && user.settings) {
        if (emailNotify) emailNotify.checked = user.settings.notifications_email !== false;
        if (smsNotify) smsNotify.checked = user.settings.notifications_sms === true;
    }
    
    if (emailNotify) {
        emailNotify.addEventListener('change', function() {
            saveSetting('notifications_email', this.checked);
            showNotification('Настройки уведомлений сохранены', 'success');
        });
    }
    
    if (smsNotify) {
        smsNotify.addEventListener('change', function() {
            saveSetting('notifications_sms', this.checked);
            showNotification('Настройки уведомлений сохранены', 'success');
        });
    }
    
    // Форма смены пароля
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const current = document.getElementById('current-password').value;
            const newPass = document.getElementById('new-password').value;
            const confirm = document.getElementById('confirm-password').value;
            
            if (!current || !newPass || !confirm) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            if (newPass.length < 6) {
                alert('Новый пароль должен содержать минимум 6 символов');
                return;
            }
            
            if (newPass !== confirm) {
                alert('Новый пароль и подтверждение не совпадают');
                return;
            }
            
            // Имитация смены пароля
            showNotification('Пароль успешно изменен', 'success');
            this.reset();
        });
    }
}

// Настройка выхода
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            clearAuthState();
            location.reload();
        }
    });
}

// Настройка действий с записями
function setupAppointmentActions() {
    // Отмена записи
    document.querySelectorAll('.cancel-appointment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.dataset.id;
            cancelAppointment(appointmentId);
        });
    });
    
    // Редактирование записи
    document.querySelectorAll('.edit-appointment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.dataset.id;
            editAppointment(appointmentId);
        });
    });
}

// Отмена записи
function cancelAppointment(appointmentId) {
    if (!confirm('Вы уверены, что хотите отменить запись?')) return;
    
    // Получаем записи из общего хранилища
    let allAppointments = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
    const appointmentIndex = allAppointments.findIndex(apt => apt.id == appointmentId);
    
    if (appointmentIndex !== -1) {
        allAppointments[appointmentIndex].status = 'cancelled';
        localStorage.setItem('beautySphereAppointments', JSON.stringify(allAppointments));
        
        // Обновляем отображение
        const user = getAuthState();
        if (user) {
            loadUserAppointments(user);
        }
        
        // Показываем уведомление
        showNotification('Запись успешно отменена', 'success');
    }
}

// Редактирование записи
function editAppointment(appointmentId) {
    // Получаем запись
    let allAppointments = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
    const appointment = allAppointments.find(apt => apt.id == appointmentId);
    
    if (!appointment) {
        showNotification('Запись не найдена', 'error');
        return;
    }
    
    // Сохраняем запись для редактирования
    localStorage.setItem('editingAppointment', JSON.stringify(appointment));
    
    // Перенаправляем на страницу записи
    window.location.href = `../pages/booking.html?edit=${appointmentId}`;
}
// Миграция старых данных
function migrateOldData() {
    try {
        // Получаем все записи
        const appointments = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
        let needsUpdate = false;
        
        // Проверяем старые записи и добавляем недостающие поля
        const updatedAppointments = appointments.map(app => {
            if (!app.hasOwnProperty('clientEmail') && app.client && app.client.email) {
                app.clientEmail = app.client.email;
                needsUpdate = true;
            }
            
            // Если есть пользователь в системе, добавляем userId
            const user = getAuthState();
            if (user && user.id && !app.userId) {
                if (app.clientEmail === user.email || (app.client && app.client.email === user.email)) {
                    app.userId = user.id;
                    needsUpdate = true;
                }
            }
            
            return app;
        });
        
        // Если были изменения, сохраняем обратно
        if (needsUpdate) {
            localStorage.setItem('beautySphereAppointments', JSON.stringify(updatedAppointments));
            console.log('Данные мигрированы');
        }
    } catch (error) {
        console.error('Ошибка миграции данных:', error);
    }
}

// Вызов миграции при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    migrateOldData();
    // остальной код инициализации...
});
// Вспомогательные функции авторизации
function getAuthState() {
    const user = localStorage.getItem('beauty-sphere-user');
    return user ? JSON.parse(user) : null;
}

function saveAuthState(user) {
    localStorage.setItem('beauty-sphere-user', JSON.stringify(user));
}

function clearAuthState() {
    localStorage.removeItem('beauty-sphere-user');
}

function getStatusClass(status) {
    const classes = {
        pending: 'status-pending',
        confirmed: 'status-confirmed',
        completed: 'status-completed',
        cancelled: 'status-cancelled'
    };
    return classes[status] || 'status-pending';
}

function getStatusText(status) {
    const texts = {
        pending: 'Ожидает',
        confirmed: 'Подтверждена',
        completed: 'Завершена',
        cancelled: 'Отменена'
    };
    return texts[status] || 'Ожидает';
}

function saveSetting(key, value) {
    const user = getAuthState();
    if (user) {
        user.settings = user.settings || {};
        user.settings[key] = value;
        saveAuthState(user);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Показ уведомлений
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
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Добавляем CSS стили для личного кабинета
const cabinetStyles = `
    .cabinet-container {
        max-width: 1000px;
        margin: 0 auto;
    }
    
    .login-form,
    .registration-form,
    .password-reset-form {
        max-width: 500px;
        margin: 0 auto;
        background-color: var(--white);
        padding: 40px;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .login-form h2,
    .registration-form h2,
    .password-reset-form h2 {
        text-align: center;
        margin-bottom: 30px;
        color: var(--dark);
    }
    
    .form-links {
        margin-top: 20px;
        text-align: center;
    }
    
    .form-links a {
        color: var(--primary);
        text-decoration: none;
    }
    
    .form-links a:hover {
        text-decoration: underline;
    }
    
    .form-check {
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .form-check input {
        width: 18px;
        height: 18px;
    }
    
    .form-check label {
        font-size: 14px;
        color: var(--gray);
        cursor: pointer;
    }
    
    .cabinet-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    }
    
    .cabinet-tab {
        padding: 12px 24px;
        background: #f8f9fa;
        border: 2px solid #e0e6ef;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        color: #7f8c8d;
        transition: all 0.3s ease;
    }
    
    .cabinet-tab:hover {
        background: #e9ecef;
        color: #495057;
        border-color: #4db6ac;
    }
    
    .cabinet-tab.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
    }
    
    #logout-btn {
        background: #dc3545;
        color: white;
        border-color: #dc3545;
    }
    
    #logout-btn:hover {
        background: #c82333;
        border-color: #bd2130;
    }
    
    .cabinet-tab-content {
        display: none;
    }
    
    .cabinet-tab-content.active {
        display: block;
    }
    
    .profile-info {
        background-color: var(--white);
        padding: 40px;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .profile-header {
        display: flex;
        align-items: center;
        gap: 30px;
        margin-bottom: 40px;
    }
    
    .profile-avatar {
        width: 100px;
        height: 100px;
        background-color: var(--primary);
        color: var(--white);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        font-weight: bold;
    }
    
    .profile-header h2 {
        color: var(--dark);
        margin-bottom: 5px;
    }
    
    .profile-header p {
        color: var(--gray);
    }
    
    .profile-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }
    
    .stat-card {
        background-color: var(--light);
        padding: 25px;
        border-radius: var(--radius);
        text-align: center;
        border: 2px solid var(--primary-light);
    }
    
    .stat-number {
        font-size: 36px;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 10px;
    }
    
    .stat-label {
        color: var(--gray);
        font-size: 14px;
    }
    
    .profile-details h3 {
        color: var(--dark);
        margin-bottom: 25px;
        font-size: 20px;
    }
    
    .appointments-list,
    .history-list {
        background-color: var(--white);
        padding: 30px;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .appointment-item {
        background: white;
        border: 2px solid #e0e6ef;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
    }
    
    .appointment-item:hover {
        border-color: #4db6ac;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .appointment-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
    }
    
    .appointment-header h3 {
        color: var(--dark);
        margin: 0;
        font-size: 18px;
    }
    
    .appointment-status {
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .status-pending {
        background: #ffc107;
        color: #212529;
    }
    
    .status-confirmed {
        background: #17a2b8;
        color: white;
    }
    
    .status-completed {
        background: #28a745;
        color: white;
    }
    
    .status-cancelled {
        background: #dc3545;
        color: white;
    }
    
    .appointment-details {
        margin-bottom: 20px;
    }
    
    .detail-item {
        display: flex;
        margin-bottom: 10px;
    }
    
    .detail-label {
        font-weight: 600;
        color: var(--dark);
        min-width: 140px;
    }
    
    .detail-value {
        color: var(--gray);
        flex: 1;
    }
    
    .appointment-actions {
        display: flex;
        gap: 15px;
        margin-top: 20px;
    }
    
    .appointment-actions .btn {
        padding: 10px 20px;
        font-size: 14px;
        flex: 1;
    }
    
    .empty-state {
        text-align: center;
        padding: 60px 20px;
    }
    
    .empty-state i {
        font-size: 64px;
        color: #bdc3c7;
        margin-bottom: 20px;
    }
    
    .empty-state h3 {
        color: #7f8c8d;
        margin-bottom: 10px;
    }
    
    .empty-state p {
        color: #95a5a6;
        margin-bottom: 30px;
    }
    
    .history-item {
        background: white;
        border: 2px solid #e0e6ef;
        border-radius: 10px;
        padding: 25px;
        margin-bottom: 15px;
    }
    
    .history-item:last-child {
        margin-bottom: 0;
    }
    
    .history-date {
        color: var(--primary);
        font-weight: 600;
        margin-bottom: 15px;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .history-content h4 {
        color: var(--dark);
        margin-bottom: 10px;
        font-size: 18px;
    }
    
    .history-content p {
        color: var(--gray);
        margin-bottom: 5px;
    }
    
    .history-comment {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: var(--radius);
        margin-top: 15px;
        color: var(--dark);
        border-left: 4px solid #4db6ac;
    }
    
    .history-type {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .history-item.completed .history-type {
        background: #28a745;
        color: white;
    }
    
    .history-item.cancelled .history-type {
        background: #dc3545;
        color: white;
    }
    
    .settings-options {
        background-color: var(--white);
        padding: 40px;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .setting-item {
        margin-bottom: 40px;
    }
    
    .setting-item:last-child {
        margin-bottom: 0;
    }
    
    .setting-item h3 {
        color: var(--dark);
        margin-bottom: 20px;
        font-size: 20px;
    }
    
    .setting-control {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
    }
    
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }
    
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    
    input:checked + .slider {
        background-color: var(--primary);
    }
    
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    
    .error-state {
        text-align: center;
        padding: 60px 20px;
        color: #dc3545;
    }
    
    .error-state i {
        font-size: 48px;
        margin-bottom: 20px;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 15px 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid #4db6ac;
    }
    
    .notification-success {
        border-left-color: #28a745;
    }
    
    .notification-error {
        border-left-color: #dc3545;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .login-form,
        .registration-form,
        .password-reset-form {
            padding: 30px 20px;
        }
        
        .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 20px;
        }
        
        .profile-stats {
            grid-template-columns: 1fr;
        }
        
        .cabinet-tabs {
            justify-content: center;
        }
        
        .appointment-header {
            flex-direction: column;
            gap: 10px;
        }
        
        .appointment-actions {
            flex-direction: column;
            gap: 10px;
        }
        
        .appointment-actions .btn {
            width: 100%;
        }
        
        .detail-item {
            flex-direction: column;
            gap: 5px;
        }
        
        .detail-label {
            min-width: auto;
        }
    }
`;

// Добавляем стили в документ
const cabinetStyleElement = document.createElement('style');
cabinetStyleElement.textContent = cabinetStyles;
document.head.appendChild(cabinetStyleElement);