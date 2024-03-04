const router = require('express').Router()
const { Instagram, Youtube, Tiktok, Other } = require('../media')
const { isValidUrl, getMainDomain, shortURL } = require('../utils/functions')

let providers = {
    'youtube': new Youtube(),
    'instagram': new Instagram(),
    'tiktok': new Tiktok(),
    'other': new Other()
}

router.get('/', async (req, res) => {
    let { url, onlyUrl, shortUrl } = req.query
    if (!url || !isValidUrl(url)) return res.send({ success: false, message: 'invaild url' })

    let mainDomain = getMainDomain(url)

    if (!providers[mainDomain]) mainDomain = 'other'

    providers[mainDomain].get(url, req.puppeteer).then(async response => {
        if (response.data) {
            if(shortUrl === 'true') {
                response.data = await shortURL(response.data)
            }

            if (onlyUrl === 'true') return res.send(response.data)

            res.send(response)
        } else {
            res.status(500).send({
                success: false,
                message: 'No media found'
            })
        }
    }).catch(error => {
        res.status(500).send({
            success: false,
            message: error.message
        })
    })
})

module.exports = router