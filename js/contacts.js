// Скрипт для страницы контактов
document.addEventListener('DOMContentLoaded', function() {
    loadContactInfo();
    setupContactForm();
    setupFAQ();
    setupPhoneMask();
    setupTransportInfo();
    setupCopyToClipboard();
    initMap();
});

// Загрузка контактной информации
async function loadContactInfo() {
    try {
        const contacts = await window.beautySphereData.getContacts();
        
        if (contacts) {
            updateContactElements(contacts);
        }
    } catch (error) {
        console.error('Ошибка загрузки контактов:', error);
        // Используем данные по умолчанию
        const defaultContacts = {
            address: "Улица Карла Маркса, 13а, 1 этаж, Большой Камень, Приморский край, 692806",
            phone: "+7 (423) 352-14-25",
            phone2: "+7 924 732-14-25",
            email: "beauty-sphere@mail.ru",
            workingHours: {
                weekdays: "09:00 - 20:00",
                saturday: "10:00 - 19:00",
                sunday: "10:00 - 18:00"
            }
        };
        updateContactElements(defaultContacts);
    }
}

// Обновление элементов контактов на странице
function updateContactElements(contacts) {
    // Обновляем адрес
    const addressElements = document.querySelectorAll('.contact-text p, .footer-column p');
    addressElements.forEach(el => {
        if (el.innerHTML.includes('Улица Карла Маркса')) {
            el.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${contacts.address}`;
        }
    });
    
    // Обновляем телефоны
    const phoneElements = document.querySelectorAll('.contact-text p, .footer-column p');
    phoneElements.forEach(el => {
        if (el.innerHTML.includes('+7 (423)')) {
            el.innerHTML = `<i class="fas fa-phone"></i> ${contacts.phone}`;
        }
    });
    
    // Обновляем email
    const emailElements = document.querySelectorAll('.contact-text p, .footer-column p');
    emailElements.forEach(el => {
        if (el.innerHTML.includes('beauty-sphere@mail.ru')) {
            el.innerHTML = `<i class="fas fa-envelope"></i> ${contacts.email}`;
        }
    });
    
    // Обновляем часы работы
    if (contacts.workingHours) {
        const scheduleElement = document.querySelector('.contact-text p strong');
        if (scheduleElement && scheduleElement.textContent.includes('Понедельник')) {
            const scheduleContainer = scheduleElement.closest('.contact-text');
            if (scheduleContainer) {
                scheduleContainer.innerHTML = `
                    <h4>Часы работы</h4>
                    <p>
                        <strong>Понедельник - Пятница:</strong> ${contacts.workingHours.weekdays}<br>
                        <strong>Суббота:</strong> ${contacts.workingHours.saturday}<br>
                        <strong>Воскресенье:</strong> ${contacts.workingHours.sunday}
                    </p>
                `;
            }
        }
    }
}

// Инициализация карты с исправленной высотой
function initMap() {
    const mapWrappers = document.querySelectorAll('.map-wrapper');
    
    mapWrappers.forEach(wrapper => {
        // Устанавливаем фиксированную высоту
        wrapper.style.height = '400px';
        wrapper.style.borderRadius = '12px';
        wrapper.style.overflow = 'hidden';
        
        // Проверяем, есть ли уже iframe
        let iframe = wrapper.querySelector('iframe');
        if (!iframe) {
            // Создаем iframe с картой
            iframe = document.createElement('iframe');
            iframe.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1394.782366663711!2d132.34909367668318!3d43.12193607112815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5fb3924b8c3b6f33%3A0x7ab0a9cf2f35e43a!2z0KPQu9C40YbQsCDQmtCw0YDQu9CwINGc0LDRgNC60YHQsCwgMTTQkCwg0JHQu9C-0LnQvdC40YbQsCwg0J_RgNC40LzQuNGA0L7QstGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCA2OTI4MDY!5e0!3m2!1sru!2sru!4v1700000000000!5m2!1sru!2sru`;
            iframe.width = '100%';
            iframe.height = '400';
            iframe.style.border = '0';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            wrapper.appendChild(iframe);
        }
        
        // Добавляем кнопку для увеличения карты
        const expandButton = document.createElement('button');
        expandButton.className = 'map-expand-btn';
        expandButton.innerHTML = '<i class="fas fa-expand"></i>';
        expandButton.title = 'Увеличить карту';
        expandButton.style.cssText = `
            position: absolute;
            bottom: 15px;
            right: 15px;
            background: var(--primary);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        expandButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });
        
        expandButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        expandButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Создаем модальное окно с увеличенной картой
            const modal = document.createElement('div');
            modal.className = 'modal map-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            // Создаем контент модального окна
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.style.cssText = `
                width: 90%;
                height: 90%;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                position: relative;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            `;
            
            // Кнопка закрытия
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '&times;';
            closeButton.style.cssText = `
                position: absolute;
                top: 15px;
                right: 15px;
                background: white;
                color: var(--primary);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            `;
            
            closeButton.addEventListener('mouseenter', function() {
                this.style.transform = 'rotate(90deg)';
            });
            
            closeButton.addEventListener('mouseleave', function() {
                this.style.transform = 'rotate(0deg)';
            });
            
            closeButton.addEventListener('click', function() {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
            });
            
            // Увеличенная карта
            const largeMap = document.createElement('iframe');
            largeMap.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1394.782366663711!2d132.34909367668318!3d43.12193607112815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5fb3924b8c3b6f33%3A0x7ab0a9cf2f35e43a!2z0KPQu9C40YbQsCDQmtCw0YDQu9CwINGc0LDRgNC60YHQsCwgMTTQkCwg0JHQu9C-0LnQvdC40YbQsCwg0J_RgNC40LzQuNGA0L7QstGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCA2OTI4MDY!5e0!3m2!1sru!2sru!4v1700000000000!5m2!1sru!2sru`;
            largeMap.width = '100%';
            largeMap.height = '100%';
            largeMap.style.border = 'none';
            largeMap.allowFullscreen = true;
            
            // Собираем модальное окно
            modalContent.appendChild(closeButton);
            modalContent.appendChild(largeMap);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Анимация появления
            setTimeout(() => {
                modal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
            
            // Закрытие по клику вне карты
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeButton.click();
                }
            });
            
            // Закрытие по Escape
            document.addEventListener('keydown', function closeOnEscape(e) {
                if (e.key === 'Escape') {
                    closeButton.click();
                    document.removeEventListener('keydown', closeOnEscape);
                }
            });
        });
        
        wrapper.style.position = 'relative';
        wrapper.appendChild(expandButton);
    });
}

// Остальные функции остаются без изменений
// (setupContactForm, validateContactForm, showContactSuccess, setupFAQ, setupPhoneMask, setupTransportInfo и т.д.)

// Добавляем стили для карты
const mapStyles = `
    .map-wrapper {
        position: relative;
        margin: 20px 0;
    }
    
    .map-modal {
        display: none;
    }
    
    .map-modal.active {
        display: flex;
    }
    
    @media (max-width: 768px) {
        .map-wrapper {
            height: 300px !important;
        }
        
        .map-wrapper iframe {
            height: 300px !important;
        }
        
        .map-expand-btn {
            width: 35px !important;
            height: 35px !important;
            font-size: 16px !important;
        }
    }
    
    @media (max-width: 480px) {
        .map-wrapper {
            height: 250px !important;
        }
        
        .map-wrapper iframe {
            height: 250px !important;
        }
    }
`;
const mapStyleElement = document.createElement('style');
mapStyleElement.textContent = mapStyles;
document.head.appendChild(mapStyleElement);