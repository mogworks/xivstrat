// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Inject JavaScript to handle all external links
            window.eval(r#"
                // Wait for the page to load
                window.addEventListener('DOMContentLoaded', function() {
                    // Override window.open
                    const originalOpen = window.open;
                    window.open = function(url, target, features) {
                        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                            // Check if it's an external URL
                            try {
                                const urlObj = new URL(url);
                                const currentHost = window.location.hostname;
                                if (urlObj.hostname !== currentHost && currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
                                    // For external URLs, use shell open
                                    window.__TAURI__.shell.open(url);
                                    return null;
                                }
                            } catch (e) {
                                // If URL parsing fails, let it proceed normally
                            }
                        }
                        return originalOpen.call(this, url, target, features);
                    };
                    
                    // Handle all clicks on links
                    document.addEventListener('click', function(e) {
                        let target = e.target;
                        while (target && target.tagName !== 'A') {
                            target = target.parentElement;
                        }
                        
                        if (target && target.tagName === 'A') {
                            const href = target.getAttribute('href');
                            
                            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                                // Check if it's an external link
                                try {
                                    const url = new URL(href, window.location.href);
                                    const currentHost = window.location.hostname;
                                    if (url.hostname !== currentHost && currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
                                        e.preventDefault();
                                        window.__TAURI__.shell.open(href);
                                    }
                                } catch (err) {
                                    // If URL parsing fails, let the default behavior happen
                                    console.error('Failed to parse URL:', err);
                                }
                            }
                        }
                    }, true);
                    
                    // Also handle dynamically added links
                    const observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) { // Element node
                                    // Check if it's a link or contains links
                                    const links = node.tagName === 'A' ? [node] : (node.querySelectorAll ? node.querySelectorAll('a') : []);
                                    links.forEach(function(link) {
                                        const href = link.getAttribute('href');
                                        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                                            link.addEventListener('click', function(e) {
                                                try {
                                                    const url = new URL(href, window.location.href);
                                                    const currentHost = window.location.hostname;
                                                    if (url.hostname !== currentHost && currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
                                                        e.preventDefault();
                                                        window.__TAURI__.shell.open(href);
                                                    }
                                                } catch (err) {
                                                    console.error('Failed to parse URL:', err);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    });
                    
                    observer.observe(document.body, { childList: true, subtree: true });
                });
            "#).unwrap();
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}