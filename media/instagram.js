const axios = require('axios')

class Instagram {
    get(url) {
        let type = this.getType(url)

        return new Promise((resolve, reject) => {
            if (type === 'stories') {
                this.getStory(url).then(data => {
                    resolve(data)
                })
            } else {
                this.getReel(url).then(data => {
                    resolve(data)
                })
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

    getReel(url) {
        return axios.post(`https://sssinstagram.com/r`, {
            link: url,
            token: ""
        }, {
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "cookie": "XSRF-TOKEN=eyJpdiI6IkwyWjNTWFJUNzYwQjlRcldCVEQxbXc9PSIsInZhbHVlIjoidVYweDVmWmdXMUZsak9nZ0R6OWd3QXE4cmprT2JiMTI1K2UvYmVyYjdSWGgwRFR5OFE0dDNxcEkxQmdHTjVmbkJnS2EyaEQxdUY5aVhRa0VUYXdzMmVpSDdtc1lKYkhDWTdVWFBPekYySjluTWZjRHFIYW51MFp1b0hCbUI2QlQiLCJtYWMiOiIwZDRkOGVkYzFmZThlY2I1NDEyMDg1YjQwZTM1MDcwZGY4MWFjNGY4Yzk1NWU5OTEyOTE1ZWVjMDI2NWY5MjYxIiwidGFnIjoiIn0%3D; sssinstagram_session=eyJpdiI6Im52L3I5T3FwRXBaVVBoSms5VHJHVXc9PSIsInZhbHVlIjoiQ0cyNEpYdmtPMnpBWG9xMlQvb1dvT2tnOTFPOWI2VXBSeG9ZcDRiT0hQeU5mSDdUVStuMnRpYkNQVXVuekN3NHRkRGFlU09WcGhUVldVQkFyTnBQNm1LMUZ4QmlTcHRZc1BuZllONHZyN0VNRnJpTHBxQWk4b3c3cFNnL3JkVm4iLCJtYWMiOiIzZTdkODViNjliOTQwM2NhZTEzMWI2NDk2YmNkYjM4MTM3YmMxN2MwYWMzZGM0N2VlYTZiMDY5MjU0MDQ5MDA4IiwidGFnIjoiIn0%3D",
                "x-xsrf-token": "eyJpdiI6InJCeDZMdzJZYThkc1lCUlozM0lWOFE9PSIsInZhbHVlIjoicFBBckhKWms0OEhRMmN5OUZZemhjQm5kTlRjVnY4S1lvRWI3ZUF2V1RQU0FlTDV6cEg5L1I5ZjNPWncyenNocXhBRHNzaStVSmxyZW9UY21uMzd2dGpxWEg5SEU4a0p5cE9DNTZJMVFFWWxvQlk1WkN0ZktKcmMxbUpNUVdOWXciLCJtYWMiOiI4OTZjZTMwZDdlZTIwZGFhNDkxNDRmZTBmNzgxODUxZmU1NzIyNTJhNDI1MjdjNDIwOTdhNjBhZTk3MmEwM2MyIiwidGFnIjoiIn0="
            }
        }).then(({ data }) => {
            if(data?.data?.items) {
                let result = data.data.items.map(item => {
                    if(item.urls) {
                        return item.urls[0]?.url
                    }
                })

                return { success: true, data: result.length > 1 ? result : result[0] }
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