const { TTScraper } = require("tiktok-scraper-ts");
const TikTokScraper = new TTScraper();

class TickTok {
    get(url) {
        return new Promise(async (resolve, reject) => {
            try {
                TikTokScraper.noWaterMark(url).then((data) => {
                    resolve({
                        success: true,
                        data: data
                    })
                })
            } catch (error) {
                return reject({
                    success: false,
                    message: 'Invalid URL'
                });
            }
        })
    }
}

module.exports = TickTok