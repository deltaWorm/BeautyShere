// Скрипт для страницы онлайн-записи
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация страницы
    initBookingForm();
    loadServicesForBooking();
    loadMastersForBooking();
    setupDateTimePicker();
    setupFormValidation();
    setupStepNavigation();
    checkUrlParams();
    
    // Инициализация прогресса шагов
    updateStepProgress(1);
    
    // Загрузка предварительного просмотра записей
    setTimeout(() => {
        if (window.loadAppointmentsPreview) {
            window.loadAppointmentsPreview();
        }
    }, 2000);
    
    // Автозаполнение для авторизованных пользователей
    autoFillUserData();
});


function getAuthState() {
    const user = localStorage.getItem('beauty-sphere-user');
    return user ? JSON.parse(user) : null;
}

// Автозаполнение для авторизованных пользователей
function autoFillUserData() {
    const user = getAuthState();
    if (user) {
        // Автозаполняем поля для авторизованных пользователей
        const nameInput = document.getElementById('client-name');
        const emailInput = document.getElementById('client-email');
        
        if (nameInput && user.name) {
            nameInput.value = user.name;
        }
        
        if (emailInput && user.email) {
            emailInput.value = user.email;
        }
        
        // Если есть телефон, также можно автозаполнить
        const phoneInput = document.getElementById('client-phone');
        if (phoneInput && user.phone) {
            phoneInput.value = user.phone;
        }
    }
}

// Получение состояния авторизации
function getAuthState() {
    const user = localStorage.getItem('beauty-sphere-user');
    return user ? JSON.parse(user) : null;
}

// Обновление прогресса шагов
function updateStepProgress(currentStep) {
    const steps = document.querySelectorAll('.step');
    const progressFill = document.getElementById('booking-progress');
    
    if (!steps.length || !progressFill) return;
    
    // Сбрасываем все шаги
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    // Устанавливаем прогресс
    let progressPercentage = 0;
    
    if (currentStep === 1) {
        progressPercentage = 0;
    } else if (currentStep === 2) {
        progressPercentage = 33;
    } else if (currentStep === 3) {
        progressPercentage = 66;
    } else if (currentStep === 4) {
        progressPercentage = 100;
    }
    
    // Обновляем заполнение прогресса
    progressFill.style.width = `${progressPercentage}%`;
    
    // Отмечаем пройденные шаги как completed
    for (let i = 0; i < currentStep; i++) {
        if (i < currentStep - 1) {
            steps[i].classList.add('completed');
        }
    }
    
    // Делаем текущий шаг активным
    if (steps[currentStep - 1]) {
        steps[currentStep - 1].classList.add('active');
    }
}

// Переход к шагу (обновленная версия)
function goToStep(stepNumber) {
    const currentStep = document.querySelector('.booking-step.active');
    const targetStep = document.getElementById(`step-${stepNumber}`);
    
    if (!currentStep || !targetStep) return;
    
    // Проверяем валидность текущего шага перед переходом
    if (!validateCurrentStep(currentStep.id)) {
        return;
    }
    
    // Скрываем текущий шаг
    currentStep.classList.remove('active');
    
    // Показываем целевой шаг
    targetStep.classList.add('active');
    
    // Обновляем прогресс шагов
    updateStepProgress(parseInt(stepNumber));
    
    // Обновляем сводку на последнем шаге
    if (stepNumber === '4') {
        updateSummary();
    }
    
    // Прокручиваем к верху формы
    targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Валидация текущего шага перед переходом
function validateCurrentStep(stepId) {
    switch(stepId) {
        case 'step-1':
            return validateServiceSelection();
        case 'step-2':
            return validateMasterSelection();
        case 'step-3':
            return validateDateTimeSelection();
        default:
            return true;
    }
}

// Валидация выбора мастера
function validateMasterSelection() {
    const bookingData = getBookingData();
    
    if (!bookingData.master) {
        alert('Пожалуйста, выберите мастера');
        return false;
    }
    
    return true;
}

// Валидация выбора даты и времени
function validateDateTimeSelection() {
    const bookingData = getBookingData();
    
    if (!bookingData.date) {
        alert('Пожалуйста, выберите дату');
        return false;
    }
    
    if (!bookingData.time) {
        alert('Пожалуйста, выберите время');
        return false;
    }
    
    return true;
}

// Инициализация формы записи
function initBookingForm() {
    // Сброс формы при загрузке
    localStorage.removeItem('bookingData');
    
    // Установка минимальной даты (сегодня)
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Установка даты на завтра по умолчанию
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        
        // Сохраняем дату по умолчанию
        saveBookingData('date', dateInput.value);
    }
    
    // Настройка маски телефона
    setupPhoneMask();
}

// Загрузка услуг для выбора в записи
async function loadServicesForBooking() {
    const container = document.getElementById('services-select');
    if (!container) return;
    
    try {
        const services = await window.beautySphereAPI.getServices();
        
        if (!services || services.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1; padding: 20px;">
                    <p>Услуги временно недоступны. Пожалуйста, позвоните нам.</p>
                </div>
            `;
            return;
        }
        
        // Проверяем, есть ли предварительно выбранные услуги
        const selectedServicesData = localStorage.getItem('selectedServicesForBooking');
        let selectedServiceIds = [];
        
        if (selectedServicesData) {
            const selectedServices = JSON.parse(selectedServicesData);
            selectedServiceIds = selectedServices.map(service => service.id);
            
            // Сохраняем первую выбранную услугу как основную
            if (selectedServices.length > 0) {
                saveBookingData('service', {
                    id: selectedServices[0].id,
                    name: selectedServices[0].name,
                    price: selectedServices[0].price
                });
                
                // Сохраняем все выбранные услуги
                saveBookingData('allServices', selectedServices);
                
                // Обновляем счетчик
                updateSelectedServicesCount();
            }
        }
        
        // Создаем горизонтальный контейнер
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'services-horizontal-scroll';
        
        // Добавляем услуги в горизонтальный контейнер
        scrollContainer.innerHTML = services.map(service => {
            const isSelected = selectedServiceIds.includes(service.id.toString());
            return `
                <div class="service-card-horizontal ${isSelected ? 'selected' : ''}" 
                     data-service-id="${service.id}" 
                     data-service-price="${service.price}"
                     data-service-category="${service.category}">
                    <div class="service-card-header">
                        <h4>${service.name}</h4>
                        <div class="service-price-badge">${service.price} руб.</div>
                    </div>
                    <div class="service-card-category">${service.category}</div>
                    <div class="service-card-description">${service.description}</div>
                    <div class="service-card-details">
                        <div class="service-duration">
                            <i class="fas fa-clock"></i> ${service.duration} мин.
                        </div>
                    </div>
                    <div class="service-selection-indicator">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            `;
        }).join('');
        
        // Очищаем контейнер и добавляем горизонтальный скролл
        container.innerHTML = '';
        container.appendChild(scrollContainer);
        
        // Очищаем localStorage после использования
        localStorage.removeItem('selectedServicesForBooking');
        
        // Добавляем обработчики выбора услуг
        setupServiceSelection();
        
        // Если есть выбранные услуги, показываем их количество
        if (selectedServiceIds.length > 0) {
            updateSelectedServicesCount();
        }
        
    } catch (error) {
        console.error('Ошибка загрузки услуг:', error);
        container.innerHTML = `
            <div class="text-center" style="grid-column: 1/-1; padding: 20px; color: #721c24;">
                <p>Ошибка загрузки услуг. Пожалуйста, попробуйте позже.</p>
            </div>
        `;
    }
}

// Загрузка мастеров для выбора
async function loadMastersForBooking() {
    const container = document.getElementById('masters-select');
    if (!container) return;
    
    try {
        const masters = await window.beautySphereAPI.getMasters();
        
        if (!masters || masters.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1; padding: 20px;">
                    <p>Мастера временно недоступны. Пожалуйста, позвоните нам.</p>
                </div>
            `;
            return;
        }
        
        // Создаем горизонтальный контейнер
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'masters-horizontal-scroll';
        
        // Добавляем мастеров в горизонтальный контейнер
        scrollContainer.innerHTML = masters.map(master => `
            <div class="master-card-horizontal" data-master-id="${master.id}">
                <div class="master-card-header">
                    <h4>${master.name}</h4>
                    <div class="master-specialization">${master.specialization}</div>
                </div>
                <div class="master-card-details">
                    <div class="master-experience">
                        <i class="fas fa-award"></i> Опыт: ${master.experience}
                    </div>
                    <div class="master-schedule">
                        <i class="fas fa-calendar-alt"></i> ${master.schedule || 'График уточняется'}
                    </div>
                </div>
                <div class="master-card-description">${master.description}</div>
                <div class="master-selection-indicator">
                    <i class="fas fa-check"></i>
                </div>
            </div>
        `).join('');
        
        // Очищаем контейнер и добавляем горизонтальный скролл
        container.innerHTML = '';
        container.appendChild(scrollContainer);
        
        // Добавляем обработчики выбора мастеров
        setupMasterSelection();
        
    } catch (error) {
        console.error('Ошибка загрузки мастеров:', error);
        container.innerHTML = `
            <div class="text-center" style="grid-column: 1/-1; padding: 20px; color: #721c24;">
                <p>Ошибка загрузки мастеров. Пожалуйста, попробуйте позже.</p>
            </div>
        `;
    }
}

// Настройка выбора услуг
function setupServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-card-horizontal');
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Получаем данные услуги
            const serviceId = this.dataset.serviceId;
            const serviceName = this.querySelector('h4').textContent;
            const servicePrice = this.dataset.servicePrice;
            const serviceCategory = this.dataset.serviceCategory;
            
            // Проверяем, выбрана ли уже эта услуга
            const isSelected = this.classList.contains('selected');
            
            if (!isSelected) {
                // Добавляем услугу
                this.classList.add('selected');
                
                // Сохраняем выбранную услугу
                const serviceData = {
                    id: serviceId,
                    name: serviceName,
                    price: servicePrice,
                    category: serviceCategory
                };
                
                // Получаем текущий список выбранных услуг
                let selectedServices = getSelectedServices();
                
                // Добавляем новую услугу
                selectedServices.push(serviceData);
                saveSelectedServices(selectedServices);
                
                // Сохраняем первую выбранную услугу как основную для отображения
                if (selectedServices.length === 1) {
                    saveBookingData('service', serviceData);
                }
                
            } else {
                // Убираем услугу
                this.classList.remove('selected');
                
                // Удаляем услугу из списка выбранных
                let selectedServices = getSelectedServices();
                selectedServices = selectedServices.filter(service => service.id !== serviceId);
                saveSelectedServices(selectedServices);
                
                // Если есть другие выбранные услуги, выбираем первую как основную
                if (selectedServices.length > 0) {
                    saveBookingData('service', selectedServices[0]);
                } else {
                    // Если нет выбранных услуг, очищаем
                    saveBookingData('service', null);
                }
            }
            
            // Обновляем счетчик выбранных услуг
            updateSelectedServicesCount();
            
            // Обновляем сводку
            updateSummary();
        });
    });
}

// Получение выбранных услуг
function getSelectedServices() {
    const bookingData = getBookingData();
    return bookingData.allServices || [];
}

// Сохранение выбранных услуг
function saveSelectedServices(services) {
    saveBookingData('allServices', services);
}

// Обновление счетчика выбранных услуг
function updateSelectedServicesCount() {
    const selectedServices = getSelectedServices();
    const count = selectedServices.length;
    
    // Находим все индикаторы счетчика
    const counters = document.querySelectorAll('.selected-services-count');
    
    counters.forEach(counter => {
        if (count > 0) {
            counter.textContent = `Выбрано: ${count}`;
            counter.style.display = 'inline';
        } else {
            counter.style.display = 'none';
        }
    });
    
    // Обновляем заголовок шага выбора услуг
    const stepTitle = document.querySelector('#step-1 h2');
    if (stepTitle && count > 0) {
        stepTitle.innerHTML = `Выберите услугу <span class="selected-services-count" style="font-size: 16px; color: #4db6ac; margin-left: 10px;">Выбрано: ${count}</span>`;
    }
}

// Настройка выбора мастеров
function setupMasterSelection() {
    const masterOptions = document.querySelectorAll('.master-card-horizontal');
    
    masterOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Снимаем выделение с других мастеров
            masterOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Выделяем выбранного мастера
            this.classList.add('selected');
            
            // Сохраняем выбранного мастера
            const masterId = this.dataset.masterId;
            const masterName = this.querySelector('h4').textContent;
            const specialization = this.querySelector('.master-specialization').textContent;
            
            saveBookingData('master', {
                id: masterId,
                name: masterName,
                specialization: specialization
            });
            
            // Обновляем сводку
            updateSummary();
        });
    });
}

// Обновленная функция для кнопок "Назад"/"Далее"
function setupStepNavigation() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Кнопки "Далее"
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = this.dataset.next;
            goToStep(nextStep);
        });
    });
    
    // Кнопки "Назад"
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.dataset.prev;
            goToStep(prevStep);
        });
    });
}

// Обновление сводки
function updateSummary() {
    const bookingData = getBookingData();
    
    // Услуги (показываем первую выбранную или общее количество)
    const serviceElement = document.getElementById('summary-service');
    if (serviceElement) {
        const selectedServices = getSelectedServices();
        if (selectedServices.length > 0) {
            if (selectedServices.length === 1) {
                serviceElement.textContent = selectedServices[0].name;
            } else {
                serviceElement.textContent = `${selectedServices.length} услуг(и)`;
                // Добавляем всплывающую подсказку
                serviceElement.title = selectedServices.map(s => s.name).join('\n');
            }
        } else {
            serviceElement.textContent = 'Не выбрано';
        }
    }
    
    // Мастер
    const masterElement = document.getElementById('summary-master');
    if (masterElement && bookingData.master) {
        masterElement.textContent = bookingData.master.name;
    } else if (masterElement) {
        masterElement.textContent = 'Не выбран';
    }
    
    // Дата и время
    const datetimeElement = document.getElementById('summary-datetime');
    if (datetimeElement && bookingData.date && bookingData.time) {
        const date = new Date(bookingData.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        datetimeElement.textContent = `${formattedDate}, ${bookingData.time}`;
    } else if (datetimeElement) {
        datetimeElement.textContent = 'Не выбрано';
    }
    
    // Стоимость
    const priceElement = document.getElementById('summary-price');
    if (priceElement) {
        const selectedServices = getSelectedServices();
        if (selectedServices.length > 0) {
            const totalPrice = selectedServices.reduce((sum, service) => sum + parseInt(service.price), 0);
            priceElement.textContent = `${totalPrice} руб.`;
            
            // Если выбрано больше одной услуги, показываем детали
            if (selectedServices.length > 1) {
                priceElement.title = selectedServices.map(s => `${s.name}: ${s.price} руб.`).join('\n');
            }
        } else {
            priceElement.textContent = '0 руб.';
        }
    }
}

// Валидация выбора услуги
function validateServiceSelection() {
    const selectedServices = getSelectedServices();
    
    if (selectedServices.length === 0) {
        alert('Пожалуйста, выберите хотя бы одну услугу');
        return false;
    }
    
    return true;
}

// Получение данных клиента
function getClientData() {
    const selectedServices = getSelectedServices();
    const user = getAuthState();
    
    return {
        clientName: document.getElementById('client-name').value.trim(),
        clientPhone: document.getElementById('client-phone').value.trim(),
        clientEmail: user?.email || document.getElementById('client-email').value.trim(),
        clientComment: document.getElementById('client-comment').value.trim(),
        services: selectedServices,
        totalPrice: selectedServices.reduce((sum, service) => sum + parseInt(service.price), 0),
        userId: user?.id || null,
        userEmail: user?.email || null
    };
}

// В функции saveAppointmentToHistory() убедитесь, что сохраняется email:
function saveAppointmentToHistory(appointmentData) {
    let history = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
    
    // Проверяем, есть ли уже запись с таким ID
    const existingIndex = history.findIndex(app => app.id === appointmentData.id);
    
    if (existingIndex !== -1) {
        // Обновляем существующую запись
        history[existingIndex] = appointmentData;
    } else {
        // Добавляем новую запись
        history.push(appointmentData);
    }
    
    localStorage.setItem('beautySphereAppointments', JSON.stringify(history));
    
    // Также обновляем запись в окне предпросмотра
    if (window.loadAppointmentsPreview) {
        window.loadAppointmentsPreview();
    }
}

// В функции initBookingForm() добавьте автозаполнение:
function initBookingForm() {
    // Сброс формы при загрузке
    localStorage.removeItem('bookingData');
    
    // Установка минимальной даты (сегодня)
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Установка даты на завтра по умолчанию
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        
        // Сохраняем дату по умолчанию
        saveBookingData('date', dateInput.value);
    }
    
    // Настройка маски телефона
    setupPhoneMask();
    
    // Автозаполнение данных для авторизованных пользователей
    const user = getAuthState();
    if (user) {
        const nameInput = document.getElementById('client-name');
        const emailInput = document.getElementById('client-email');
        
        if (nameInput && user.name) {
            nameInput.value = user.name;
        }
        
        if (emailInput && user.email) {
            emailInput.value = user.email;
        }
    }
    
    // Проверка URL параметров для редактирования
    checkUrlParams();
}

// В функции checkUrlParams() добавьте обработку редактирования:
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service');
    const masterId = params.get('master');
    const editId = params.get('edit');
    
    // Если есть параметр услуги, выбираем её
    if (serviceId) {
        setTimeout(() => {
            const serviceOption = document.querySelector(`.service-card-horizontal[data-service-id="${serviceId}"]`);
            if (serviceOption) {
                serviceOption.click();
                goToStep('2');
            }
        }, 500);
    }
    
    // Если есть параметр мастера, выбираем его
    if (masterId) {
        setTimeout(() => {
            const masterOption = document.querySelector(`.master-card-horizontal[data-master-id="${masterId}"]`);
            if (masterOption) {
                masterOption.click();
                
                // Если уже выбрана услуга, переходим к шагу 3
                if (document.querySelector('.service-card-horizontal.selected')) {
                    goToStep('3');
                }
            }
        }, 1000);
    }
    
    // Если редактируем запись
    if (editId) {
        const editingAppointment = localStorage.getItem('editingAppointment');
        if (editingAppointment) {
            const appointment = JSON.parse(editingAppointment);
            loadAppointmentIntoForm(appointment);
            localStorage.removeItem('editingAppointment');
        }
    }
}

// Обновленная функция показа успешного сообщения
function showSuccessMessage() {
    const form = document.getElementById('booking-form');
    const successMessage = document.getElementById('booking-success');
    
    if (form && successMessage) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Обновляем прогресс шагов на 100%
        updateStepProgress(4);
        
        // Добавляем информацию о записи в сообщение
        const bookingData = getBookingData();
        const selectedServices = getSelectedServices();
        
        const appointmentInfo = document.createElement('div');
        appointmentInfo.className = 'appointment-details';
        appointmentInfo.innerHTML = `
            <h4>Детали вашей записи:</h4>
            <ul>
                <li><strong>Услуги:</strong> ${selectedServices.map(s => s.name).join(', ')}</li>
                <li><strong>Мастер:</strong> ${bookingData.master?.name || 'Не указан'}</li>
                <li><strong>Дата и время:</strong> ${document.getElementById('summary-datetime').textContent}</li>
                <li><strong>Стоимость:</strong> ${document.getElementById('summary-price').textContent}</li>
                <li><strong>Клиент:</strong> ${document.getElementById('client-name').value}</li>
                <li><strong>Телефон:</strong> ${document.getElementById('client-phone').value}</li>
            </ul>
        `;
        
        successMessage.insertBefore(appointmentInfo, successMessage.querySelector('.btn'));
        
        // Прокручиваем к сообщению
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Обновляем окно просмотра записей
        setTimeout(() => {
            if (window.loadAppointmentsPreview) {
                window.loadAppointmentsPreview();
            }
        }, 1000);
    }
}

// Функция для загрузки и управления записями
window.loadAppointmentsPreview = async function() {
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) return;
    
    try {
        // Получаем данные авторизованного пользователя
        const user = getAuthState();
        
        if (!user || !user.email) {
            previewContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-lock" style="font-size: 48px; color: #bdc3c7; margin-bottom: 15px;"></i>
                    <p style="color: #7f8c8d; text-align: center;">Войдите в систему для просмотра записей</p>
                </div>
            `;
            return;
        }
        
        const appointments = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
        
        // Фильтруем записи по email пользователя
        const userAppointments = appointments.filter(app => {
            return app.userEmail === user.email || app.clientEmail === user.email;
        });
        
        if (userAppointments.length === 0) {
            previewContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus" style="font-size: 48px; color: #bdc3c7; margin-bottom: 15px;"></i>
                    <p style="color: #7f8c8d; text-align: center;">У вас пока нет записей</p>
                </div>
            `;
            return;
        }
        
        // Фильтруем только активные записи (будущие)
        const now = new Date();
        const activeAppointments = userAppointments.filter(app => {
            if (!app.date || !app.time) return false;
            const appointmentDate = new Date(`${app.date}T${app.time}`);
            return appointmentDate > now && app.status !== 'cancelled';
        });
        
        // Сортируем по дате (ближайшие первыми)
        activeAppointments.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });
        
        // Ограничиваем показ 5 записями
        const displayAppointments = activeAppointments.slice(0, 5);
        
        previewContent.innerHTML = displayAppointments.map(app => {
            const date = new Date(`${app.date}T${app.time}`);
            const formattedDate = date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            let servicesText = '';
            if (app.services && app.services.length > 0) {
                if (app.services.length === 1) {
                    servicesText = app.services[0].name;
                } else {
                    servicesText = `${app.services.length} услуги`;
                }
            }
            
            return `
                <div class="appointment-preview-item" data-id="${app.id}">
                    <div class="appointment-header">
                        <h4>${servicesText}</h4>
                        <button class="btn-delete-appointment" data-id="${app.id}" title="Удалить запись">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <p><i class="fas fa-calendar"></i> ${formattedDate}</p>
                    <p><i class="fas fa-clock"></i> ${formattedTime}</p>
                    <p><i class="fas fa-user-tie"></i> ${app.master?.name || 'Мастер не выбран'}</p>
                    <p><i class="fas fa-money-bill-wave"></i> ${app.totalPrice || '0'} руб.</p>
                    <div class="appointment-actions">
                        <button class="btn btn-outline-primary btn-sm edit-appointment" data-id="${app.id}">
                            <i class="fas fa-edit"></i> Изменить
                        </button>
                        <button class="btn btn-outline-danger btn-sm cancel-appointment" data-id="${app.id}">
                            <i class="fas fa-times-circle"></i> Отменить
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Обновляем количество записей в кнопке
        const viewBtn = document.getElementById('viewAppointmentsBtn');
        if (viewBtn && activeAppointments.length > 0) {
            const span = viewBtn.querySelector('span');
            if (span) {
                span.textContent = `Мои записи (${activeAppointments.length})`;
            }
        }
        
        // Добавляем обработчики для кнопок
        setupAppointmentActions();
        
    } catch (error) {
        console.error('Ошибка обновления превью записей:', error);
        previewContent.innerHTML = `
            <div class="error-state">
                <p style="color: #e74c3c; text-align: center;">Ошибка загрузки записей</p>
            </div>
        `;
    }
};

// Настройка действий с записями (удаление, отмена, редактирование)
function setupAppointmentActions() {
    // Удаление записи
    document.querySelectorAll('.btn-delete-appointment').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appointmentId = this.dataset.id;
            if (confirm('Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.')) {
                deleteAppointment(appointmentId);
            }
        });
    });
    
    // Отмена записи
    document.querySelectorAll('.cancel-appointment').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appointmentId = this.dataset.id;
            if (confirm('Вы уверены, что хотите отменить эту запись?')) {
                cancelAppointment(appointmentId);
            }
        });
    });
    
    // Редактирование записи
    document.querySelectorAll('.edit-appointment').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appointmentId = this.dataset.id;
            editAppointment(appointmentId);
        });
    });
}

// Удаление записи
function deleteAppointment(appointmentId) {
    let appointments = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
    
    // Находим запись для удаления
    const appointmentToDelete = appointments.find(app => app.id == appointmentId);
    if (!appointmentToDelete) return;
    
    // Удаляем запись
    appointments = appointments.filter(app => app.id != appointmentId);
    localStorage.setItem('beautySphereAppointments', JSON.stringify(appointments));
    
    // Показываем уведомление
    showNotification('Запись успешно удалена', 'success');
    
    // Обновляем отображение записей
    if (window.loadAppointmentsPreview) {
        window.loadAppointmentsPreview();
    }
}

// Отмена записи
function cancelAppointment(appointmentId) {
    let appointments = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
    
    // Находим запись для отмены
    const appointmentIndex = appointments.findIndex(app => app.id == appointmentId);
    if (appointmentIndex === -1) return;
    
    // Помечаем запись как отмененную
    appointments[appointmentIndex].status = 'cancelled';
    appointments[appointmentIndex].cancelledAt = new Date().toISOString();
    
    localStorage.setItem('beautySphereAppointments', JSON.stringify(appointments));
    
    // Показываем уведомление
    showNotification('Запись успешно отменена', 'success');
    
    // Обновляем отображение записей
    if (window.loadAppointmentsPreview) {
        window.loadAppointmentsPreview();
    }
}

// Редактирование записи
function editAppointment(appointmentId) {
    let appointments = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
    
    // Находим запись для редактирования
    const appointment = appointments.find(app => app.id == appointmentId);
    if (!appointment) return;
    
    // Сохраняем данные записи для редактирования
    localStorage.setItem('editingAppointment', JSON.stringify(appointment));
    
    // Удаляем оригинальную запись
    appointments = appointments.filter(app => app.id != appointmentId);
    localStorage.setItem('beautySphereAppointments', JSON.stringify(appointments));
    
    // Загружаем данные в форму записи
    loadAppointmentIntoForm(appointment);
    
    // Показываем уведомление
    showNotification('Запись загружена для редактирования', 'info');
    
    // Обновляем отображение записей
    if (window.loadAppointmentsPreview) {
        window.loadAppointmentsPreview();
    }
}

// Загрузка записи в форму для редактирования
function loadAppointmentIntoForm(appointment) {
    // Сбрасываем форму
    initBookingForm();
    
    // Устанавливаем дату
    const dateInput = document.getElementById('booking-date');
    if (dateInput && appointment.date) {
        dateInput.value = appointment.date;
        saveBookingData('date', appointment.date);
    }
    
    // Устанавливаем время
    if (appointment.time) {
        saveBookingData('time', appointment.time);
        // Обновляем отображение времени
        updateTimeDisplay(appointment.time);
    }
    
    // Устанавливаем услуги
    if (appointment.services && appointment.services.length > 0) {
        saveBookingData('allServices', appointment.services);
        saveBookingData('service', appointment.services[0]);
        updateSelectedServicesCount();
        
        // Выделяем выбранные услуги
        setTimeout(() => {
            appointment.services.forEach(service => {
                const serviceOption = document.querySelector(`.service-card-horizontal[data-service-id="${service.id}"]`);
                if (serviceOption) {
                    serviceOption.classList.add('selected');
                }
            });
        }, 500);
    }
    
    // Устанавливаем мастера
    if (appointment.master) {
        saveBookingData('master', appointment.master);
        
        // Выделяем выбранного мастера
        setTimeout(() => {
            const masterOption = document.querySelector(`.master-card-horizontal[data-master-id="${appointment.master.id}"]`);
            if (masterOption) {
                masterOption.classList.add('selected');
            }
        }, 500);
    }
    
    // Устанавливаем данные клиента
    if (appointment.clientName) {
        document.getElementById('client-name').value = appointment.clientName;
    }
    if (appointment.clientPhone) {
        document.getElementById('client-phone').value = appointment.clientPhone;
    }
    if (appointment.clientEmail) {
        document.getElementById('client-email').value = appointment.clientEmail;
    }
    if (appointment.clientComment) {
        document.getElementById('client-comment').value = appointment.clientComment;
    }
    
    // Переходим к первому шагу
    goToStep('1');
    
    // Показываем сообщение о редактировании
    const editingMessage = document.createElement('div');
    editingMessage.className = 'editing-notice';
    editingMessage.innerHTML = `
        <div class="editing-notice-content">
            <i class="fas fa-edit"></i>
            <span>Вы редактируете существующую запись. После подтверждения изменения будут сохранены.</span>
        </div>
    `;
    
    const form = document.getElementById('booking-form');
    if (form) {
        form.insertBefore(editingMessage, form.firstChild);
    }
}

// Обновление отображения времени
function updateTimeDisplay(timeValue) {
    // Сбрасываем все выделения
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Находим кнопку с нужным временем и выделяем ее
    const timeButton = document.querySelector(`.time-slot-btn[data-time="${timeValue}"]`);
    if (timeButton) {
        timeButton.classList.add('selected');
    } else {
        // Если времени нет в списке, добавляем его
        addCustomTimeSlot(timeValue);
    }
}

// Настройка выбора даты и времени с улучшенным интерфейсом
function setupDateTimePicker() {
    const dateInput = document.getElementById('booking-date');
    
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            saveBookingData('date', this.value);
            
            // Сбрасываем выбранное время при смене даты
            document.querySelectorAll('.time-slot-btn').forEach(slot => slot.classList.remove('selected'));
            saveBookingData('time', null);
            
            // Обновляем сводку
            updateSummary();
        });
    }
    
    // Генерируем временные слоты при загрузке
    generateTimeSlots();
    
    // Добавляем возможность добавить свое время
    addCustomTimeButton();
}

// Генерация временных слотов в виде кнопок
function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;
    
    // Очищаем контейнер
    timeSlotsContainer.innerHTML = '';
    
    // Создаем сетку для временных слотов
    const slotsGrid = document.createElement('div');
    slotsGrid.className = 'time-slots-grid';
    slotsGrid.style.display = 'grid';
    slotsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    slotsGrid.style.gap = '10px';
    slotsGrid.style.marginBottom = '20px';
    
    // Генерируем временные слоты с 9:00 до 21:00 с шагом 30 минут
    const startHour = 9;
    const endHour = 21;
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const timeButton = document.createElement('button');
            timeButton.type = 'button';
            timeButton.className = 'time-slot-btn';
            timeButton.textContent = time;
            timeButton.dataset.time = time;
            
            // Добавляем индикатор выбора
            const selectionIndicator = document.createElement('div');
            selectionIndicator.className = 'time-selection-indicator';
            selectionIndicator.innerHTML = '<i class="fas fa-check"></i>';
            timeButton.appendChild(selectionIndicator);
            
            // Обработчик выбора времени
            timeButton.addEventListener('click', function() {
                // Снимаем выделение со всех кнопок времени
                document.querySelectorAll('.time-slot-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Выделяем выбранную кнопку
                this.classList.add('selected');
                
                // Сохраняем время
                saveBookingData('time', this.dataset.time);
                
                // Обновляем сводку
                updateSummary();
            });
            
            slotsGrid.appendChild(timeButton);
        }
    }
    
    timeSlotsContainer.appendChild(slotsGrid);
}

// Добавление кнопки для кастомного времени
function addCustomTimeButton() {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;
    
    // Проверяем, не добавлена ли уже кнопка
    if (document.getElementById('add-custom-time-btn')) return;
    
    const customTimeContainer = document.createElement('div');
    customTimeContainer.className = 'custom-time-container';
    customTimeContainer.style.marginTop = '15px';
    customTimeContainer.style.padding = '15px';
    customTimeContainer.style.border = '1px dashed #4db6ac';
    customTimeContainer.style.borderRadius = '8px';
    customTimeContainer.style.backgroundColor = 'rgba(77, 182, 172, 0.05)';
    
    // Кнопка для добавления времени
    const addTimeButton = document.createElement('button');
    addTimeButton.id = 'add-custom-time-btn';
    addTimeButton.type = 'button';
    addTimeButton.className = 'btn btn-outline-primary';
    addTimeButton.innerHTML = '<i class="fas fa-plus-circle"></i> Добавить свое время';
    addTimeButton.style.marginBottom = '10px';
    
    // Контейнер для поля ввода
    const inputContainer = document.createElement('div');
    inputContainer.id = 'custom-time-input-container';
    inputContainer.style.display = 'none';
    
    // Поле ввода времени
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.id = 'custom-time-input';
    timeInput.className = 'form-control';
    timeInput.style.maxWidth = '200px';
    timeInput.style.marginBottom = '10px';
    
    // Устанавливаем минимальное и максимальное время
    timeInput.min = '09:00';
    timeInput.max = '21:00';
    
    // Создаем кнопку сохранения
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'btn btn-primary';
    saveButton.textContent = 'Добавить время';
    saveButton.style.marginRight = '10px';
    
    // Создаем кнопку отмены
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'btn btn-outline-secondary';
    cancelButton.textContent = 'Отмена';
    
    // Добавляем элементы в контейнеры
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.gap = '10px';
    buttonGroup.appendChild(saveButton);
    buttonGroup.appendChild(cancelButton);
    
    inputContainer.appendChild(timeInput);
    inputContainer.appendChild(buttonGroup);
    
    customTimeContainer.appendChild(addTimeButton);
    customTimeContainer.appendChild(inputContainer);
    
    // Добавляем контейнер
    timeSlotsContainer.appendChild(customTimeContainer);
    
    // Добавляем обработчики событий
    setupCustomTimeHandlers(addTimeButton, timeInput, saveButton, cancelButton, inputContainer);
}

// Настройка обработчиков для кастомного времени
function setupCustomTimeHandlers(addButton, timeInput, saveButton, cancelButton, container) {
    // Обработчик для кнопки "Добавить свое время"
    addButton.addEventListener('click', function() {
        container.style.display = 'block';
        this.style.display = 'none';
        timeInput.focus();
    });
    
    // Обработчик для кнопки сохранения
    saveButton.addEventListener('click', function() {
        const timeValue = timeInput.value.trim();
        
        if (!timeValue) {
            alert('Пожалуйста, введите время');
            return;
        }
        
        // Проверяем формат времени
        if (!isValidTimeFormat(timeValue)) {
            alert('Пожалуйста, введите время в формате ЧЧ:ММ (например, 14:30)');
            return;
        }
        
        // Проверяем диапазон времени (9:00 - 21:00)
        const [hours, minutes] = timeValue.split(':').map(Number);
        if (hours < 9 || hours > 21 || (hours === 21 && minutes > 0)) {
            alert('Время должно быть в диапазоне с 9:00 до 21:00');
            return;
        }
        
        // Добавляем новую кнопку времени
        addCustomTimeSlot(timeValue);
        
        // Скрываем поле ввода и показываем кнопку
        container.style.display = 'none';
        addButton.style.display = 'block';
        
        // Очищаем поле ввода
        timeInput.value = '';
    });
    
    // Обработчик для кнопки отмены
    cancelButton.addEventListener('click', function() {
        container.style.display = 'none';
        addButton.style.display = 'block';
        timeInput.value = '';
    });
    
    // Обработчик для нажатия Enter в поле ввода
    timeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveButton.click();
        }
    });
}

// Проверка формата времени
function isValidTimeFormat(timeString) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
}

// Добавление кастомного временного слота
function addCustomTimeSlot(timeValue) {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;
    
    // Ищем сетку временных слотов
    const slotsGrid = timeSlotsContainer.querySelector('.time-slots-grid');
    if (!slotsGrid) return;
    
    // Проверяем, есть ли уже такое время
    const existingButton = slotsGrid.querySelector(`.time-slot-btn[data-time="${timeValue}"]`);
    if (existingButton) {
        // Если время уже есть, просто выбираем его
        existingButton.classList.add('selected');
        saveBookingData('time', timeValue);
        updateSummary();
        return;
    }
    
    // Создаем новую кнопку времени
    const timeButton = document.createElement('button');
    timeButton.type = 'button';
    timeButton.className = 'time-slot-btn custom-time';
    timeButton.textContent = timeValue;
    timeButton.dataset.time = timeValue;
    
    // Добавляем индикатор выбора
    const selectionIndicator = document.createElement('div');
    selectionIndicator.className = 'time-selection-indicator';
    selectionIndicator.innerHTML = '<i class="fas fa-check"></i>';
    timeButton.appendChild(selectionIndicator);
    
    // Обработчик выбора времени
    timeButton.addEventListener('click', function() {
        document.querySelectorAll('.time-slot-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.classList.add('selected');
        saveBookingData('time', this.dataset.time);
        updateSummary();
    });
    
    // Добавляем в начало сетки
    slotsGrid.insertBefore(timeButton, slotsGrid.firstChild);
    
    // Выбираем это время
    timeButton.classList.add('selected');
    saveBookingData('time', timeValue);
    updateSummary();
}

// Настройка валидации формы
function setupFormValidation() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;
    
    // Валидация при отправке формы
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверка всех шагов
        if (!validateServiceSelection() || 
            !validateMasterSelection() || 
            !validateDateTimeSelection() ||
            !validateClientInfo()) {
            return;
        }
        
        // Получаем данные формы
        const bookingData = getBookingData();
        const clientData = getClientData();
        
        // Проверяем, редактируем ли мы существующую запись
        const editingAppointment = localStorage.getItem('editingAppointment');
        let appointmentId;
        
        if (editingAppointment) {
            // Используем старый ID для редактирования
            const oldAppointment = JSON.parse(editingAppointment);
            appointmentId = oldAppointment.id;
            localStorage.removeItem('editingAppointment');
        } else {
            // Создаем новый ID
            appointmentId = Date.now();
        }
        
        // Сохраняем запись
        saveAppointmentToHistory({
            id: appointmentId,
            ...bookingData,
            ...clientData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        });
        
        // Показываем сообщение об успехе
        showSuccessMessage();
        
        // Сбрасываем форму
        setTimeout(() => {
            initBookingForm();
            resetFormSelections();
        }, 5000);
    });
}

// Валидация информации клиента
function validateClientInfo() {
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    
    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        return false;
    }
    
    if (!phone) {
        alert('Пожалуйста, введите ваш телефон');
        return false;
    }
    
    if (!validatePhoneNumber(phone)) {
        alert('Пожалуйста, введите корректный номер телефона');
        return false;
    }
    
    // Проверяем email только если он введен
    if (email && !validateEmail(email)) {
        alert('Пожалуйста, введите корректный email');
        return false;
    }
    
    return true;
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Сброс выбранных элементов формы
function resetFormSelections() {
    // Сбрасываем выбор услуг
    document.querySelectorAll('.service-card-horizontal.selected').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Сбрасываем выбор мастера
    document.querySelectorAll('.master-card-horizontal.selected').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Сбрасываем выбор времени
    document.querySelectorAll('.time-slot-btn.selected').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Сбрасываем данные
    saveBookingData('allServices', []);
    saveBookingData('service', null);
    saveBookingData('master', null);
    saveBookingData('time', null);
    
    // Сбрасываем счетчик
    updateSelectedServicesCount();
    
    // Сбрасываем сводку
    updateSummary();
    
    // Сбрасываем кастомное время
    const customTimeInput = document.getElementById('custom-time-input');
    if (customTimeInput) {
        customTimeInput.value = '';
    }
    
    const customTimeContainer = document.getElementById('custom-time-input-container');
    if (customTimeContainer) {
        customTimeContainer.style.display = 'none';
    }
    
    const addTimeButton = document.getElementById('add-custom-time-btn');
    if (addTimeButton) {
        addTimeButton.style.display = 'block';
    }
    
    // Удаляем сообщение о редактировании
    const editingNotice = document.querySelector('.editing-notice');
    if (editingNotice) {
        editingNotice.remove();
    }
    
    // Возвращаем к первому шагу
    document.querySelectorAll('.booking-step').forEach((step, index) => {
        if (index === 0) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Сбрасываем прогресс
    updateStepProgress(1);
}

// Проверка URL параметров
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service');
    const masterId = params.get('master');
    
    // Если есть параметр услуги, выбираем её
    if (serviceId) {
        setTimeout(() => {
            const serviceOption = document.querySelector(`.service-card-horizontal[data-service-id="${serviceId}"]`);
            if (serviceOption) {
                serviceOption.click();
                goToStep('2');
            }
        }, 500);
    }
    
    // Если есть параметр мастера, выбираем его
    if (masterId) {
        setTimeout(() => {
            const masterOption = document.querySelector(`.master-card-horizontal[data-master-id="${masterId}"]`);
            if (masterOption) {
                masterOption.click();
                
                // Если уже выбрана услуга, переходим к шагу 3
                if (document.querySelector('.service-card-horizontal.selected')) {
                    goToStep('3');
                }
            }
        }, 1000);
    }
}

// Валидация номера телефона
function validatePhoneNumber(phone) {
    // Удаляем все нецифровые символы
    const digits = phone.replace(/\D/g, '');
    
    // Российские номера: +7, 8, или начинаются с 7
    if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
        return true;
    }
    
    // Международные номера (начинаются с кода страны)
    if (digits.length >= 10 && digits.length <= 15) {
        return true;
    }
    
    return false;
}

// Маска для телефона
function setupPhoneMask() {
    const phoneInput = document.getElementById('client-phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.startsWith('7') || value.startsWith('8')) {
            // Российский формат
            if (value.length > 11) value = value.substring(0, 11);
            
            let formatted = '+7 ';
            if (value.length > 1) formatted += `(${value.substring(1, 4)}`;
            if (value.length > 4) formatted += `) ${value.substring(4, 7)}`;
            if (value.length > 7) formatted += `-${value.substring(7, 9)}`;
            if (value.length > 9) formatted += `-${value.substring(9, 11)}`;
            
            this.value = formatted;
        } else if (value) {
            // Международный формат
            this.value = '+' + value.substring(0, 15);
        }
    });
}

// Сохранение данных бронирования
function saveBookingData(key, value) {
    let bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
    bookingData[key] = value;
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
}

// Получение данных бронирования
function getBookingData() {
    return JSON.parse(localStorage.getItem('bookingData') || '{}');
}

// Сохранение записи в историю (localStorage)
function saveAppointmentToHistory(appointmentData) {
    let history = JSON.parse(localStorage.getItem('beautySphereAppointments') || '[]');
    
    // Проверяем, есть ли уже запись с таким ID
    const existingIndex = history.findIndex(app => app.id === appointmentData.id);
    
    if (existingIndex !== -1) {
        // Обновляем существующую запись
        history[existingIndex] = appointmentData;
    } else {
        // Добавляем новую запись
        history.push(appointmentData);
    }
    
    localStorage.setItem('beautySphereAppointments', JSON.stringify(history));
}

// Показать уведомление
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

// Добавляем CSS стили
(function addBookingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Горизонтальные карточки услуг */
        .services-horizontal-scroll, .masters-horizontal-scroll {
            display: flex;
            overflow-x: auto;
            padding: 20px 10px;
            gap: 20px;
            margin-bottom: 20px;
            scrollbar-width: thin;
            scrollbar-color: #4db6ac #f0f0f0;
        }
        
        .services-horizontal-scroll::-webkit-scrollbar,
        .masters-horizontal-scroll::-webkit-scrollbar {
            height: 8px;
        }
        
        .services-horizontal-scroll::-webkit-scrollbar-track,
        .masters-horizontal-scroll::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 4px;
        }
        
        .services-horizontal-scroll::-webkit-scrollbar-thumb,
        .masters-horizontal-scroll::-webkit-scrollbar-thumb {
            background: #4db6ac;
            border-radius: 4px;
        }
        
        .service-card-horizontal, .master-card-horizontal {
            min-width: 280px;
            max-width: 320px;
            background: white;
            border: 2px solid #e0e6ef;
            border-radius: 12px;
            padding: 20px;
            flex-shrink: 0;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .service-card-horizontal:hover, .master-card-horizontal:hover {
            border-color: #4db6ac;
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .service-card-horizontal.selected, .master-card-horizontal.selected {
            background: rgba(77, 182, 172, 0.05);
            border-color: #4db6ac;
        }
        
        .service-card-header, .master-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .service-card-header h4, .master-card-header h4 {
            color: #2c3e50;
            margin: 0;
            font-size: 16px;
            flex: 1;
        }
        
        .service-price-badge {
            background: linear-gradient(135deg, #4db6ac 0%, #2c8c99 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            margin-left: 10px;
        }
        
        .service-card-category, .master-specialization {
            background: rgba(77, 182, 172, 0.1);
            color: #4db6ac;
            padding: 5px 10px;
            border-radius: 15px;
            display: inline-block;
            margin-bottom: 15px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .service-card-description, .master-card-description {
            color: #7f8c8d;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        
        .service-card-details, .master-card-details {
            margin-bottom: 15px;
        }
        
        .service-duration, .master-experience, .master-schedule {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: #f8f9fa;
            color: #7f8c8d;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            margin-right: 8px;
        }
        
        .service-selection-indicator, .master-selection-indicator {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 30px;
            height: 30px;
            background: #4db6ac;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
        }
        
        .service-card-horizontal.selected .service-selection-indicator,
        .master-card-horizontal.selected .master-selection-indicator {
            opacity: 1;
            transform: scale(1);
        }
        
        /* Стили для временных слотов с индикатором выбора */
        .time-slots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .time-slot-btn {
            position: relative;
            padding: 12px;
            background: white;
            border: 2px solid #e0e6ef;
            border-radius: 8px;
            color: #2c3e50;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .time-slot-btn:hover {
            border-color: #4db6ac;
            color: #4db6ac;
            transform: translateY(-2px);
        }
        
        .time-slot-btn.selected {
            background: #4db6ac;
            border-color: #4db6ac;
            color: white;
            box-shadow: 0 4px 8px rgba(77, 182, 172, 0.3);
        }
        
        .time-slot-btn.custom-time {
            background: #4db6ac;
            border-color: #4db6ac;
            color: white;
        }
        
        .time-selection-indicator {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #2c8c99;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
        }
        
        .time-slot-btn.selected .time-selection-indicator {
            opacity: 1;
            transform: scale(1);
        }
        
        /* Стили для записей с кнопками действий */
        .appointment-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .btn-delete-appointment {
            background: none;
            border: none;
            color: #e74c3c;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            transition: color 0.3s ease;
        }
        
        .btn-delete-appointment:hover {
            color: #c0392b;
        }
        
        .appointment-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .appointment-actions .btn {
            flex: 1;
            padding: 6px 10px;
            font-size: 12px;
        }
        
        .editing-notice {
            background: linear-gradient(135deg, rgba(77, 182, 172, 0.1) 0%, rgba(44, 140, 153, 0.1) 100%);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #4db6ac;
        }
        
        .editing-notice-content {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #2c8c99;
            font-weight: 500;
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
            border-left-color: #2ecc71;
        }
        
        .notification-error {
            border-left-color: #e74c3c;
        }
        
        .notification-info {
            border-left-color: #3498db;
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
        
        /* Дополнительные стили для мобильных устройств */
        @media (max-width: 768px) {
            .service-card-horizontal, .master-card-horizontal {
                min-width: 250px;
                max-width: 280px;
            }
            
            .appointment-actions {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
})();