const { Instagram, Youtube, Tiktok } = require('./media')
const app = require('express')()
const bodyParser = require("body-parser");
const { parse } = require('url');

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

    const parsedUrl = parse(url);
    const hostParts = parsedUrl.hostname.split('.');
    const mainDomain = hostParts.slice(-2, -1).join('');

    if(mainDomain === 'youtu') mainDomain = 'youtube'

    providers[mainDomain].get(url).then(data => {
        res.send(data)
    })
})


const isValidUrl = urlString => {
    try {
        const fccUrl = new URL(urlString)
        
        return Boolean(fccUrl.host || fccUrl.hostname)
    } catch {
        return false
    }
}

isValidUrl()