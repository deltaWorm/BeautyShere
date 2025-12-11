// data.js - Хранилище данных для сайта
window.beautySphereData = {
    // Услуги с ценами
    services: [
        { id: 1, name: "Мужская стрижка", category: "Мужские стрижки", price: 800, duration: 45, description: "Стрижка машинкой и ножницами, оформление бороды" },
        { id: 2, name: "Мужская стрижка + стрижка бороды", category: "Мужские стрижки", price: 1200, duration: 60, description: "Комплексная стрижка с оформлением бороды" },
        { id: 3, name: "Женская стрижка", category: "Женские стрижки", price: 1500, duration: 60, description: "Стрижка с учетом типа волос и формы лица" },
        { id: 4, name: "Женская стрижка + укладка", category: "Женские стрижки", price: 2000, duration: 90, description: "Стрижка с профессиональной укладкой" },
        { id: 5, name: "Окрашивание волос", category: "Окрашивание", price: 2500, duration: 120, description: "Окрашивание в один тон" },
        { id: 6, name: "Сложное окрашивание", category: "Окрашивание", price: 3500, duration: 180, description: "Мелирование, омбре, шатуш" },
        { id: 7, name: "Мужское окрашивание", category: "Окрашивание", price: 1200, duration: 60, description: "Окрашивание волос у мужчин" },
        { id: 8, name: "Укладка", category: "Укладки", price: 800, duration: 45, description: "Профессиональная укладка феном" },
        { id: 9, name: "Вечерняя укладка", category: "Укладки", price: 1500, duration: 60, description: "Сложная укладка для особых случаев" },
        { id: 10, name: "Кератиновое выпрямление", category: "Уход", price: 4000, duration: 150, description: "Восстановление и выпрямление волос" },
        { id: 11, name: "Ламинирование ресниц", category: "Брови и ресницы", price: 1500, duration: 60, description: "Процедура для укрепления и красоты ресниц" },
        { id: 12, name: "Коррекция бровей", category: "Брови и ресницы", price: 500, duration: 30, description: "Коррекция формы бровей" },
        { id: 13, name: "Маникюр", category: "Ногтевой сервис", price: 1200, duration: 60, description: "Классический маникюр с покрытием" },
        { id: 14, name: "Педикюр", category: "Ногтевой сервис", price: 1800, duration: 90, description: "Полный уход за стопами и ногтями" },
        { id: 15, name: "Массаж головы", category: "Уход", price: 800, duration: 30, description: "Расслабляющий массаж кожи головы" }
    ],
    
    // Мастера
    masters: [
        { 
            id: 1, 
            name: "Анна Волкова", 
            specialization: "Топ-стилист, колорист", 
            experience: "10 лет", 
            description: "Специалист по сложному окрашиванию и вечерним прическам. Сертифицированный мастер международного класса.",
            image: "master1.jpg",
            schedule: "Пн-Пт: 10:00-19:00",
            rating: 4.9,
            services: [3, 4, 5, 6, 9]
        },
        { 
            id: 2, 
            name: "Мария Смирнова", 
            specialization: "Парикмахер-стилист", 
            experience: "7 лет", 
            description: "Специалист по женским и детским стрижкам. Индивидуальный подход к каждому клиенту.",
            image: "master2.jpg",
            schedule: "Вт-Сб: 11:00-20:00",
            rating: 4.8,
            services: [3, 4, 8, 9, 15]
        },
        { 
            id: 3, 
            name: "Сергей Иванов", 
            specialization: "Барбер", 
            experience: "8 лет", 
            description: "Специалист по мужским стрижкам и уходу за бородой. Мастер классических и современных стрижек.",
            image: "master3.jpg",
            schedule: "Пн-Сб: 9:00-18:00",
            rating: 4.9,
            services: [1, 2, 7]
        },
        { 
            id: 4, 
            name: "Елена Ковалева", 
            specialization: "Мастер по уходу", 
            experience: "12 лет", 
            description: "Специалист по восстановлению волос и уходовым процедурам. Эксперт в области кератинового выпрямления.",
            image: "master4.jpg",
            schedule: "Ср-Вс: 10:00-19:00",
            rating: 4.7,
            services: [5, 6, 10, 11, 12, 15]
        },
        { 
            id: 5, 
            name: "Ольга Петрова", 
            specialization: "Мастер ногтевого сервиса", 
            experience: "6 лет", 
            description: "Специалист по маникюру и педикюру. Работает с премиальными материалами.",
            image: "master5.jpg",
            schedule: "Вт-Пт: 10:00-20:00, Сб: 10:00-18:00",
            rating: 4.8,
            services: [13, 14]
        }
    ],
    
    // Отзывы
    reviews: [
        {
            id: 1,
            author: "Ольга Петрова",
            rating: 5,
            text: "Отличная парикмахерская! Мастер Анна - профессионал высшего класса. Цвет волос получился именно такой, как я хотела. Буду рекомендовать всем!",
            date: "2024-01-10T10:30:00Z",
            approved: true,
            masterId: 1
        },
        {
            id: 2,
            author: "Иван Сидоров",
            rating: 5,
            text: "Лучший барбер в городе! Сергей делает идеальные мужские стрижки. Хожу только к нему уже 3 года. Всегда аккуратно и быстро.",
            date: "2024-01-05T14:20:00Z",
            approved: true,
            masterId: 3
        },
        {
            id: 3,
            author: "Екатерина Новикова",
            rating: 4,
            text: "Хороший сервис, приятная атмосфера. Стрижку сделали качественно. Персонал вежливый, все объясняют. Буду возвращаться.",
            date: "2024-01-02T11:45:00Z",
            approved: true,
            masterId: 2
        },
        {
            id: 4,
            author: "Анна Козлова",
            rating: 5,
            text: "Делала кератиновое выпрямление у Елены. Волосы стали гладкими и блестящими. Процедура заняла 2 часа, но результат того стоит!",
            date: "2023-12-28T16:15:00Z",
            approved: true,
            masterId: 4
        },
        {
            id: 5,
            author: "Дмитрий Семенов",
            rating: 5,
            text: "Регулярно стригусь у Сергея. Всегда доволен результатом. Цены адекватные, атмосфера приятная. Рекомендую!",
            date: "2023-12-20T13:30:00Z",
            approved: true,
            masterId: 3
        }
    ],
    
    // Акции
    promotions: [
        {
            id: 1,
            title: "Скидка 20% на первый визит",
            description: "Для новых клиентов при записи через сайт",
            date: "2024-01-15",
            active: true,
            endDate: "2024-12-31"
        },
        {
            id: 2,
            title: "Комплекс стрижка+укладка со скидкой 15%",
            description: "Акция действует до конца месяца",
            date: "2024-01-20",
            active: true,
            endDate: "2024-01-31"
        },
        {
            id: 3,
            title: "Стрижка для студентов - 25%",
            description: "При предъявлении студенческого билета",
            date: "2024-01-10",
            active: true,
            endDate: "2024-12-31"
        },
        {
            id: 4,
            title: "Скидка 10% на услуги в день рождения",
            description: "В течение недели до и после дня рождения",
            date: "2024-01-05",
            active: true,
            endDate: "2024-12-31"
        }
    ],
    
    // Контакты
    contacts: {
        address: "Улица Карла Маркса, 13а, 1 этаж, Большой Камень, Приморский край, 692806",
        phone: "+7 (423) 352-14-25",
        phone2: "+7 924 732-14-25",
        email: "beauty-sphere@mail.ru",
        instagram: "@beauty_sphere_bk",
        vk: "vk.com/beautysphere_bk",
        telegram: "@beautysphere_bk",
        workingHours: {
            weekdays: "09:00 - 20:00",
            saturday: "10:00 - 19:00",
            sunday: "10:00 - 18:00"
        },
        coordinates: {
            lat: 43.121870,
            lng: 132.350657
        }
    },
    
    // API методы
    getServices: function(category = null) {
        return new Promise((resolve) => {
            if (category) {
                const filtered = this.services.filter(service => service.category === category);
                resolve(filtered);
            } else {
                resolve(this.services);
            }
        });
    },
    
    getMasters: function() {
        return new Promise((resolve) => {
            resolve(this.masters);
        });
    },
    
    getReviews: function() {
        return new Promise((resolve) => {
            resolve(this.reviews);
        });
    },
    
    getPromotions: function() {
        return new Promise((resolve) => {
            resolve(this.promotions.filter(p => p.active));
        });
    },
    
    getContacts: function() {
        return new Promise((resolve) => {
            resolve(this.contacts);
        });
    },
    
    // Инициализация данных в localStorage
    initData: function() {
        if (!localStorage.getItem('beautySphereServices')) {
            localStorage.setItem('beautySphereServices', JSON.stringify(this.services));
        }
        if (!localStorage.getItem('beautySphereMasters')) {
            localStorage.setItem('beautySphereMasters', JSON.stringify(this.masters));
        }
        if (!localStorage.getItem('beautySphereReviews')) {
            localStorage.setItem('beautySphereReviews', JSON.stringify(this.reviews));
        }
        if (!localStorage.getItem('beautySpherePromotions')) {
            localStorage.setItem('beautySpherePromotions', JSON.stringify(this.promotions));
        }
        if (!localStorage.getItem('beautySphereContacts')) {
            localStorage.setItem('beautySphereContacts', JSON.stringify(this.contacts));
        }
    }
};

// Инициализация данных при загрузке
document.addEventListener('DOMContentLoaded', function() {
    window.beautySphereData.initData();
});