let pageFlip = {};

document.addEventListener('DOMContentLoaded', async () => {
    if (document.body.offsetWidth > 800) {
        pageFlip = new PageFlip(
            document.getElementById("book"),
            {
                width: 210,
                height: 297,

                size: "stretch",
				minWidth: 800,
				

                maxShadowOpacity: 1,
                showCover: true,
                mobileScrollSupport: true,

                useMouseEvents: false,

				flippingTime: 500,
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
            window.location.hash=e.data+1
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

		function refresh() {
			let width = 0;
			let height = 0;
            for (element of document.getElementsByClassName("page-content")) {
                if (element.offsetWidth > 0) {
                    width = element.offsetWidth;
					break
                }
            }
            document.querySelector("html").style.fontSize = `${width*0.018}px`;
			for (element of document.querySelectorAll(".columns > *")) {
				if (element.offsetHeight > 0) {
					element.style = "";
				}
			}
			for (element of document.querySelectorAll(".columns > *")) {
				let height = element.parentElement.offsetHeight
				if (element.offsetHeight > 0) {
					let style = window.getComputedStyle(element);
					element.style.gridRow = `span ${
						Math.ceil(
							(element.offsetHeight
								+ toPx(element, style.marginTop, "height")
								+ toPx(element, style.marginBottom, "height")
							) / height * 40)
					}`
					if (element.tagName == "PRE" || element.tagName == "TABLE") {
						element.style.gridColumn = `span ${Math.ceil(element.offsetWidth / height * 3)}`
					}
					element.style.maxWidth = "100%"
				}
			}
		}

        window.addEventListener('resize', refresh);

		pageFlip.on("changeState", (e) => {
			if (e.data == "read") {
				setTimeout(refresh,10)
			}
		})

        if (pageFlip.getOrientation()=='landscape') {
            document.getElementById('book').style=`left: -25%`;
        } else {
            document.getElementById('book').style="left: 0px";
        }

		setTimeout(refresh,100)

    } else {
        document.getElementById('book').style="left: 0px";
        document.querySelector(".prev").style="display: none";
        document.querySelector(".next").style="display: none";
    }

    pageFlip.flip(window.location.hash.substring(1)-1)

	window.addEventListener('hashchange', (e) => {
		if (window.location.hash.substring(1)-1 != pageFlip.getCurrentPageIndex()) {
			pageFlip.flip(window.location.hash.substring(1)-1)
		}
	});
	
});