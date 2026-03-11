import httpx
from app.core.config import settings

async def initiate_mpesa_payment(phone_number: str, amount: float, account_reference: str, transaction_desc: str):
    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    headers = {
        "Authorization": f"Bearer {await get_mpesa_access_token()}",
        "Content-Type": "application/json"
    }
    payload = {
        "BusinessShortCode": settings.M_PESA_SHORTCODE,
        "Password": generate_password(),
        "Timestamp": get_timestamp(),
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": settings.M_PESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": "https://your-callback-url.com/callback",
        "AccountReference": account_reference,
        "TransactionDesc": transaction_desc
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        return response.json()

async def get_mpesa_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    auth = (settings.M_PESA_CONSUMER_KEY, settings.M_PESA_CONSUMER_SECRET)
    async with httpx.AsyncClient() as client:
        response = await client.get(url, auth=auth)
        return response.json()["access_token"]

def generate_password():
    import base64
    from datetime import datetime
    timestamp = get_timestamp()
    password_str = f"{settings.M_PESA_SHORTCODE}{settings.M_PESA_PASSKEY}{timestamp}"
    return base64.b64encode(password_str.encode()).decode()

def get_timestamp():
    from datetime import datetime
    return datetime.now().strftime("%Y%m%d%H%M%S")