const db = require("../db")

class Order {

    static async listOrdersForUser(user) {
        
        const result = await db.query(`
        SELECT o.id AS "orderId",
            o.customer_id AS "customerId",
            od.quantity AS "quantity",
            p.name AS "name",
            p.price AS "price" FROM orders AS o
        INNER JOIN order_details AS od ON o.id = od.order_id
        INNER JOIN products as p ON p.id = od.product_id
        WHERE o.customer_id = (SELECT id FROM users WHERE email = $1)
    `, [user.email])

    }

    static async createOrder({ order, user }) {
        const user_id = await db.query(`SELECT id FROM users WHERE email = $1`, [user.email])
        const query = `INSERT INTO orders (
            customer_id
        )
        VALUES ($1)
        RETURNING id;
    `
    const orderId = await db.query(query, [user_id]);
    order.forEach((product) => {
        const query = `INSERT INTO order_details (
            order_id,
            product_id,
            quantity,
            discount
        )
        VALUES ($1, $2, $3, $4)
        RETURNING order_id;
        `;
        db.query(query, [orderId, product.id, product.quantity, product.discount])
    })
    }
}

module.exports = Order