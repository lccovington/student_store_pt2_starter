const db = require("../db")

class Store {

    static async listProducts() {
        const result = await db.query(`
        SELECT * FROM products
        `)
        const products = result.rows
        return products
    }
}

module.exports = Store