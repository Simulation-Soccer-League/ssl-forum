async function fetchPlayer() {
    const url = "https://api.simulationsoccer.com/ssl/currentPTs?username=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            // data contains in its [0] index, the javascript object with all information
            document.querySelector("#playerName").innerText = data[0].Name



        });
}