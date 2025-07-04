import {
  Archive,
  MessageSquare,
  Pin,
  Plus,
  Settings,
  SplitSquareHorizontal,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useChats } from "@/hooks/useChats";
import { Chat } from "@/lib/graphql";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Button } from "../ui/Button";
import { ChatListSkeleton } from "../ui/Skeleton";

interface SidebarProps {
  onOpenSettings: () => void;
}

type FilterType = "all" | "pinned" | "archived";

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { chats, loadChats, isLoading, updateChat } = useChats();
  const { isOpen: showSidebar, toggle: toggleSidebar } = useSidebarStore();
  const chatId = params.chatId;

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (showSidebar && chats.length == 0) {
      loadChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSidebar]);

  const onSelectChat = (chat: Chat) => {
    navigate(`/c/${chat._id}`);
  };

  const onNewChat = () => {
    navigate("/"); // Navigate to welcome page instead of /new
  };

  const onDeleteChat = (chatId: string) => {
    // TODO: Implement delete chat functionality
    console.log("Delete chat:", chatId);
  };

  const handlePinToggle = (chat: Chat, e: React.MouseEvent | undefined) => {
    e?.stopPropagation();
    updateChat(chat._id, { pinned: !chat.pinned });
  };

  const handleArchiveToggle = (chat: Chat, e: React.MouseEvent | undefined) => {
    e?.stopPropagation();
    updateChat(chat._id, { archived: !chat.archived });
  };

  const handleDualChat = (
    secondaryChat: Chat,
    e: React.MouseEvent | undefined
  ) => {
    e?.stopPropagation();

    if (chatId === secondaryChat._id) {
      alert(
        "You cannot have two instances of the same chat open (Yes, it's due to a bug, it will be possible soon)"
      );
      return;
    }

    navigate(`/c/${chatId}/${secondaryChat._id}`);
  };

  // Filter chats based on active filter
  const filteredChats = chats.filter((chat) => {
    switch (activeFilter) {
      case "pinned":
        return chat.pinned && !chat.archived;
      case "archived":
        return chat.archived;
      case "all":
      default:
        return !chat.archived; // Show all except archived
    }
  });

  // Sort chats: pinned first, then by last activity
  const sortedChats = [...filteredChats].sort((a, b) => {
    // If we're not in "all" filter, don't apply pinned sorting
    if (activeFilter !== "all") {
      return (
        new Date(b.lastActivityAt).getTime() -
        new Date(a.lastActivityAt).getTime()
      );
    }

    // In "all" filter: pinned first, then by activity
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (
      new Date(b.lastActivityAt).getTime() -
      new Date(a.lastActivityAt).getTime()
    );
  });

  const getFilterCount = (filter: FilterType) => {
    switch (filter) {
      case "pinned":
        return chats.filter((c) => c.pinned && !c.archived).length;
      case "archived":
        return chats.filter((c) => c.archived).length;
      case "all":
      default:
        return chats.filter((c) => !c.archived).length;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-72 z-50 
        ${
          showSidebar
            ? "bg-theme-bg-surface/95 lg:bg-transparent"
            : "bg-transparent"
        } 
        backdrop-blur-md border-r border-white/20 dark:border-gray-700/30
        transform transition-all duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 mb-4 border-b border-white/20 dark:border-gray-700/30">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Conversations
          </h2>
        </div>

        {/* New Chat Button */}
        <div className="px-6 mb-4">
          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={onNewChat}
            className="w-full"
          >
            New Chat
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 mb-4">
          <div className="flex bg-gray-100/80 dark:bg-primary-800/80 rounded-lg p-1 backdrop-blur-md">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeFilter === "all"
                  ? "bg-white dark:bg-secondary-500 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {getFilterCount("all")}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter("pinned")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeFilter === "pinned"
                  ? "bg-white dark:bg-secondary-500 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <Pin className="w-4 h-4" />
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {getFilterCount("pinned")}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter("archived")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeFilter === "archived"
                  ? "bg-white dark:bg-secondary-500 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <Archive className="w-4 h-4" />
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {getFilterCount("archived")}
              </span>
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {isLoading && chats.length === 0 ? (
            <ChatListSkeleton count={8} />
          ) : sortedChats.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              {activeFilter === "all" && (
                <>
                  <p className="text-lg font-medium">No conversations yet</p>
                  <p className="text-sm mt-2">Start a new chat to begin</p>
                </>
              )}
              {activeFilter === "pinned" && (
                <>
                  <p className="text-lg font-medium">No pinned chats</p>
                  <p className="text-sm mt-2">
                    Pin important conversations to keep them at the top
                  </p>
                </>
              )}
              {activeFilter === "archived" && (
                <>
                  <p className="text-lg font-medium">No archived chats</p>
                  <p className="text-sm mt-2">
                    Archive old conversations to keep your sidebar clean
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1 overflow-x-hidden">
              {/* Chat Cards */}
              {sortedChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => onSelectChat(chat)}
                  className={`bg-theme-bg-card/70 backdrop-blur-md border border-white/30 dark:border-gray-600/30 hover:bg-theme-bg-card/90 rounded-xl transition-all duration-200 group cursor-pointer py-1 px-3 relative ${
                    chatId === chat._id
                      ? "bg-theme-bg-selected border-primary-200/50 dark:border-primary-700/50"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        {/* Pin indicator */}
                        {chat.pinned && activeFilter === "all" && (
                          <Pin className="w-3 h-3 text-primary-500 flex-shrink-0" />
                        )}

                        <span
                          className={`font-semibold text-nowrap group-hover:truncate text-sm ${
                            chatId === chat._id
                              ? "text-primary-700 dark:text-primary-300"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {chat.title}
                        </span>
                      </div>

                      {/* Chat metadata */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {chat.isPublic && (
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full text-xs">
                            Public
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Dual chat button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={SplitSquareHorizontal}
                        onClick={(e) => handleDualChat(chat, e)}
                        className={`p-1 text-gray-400 hover:text-gray-600`}
                        title={"Dual chat view"}
                      />

                      {/* Pin/Unpin button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Pin}
                        onClick={(e) => handlePinToggle(chat, e)}
                        className={`p-1 ${
                          chat.pinned
                            ? "text-primary-500 hover:text-primary-700"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={chat.pinned ? "Unpin chat" : "Pin chat"}
                      />

                      {/* Archive/Unarchive button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Archive}
                        onClick={(e) => handleArchiveToggle(chat, e)}
                        className={`p-1 ${
                          chat.archived
                            ? "text-yellow-500 hover:text-yellow-700"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={
                          chat.archived ? "Unarchive chat" : "Archive chat"
                        }
                      />

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={(e) => {
                          e?.stopPropagation();
                          onDeleteChat(chat._id);
                        }}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/30"
                        title="Delete chat"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Button at Bottom */}
        <div className="p-6 border-t border-white/20 dark:border-gray-700/30">
          <Button
            variant="secondary"
            size="lg"
            icon={Settings}
            onClick={onOpenSettings}
            className="w-full"
          >
            Settings
          </Button>
        </div>
      </div>
    </>
  );
};
