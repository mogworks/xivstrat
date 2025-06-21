// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


fn main() {
    // 增强的注入脚本，修复外链打开功能
    let injection_script = r#"
        // 创建一个全局对象来存储我们的功能
        window.__TAURI_INJECTED__ = {
            initialized: false,
            backButtonId: 'tauri-global-back-button',
            
            init: function() {
                if (this.initialized) return;
                this.initialized = true;
                
                
                // 立即注入返回按钮
                this.injectBackButton();
                
                // 初始化完成后立即检查一次可见性
                setTimeout(() => {
                    this.updateBackButtonVisibility();
                }, 50);
                
                // 设置链接拦截 - 必须在 Tauri API 加载后执行
                this.waitForTauriAndSetupLinks();
                
                // 监听 DOM 变化
                this.observeChanges();
                
            },
            
            waitForTauriAndSetupLinks: function() {
                
                const checkInterval = setInterval(() => {
                    if (window.__TAURI__ && window.__TAURI__.shell && window.__TAURI__.shell.open) {
                        clearInterval(checkInterval);
                        this.setupLinkInterception();
                    }
                }, 100);
                
                // 10秒后停止检查
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (!window.__TAURI__ || !window.__TAURI__.shell || !window.__TAURI__.shell.open) {
                    }
                }, 10000);
            },
            
            isHomePage: function() {
                // 检查是否在首页
                const path = window.location.pathname;
                const hash = window.location.hash;
                const href = window.location.href;
                const protocol = window.location.protocol;
                
                
                // 更全面的首页检测
                const isHome = path === '/' || 
                               path === '/index.html' || 
                               path === '/index' ||
                               path === '' ||
                               (path === '/' && hash === '') ||
                               // 处理 Tauri 协议的情况（tauri://localhost）
                               (protocol === 'tauri:' && (path === '/' || path === '')) ||
                               (protocol === 'https:' && (path === '/' || path === '')) ||
                               (protocol === 'http:' && (path === '/' || path === '')) ||
                               // 处理可能的末尾斜杠
                               path.replace(/\/$/, '') === '' ||
                               // 通过检查是否有特定的首页元素来判断
                               (document.querySelector('h1') && document.querySelector('h1').textContent === 'XivStrat');
                
                return isHome;
            },
            
            updateBackButtonVisibility: function() {
                const button = document.getElementById(this.backButtonId);
                if (button) {
                    const isHome = this.isHomePage();
                    if (isHome) {
                        button.style.display = 'none';
                        button.style.visibility = 'hidden';
                        button.style.opacity = '0';
                        button.style.pointerEvents = 'none';
                    } else {
                        button.style.display = 'flex';
                        button.style.visibility = 'visible';
                        button.style.opacity = '1';
                        button.style.pointerEvents = 'auto';
                    }
                } else {
                }
            },
            
            injectBackButton: function() {
                // 如果按钮已存在，只更新可见性
                if (document.getElementById(this.backButtonId)) {
                    this.updateBackButtonVisibility();
                    return;
                }
                
                
                // 创建样式
                const style = document.createElement('style');
                style.id = 'tauri-back-button-style';
                style.innerHTML = `
                    #${this.backButtonId} {
                        position: fixed !important;
                        top: 20px !important;
                        left: 20px !important;
                        width: 48px !important;
                        height: 48px !important;
                        background-color: rgba(255, 255, 255, 0.9) !important;
                        border: 2px solid rgba(0, 0, 0, 0.1) !important;
                        border-radius: 50% !important;
                        cursor: pointer !important;
                        z-index: 2147483647 !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
                        transition: all 0.2s ease !important;
                    }
                    
                    #${this.backButtonId}:hover {
                        background-color: rgba(255, 255, 255, 1) !important;
                        transform: scale(1.1) !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
                    }
                    
                    #${this.backButtonId}:active {
                        transform: scale(0.95) !important;
                    }
                    
                    #${this.backButtonId} svg {
                        width: 24px !important;
                        height: 24px !important;
                        fill: #333333 !important;
                    }
                    
                    @media (prefers-color-scheme: dark) {
                        #${this.backButtonId} {
                            background-color: rgba(50, 50, 50, 0.9) !important;
                            border-color: rgba(255, 255, 255, 0.1) !important;
                        }
                        
                        #${this.backButtonId}:hover {
                            background-color: rgba(70, 70, 70, 1) !important;
                        }
                        
                        #${this.backButtonId} svg {
                            fill: #e0e0e0 !important;
                        }
                    }
                `;
                
                // 添加样式到头部
                if (!document.getElementById('tauri-back-button-style')) {
                    document.head.appendChild(style);
                }
                
                // 创建按钮
                const button = document.createElement('div');
                button.id = this.backButtonId;
                button.setAttribute('title', '返回');
                button.innerHTML = `
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                `;
                
                // 添加点击事件
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.history.back();
                });
                
                // 在添加到 body 之前，先设置初始状态
                if (this.isHomePage()) {
                    button.style.display = 'none';
                    button.style.visibility = 'hidden';
                    button.style.opacity = '0';
                    button.style.pointerEvents = 'none';
                }
                
                // 添加到 body
                document.body.appendChild(button);
                
                // 再次确保可见性正确
                this.updateBackButtonVisibility();
            },
            
            setupLinkInterception: function() {
                
                const self = this;
                
                // 处理链接点击的函数
                async function handleLinkClick(e) {
                    // 查找点击的链接元素
                    let target = e.target;
                    while (target && target !== document && target.tagName !== 'A') {
                        target = target.parentElement;
                    }
                    
                    if (target && target.tagName === 'A' && target.href) {
                        
                        try {
                            const targetUrl = new URL(target.href);
                            const currentUrl = new URL(window.location.href);
                            
                            
                            // 检查是否为外部链接（不同主机名）
                            if (targetUrl.protocol.startsWith('http') && 
                                targetUrl.hostname !== currentUrl.hostname) {
                                
                                // 阻止默认行为
                                e.preventDefault();
                                e.stopPropagation();
                                e.stopImmediatePropagation();
                                
                                // 使用 Tauri API 打开
                                if (window.__TAURI__ && window.__TAURI__.shell && window.__TAURI__.shell.open) {
                                    try {
                                        await window.__TAURI__.shell.open(target.href);
                                    } catch (err) {
                                        // 降级方案
                                        window.open(target.href, '_blank');
                                    }
                                } else {
                                }
                                
                                return false;
                            } else {
                            }
                        } catch (err) {
                        }
                    }
                }
                
                // 使用多种方式确保拦截所有链接点击
                
                // 1. 捕获阶段监听
                document.addEventListener('click', handleLinkClick, true);
                
                // 2. 冒泡阶段监听（备份）
                document.addEventListener('click', handleLinkClick, false);
                
                // 3. 监听 mousedown 事件（更早拦截）
                document.addEventListener('mousedown', function(e) {
                    let target = e.target;
                    while (target && target !== document && target.tagName !== 'A') {
                        target = target.parentElement;
                    }
                    
                    if (target && target.tagName === 'A' && target.href) {
                        const targetUrl = new URL(target.href);
                        const currentUrl = new URL(window.location.href);
                        
                        if (targetUrl.protocol.startsWith('http') && 
                            targetUrl.hostname !== currentUrl.hostname) {
                            // 标记这个链接，以便在 click 事件中处理
                            target.dataset.tauriExternal = 'true';
                        }
                    }
                }, true);
                
                // 4. 处理中键点击
                document.addEventListener('auxclick', handleLinkClick, true);
                
                // 5. 使用 MutationObserver 动态处理新添加的链接
                const linkObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // 元素节点
                                // 检查是否是链接
                                if (node.tagName === 'A') {
                                    self.processLink(node);
                                }
                                // 检查子元素中的链接
                                const links = node.querySelectorAll ? node.querySelectorAll('a') : [];
                                links.forEach(link => self.processLink(link));
                            }
                        });
                    });
                });
                
                // 开始观察
                linkObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                // 处理已存在的链接
                document.querySelectorAll('a').forEach(link => this.processLink(link));
                
            },
            
            // 处理单个链接
            processLink: function(link) {
                if (!link.href) return;
                
                try {
                    const targetUrl = new URL(link.href);
                    const currentUrl = new URL(window.location.href);
                    
                    if (targetUrl.protocol.startsWith('http') && 
                        targetUrl.hostname !== currentUrl.hostname) {
                        // 添加标记
                        link.dataset.tauriExternal = 'true';
                        
                        // 移除 target="_blank" 以避免新窗口
                        if (link.target === '_blank') {
                            link.removeAttribute('target');
                        }
                        
                    }
                } catch (err) {
                    // 忽略无效 URL
                }
            },
            
            observeChanges: function() {
                
                const self = this;
                
                // 创建观察器
                const observer = new MutationObserver(() => {
                    // 检查返回按钮是否被移除
                    if (!document.getElementById(this.backButtonId)) {
                        this.injectBackButton();
                    }
                });
                
                // 观察 body 的变化
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                // 监听路由变化（针对 SPA）
                let lastUrl = location.href;
                new MutationObserver(() => {
                    const url = location.href;
                    if (url !== lastUrl) {
                        lastUrl = url;
                        // 延迟检查，确保页面渲染完成
                        setTimeout(() => {
                            if (!document.getElementById(self.backButtonId)) {
                                self.injectBackButton();
                            } else {
                                // 更新按钮可见性
                                self.updateBackButtonVisibility();
                            }
                            // 重新处理新页面的链接
                            document.querySelectorAll('a').forEach(link => self.processLink(link));
                        }, 100);
                    }
                }).observe(document, { subtree: true, childList: true });
                
                // 额外监听 popstate 事件（浏览器前进/后退）
                window.addEventListener('popstate', () => {
                    setTimeout(() => {
                        self.updateBackButtonVisibility();
                    }, 100);
                });
                
                // 监听 hashchange 事件
                window.addEventListener('hashchange', () => {
                    self.updateBackButtonVisibility();
                });
            }
        };
        
        // 确保在合适的时机初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.__TAURI_INJECTED__.init();
            });
        } else {
            // DOM 已经加载完成
            setTimeout(() => {
                window.__TAURI_INJECTED__.init();
            }, 0);
        }
        
        // 作为备份，也在 window.onload 时执行
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!window.__TAURI_INJECTED__.initialized) {
                    window.__TAURI_INJECTED__.init();
                } else {
                    // 如果已经初始化，再次检查按钮可见性
                    window.__TAURI_INJECTED__.updateBackButtonVisibility();
                }
            }, 100);
        });
        
        // 监听 DOMContentLoaded 后的一小段时间，以处理动态内容
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.__TAURI_INJECTED__.updateBackButtonVisibility();
            }, 500);
        });
    "#;

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(move |app| {
            let _window = tauri::WebviewWindowBuilder::new(
                app,
                "main",
                tauri::WebviewUrl::App("index.html".into())
            )
            .title("XivStrat")
            .inner_size(1600.0, 900.0)
            .initialization_script(injection_script)
            .build()?;

            // 添加一个开发者工具的快捷键
            #[cfg(debug_assertions)]
            {
                _window.open_devtools();
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}