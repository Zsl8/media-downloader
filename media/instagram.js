const axios = require('axios')

class Instagram {
    get(url, puppeteer) {
        let type = this.getType(url)

        return new Promise(async (resolve, reject) => {
            try {
                if (type === 'stories') {
                    this.getStory(url).then(data => {
                        resolve(data)
                    })
                } else {
                    let data = await puppeteer.get(url, 'instagram')
    
                    resolve({
                        success: true,
                        data
                    })
                }
            } catch (error) {
                return reject({
                    success: false,
                    message: 'Invalid URL'
                });
            }
        })
    }

    getStory(url) {
        return axios.get(`https://snapinst.com/api/ig/story?url=${url}`).then(({ data }) => {
            let result = data.result[0]

            if (result && result.video_versions) {
                return { success: true, data: result.video_versions[0].url }
            } else if (result && result.image_versions2) {
                return { success: true, data: result.image_versions2.candidates[0].url }
            }
        }).catch(err => {
            return { success: false, message: err.message }
        })
    }

    getType(url) {
        const match = url.match(/\.com\/([^\/]+)/)[1]

        return match
    }
}

module.exports = Instagram