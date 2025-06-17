// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

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
                
                console.log('[Tauri] 初始化增强功能...');
                
                // 立即注入返回按钮
                this.injectBackButton();
                
                // 设置链接拦截 - 必须在 Tauri API 加载后执行
                this.waitForTauriAndSetupLinks();
                
                // 监听 DOM 变化
                this.observeChanges();
                
                console.log('[Tauri] 增强功能初始化完成');
            },
            
            waitForTauriAndSetupLinks: function() {
                console.log('[Tauri] 等待 Tauri API 加载...');
                
                const checkInterval = setInterval(() => {
                    if (window.__TAURI__ && window.__TAURI__.shell && window.__TAURI__.shell.open) {
                        clearInterval(checkInterval);
                        console.log('[Tauri] Tauri API 已加载，设置链接拦截');
                        this.setupLinkInterception();
                    }
                }, 100);
                
                // 10秒后停止检查
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (!window.__TAURI__ || !window.__TAURI__.shell || !window.__TAURI__.shell.open) {
                        console.warn('[Tauri] Tauri API 未能加载');
                    }
                }, 10000);
            },
            
            injectBackButton: function() {
                // 如果按钮已存在，跳过
                if (document.getElementById(this.backButtonId)) {
                    return;
                }
                
                console.log('[Tauri] 注入返回按钮...');
                
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
                    console.log('[Tauri] 返回按钮点击');
                    window.history.back();
                });
                
                // 添加到 body
                document.body.appendChild(button);
                console.log('[Tauri] 返回按钮已添加');
            },
            
            setupLinkInterception: function() {
                console.log('[Tauri] 设置链接拦截...');
                
                const self = this;
                
                // 处理链接点击的函数
                async function handleLinkClick(e) {
                    // 查找点击的链接元素
                    let target = e.target;
                    while (target && target !== document && target.tagName !== 'A') {
                        target = target.parentElement;
                    }
                    
                    if (target && target.tagName === 'A' && target.href) {
                        console.log('[Tauri] 检测到链接点击:', target.href);
                        
                        try {
                            const targetUrl = new URL(target.href);
                            const currentUrl = new URL(window.location.href);
                            
                            // 打印调试信息
                            console.log('[Tauri] 目标主机:', targetUrl.hostname);
                            console.log('[Tauri] 当前主机:', currentUrl.hostname);
                            console.log('[Tauri] 协议:', targetUrl.protocol);
                            
                            // 检查是否为外部链接（不同主机名）
                            if (targetUrl.protocol.startsWith('http') && 
                                targetUrl.hostname !== currentUrl.hostname) {
                                
                                console.log('[Tauri] 确认为外部链接，准备拦截');
                                
                                // 阻止默认行为
                                e.preventDefault();
                                e.stopPropagation();
                                e.stopImmediatePropagation();
                                
                                // 使用 Tauri API 打开
                                if (window.__TAURI__ && window.__TAURI__.shell && window.__TAURI__.shell.open) {
                                    console.log('[Tauri] 调用 shell.open:', target.href);
                                    try {
                                        await window.__TAURI__.shell.open(target.href);
                                        console.log('[Tauri] 外部链接打开成功');
                                    } catch (err) {
                                        console.error('[Tauri] shell.open 失败:', err);
                                        // 降级方案
                                        console.log('[Tauri] 尝试使用 window.open 作为降级方案');
                                        window.open(target.href, '_blank');
                                    }
                                } else {
                                    console.error('[Tauri] Shell API 不可用');
                                }
                                
                                return false;
                            } else {
                                console.log('[Tauri] 内部链接，允许默认行为');
                            }
                        } catch (err) {
                            console.error('[Tauri] 处理链接时出错:', err);
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
                            console.log('[Tauri] 标记外部链接（mousedown）:', target.href);
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
                
                console.log('[Tauri] 链接拦截设置完成');
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
                        
                        console.log('[Tauri] 处理外部链接:', link.href);
                    }
                } catch (err) {
                    // 忽略无效 URL
                }
            },
            
            observeChanges: function() {
                console.log('[Tauri] 设置 DOM 观察器...');
                
                const self = this;
                
                // 创建观察器
                const observer = new MutationObserver(() => {
                    // 检查返回按钮是否被移除
                    if (!document.getElementById(this.backButtonId)) {
                        console.log('[Tauri] 返回按钮被移除，重新注入');
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
                        console.log('[Tauri] 检测到路由变化');
                        // 延迟检查，确保页面渲染完成
                        setTimeout(() => {
                            if (!document.getElementById(self.backButtonId)) {
                                self.injectBackButton();
                            }
                            // 重新处理新页面的链接
                            document.querySelectorAll('a').forEach(link => self.processLink(link));
                        }, 100);
                    }
                }).observe(document, { subtree: true, childList: true });
                
                console.log('[Tauri] DOM 观察器设置完成');
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
                }
            }, 100);
        });
        
        console.log('[Tauri] 注入脚本已加载');
    "#;

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(move |app| {
            let window = tauri::WebviewWindowBuilder::new(
                app,
                "main",
                tauri::WebviewUrl::App("index.html".into())
            )
            .title("XivStrat")
            .initialization_script(injection_script)
            .build()?;

            // 添加一个开发者工具的快捷键
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}