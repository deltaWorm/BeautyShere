const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Пути к файлам данных
const DATA_DIR = path.join(__dirname, 'data');

// Инициализация данных
async function initData() {
    const defaultData = {
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
            { id: 12, name: "Коррекция бровей", category: "Брови и ресницы", price: 500, duration: 30, description: "Коррекция формы бровей" }
        ],
        masters: [
            { 
                id: 1, 
                name: "Анна Волкова", 
                specialization: "Топ-стилист, колорист", 
                experience: "10 лет", 
                description: "Специалист по сложному окрашиванию и вечерним прическам",
                image: "master1.jpg",
                schedule: "Пн-Пт: 10:00-19:00"
            },
            { 
                id: 2, 
                name: "Мария Смирнова", 
                specialization: "Парикмахер-стилист", 
                experience: "7 лет", 
                description: "Специалист по женским и детским стрижкам",
                image: "master2.jpg",
                schedule: "Вт-Сб: 11:00-20:00"
            },
            { 
                id: 3, 
                name: "Сергей Иванов", 
                specialization: "Барбер", 
                experience: "8 лет", 
                description: "Специалист по мужским стрижкам и уходу за бородой",
                image: "master3.jpg",
                schedule: "Пн-Сб: 9:00-18:00"
            },
            { 
                id: 4, 
                name: "Елена Ковалева", 
                specialization: "Мастер по уходу", 
                experience: "12 лет", 
                description: "Специалист по восстановлению волос и уходовым процедурам",
                image: "master4.jpg",
                schedule: "Ср-Вс: 10:00-19:00"
            }
        ],
        reviews: [
            {
                id: 1,
                author: "Ольга Петрова",
                rating: 5,
                text: "Отличная парикмахерская! Мастер Анна - профессионал высшего класса. Цвет волос получился именно такой, как я хотела.",
                date: "2024-01-10T10:30:00Z",
                approved: true
            },
            {
                id: 2,
                author: "Иван Сидоров",
                rating: 5,
                text: "Лучший барбер в городе! Сергей делает идеальные мужские стрижки. Хожу только к нему уже 3 года.",
                date: "2024-01-05T14:20:00Z",
                approved: true
            },
            {
                id: 3,
                author: "Екатерина Новикова",
                rating: 4,
                text: "Хороший сервис, приятная атмосфера. Стрижку сделали качественно, но пришлось немного подождать.",
                date: "2024-01-02T11:45:00Z",
                approved: true
            }
        ],
        appointments: [],
        users: [
            { id: 1, email: "admin@beauty.ru", password: "admin123", role: "admin", name: "Администратор" },
            { id: 2, email: "user@beauty.ru", password: "user123", role: "user", name: "Тестовый пользователь" }
        ],
        promotions: [
            {
                id: 1,
                title: "Скидка 20% на первый визит",
                description: "Для новых клиентов при записи через сайт",
                date: "2024-01-15",
                active: true
            },
            {
                id: 2,
                title: "Комплекс стрижка+укладка со скидкой 15%",
                description: "Акция действует до конца месяца",
                date: "2024-01-20",
                active: true
            }
        ],
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
            }
        }
    };

    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        for (const [key, value] of Object.entries(defaultData)) {
            const filePath = path.join(DATA_DIR, `${key}.json`);
            try {
                await fs.access(filePath);
            } catch {
                await fs.writeFile(filePath, JSON.stringify(value, null, 2));
            }
        }
    } catch (error) {
        console.error('Ошибка инициализации данных:', error);
    }
}

// API для услуг
app.get('/api/services', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, 'services.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Ошибка загрузки услуг' });
    }
});

app.get('/api/services/category/:category', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, 'services.json'), 'utf8');
        const services = JSON.parse(data);
        const filtered = services.filter(s => s.category === req.params.category);
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка загрузки услуг' });
    }
});

// API для мастеров
app.get('/api/masters', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, 'masters.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Ошибка загрузки мастеров' });
    }
});

// API для отзывов
app.get('/api/reviews', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, 'reviews.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.json([]);
    }
});

app.post('/api/reviews', async (req, res) => {
    try {
        const newReview = {
            id: Date.now(),
            ...req.body,
            date: new Date().toISOString(),
            approved: false
        };

        const data = await fs.readFile(path.join(DATA_DIR, 'reviews.json'), 'utf8');
        const reviews = JSON.parse(data);
        reviews.push(newReview);
        
        await fs.writeFile(path.join(DATA_DIR, 'reviews.json'), JSON.stringify(reviews, null, 2));
        res.json({ success: true, review: newReview });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сохранения отзыва' });
    }
});

// API для записи
app.post('/api/appointments', async (req, res) => {
    try {
        const newAppointment = {
            id: Date.now(),
            ...req.body,
            status: 'pending',
            created: new Date().toISOString()
        };

        const data = await fs.readFile(path.join(DATA_DIR, 'appointments.json'), 'utf8');
        const appointments = JSON.parse(data);
        appointments.push(newAppointment);
        
        await fs.writeFile(path.join(DATA_DIR, 'appointments.json'), JSON.stringify(appointments, null, 2));
        
        // Логирование новой записи
        console.log(' Новая запись создана:', {
            id: newAppointment.id,
            service: newAppointment.service?.name,
            master: newAppointment.master?.name,
            date: newAppointment.date,
            time: newAppointment.time,
            client: newAppointment.clientName
        });
        
        res.json({ success: true, appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка создания записи' });
    }
});

// API для контактов
app.get('/api/contacts', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, 'contacts.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Ошибка загрузки контактов' });
    }
});

// API для акций
app.get('/api/promotions', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, 'promotions.json'), 'utf8');
        const promotions = JSON.parse(data);
        const activePromotions = promotions.filter(p => p.active);
        res.json(activePromotions);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка загрузки акций' });
    }
});

// API для пользователей (авторизация)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await fs.readFile(path.join(DATA_DIR, 'users.json'), 'utf8');
        const users = JSON.parse(data);
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Создаем сессию (без пароля)
            const session = {
                userId: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            };
            res.json({ success: true, user: session });
        } else {
            res.status(401).json({ error: 'Неверный email или пароль' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка авторизации' });
    }
});

// API для регистрации (демо)
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        
        // Валидация
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Заполните обязательные поля' });
        }
        
        // Проверка существующего пользователя
        const data = await fs.readFile(path.join(DATA_DIR, 'users.json'), 'utf8');
        const users = JSON.parse(data);
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }
        
        // Создание нового пользователя
        const newUser = {
            id: Date.now(),
            email,
            password,
            name,
            phone: phone || '',
            role: 'user'
        };
        
        users.push(newUser);
        await fs.writeFile(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2));
        
        // Возвращаем данные без пароля
        const { password: _, ...userWithoutPassword } = newUser;
        res.json({ success: true, user: userWithoutPassword });
        
    } catch (error) {
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

// API для получения записей пользователя
app.get('/api/appointments/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const data = await fs.readFile(path.join(DATA_DIR, 'appointments.json'), 'utf8');
        const appointments = JSON.parse(data);
        
        const userAppointments = appointments.filter(apt => apt.clientEmail === email);
        res.json(userAppointments);
    } catch (error) {
        res.json([]);
    }
});

// Запуск сервера
initData().then(() => {
    app.listen(PORT, () => {
        console.log('========================================');
        console.log(' СЕРВЕР ЗАПУЩЕН УСПЕШНО! ');
        console.log('========================================');
        console.log(` Сайт: http://localhost:${PORT}`);
        console.log('========================================');
        console.log(' API эндпоинты:');
        console.log('GET  /api/services - все услуги');
        console.log('GET  /api/masters - все мастера');
        console.log('GET  /api/reviews - все отзывы');
        console.log('POST /api/reviews - добавить отзыв');
        console.log('POST /api/appointments - создать запись');
        console.log('GET  /api/contacts - контактная информация');
        console.log('GET  /api/promotions - активные акции');
        console.log('POST /api/login - авторизация');
        console.log('POST /api/register - регистрация');
        console.log('GET  /api/appointments/:email - записи пользователя');
        console.log('========================================');
        console.log(' Тестовые пользователи:');
        console.log('Админ: admin@beauty.ru / admin123');
        console.log('Пользователь: user@beauty.ru / user123');
        console.log('========================================');
    });
});