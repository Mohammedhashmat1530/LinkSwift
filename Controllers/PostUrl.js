const { URL } = require('../DB/db');
const simpleId = require("simple-id");
const qr = require('qrcode');


async function generateQRCode(longUrl) {
    return new Promise((resolve, reject) => {
        qr.toString(longUrl, { type: 'svg' }, (err, svgString) => {
            if (err) reject(err);
            else resolve(svgString);
        });
    });
}


async function handlePostUrl(longUrl, CustomUrl, password, startdate, enddate,qrcode) {

    let svg = "no qr generated";
    try {
        const shortUrl = CustomUrl || simpleId();
        if (qrcode) {
            svg = await generateQRCode(longUrl);
        }


        await URL.create({
            longUrl,
            shortUrl,
            CustomUrl,
            password,
            startdate,
            enddate,
            qrcode:svg
        });
    } catch (error) {
        console.error('Error saving URL:', error);
    }
}


async function handleLinks(link, password) {
    const currentDate = new Date();
    const response = await URL.findOne({
        shortUrl: link
    })
    if ((response.password) && (currentDate >= response.startdate && currentDate <= response.enddate)) {
        if (password === response.password) {

            response.Clicks++;
            response.save()
            return response;
        }

    }

    if (currentDate >= response.startdate && currentDate <= response.enddate) {
        response.Clicks++;
        response.save()
        return response;
    }



}


async function fetchData(){
    const response = await URL.find();

    return response;
}

module.exports = {
    handlePostUrl,
    handleLinks,
    fetchData
};
