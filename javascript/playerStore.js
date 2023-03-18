// Fetches the build of the player whose user is logged in
async function fetchPlayer() {
    const url = "https://api.simulationsoccer.com/ssl/getPlayer?username=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            // data contains in its [0] index, the javascript object with all information
            document.querySelector("#playerName").innerText = data[0].Name

            const traitOption = document.querySelector("#removeTrait1")

            const ownedTraits = data[0]['All Traits'].split(" \\ ")

            for (const trait in ownedTraits) {
                // console.log(ownedTraits[trait])
                const option = document.createElement("option");
                option.text = ownedTraits[trait];
                option.value = "500000";
                traitOption.appendChild(option)
            }

            const url = "https://api.simulationsoccer.com/ssl/getBankBalance?user=" + username

            const bankData = fetch(url)

            bankData
                .then((response) => response.json())
                .then((data) => {

                    let number = parseFloat(data[0].Balance)

                    document.querySelector("#playerBank").innerText = number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                })




        });

}


function updateCost(element) {
    var cost = document.querySelector('#' + element.id + 'Cost')

    cost.innerText = element.value
}


// Function to gather the information from the form
function updateOutput() {
    const purchases = document.querySelectorAll("div[class$='Purchase'] table")

    const url = "https://api.simulationsoccer.com/ssl/getPlayer?username=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            const baseString = `${data[0].Name} - ${username} - ${data[0].Team}`

            let purchaseString = ""

            purchases.forEach(element => {

                console.log(element)
                const items = element.querySelectorAll("select")

                items.forEach(element => {
                    let selectedIndex = element.selectedIndex;

                    // Only writes if a purchase has been made.
                    if (selectedIndex != 0) {
                        purchaseString += `${baseString} - ${element.options[selectedIndex].innerText} - ${element.options[selectedIndex].value}
`
                    }
                });
            });

            Swal.fire({
                title: 'Purchase Summarized!',
                html: '<pre>' + purchaseString + '</pre>',
                icon: 'success',
                confirmButtonText: 'Copy text'
            }).then(function (isConfirm) {
                if (isConfirm) {
                    // Copy the text inside the text field
                    navigator.clipboard.writeText(purchaseString);
                } else {
                    // DO NOTHING
                }
            })
        })

    return false;
}


function submitCheck() {
    const balanceCurrency = document.querySelector("#playerBank").innerHTML

    const balanceNumber = balanceCurrency.replace(/[^\d.-]/g, '');

    const balance = parseFloat(balanceNumber)

    const costs = document.querySelectorAll("span[id$='Cost']")

    var sum = 0

    costs.forEach(element => {
        sum += parseInt(element.innerHTML)
    });

    console.log(balance)
    console.log(sum)
    console.log(balance - sum)

    if (balance - sum < 0) {

        Swal.fire({
            title: 'Too much money spent!',
            text: 'You have spent more money on your purchase than you have in your bank.',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    } else {
        console.log("Checked and summarizing")

        updateOutput()
    }
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
    return document.querySelectorAll('#' + element.id + ' tr').length;
}