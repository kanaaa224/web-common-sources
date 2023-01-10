/*
    (c) 2022 kanaaa224. All rights reserved.
*/

export const dom = {

    $:  (selector, parent = document) =>      parent.querySelector   (selector),
    $$: (selector, parent = document) => [ ...parent.querySelectorAll(selector) ],

    on: (target, event, handler, options = false) => {
        target.addEventListener(event, handler, options);

        return () => target.removeEventListener(event, handler, options);
    },

    create: (tagName, attributes = {}) => {
        const element = document.createElement(tagName);

        for(const [ key, value ] of Object.entries(attributes)) {
            switch(key) {
                case 'text': element.textContent = value; break;
                case 'html': element.innerHTML   = value; break;

                default:
                    element.setAttribute(key, value);
            }
        }

        return element;
    },

    extend: () => {
        Element.prototype.add  = function(e) { this.appendChild(e);  return this; };
        Element.prototype.text = function(c) { this.textContent = c; return this; };
        Element.prototype.html = function(h) { this.innerHTML   = h; return this; };
        Element.prototype.css  = function(s) { this.style       = s; return this; };

        Element.prototype.on = function(e, h, o) { return dom.on(this, e, h, o); };

        Element.prototype.setHTMLWithFade = function(html, duration = 150) {
            return new Promise((resolve) => {
                let fade = this.animate([{ opacity: 1 }, { opacity: 0 }], {
                    duration: duration, fill: 'forwards'
                });

                fade.onfinish = () => {
                    this.innerHTML = html;

                    fade = this.animate([{ opacity: 0 }, { opacity: 1 }], {
                        duration: duration, fill: 'forwards'
                    });

                    fade.onfinish = () => resolve();
                };
            });
        };
    }

};

export const url = {

    params: {

        set: (name = '', value = '', urlString = window.location.href) => {
            const url = new URL(urlString);

            url.searchParams.set(name, value);

            return url.toString();
        },

        get: (name = '', urlString = window.location.href) => {
            return (new URL(urlString)).searchParams.get(name);
        },

        remove: (name = '', urlString = window.location.href) => {
            const url = new URL(urlString);

            url.searchParams.delete(name);

            return url.toString();
        },

        has: (name = '', urlString = window.location.href) => {
            return (new URL(urlString)).searchParams.has(name);
        },

        toObject: (urlString = window.location.href) => {
            return Object.fromEntries((new URL(urlString)).searchParams.entries());
        },

        fromObject: (params = {}, urlString = window.location.href) => {
            const url = new URL(urlString);

            for(const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

            return url.toString();
        },

        clear: (urlString = window.location.href) => {
            const url = new URL(urlString);

            url.search = '';

            return url.toString();
        }

    },

    hash: {

        set(name = '', value = '', urlString = window.location.href) {
            const url  = new URL(urlString);
            const hash = new URLSearchParams(url.hash.slice(1));

            hash.set(name, value);

            url.hash = hash.toString().replace(/=$/, '');

            return url.toString();
        },

        get(name = '', urlString = window.location.href) {
            const url  = new URL(urlString);
            const hash = new URLSearchParams(url.hash.slice(1));

            return hash.get(name);
        },

        remove(name = '', urlString = window.location.href) {
            const url  = new URL(urlString);
            const hash = new URLSearchParams(url.hash.slice(1));

            hash.delete(name);

            url.hash = hash.toString();

            return url.toString();
        },

        has(name = '', urlString = window.location.href) {
            return new URLSearchParams(new URL(urlString).hash.slice(1)).has(name);
        },

        toObject(urlString = window.location.href) {
            const hash = new URLSearchParams(new URL(urlString).hash.slice(1));

            return Object.fromEntries([ ...hash.entries() ].map(([ k, v ]) => [ k, v ]));
        },

        clear(urlString = window.location.href) {
            const url = new URL(urlString);

            url.hash = '';

            return url.toString();
        }

    }

};

export const storage = {

    set: (setData = {}, storageKey = window.location.pathname, session = false) => {
        setData = JSON.stringify(setData);

        session ? sessionStorage.setItem(storageKey, setData) : localStorage.setItem(storageKey, setData);

        return true;
    },

    get: (key = '', storageKey = window.location.pathname, session = false) => {
        let storageData = session ? sessionStorage.getItem(storageKey) : localStorage.getItem(storageKey);

        if(!storageData) return null;

        storageData = JSON.parse(storageData);

        if(key) return key in storageData ? storageData[key] : null;

        return storageData;
    },

    remove: (storageKey = window.location.pathname, session = false) => {
        session ? sessionStorage.removeItem(storageKey) : localStorage.removeItem(storageKey);
    }

};