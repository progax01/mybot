const TelegramBot = require("node-telegram-bot-api");
const token = "6454018119:AAFZQfwfCggrtToY3OTJSBwkUwS7PQDv7uQ"; // Replace with your actual bot token
const bot = new TelegramBot(token, { polling: true });
const { Web3 } = require("web3");
const infuraUrl ="https://sepolia.infura.io/v3/da8932a090e84bc8ac665b643d5bf539"; // Replace with your Infura API key
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

async function checkForNewERC20Tokens() {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  console.log("block")
  const block = await web3.eth.getBlock(latestBlockNumber, true);

  if (!block || !block.transactions) {
    return;
  }

   
  for (const tx of block.transactions) {
    const txReceipt = await web3.eth.getTransactionReceipt(tx.hash);

    if (tx.to === null && txReceipt.contractAddress) {
    
      const contractCode = await web3.eth.getCode(txReceipt.contractAddress);
      if (contractCode !== '0x') {
        // Fetch the contract's ABI
        const contractABIHex = await web3.eth.getStorageAt(txReceipt.contractAddress, 0);
  
        // Convert the ABI from hexadecimal to a string
        const contractABI = web3.utils.hexToAscii(contractABIHex);
         console.log("ai", contractABI);
        // The ABI may now be in JSON format
        try {
          const parsedABI = JSON.parse(contractABI);
          console.log('Contract ABI:', parsedABI);

          const ERC20TokenFunctions = ["balanceOf", "transfer","allowance","approve","totalSupply",];

                for (const functionName of ERC20TokenFunctions) {
                  if (!contractABI.includes(functionName)) {
                    isERC20Token = false;
                  } else {
                    isERC20Token = true;
                  }
           }
           console.log("IT is ERC20", isERC20Token);
        } catch (error) {
          console.error('Error parsing contract ABI:', error);
        }
      }
     
//GET ABI

      bot.sendMessage(chatId, `ERC20 token deployed!\nContract Address: ${txReceipt.contractAddress}`);
    }
  }
}
  setInterval(checkForNewERC20Tokens, 6000); // Check every 1 minute

  console.log('Bot is running and monitoring Sepolia blockchain for new ERC20 tokens...');
});
// bot.onText(/Track ERC20/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Start tracking ERC20 Token deployment");

//   async function checkForNewERC20Tokens() {
//     const latestBlockNumber = await web3.eth.getBlockNumber();
//     console.log("block",latestBlockNumber);
//     const block = await web3.eth.getBlock(latestBlockNumber, true);

//     if (!block || !block.transactions) {
//       return;
//     }

//     // Iterate through the transactions in the latest block
//     for (const tx of block.transactions) {
//       const txReceipt = await web3.eth.getTransactionReceipt(tx.hash);

//       let  isERC20Token = false;

//    // console.log("ttest", tx.Receipt.contractAddress);  // Get the contract code
//     const contractCode = await web3.eth.getCode(txReceipt.contractAddress);


// // Decode the contract code into an ABI object
//     const contractABI = JSON.parse(web3.utils.decodeABI(contractCode));

     

//       const ERC20TokenFunctions = ["balanceOf", "transfer","allowance","approve","totalSupply",];

//       for (const functionName of ERC20TokenFunctions) {
//         if (!contractABI.includes(functionName)) {
//           isERC20Token = false;
//         } else {
//           isERC20Token = true;
//         }
//  }
//  console.log("IT is ERC20", isERC20Token);

//         if (tx.to === null && txReceipt.contractAddress && isERC20Token)
//       {
//           console.log(txReceipt.contractAddress);

//           bot.sendMessage(chatId,`New ERC20 token deployed!\nContract Address: ${txReceipt.contractAddress}`);
//         }
     
//     }
//   }

//   setInterval(checkForNewERC20Tokens, 1000); // Check every 1 minute

//   console.log("Bot is running and monitoring Sepolia blockchain for new ERC20 tokens..."
//   );
// });

// Handle user messages
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  // Handle user messages here, if needed 52249708.
});
