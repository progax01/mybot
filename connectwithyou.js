const TelegramBot = require('node-telegram-bot-api');
const token = '6454018119:AAFZQfwfCggrtToY3OTJSBwkUwS7PQDv7uQ'; // Replace with your actual bot token
const bot = new TelegramBot(token, { polling: true });


const userData = {};
// Start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      keyboard: [
        ['Register'],
        ['View Details']
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(chatId, 'Welcome to your bot! Choose an option:', options);
  
});

// Register option handler
bot.onText(/Register/, (msg) => {
  const chatId = msg.chat.id;
  // Handle the registration process here
  bot.sendMessage(chatId, 'Please enter your name:');
  bot.once('message', (message) => {
    const userId = message.from.id;
    userData[userId] = { name: message.text };
    bot.sendMessage(chatId, 'Please enter your email:');
    bot.once('message', (message) => {
      userData[userId].email = message.text;
      bot.sendMessage(chatId, 'Please enter your phone number:');
      bot.once('message', (message) => {
        userData[userId].phone = message.text;
        bot.sendMessage(
          chatId,
          'Thank you for registering! Your registration is complete.'
        );
      });
    });
  }); 
  
});

// View Details option handler
bot.onText(/View Details/, (msg) => {
  const chatId = msg.chat.id;
  // Handle the view details process here
 const userId = msg.from.id;
 const userDetails = userData[userId];
  if (userDetails) {
    bot.sendMessage(chatId, `User Details:\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}`);
} else {
    bot.sendMessage(chatId, 'You have not registered yet. Register Now!');
}

});

// Handle user messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  // Handle user messages here, if needed
});
