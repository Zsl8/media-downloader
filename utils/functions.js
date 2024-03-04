require('dotenv').config()

const axios = require('axios').default
const { parse } = require('url')

const isValidUrl = urlString => {
    try {
        const fccUrl = new URL(urlString)
        
        return Boolean(fccUrl.host || fccUrl.hostname)
    } catch {
        return false
    }
}

const getMainDomain = url => {
    let parsedUrl = parse(url)
    let hostParts = parsedUrl.hostname.split('.')
    let mainDomain = hostParts.slice(-2, -1).join('')

    if(mainDomain === 'youtu') mainDomain = 'youtube'

    return mainDomain
}

const shortURL = url => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios.post('https://i8.ae/api/url/add', {
                url: url
            }, {
                headers: {
                    'Authorization': 'Bearer ' + process.env.I8_API_KEY
                }
            })

            if(response.data.error) {
                reject(response.data.error)
            } else {
                resolve(response.data.shorturl)
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    isValidUrl,
    getMainDomain,
    shortURL
}