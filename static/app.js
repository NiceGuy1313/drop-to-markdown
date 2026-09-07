const input = document.querySelector('#fileInput');
const zone = document.querySelector('#dropZone');
const result = document.querySelector('#result');
const output = document.querySelector('#markdownOutput');
const notice = document.querySelector('#notice');
const fileName = document.querySelector('#fileName');
let markdown = '';
let sourceName = 'converted';

document.querySelector('#chooseButton').addEventListener('click', () => input.click());
input.addEventListener('change', () => input.files[0] && convert(input.files[0]));

['dragenter', 'dragover'].forEach((eventName) => zone.addEventListener(eventName, (event) => {
  event.preventDefault(); zone.classList.add('over');
}));
['dragleave', 'drop'].forEach((eventName) => zone.addEventListener(eventName, (event) => {
  event.preventDefault(); zone.classList.remove('over');
}));
zone.addEventListener('drop', (event) => event.dataTransfer.files[0] && convert(event.dataTransfer.files[0]));

async function convert(file) {
  if (file.size > 50 * 1024 * 1024) return showNotice('파일은 50MB 이하로 올려주세요.', true);
  showNotice(`“${file.name}” 변환 중…`);
  result.classList.add('hidden');
  const form = new FormData(); form.append('file', file);
  try {
    const response = await fetch('/api/convert', { method: 'POST', body: form });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || '변환에 실패했어요.');
    markdown = data.markdown || '';
    sourceName = data.filename;
    output.textContent = markdown || '_추출된 텍스트가 없습니다._';
    fileName.textContent = sourceName;
    document.querySelector('#charCount').textContent = `${markdown.length.toLocaleString()}자`;
    result.classList.remove('hidden');
    showNotice('완료! 복사하거나 카드를 채팅창으로 끌어 놓으세요.');
  } catch (error) { showNotice(error.message, true); }
}

document.querySelector('#copyButton').addEventListener('click', async () => {
  await navigator.clipboard.writeText(markdown);
  showNotice('Markdown을 클립보드에 복사했어요.');
});
document.querySelector('#downloadButton').addEventListener('click', () => {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${sourceName.replace(/\.[^.]+$/, '')}.md` });
  link.click(); URL.revokeObjectURL(link.href);
});
document.querySelector('#dragCard').addEventListener('dragstart', (event) => {
  event.dataTransfer.setData('text/plain', markdown);
  event.dataTransfer.effectAllowed = 'copy';
});
function showNotice(message, isError = false) {
  notice.textContent = message; notice.classList.toggle('error', isError);
}
