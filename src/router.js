"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Map of routes to their corresponding CSS files
const routeStyles = {
    '/': 'app',
    '/gallery': 'gal',
    '/opportunities': 'opp',
    '/contact': 'cont',
    '/events': 'events',
    '/about': 'app',
    '/login': 'login',
    '/register': 'register',
    '/privacy': 'terms',
    '/terms': 'terms'
};
class Router {
    constructor() {
        this.routes = {};
        this.currentStyle = null;
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }
    addRoute(path, handler) {
        this.routes[path] = handler;
    }
    init() {
        window.addEventListener('hashchange', this.handleRouteChange);
        // Check if there's no hash on initial load
        if (!window.location.hash) {
            window.location.hash = '#/';
        }
        else {
            this.handleRouteChange();
        }
    }
    loadComponentStyles(componentName) {
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
        styleLink.href = `content/${componentName}.css`;
        // Add to head
        document.head.appendChild(styleLink);
        this.currentStyle = componentName;
        console.log(`Loaded styles: content/${componentName}.css`);
    }
    handleRouteChange() {
        let path = window.location.hash.slice(1) || '/';
        // Ensure path starts with '/'
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        const handler = this.routes[path] || this.routes['/404'];
        // Load appropriate styles for the route
        const styleName = routeStyles[path] || 'app';
        this.loadComponentStyles(styleName);
        if (handler) {
            handler();
        }
        this.setActiveLink(path);
    }
    navigate(path) {
        // Ensure path starts with '#/'
        if (!path.startsWith('#/')) {
            path = '#/' + path.replace(/^[/#]+/, '');
        }
        window.location.hash = path;
    }
    setActiveLink(currentPath) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href)
                return;
            // Compare paths without the hash
            const linkPath = href.replace(/^[/#]+/, '');
            const currentPathClean = currentPath.replace(/^[/#]+/, '');
            if (linkPath === currentPathClean) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
            else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }
}
// load content dynamically
function loadContent(url, containerId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok)
                throw new Error('Failed to load content');
            const content = yield response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = content;
            }
        }
        catch (error) {
            console.error('Error loading content:', error);
        }
    });
}
// Attach to global window 
window.Router = Router;
window.loadContent = loadContent;
// Export for ES module imports
export { Router, loadContent };
