# ✅ Obsidian Live Danmaku Sidebar Installation Guide

---

## 🚀 Quick Installation (No development environment required)

This is a native pure JavaScript plugin **no compilation, no npm, no tools required.** Just copy the files and run.

### Installation Steps:
1. Open your Obsidian vault folder
2. Navigate to the hidden folder: `.obsidian/plugins/`
3. Copy the entire `live-danmaku-sidebar` folder into this directory
4. Restart Obsidian
5. Go to **Settings → Community plugins** and enable "Live Danmaku Sidebar"


---

## 📂 Plugin File Structure
```
live-danmaku-sidebar/
├── manifest.json    ✅ Plugin registration file
├── main.js          ✅ All plugin logic
├── styles.css       ✅ Stylesheet
├── INSTALLATION.md
└── 安装说明.md
```

---

## ⚙️ How to Use
1. A custom **Live Danmaku** icon will appear in the left ribbon bar. Click it to open the right sidebar.
2. On **first run only**, the plugin will automatically create this folder structure in your vault:
    ```
    live-danmaku/
    ├── input/
    │   ├── 观众入场-中文.md
    │   ├── 手速惊叹-中文.md
    │   ├── 迷妹打call-中文.md
    │   ├── 直播间神回复-中文.md
    │   ├── chat-arrives-en.md
    │   ├── speed-progress-hype-en.md
    │   ├── hype-squad-en.md
    │   └── gremlin-chat-en.md
    ├── idle/
    │   ├── 停顿陪伴-中文.md
    │   └── idle-companion-en.md
    └── milestones/
        ├── 100-中文里程碑.md
        ├── 300-中文里程碑.md
        ├── 600-中文里程碑.md
        ├── 1000-中文里程碑.md
        ├── 100-milestone-en.md
        ├── 300-milestone-en.md
        ├── 600-milestone-en.md
        └── 1000-milestone-en.md
    ```
3. You can add more `.md` files directly into these folders, they will be loaded automatically:
    - `live-danmaku/input/`: General danmaku triggered while typing
    - `live-danmaku/idle/`: Encouragement danmaku triggered during pauses
    - `live-danmaku/milestones/`: Milestone danmaku (filename **must start with a number**, e.g. `200.md` or `150-my-milestone.md`)
4. Supported format is simple: **one danmaku per line**, Markdown lists are also supported
5. Default templates are created **only once**. Any deletion, modification or renaming you perform on the `live-danmaku/` folder will be preserved permanently. The plugin will **never automatically restore** files on restart.
6. To restore missing default templates manually, open command palette, set the hotkey and run:
    - `Live Danmaku Sidebar: Bootstrap default danmaku library (fill missing only)`
7. Typing danmaku will only trigger on **valid character count growth**. After ~5 seconds of inactivity the plugin switches to idle encouragement messages.
8. When your "current document character count since opening" reaches milestone thresholds (100/300/600/1000 by default), special high-visibility milestone danmaku will appear.
9. The sidebar can be opened/closed at any time without affecting other functionality.

---

### Milestone Counting Rules (Important)
- Counting is per-document and per-session: **characters added since you opened this document**
- Switching to another document starts a fresh counting session
- All counters are automatically cleared when Obsidian is closed
- This is pure in-memory state: nothing is written to disk or configuration files, negligible performance impact

---

### Danmaku File Examples
```md
# Input Danmaku

- Nice writing!
- Good thinking
- This is interesting
```

```md
# Idle Danmaku

- Take your time
- I'll wait for you
- No rush, take a breath
```

```md
# 300 word milestone danmaku (filename: 300-my-milestone.md)

- 🎉 300 words added! Great pace!
- 🏅 300 words reached! Keep going!
- ✨ You're on fire right now.
```

---

## 🌟 Visual Effect Variants
- Regular input danmaku: Base style, low-profile companion
- Idle danmaku: Softer styling, less intrusive
- Milestone danmaku: Gradient background + badge + larger font + bounce entrance + extended display time

All effects are implemented in pure CSS, no complex theming system. You can continue customizing exclusively by editing `.md` content files without touching code.

---

## ✅ Compatibility
- ✅ Works with all Obsidian versions 1.0+
- ✅ Automatic dark/light theme support
- ✅ Compatible with all third party themes
- ✅ Works on Windows / Mac / Linux
- ✅ Desktop optimized, no mobile compatibility issues

---

## 💡 Technical Notes
- Uses official `editor-change` event for input detection
- Triggers only on **net positive character growth** with accumulated thresholds, avoids spamming on every keystroke
- Idle checking uses low frequency polling, no high frequency loop
- Milestone counting uses in-memory per-session counters, no persistent storage required
- All CSS animations are hardware accelerated
- Proper resource cleanup, no memory leaks

You can drop this folder into your Obsidian plugins directory and it will work immediately.

---

## 🛠 Troubleshooting "Plugin failed to load"

1. **Folder name must match exactly**  
   Plugin directory must be:
   ```
   .obsidian/plugins/live-danmaku-sidebar/
   ```
   You cannot rename this folder, it must match the `id` field in `manifest.json`.

2. **Verify the three runtime files are at the root level**
   ```
   live-danmaku-sidebar/
   ├── manifest.json
   ├── main.js
   └── styles.css
   ```
   Do not nest the plugin inside an extra subfolder.

3. **Always restart Obsidian after overwriting files**  
   Obsidian caches plugin code aggressively. Reloading the app is required for changes to take effect.

4. **Minimum Obsidian version 1.0+ required**  
   This plugin specifies `minAppVersion: "1.0.0"`.

5. **Plugin is enabled but no danmaku appear**  
   Make sure the right sidebar is open and verify these folders exist in your vault:
   ```
   live-danmaku/input/
   live-danmaku/idle/
   live-danmaku/milestones/
   ```
   And that `.md` files inside contain valid readable text content.

   If you previously deleted these folders you can restore them by running the command palette action:
   `Live Danmaku Sidebar: Bootstrap default danmaku library (fill missing only)`

6. **Errors only on first launch after restart**  
   This plugin initializes the danmaku library after `onLayoutReady` to avoid race conditions during vault loading. If upgrading from old versions make sure you replace both `main.js` and `manifest.json` then perform a full Reload app.