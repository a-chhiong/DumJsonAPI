import { Identity } from "../constants/Identity.js";
import { Session } from "../constants/Session.js";

class SessionManager {
    constructor() {
        this.activeIdx = null;
        this.activeId = null;
    }

    /**
     * Bootstraps the session context.
     * Logic: URL ID > SessionStorage Index > LocalStorage Last Index
     */
    init() {
        if (this._isInitialised)
            return;

        const registry = this._getRegistry();
        const urlId = this._parseIdFromUrl();
        const tabIdx = sessionStorage.getItem(`${Identity.APP_SCHEM}_TAB_IDX`);
        const lastIdx = localStorage.getItem(`${Identity.APP_SCHEM}_LAST_IDX`);

        let targetIdx = 0;

        if (urlId && registry.indexOf(urlId) !== -1) {
            targetIdx = registry.indexOf(urlId);
        } else if (tabIdx !== null) {
            targetIdx = parseInt(tabIdx, 10);
        } else if (lastIdx !== null) {
            targetIdx = parseInt(lastIdx, 10);
        }

        this._resolve(targetIdx);

        this._isInitialised = true;
        return { idx: this.activeIdx, id: this.activeId };
    }

    /**
     * Forces the session to a specific index (Used for account switching)
     */
    switchToIndex(idx) {
        if (idx < 0 || idx >= Session.MAX_COUNT) return;
        this._resolve(idx);
        // Force a reload or route change to sync the URL
        window.location.hash = `#/${this.activeId}/home`;
        window.location.reload(); 
    }

    _resolve(idx) {
        const registry = this._getRegistry();
        
        // If slot is empty, generate a new identity for this index
        if (!registry[idx]) {
            registry[idx] = `s_${Math.random().toString(36).substring(2, 7)}`;
            this._saveRegistry(registry);
        }

        this.activeIdx = idx;
        this.activeId = registry[idx];

        // Persistence
        sessionStorage.setItem(`${Identity.APP_SCHEM}_TAB_IDX`, this.activeIdx);
        localStorage.setItem(`${Identity.APP_SCHEM}_LAST_IDX`, this.activeIdx);
    }

    _getRegistry() {
        const raw = localStorage.getItem(`${Identity.APP_SCHEM}_REGISTRY`);
        return raw ? JSON.parse(raw) : new Array(Session.MAX_COUNT).fill(null);
    }

    _saveRegistry(arr) {
        localStorage.setItem(`${Identity.APP_SCHEM}_REGISTRY`, JSON.stringify(arr));
    }

    _parseIdFromUrl() {
        const parts = window.location.hash.split('/');
        return (parts[1]?.startsWith('s_')) ? parts[1] : null;
    }
}

export const sessionManager = new SessionManager();
export const SESSION_MAX = 10;