(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();let g=document.querySelector(".button"),w=document.querySelector("#input"),m=document.querySelector("#input-container"),h=document.querySelector("#result-container"),i,y;function S(){m.className=="minimized"?(m.className="",h.className=""):(m.className="minimized",h.className="expanded")}function N(){w.value?g.className="button":g.className="button disabled"}async function E(){try{let e=function(){i?(clearInterval(n),r.className="loader hidden",s.className="loader_bg hidden",console.log(i)):(console.log("something wrong"),console.log(i))};var o=e;const r=document.querySelector(".loader"),s=document.querySelector(".loader_bg");r.className="loader",s.className="loader_bg";var n=setInterval(e,1e3)}catch(r){console.error(r)}}g.addEventListener("click",S);w.addEventListener("input",()=>{clearTimeout(y),y=setTimeout(N,500)});const T="https://api.allorigins.win/raw?url=";let v=new RSSParser;v.parseURL(T+"https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us",function(n,o){if(n)throw n;console.log(o),i=o;function r(e){const t=document.createElement("article");t.className="feed-item",t.onclick=function(){window.open(e.link,"_blank")};const c=document.createElement("h2");c.textContent=e.title,t.appendChild(c);const l=document.createElement("div");l.className="info-row";const u=new Date(e.pubDate).toLocaleDateString("en-US",{weekday:"short",day:"numeric",month:"short",year:"numeric"});e.categories!==void 0?Object.keys(e.categories).length>1?l.textContent=`${u} | ${e.categories.join(", ")}`:l.textContent=`${u} | ${e.categories}`:l.textContent=`${u}`,t.appendChild(l);const p=document.createElement("p");return p.textContent=e.contentSnippet,t.appendChild(p),t}function s(e,t){const c=document.getElementById(t);e.items.forEach(l=>{const f=r(l);c.appendChild(f)})}E(),s(o,"results")});const C=document.getElementById("theme-toggle"),b=window.matchMedia("(prefers-color-scheme: dark)");let d=document.querySelector("#theme-toggle img");function a(n){document.documentElement.setAttribute("data-theme",n),localStorage.setItem("theme",n),d.src=`/img/${n}.png`}function L(){const n=localStorage.getItem("theme");n?(a(n),d.src=`/img/${n}.png`):b.matches?a("dark"):a("light")}function k(){const o=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";a(o),o==="dark"?d.src="/img/dark.png":d.src="/img/light.png"}L();C.addEventListener("click",k);b.addEventListener("change",n=>{const o=n.matches?"dark":"light";a(o)});
