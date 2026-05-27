"use client";

import { useEffect, useState, use } from "react";
import { decrypt } from "@/lib/crypto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VaultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [key, setKey] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) setKey(hash);
  }, []);

  useEffect(() => {
    if (!key || !id) return;
    loadVault();
  }, [key, id]);

  async function loadVault() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/vaults?id=${id}`);
      if (!res.ok) throw new Error("Vault not found");
      const data = await res.json();
      setName(data.name || "");

      if (!key) {
        setLoading(false);
        return;
      }

      const decrypted = await decrypt(data.encryptedData, key, data.iv, data.salt);
      setContent(decrypted);
    } catch {
      setError("Could not decrypt. The link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  }

  function copyContent() {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Decrypting...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">EnvLock</h1>
          <Badge variant="outline">Decrypted in browser</Badge>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{name || "Vault"}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Decrypted in your browser. Close this tab to clear it.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={copyContent}>
              Copy
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-muted p-4 overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
              {content}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
