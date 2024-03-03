class Other {
    get(url, puppeteer) {
        return new Promise(async (resolve, reject) => {
            try {
                puppeteer.get(url, 'aiodown').then(data => {
                    resolve({
                        success: true,
                        data
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

module.exports = Other