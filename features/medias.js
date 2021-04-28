/* eslint-disable indent */
const process = require("process");
const path = require("path");
const fs = require("fs");
const extName = require("ext-name");
const fetch = require("node-fetch");

module.exports = async (controller) => {
    controller.on("picture_message", async (bot, message) => {
        const {
            incoming_message: { channelData },
        } = message;

        const contentType = channelData?.MediaContentType0;
        console.log(contentType);
        switch (contentType) {
            case "image/png":
            case "image/jpeg":
                await bot.reply(message, "Nice pic!");
                break;
            case "audio/ogg":
            case "audio/mpeg":
                await bot.reply(message, "Beautiful voice!");
                break;
            case "video/mp4":
                await bot.reply(message, "Great video!");
                break;
            case "application/pdf":
                await bot.reply(message, "This is a document!");
                break;
            default:
                await bot.reply(
                    message,
                    "It doesn't look like any kind of audio or image that I know!"
                );
                return;
        }
        //
        const mediaUrl = channelData?.MediaUrl0;
        const extension = extName.mime(contentType)[0].ext;
        const mediaSid = path.basename(new URL(mediaUrl).pathname);
        const filename = `${mediaSid}.${extension}`;
        const fullPath = path.join(process.cwd(), "medias", filename);
        //
        SaveMedia(mediaUrl, fullPath);
        //
        async function SaveMedia(uri, path) {
            if (!fs.existsSync(path)) {
                const resp = await fetch(uri);
                const fileStream = fs.createWriteStream(path);
                resp.body
                    .pipe(fileStream)
                    .on("close", () =>
                        console.log("Media downloaded -> ", uri)
                    );
                // TODO: deleteMediaItem(mediaItem) on Twilio;
            }
        }
    });
};
