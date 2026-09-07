from __future__ import annotations

import io
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from markitdown import MarkItDown

BASE_DIR = Path(__file__).resolve().parent
MAX_FILE_SIZE = 50 * 1024 * 1024

app = FastAPI(title="Drop to Markdown")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(BASE_DIR / "static" / "index.html")


@app.post("/api/convert")
async def convert(file: UploadFile = File(...)) -> dict[str, str]:
    """Convert the uploaded bytes only; do not let MarkItDown fetch external URLs."""
    data = await file.read(MAX_FILE_SIZE + 1)
    if not data:
        raise HTTPException(400, "빈 파일은 변환할 수 없어요.")
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(413, "파일은 최대 50MB까지 올릴 수 있어요.")

    filename = file.filename or "uploaded-file"
    try:
        result = MarkItDown(enable_plugins=False).convert_stream(
            io.BytesIO(data), file_extension=Path(filename).suffix
        )
        return {"markdown": result.markdown, "filename": filename}
    except Exception as exc:
        raise HTTPException(
            422, "이 파일은 아직 변환하지 못했어요. 다른 형식이거나 필요한 변환기가 없을 수 있어요."
        ) from exc
