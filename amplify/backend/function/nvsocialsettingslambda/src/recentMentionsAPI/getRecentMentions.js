


function createData(id, date, source, text, language, score) {
    return { id, date, source, text, language, score };
}

const rows = [
    createData(0, '16 Mar, 2019', 'Twitter', 'Wah #ninjavan you not paiseh i also feel paiseh for you pls Woman #facepalming Mega champz', 'en', -20),
    createData(1, '16 Mar, 2019', 'Twitter', 'Never before, we shipped out all pre-order postage like this. TY', 'en', 10),
    createData(2, '16 Mar, 2019', 'Facebook', 'Just gotten 2 boxes of kids masks, will call for #Ninjavan to dispatch them to a volunteer group for distribution. Kids are uncomfortable wearing masks, the sizes are not right, hard to buy too. Hope these masks can help them thru #COVID19.', 'en', 30),
    createData(3, '16 Mar, 2019', 'Facebook', 'A happier #Raya indeed! All #parcels processed and shipped out via #NinjaVan. \n' +
        '\n' +
        'Need to send gifts back to family and friends before Hari Raya? Drop your parcel before the 8th of May and it will get there just in time!\n' +
        '\n' +
        '#PostHub, your friendly neighbourhood courier guys. Grinning face', 'en', 60),
    createData(4, '15 Mar, 2019', 'Twitter', 'My #ninjavanph story! So I have been waiting for these guys since friday. I waited from 9am-5pm and no one came. Then when I tracked the package this photo came up. Now, why would I reschedule when I was at the address waiting for them the whole time for 2 days!', 'en', -20),
];

const getRecentMentions = () => {

    return rows
}

module.exports = getRecentMentions