// ==UserScript==
// @name         Yahooニュース記事タイトルをDuckDuckGoで検索
// @namespace    https://github.com/Kdroidwin/Yahoo-DuckDuckGo-/
// @version      1.0
// @description  Yahooニュースの特定の画像をクリックすると記事タイトルをDuckDuckGoで検索（元のリンク無効化）
// @author       kdroidwin
// @match        *://news.yahoo.co.jp/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let searchTab = null; // 既存の検索タブを管理

    // クリックを無効化し検索する対象の画像
    let imgSelectors = [
        'img[src*="s.yimg.jp/images/news/cobranding/"]',
        'img[src*="s.yimg.jp/images/news-cpm/logo/"]'
    ];

    function setupSearchFeature() {
        document.querySelectorAll(imgSelectors.join(', ')).forEach(img => {
            img.style.cursor = 'pointer'; // クリックできるように
            img.addEventListener('click', function(event) {
                event.preventDefault(); // 元のリンク遷移を防ぐ
                event.stopPropagation(); // 親要素のクリックイベントも防ぐ

                let title = document.title.replace(' - Yahoo!ニュース', '');
                let searchUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(title);

                if (searchTab && !searchTab.closed) {
                    // 既存の検索タブがあればURLを更新
                    searchTab.location.href = searchUrl;
                    searchTab.focus();
                } else {
                    // 新規タブを開く
                    searchTab = window.open(searchUrl, '_blank');
                }
            }, true); // キャプチャリングフェーズで実行
        });
    }

    // 初回実行
    setupSearchFeature();

    // 動的に追加された要素にも適用するための監視
    let observer = new MutationObserver(setupSearchFeature);
    observer.observe(document.body, { childList: true, subtree: true });
})();
