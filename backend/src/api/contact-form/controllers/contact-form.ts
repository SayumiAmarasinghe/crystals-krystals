/**
 * contact-form controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-form.contact-form');

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// module.exports = {
//   async create(ctx) {
//     const { name, email, message } = ctx.request.body;

//     // Save to Strapi
//     const entry = await strapi.db.query('api::contact-form.contact-form').create({
//       data: { name, email, message, submittedAt: new Date() },
//     });

//     // Send email to YOU
//     await sgMail.send({
//       to: SENDGRID_DEFAULT_FROM
//       from: 'no-reply@yourdomain.com',
//       subject: `New Contact Form Submission from ${name}`,
//       text: `Email: ${email}\nMessage:\n${message}`,
//     });

//     return { success: true, entry };
//   },
// };