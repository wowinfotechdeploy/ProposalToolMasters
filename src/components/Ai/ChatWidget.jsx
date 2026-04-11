import { useState } from "react";
import ChatWindow from "./ChatWindow";
import { useSelector } from "react-redux";

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const organisationKeyID = useSelector(
        (state) => state.Storage.organisationKeyID
    );

    const token = useSelector(
        (state) => state.Storage.token
    );

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="btn btn-primary chat-toggle-btn"
            >
                🤖
            </button>

            {/* Chat Window */}
            {open &&

                <div className="ai-root">
                    <ChatWindow key={organisationKeyID} organisationKeyID={organisationKeyID} token={token} />
                </div>
            }
        </>
    );
};

export default ChatWidget;