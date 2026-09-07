# Drop to Markdown

MarkItDown 기반의 로컬 파일 → Markdown 웹앱입니다. 파일을 끌어 놓으면 Markdown을 만들고,
복사하거나 결과 카드를 GPT 같은 채팅창으로 끌어 놓을 수 있습니다.

MarkItDown이 지원하는 PDF, Word, PowerPoint, Excel, 이미지, HTML, CSV/JSON/XML,
ZIP, EPUB, 오디오 등을 변환합니다. 파일 선택은 제한하지 않지만, 지원되지 않는 형식은
변환할 수 없습니다. 일부 형식의 결과는 설치된 변환 도구와 파일 내용에 따라 달라질 수 있습니다.

## 실행

Python 3.10 이상에서 실행하세요.

```powershell
uv sync
uv run app.py
```

그 다음 `http://127.0.0.1:8000`을 여세요.

## Docker

```powershell
docker build -t drop-to-markdown .
docker run --rm -p 8000:8000 drop-to-markdown
```

업로드 파일은 서버 디스크에 저장하지 않고 메모리에서 변환됩니다. 현재 업로드 제한은 50MB입니다.
