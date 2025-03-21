import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/ChainLinker_backend";

const canisterId = process.env.CANISTER_ID_CHAINLINKER_BACKEND;
const isLocal = process.env.DFX_NETWORK === "local";
const host = "https://ic0.app/";
const localhost = "http://localhost:4943/";

const agent = new HttpAgent({
  host: isLocal ? localhost : host,
});
if (isLocal) {
  agent.fetchRootKey();
}

const backend = Actor.createActor(idlFactory, {
  agent,
  canisterId: canisterId,
});

export const shortenUrl = async (url) => {
  return await backend.shortenUrl(url);
};

export const getOriginalUrl = async (id) => {
  return await backend.getOriginalUrl(id);
};

export const getAllLinks = async () => {
  return await backend.getAllLinks();
};

export const updateLink = async (id, newUrl) => {
  return await backend.updateLink({ id, newUrl });
};

export const deleteLink = async (id) => {
  return await backend.deleteLink(id);
};
