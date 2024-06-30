import './style.css'
import RSSParser from 'rss-parser/dist/rss-parser.min.js';

let button = document.querySelector(".button");
let input = document.querySelector("#input");
let inputContainer = document.querySelector('#input-container')
let resultContainer = document.querySelector('#result-container')
let RSS;
let typingTimeout;

function parseRSS() {
    if (inputContainer.className == "minimized") {
        inputContainer.className = "";
        resultContainer.className = "";
    } else {
        inputContainer.className = "minimized";
        resultContainer.className = "expanded";
    }
  }

function buttonToggle(){
    if (input.value){
        button.className = 'button';
    } else {
        button.className = 'button disabled';
    }
}


async function Loader() {
  try {
      const loader = document.querySelector('.loader')
      const loaderBg = document.querySelector('.loader_bg')
      loader.className = 'loader';
      loaderBg.className = 'loader_bg';
      var timer = setInterval(checkRSS, 1000);
      function checkRSS() {
          if (RSS) {
              clearInterval(timer);
              loader.className = 'loader hidden';
              loaderBg.className = 'loader_bg hidden';
              console.log(RSS)

          } else {
              console.log('something wrong')
              console.log(RSS)
          }
      }
  } catch (error) {
      console.error(error);
  }

}

button.addEventListener("click", parseRSS);

input.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(buttonToggle, 500);
});


//Proxy
const CORS_PROXY = "https://api.allorigins.win/raw?url="

let parser = new RSSParser();
parser.parseURL(CORS_PROXY + 'https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us', function(err, RSSData) {
  if (err) throw err;
  console.log(RSSData)
  RSS = RSSData;
  
function createFeedItem(item) {
    const article = document.createElement('article');
    article.className = 'feed-item';
    
    article.onclick = function() {
        window.open(item.link, '_blank');
    };
    
    const title = document.createElement('h2');
    title.textContent = item.title;
    article.appendChild(title);
  
    const infoRow = document.createElement('div');
    infoRow.className = 'info-row';
    
    const pubDate = new Date(item.pubDate);
    const formattedDate = pubDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    });
    
    if (item.categories !== undefined){
        if (Object.keys(item.categories).length > 1){
            infoRow.textContent = `${formattedDate} | ${item.categories.join(', ')}`;
        } else {
            infoRow.textContent = `${formattedDate} | ${item.categories}`;
        }
    } else {
        infoRow.textContent = `${formattedDate}` 
    }
   
    article.appendChild(infoRow);
  
    const content = document.createElement('p');
    content.textContent = item.contentSnippet;
    article.appendChild(content);
  
    return article;
  }
  
  function populateFeed(RSSData, containerId) {
    const container = document.getElementById(containerId);
    
    RSSData.items.forEach(item => {
      const feedItem = createFeedItem(item);
      container.appendChild(feedItem);
    });
  }

  Loader()
  populateFeed(RSSData, 'results');
})




//THEME

const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
let themeIMG = document.querySelector('#theme-toggle img');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeIMG.src = `img/${theme}.png`;

}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
    themeIMG.src = `img/${savedTheme}.png`;
  } else if (prefersDarkScheme.matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  if (newTheme === 'dark'){
    themeIMG.src = "img/dark.png";
  } else {
    themeIMG.src = "img/light.png"
  }
}

// Initialize theme
loadTheme();

// Event listener for theme toggle button
themeToggle.addEventListener('click', toggleTheme);

// Listen for OS theme changes
prefersDarkScheme.addEventListener('change', (e) => {
  const newTheme = e.matches ? 'dark' : 'light';
  setTheme(newTheme);
 
});