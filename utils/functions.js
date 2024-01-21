const isValidUrl = urlString => {
    try {
        const fccUrl = new URL(urlString)
        
        return Boolean(fccUrl.host || fccUrl.hostname)
    } catch {
        return false
    }
}

module.exports = {
    isValidUrl
}