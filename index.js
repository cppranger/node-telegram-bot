require('dotenv').config()
const Bot = require('node-telegram-bot-api')
const stickers = require('./src/constants/stickers')
const messages = require('./src/constants/messages')
const TOKEN = process.env.BOT_TOKEN

const bot = new Bot(TOKEN, { polling: true })
bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Информация' }
])

bot.on('message', async msg => {
    await (await answer(bot, msg))()
})

const answer = async (bot, msg) => {
    // gets data from msg object
    const text = msg.text
    const chatId = msg.chat.id
    const userName = msg.from.first_name
    const userId = msg.from.id
    const isBot = msg.from.is_bot

    // this simple 'router' finds router by message text,
    // then returns function
    // it gives opportunity to send multiple messages at once
    switch (text) {
        case '/start': {
            return async function () {
                await bot.sendSticker(chatId, stickers.hello)
                await bot.sendMessage(chatId, `${messages.welcome}, ${userName}`)
                await bot.sendMessage(chatId, messages.writeInfo)
            }
        }

        case '/info': {
            return async function () {
                await bot.sendMessage(chatId, `${messages.yourName}: ${userName}`)
                await bot.sendMessage(chatId, `${messages.yourId}: ${userId}`)
                if (!isBot) await bot.sendMessage(chatId, messages.notBot)
                else await bot.sendMessage(chatId, messages.bot)
            }
        }

        default: {
            return async function () {
                await bot.sendMessage(chatId, messages.incorrectCommand)
            }
        }
    }
}
