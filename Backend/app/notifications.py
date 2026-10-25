import os
from pathlib import Path
from email.message import EmailMessage
from typing import List
from jinja2 import Template
from dotenv import load_dotenv

# Explicitly target D:\Programming\Nauvaaya\Backend\.env
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()  # Fallback to CWD

# Configurations
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
EMAIL_FROM = os.getenv("EMAIL_FROM", f"Nauvaaya <{SMTP_USER}>")

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886").strip()

# Startup confirmation
print(f"[NOTIFICATION] [NOTIFICATION ENGINE] SMTP loaded for: '{SMTP_USER}' from {ENV_PATH}")

EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #2C2420; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #E0D5C7; border-radius: 4px; overflow: hidden; }
    .header { background: #2C2420; color: #ffffff; padding: 30px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.15em; text-transform: uppercase; }
    .content { padding: 24px; }
    .order-box { background: #FAF7F2; border: 1px dashed #D5C7BB; padding: 12px 16px; margin: 16px 0; border-radius: 4px; }
    .item-row { display: flex; justify-content: space-between; border-bottom: 1px solid #F0EAE1; padding: 10px 0; font-size: 14px; }
    .total-row { display: flex; justify-content: space-between; padding: 14px 0 0; font-weight: bold; font-size: 16px; color: #965438; }
    .footer { text-align: center; font-size: 11px; color: #7F7771; padding: 20px; border-top: 1px solid #E0D5C7; background: #FAF7F2; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>NAUVAAYA</h1>
      <p style="margin: 6px 0 0; font-size: 12px; letter-spacing: 0.1em; color: #D5C7BB;">ORDER CONFIRMATION</p>
    </div>
    <div class="content">
      <p>Dear <strong>{{ order.customer_name }}</strong>,</p>
      <p style="font-size: 13px; line-height: 1.6; color: #554D47;">
        Thank you for your order. We are carefully preparing your artisanal pieces. Here is your receipt:
      </p>

      <div class="order-box">
        <span style="font-size: 11px; text-transform: uppercase; color: #7F7771; letter-spacing: 0.05em;">Order Reference</span><br/>
        <strong style="font-family: monospace; font-size: 14px;">{{ order.id }}</strong>
      </div>

      <div style="margin: 20px 0; text-align: center;">
        <a href="http://localhost:5173/orders/{{ order.id }}?email={{ order.email }}&phone={{ order.phone }}"
            style="background-color: #965438; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; display: inline-block; border-radius: 2px;">
            Track Order Status
        </a>
      </div>

      <div style="margin-top: 20px;">
        {% for item in order.items %}
        <div class="item-row">
          <div>
            <strong>{{ item.product_name }}</strong> (Size: {{ item.size }}) × {{ item.quantity }}
          </div>
          <div>₹{{ "%.2f"|format(item.unit_price * item.quantity) }}</div>
        </div>
        {% endfor %}
        <div class="total-row">
          <span>Total Amount</span>
          <span>₹{{ "%.2f"|format(order.total_amount) }}</span>
        </div>
      </div>

      <div style="margin-top: 24px; font-size: 13px; line-height: 1.5; background: #FAF7F2; padding: 12px 16px; border-radius: 4px;">
        <strong>Shipping Destination:</strong><br/>
        {{ order.shipping_address }}, {{ order.city }}, {{ order.state }} - {{ order.pincode }}<br/>
        Contact: {{ order.phone }}
      </div>
    </div>
    <div class="footer">
      Crafted with nature-inspired intention.<br/>
      Need help? Reply directly to this email.
    </div>
  </div>
</body>
</html>
"""

async def send_order_email(order):
    """Sends asynchronous branded confirmation email to the guest buyer."""
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"\n[DEV NOTIFICATION] SMTP credentials missing in .env.")
        print(f"Would have sent confirmation email to: {order.email}")
        return

    try:
        msg = EmailMessage()
        msg["Subject"] = f"Your Nauvaaya Order Confirmation [#{str(order.id)[:8].upper()}]"
        msg["From"] = EMAIL_FROM
        msg["To"] = order.email

        template = Template(EMAIL_TEMPLATE)
        html_content = template.render(order=order)
        msg.set_content(f"Thank you for your order {order.id}. Total: ₹{order.total_amount}")
        msg.add_alternative(html_content, subtype="html")

        import aiosmtplib
        await aiosmtplib.send(
            msg,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            start_tls=(SMTP_PORT == 587),
            use_tls=(SMTP_PORT == 465),
            username=SMTP_USER,
            password=SMTP_PASSWORD,
        )
        print(f"✅ Order confirmation email successfully sent to {order.email}")
    except Exception as e:
        print(f"⚠️ Failed to send order email: {e}")

async def send_whatsapp_order_msg(order):
    """Sends WhatsApp or SMS notification via Twilio (with console fallback)."""
    phone = str(order.phone).strip().replace(" ", "").replace("-", "")
    if not phone.startswith("+"):
        phone = f"+91{phone}"

    message_body = (
        f"🌿 *Nauvaaya Order Confirmed!*\n\n"
        f"Hello {order.customer_name},\n"
        f"Your order *#{str(order.id)[:8].upper()}* of *₹{order.total_amount:,.2f}* has been received and is being prepared.\n\n"
        f"📍 *Delivering to:* {order.city}, {order.pincode}\n\n"
        f"Thank you for supporting mindful craft!"
    )

    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print("\n================== WHATSAPP / SMS LOG (DEV) ==================")
        print(f"Recipient: {phone}")
        print(message_body)
        print("==============================================================\n")
        return

    try:
        from twilio.rest import Client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            to=f"whatsapp:{phone}",
            body=message_body
        )
        print(f"✅ WhatsApp confirmation sent to {phone}")
    except Exception as e:
        print(f"⚠️ Failed to send WhatsApp/SMS via Twilio: {e}")