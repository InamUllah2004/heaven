const crypto = require('crypto');

function getTimestamp(time) {
	const arr = time.split(":");
	return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
}

const defaultHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Cookie": "ASP.NET_SessionId=4swouj1mkd2nburls12t5ryx; preferences=showDaytimeFlares=True; userInfo=lat=39.9042&lng=116.4074&alt=52&tz=ChST&loc=%e5%8c%97%e4%ba%ac%e5%b8%82"
};

function post_options(target, opt) {
    const url = `https://www.heavens-above.com/${target}lat=39.9042&lng=116.4074&loc=%E5%8C%97%E4%BA%AC%E5%B8%82&alt=52&tz=ChST`;
    return {
        method: "post",
        url,
        data: opt,
        headers: {
            ...defaultHeaders,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
}

function get_options(target) {
    const url = `https://www.heavens-above.com/${target}lat=39.9042&lng=116.4074&loc=%E5%8C%97%E4%BA%AC%E5%B8%82&alt=52&tz=ChST`;
    return {
        method: "get",
        url,
        headers: defaultHeaders
    };
}

function image_options(target) {
    return {
        method: "get",
        url: target,
        responseType: "arraybuffer",
        headers: {
            ...defaultHeaders,
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
        }
    };
}

function iridium_options(target) {
    return {
        method: "get",
        url: target,
        headers: defaultHeaders
    };
}

function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

module.exports = {
	getTimestamp,
	post_options,
	get_options,
	image_options,
	iridium_options,
	md5
};
