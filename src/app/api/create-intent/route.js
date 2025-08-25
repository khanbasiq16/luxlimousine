import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {
  try {
    const data = await request.json();
    const { amount } = data;

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20", 
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), 
      currency: "aud",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      status: 200,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json(
      { error: "Failed to create PaymentIntent" },
      { status: 500 }
    );
  }
}
