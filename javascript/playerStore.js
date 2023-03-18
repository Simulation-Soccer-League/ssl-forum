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

            const traitOption = document.querySelector("#removeTrait1")

            const ownedTraits = data[0]['All Traits'].split(" \\ ")

            for (const trait in ownedTraits) {
                console.log(ownedTraits[trait])
                const option = document.createElement("option");
                option.text = ownedTraits[trait];
                option.value = "500000";
                traitOption.appendChild(option)
            }

        });

}


function updateCost(element) {
    var cost = document.querySelector('#' + element.id + 'Cost')

    cost.innerText = element.value
}



function addRow(element) {
    const table = element.parentNode.parentNode.querySelector("table[id$='Table']")

    var numRows = getRowsInUpdateTable(table);

    var newRow = table.rows[1].cloneNode(true)

    newRow.querySelector("td").innerHTML = numRows

    var ids = newRow.querySelectorAll('[id*="1"]')

    for (var i = 0; i < ids.length; i++) {
        var oldId = ids[i].getAttribute('id');
        var newId = oldId.replace(/1/g, numRows);
        ids[i].setAttribute('id', newId);
    }

    table.append(newRow)

}

function removeRow(element) {
    const table = element.parentNode.parentNode.querySelector("table[id$='Table']")

    var numRows = getRowsInUpdateTable(table);

    if (numRows <= 2) {
        return;
    } else {
        table.deleteRow(-1)
    }

}

function getRowsInUpdateTable(element) {
    return $('#' + element.id + ' tr').length;
}