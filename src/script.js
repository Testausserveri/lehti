let pageFlip = {};

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.offsetWidth > 700) {
        pageFlip = new PageFlip(
            document.getElementById("book"),
            {
                width: 315,
                height: 420,

                size: "stretch",
                
                minWidth: 600,
                maxWidth: 1000,
                minHeight: 420,
                maxHeight: 3000,

                maxShadowOpacity: 1,
                showCover: true,
                mobileScrollSupport: true,

                useMouseEvents: false
            }
        );

        // load pages
        pageFlip.loadFromHTML(document.querySelectorAll(".page"));

        document.querySelector(".page-total").innerText = pageFlip.getPageCount();

        document.querySelector(".prev").addEventListener("click", () => {
            pageFlip.flipPrev(); // Turn to the previous page (with animation)
        });

        document.querySelector(".next").addEventListener("click", () => {
            pageFlip.flipNext(); // Turn to the next page (with animation)
        });

        // triggered by page turning
        pageFlip.on("flip", (e) => {
            document.querySelector(".page-current").innerText = e.data + 1;
            if (pageFlip.getOrientation()=='landscape') {
                if (e.data==0) {
                    document.getElementById('book').style=`left: -25%`;
                } else if (e.data>=pageFlip.getPageCount()-2 && pageFlip.getPageCount()%2==0) {
                    document.getElementById('book').style=`left: 25%`;
                } else {
                    document.getElementById('book').style="left: 0px";
                }
            } else {
                document.getElementById('book').style="left: 0px";
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

        if (pageFlip.getOrientation()=='landscape') {
            document.getElementById('book').style=`left: -25%`;
        } else {
            document.getElementById('book').style="left: 0px";
        }
    } else {
        document.getElementById('book').style="left: 0px";
        document.querySelector(".prev").style="display: none";
        document.querySelector(".next").style="display: none";
    }
});