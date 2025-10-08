"use client";

import React, { useState } from "react";

interface Tab {
    id: number;
    title: string;
    route: string;
}

export default function TopFrame({ onTabChangeAction }: { onTabChangeAction: (route: string) => void }) {
    const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: "Home", route: "/" }]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [omnibox, setOmnibox] = useState("/");

    const addTab = (route: string, title?: string) => {
        const newId = tabs.length ? Math.max(...tabs.map(t => t.id)) + 1 : 1;
        const newTab = { id: newId, title: title || route, route };
        setTabs([...tabs, newTab]);
        setActiveTabId(newId);
        onTabChangeAction(route);
    };

    const closeTab = (id: number) => {
        let newActiveId = activeTabId;
        if (id === activeTabId) {
            const remaining = tabs.filter(t => t.id !== id);
            newActiveId = remaining.length ? remaining[0].id : 0;
            if (newActiveId) onTabChangeAction(remaining.find(t => t.id === newActiveId)!.route);
        }
        setTabs(tabs.filter(t => t.id !== id));
        setActiveTabId(newActiveId);
    };

    const switchTab = (id: number) => {
        setActiveTabId(id);
        const tab = tabs.find(t => t.id === id);
        if (tab) onTabChangeAction(tab.route);
        setOmnibox(tab?.route || "");
    };

    const handleOmniboxEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        let input = omnibox.trim();

        // Check if it looks like a URL (contains dot and no spaces)
        const isProbablyUrl = input.includes(".") && !input.includes(" ");

        if (isProbablyUrl) {
            // Ensure it has protocol
            if (!input.startsWith("http://") && !input.startsWith("https://")) {
                input = `https://${input}`;
            }
        } else {
            // Treat as search query
            input = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
        }

        addTab(input, input); // open as new tab
    };



    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center h-12 bg-[#202124]" style={{ WebkitAppRegion: "drag" } as React.CSSProperties}>
            {/* Tabs */}
            <div className="flex-1 flex gap-1 overflow-x-auto">
                {tabs.map(tab => (
                    <div key={tab.id} className={`flex items-center px-3 py-1 rounded-t-md cursor-pointer ${tab.id === activeTabId ? "bg-[#4b4c4f] text-white" : "bg-[#2d2f31] text-gray-300"}`} onClick={() => switchTab(tab.id)} style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                        {tab.title}
                        <span className="ml-2 hover:text-red-500" onClick={e => { e.stopPropagation(); closeTab(tab.id); }}>×</span>
                    </div>
                ))}
            </div>

            {/* Omnibox */}
            <input type="text" value={omnibox} onChange={e => setOmnibox(e.target.value)} onKeyDown={handleOmniboxEnter} className="flex-shrink-0 w-48 px-2 py-1 mx-2 rounded bg-[#3c4043] text-white" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties} />

            {/* Window controls */}
            <div className="flex gap-1" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
                <button onClick={() => window.electronAPI?.minimize()} className="w-8 h-8 flex items-center justify-center hover:bg-[#3c4043]">–</button>
                <button onClick={() => window.electronAPI?.maximize()} className="w-8 h-8 flex items-center justify-center hover:bg-[#3c4043]">□</button>
                <button onClick={() => window.electronAPI?.close()} className="w-8 h-8 flex items-center justify-center hover:bg-[#d93025]">×</button>
            </div>
        </div>
    );
}
