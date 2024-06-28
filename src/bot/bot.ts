import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_BOT_TOKEN } from '../Common/Constant';

export const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { 
    polling: {
        interval: 1000,  // 每秒检查一次更新
        autoStart: true,
        params: {
          timeout: 10    // 将超时时间增加到 10 秒
        },
        request: {
          agentOptions: {
            keepAlive: true,
            rejectUnauthorized: false  // 忽略自签名证书错误
          }
        }
      }
 });