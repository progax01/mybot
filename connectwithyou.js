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
   
  const userDetails = msg.text.split(',').map((item) => item.trim());
  if (userDetails.length === 3) {
      const [name, email, phone] = userDetails;
      userData[chatId] = { name, email, phone };
      bot.sendMessage(chatId, 'Registration successful! You can now use Option 2 to view your details.');
      bot.state[chatId] = states.MENU;
  } else {
      bot.sendMessage(chatId, 'Invalid format. Please enter your details in the format Register keyword with "Name, Email, Phone"');
  }
});

// View Details option handler
bot.onText(/View Details/, (msg) => {
  const chatId = msg.chat.id;
  // Handle the view details process here

  if (userData[chatId]) {
    const userDetails = userData[chatId];
    bot.sendMessage(chatId, `User Details:\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}`);
} else {
    bot.sendMessage(chatId, 'You selected Option 2, but you have not registered yet.');
}

});

// Handle user messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  // Handle user messages here, if needed
});
