// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Inject persistent JavaScript that survives page navigation
            window.eval(r#"
                (function() {
                    console.log('Tauri: Initializing navigation enhancement...');
                    
                    // Create a persistent initialization function
                    const initTauriEnhancements = function() {
                        // Check if already initialized
                        if (window.__tauriInitialized) return;
                        window.__tauriInitialized = true;
                        
                        console.log('Tauri: Setting up enhancements...');
                        
                        // Inject styles if not already present
                        if (!document.getElementById('tauri-custom-styles')) {
                            const style = document.createElement('style');
                            style.id = 'tauri-custom-styles';
                            style.textContent = `
                                .tauri-back-button {
                                    position: fixed;
                                    top: 20px;
                                    left: 20px;
                                    width: 40px;
                                    height: 40px;
                                    background: rgba(255, 255, 255, 0.9);
                                    border: 1px solid rgba(0, 0, 0, 0.1);
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                    z-index: 9999;
                                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                }
                                
                                .tauri-back-button:hover {
                                    background: rgba(255, 255, 255, 1);
                                    transform: translateY(-1px);
                                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                                }
                                
                                .tauri-back-button:active {
                                    transform: translateY(0);
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                }
                                
                                .tauri-back-button svg {
                                    width: 20px;
                                    height: 20px;
                                    fill: #333;
                                }
                                
                                @media (prefers-color-scheme: dark) {
                                    .tauri-back-button {
                                        background: rgba(40, 40, 40, 0.9);
                                        border: 1px solid rgba(255, 255, 255, 0.1);
                                    }
                                    
                                    .tauri-back-button:hover {
                                        background: rgba(60, 60, 60, 1);
                                    }
                                    
                                    .tauri-back-button svg {
                                        fill: #e0e0e0;
                                    }
                                }
                            `;
                            document.head.appendChild(style);
                        }
                        
                        // Create or update back button
                        let backButton = document.getElementById('tauri-back-button');
                        if (!backButton) {
                            backButton = document.createElement('div');
                            backButton.id = 'tauri-back-button';
                            backButton.className = 'tauri-back-button';
                            backButton.innerHTML = `
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                </svg>
                            `;
                            
                            backButton.addEventListener('click', function() {
                                window.history.back();
                            });
                            
                            document.body.appendChild(backButton);
                        }
                        
                        // Set up external link handling with event delegation
                        const handleClick = function(e) {
                            let target = e.target;
                            
                            // Find the anchor element (could be nested due to SVG icons)
                            while (target && target !== document.body) {
                                if (target.tagName === 'A') {
                                    const href = target.getAttribute('href');
                                    
                                    if (href) {
                                        // Check if it's an external URL
                                        if (href.startsWith('http://') || href.startsWith('https://')) {
                                            // Parse URL to check if it's truly external
                                            try {
                                                const url = new URL(href);
                                                const currentHost = window.location.hostname;
                                                
                                                // Check if the URL is external
                                                if (url.hostname !== currentHost && 
                                                    url.hostname !== 'localhost' && 
                                                    url.hostname !== '127.0.0.1') {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log('Tauri: Opening external URL:', href);
                                                    window.__TAURI__.shell.open(href).then(() => {
                                                        console.log('Tauri: Successfully opened URL');
                                                    }).catch(err => {
                                                        console.error('Tauri: Failed to open URL:', err);
                                                    });
                                                    return false;
                                                }
                                            } catch (err) {
                                                console.error('Tauri: Error parsing URL:', err);
                                            }
                                        }
                                    }
                                    break;
                                }
                                target = target.parentElement;
                            }
                        };
                        
                        // Remove old listener if exists
                        document.removeEventListener('click', handleClick, true);
                        // Add new listener
                        document.addEventListener('click', handleClick, true);
                        
                        // Override window.open
                        if (!window.__tauriOriginalOpen) {
                            window.__tauriOriginalOpen = window.open;
                            window.open = function(url, target, features) {
                                if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                                    console.log('Tauri: Opening URL via window.open:', url);
                                    window.__TAURI__.shell.open(url).catch(err => {
                                        console.error('Tauri: Failed to open URL:', err);
                                    });
                                    return null;
                                }
                                return window.__tauriOriginalOpen.call(this, url, target, features);
                            };
                        }
                        
                        console.log('Tauri: Enhancements setup complete');
                    };
                    
                    // Initial setup
                    initTauriEnhancements();
                    
                    // Set up MutationObserver to handle page changes
                    const observer = new MutationObserver(function(mutations) {
                        // Check if body was replaced (page navigation)
                        for (const mutation of mutations) {
                            if (mutation.type === 'childList' && 
                                Array.from(mutation.removedNodes).some(node => node.tagName === 'BODY') ||
                                Array.from(mutation.addedNodes).some(node => node.tagName === 'BODY')) {
                                console.log('Tauri: Detected page change, reinitializing...');
                                window.__tauriInitialized = false;
                                setTimeout(initTauriEnhancements, 100);
                                break;
                            }
                        }
                        
                        // Check if back button was removed
                        if (!document.getElementById('tauri-back-button')) {
                            window.__tauriInitialized = false;
                            initTauriEnhancements();
                        }
                    });
                    
                    // Observe changes to the entire document
                    observer.observe(document.documentElement, {
                        childList: true,
                        subtree: true
                    });
                    
                    // Also listen for history changes
                    const originalPushState = history.pushState;
                    const originalReplaceState = history.replaceState;
                    
                    history.pushState = function() {
                        originalPushState.apply(history, arguments);
                        setTimeout(() => {
                            window.__tauriInitialized = false;
                            initTauriEnhancements();
                        }, 100);
                    };
                    
                    history.replaceState = function() {
                        originalReplaceState.apply(history, arguments);
                        setTimeout(() => {
                            window.__tauriInitialized = false;
                            initTauriEnhancements();
                        }, 100);
                    };
                    
                    window.addEventListener('popstate', function() {
                        setTimeout(() => {
                            window.__tauriInitialized = false;
                            initTauriEnhancements();
                        }, 100);
                    });
                })();
            "#).unwrap();
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}