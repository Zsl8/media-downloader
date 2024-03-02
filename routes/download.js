const router = require('express').Router()
const { Instagram, Youtube, Tiktok } = require('../media')
const { isValidUrl, getMainDomain } = require('../utils/functions')

let providers = {
    'youtube': new Youtube(),
    'instagram': new Instagram(),
    'tiktok': new Tiktok(),
}

router.get('/', async (req, res) => {
    let { url } = req.query
    if(!url || !isValidUrl(url)) return res.send({ success: false, message: 'invaild url' })

    let mainDomain = getMainDomain(url)

    providers[mainDomain].get(url, req.puppeteer).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
})

module.exports = router