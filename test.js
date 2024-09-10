function addTextBox3(id, photo, message, date, event1, event2, event3) {
                let classText = "d-flex flex-row justify-content-start mt-1";
                if (margin == 0) {
                    classText = "d-flex flex-row justify-content-start mt-4";
                    margin = 1;
                }
                let div01 = document.createElement("div");
                div01.setAttribute("class", classText);

                let img01 = document.createElement("img");
                img01.setAttribute("src", photo);
                img01.setAttribute("alt", "avatar");
                img01.setAttribute("class", "user-img-42");
                div01.appendChild(img01);

                let div02 = document.createElement("div");
                div02.setAttribute("class", "p-3 ms-3 border chatbox col-sm-8");
                div01.appendChild(div02);

                let p = document.createElement("p");
                p.setAttribute("class", "small mb-0");
                p.innerHTML = message.replaceAll("\n", "<br />");
                let grid = document.createElement("div");
                grid.setAttribute("class", "d-grid");
                p.appendChild(grid);
                let buttonGroup = document.createElement("div");
                buttonGroup.setAttribute("class", "button-group");
                grid.appendChild(buttonGroup);

                let button01 = document.createElement("button");
                button01.setAttribute("class", "btn btn-danger");
                button01.addEventListener("click", function() {
                	event1(id, photo);
                })
                buttonGroup.appendChild(button01);

                let button02 = document.createElement("button");
                button02.setAttribute("class", "btn btn-outline-dark");
                button02.addEventListener("click", function() {
                	event2(id, photo);
                })
                buttonGroup.appendChild(button02);

                let button03 = document.createElement("button");
                button03.setAttribute("class", "btn btn-primary");
                button03.addEventListener("click", function() {
                	event3(id, photo);
                })
                buttonGroup.appendChild(button03);

                div02.appendChild(p);

                let div03 = document.createElement("div");
                div03.setAttribute("class", "row");
                div02.appendChild(div03);

                let div04 = document.createElement("div");
                div04.setAttribute("class", "col blockquote-footer text-secondary");
                div04.appendChild(document.createTextNode(date));
                div03.appendChild(div04);

                chatbox.appendChild(div01);
                chatbox.scrollTo(0, chatbox.scrollHeight);
            }