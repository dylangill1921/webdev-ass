/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: router.ts 
    Date: April 14, 2025
*/

export {};

"use strict";

interface RouteMap {
    [path: string]: () => void;
}

// Map of routes to their corresponding CSS files
const routeStyles: { [key: string]: string } = {
    '/': 'app',
    '/gallery': 'gal',
    '/opportunities': 'opp',
    '/contact': 'cont',
    '/events': 'events',
    '/about': 'app',
    '/login': 'login',
    '/register': 'register',
    '/privacy': 'terms',
    '/terms': 'terms',
    '/statistics': 'statistics'
};

class Router {
    private routes: RouteMap = {};
    private currentStyle: string | null = null;

    constructor() {
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    public addRoute(path: string, handler: () => void): void {
        this.routes[path] = handler;
    }

    public init(): void {
        window.addEventListener('hashchange', this.handleRouteChange);
        // Check if there's no hash on initial load
        if (!window.location.hash) {
            window.location.hash = '#/';
        } else {
            this.handleRouteChange();
        }
    }

    private loadComponentStyles(componentName: string): void {
        // Remove existing component styles if any
        const existingStyle = document.getElementById('component-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Don't load styles if it's the same component
        if (this.currentStyle === componentName) {
            return;
        }

        // Create new style link
        const styleLink = document.createElement('link');
        styleLink.id = 'component-styles';
        styleLink.rel = 'stylesheet';
        styleLink.type = 'text/css';
        styleLink.href = `./content/${componentName}.css`;
        
        // Add to head
        document.head.appendChild(styleLink);
        this.currentStyle = componentName;
        console.log(`Loaded styles: ./content/${componentName}.css`);
    }

    private handleRouteChange(): void {
        let path = window.location.hash.slice(1) || '/';
        
        // Ensure path starts with '/'
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        
        const handler = this.routes[path] || this.routes['/404'];
        
        // Load appropriate styles for the route
        const styleName = routeStyles[path] || 'app';
        this.loadComponentStyles(styleName);

        // Track page visit in statistics
        if ((window as any).statistics) {
            console.log('Tracking page visit:', path);
            (window as any).statistics.trackPageVisit(path);
        }

        if (handler) {
            handler();
        }
        this.setActiveLink(path);
    }

    public navigate(path: string): void {
        // Ensure path starts with '#/'
        if (!path.startsWith('#/')) {
            path = '#/' + path.replace(/^[/#]+/, '');
        }
        window.location.hash = path;
    }

    private setActiveLink(currentPath: string): void {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Compare paths without the hash
            const linkPath = href.replace(/^[/#]+/, '');
            const currentPathClean = currentPath.replace(/^[/#]+/, '');
            
            if (linkPath === currentPathClean) {
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
