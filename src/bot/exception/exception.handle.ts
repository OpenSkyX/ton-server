const {GrammyError } = require('grammy');
import { AnyCnameRecord } from "dns";
import config from "../../Config"
import { CommonUtils } from "../../Common/Utils/CommonUtils";
// import fetch from 'node-fetch';
import { TELEGRAM_BOT_TOKEN } from "../../Common/Constant";
export async function exceptionHandle(bot: any) {
    bot.catch((err: any) => {
        console.error('捕获到的错误:', err);

        // 可选：你可以根据不同类型的错误进行不同的处理
        if (err instanceof GrammyError) {
            console.error('Grammy 框架错误详情:', err.description);
        }
    })

}