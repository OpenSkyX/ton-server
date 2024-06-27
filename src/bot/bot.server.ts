import { Injectable } from "@nestjs/common";
import { bot } from './bot';
import { walletMenuCallbacks } from "./connect.wallet.menu";
import { handleConnectCommand, handleSendTXCommand, handleDisconnectCommand, handleShowMyWalletCommand } from "./commands-handlers";
import { handleStartCommand } from "./start.handle";

export async function botServe() {
  const callbacks = {
    ...walletMenuCallbacks
  };

  bot.on('callback_query', query => {
    if (!query.data) {
      return;
    }
    let request: { method: string; data: string };
    try {
      request = JSON.parse(query.data);
    } catch {
      return;
    }
    if (!callbacks[request.method as keyof typeof callbacks]) {
      return;
    }
    callbacks[request.method as keyof typeof callbacks](query, request.data);
  });

  // 处理 polling 错误
  bot.on('polling_error', (error) => {
    console.error('Polling error occurred:', error);
    // 根据具体错误类型进行处理
    // 如果是网络错误，可以尝试重连
    if (error.code === 'EFATAL') {
      console.error('Fatal error, exiting...');
      // process.exit(1); // 或者根据需求重新启动轮询
    }
    // 添加其他错误处理逻辑
  });


  /* // 重新启动轮询的函数
  function restartBot() {
    bot.stopPolling()
      .then(() => {
        console.log('Bot stopped.');
        bot =new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

        // 重新绑定事件处理器
        bot.onText(/\/start(?:\s+(\w+))?/, (msg, match) => {
          const chatId = msg.chat.id;
          const parameter = match && match[1] ? match[1] : null;

          if (parameter) {
            bot.sendMessage(chatId, `你传递的参数是: ${parameter}`);
          } else {
            bot.sendMessage(chatId, '没有传递任何参数');
          }
        });

        bot.on('polling_error', (error) => {
          console.error('Polling error occurred:', error);
          if (error.code === 'EFATAL') {
            console.error('Fatal error, restarting bot...');
            restartBot();
          }
        });

        console.log('Bot restarted.');
      })
      .catch((err) => {
        console.error('Failed to stop bot:', err);
      });
  } */


  bot.onText(/\/connect/, handleConnectCommand);

  bot.onText(/\/send_tx/, handleSendTXCommand);

  bot.onText(/\/disconnect/, handleDisconnectCommand);

  bot.onText(/\/my_wallet/, handleShowMyWalletCommand);

  bot.onText(/\/start/, handleStartCommand);
}

