const Puppeteer = require('./stracture/puppeteer')
const puppeteer = new Puppeteer()

puppeteer.lunch()

const app = require('express')()
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.listen(3000, () => console.log('Server running on port 3000'))

app.use((req, res, next) => {
    req.puppeteer = puppeteer

    next()
})

app.use('/download', require('./routes/download'))

app.get('*', (req, res) => {
    res.json({
        success: false,
        message: 'invalid endpoint'
    })
})