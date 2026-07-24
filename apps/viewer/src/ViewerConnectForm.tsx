import { useMemo, useState } from "react";
import { Button, Input } from "@heroui/react";
import {
  classifyConnectionError,
  testLongLivedTokenConnection,
  type HAConnectionFailure,
  type HATokenStore,
} from "./ha";

type Props = {
  hassUrl: string;
  tokenStore: HATokenStore;
  onConnected: () => void;
};

/**
 * Minimal first-run auth for the static viewer.
 * Prefers a long-lived access token so wall tablets work without OAuth redirects.
 */
export function ViewerConnectForm({
  hassUrl: initialUrl,
  tokenStore,
  onConnected,
}: Props) {
  const [hassUrl, setHassUrl] = useState(initialUrl);
  const [token, setToken] = useState("");
  const [failure, setFailure] = useState<HAConnectionFailure | null>(null);
  const [pending, setPending] = useState(false);

  const saveTokens = useMemo(
    () => tokenStore.saveTokens(hassUrl),
    [tokenStore, hassUrl]
  );

  const onSubmit = async () => {
    setFailure(null);
    setPending(true);
    try {
      const result = await testLongLivedTokenConnection(hassUrl, token);
      if (!result.ok) {
        setFailure(result.failure);
        return;
      }
      await Promise.resolve(saveTokens(result.auth));
      onConnected();
    } catch (err) {
      setFailure(classifyConnectionError(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-theme-border bg-theme-surface p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-theme-text">
            Connect Home Assistant
          </h1>
          <p className="mt-1 text-sm text-theme-text-secondary">
            This published dashboard runs as static files. Enter a long-lived
            access token — it is stored only in this browser, never in the
            published files.
          </p>
        </div>

        {failure ? (
          <div
            className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800"
            data-failure-code={failure.code}
            role="alert"
          >
            {failure.message}
          </div>
        ) : null}

        <Input
          label="Home Assistant URL"
          value={hassUrl}
          onValueChange={setHassUrl}
          description="Usually matches your HA instance URL"
        />
        <Input
          label="Long-lived access token"
          type="password"
          value={token}
          onValueChange={setToken}
          description="Create one in HA → Profile → Long-lived access tokens"
        />
        <div className="flex justify-end">
          <Button
            color="primary"
            isDisabled={!hassUrl || !token.trim()}
            isLoading={pending}
            onPress={onSubmit}
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
}
