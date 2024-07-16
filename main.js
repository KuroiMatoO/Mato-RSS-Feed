import './style.css'
import RSSParser from 'rss-parser/dist/rss-parser.min.js';

let button = document.querySelector(".button");
let input = document.querySelector("#input");
let inputContainer = document.querySelector('#input-container')
let resultContainer = document.querySelector('#result-container')
let RSS;
let typingTimeout;

button.addEventListener("click", ParseRSS);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    ParseRSS();
  }
});

input.addEventListener('input', () => {
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(buttonToggle, 100);
});


function classToggle() {
  if (inputContainer.className !== "minimized") {
    inputContainer.className = "minimized";
    resultContainer.className = "expanded";
  }
}



function buttonToggle() {
  if (input.value) {
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
        // console.log(RSS)

      } else {
        console.log('loading')
        // console.log(RSS)
      }
    }
  } catch (error) {
    console.error(error);
    let timeout = 'timed out'
    if (error.includes(timeout)){
      console.log('TIMEOUT')
    }
  }

}



//Proxy
const CORS_PROXY = "https://api.allorigins.win/raw?url="
// const CORS_PROXY = "https://corsproxy.io/?"
// const CORS_PROXY = "http://www.whateverorigin.org/get?url="



let parser = new RSSParser({
  headers: {
    'Accept': 'application/rss+xml, text/xml',
  },
  customFields: {
    item: ['media:content'],
  },
  requestOptions: {
    headers: {
      'Accept': 'application/rss+xml, text/xml',
    }
  }
});

function ParseRSS() {
  RSS = '';
  if (input.value) {
    URL = input.value;
    classToggle();
    Loader()

    parser.parseURL(CORS_PROXY + URL, function (err, RSSData) {
      if (err) throw err;
      console.log(RSSData)
      RSS = RSSData;

      let feedItem = document.querySelectorAll('.feed-item')
      if (feedItem){
        for (let i = 0; i < feedItem.length; i++){
          feedItem[i].remove()
        }
      }
      function createFeedItem(item) {
        const article = document.createElement('article');
        article.className = 'feed-item';

        article.onclick = function () {
          let link = item.enclosure?.url || item.link;
          console.log(link)
          window.open(link, '_blank');
        }

        const title = document.createElement('h2');
        title.textContent = item.title;
        article.appendChild(title);

        const infoRow = document.createElement('div');
        infoRow.className = 'info-row';

        const tags = document.createElement('span');
        tags.className = 'tags';

        const pubDate = new Date(item.pubDate);
        const formattedDate = pubDate.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });

       
        if (item.categories !== undefined) {
          if (Object.keys(item.categories).length > 1) {
            for (let i = 0; i < Object.keys(item.categories).length; i++) {
              if (typeof item.categories[i] == "object") {
                for (const [key, value] of Object.entries(item.categories[i])) {
                  if (typeof value == 'string') {
                    infoRow.textContent = `${formattedDate}  `;
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.textContent = `${value}`;
                    tags.appendChild(tag);
                    console.log(value)
                    allTags.add(value)
                  }
                }
              } else {
                infoRow.textContent = `${formattedDate}  `;
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = `${item.categories[i]}`;
                tags.appendChild(tag);
                allTags.add(item.categories[i])
                
              }
            }
            
          } else {
            infoRow.textContent = `${formattedDate}  `;
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = `${item.categories}`;
            tags.appendChild(tag);
            item.categories.forEach((category) => {
              allTags.add(category)
            })
          }
        } else {
          infoRow.textContent = `${formattedDate}`
          allTags.clear();
        }
        
    
        article.appendChild(infoRow);
        infoRow.appendChild(tags);

       


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

      populateFeed(RSSData, 'results');
      console.log(allTags)
      fetchFilterTags()
    })
  }
}


//Filtering
let allTags = new Set();



let filterBtn = document.createElement('div');
let filterWrapper = document.createElement('div')
let filterList = document.createElement('div');
let filterListContent = document.createElement('div');

function fetchFilterTags(){
  filterListContent.innerHTML = '';
  

  if (document.querySelector('.filter-btn') == undefined){
    // filterBtn = document.createElement('div');
    filterBtn.className = 'filter-btn';
    inputContainer.appendChild(filterBtn)
  }
  if (document.querySelector('.filter-list') == undefined){
    filterList.className = 'filter-list invisible';
    filterWrapper.className = 'filter-wrapper invisible';
    filterListContent.className = 'filter-list-content'
    resultContainer.before(filterWrapper);
    filterWrapper.appendChild(filterList);
    filterList.appendChild(filterListContent);
  }
      
  
  let x = 1;
    allTags.forEach((tag) => {
      // let filterItem = document.createElement('div')
      // filterItem.className = 'filter-item';
      // filterListContent.appendChild(filterItem)
      
      
      let filterCheckBox = document.createElement('input')
      filterCheckBox.type = 'checkbox';
      filterCheckBox.className = 'filter-checkbox';
      filterCheckBox.id = `chbx${x}`;
      filterListContent.appendChild(filterCheckBox)
  
      let filterTag = document.createElement('label');
      filterTag.className = 'filter-tag';
      filterTag.htmlFor = `chbx${x}`
      filterTag.textContent = tag;
      filterListContent.appendChild(filterTag);
      x += x;
    })
    allTags.clear()
    x = 1;
}

filterBtn.addEventListener('click', filterToggle);

function filterToggle(){
  if (filterWrapper.className == 'filter-wrapper invisible'){
    filterWrapper.className = 'filter-wrapper';
  } else {
    filterWrapper.className = 'filter-wrapper invisible';
  }
}




//THEME

let themeToggle = document.querySelector('#theme-toggle');
let themeIMG = document.querySelector('#theme-toggle img');
let prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');


themeToggle.addEventListener('click', toggleTheme);
prefersDarkScheme.addEventListener('change', handleColorSchemeChange);

// Detect OS theme
function handleColorSchemeChange(event) {
  let newTheme;
  if (event.matches) {
    newTheme = 'dark';
  } else {
    newTheme = 'light';
  }
  setTheme(newTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeIMG.src = `img/${theme}.png`;
}

function loadTheme() {
  let savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    console.log('Using saved theme');
    setTheme(savedTheme);
  } else {
    console.log('Using system preference');
    handleColorSchemeChange(prefersDarkScheme);
  }
}

function toggleTheme() {
  console.log(allTags)

  let currentTheme = document.documentElement.getAttribute('data-theme');
  let newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  if (newTheme === 'dark') {
    themeIMG.src = "img/dark.png";
  } else {
    themeIMG.src = "img/light.png"
  }
}



loadTheme();
//TODO
//Sort by tag
//Timeour error indication