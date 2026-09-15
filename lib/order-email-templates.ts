// lib/order-email-templates.ts
// HTML templates for order emails, styled to match the storefront (checkout/page.tsx).

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderDetails {
  orderId: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  grandTotal: number;
  paymentMethod: "cash" | "stripe";
  currencySymbol?: string;
}

const BRAND = {
  blue: "#2563AC",
  blueDark: "#1F5488",
  ink: "#1C1B1A",
  muted: "#6B655C",
  border: "#E4DFD6",
  bg: "#FAF8F5",
  green: "#1F8A56",
};

function money(amount: number, symbol: string) {
  return `${symbol}${amount.toLocaleString()}`;
}

function itemRows(items: OrderItem[], symbol: string) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.ink};font-size:14px;">
          ${item.name}<br/>
          <span style="color:${BRAND.muted};font-size:12px;">${money(
        item.unitPrice,
        symbol
      )} × ${item.quantity}</span>
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.ink};font-size:14px;font-weight:600;">
          ${money(item.total, symbol)}
        </td>
      </tr>`
    )
    .join("");
}

function baseLayout(opts: { title: string; preheader: string; body: string }) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${opts.title}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;">${opts.preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BRAND.border};">
            <tr>
              <td style="background:linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueDark});padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:bold;">Your Trading Co</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${opts.body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${BRAND.border};">
                <p style="margin:0;color:${BRAND.muted};font-size:12px;">
                  This is an automated message from Your Trading Co. Please do not reply directly to this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function summaryTable(order: OrderDetails, symbol: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      ${itemRows(order.items, symbol)}
      <tr>
        <td style="padding:10px 0;color:${BRAND.muted};font-size:13px;">Subtotal</td>
        <td align="right" style="padding:10px 0;color:${BRAND.ink};font-size:13px;">${money(
    order.subtotal,
    symbol
  )}</td>
      </tr>
      <tr>
        <td style="padding:0 0 10px;color:${BRAND.muted};font-size:13px;">Shipping</td>
        <td align="right" style="padding:0 0 10px;color:${BRAND.ink};font-size:13px;">${
    order.shipping === 0 ? "Free" : money(order.shipping, symbol)
  }</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;border-top:1px solid ${BRAND.border};color:${BRAND.ink};font-size:16px;font-weight:bold;">Total</td>
        <td align="right" style="padding:12px 0 0;border-top:1px solid ${BRAND.border};color:${BRAND.ink};font-size:16px;font-weight:bold;">${money(
    order.grandTotal,
    symbol
  )}</td>
      </tr>
    </table>`;
}

export function customerOrderConfirmationHtml(order: OrderDetails) {
  const symbol = order.currencySymbol || "₹";
  const paymentLine =
    order.paymentMethod === "cash"
      ? "You'll pay in cash when your order is delivered."
      : "Your payment was received via card/UPI.";

  const body = `
    <h1 style="margin:0 0 4px;color:${BRAND.ink};font-size:20px;">Thanks, ${order.customer.name}!</h1>
    <p style="margin:0 0 20px;color:${BRAND.muted};font-size:14px;">
      Your order <strong style="color:${BRAND.ink};">#${order.orderId}</strong> has been confirmed. ${paymentLine}
    </p>

    <h2 style="margin:0 0 8px;color:${BRAND.ink};font-size:15px;">Order summary</h2>
    ${summaryTable(order, symbol)}

    <h2 style="margin:24px 0 8px;color:${BRAND.ink};font-size:15px;">Delivery address</h2>
    <p style="margin:0;color:${BRAND.ink};font-size:14px;line-height:1.6;">
      ${order.customer.address}<br/>
      ${order.customer.city}, ${order.customer.state} ${order.customer.pincode}<br/>
      ${order.customer.phone}
    </p>
  `;

  return baseLayout({
    title: `Order Confirmed — ${order.orderId}`,
    preheader: `Your order #${order.orderId} is confirmed.`,
    body,
  });
}

export function adminOrderNotificationHtml(order: OrderDetails) {
  const symbol = order.currencySymbol || "₹";

  const body = `
    <h1 style="margin:0 0 4px;color:${BRAND.ink};font-size:20px;">New ${
    order.paymentMethod === "cash" ? "Cash on Delivery" : "Stripe"
  } order</h1>
    <p style="margin:0 0 20px;color:${BRAND.muted};font-size:14px;">
      Order <strong style="color:${BRAND.ink};">#${order.orderId}</strong> just came in.
    </p>

    <h2 style="margin:0 0 8px;color:${BRAND.ink};font-size:15px;">Customer</h2>
    <p style="margin:0 0 20px;color:${BRAND.ink};font-size:14px;line-height:1.6;">
      ${order.customer.name}<br/>
      ${order.customer.email}<br/>
      ${order.customer.phone}<br/>
      ${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.pincode}
    </p>

    <h2 style="margin:0 0 8px;color:${BRAND.ink};font-size:15px;">Order summary</h2>
    ${summaryTable(order, symbol)}
  `;

  return baseLayout({
    title: `New Order — ${order.orderId}`,
    preheader: `New order from ${order.customer.name}.`,
    body,
  });
}