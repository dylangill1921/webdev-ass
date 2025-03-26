/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: router.ts 
    Date: March 22, 2025
*/

export {};

"use strict";

interface RouteMap {
    [path: string]: () => void;
}

class Router {
    private routes: RouteMap = {};

    constructor() {
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    public addRoute(path: string, handler: () => void): void {
        this.routes[path] = handler;
    }

    public init(): void {
        window.addEventListener('hashchange', this.handleRouteChange);
        this.handleRouteChange();
    }

    private handleRouteChange(): void {
        const path = window.location.hash.slice(1) || '/';
        const handler = this.routes[path] || this.routes['/404'];
        if (handler) {
            handler();
        }
        this.setActiveLink(path);
    }

    public navigate(path: string): void {
        window.location.hash = path;
    }

    private setActiveLink(currentPath: string): void {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href')?.slice(1);
            if (linkPath === currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }
}

// load content dynamically
async function loadContent(url: string, containerId: string): Promise<void> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load content');
        const content = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = content;
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Attach to global window 
window.Router = Router;
window.loadContent = loadContent;

// Export for ES module imports
export { Router, loadContent };

declare global {
    interface Window {
        Router: typeof Router;
        loadContent: typeof loadContent;
    }
}
