import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About EnvLock — Encrypted .env Manager",
  description: "Zero-knowledge encrypted .env file management. Learn how EnvLock keeps your secrets safe with browser-side AES-256-GCM encryption.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <Badge variant="outline">About</Badge>
        <h1 className="text-4xl font-bold">How EnvLock Works</h1>
        <p className="text-muted-foreground">
          A developer tool for sharing environment variables and secrets without exposing them to the server.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zero-Knowledge Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            When you paste or upload a <code>.env</code> file, encryption happens entirely in your browser
            using the Web Crypto API. The server never receives the plaintext — only the encrypted
            ciphertext, initialization vector (IV), and salt.
          </p>
          <p>
            The decryption key is appended to the URL as a hash fragment (<code>#key</code>). Since hash fragments
            are never sent to the server in HTTP requests, your key stays private.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Encryption Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong>Cipher:</strong> AES-256-GCM (authenticated encryption)</li>
            <li><strong>Key derivation:</strong> PBKDF2 with 600,000 iterations and a random salt</li>
            <li><strong>IV:</strong> 96-bit random initialization vector per encryption</li>
            <li><strong>Salt:</strong> 128-bit random salt, unique per vault</li>
            <li><strong>Key:</strong> 32-character random alphanumeric key, generated per vault</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Use Cases</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div>
            <h3 className="font-semibold">Sharing .env Files with Teams</h3>
            <p className="text-muted-foreground">
              Deploy a new service? Share the production .env with your team via an encrypted link instead of Slack or email.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Onboarding New Developers</h3>
            <p className="text-muted-foreground">
              Give new hires access to environment variables without exposing them in documentation or chat history.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Contractor Access</h3>
            <p className="text-muted-foreground">
              Temporary access to specific secrets with optional expiry. Revoke by deleting the vault.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
