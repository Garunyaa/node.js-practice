import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
const stripe = Stripe(process.env.STRIPE_KEY);
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.post("/create-token", async (req, res) => {
  try {
    const testCardToken = 'tok_visa';
    stripe.tokens.retrieve(testCardToken, (error, token) => {
      if (error) {
        console.log('error:', error.message);
      }
      if (token) {
        console.log('token:', token);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/create-paymethod", async (req, res) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: "tok_1OI7dtSD010bwSLtpLytEOFh"
      }
    });
    const customerId = "cus_P6Jw76xFNAD7c3";
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId
    });
    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/make-payment", async (req, res) => {
  try {
    const customerId = "cus_P6Jw76xFNAD7c3";
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
      payment_method: "pm_1OI7frSD010bwSLtCaA8F7JI",
      confirm: true,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      },
      return_url: "https://localhost:3000/success"
    });
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/charge", async (req, res) => {
  try {
    const customerEmail = "sri@gmail.com";
    const customerName = "Sri";
    const billingAddress = {
      line1: "12 Main street",
      line2: "Apt 4B",
      city: "NewYork",
      state: "NY",
      postal_code: "10001",
      country: "US"
    };
    const customerId = "cus_P6LbLHzYR9ut1o";
    let paymentIntent = await stripe.paymentIntents.create({
      payment_method: "pm_1OI99kSD010bwSLtIfGKoEIT",
      amount: 75 * 100,
      currency: "inr",
      confirm: true,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      },
      return_url: "https://localhost:3000/success",
      receipt_email: customerEmail
    });
    res.send(paymentIntent);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/add-card", async (req, res) => {
  try {
    const customerId = "cus_P6Jw76xFNAD7c3";
    const cardToken = await stripe.tokens.create({
      card: {
        number: "5555555555554444",
        exp_month: 12,
        exp_year: 2025,
        cvc: 111
      }
    });
    const card = await stripe.customers.createSource(customerId, {
      source: cardToken.id
    });
    res.json(card);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/create-product", async (req, res) => {
  try {
    const productInfo = {
      name: "T-shirts",
      description: "Cotton T-shirts",
      active: "true",
      attributes: ["black", "S"],
      metadata: {
        category: "Clothing",
        manufacturer: "DNMX"
      }
    };
    const product = await stripe.products.create(productInfo);
    res.json({
      message: "Product created",
      product
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/create-price", async (req, res) => {
  try {
    const price = await stripe.prices.create({
      product: "prod_P6bjiv88Kw2hlK",
      unit_amount: 10000,
      currency: "usd"
    });
    res.json({
      message: "price created",
      price
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/update-product", async (req, res) => {
  try {
    const productId = "prod_P6bjiv88Kw2hlK";
    const updatedProductInfo = {
      images: ["https://images.samsung.com/is/image/samsung/assets/in/explore/brand/5-best-android-mobile-phones-2022-in-india/banner-mobile-720x761-080422.jpg?$720_N_JPG$"],
      name: "Latest mobile collection"
    };
    const product = await stripe.products.update(productId, updatedProductInfo);
    res.json({
      message: "Product updated",
      product
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.get("/success", async (req, res) => {
  const session_id = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === paid) {
      res.send("Payment successful");
    } else {
      res.send("Payment unsuccessful");
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.get("/cancel", async (req, res) => {
  res.send("Payment cancelled");
});
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: "product name"
          },
          unit_amount: 1000
        },
        quantity: 1
      }],
      mode: "payment",
      success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cancel"
    });
    res.json({
      url: session.url
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=server.js.map