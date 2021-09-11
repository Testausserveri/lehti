//thank you again, stackoverflow.
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
    return result;
}
  

document.addEventListener('DOMContentLoaded', function() {

    const pageFlip = new PageFlip(
        document.getElementById("demoBookExample"),
        {
            width: 315, // base page width
            height: 420, // base page height

            size: "stretch",
            // set threshold values:
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,

            maxShadowOpacity: 0.25, // Half shadow intensity
            showCover: true,
            mobileScrollSupport: false, // disable content scrolling on mobile devices

            useMouseEvents: false
        }
    );

    // load pages
    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    document.querySelector(".page-total").innerText = pageFlip.getPageCount();

    document.querySelector(".btn-prev").addEventListener("click", () => {
        pageFlip.flipPrev(); // Turn to the previous page (with animation)
    });

    document.querySelector(".btn-next").addEventListener("click", () => {
        pageFlip.flipNext(); // Turn to the next page (with animation)
    });

    // triggered by page turning
    pageFlip.on("flip", (e) => {
        document.querySelector(".page-current").innerText = e.data + 1;
    });


    let md = window.markdownit();
    for (let i=1;i<=1;i++) {
        let content = loadFile(`paper/${i}.md`)
        let result = md.render(content);
        let page = document.createElement("div");
        page.setAttribute('class','page')
        page.innerHTML = `
<div class="page-content>
    <div class="page-text>
        ${content}
    </div>
    <div class="page-footer">${i+1}</div>
</div>`
        document.getElementById('demoBookExample').appendChild(page);
    }
});

