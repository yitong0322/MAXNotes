// api/create-checkout-session.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// 初始化 Stripe (记得换成你的 Secret Key)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // 使用最新版本
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { cartItems } = req.body; // 从前端传来的购物车数据

      // 把购物车转换成 Stripe 需要的格式 (Line Items)
      const line_items = cartItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image], // 如果有图片链接
          },
          unit_amount: Math.round(item.price * 100), // Stripe 金额单位是“分”，所以要乘以100
        },
        quantity: item.quantity,
      }));

      // 创建 Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
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