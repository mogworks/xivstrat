// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Inject JavaScript to handle all external links and add navigation button
            window.eval(r#"
                // Create and inject back button styles
                const style = document.createElement('style');
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
                    
                    .tauri-back-button.disabled {
                        opacity: 0.4;
                        cursor: not-allowed;
                    }
                    
                    .tauri-back-button.disabled:hover {
                        background: rgba(255, 255, 255, 0.9);
                        transform: none;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
                
                // Create back button
                function createBackButton() {
                    const button = document.createElement('div');
                    button.className = 'tauri-back-button';
                    button.innerHTML = `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    `;
                    
                    button.addEventListener('click', function() {
                        if (window.history.length > 1) {
                            window.history.back();
                        }
                    });
                    
                    // Update button state based on history
                    function updateButtonState() {
                        if (window.history.length <= 1) {
                            button.classList.add('disabled');
                        } else {
                            button.classList.remove('disabled');
                        }
                    }
                    
                    updateButtonState();
                    window.addEventListener('popstate', updateButtonState);
                    
                    document.body.appendChild(button);
                }
                
                // Wait for DOM to be ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function() {
                        createBackButton();
                    });
                } else {
                    createBackButton();
                }
                
                // Handle external links
                function setupExternalLinkHandling() {
                    // Override window.open
                    const originalOpen = window.open;
                    window.open = function(url, target, features) {
                        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                            console.log('Opening external URL via window.open:', url);
                            window.__TAURI__.shell.open(url).catch(err => {
                                console.error('Failed to open URL:', err);
                            });
                            return null;
                        }
                        return originalOpen.call(this, url, target, features);
                    };
                    
                    // Handle all clicks on links
                    document.addEventListener('click', function(e) {
                        let target = e.target;
                        
                        // Traverse up to find the anchor element
                        while (target && target !== document.body) {
                            if (target.tagName === 'A') {
                                const href = target.getAttribute('href');
                                
                                if (href) {
                                    // Handle absolute URLs
                                    if (href.startsWith('http://') || href.startsWith('https://')) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Opening external URL:', href);
                                        window.__TAURI__.shell.open(href).catch(err => {
                                            console.error('Failed to open URL:', err);
                                        });
                                        return false;
                                    }
                                }
                                break;
                            }
                            target = target.parentElement;
                        }
                    }, true);
                }
                
                // Set up external link handling
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', setupExternalLinkHandling);
                } else {
                    setupExternalLinkHandling();
                }
            "#).unwrap();
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}