let fs = require('fs')
let md = require('markdown-it')();


let contents = {
  pageflip: fs.readFileSync('src/pageflip.js'),
  script: fs.readFileSync('src/script.js'),
  style: fs.readFileSync('src/style.css'),
  paper: ""
}

let index = JSON.parse(fs.readFileSync('paper/index.json'))
for (const [i, data] of index.entries()) {
  let raw = fs.readFileSync(`./paper/${data.file}`,'utf8');
  let text = md.render(raw);
  contents.paper += `
  <div class="page">
      <div class="page-content">
          <h2 class="page-header">${data.title}</h2>
          <div class="page-text" style="${(data.columns) ? `column-count: ${data.columns}`:''}">
              ${text}
          </div>
          <div class="page-footer">${i+1}</div>
      </div>
  </div>
  `
}

let html = `
<!DOCTYPE html>

<html lang="fi">

<head>
    <title>Testauslehti</title>
    <style>
      ${contents.style}
    </style>
</head>

<body>
    <div class="container controls">
        <div>
            <button type="button" class="btn-prev">Previous page</button>
            [<span class="page-current">1</span> of <span class="page-total">-</span>]
            <button type="button" class="btn-next">Next page</button>
        </div>
    </div>

    <div class="container">
        <div class="flip-book" id="demoBookExample">
          ${contents.paper}
        </div>
    </div>
</body>
<script>
  ${contents.pageflip}
  ${contents.markdown}
  ${contents.script}
</script>
</html>
`

fs.writeFileSync('built.html', html);