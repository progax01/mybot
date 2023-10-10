const TelegramBot = require("node-telegram-bot-api");
const token = "6454018119:AAFZQfwfCggrtToY3OTJSBwkUwS7PQDv7uQ"; // Replace with your actual bot token
const bot = new TelegramBot(token, { polling: true });
const { Web3 } = require("web3");
const infuraUrl =
  "https://sepolia.infura.io/v3/da8932a090e84bc8ac665b643d5bf539"; // Replace with your Infura API key
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
//const fetch = require('node-fetch');

const userData = {};
// Start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      keyboard: [
        ["Register"],
        ["View Details"],
        ["Check Ethereum Balance"],
        ["Track ERC20"],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(chatId, "Welcome to your bot! Choose an option:", options);
});

// Register option handler
bot.onText(/Register/, (msg) => {
  const chatId = msg.chat.id;
  // Handle the registration process here
  bot.sendMessage(chatId, "Please enter your name:");
  bot.once("message", (message) => {
    const userId = message.from.id;
    userData[userId] = { name: message.text };
    bot.sendMessage(chatId, "Please enter your email:");
    bot.once("message", (message) => {
      userData[userId].email = message.text;
      bot.sendMessage(chatId, "Please enter your phone number:");
      bot.once("message", (message) => {
        userData[userId].phone = message.text;
        bot.sendMessage(
          chatId,
          "Thank you for registering! Your registration is complete."
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
    bot.sendMessage(
      chatId,
      `User Details:\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}`
    );
  } else {
    bot.sendMessage(chatId, "You have not registered yet. Register Now!");
  }
});

bot.onText(/Check Ethereum Balance/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Connected, Enter Ethereum Address:");

  bot.once("message", (message) => {
    const address = message.text;

    // Use a specific block number or 'latest' as the second argument
    const blockNumberOrTag = "latest"; // You can change this to 'pending' or a block number

    web3.eth
      .getBalance(address, blockNumberOrTag)
      .then((balanceInWei) => {
        const balanceAsString = balanceInWei.toString();
        const balanceInEther = web3.utils.fromWei(balanceAsString, "ether");
        bot.sendMessage(chatId, `Balance of ${address}: ${balanceInEther} ETH`);
      })
      .catch((error) => {
        bot.sendMessage(chatId, "Error fetching balance");
        console.error(error);
      });
  });
});

bot.onText(/Track ERC20/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Start tracking ERC20 Token deployment");
 
  // async function checkForNewERC20Tokens() {
  //   const latestBlock = await web3.eth.getBlock('latest');
  
  //   for (const txHash of latestBlock.transactions) {
  //     const tx = await web3.eth.getTransaction(txHash);
  //     const receipt = await web3.eth.getTransactionReceipt(txHash);

  //     if (tx.to === null && receipt.contractAddress) {

  //       bot.sendMessage(chatId, `New ERC20 token deployed!\nContract Address: ${receipt.contractAddress}`);
  //     }
  //   }
  // }

  
// Function to check for new ERC20 token deployments
async function checkForNewERC20Tokens() {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  console.log("block")
  const block = await web3.eth.getBlock(latestBlockNumber, true);

  if (!block || !block.transactions) {
    return;
  }

  // Iterate through the transactions in the latest block
  for (const tx of block.transactions) {
    const txReceipt = await web3.eth.getTransactionReceipt(tx.hash);

    if (tx.to === null && txReceipt.contractAddress  && await isERC20Token(txReceipt.contractAddress)) {
      console.log(txReceipt.contractAddress);

      bot.sendMessage(chatId, `New ERC20 token deployed!\nContract Address: ${txReceipt.contractAddress}`);
    }
  }

}

async function isERC20Token(contractAddress) {

  const contractABI = await web3.eth.getCode(contractAddress);

  
  const ERC20TokenFunctions = ["balanceOf", "transfer", "allowance", "approve", "totalSupply"];
  for (const functionName of ERC20TokenFunctions) {
    if (!contractABI.includes(functionName)) {
      return false;
    }
  }

  return true;
}

  setInterval(checkForNewERC20Tokens, 60000); // Check every 1 minute

  console.log('Bot is running and monitoring Sepolia blockchain for new ERC20 tokens...');
});

// Handle user messages
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  // Handle user messages here, if needed 52249708.


});
