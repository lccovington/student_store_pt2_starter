const db = require("../db")

class Order {

    static async listOrdersForUser(user) {
        
        const result = await db.query(`
        SELECT o.id AS "orderId",
            o.customer_id AS "customerId",
            d.quantity AS "quantity",
            p.name AS "name",
            p.price AS "price" FROM orders AS o
        INNER JOIN order_details AS d ON o.id = d.order_id
        INNER JOIN products as p ON p.id = d.product_id
        WHERE o.customer_id = (SELECT id FROM users WHERE email = $1)
    `, [ user.email ])

    return result.rows

    }

    static async createOrder({ order, user }) {
        const results = await db.query(`INSERT INTO orders (
            customer_id
        )
        VALUES ((SELECT id FROM users WHERE email = $1))
        RETURNING id
        `, [user.email])

        const orderId = results.rows[0]

        Object.keys(order).forEach((productId) => {db.query(`INSERT INTO order_details (
            order_id,
            product_id,
            quantity
        )
        VALUES ($1, $2, $3)
        `, [orderId.id, productId, order[productId]])})

        return orderId.id
    }
}

module.exports = Order