import { CommonUtils } from "../../Common/Utils/CommonUtils";
import { TELEGRAM_BOT_TOKEN } from "../../Common/Constant";
import TelegramBot from 'node-telegram-bot-api';
import {Logger} from "@nestjs/common";

export async function getHeadImage(bot: any, msg: TelegramBot) {
    const logger = new Logger(getHeadImage.name);
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUserProfilePhotos?user_id=${msg.from.id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    let photoUrl = '';
    logger.log(apiUrl);
    if (data.ok) {
        const photos = data.result.photos;
        if (photos.length > 0) {
            const fileId = photos[0][0].file_id;
            const fileUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`;
            const response = await fetch(fileUrl);
            const data = await response.json();
            if (data.ok) {
                const filePath = data.result.file_path;
                photoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
            }
        }
    }
    logger.log(`图片地址：${photoUrl}`);
    return photoUrl;
}

export function generateInviteCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }