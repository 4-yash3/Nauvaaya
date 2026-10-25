import hashlib
import hmac
import os
import time
from fastapi import Header, HTTPException, status

ADMIN_USERS_RAW = os.getenv("ADMIN_USERS", "")
ADMIN_JWT_SECRET = os.getenv("ADMIN_JWT_SECRET", "")


def get_approved_admins():
    """Parses approved admin email:password pairs from .env"""
    admin_users = os.getenv("ADMIN_USERS", ADMIN_USERS_RAW)
    admins = {}
    for entry in admin_users.split(","):
        if ":" in entry:
            email, pwd = entry.strip().split(":", 1)
            admins[email.lower()] = pwd
    return admins


async def verify_admin_token(x_admin_token: str = Header(..., description="Staff Authorization Token")):
    """Dependency protecting all admin routes via signed HMAC token."""
    try:
        parts = x_admin_token.split("|")
        if len(parts) != 3:
            raise ValueError()

        email, timestamp, signature = parts
        jwt_secret = os.getenv("ADMIN_JWT_SECRET", ADMIN_JWT_SECRET)
        expected_sig = hmac.new(
            jwt_secret.encode(),
            f"{email}|{timestamp}".encode(),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(signature, expected_sig):
            raise ValueError()

        # Token valid for 24 hours (86400 seconds)
        if time.time() - int(timestamp) > 86400:
            raise HTTPException(status_code=401, detail="Session expired. Please log in again.")

        return email
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Invalid or expired admin credentials."
        )

