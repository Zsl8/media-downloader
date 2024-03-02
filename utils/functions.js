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

module.exports = {
    isValidUrl,
    getMainDomain
}