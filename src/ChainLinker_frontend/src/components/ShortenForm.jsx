import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { shortenUrl } from "../services/api";
import { useAuthClient } from "../hooks/useAuthClient";

const ShortenForm = () => {
  const { isAuthenticated, actor } = useAuthClient();

  const [url, setUrl] = useState("");
  const [shortLink, setShortLink] = useState();

  const isValidURL = () => {
    const Regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;
    return Regex.test(url);
  };

  const handleShorten = async () => {
    if (!url) return message.error("Please enter a URL!");
    if (!isValidURL()) return message.error("Please enter a valid URL!");

    try {
      const id = await (isAuthenticated
        ? actor.shortenUrl(url)
        : shortenUrl(url));
      const frontendUrl = `${window.location.origin}/${id}`;
      setShortLink(frontendUrl);
      message.success("Shortened link created successfully!");
    } catch (error) {
      message.error("Error shortening the link!");
    }
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Input
          size="large"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="primary" size="large" onClick={handleShorten}>
          Shorten
        </Button>
      </div>

      {shortLink && (
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          Shorten URL:
          <a href={shortLink} target="_blank" rel="noopener noreferrer">
            {shortLink}
          </a>
          <CopyOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigator.clipboard.writeText(shortLink);
              message.success("Copied to clipboard!");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ShortenForm;
