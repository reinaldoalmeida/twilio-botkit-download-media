module.exports = function (controller) {
    controller.on("message, direct_message", async (bot, message) => {
        const { text } = message;
        if (text) await bot.reply(message, `Echo: ${text}`);
    });
};
