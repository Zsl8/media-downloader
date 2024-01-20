const { TTScraper } = require("tiktok-scraper-ts");
const TikTokScraper = new TTScraper();

class TickTok {
    get(url) {
        return new Promise(async (resolve, reject) => {
            TikTokScraper.noWaterMark(url).then((data) => {
                resolve({
                    success: true,
                    data: data
                })
            })
        })
    }
}

module.exports = TickTok