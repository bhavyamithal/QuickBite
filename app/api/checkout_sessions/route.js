const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get user's cart items
      const userEmail = 'user@example.com'; // Replace with the actual user's email
      const cartItems = await GetUserCart(userEmail);

      // Construct line items array
      const lineItems = cartItems.userCarts.map(item => ({
        price_data: {
          currency: 'inr',
          unit_amount: item.price, // Assuming price is in paisa
          product_data: {
            name: item.productName,
            description: item.productDescription,
            images: [item.productImage],
          },
        },
        quantity: 1,
      }));

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });

      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
