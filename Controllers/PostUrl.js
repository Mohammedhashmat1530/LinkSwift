const { URL } = require('../DB/db');
const simpleId = require("simple-id");


async function handlePostUrl(longUrl, CustomUrl, password, startdate, enddate) {


    try {
        const shortUrl = CustomUrl || simpleId(); // Use CustomUrl if provided, else generate one
        await URL.create({
            longUrl,
            shortUrl,
            CustomUrl,
            password,
            startdate,
            enddate
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

module.exports = {
    handlePostUrl,
    handleLinks
};
