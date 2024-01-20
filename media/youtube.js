let y2mate;

async function tst() {
    y2mate = new (await import('y2mate-api')).Y2MateClient()
}

tst()

class Youtube {
    async get(url) {
        return new Promise(async (resolve, reject) => {
			const result = await y2mate.getFromURL(url, 'vi');
			if (result.page == 'detail') {
				url = await result.linksVideo.get('auto').fetch();
			} else if (result.page == 'playlist') {
				let video = await result.videos[0].fetch();
				url = await video.linksVideo.get('auto').fetch();
			}
			url = url.downloadLink;

            if(url) {
                resolve({
                    success: true,
                    data: url
                })
            } else {
                reject("Can't find this video")
            }
        })
    }
}

module.exports = Youtube