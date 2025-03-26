/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: router.ts - Custom router for SPA functionality (Hash-based)
    Date: February 23, 2025
*/
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
class Router {
    constructor() {
        this.routes = {};
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }
    addRoute(path, handler) {
        this.routes[path] = handler;
    }
    init() {
        window.addEventListener('hashchange', this.handleRouteChange);
        this.handleRouteChange();
    }
    handleRouteChange() {
        const path = window.location.hash.slice(1) || '/';
        const handler = this.routes[path] || this.routes['/404'];
        if (handler) {
            handler();
        }
        this.setActiveLink(path);
    }
    navigate(path) {
        window.location.hash = path;
    }
    setActiveLink(currentPath) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            var _a;
            const linkPath = (_a = link.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.slice(1);
            if (linkPath === currentPath) {
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
// Attach to global window for compatibility with older code
window.Router = Router;
window.loadContent = loadContent;
// Export for ES module imports
export { Router, loadContent };
//# sourceMappingURL=router.js.map