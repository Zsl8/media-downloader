const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

class Poppeteer {
    constructor() {
        this.instagram = 'https://snapinsta.app'
        this.aiodown = 'https://aiodown.com/'
        this.browser = null;
    }

    async lunch() {
        this.browser = await puppeteer.launch({
            args: [
                '--ignore-certificate-errors',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1920,1080',
                "--disable-accelerated-2d-canvas",
                "--disable-gpu",
                "--disable-features=site-per-process"
            ],
            ignoreHTTPSErrors: true,
            headless: true,
        });
    }

    async get(url, type) {
        let page = await this.browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0')

        return new Promise(async (resolve, reject) => {
            try {
                if (type === 'instagram') {
                    await page.goto(this.instagram)
        
                    await this.bypassConsent(page)
        
                    await page.waitForSelector("#url")
                    await page.type("#url", url)
        
                    await page.waitForSelector("button[type=submit]")
                    await page.click("button[type=submit]")
        
                    await page.waitForSelector('.download-item');
        
                    const urls = await page.evaluate(() => {
                        const urls = [];
                        const elements = document.querySelectorAll('.download-item .download-bottom a');
                        elements.forEach(element => {
                            urls.push(element.href);
                        });
        
                        return urls;
                    });
        
                    await page.close()
        
                    return resolve(urls.length > 0 ? urls.length === 1 ? urls[0] : urls : null)
                } else {
                    page.goto(this.aiodown + `#url=${url}`)
        
                    page.on('response', async response => {
                        const request = response.request();
        
                        if (request.url().includes('video-data')) {
                            let result = await response.json();
                            let filter = this.filterContent(result);

                            if(filter) {
                                resolve(filter)
                            } else {
                                reject('No media found')
                            }

                            await page.close()
                            page = null;
                        }
                    });
        
                    await page.waitForSelector('#downloadBtn');
                    await this.wait(4000);
                    await page.click('#downloadBtn');
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    async bypassConsent(page) {
        const consentButton = await page.$('.fc-cta-consent');

        if (consentButton !== null) {
            await consentButton.click();
        }
    }

    async filterContent(data) {
        if(data && data.medias) {
            if(data.source === 'youtube') {
                let audio = data.medias.filter(media => media.audioAvailable);
                let video = data.medias.filter(media => media.videoAvailable);
    
                if(audio.length > 0 && video.length > 0) {
                    let selectedItem = video.sort((a, b) => a.size - b.size).pop();
                    
                    return selectedItem?.url
                } else if(video.length > 0) {
                    let selectedItem = video.sort((a, b) => a.size - b.size).pop();
                    
                    return selectedItem?.url
                } else if(audio.length > 0) {
                    let selectedItem = audio.sort((a, b) => a.size - b.size).pop();
                    
                    return selectedItem?.url
                } else {
                    return null;
                }
            } else {
                let selectedItem = data.medias.sort((a, b) => a.size - b.size).pop();
                    
                return selectedItem?.url
            }
        }
    }

    async wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }
}

module.exports = Poppeteer;