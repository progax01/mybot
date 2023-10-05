
const TelegramBot = require('node-telegram-bot-api');
//6454018119:AAEjMAur3dosUBa87wk7ImkxOghoQ2cCHPA
//new  6089471409:AAF3E6qoRwgoAzBwAdduIwsI_N0prrylc6c
//const token = '6454018119:AAFZQfwfCggrtToY3OTJSBwkUwS7PQDv7uQ';
const token =  '6089471409:AAF3E6qoRwgoAzBwAdduIwsI_N0prrylc6c';
const bot = new TelegramBot(token, { polling: true });

const states = {
    MENU: 'start',
    REGISTER: 'register', // New state for registration
    VIEW_DETAILS: 'view-details', // New state for displaying user details
};

 
bot.on('polling_error', (error) => {
    console.error('dsf Polling error:', error.message);
});

bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error.message);
});

// Handle other possible errors
bot.on('error', (error) => {
    console.error('Bot error:', error.message);
});


// Object to store user data temporarily
const userData = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! Please select an option:', {
        reply_markup: {
            keyboard: [
                ['register'],
                ['view-details'],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    });

    bot.state[chatId] = states.MENU;
});

bot.onText(/Register/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'You selected Option 1. Please enter your personal details in the format: "Name, Email, Phone"');

    // Set the conversation state to REGISTER
    bot.state[chatId] = states.REGISTER;
});

bot.onText(/View Details/, (msg) => {
    const chatId = msg.chat.id;

    // Check if user has registered
    if (userData[chatId]) {
        const userDetails = userData[chatId];
        bot.sendMessage(chatId, `User Details:\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}`);
    } else {
        bot.sendMessage(chatId, 'You selected Option 2, but you have not registered yet.');
    }

    // Set the conversation state to OPTION_2
    bot.state[chatId] = states.USER_DETAILS;
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const currentState = bot.state[chatId];

    switch (currentState) {
        case states.REGISTER:
            const userDetails = msg.text.split(',').map((item) => item.trim());
            if (userDetails.length === 3) {
                const [name, email, phone] = userDetails;
                userData[chatId] = { name, email, phone };
                bot.sendMessage(chatId, 'Registration successful! You can now use Option 2 to view your details.');
                bot.state[chatId] = states.MENU;
            } else {
                bot.sendMessage(chatId, 'Invalid format. Please enter your details in the format: "Name, Email, Phone"');
            }
            break;
        default:
            bot.sendMessage(chatId, 'Please select an option:');
            bot.state[chatId] = states.MENU;
    }
});
