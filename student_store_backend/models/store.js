const db = require("../db")

class Store {

    static async listProducts() {
        const result = await db.query(`
        SELECT * FROM products
        `
        )
    }
}

module.exports = Store