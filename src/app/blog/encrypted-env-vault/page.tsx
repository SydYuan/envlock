import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Encrypted Env Vault — Secure Environment Variable Storage | EnvLock",
  description: "An encrypted env vault for developers. Store and share environment variables with AES-256-GCM browser-side encryption. Free tier available.",
};

export default function EncryptedEnvVaultPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <Badge variant="outline">Guide</Badge>
        <h1 className="text-4xl font-bold">Encrypted Env Vault: A Modern Approach to Secret Management</h1>
        <p className="text-muted-foreground">
          How an encrypted env vault solves the problem of sharing environment variables across your team without exposing secrets to third parties.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>The Problem with Sharing .env Files</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3 text-muted-foreground">
          <p>
            Every developer has been there: you need to share the production database URL or an API key with a teammate.
            You paste it in Slack, email it, or put it in a shared Google Doc. That secret now lives in perpetuity in
            your chat history, email archives, and cloud storage — accessible to anyone with access.
          </p>
          <p>
            An encrypted env vault solves this. You encrypt the secret once, share a link with a key, and
            the recipient decrypts it in their browser. No copies, no persistence in chat history.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How EnvLock Works as Your Env Vault</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3 text-muted-foreground">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Paste or upload your .env file on the web app</li>
            <li>Encryption happens in your browser using AES-256-GCM</li>
            <li>Only the encrypted ciphertext is sent to the server</li>
            <li>A unique URL with the key in the hash fragment is generated</li>
            <li>Share the URL — only people with the key can decrypt</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
