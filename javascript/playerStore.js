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
    const table = document.querySelector(element.id).parentNode.querySelector("table[id$='Table']")



    var numRows = getRowsInUpdateTable();
    var newRow = '<tr>';
    newRow += '<td>' + numRows + '</td>';
    newRow += '<td><input id="' + numRows + 'task" type="Text" style="width: 96%;"></td>';
    newRow += '<td><input id="' + numRows + 'link" type="Text" style="width: 96%;"></td>';
    /* newRow += '<td><input class="narrow" id="' + numRows + 'cappedTpe" type="Text" onchange="updateTpeAvailable();" value="0"></td>'; */
    newRow += '<td><input class="narrow" id="' + numRows + 'uncappedTpe" type="number" onchange="updateEarnedTPE();" value="0"></td>'
    newRow += '</tr>';
    $('#updatesTable tr:last').after(newRow);
}

function removeRow() {
    var numRows = $('#updatesTable tr').length;
    if (numRows <= 2) {
        return;
    }
    $('#updatesTable tr:last').remove();
}

function getRowsInUpdateTable() {
    return $('#updatesTable tr').length;
}