import { useEffect, useState } from "react";
import { Table, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { getAllLinks } from "../services/api";
import { useAuthClient } from "../hooks/useAuthClient";

const LinkList = () => {
  const { actor } = useAuthClient();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetchLinks();
  }, [actor]);

  const fetchLinks = async () => {
    if (!actor) return;
    const data = await actor.getLinksByCreator();
    console.log(data);
    setLinks(data.map((item) => item[1]));
  };

  // const handleDelete = async (id) => {
  //   await deleteLink(id);
  //   message.success("Link deleted!");
  //   fetchLinks();
  // };

  return (
    <Table
      dataSource={links}
      columns={[
        // { title: "ID", dataIndex: "id" },
        {
          title: "Shorten URL",
          render: (record) => {
            const shortLink = `${window.location.origin}/${record.id}`;
            return (
              <div style={{ display: "flex", gap: 10 }}>
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
            );
          },
        },
        { title: "Original URL", dataIndex: "originalUrl" },
        {
          title: "Click count",
          dataIndex: "clickCount",
          render: (value) => Number(value),
        },
        // {
        //   title: "Action",
        //   render: (_, { id }) => (
        //     <Button onClick={() => handleDelete(id)}>Delete</Button>
        //   ),
        // },
      ]}
    />
  );
};

export default LinkList;
