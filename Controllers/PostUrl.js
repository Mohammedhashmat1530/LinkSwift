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
        const shortUrl = CustomUrl || simpleId()
       
        if (qrcode) {
            svg = await generateQRCode(longUrl);
        }
        
        if (!startdate) {
            startdate = new Date();
        }
        if (!enddate) {
            enddate = new Date('9999-12-31');
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
    if (response) {
       
        if (response.password && currentDate >= response.startdate && currentDate <= response.enddate) {
            // If password matches
            if (password === response.password) {
                response.Clicks++;
                await response.save();
                return response;
            } else {
                // If password doesn't match
                return null;
            }
        } else if (currentDate >= response.startdate && currentDate <= response.enddate) {
            // If password is not required or not provided, but the link is still valid
            response.Clicks++;
            await response.save();
            return response;
        } else {
            // If link is expired
            return null;
        }
    } else {
        // If link is not found
        return null;
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
