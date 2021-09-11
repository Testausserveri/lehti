document.addEventListener('DOMContentLoaded', () => {

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

            maxShadowOpacity: 1, // Half shadow intensity
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
        if (e.data==0) {
            document.getElementById('demoBookExample').style="translate: calc(-25% - 0.5px)";
        } else if (e.data>=pageFlip.getPageCount()-2) {
            document.getElementById('demoBookExample').style="translate: calc(25% - 0.5px)";
        } else {
            document.getElementById('demoBookExample').style="translate: 0px";
        }
    });

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case "ArrowLeft":
                pageFlip.flipPrev();
                break;
            case "ArrowRight":
                pageFlip.flipNext();
                break;
        }
    });
});