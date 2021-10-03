let fs = require('fs')
let path = require('path')
let md = require('markdown-it')();
const imageToBase64 = require('image-to-base64');

let htmlminify = require('html-minifier').minify;

async function build() {

    let contents = {
        pageflip: fs.readFileSync('src/pageflip.js'),
        script: fs.readFileSync('src/script.js'),
        style: fs.readFileSync('src/style.css'),
    }
    let articles = [];
    let paper = [];
    let magazine = JSON.parse(fs.readFileSync('paper/meta.json'));

    let pn = 1;

    for (let article of fs.readdirSync('paper')) {
        if (article != 'meta.json') {
            let data = JSON.parse(fs.readFileSync(`paper/${article}/meta.json`))
            data.pages = [];
            data.attachments = [];
            data.value = 0;
            data.page = pn;
            for (let file of fs.readdirSync(`paper/${article}`)) {
                let name = file.split('.')
                if (file != "meta.json") {
                    if (name[0] == "thumbnail") {
                        data.thumb = await imageToBase64(`paper/${article}/${file}`);
                    } else if (name[1] == "md") {
                        let content = fs.readFileSync(`paper/${article}/${file}`, 'utf8')
                        data.pages[name[0] - 1] = content;
                        data.value += content.length;
                    } else if (name[1] == 'jpg' || name[1] == 'png' || name[1] == 'webp') {
                        let base64 = await imageToBase64(`paper/${article}/${file}`);
                        let page = file.split('_')[0];
                        if (data.attachments[page-1]===undefined) {data.attachments[page-1]=[]}
                        data.attachments[page-1].push({
                            type: 'image',
                            ext: name[1],
                            data: base64
                        });
                    } else {
                        let code = fs.readFileSync(`paper/${article}/${file}`, 'utf8');
                        let page = file.split('_')[0];
                        if (data.attachments[page-1]===undefined) {data.attachments[page-1]=[]}
                        data.attachments[page-1].push({
                            type: 'code',
                            ext: name[1],
                            data: code
                        });
                    }
                }
            }
            articles.push(data);
            pn += data.pages.length
        }
    }

    pn = 1;

    for (const [index, data] of articles.entries()) {
        for (const [i, page] of data.pages.entries()) {
            let text = md.render(page);
            let attach = [];
            if (data.attachments[i] != undefined) {
                for (let attachment of data.attachments[i]) {
                    if (attachment.type == 'image') {
                        attach.push(`<img src="data:image/png;base64,${attachment.data}">`)
                    } else if (attachment.type == 'code') {
                        attach.push(`<pre><code>${attachment.data}</code></pre>`)
                    }
                }
            }  


            paper.push(`
      <div class="page">
          <div class="page-content">
              <h2 class="page-header">${data.title}</h2>
              ${(attach.length>0) ? `
              <div class="page-attachments">
                ${attach.join('')}
              </div>`:''}
              <div class="page-text columns">
                  ${text}
              </div>
              <span class="author">- ${data.author}</span>
              <div class="page-footer">${pn+1}</div>
          </div>
      </div>
    `)
            pn++;
        }
    }

    articles.sort((a, b) => {
        if (a.thumb && b.thumb) {
            return a.value - b.value
        } else if (a.thumb && !b.thumb) {
            return -1
        } else if (!a.thumb && b.thumb) {
            return 1
        } else {
            return 0
        }
    });

    let featured = [];
    for (let x = 0;
        (x < 6 && x < articles.length); x++) {
        let data = articles[x];
        featured.push(`
      <div class="featured-content">
        <h2>${data.title}</h2>
        ${(data.thumb) ? `<img class="thumb" src="data:image/png;base64,${data.thumb}"b>`:''}
        <p>${data.description}</p>
        <a onclick="pageFlip.flip(${data.page})">Sivu ${data.page+1}</a>
      </div>
    `)
    }
    paper.unshift(`
   <div class="page">
        <div class="page-content">
          <div class="frontpage">
            <h1>Testaaja</h1>
            <div class="info">
              <div>- Lehti joka devaajalle</div>
              <div>Nro ${magazine.issue}, ${magazine.date}</div>
              <div>Yhteystietoja tähän</div>
            </div>
          </div>
            <div class="page-text columns">
              ${magazine.frontpage}
            </div>
            <div class="featured">
                ${featured.join('\n')}
            </div>
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />Lehden sisältö on lisensoitu <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0</a> -lisenssillä.
            <div class="page-footer">${1}</div>
        </div>
    </div>
  `);

    let html = htmlminify(`
<!DOCTYPE html>

<html lang="fi">

<head>
    <title>Testauslehti</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <style>
      ${contents.style}
    </style>
</head>

<body>
    <div class="container" id="book-container">
        <div class="flip-book" id="book">
          ${paper.join(`\n`)}
        </div>
    </div>
    <div class="container controls">
        <div>
            <button type="button" class="btn prev">&lt</button>
            [<span class="page-current">1</span> / <span class="page-total">-</span>]
            <button type="button" class="btn next">&gt</button>
        </div>
    </div>
</body>
<script>
  ${contents.pageflip}
  ${contents.script}
</script>
</html>
`, {
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true
    });

    fs.writeFileSync('built.html', html);
    fs.writeFileSync('docs/paper.html', html);
}

build()