
module.exports = (req, res, next)=>{
    res.user ? next() : res.sendStatus(401);
}

