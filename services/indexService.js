// services/indexService.js
module.exports = {

    index: (req, res, next) => {
        const title = 'Socket Project';
        res.render('index', { title: title });
    }

};