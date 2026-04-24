/* ==========================================
 *  Obsidian 侧边栏弹幕插件 最小可用版本 v0.3
 *  本轮目标：外部弹幕库、输入/停顿分流、去掉遮挡底栏
 * ==========================================
 */

const {
  Plugin,
  ItemView,
  Notice,
  TFile,
  addIcon,
  normalizePath,
} = require("obsidian");

const VIEW_TYPE = "live-danmaku-view";
const CUSTOM_ICON_ID = "live-danmaku-sidebar-icon-v2";
// 注意：Obsidian 的 addIcon 会将内容注入到默认 100x100 的 SVG 视口中，
// 这里使用 0~100 坐标系，避免出现图标缩在左上角的问题。
const CUSTOM_ICON_SVG = `
<rect x="8" y="17" width="84" height="66" rx="8" ry="8" fill="none" stroke="currentColor" stroke-width="8"/>
<path d="M8 33h84" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
<path d="M63 33v50" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
<path d="M77 48l4 8 8 2-8 2-4 8-4-8-8-2 8-2z" fill="currentColor" stroke="none"/>
`;

const DANMAKU_ROOT = normalizePath("live-danmaku");
const LEGACY_DANMAKU_ROOT = normalizePath("直播弹幕");

const INPUT_SUBFOLDER = "input";
const IDLE_SUBFOLDER = "idle";
const MILESTONE_SUBFOLDER = "milestones";

const INPUT_FOLDER = normalizePath(`${DANMAKU_ROOT}/${INPUT_SUBFOLDER}`);
const IDLE_FOLDER = normalizePath(`${DANMAKU_ROOT}/${IDLE_SUBFOLDER}`);
const MILESTONE_FOLDER = normalizePath(`${DANMAKU_ROOT}/${MILESTONE_SUBFOLDER}`);

const LEGACY_INPUT_FOLDER = normalizePath(`${LEGACY_DANMAKU_ROOT}/${INPUT_SUBFOLDER}`);
const LEGACY_IDLE_FOLDER = normalizePath(`${LEGACY_DANMAKU_ROOT}/${IDLE_SUBFOLDER}`);
const LEGACY_MILESTONE_FOLDER = normalizePath(`${LEGACY_DANMAKU_ROOT}/${MILESTONE_SUBFOLDER}`);

const DANMAKU_INPUT_FOLDERS = [INPUT_FOLDER, LEGACY_INPUT_FOLDER];
const DANMAKU_IDLE_FOLDERS = [IDLE_FOLDER, LEGACY_IDLE_FOLDER];
const DANMAKU_MILESTONE_FOLDERS = [MILESTONE_FOLDER, LEGACY_MILESTONE_FOLDER];

const LEGACY_MILESTONE_THRESHOLDS = [100, 300, 600, 1000];

function getLegacyDefaultInputContent() {
  return [
    "# 输入时弹幕",
    "",
    "- 写得不错！",
    "- 继续加油",
    "- 这个思路好",
    "- 有点东西",
    "- 学到了",
    "- 好看爱看",
    "- 快更新",
  ].join("\n");
}

function getLegacyDefaultIdleContent() {
  return [
    "# 停顿时弹幕",
    "",
    "- 慢慢来，不着急",
    "- 我在等你呢",
    "- 喝口水休息一下",
    "- 没关系，慢慢组织语言",
    "- 写得很好，继续想想",
    "- 我相信你可以的",
  ].join("\n");
}

function getLegacyDefaultMilestoneContent(threshold) {
  return [
    `# ${threshold} 字里程碑弹幕`,
    "",
    `- 🎉 本篇新增 ${threshold} 字，稳稳推进！`,
    `- ✨ ${threshold} 字达成，节奏很好`,
    `- 🏅 里程碑 +${threshold}，继续冲`,
  ].join("\n");
}

function normalizeTextForCompare(content) {
  return `${content ?? ""}`.replace(/\r\n/g, "\n").trim();
}

const LEGACY_EXAMPLE_FILE_TEMPLATES = [
  {
    path: normalizePath(`${INPUT_FOLDER}/default-input.md`),
    expectedContent: getLegacyDefaultInputContent(),
  },
  {
    path: normalizePath(`${IDLE_FOLDER}/default-idle.md`),
    expectedContent: getLegacyDefaultIdleContent(),
  },
  {
    path: normalizePath(`${LEGACY_INPUT_FOLDER}/default-input.md`),
    expectedContent: getLegacyDefaultInputContent(),
  },
  {
    path: normalizePath(`${LEGACY_IDLE_FOLDER}/default-idle.md`),
    expectedContent: getLegacyDefaultIdleContent(),
  },
  ...LEGACY_MILESTONE_THRESHOLDS.flatMap((threshold) => [
    {
      path: normalizePath(`${MILESTONE_FOLDER}/${threshold}.md`),
      expectedContent: getLegacyDefaultMilestoneContent(threshold),
    },
    {
      path: normalizePath(`${LEGACY_MILESTONE_FOLDER}/${threshold}.md`),
      expectedContent: getLegacyDefaultMilestoneContent(threshold),
    },
  ]),
];

const DEFAULT_INPUT_FILE_TEMPLATES = [
  {
    path: normalizePath(`${INPUT_FOLDER}/观众入场-中文.md`),
    title: "观众入场",
    lines: [
      "📺 来了来了！前排兜售瓜子饮料矿泉水。",
      "🎬 每日追更，准时打卡。",
      "🪑 搬好小板凳，静静看主播码字。",
      "🐕 哈士奇观众已就位，并开始摇尾巴。",
      "👀 让我看看今天主播要写什么好东西。",
      "☕ 端着咖啡坐下了，主播慢慢写。",
      "🌙 深夜档观众+1，主打一个无声陪伴。",
    ],
  },
  {
    path: normalizePath(`${INPUT_FOLDER}/手速惊叹-中文.md`),
    title: "手速惊叹",
    lines: [
      "⌨️ 这手速，生产队的驴看了都递烟。",
      "💨 键盘冒烟了！主播赔我屏幕！",
      "📊 进度条在以肉眼可见的速度生长！",
      "⏱️ 刚才那一段，主播进入Zone了是吧？",
      "🔥 这波输出，建议直接刻进DNA。",
      "🚀 坐稳了，主播开始加速了。",
      "🎯 这节奏感，建议参加打字竞速赛。",
    ],
  },
  {
    path: normalizePath(`${INPUT_FOLDER}/迷妹打call-中文.md`),
    title: "迷妹打call",
    lines: [
      "🖼️ 截图干嘛，愣着啊！这段不得截下来当屏保？",
      "📱 这一段我先截为敬了。",
      "🏆 截屏了截屏了，这一段要裱起来挂书房。",
      "🎮 这波不是操作，是量子纠缠态下的命运共振！！！",
      "⚠️ 前方高能：人类已无法理解此文字！",
      "📺 新人都是怪物！写得这么猛？",
      "✨ 这一段有光，真的，我屏幕在闪。",
      "🎉 文曲星下凡辛苦了，喝口水继续。",
      "💫 建议开个写作班，我跪着听。",
    ],
  },
  {
    path: normalizePath(`${INPUT_FOLDER}/直播间神回复-中文.md`),
    title: "直播间神回复",
    lines: [
      "🐌 主播你这速度，我奶奶都比你……算了奶奶你坐下。",
      "💾 主播别删，刚才那段挺好的，我还没截图呢。",
      "📝 建议这段单独出一篇，我付费观看。",
      "🔙 刚才那个词用得太妙了，倒回去重看三遍。",
      "🧠 主播的脑回路，建议申遗。",
      "☕ 主播卡住了？正常，灵感在泡面，马上好。",
      "🛑 停！就停在这里！让观众抓心挠肝是吧？",
      "🎭 主播是懂断章的，我恨。",
    ],
  },
  {
    path: normalizePath(`${INPUT_FOLDER}/chat-arrives-en.md`),
    title: "Chat Arrives",
    lines: [
      "📺 I'm here! Don't mind me, just lurking and vibing.",
      "🎬 Daily check-in. Let's see what magic happens today.",
      "🪑 Got my snacks. Got my drink. Got my favorite writer.",
      "🐕 Husky viewer reporting for duty. Tail is wagging.",
      "👀 Quietly observing. This is my happy place.",
      "☕ Coffee in hand. Take your time, streamer.",
      "🌙 Night crew, assemble. Silence mode: ON.",
    ],
  },
  {
    path: normalizePath(`${INPUT_FOLDER}/speed-progress-hype-en.md`),
    title: "Speed & Progress Hype",
    lines: [
      "⌨️ This typing speed is actually insane.",
      "💨 Keyboard's gonna need a cooldown patch.",
      "📊 Progress bar is moving faster than my WiFi.",
      "⏱️ That was a flow state if I've ever seen one.",
      "🔥 Output levels: critical. Keyboard: in shambles.",
      "🚀 Prepare for liftoff. This draft is leaving orbit.",
      "🎯 The focus is so sharp I could cut myself reading.",
    ],
  },
  {
    path: normalizePath(`${INPUT_FOLDER}/hype-squad-en.md`),
    title: "Hype Squad",
    lines: [
      "🖼️ Screenshot that. This is wallpaper material.",
      "📱 I'm framing this paragraph. It's too good.",
      "🏆 Print it. Frame it. Hang it in the Louvre.",
      "🎮 This isn't writing. This is a critical hit on my emotions.",
      "⚠️ Warning: Unprecedented levels of prose detected.",
      "📺 Rookies are always terrifying. How are you this good?",
      "✨ My screen is glowing. Is that normal?",
      "🎉 The muse called. She said you're her favorite.",
      "💫 I'd take a masterclass from you. I'd fail, but I'd take it.",
    ],
  },
  {
    path: normalizePath(`${INPUT_FOLDER}/gremlin-chat-en.md`),
    title: "Gremlin Chat",
    lines: [
      "🐌 My grandmother types faster. Actually, no she doesn't. Go off.",
      "💾 Don't delete that. I wasn't done screenshotting.",
      "📝 This line right here? I'd pay for the extended cut.",
      "🔙 Hold on, let me reread that banger three more times.",
      "🧠 Your brain deserves its own zip code.",
      "☕ Stuck? It's fine. Inspiration is just microwaving leftovers.",
      "🛑 You're ending it THERE? You menace.",
      "🎭 Master of the cliffhanger. I respect it. I hate it. But I respect it.",
    ],
  },
];

const DEFAULT_IDLE_FILE_TEMPLATES = [
  {
    path: normalizePath(`${IDLE_FOLDER}/停顿陪伴-中文.md`),
    title: "停顿陪伴弹幕",
    lines: [
      "✨ 不着急，我们等你。又不是直播带货。",
      "🌙 夜深了，慢慢写，我们都在。",
      "💭 卡住了就卡住了，谁写东西不卡呢。",
      "☕ 我数到一百，主播不动我就去睡。一、二、一、二……",
      "❄️ 外面下着雨，这里你敲字，挺好。",
      "🐕 哈士奇趴下了，下巴搁在你脚上。",
      "🌲 雪原很静，适合停下来看看风景。",
      "🪑 椅子很稳，你也很稳。休息一会儿。",
      "🕯️ 光标在闪，你也还在。这就够了。",
      "🌿 不需要赶路，我们听会儿风。",
      "🧣 裹紧毯子，灵感会自己找上门的。",
      "⏳ 我有一整个晚上，不急。",
      "🐾 你的脚印已经够深了，歇歇。",
      "☁️ 发呆是写作的一部分，真的，不骗你。",
    ],
  },
  {
    path: normalizePath(`${IDLE_FOLDER}/idle-companion-en.md`),
    title: "Idle Companion Danmaku",
    lines: [
      "✨ No rush. This isn't a speedrun. We're just hanging out.",
      "🌙 Late night? Same. Write at your own pace.",
      "💭 Stuck is part of the process. We'll be here when it unsticks.",
      "☕ I'll count to ten. If you type, cool. If not, also cool.",
      "❄️ Rain outside. Words inside. Perfect balance.",
      "🐕 Husky is lying down. Chin on your foot. Waiting.",
      "🌲 The snowfield is quiet. Good place to pause.",
      "🪑 Your chair is steady. So are you. Take a breath.",
      "🕯️ Cursor blinks. You're still here. That's enough.",
      "🌿 No need to rush. Let's just listen to the wind.",
      "🧣 Wrapped up warm. Inspiration will find you.",
      "⏳ I've got all night. No hurry.",
      "🐾 You've left enough footprints for now. Rest.",
      "☁️ Daydreaming is part of writing. Seriously, it is.",
    ],
  },
];

const DEFAULT_MILESTONE_FILE_TEMPLATES = [
  {
    path: normalizePath(`${MILESTONE_FOLDER}/100-中文里程碑.md`),
    title: "100 字里程碑弹幕（中文）",
    lines: [
      "🎉 100字达成！今天你迈出了最棒的第一步！",
      "🏁 雪橇起步！第一个100字！",
      "🐕 嗷呜！100字！本哈为你摇旗！",
      "🦴 第一根骨头，稳稳拿下！",
      "🌟 三位数了！你已经正式出发了！",
      "📍 里程碑1/4，主播稳！",
    ],
  },
  {
    path: normalizePath(`${MILESTONE_FOLDER}/300-中文里程碑.md`),
    title: "300 字里程碑弹幕（中文）",
    lines: [
      "🎉 300字！节奏很稳，继续保持！",
      "🛷 雪橇开始加速了！",
      "⚡ 300字达成，你已经进入状态了！",
      "🌟 这片雪原上，已经留下你300个足迹！",
      "📈 进度条过半！主播开始发力了！",
      "💪 300字，今天的你已经赢了昨天的自己。",
    ],
  },
  {
    path: normalizePath(`${MILESTONE_FOLDER}/600-中文里程碑.md`),
    title: "600 字里程碑弹幕（中文）",
    lines: [
      "🏆 600字！你已经跑过半程了，太强了！",
      "🌕 月光下的雪原，你的足迹连成了一条线。",
      "💪 600字！今天的你，是雪原上的狼！",
      "🔥 篝火已经点燃，继续冲刺吧！",
      "🎯 距离1000字只差一个冲刺，主播冲！",
      "🏅 600字，这已经是一篇小作文的量了！",
    ],
  },
  {
    path: normalizePath(`${MILESTONE_FOLDER}/1000-中文里程碑.md`),
    title: "1000 字里程碑弹幕（中文）",
    lines: [
      "👑 1000字！今天你是雪原之王！",
      "🎊 嗷呜——！为你长嚎三声！一千字达成！",
      "🦴🦴🦴 三根骨头，全是你的！",
      "🐕✨ 本哈宣布：今日MVP就是你！",
      "🗻 你翻过了今天最高的那座山。",
      "🎇 全场起立！致敬千字主播！",
      "🍾 开香槟！今天值得庆祝！",
      "📜 这一千字，将被载入直播间史册。",
    ],
  },
  {
    path: normalizePath(`${MILESTONE_FOLDER}/100-milestone-en.md`),
    title: "100 Word Milestone Danmaku",
    lines: [
      "🎉 100 words! The first step is always the hardest, and you nailed it.",
      "🏁 The sled is moving! First 100 down.",
      "🐕 Awoo! 100 words! I'm wagging for you!",
      "🦴 First bone secured!",
      "🌟 Triple digits! You're officially on the trail.",
      "📍 Milestone 1/4. Steady.",
    ],
  },
  {
    path: normalizePath(`${MILESTONE_FOLDER}/300-milestone-en.md`),
    title: "300 Word Milestone Danmaku",
    lines: [
      "🎉 300 words! You've found your rhythm.",
      "🛷 The sled is picking up speed!",
      "⚡ 300 words down. You're in the zone.",
      "🌟 300 footprints across the snowfield.",
      "📈 Halfway to the big one! Keep that momentum.",
      "💪 300 words. Today's you already beat yesterday's you.",
    ],
  },
  {
    path: normalizePath(`${MILESTONE_FOLDER}/600-milestone-en.md`),
    title: "600 Word Milestone Danmaku",
    lines: [
      "🏆 600 words! You're over halfway. Tremendous!",
      "🌕 Moonlight on the snowfield. Your footprints form a line.",
      "💪 600 words! Today, you're the wolf of the tundra.",
      "🔥 The campfire is lit. Keep charging!",
      "🎯 One sprint left to 1000. You got this.",
      "🏅 600 words is a solid essay. Just saying.",
    ],
  },
  {
    path: normalizePath(`${MILESTONE_FOLDER}/1000-milestone-en.md`),
    title: "1000 Word Milestone Danmaku",
    lines: [
      "👑 1000 words! You are the King/Queen of the Tundra today!",
      "🎊 Awooo! A thousand words! I'm howling for you!",
      "🦴🦴🦴 Three bones. All yours.",
      "🐕✨ This husky declares: You're today's MVP!",
      "🗻 You climbed the highest peak of the day.",
      "🎇 Everyone stand up! Respect the 1k streamer!",
      "🍾 Pop the champagne! Today deserves a toast.",
      "📜 This thousand words will go down in stream history.",
    ],
  },
];

const INPUT_THROTTLE_MS = 120;
const IDLE_THRESHOLD_MS = 5000;
const IDLE_EMIT_INTERVAL_MS = 6500;
const MAX_ACTIVE_DANMAKU = 18;
const MAX_SINGLE_INPUT_DELTA = 40;
const LIBRARY_RELOAD_DEBOUNCE_MS = 300;
const MIN_INPUT_DELTA_TO_EMIT = 6;
const LIBRARY_BOOTSTRAP_VERSION = 1;
const LEGACY_EXAMPLE_CLEANUP_VERSION = 1;

const DEFAULT_PLUGIN_DATA = Object.freeze({
  libraryBootstrapVersion: 0,
  legacyExampleCleanupVersion: 0,
});

function normalizePluginData(data) {
  const normalizeVersion = (value) => {
    if (!Number.isFinite(value)) {
      return 0;
    }

    const version = Math.floor(value);
    return version > 0 ? version : 0;
  };

  return {
    libraryBootstrapVersion: normalizeVersion(data?.libraryBootstrapVersion),
    legacyExampleCleanupVersion: normalizeVersion(data?.legacyExampleCleanupVersion),
  };
}

class DanmakuSidebarView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return "直播弹幕";
  }

  getIcon() {
    return CUSTOM_ICON_ID;
  }

  async onOpen() {
    const container = this.contentEl;
    container.empty();
    container.addClass("live-danmaku-container");

    this.plugin.danmakuContainer = container.createDiv({
      cls: "danmaku-container",
    });

    this.plugin.emptyStateEl = container.createDiv({
      cls: "danmaku-empty-state is-hidden",
    });

    this.plugin.active = true;
    this.plugin.refreshEmptyState();
  }

  async onClose() {
    this.plugin.active = false;
    this.plugin.danmakuContainer = null;
    this.plugin.emptyStateEl = null;
    this.contentEl.empty();
  }
}

module.exports = class LiveDanmakuPlugin extends Plugin {
  async onload() {
    this.resetRuntimeState();
    await this.loadPluginData();

    try {
      addIcon(CUSTOM_ICON_ID, CUSTOM_ICON_SVG);
    } catch (error) {
      console.warn("[Live Danmaku Sidebar] Failed to register custom icon", error);
    }

    this.registerView(
      VIEW_TYPE,
      (leaf) => new DanmakuSidebarView(leaf, this)
    );

    this.addRibbonIcon(CUSTOM_ICON_ID, "打开直播弹幕栏", async () => {
      await this.activateView();
    });

    this.addCommand({
      id: "open-live-danmaku-sidebar",
      name: "打开直播弹幕侧边栏",
      callback: async () => {
        await this.activateView();
      },
    });

    this.addCommand({
      id: "reload-live-danmaku-library",
      name: "重新加载弹幕库",
      callback: async () => {
        await this.reloadDanmakuLibrary(true);
      },
    });

    this.addCommand({
      id: "bootstrap-default-live-danmaku-library",
      name: "手动补全默认弹幕库（仅补缺失）",
      callback: async () => {
        await this.bootstrapDanmakuLibraryByCommand();
      },
    });

    this.registerEvent(
      this.app.workspace.on("editor-change", (editor, view) => {
        this.onEditorChange(editor, view);
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        this.onFileOpen(file);
      })
    );

    this.registerEvent(
      this.app.vault.on("create", (file) => {
        this.onLibraryFileChanged(file?.path);
      })
    );

    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        this.onLibraryFileChanged(file?.path);
      })
    );

    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        this.onLibraryFileChanged(file?.path);
      })
    );

    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        this.onLibraryFileChanged(file?.path);
        this.onLibraryFileChanged(oldPath);
      })
    );

    this.app.workspace.onLayoutReady(() => {
      this.safeInitializeAfterLayout();
    });
  }

  async safeInitializeAfterLayout() {
    try {
      let shouldSavePluginData = false;
      const startupMessages = [];

      if (this.pluginData.libraryBootstrapVersion < LIBRARY_BOOTSTRAP_VERSION) {
        const createdExampleFiles = await this.ensureDanmakuLibrary();
        this.pluginData.libraryBootstrapVersion = LIBRARY_BOOTSTRAP_VERSION;
        shouldSavePluginData = true;

        if (createdExampleFiles) {
          startupMessages.push(`已创建示例弹幕库：${DANMAKU_ROOT}`);
        }
      }

      if (
        this.pluginData.legacyExampleCleanupVersion < LEGACY_EXAMPLE_CLEANUP_VERSION
      ) {
        const removedLegacyFiles = await this.cleanupLegacyExampleFiles();
        this.pluginData.legacyExampleCleanupVersion = LEGACY_EXAMPLE_CLEANUP_VERSION;
        shouldSavePluginData = true;

        if (removedLegacyFiles.length > 0) {
          startupMessages.push(`已清理旧示例文件 ${removedLegacyFiles.length} 个`);
        }
      }

      if (shouldSavePluginData) {
        await this.savePluginData();
      }

      await this.reloadDanmakuLibrary(false);
      this.startIdleLoop();

      if (startupMessages.length > 0) {
        new Notice(startupMessages.join("；"));
      }
    } catch (error) {
      console.error("[Live Danmaku Sidebar] Initialization failed", error);
      new Notice("Live Danmaku Sidebar 初始化失败，请稍后重试");
    }
  }

  async loadPluginData() {
    try {
      const data = await this.loadData();
      this.pluginData = normalizePluginData(data);
    } catch (error) {
      console.warn("[Live Danmaku Sidebar] Failed to load plugin data", error);
      this.pluginData = { ...DEFAULT_PLUGIN_DATA };
    }
  }

  async savePluginData() {
    await this.saveData(this.pluginData);
  }

  async bootstrapDanmakuLibraryByCommand() {
    try {
      const createdSomething = await this.ensureDanmakuLibrary();

      if (this.pluginData.libraryBootstrapVersion < LIBRARY_BOOTSTRAP_VERSION) {
        this.pluginData.libraryBootstrapVersion = LIBRARY_BOOTSTRAP_VERSION;
        await this.savePluginData();
      }

      await this.reloadDanmakuLibrary(false);

      if (createdSomething) {
        new Notice(`已补全默认弹幕库缺失文件：${DANMAKU_ROOT}`);
      } else {
        new Notice("默认弹幕库已完整，无需补全");
      }
    } catch (error) {
      console.error(
        "[Live Danmaku Sidebar] Failed to bootstrap danmaku library manually",
        error
      );
      new Notice("补全默认弹幕库失败，请稍后重试");
    }
  }

  resetRuntimeState() {
    this.active = false;
    this.danmakuList = [];
    this.idleDanmakuList = [];
    this.milestoneDanmakuMap = new Map();
    this.sortedMilestoneThresholds = [];
    this.lastEffectiveInputTime = Date.now();
    this.lastIdleDanmakuTime = 0;
    this.isIdle = true;
    this.danmakuContainer = null;
    this.emptyStateEl = null;
    this.inputTimer = null;
    this.idleTimer = null;
    this.libraryReloadTimer = null;
    this.lastTrackedFilePath = null;
    this.lastTrackedLength = null;
    this.lastDanmakuText = null;
    this.pendingInputDelta = 0;
    this.sessionFilePath = null;
    this.sessionAddedChars = 0;
    this.sessionTriggeredMilestones = new Set();
    this.pluginData = { ...DEFAULT_PLUGIN_DATA };
  }

  async onunload() {
    if (this.inputTimer) {
      window.clearTimeout(this.inputTimer);
      this.inputTimer = null;
    }

    if (this.idleTimer) {
      window.clearInterval(this.idleTimer);
      this.idleTimer = null;
    }

    if (this.libraryReloadTimer) {
      window.clearTimeout(this.libraryReloadTimer);
      this.libraryReloadTimer = null;
    }

    this.active = false;
    this.danmakuContainer = null;
    this.emptyStateEl = null;

    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];

    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({
        type: VIEW_TYPE,
        active: true,
      });
    }

    await workspace.revealLeaf(leaf);
  }

  async ensureDanmakuLibrary() {
    let createdSomething = false;

    createdSomething = (await this.ensureFolder(DANMAKU_ROOT)) || createdSomething;
    createdSomething = (await this.ensureFolder(INPUT_FOLDER)) || createdSomething;
    createdSomething = (await this.ensureFolder(IDLE_FOLDER)) || createdSomething;
    createdSomething = (await this.ensureFolder(MILESTONE_FOLDER)) || createdSomething;

    for (const item of DEFAULT_INPUT_FILE_TEMPLATES) {
      createdSomething =
        (await this.ensureFile(item.path, this.getDefaultTemplateFileContent(item))) ||
        createdSomething;
    }

    for (const item of DEFAULT_IDLE_FILE_TEMPLATES) {
      createdSomething =
        (await this.ensureFile(item.path, this.getDefaultTemplateFileContent(item))) ||
        createdSomething;
    }

    for (const item of DEFAULT_MILESTONE_FILE_TEMPLATES) {
      createdSomething =
        (await this.ensureFile(item.path, this.getDefaultTemplateFileContent(item))) ||
        createdSomething;
    }

    return createdSomething;
  }

  async ensureFolder(path) {
    const normalizedPath = normalizePath(path);

    if (this.app.vault.getAbstractFileByPath(normalizedPath)) {
      return false;
    }

    const parts = normalizedPath.split("/");
    let currentPath = "";

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!this.app.vault.getAbstractFileByPath(currentPath)) {
        try {
          await this.app.vault.createFolder(currentPath);
        } catch (error) {
          if (!this.app.vault.getAbstractFileByPath(currentPath)) {
            throw error;
          }
        }
      }
    }

    return true;
  }

  async ensureFile(path, content) {
    const normalizedPath = normalizePath(path);

    if (this.app.vault.getAbstractFileByPath(normalizedPath)) {
      return false;
    }

    const lastSlashIndex = normalizedPath.lastIndexOf("/");
    const parentFolder =
      lastSlashIndex === -1 ? "" : normalizedPath.slice(0, lastSlashIndex);

    if (parentFolder) {
      await this.ensureFolder(parentFolder);
    }

    try {
      await this.app.vault.create(normalizedPath, content);
    } catch (error) {
      if (!this.app.vault.getAbstractFileByPath(normalizedPath)) {
        throw error;
      }

      return false;
    }

    return true;
  }

  async cleanupLegacyExampleFiles() {
    const removedPaths = [];

    for (const item of LEGACY_EXAMPLE_FILE_TEMPLATES) {
      const path = item.path;
      const file = this.app.vault.getAbstractFileByPath(path);

      if (!(file instanceof TFile)) {
        continue;
      }

      let content = "";

      try {
        content = await this.app.vault.read(file);
      } catch (error) {
        console.warn(
          "[Live Danmaku Sidebar] Failed to read legacy example file during cleanup",
          path,
          error
        );
        continue;
      }

      if (
        normalizeTextForCompare(content) !==
        normalizeTextForCompare(item.expectedContent)
      ) {
        continue;
      }

      try {
        if (typeof this.app.vault.trash === "function") {
          await this.app.vault.trash(file, false);
        } else {
          await this.app.vault.delete(file);
        }

        removedPaths.push(path);
      } catch (error) {
        console.warn(
          "[Live Danmaku Sidebar] Failed to cleanup legacy example file",
          path,
          error
        );
      }
    }

    return removedPaths;
  }

  getDefaultTemplateFileContent(template) {
    const title = template?.title ? `# ${template.title}` : "# 弹幕";
    const lines = Array.isArray(template?.lines)
      ? template.lines
          .map((line) => `${line ?? ""}`.trim().replace(/^[-*+]\s+/, ""))
          .filter((line) => line.length > 0)
      : [];

    if (lines.length === 0) {
      return [title, "", "- 在这里填写你的弹幕"].join("\n");
    }

    return [title, "", ...lines.map((line) => `- ${line}`)].join("\n");
  }

  onLibraryFileChanged(path) {
    if (!this.isDanmakuPath(path)) {
      return;
    }

    this.scheduleDanmakuLibraryReload();
  }

  isDanmakuPath(path) {
    if (!path) {
      return false;
    }

    const normalizedPath = normalizePath(path);
    const watchedFolders = [
      ...DANMAKU_INPUT_FOLDERS,
      ...DANMAKU_IDLE_FOLDERS,
      ...DANMAKU_MILESTONE_FOLDERS,
    ];

    return (
      normalizedPath === DANMAKU_ROOT ||
      normalizedPath === LEGACY_DANMAKU_ROOT ||
      watchedFolders.some(
        (folder) =>
          normalizedPath === folder || normalizedPath.startsWith(`${folder}/`)
      )
    );
  }

  collectDanmakuFilesByFolders(markdownFiles, folders) {
    return markdownFiles
      .filter((file) => folders.some((folder) => file.path.startsWith(`${folder}/`)))
      .sort((a, b) => a.path.localeCompare(b.path, "zh-CN"));
  }

  scheduleDanmakuLibraryReload() {
    if (this.libraryReloadTimer) {
      window.clearTimeout(this.libraryReloadTimer);
    }

    this.libraryReloadTimer = window.setTimeout(async () => {
      this.libraryReloadTimer = null;
      await this.reloadDanmakuLibrary(false);
    }, LIBRARY_RELOAD_DEBOUNCE_MS);
  }

  async reloadDanmakuLibrary(showNotice) {
    const markdownFiles = this.app.vault
      .getMarkdownFiles()
      .filter((file) => file instanceof TFile);

    const inputFiles = this.collectDanmakuFilesByFolders(markdownFiles, DANMAKU_INPUT_FOLDERS);
    const idleFiles = this.collectDanmakuFilesByFolders(markdownFiles, DANMAKU_IDLE_FOLDERS);
    const milestoneFiles = this.collectDanmakuFilesByFolders(
      markdownFiles,
      DANMAKU_MILESTONE_FOLDERS
    );

    this.danmakuList = await this.readDanmakuLinesFromFiles(inputFiles);
    this.idleDanmakuList = await this.readDanmakuLinesFromFiles(idleFiles);
    this.milestoneDanmakuMap = await this.readMilestoneDanmakuMap(milestoneFiles);
    this.sortedMilestoneThresholds = Array.from(this.milestoneDanmakuMap.keys()).sort(
      (a, b) => a - b
    );

    this.refreshEmptyState();

    if (showNotice) {
      const milestoneCount = this.sortedMilestoneThresholds.length;
      new Notice(
        `弹幕库已刷新：输入 ${this.danmakuList.length} 条，停顿 ${this.idleDanmakuList.length} 条，里程碑 ${milestoneCount} 组`
      );
    }
  }

  async readDanmakuLinesFromFiles(files) {
    const lines = [];

    for (const file of files) {
      try {
        const content = await this.app.vault.read(file);
        lines.push(...this.extractDanmakuLines(content));
      } catch (error) {
        console.warn("[Live Danmaku Sidebar] Failed to read danmaku file", file.path, error);
      }
    }

    return lines;
  }

  async readMilestoneDanmakuMap(files) {
    const map = new Map();

    for (const file of files) {
      const threshold = this.parseMilestoneThresholdFromFilePath(file.path);

      if (!threshold) {
        continue;
      }

      try {
        const content = await this.app.vault.read(file);
        const lines = this.extractDanmakuLines(content);

        if (lines.length === 0) {
          continue;
        }

        const existing = map.get(threshold) ?? [];
        existing.push(...lines);
        map.set(threshold, existing);
      } catch (error) {
        console.warn(
          "[Live Danmaku Sidebar] Failed to read milestone file",
          file.path,
          error
        );
      }
    }

    return map;
  }

  parseMilestoneThresholdFromFilePath(path) {
    if (!path) {
      return null;
    }

    const normalizedPath = normalizePath(path);
    const fileName = normalizedPath.split("/").pop() || "";
    const rawName = fileName.replace(/\.md$/i, "");
    const matched = rawName.match(/^(\d+)/);

    if (!matched) {
      return null;
    }

    const threshold = Number.parseInt(matched[1], 10);

    if (!Number.isFinite(threshold) || threshold <= 0) {
      return null;
    }

    return threshold;
  }

  extractDanmakuLines(content) {
    const result = [];
    const lines = content.split(/\r?\n/);
    let inFrontmatter = false;
    let inCodeFence = false;

    for (let index = 0; index < lines.length; index += 1) {
      let line = lines[index].trim();

      if (index === 0 && line === "---") {
        inFrontmatter = true;
        continue;
      }

      if (inFrontmatter) {
        if (line === "---") {
          inFrontmatter = false;
        }

        continue;
      }

      if (line.startsWith("```")) {
        inCodeFence = !inCodeFence;
        continue;
      }

      if (inCodeFence || !line) {
        continue;
      }

      if (line.startsWith("#") || line.startsWith(">") || line.startsWith("<!--")) {
        continue;
      }

      line = line
        .replace(/^[-*+]\s+\[[ xX]\]\s+/, "")
        .replace(/^[-*+]\s+/, "")
        .replace(/^\d+[.)]\s+/, "")
        .trim();

      if (line) {
        result.push(line);
      }
    }

    return result;
  }

  refreshEmptyState() {
    if (!this.emptyStateEl) {
      return;
    }

    const milestoneDanmakuTotal = this.getMilestoneDanmakuTotalCount();
    const hasDanmaku =
      this.danmakuList.length > 0 ||
      this.idleDanmakuList.length > 0 ||
      milestoneDanmakuTotal > 0;

    if (hasDanmaku) {
      this.emptyStateEl.classList.add("is-hidden");
      this.emptyStateEl.setText("");
      return;
    }

    this.emptyStateEl.classList.remove("is-hidden");
    this.emptyStateEl.setText(
      `未检测到弹幕内容。\n\n请把 Markdown 文件放入：\n${INPUT_FOLDER}\n${IDLE_FOLDER}\n${MILESTONE_FOLDER}\n\n里程碑文件名请以数字开头（如 100.md、100-中文里程碑.md）。\n支持普通文本或 Markdown 列表，每行一条弹幕。`
    );
  }

  getMilestoneDanmakuTotalCount() {
    let total = 0;

    for (const lines of this.milestoneDanmakuMap.values()) {
      total += lines.length;
    }

    return total;
  }

  onFileOpen(file) {
    if (!(file instanceof TFile)) {
      this.sessionFilePath = null;
      this.sessionAddedChars = 0;
      this.pendingInputDelta = 0;
      this.sessionTriggeredMilestones = new Set();
      this.lastTrackedFilePath = null;
      this.lastTrackedLength = null;
      return;
    }

    if (this.sessionFilePath !== file.path) {
      this.beginSessionForFile(file.path);
    }

    this.lastTrackedFilePath = file.path;
    this.lastTrackedLength = null;
  }

  beginSessionForFile(filePath) {
    this.sessionFilePath = filePath;
    this.sessionAddedChars = 0;
    this.pendingInputDelta = 0;
    this.sessionTriggeredMilestones = new Set();
  }

  onEditorChange(editor, view) {
    if (!editor || !view || !view.file) {
      return;
    }

    const filePath = view.file.path;
    const currentLength = editor.getValue().length;

    if (this.sessionFilePath !== filePath) {
      this.beginSessionForFile(filePath);
    }

    if (this.lastTrackedFilePath !== filePath || this.lastTrackedLength == null) {
      this.lastTrackedFilePath = filePath;
      this.lastTrackedLength = currentLength;
      return;
    }

    const delta = currentLength - (this.lastTrackedLength ?? currentLength);
    this.lastTrackedLength = currentLength;

    if (delta <= 0 || delta > MAX_SINGLE_INPUT_DELTA) {
      return;
    }

    this.sessionAddedChars += delta;
    this.pendingInputDelta += delta;
    this.tryFireMilestoneDanmaku();

    this.lastEffectiveInputTime = Date.now();
    this.isIdle = false;

    if (this.pendingInputDelta < MIN_INPUT_DELTA_TO_EMIT) {
      return;
    }

    if (this.inputTimer) {
      return;
    }

    this.inputTimer = window.setTimeout(() => {
      if (this.pendingInputDelta >= MIN_INPUT_DELTA_TO_EMIT) {
        this.fireRandomDanmaku(this.danmakuList, { variant: "input" });
      }

      this.pendingInputDelta = 0;
      this.inputTimer = null;
    }, INPUT_THROTTLE_MS);
  }

  tryFireMilestoneDanmaku() {
    if (this.sortedMilestoneThresholds.length === 0) {
      return;
    }

    let latestReachedThreshold = null;

    for (const threshold of this.sortedMilestoneThresholds) {
      if (this.sessionAddedChars < threshold) {
        break;
      }

      if (this.sessionTriggeredMilestones.has(threshold)) {
        continue;
      }

      this.sessionTriggeredMilestones.add(threshold);
      latestReachedThreshold = threshold;
    }

    if (latestReachedThreshold == null) {
      return;
    }

    const pool = this.milestoneDanmakuMap.get(latestReachedThreshold) ?? [
      `🎉 本篇新增 ${latestReachedThreshold} 字，里程碑达成！`,
    ];

    this.fireRandomDanmaku(pool, {
      variant: "milestone",
      badge: `${latestReachedThreshold} 字`,
      lifetimeMs: 5600,
    });
  }

  startIdleLoop() {
    if (this.idleTimer) {
      window.clearInterval(this.idleTimer);
    }

    this.idleTimer = window.setInterval(() => {
      const now = Date.now();
      const idleDuration = now - this.lastEffectiveInputTime;

      if (idleDuration >= IDLE_THRESHOLD_MS) {
        this.isIdle = true;
      }

      if (
        this.isIdle &&
        idleDuration >= IDLE_THRESHOLD_MS &&
        now - this.lastIdleDanmakuTime >= IDLE_EMIT_INTERVAL_MS
      ) {
        this.fireRandomDanmaku(this.idleDanmakuList, { variant: "idle" });
        this.lastIdleDanmakuTime = now;
      }
    }, 1000);
  }

  fireRandomDanmaku(pool, options = {}) {
    if (!this.active || !this.danmakuContainer) {
      return;
    }

    if (!Array.isArray(pool) || pool.length === 0) {
      return;
    }

    let text = pool[Math.floor(Math.random() * pool.length)];

    if (pool.length > 1) {
      let guard = 0;

      while (text === this.lastDanmakuText && guard < 5) {
        text = pool[Math.floor(Math.random() * pool.length)];
        guard += 1;
      }
    }

    this.lastDanmakuText = text;
    this.spawnDanmaku(text, options);
  }

  spawnDanmaku(text, options = {}) {
    if (!this.danmakuContainer || !this.danmakuContainer.isConnected) {
      return;
    }

    while (this.danmakuContainer.childElementCount >= MAX_ACTIVE_DANMAKU) {
      this.danmakuContainer.firstElementChild?.remove();
    }

    const variant = options.variant || "input";
    const animationClass =
      variant === "milestone" ? "danmaku-animate--milestone" : "danmaku-animate";
    const lifetimeMs =
      Number.isFinite(options.lifetimeMs) && options.lifetimeMs > 0
        ? options.lifetimeMs
        : variant === "milestone"
          ? 5600
          : 4500;

    const el = document.createElement("div");
    el.className = `danmaku-item danmaku-item--${variant}`;
    el.textContent = text;
    el.style.setProperty("--danmaku-offset-x", `${Math.round((Math.random() - 0.5) * 16)}px`);

    if (options.badge) {
      el.setAttribute("data-badge", options.badge);
    }

    this.danmakuContainer.appendChild(el);

    window.setTimeout(() => {
      if (el.isConnected) {
        el.classList.add(animationClass);
      }
    }, 10);

    window.setTimeout(() => {
      el.remove();
    }, lifetimeMs);
  }
};