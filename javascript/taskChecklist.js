async function fetchChecklist() {
    const url = "https://api.simulationsoccer.com/ssl/currentPTs?user=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            let cappedPT = data.slice(0, 5);

            let uncappedPT = data.slice(5, data.length);


            var capDiv = document.querySelector("#cappedPT");
            var capUl = document.createElement("ul");

            cappedPT.forEach(element => {
                var li = document.createElement("li");
                var link = document.createElement("a");

                link.href = element.Link
                link.appendChild(document.createTextNode(element.Thread))

                console.log(element.User)
                if ((element.User !== undefined)) {
                    link.classList.add("strikethrough");
                }

                li.appendChild(link)

                capUl.appendChild(li)
            });

            capDiv.appendChild(capUl)

            var uncapDiv = document.querySelector("#uncappedPT");
            var uncapUl = document.createElement("ul");

            uncappedPT.forEach(element => {
                var li = document.createElement("li");
                var link = document.createElement("a");

                link.href = element.Link
                link.appendChild(document.createTextNode(element.Thread))

                if ((element.User !== undefined)) {
                    link.classList.add("strikethrough");
                }

                li.appendChild(link)

                uncapUl.appendChild(li)
            });

            uncapDiv.appendChild(uncapUl)


        });
}


fetchChecklist();