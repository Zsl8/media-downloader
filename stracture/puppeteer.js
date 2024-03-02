const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

class Poppeteer {
    constructor() {
        this.instagram = 'https://snapinsta.app'
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
                "--disable-gpu"
            ],
            ignoreHTTPSErrors: true,
            headless: true,
        });
    }

    async get(url, type) {
        let page = await this.browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0')

        if (type === 'instagram') {
            await page.goto(this.instagram)

            await this.bypassConstant(page)

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

            return urls.length > 0 ? urls.length === 1 ? urls[0] : urls : null
        } else {
            // for later
        }
    }

    async bypassConstant(page) {
        const consentButton = await page.$('.fc-cta-consent');

        if (consentButton !== null) {
            await consentButton.click();
        }
    }
}

module.exports = Poppeteer;