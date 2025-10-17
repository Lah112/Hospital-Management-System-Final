import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./loading";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/message/getall"
        );
        setMessages(data.messages);
      } catch (error) {
        console.error("Error occurred while fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="page messages">
      <h1>Messages</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div className="card" key={message._id}>
              <div className="details">
                <p>
                  First Name: <span>{message.firstName}</span>
                </p>
                <p>
                  Last Name: <span>{message.lastName}</span>
                </p>
                <p>
                  Email: <span>{message.email}</span>
                </p>
                <p>
                  Phone: <span>{message.phone}</span>
                </p>
                <p>
                  Message: <span>{message.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h2>No Messages!</h2>
        )}
      </div>
    </section>
  );
};

export default Messages;
