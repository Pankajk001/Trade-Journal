"""Check Git content without printing credentials. Uses only Python's standard library.

Default: tracked working files plus untracked files eligible for Git.
--staged: check the actual index contents, used by the pre-commit hook.
--history: additionally check reachable historical Git blobs.
"""
import argparse
import fnmatch
import os
import re
import subprocess
from pathlib import Path


PATTERNS = [
    ("Supabase API key", rb"sb_(?:publishable|secret)_[A-Za-z0-9_-]{16,}"),
    ("JWT credential", rb"eyJ[A-Za-z0-9_-]{16,}\.eyJ[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}"),
    ("AWS credential", rb"(?:AKIA|ASIA)[A-Z0-9]{16}"),
    ("GitHub token", rb"(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{30,}"),
    ("OpenAI-style API key", rb"\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}"),
    ("Google API key", rb"AIza[A-Za-z0-9_-]{30,}"),
    ("Private key", rb"-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----"),
    ("Credential in connection URL", rb"(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis|amqps?)://[^\s:/@]+:[^\s/@]+@"),
    ("Hardcoded credential", rb"(?i)\b[a-z0-9_]*(?:api[_-]?key|api[_-]?secret|secret[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|jwt[_-]?secret|password)\s*[:=]\s*[\"']([^\"'\r\n]{8,})[\"']"),
]


def placeholder(value):
    text = value.decode("utf-8", errors="replace").lower()
    if "${" in text or "your_" in text or "your-" in text:
        return True
    return text.startswith(("test-", "test_", "mock-", "mock_", "example", "placeholder", "replace_")) or text == "wrong-password"


def inspect_bytes(data):
    findings = set()
    for name, expression in PATTERNS:
        for match in re.finditer(expression, data):
            value = match.group(1) if match.lastindex else match.group()
            if not placeholder(value):
                findings.add(name)
    return sorted(findings)


def sensitive_path(path):
    parts = path.lower().replace("\\", "/").split("/")
    name = parts[-1]
    if name.endswith((".example", ".sample", ".template")):
        return False
    patterns = [".env", ".env.*", ".envrc", ".envrc.*", ".dev.vars*", "*keys*.txt", "*secrets*.txt", "*credentials*.txt", "*keys*.json", "*secrets*.json", "*credentials*.json", "credentials.json", "credentials.*.json", "secrets.json", "secrets.*.json", "*service-account*.json", "*service_account*.json", "*.pem", "*.key", "*.p12", "*.pfx", "id_rsa", "id_ed25519", ".npmrc", ".pypirc", "*.pyc", "*.pyo"]
    return any(fnmatch.fnmatchcase(name, pattern) for pattern in patterns) or any(part in {"secrets", ".secrets", ".aws", ".azure", ".direnv", "__pycache__"} for part in parts[:-1])


def git(*args):
    return subprocess.check_output(["git", *args], stderr=subprocess.DEVNULL)


def blobs(entries):
    """Read many index/history blobs in a single Git process."""
    if not entries:
        return
    object_ids = list(dict.fromkeys(oid for oid, _ in entries))
    result = subprocess.run(
        ["git", "cat-file", "--batch"], input=("\n".join(object_ids) + "\n").encode(),
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, check=True,
    ).stdout
    contents = {}
    offset = 0
    for oid in object_ids:
        end = result.index(b"\n", offset)
        fields = result[offset:end].split()
        if len(fields) != 3:
            raise RuntimeError("Unable to inspect a Git object; check stopped.")
        size = int(fields[2])
        contents[oid] = result[end + 1:end + 1 + size] if fields[1] == b"blob" else b""
        offset = end + 1 + size + 1
    for oid, path in entries:
        yield path, contents[oid]


def report(scope, path, data, check_path=True):
    findings = inspect_bytes(data)
    if check_path and sensitive_path(path):
        findings.append("Local credential filename")
    if findings:
        # Never print matched content, even on errors.
        print(f"{scope}: {path} [{'; '.join(findings)}]")
    return bool(findings)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--staged", action="store_true")
    parser.add_argument("--history", action="store_true")
    args = parser.parse_args()
    root = Path(git("rev-parse", "--show-toplevel").decode().strip())
    os.chdir(root)
    entries = []
    for record in filter(None, git("ls-files", "--stage", "-z").split(b"\0")):
        metadata, path = record.split(b"\t", 1)
        mode, oid, stage = metadata.split()
        if stage != b"0":
            raise RuntimeError("Resolve index conflicts before checking credentials.")
        if mode != b"160000":
            entries.append((oid.decode(), path.decode("utf-8", errors="surrogateescape")))
    hits = 0
    if args.staged:
        for path, data in blobs(entries):
            hits += report("INDEX", path, data)
    else:
        paths = {path for _, path in entries}
        paths.update(git("ls-files", "--others", "--exclude-standard", "-z").decode("utf-8", errors="surrogateescape").strip("\0").split("\0"))
        for path in sorted(filter(None, paths)):
            file = root / path
            if file.is_file() and not file.is_symlink():
                hits += report("WORKTREE", path, file.read_bytes())
    if args.history:
        historical = []
        for record in git("rev-list", "--objects", "--all").splitlines():
            oid, separator, path = record.partition(b" ")
            if separator:
                historical.append((oid.decode(), path.decode("utf-8", errors="replace")))
        for path, data in blobs(historical):
            hits += report("HISTORY", path, data)
    print(f"Credential check: {'FAILED (' + str(hits) + ' flagged files/objects)' if hits else 'passed'}. Values are never printed.")
    return 1 if hits else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, subprocess.CalledProcessError, RuntimeError) as failure:
        print(f"Credential check could not finish ({type(failure).__name__}); commit stopped.")
        raise SystemExit(2)
