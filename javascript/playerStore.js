// Fetches the build of the player whose user is logged in
async function fetchPlayer() {
    const url = "https://api.simulationsoccer.com/ssl/getPlayer?username=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            // data contains in its [0] index, the javascript object with all information
            document.querySelector("#playerName").innerText = data[0].Name

            document.querySelector("#playerBank").innerText = data[0].Name

        });

}


function updateCost(element) {
    var cost = document.querySelector('#' + element.id + 'Cost')

    cost.innerText = element.value
}