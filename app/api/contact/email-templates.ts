export type ContactPayload = {
    name: string;
    phone: string;
    email: string;
    message: string;
  };
  
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  
  const wrapper = (bodyHtml: string) => `
  <!DOCTYPE html>
  <html lang="en">
    <body style="margin:0;padding:0;background-color:#f5f5f4;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
              <tr>
                <td style="background-color:#115e59;padding:28px 32px;">
                  <span style="color:#5eead4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Your Trading Co</span>
                  <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:600;">Let's talk color</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  ${bodyHtml}
                </td>
              </tr>
              <tr>
                <td style="padding:20px 32px;background-color:#fafaf9;border-top:1px solid #e7e5e4;">
                  <p style="margin:0;color:#78716c;font-size:12px;">
                    Shop hours: Mon&ndash;Sat, 9am&ndash;6pm &middot; We usually respond within one business day.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
  
  export function customerEmailHtml(data: ContactPayload) {
    const name = escapeHtml(data.name);
    const message = escapeHtml(data.message).replace(/\n/g, "<br/>");
  
    return wrapper(`
      <h2 style="margin:0 0 12px;color:#1c1917;font-size:18px;">Hi ${name}, thanks for reaching out!</h2>
      <p style="margin:0 0 20px;color:#44403c;font-size:14px;line-height:1.6;">
        We've received your message and someone from the shop will get back to you shortly.
        Here's a copy of what you sent us:
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;border-radius:12px;padding:16px;margin-bottom:20px;">
        <tr>
          <td style="padding:4px 0;color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;">Your message</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#292524;font-size:14px;line-height:1.6;">${message}</td>
        </tr>
      </table>
      <p style="margin:0;color:#44403c;font-size:14px;line-height:1.6;">
        If anything changes or you'd like to add details, just reply to this email.
      </p>
    `);
  }
  
  export function ownerEmailHtml(data: ContactPayload) {
    const name = escapeHtml(data.name);
    const phone = escapeHtml(data.phone);
    const email = escapeHtml(data.email);
    const message = escapeHtml(data.message).replace(/\n/g, "<br/>");
  
    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:8px 0;color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;width:110px;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;color:#1c1917;font-size:14px;line-height:1.5;">${value}</td>
      </tr>
    `;
  
    return wrapper(`
      <h2 style="margin:0 0 16px;color:#1c1917;font-size:18px;">New contact form submission</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
        ${row("Name", name)}
        ${row("Phone", `<a href="tel:${phone}" style="color:#0f766e;text-decoration:none;">${phone}</a>`)}
        ${row("Email", `<a href="mailto:${email}" style="color:#0f766e;text-decoration:none;">${email}</a>`)}
        ${row("Message", message)}
      </table>
      <p style="margin:0;color:#78716c;font-size:12px;">
        Reply-to on this email is already set to the customer's address, so you can hit reply directly.
      </p>
    `);
  }