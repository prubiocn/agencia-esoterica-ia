import { buffer } from 'micro';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Desactiva el body parser por defecto de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Maneja diferentes tipos de eventos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Pago completado:', session.id);
      // Aquí podrías guardar en base de datos que el usuario pagó
      // Por ahora solo logueamos
      break;

    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('✅ Suscripción creada:', subscription.id);
      break;

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object;
      console.log('⚠️ Suscripción cancelada:', deletedSub.id);
      // Aquí podrías desactivar el acceso del usuario
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('❌ Pago fallido:', failedInvoice.id);
      // Notificar al usuario que su pago falló
      break;

    case 'invoice.payment_succeeded':
      const successInvoice = event.data.object;
      console.log('✅ Renovación exitosa:', successInvoice.id);
      break;

    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
