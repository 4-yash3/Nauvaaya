import asyncio
import os
import re
import time
from pathlib import Path
from fastapi import HTTPException, UploadFile
from supabase import Client, create_client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://vujpzldubtgaikeawidk.supabase.co")
SUPABASE_SERVICE_ROLE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_KEY")
    or ""
)

_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    """Retrieve or initialize the Supabase client using service role credentials."""
    global _supabase_client
    if _supabase_client is None:
        url = os.getenv("SUPABASE_URL", SUPABASE_URL)
        key = (
            os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            or os.getenv("SUPABASE_KEY")
            or SUPABASE_SERVICE_ROLE_KEY
        )
        if not key:
            raise HTTPException(
                status_code=500,
                detail="Supabase Storage error: SUPABASE_SERVICE_ROLE_KEY is not configured in backend environment."
            )
        _supabase_client = create_client(url, key)
    return _supabase_client


async def upload_file_to_supabase(file: UploadFile, folder: str = "products") -> str:
    """
    Upload an UploadFile to the Supabase Storage bucket 'Products' under {folder}/{timestamp}_{filename}.
    Returns the permanent public URL.
    """
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        raw_name = Path(file.filename or "upload").name
        clean_filename = re.sub(r"[^a-zA-Z0-9_.-]", "_", raw_name)
        timestamp = int(time.time())
        destination_path = f"{folder}/{timestamp}_{clean_filename}"

        content_type = file.content_type or "application/octet-stream"

        def _sync_upload() -> str:
            client = get_supabase_client()
            bucket = client.storage.from_("Products")
            bucket.upload(
                path=destination_path,
                file=file_bytes,
                file_options={"content-type": content_type, "upsert": "true"}
            )
            return bucket.get_public_url(destination_path)

        public_url = await asyncio.to_thread(_sync_upload)
        return public_url
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file to Supabase Storage: {str(e)}"
        )


async def upload_bytes_to_supabase(
    file_bytes: bytes,
    filename: str,
    content_type: str = "application/octet-stream",
    folder: str = "products"
) -> str:
    """
    Upload raw file bytes directly to the Supabase Storage bucket 'Products'.
    Returns the permanent public URL.
    """
    try:
        if not file_bytes:
            raise HTTPException(status_code=400, detail="File data is empty.")

        raw_name = Path(filename or "upload").name
        clean_filename = re.sub(r"[^a-zA-Z0-9_.-]", "_", raw_name)
        timestamp = int(time.time())
        destination_path = f"{folder}/{timestamp}_{clean_filename}"

        def _sync_upload() -> str:
            client = get_supabase_client()
            bucket = client.storage.from_("Products")
            bucket.upload(
                path=destination_path,
                file=file_bytes,
                file_options={"content-type": content_type, "upsert": "true"}
            )
            return bucket.get_public_url(destination_path)

        public_url = await asyncio.to_thread(_sync_upload)
        return public_url
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload bytes to Supabase Storage: {str(e)}"
        )

def delete_file_from_supabase(image_url: str):
    """Extract relative path and remove file from Supabase 'Products' storage bucket."""
    if not image_url:
        return
    try:
        # Example URL: https://<project>.supabase.co/storage/v1/object/public/Products/products/123_shirt.png
        # The storage client expects the path inside the bucket: 'products/123_shirt.png'
        if "/public/Products/" in image_url:
            file_path = image_url.split("/public/Products/")[-1]
            supabase.storage.from_("Products").remove([file_path])
    except Exception as e:
        print(f"Warning: Failed to delete image from Supabase storage ({image_url}): {e}")

