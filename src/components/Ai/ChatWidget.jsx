import { useState } from "react";
import ChatWindow from "./ChatWindow";
const ChatWidget = () => {
    const [open, setOpen] = useState(false);

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
                    <ChatWindow />
                </div>
            }
        </>
    );
};

export default ChatWidget;