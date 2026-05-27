import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "API Documentation — EnvLock",
  description: "EnvLock API documentation for developers. Create and manage encrypted vaults programmatically.",
};

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <Badge variant="outline">API</Badge>
        <h1 className="text-4xl font-bold">API Reference</h1>
        <p className="text-muted-foreground">
          Create and retrieve encrypted vaults programmatically.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a Vault</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">POST /api/vaults</p>
          <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">{`{
  "id": "vault-id",
  "encryptedData": "hex-encoded-ciphertext",
  "iv": "hex-encoded-iv",
  "salt": "hex-encoded-salt",
  "name": "optional name"
}`}</pre>
          <p className="text-muted-foreground">
            The <code>id</code> should be a unique identifier. Encrypt the data on the client side before sending.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retrieve a Vault</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">GET /api/vaults?id={"{vaultId}"}</p>
          <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">{`{
  "id": "vault-id",
  "encryptedData": "hex-encoded-ciphertext",
  "iv": "hex-encoded-iv",
  "salt": "hex-encoded-salt",
  "name": "optional name",
  "createdAt": "2026-01-01T00:00:00.000Z"
}`}</pre>
          <p className="text-muted-foreground">
            Decryption must happen on the client side using the key from the URL fragment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
