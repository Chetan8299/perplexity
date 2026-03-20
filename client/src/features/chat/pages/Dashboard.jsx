import { useEffect, useMemo, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useSelector } from "react-redux";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";

const Dashboard = () => {
  const {
    initializeSocketConnection,
    handleGetChats,
    handleSendMessage,
    handleOpenChat,
  } = useChat();

  const { chats, currentChatId, loading, error } = useSelector(
    (state) => state.chat,
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length === 0) return;
    await handleSendMessage(message.trim(), currentChatId || null);
    setMessage("");
  };

  return (
    <main className="h-screen w-full bg-neutral-900 text-neutral-100">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-neutral-800 bg-neutral-950">
          <div className="p-4 border-b border-neutral-800">
            <button
              type="button"
              className="w-full rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-3 py-2 text-sm font-medium"
            >
              + New chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="px-2 py-2 text-xs uppercase tracking-wider text-neutral-400">
              Chats
            </div>
            <ul className="space-y-1">
              {Object.values(chats).map((c) => {
                const isActive = c.id === currentChatId;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => handleOpenChat(c.id, chats)}
                      className={[
                        "w-full text-left rounded-lg px-3 py-2 transition-colors",
                        isActive
                          ? "bg-neutral-900 border border-neutral-800"
                          : "hover:bg-neutral-900/60",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium">
                          {c.title}
                        </div>
                        {isActive && (
                          <span className="text-[10px] rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-300">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs text-neutral-400 mt-0.5">
                        {c.preview}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="p-4 border-t border-neutral-800 text-xs text-neutral-400">
            <div className="flex items-center justify-between">
              <span className="truncate">You</span>
              <button
                type="button"
                className="rounded-md px-2 py-1 hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
              >
                Settings
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1 flex flex-col bg-neutral-900">
          {/* Top bar */}
          <header className="h-14 flex items-center justify-between px-4 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur">
            <div className="flex items-center gap-3 min-w-0">
              <div className="md:hidden">
                <button
                  type="button"
                  className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm hover:bg-neutral-900"
                >
                  Menu
                </button>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Chat</div>
                <div className="truncate text-xs text-neutral-400">
                  Ask anything
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm hover:bg-neutral-900"
              >
                Share
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="mx-auto w-full min-w-3xl px-6 py-6 space-y-6">
              {chats[currentChatId]?.messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex  ${isUser ? "flex-row-reverse w-fit ml-auto" : "justify-start mr-auto w-4/5"} gap-3`}
                  >
                    <div
                      className={[
                        "h-8 w-8 shrink-0 rounded-full grid place-items-center text-xs font-semibold border",
                        isUser
                          ? "bg-neutral-950 border-neutral-800 text-neutral-200"
                          : "bg-emerald-900/30 border-emerald-700/40 text-emerald-200",
                      ].join(" ")}
                    >
                      {isUser ? "You" : "AI"}
                    </div>

                    <div className="min-w-0 flex-1 ">
                      <div
                        className={[
                          "rounded-2xl px-4 py-3 border leading-relaxed text-sm",
                          isUser
                            ? "bg-neutral-950 border-neutral-800"
                            : "bg-neutral-900 border-neutral-800",
                        ].join(" ")}
                      >
                        {isUser ? (
                          m.content
                        ) : (
                          <Markdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight, rehypeRaw]}
                            components={{
                              h3: ({ children }) => (
                                <h3 className="text-xl font-semibold mt-4 mb-2">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => {
                                if (
                                  !children ||
                                  children.toString().trim() === ""
                                )
                                  return null;
                                return (
                                  <p className="text-white-700 mb-3">
                                    {children}
                                  </p>
                                );
                              },
                              code({ inline, className, children }) {
                                return !inline ? (
                                  <pre className="bg-black my-2 p-4 rounded-lg overflow-x-auto">
                                    <code className={className}>
                                      {children}
                                    </code>
                                  </pre>
                                ) : (
                                  <code className="bg-gray-200 px-1 rounded">
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {m.content}
                          </Markdown>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-neutral-800 bg-neutral-900">
            <div className="mx-auto w-full max-w-3xl px-4 py-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <div className="flex items-end gap-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={1}
                    placeholder="Message…"
                    className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-500 max-h-40"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-semibold px-4 py-2 text-sm disabled:opacity-50 disabled:hover:bg-emerald-600"
                    disabled={message.trim().length === 0}
                    onClick={handleSubmit}
                  >
                    Send
                  </button>
                </div>
                <div className="mt-2 px-3 pb-1 text-[11px] text-neutral-500">
                  UI only — wire this up to your chat hook when ready.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
