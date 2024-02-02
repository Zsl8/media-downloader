const { Instagram, Youtube, Tiktok } = require('./media')
const app = require('express')()
const bodyParser = require("body-parser");
const { parse } = require('url');
const { isValidUrl } = require('./utils/functions');

app.use(bodyParser.json());
app.listen(3000)

let providers = {
    'youtube': new Youtube(),
    'instagram': new Instagram(),
    'tiktok': new Tiktok(),
}

app.get('/download', async (req, res) => {
    let { url } = req.query
    if(!url || !isValidUrl(url)) return res.send({ success: false, message: 'invaild url' })

    let parsedUrl = parse(url);
    let hostParts = parsedUrl.hostname.split('.');
    let mainDomain = hostParts.slice(-2, -1).join('');

    if(mainDomain === 'youtu') mainDomain = 'youtube'

    providers[mainDomain].get(url).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
})

app.get('*', (req, res) => {
    res.json({
        success: false,
        message: 'invalid endpoint'
    })
})