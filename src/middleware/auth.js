const adminAuth = (req, res, next) => {
    console.log("admin check auth");
    const token = "xyz";
    const isAuthrizted = token === "xyz";
    if(!isAuthrizted){
        res.status(401).send("admin is not authorized !!")
    } else {
        next();
    }
}

module.exports = {
    adminAuth
}