type UiLanguage = "zh" | "en";

const storageKey = "kallen-ui-language";

const copy = {
  zh: {
    locale: "zh-CN",
    currentLanguage: "中文",
    switchLanguage: "切换到英文界面",
    subtitle: "关于后端系统、云原生交付、企业集成与 AI 应用的工程笔记。",
    footerIntro: "构建可靠的系统，沉淀有用的技术记录。",
    darkMode: "暗色模式",
    toggleMenu: "切换菜单",
    menu: {
      "/": "首页",
      "/posts/": "文章",
      "/projects/": "项目",
      "/about/": "关于",
      "/archives/": "时间线",
      "/search/": "搜索",
    },
    pages: {
      "/posts/": ["文章", "记录架构、实现细节、故障模式与工程取舍。"],
      "/projects/": ["项目", "精选工程项目及其背后的实践经验。"],
      "/about/": ["关于", "关注可靠系统与工程实践的软件工程师。"],
      "/archives/": ["归档", "按时间整理的全部已发布文章。"],
      "/search/": ["搜索", "按标题与正文搜索文章。"],
      "/categories/": ["分类", ""],
      "/tags/": ["标签", ""],
    },
    search: "搜索",
    searchPlaceholder: "输入关键词...",
    archives: "归档",
    categories: "分类",
    tags: "标签云",
    toc: "目录",
    section: "章节",
    related: "相关文章",
    lastUpdated: "最后更新于",
    copyCode: "复制",
    copiedCode: "已复制！",
    notFound: "404 错误",
    notFoundSubtitle: "页面不存在",
    resultTemplate: "#PAGES_COUNT 个结果（用时 #TIME_SECONDS 秒）",
  },
  en: {
    locale: "en-US",
    currentLanguage: "English",
    switchLanguage: "Switch to Chinese interface",
    subtitle: "Engineering notes on backend systems, cloud-native delivery, enterprise integration, and applied AI.",
    footerIntro: "Building reliable systems, one useful note at a time.",
    darkMode: "Dark mode",
    toggleMenu: "Toggle menu",
    menu: {
      "/": "Home",
      "/posts/": "Writing",
      "/projects/": "Projects",
      "/about/": "About",
      "/archives/": "Timeline",
      "/search/": "Search",
    },
    pages: {
      "/posts/": ["Writing", "Architecture, implementation details, failure modes, and engineering trade-offs."],
      "/projects/": ["Projects", "Selected engineering work and the lessons behind it."],
      "/about/": ["About", "Software engineer focused on reliable systems and practical delivery."],
      "/archives/": ["Archive", "All published articles, organized by date."],
      "/search/": ["Search", "Search articles by title and content."],
      "/categories/": ["Categories", ""],
      "/tags/": ["Tags", ""],
    },
    search: "Search",
    searchPlaceholder: "Type something...",
    archives: "Archives",
    categories: "Categories",
    tags: "Tags",
    toc: "Table of contents",
    section: "Section",
    related: "Related content",
    lastUpdated: "Last updated on",
    copyCode: "Copy",
    copiedCode: "Copied!",
    notFound: "Not Found",
    notFoundSubtitle: "This page does not exist",
    resultTemplate: "#PAGES_COUNT pages (#TIME_SECONDS seconds)",
  },
} as const;

let activeLanguage: UiLanguage = "zh";

function normalizedPath(value: string): string {
  const path = new URL(value, window.location.origin).pathname;
  return path === "/" ? path : `${path.replace(/\/+$/, "")}/`;
}

function setText(element: Element | null, value: string): void {
  if (element && element.textContent !== value) element.textContent = value;
}

function pageCount(value: string, language: UiLanguage): string | null {
  const match = value.match(/(\d+)/);
  if (!match || !/(页面|pages?|page)/i.test(value)) return null;
  const count = Number(match[1]);
  if (language === "zh") return `${count} 个页面`;
  return `${count} ${count === 1 ? "page" : "pages"}`;
}

function formatDate(value: string, language: UiLanguage): string {
  return new Intl.DateTimeFormat(copy[language].locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

function ensureLanguageToggle(): HTMLButtonElement {
  let item = document.querySelector<HTMLElement>("#ui-language-toggle");
  if (!item) {
    item = document.createElement("li");
    item.id = "ui-language-toggle";
    item.innerHTML = `
      <button type="button">
        <span class="language-mark" aria-hidden="true">文</span>
        <span class="language-label"></span>
      </button>`;
    const darkMode = document.querySelector("#dark-mode-toggle");
    darkMode?.parentElement?.insertBefore(item, darkMode);
    item.querySelector("button")?.addEventListener("click", () => {
      applyLanguage(activeLanguage === "zh" ? "en" : "zh", true);
    });
  }
  return item.querySelector("button") as HTMLButtonElement;
}

function translateNavigation(language: UiLanguage): void {
  const strings = copy[language];
  setText(document.querySelector(".site-description"), strings.subtitle);
  document.querySelectorAll<HTMLAnchorElement>("#main-menu > li:not(.menu-bottom-section) > a").forEach((link) => {
    const label = strings.menu[normalizedPath(link.href) as keyof typeof strings.menu];
    if (label) setText(link.querySelector("span"), label);
  });

  setText(document.querySelector("#dark-mode-toggle span"), strings.darkMode);
  document.querySelector("#toggle-menu")?.setAttribute("aria-label", strings.toggleMenu);

  const languageButton = ensureLanguageToggle();
  languageButton.title = strings.switchLanguage;
  languageButton.setAttribute("aria-label", strings.switchLanguage);
  setText(languageButton.querySelector(".language-label"), strings.currentLanguage);
}

function translateWidgets(language: UiLanguage): void {
  const strings = copy[language];
  document.querySelectorAll<HTMLElement>(".search-form").forEach((form) => {
    setText(form.querySelector("label"), strings.search);
    const input = form.querySelector<HTMLInputElement>("input");
    if (input) input.placeholder = strings.searchPlaceholder;
    form.querySelector("button")?.setAttribute("title", strings.search);
  });

  document.querySelectorAll<HTMLElement>(".widget .section-title").forEach((title) => {
    const link = title.querySelector<HTMLAnchorElement>("a");
    const path = link ? normalizedPath(link.href) : "";
    if (path === "/archives/") setText(link, strings.archives);
    else if (path === "/categories/") setText(link, strings.categories);
    else if (path === "/tags/") setText(link, strings.tags);
    else if (title.closest(".widget")?.querySelector(".widget--toc")) setText(title, strings.toc);
  });
}

function translatePageChrome(language: UiLanguage): void {
  const strings = copy[language];
  const path = normalizedPath(window.location.pathname);
  const page = strings.pages[path as keyof typeof strings.pages];

  if (page) {
    const [title, description] = page;
    setText(document.querySelector("main .section-term"), title);
    if (path === "/about/" || path === "/projects/") {
      setText(document.querySelector("main .main-article .article-title a"), title);
      if (description) setText(document.querySelector("main .main-article .article-subtitle"), description);
    }
    document.title = `${title} | Kallen Wang`;
  } else if (path === "/") {
    document.title = "Kallen Wang";
  }

  document.querySelectorAll<HTMLElement>(".section-count, .article-description").forEach((element) => {
    const translated = pageCount(element.textContent || "", language);
    if (translated) setText(element, translated);
  });

  document.querySelectorAll<HTMLElement>("main > header > .section-title").forEach((title) => {
    setText(title, path === "/archives/" ? strings.categories : strings.section);
  });

  setText(document.querySelector(".article-toc-title span"), strings.toc);
  setText(document.querySelector(".related-content .section-title"), strings.related);

  const articleTitle = document.querySelector("main .article-title");
  const articleSubtitle = document.querySelector("main .article-subtitle");
  if (/404 错误|Not Found/.test(articleTitle?.textContent || "")) {
    setText(articleTitle, strings.notFound);
    setText(articleSubtitle, strings.notFoundSubtitle);
  }
}

function translateArticleMetadata(language: UiLanguage): void {
  const strings = copy[language];
  document.querySelectorAll<HTMLTimeElement>("time[datetime]").forEach((time) => {
    setText(time, formatDate(time.dateTime, language));
  });

  document.querySelectorAll<HTMLElement>(".article-time--reading").forEach((time) => {
    const saved = time.dataset.minutes;
    const minutes = saved ? Number(saved) : Number((time.textContent || "").match(/\d+/)?.[0] || 0);
    time.dataset.minutes = String(minutes);
    setText(time, language === "zh" ? `阅读时长：${minutes} 分钟` : `${minutes} minute${minutes === 1 ? "" : "s"} read`);
  });

  const lastModified = document.querySelector<HTMLMetaElement>('meta[property="article:modified_time"]')?.content;
  if (lastModified) {
    setText(
      document.querySelector(".article-lastmod span"),
      `${strings.lastUpdated} ${formatDate(lastModified, language)}`,
    );
  }

  document.querySelectorAll<HTMLButtonElement>(".copyCodeButton").forEach((button) => {
    const wasCopied = /已复制|Copied/.test(button.textContent || "");
    setText(button, wasCopied ? strings.copiedCode : strings.copyCode);
  });
}

function translateFooter(language: UiLanguage): void {
  const strings = copy[language];
  const footer = document.querySelector<HTMLElement>(".site-footer .powerby");
  if (!footer) return;
  const html = language === "zh"
    ? `${strings.footerIntro}<br>使用 <a href="https://gohugo.io/" target="_blank" rel="noopener">Hugo</a> 构建<br>主题 <b><a href="https://github.com/CaiJimmy/hugo-theme-stack" target="_blank" rel="noopener" data-version="4.0.3">Stack</a></b> 由 <a href="https://jimmycai.com" target="_blank" rel="noopener">Jimmy</a> 设计`
    : `${strings.footerIntro}<br>Built with <a href="https://gohugo.io/" target="_blank" rel="noopener">Hugo</a><br>Theme <b><a href="https://github.com/CaiJimmy/hugo-theme-stack" target="_blank" rel="noopener" data-version="4.0.3">Stack</a></b> designed by <a href="https://jimmycai.com" target="_blank" rel="noopener">Jimmy</a>`;
  if (footer.innerHTML !== html) footer.innerHTML = html;
}

function applyLanguage(language: UiLanguage, persist = false): void {
  activeLanguage = language;
  document.documentElement.lang = copy[language].locale;
  translateNavigation(language);
  translateWidgets(language);
  translatePageChrome(language);
  translateArticleMetadata(language);
  translateFooter(language);
  window.searchResultTitleTemplate = copy[language].resultTemplate;
  if (persist) {
    try { window.localStorage.setItem(storageKey, language); } catch (_) { /* Storage may be unavailable. */ }
  }
}

try {
  const saved = window.localStorage.getItem(storageKey);
  if (saved === "en" || saved === "zh") activeLanguage = saved;
} catch (_) { /* Keep the default language. */ }

applyLanguage(activeLanguage);

let translationQueued = false;
new MutationObserver(() => {
  if (translationQueued) return;
  translationQueued = true;
  window.requestAnimationFrame(() => {
    translationQueued = false;
    translateWidgets(activeLanguage);
    translatePageChrome(activeLanguage);
    translateArticleMetadata(activeLanguage);
  });
}).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });

declare global {
  interface Window {
    searchResultTitleTemplate: string;
  }
}

export {};
