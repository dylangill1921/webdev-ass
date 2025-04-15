"use strict";
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
        if (!window.location.hash) {
            window.location.hash = '#/';
        }
        else {
            this.handleRouteChange();
        }
    }
    loadComponentStyles(componentName) {
        const existingStyle = document.getElementById('component-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        if (this.currentStyle === componentName) {
            return;
        }
        const styleLink = document.createElement('link');
        styleLink.id = 'component-styles';
        styleLink.rel = 'stylesheet';
        styleLink.type = 'text/css';
        styleLink.href = `./content/${componentName}.css`;
        document.head.appendChild(styleLink);
        this.currentStyle = componentName;
        console.log(`Loaded styles: ./content/${componentName}.css`);
    }
    handleRouteChange() {
        let path = window.location.hash.slice(1) || '/';
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        const handler = this.routes[path] || this.routes['/404'];
        const styleName = routeStyles[path] || 'app';
        this.loadComponentStyles(styleName);
        if (handler) {
            handler();
        }
        this.setActiveLink(path);
    }
    navigate(path) {
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
async function loadContent(url, containerId) {
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error('Failed to load content');
        const content = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = content;
        }
    }
    catch (error) {
        console.error('Error loading content:', error);
    }
}
window.Router = Router;
window.loadContent = loadContent;
export { Router, loadContent };
//# sourceMappingURL=router.js.map