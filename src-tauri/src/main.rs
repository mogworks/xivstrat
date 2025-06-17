// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, WebviewUrl};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Handle navigation (when user navigates within the webview)
            let window_clone = window.clone();
            window.on_navigation(move |url| {
                // Allow navigation within the app
                if url.scheme() == "http" || url.scheme() == "https" {
                    // Check if it's the local dev server or production build
                    if url.host_str() == Some("localhost") 
                        || url.host_str() == Some("127.0.0.1")
                        || url.scheme() == "tauri" {
                        return true;
                    }
                    // Open external links in the default browser
                    if let Err(e) = webbrowser::open(url.as_str()) {
                        eprintln!("Failed to open URL in browser: {}", e);
                    }
                    return false;
                }
                true
            });
            
            // Handle new window requests (target="_blank" links)
            window.on_window_event(move |event| {
                if let tauri::WindowEvent::WebviewWindowCreated { label, webview_window } = event {
                    // Get the URL that's trying to open
                    if let Ok(url) = webview_window.url() {
                        // Open in default browser instead of new window
                        if url.scheme() == "http" || url.scheme() == "https" {
                            if let Err(e) = webbrowser::open(url.as_str()) {
                                eprintln!("Failed to open URL in browser: {}", e);
                            }
                            // Close the newly created window
                            let _ = webview_window.close();
                        }
                    }
                }
            });
            
            // Inject JavaScript to handle all external links
            window.eval(r#"
                (function() {
                    // Override window.open
                    const originalOpen = window.open;
                    window.open = function(url, target, features) {
                        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                            // For external URLs, use shell open
                            window.__TAURI__.shell.open(url);
                            return null;
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
                            const targetAttr = target.getAttribute('target');
                            
                            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                                // Check if it's an external link
                                const url = new URL(href);
                                if (url.hostname !== window.location.hostname) {
                                    e.preventDefault();
                                    window.__TAURI__.shell.open(href);
                                }
                            }
                        }
                    }, true);
                })();
            "#).unwrap();
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}