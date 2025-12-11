// api/create-checkout-session.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// 初始化 Stripe (记得换成你的 Secret Key)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover', 
});

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { cartItems } = req.body;

      const line_items = cartItems.map((item: any) => ({
        price_data: {
          currency: 'sgd', // ⚠️ 必须是 sgd，不能是 usd
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), 
        },
        quantity: item.quantity,
      }));

      // Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['paynow'], 
        line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/`,
      });

      // 把 Session URL 返回给前端
      res.status(200).json({ url: session.url });
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}