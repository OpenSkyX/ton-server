import { AnyCnameRecord } from "dns";
import { bot } from "./bot";
import { CommonUtils } from "src/Common/Utils/CommonUtils";
import { TELEGRAM_BOT_TOKEN } from "src/Common/Constant";

import TelegramBot from 'node-telegram-bot-api';
import { generateInviteCode, getHeadImage } from "./utils/common";
import AccountInfo from "../Model/accountInfo.model";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { Injectable, Logger } from "@nestjs/common";

/* 
@Injectable()
export class StartCommand {

    private logger = new Logger(StartCommand.name);

    constructor(private readonly accountInfoManager: AccountInfoManager) { }

    async startCommand(msg: TelegramBot.Message) {

        this.logger.log("start command");
        const photoUrl = await getHeadImage(bot, msg);
        const accountInfo = await AccountInfo.findOne({ where: { telegramUserId: msg.from.id } });
        const result = await AccountInfo.findAll();
        if (accountInfo) {
            //用户存在仅更新头像
            return;
        } else {
            //用户不存在创建用户
            let account = new AccountInfo();
            account.telegramUserId = msg.from.id;
            account.username = msg.from.username;
            account.firstName = msg.from.first_name;
            account.lastName = msg.from.last_name;
            account.avatar = photoUrl;
            AccountInfo.create({
                telegramUserId: msg.from.id,
                username: msg.from.username,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                avatar: photoUrl
            });
        }

        bot.sendMessage(
            msg.chat.id,
            `
        This is an example of a telegram bot for connecting to TON wallets and sending transactions with TonConnect.
                      
        Commands list: 
        /connect - Connect to a wallet
        /my_wallet - Show connected wallet
        /send_tx - Send transaction
        /disconnect - Disconnect from the wallet
      
        `,
        );
    }
} */

export async function handleStartCommand(msg: TelegramBot.Message): Promise<void> {
    const logger = new Logger(handleStartCommand.name);
    const accountInfoManager = new AccountInfoManager();

    logger.log("start command");
    const inviteCode = msg.text.split(" ")[1];
    logger.log(inviteCode);    
    const photoUrl = await getHeadImage(bot, msg);
    const accountInfo = await AccountInfo.findOne({ where: { telegramUserId: msg.from.id } });
    if (accountInfo) {
        //用户存在仅更新头像
        AccountInfo.update({ avatar: photoUrl},{where:{telegramUserId:msg.from.id}})
    } else {
        const tgId = msg.from.id;
        await AccountInfo.create(
            {
                telegramUserId: tgId.toString(),
                username: msg.from.username,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                avatar: photoUrl,
                slfeCode: generateInviteCode(8).toString(),
                inviteCode: inviteCode
            }
        );
    }

    bot.sendMessage(
        msg.chat.id,
        `
        This is an example of a telegram bot for connecting to TON wallets and sending transactions with TonConnect.
        Commands list: 
        /connect - Connect to a wallet
        /my_wallet - Show connected wallet
        /send_tx - Send transaction
        /disconnect - Disconnect from the wallet
        `,
    );
}

