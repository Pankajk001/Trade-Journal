"""Exercise the credential guard against real temporary Git indexes."""
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

CHECKER = Path(__file__).with_name("check_secrets.py").resolve()


class CredentialGuardTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="journal-secret-check-")
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.git("init", "--quiet")

    def git(self, *args):
        return subprocess.run(["git", *args], cwd=self.root, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def check(self):
        return subprocess.run([sys.executable, str(CHECKER), "--staged"], cwd=self.root, capture_output=True, text=True)

    def write(self, path, text):
        destination = self.root / path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(text, encoding="utf-8")

    def test_safe_templates_and_environment_references_pass(self):
        self.write(".env.example", "VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY\n")
        self.write("app.js", "const apiKey = process.env.API_KEY;\n")
        self.git("add", ".")
        self.assertEqual(self.check().returncode, 0)

    def test_staged_api_key_is_blocked_even_if_working_copy_is_clean(self):
        synthetic = "sb_" + "secret_" + "A" * 40
        self.write("app.js", "const key = '" + synthetic + "';\n")
        self.git("add", "app.js")
        self.write("app.js", "const key = process.env.API_KEY;\n")
        result = self.check()
        self.assertEqual(result.returncode, 1)
        self.assertIn("app.js", result.stdout)
        self.assertNotIn(synthetic, result.stdout + result.stderr)

    def test_ignored_credential_file_forced_into_index_is_blocked(self):
        self.write(".gitignore", ".env.*\n")
        self.write(".env.production", "UNRELATED_SETTING=anything\n")
        self.git("add", ".gitignore")
        self.git("add", "-f", ".env.production")
        self.assertEqual(self.check().returncode, 1)

    def test_generic_hardcoded_provider_secret_is_blocked(self):
        synthetic = "not-a-" + "real-provider-credential"
        self.write("config.js", "const apiSecret = '" + synthetic + "';\n")
        self.git("add", "config.js")
        result = self.check()
        self.assertEqual(result.returncode, 1)
        self.assertNotIn(synthetic, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
