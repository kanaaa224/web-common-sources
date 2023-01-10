/*
    (c) 2022 kanaaa224. All rights reserved.
*/

import WebAPIClient from '../web-api-client.js';
import * as utils   from '../utils.js';

const { $, create } = utils.dom; utils.dom.extend();

(async () => {
    try {
        let manifest = $('link[rel="manifest"]');

        const response = await fetch(manifest.href);
        const data     = await response.json();

        manifest = data;

        const link = create('link');

        link.rel  = 'icon';
        link.href = new URL(manifest.icons[0].src, response.url).href;

        $('head').appendChild(link);

        await $('body').setHTMLWithFade(`
            <main>
                <article>
                    <section>
                        <span class="mdi mdi-loading mdi-spin"></span>
                    </section>
                </article>
            </main>
            <header>
                <h1>読み込み中...</h1>
                <p>このリポジトリに含まれているアプリケーション</p>
            </header>
            <footer>
                <p>© 2022 <a href="https://kanaaa224.github.io" target="_blank">kanaaa224</a>. All rights reserved.</p>
            </footer>
        `);

        // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        const url   = new URL(window.location.href);
        const user  = url.hostname.split('.')[0];
        const repo  = url.pathname.split('/').filter(Boolean)[0];
        const path  = url.pathname.split('/').filter(Boolean).slice(1).join('/');
        const title = `${user} / ${repo}`;
        const api   = new WebAPIClient('https://api.github.com');

        await $('header h1').setHTMLWithFade(document.title = title);

        let directories = await api.call({ path: `/repos/${user}/${repo}/contents/${path}` });
            directories = directories.data;
            directories = directories.filter(item => item.type === 'dir');
        let html        = '';

        if(directories.length === 0)        html  = '<section><p style="opacity: .5;">このリポジトリにはアプリケーションがありません</p></section>';
        for(const directory of directories) html += `<section><a href="${url}${directory.name}" target="_blank">${directory.name}</a></section>`;

        await $('main article').setHTMLWithFade(html);
    } catch(e) {
        console.error(e);
    }
})();