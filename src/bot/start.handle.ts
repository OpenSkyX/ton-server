import { AnyCnameRecord } from "dns";
import { bot } from "./bot";
import { CommonUtils } from "../Common/Utils/CommonUtils";
import { TELEGRAM_BOT_TOKEN } from "../Common/Constant";

import TelegramBot from 'node-telegram-bot-api';
import { generateInviteCode, getHeadImage } from "./utils/common";
import AccountInfo from "../Model/accountInfo.model";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import config from "../Config";
import { handleConnectCommand } from "./commands-handlers";
import { url } from "inspector";
import { getWallets } from "./ton-connect/wallets";
import { AT_WALLET_APP_NAME, addTGReturnStrategy, convertDeeplinkToUniversalLink } from "./utils/utils";
import { getConnector } from "./ton-connect/connector";
import AccountInvite from "../Model/accountInvite.model";
import { log } from "console";

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
    const tgId = msg.from.id;
    logger.log("start command");

    logger.log("fdafdasf:",msg);
    const invite = msg.text.split(" ")[1];
    if (invite) {
        console.log(invite);
        const input = splitAtFirstDash(invite);
        console.log("inoput:",input);
        if(input.length ==2){
            const inviter = input[0]
            const token = input[1]
            const ac = await AccountInvite.findOne({where:{currentTgId:tgId,tokenAddress:token}})
            if(!ac){
                await AccountInvite.create({
                    currentTgId:tgId,
                    inviteTgId:inviter,
                    tokenAddress:token
                })
            }else{
                logger.log("Binding relationship already exists");
            }

        }

    }
    const photoUrl = await getHeadImage(bot, msg);
    const newFilePath = generateFileName(photoUrl);
    logger.log(newFilePath[0]);
    await downloadImage(photoUrl, newFilePath[0]);
    // 拼接UIL
    const imageUrl = config.fileHost + ":" + config.serverPort + "/account/image/" + newFilePath[1];
    const accountInfo = await AccountInfo.findOne({ where: { telegramUserId: msg.from.id } });
    if (accountInfo) {
        //用户存在仅更新头像
        AccountInfo.update({ avatar: imageUrl }, { where: { telegramUserId: msg.from.id } })
    } else {
        
        await AccountInfo.create(
            {
                telegramUserId: tgId.toString(),
                username: msg.from.username,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                avatar: imageUrl,
                slfeCode: generateInviteCode(8).toString(),
                // inviteCode: "88888888",
            }
        );
    }
    const u = 'https://ivory-passive-possum-495.mypinata.cloud/ipfs/Qmc4LzdfLNi7azBSXzYqGGeGZaToQcqeTEk63bCd3h5WAC';
    await bot.sendPhoto(msg.chat.id, u)

    const keyboard = {
        reply_markup: {
            keyboard: [
                [
                    { text: '🔥 Hot coins', web_app: { url: 'https://ton-meme-three.vercel.app/?page=0' } },

                ],
                [
                    { text: '🌏 New coins', web_app: { url: 'https://ton-meme-three.vercel.app/?page=0' } },

                ],
                [
                    { text: '🤩 Start a new coins', web_app: { url: 'https://ton-meme-three.vercel.app/?page=1' } }
                ]
            ],
            resize_keyboard: true, // 可选项，调整按钮大小适应屏幕
            // one_time_keyboard: true // 可选项，键盘在使用一次后消失
        }
    };
    /* const connector = getConnector(msg.chat.id);    
    const wallets = await getWallets();
    const link = connector.connect(wallets);
    const atWallet = wallets.find(wallet => wallet.appName.toLowerCase() === AT_WALLET_APP_NAME);
    const atWalletLink = atWallet
        ? addTGReturnStrategy(
              convertDeeplinkToUniversalLink(link, atWallet?.universalLink),
              process.env.TELEGRAM_BOT_LINK!
          )
        : undefined; */
    const inlineKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Activate',
                    // url: atWalletLink
                    callback_data: JSON.stringify({
                        method: 'connect_cm'
                    })
                }],
            ],
            width:100,
            resize_keyboard: true,
        }
    };

    await bot.sendMessage(msg.chat.id, "Please activate!", inlineKeyboard);
    await bot.sendMessage(msg.chat.id, ".", keyboard);
}

export async function downloadImage(url: string, dest: string): Promise<void> {
    const writer = fs.createWriteStream(dest);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

export function generateFileName(originalUrl: string): [string, string] {
    const ext = path.extname(originalUrl); // 获取原始文件的扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    return [path.join(`${config.imageFilePath}`, `${uniqueSuffix}${ext}`), uniqueSuffix + ext];
}

function splitAtFirstDash(input: string): [string, string] {
    const index = input.indexOf('-');
    if (index === -1) {
      return [input, ''];
    }
    const part1 = input.substring(0, index);
    const part2 = input.substring(index + 1);
    return [part1, part2];
  }