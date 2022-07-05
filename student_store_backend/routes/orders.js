const Order = require("../models/order")
const router = express.Router()

router.get("/", async(req, res, next) => {
    try {
        // should call the listOrdersForUser method
        
    } catch (error) {
        next(error)
    }
})

router.post("/", async(req, res, next) => {
    try {
        //  should call the createOrder method.
        
    } catch (error) {
        next(error)
    }
})

module.exports = router