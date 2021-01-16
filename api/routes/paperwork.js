const express = require('express');
const router = express.Router();


router.get('/aboutUs', (req, res, next) => {
    res.render('paperwork/aboutUs');
});
router.get('/pricing', (req, res, next) => {
    res.render('paperwork/pricing');
});
router.get('/privacy', (req, res, next) => {
    res.render('paperwork/privacy');
});
router.get('/refundsAndCancellations', (req, res, next) => {
    res.render('paperwork/refundsAndCancellations');
});
router.get('/termsAndConditions', (req, res, next) => {
    res.render('paperwork/termsAndConditions');
});


module.exports = router;


