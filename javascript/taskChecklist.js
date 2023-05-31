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

                li.appendChild(link)

                if (!(element.User === null)) {
                    li.classList.add("strikethrough");
                }

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

                li.appendChild(
                    link
                )
                uncapUl.appendChild(li)
            });

            uncapDiv.appendChild(uncapUl)

            console.log(data.length + 1)
            console.log(cappedPT)
            console.log(uncappedPT)

        });
}