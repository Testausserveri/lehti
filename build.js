let fs = require('fs')
let path = require('path')
let md = require('markdown-it')();
const imageToBase64 = require('image-to-base64');
const Handlebars = require("handlebars");

let htmlminify = require('html-minifier').minify;

async function build() {

    let contents = {
        pageflip: fs.readFileSync('src/pageflip.js'),
        script: fs.readFileSync('src/script.js'),
		units: fs.readFileSync('src/units.js'),
        style: fs.readFileSync('src/style.css'),
    }

	let template = Handlebars.compile(fs.readFileSync("src/index.handlebars", "utf8"));
    let articles = [];
    let magazine = JSON.parse(fs.readFileSync('paper/meta.json'));

    let pn = 1;

    for (let article of fs.readdirSync('paper')) {
        if (article != 'meta.json') {
            let data = JSON.parse(fs.readFileSync(`paper/${article}/meta.json`))
            data.pages = [];
            data.attachments = [];
            data.value = 0;
            for (let file of fs.readdirSync(`paper/${article}`)) {
                let name = file.split('.')
                if (file != "meta.json") {
                    if (name[0] == "thumbnail") {
                        data.thumb = await imageToBase64(`paper/${article}/${file}`);
                    } else if (name[1] == "md") {
                        let content = fs.readFileSync(`paper/${article}/${file}`, 'utf8')
						if (data.pages[name[0] - 1]===undefined) {data.pages[name[0]-1]=[]}
						data.pages[name[0] - 1].content = md.render(content);
                        data.value += content.length;
                    } else if (name[1] == 'jpg' || name[1] == 'png' || name[1] == 'webp') {
                        let base64 = await imageToBase64(`paper/${article}/${file}`);
                        let page = file.split('_')[0];
						if (data.pages[page - 1]===undefined) {data.pages[page-1]=[]}
						if (data.pages[page-1].attachments===undefined) {data.pages[page-1].attachments=[]}
                        data.pages[page-1].attachments.push(`<img src="data:image/${name[1]};base64,${base64}">`);
                    } else {
                        let code = fs.readFileSync(`paper/${article}/${file}`, 'utf8');
                        let page = file.split('_')[0];
						if (data.pages[page - 1]===undefined) {data.pages[page-1]=[]}
						if (data.pages[page-1].attachments===undefined) {data.pages[page-1].attachments=[]}
                        data.pages[page-1].attachments.push(`<pre><code>${code}</code></pre>`);
                    }
                }
            }
            articles.push(data);
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

	pn = 2
	for (article of articles) {
		article.page = pn
		for (page of article.pages) {
			page.page = pn
			pn++;
		}
	}

    let featured = articles.slice(0,6);

    let html = htmlminify(template({
		contents,
		articles,
		magazine,
		featured
	}), {
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true
    });

    fs.writeFileSync('built.html', html);
    fs.writeFileSync('docs/paper.html', html);
}

build()