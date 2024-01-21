const ytdl = require('ytdl-core');

class Youtube {
    async get(url) {
        return new Promise(async (resolve, reject) => {
            const info = await ytdl.getInfo(url);
            const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
            if (format) {
                return resolve({
                    success: true,
                    data: format.url
                });
            } else {
                return reject({
                    success: false,
                    message: 'Invalid URL'
                });
            }
        })
    }
}

module.exports = Youtube;