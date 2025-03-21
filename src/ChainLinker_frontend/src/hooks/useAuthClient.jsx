import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import {
  canisterId,
  createActor,
} from "../../../declarations/ChainLinker_backend";
export const getIdentityProvider = () => {
  if (process.env.DFX_NETWORK !== "ic") {
    return `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`;
  }
  return "https://identity.ic0.app";
};

export const useAuthClient = () => {
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        setIdentity(identity);
        setPrincipal(identity.getPrincipal());
        setIsAuthenticated(true);
        const actor = createActor(canisterId, {
          agentOptions: {
            identity,
          },
        });
        setActor(actor);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: getIdentityProvider(),
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setIdentity(identity);
        setPrincipal(identity.getPrincipal());
        setIsAuthenticated(true);
        const actor = createActor(canisterId, {
          agentOptions: {
            identity,
          },
        });
        setActor(actor);
      },
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIdentity(null);
    setPrincipal(null);
    setIsAuthenticated(false);
    setActor(null);
  };

  return {
    isAuthenticated,
    identity,
    principal,
    login,
    logout,
    actor,
  };
};
