// pages/api/create-checkout-session.js

import { getSession } from 'next-auth/client';
import { stripe } from '../../utils/stripe'; // Import stripe instance
import { getUserCart } from '../../utils/cart'; // Import function to get user's cart items

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await createCheckoutSession(req);
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Error creating checkout session' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

async function createCheckoutSession(req) {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    throw new Error('User email not found');
  }

  const userEmail = session.user.email;

  // Get user's cart items
  const cartItems = await getUserCart(userEmail);

  // Construct line items array for the checkout session
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.productName,
        description: item.productDescription,
        images: [item.productImage],
      },
      unit_amount: item.price * 100, // Stripe expects price in cents
    },
    quantity: 1,
  }));

  // Create the checkout session with Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/success`, // Redirect URL after successful payment
    cancel_url: `${process.env.NEXTAUTH_URL}/cancel`, // Redirect URL if user cancels payment
  });

  return session;
}
