#!/usr/bin/env python3
"""Build a deterministic Web Store upload; excludes tests, docs and promotional assets."""
import hashlib, json, pathlib, subprocess, zipfile
ROOT = pathlib.Path(__file__).resolve().parents[1]
m = json.loads((ROOT / 'manifest.json').read_text())
assert m['manifest_version'] == 3
for locale in (ROOT / '_locales').iterdir():
    messages = json.loads((locale / 'messages.json').read_text())
    assert len(messages['extensionDescription']['message']) <= 132
for script in (ROOT / 'src').glob('*.js'):
    subprocess.run(['node', '--check', str(script)], check=True)
files = [ROOT / 'manifest.json', ROOT / 'LICENSE']
for folder in ['src', 'icons', '_locales']:
    files.extend(p for p in (ROOT / folder).rglob('*') if p.is_file())
referenced = [m['background']['service_worker'], m['action']['default_popup'], *m['icons'].values()]
for entry in m['content_scripts']:
    referenced += entry.get('js', []) + entry.get('css', [])
for name in referenced:
    assert (ROOT / name).is_file(), name
out = ROOT / 'dist'; out.mkdir(exist_ok=True)
path = out / f"no-ai-feed-{m['version']}-chrome.zip"
with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as archive:
    for source in sorted(files):
        info = zipfile.ZipInfo(source.relative_to(ROOT).as_posix(), (2026, 9, 24, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, source.read_bytes())
with zipfile.ZipFile(path) as archive:
    assert 'manifest.json' in archive.namelist()
    assert archive.testzip() is None
checksum = hashlib.sha256(path.read_bytes()).hexdigest()
(out / 'SHA256SUMS.txt').write_text(f'{checksum}  {path.name}\n')
print(f'{path.name}: {path.stat().st_size} bytes; sha256={checksum}')
