const costArray = { 5: 0, 6: 2, 7: 4, 8: 8, 9: 12, 10: 16, 11: 22, 12: 28, 13: 34, 14: 46, 15: 58, 16: 70, 17: 88, 18: 106, 19: 131, 20: 156 }

const attributeArray = {
    "Acc": "acceleration",
    "Agi": "agility",
    "Bal": "balance",
    "Jmp": "jumping reach",
    "Nat": "natural fitness",
    "Pac": "pace",
    "Sta": "stamina",
    "Str": "strength",
    "Agg": "aggression",
    "Ant": "anticipation",
    "Bra": "bravery",
    "Cmp": "composure",
    "Con": "concentration",
    "Dec": "decisions",
    "Det": "determination",
    "Fla": "flair",
    "Lea": "leadership",
    "Otb": "off the ball",
    "Pos": "positioning",
    "Tea": "teamwork",
    "Vis": "vision",
    "Wrk": "work rate",
    "Cor": "corners",
    "Cro": "crossing",
    "Dri": "dribbling",
    "Fin": "finishing",
    "Fst": "first touch",
    "FstK": "first touch",
    "Frk": "free kick",
    "FrkK": "free kick",
    "Hea": "heading",
    "Lsh": "long shots",
    "Lth": "long throws",
    "Mar": "marking",
    "Pas": "passing",
    "PasK": "passing",
    "Pen": "penalty taking",
    "PenK": "penalty taking",
    "Tck": "tackling",
    "Tec": "technique",
    "TecK": "technique",
    "Aer": "aerial reach",
    "Coa": "command of area",
    "Com": "communication",
    "Ecc": "eccentricity",
    "Han": "handling",
    "Kic": "kicking",
    "Ooo": "one on ones",
    "Ref": "reflexes",
    "Ttr": "tendency to rush",
    "Ttp": "tendency to punch",
    "Thr": "throwing"
}

// Capitalize first letter in string
function toCapital(string) {
    return string[0].toUpperCase() + string.slice(1)
}

// Updates the attribute tables based on the selected player position
function updateForm(position) {
    if (!(position == 20)) {
        document.querySelector("#keeperAttributes").style.display = "none"
        document.querySelector("#technicalAttributes").style.display = "block"

        let attributes = document.querySelectorAll("#keeperAttributes td input")

        attributes.forEach(element => {
            element.value = 5
        });

        let attributeCosts = document.querySelectorAll("#keeperAttributes td span.attributeCost")

        attributeCosts.forEach(element => {
            element.innerText = 0
        });

    } else {
        document.querySelector("#keeperAttributes").style.display = "block"
        document.querySelector("#technicalAttributes").style.display = "none"

        let attributes = document.querySelectorAll("#technicalAttributes td input")

        attributes.forEach(element => {
            element.value = 5
        });

        let attributeCosts = document.querySelectorAll("#technicalAttributes td span.attributeCost")

        attributeCosts.forEach(element => {
            element.innerText = 0
        });
    }
}

// Checks if numeric input falls within min/max
function inputCheck(element) {
    if (parseInt(element.value) > parseInt(element.max)) {
        element.value = element.max
    } else if (parseInt(element.value) < parseInt(element.min)) {
        element.value = element.min
    } else {
        // Do nothing
    }
}

// Calculates the cost of an attribute for the attribute tables
function attributeCost(control) {
    // console.log("#cost" + toCapital(control.id))
    // console.log(control.value)
    if (control == undefined) {
        // Do nothing
    } else if (control.value < 5 | control.value > 20 | control.id == "") {
        // Do nothing
    } else {
        document.querySelector("#cost" + toCapital(control.id)).innerText = costArray[control.value]
    }

    let cost = totalAttributeCost()

    document.querySelector("#spentTPE").innerText = cost
    document.querySelector("#remainingTPE").innerText =
        parseInt(document.querySelector("#currentTPE").innerText) +
        parseInt(document.querySelector("#earnedTPE").value) -
        cost
}

function totalAttributeCost() {
    let costs = document.querySelectorAll("[id^=cost]")

    let sum = 0
    costs.forEach(element => {
        let cost = +element.innerText
        sum += cost
    });

    return sum
}

// Function to gather the information from the form
function updateOutput() {


    // If a user has multiple players (retired + recreate), a number is added to the username which needs to be removed
    // let username = document.querySelector("#selectedPlayer").value.replace(/\.\d+$/, "")

    // Due to multiple players per user, select the player name instead
    let sel = document.querySelector("#selectedPlayer")
    let playername = sel.options[sel.selectedIndex].text

    const url = "https://api.simulationsoccer.com/player/getPlayer?name=" + playername

    const playerData = fetch(url)

    const total = document.querySelector("#currentTPE").innerText
    const earned = document.querySelector("#earnedTPE").value
    const spent = document.querySelector("#spentTPE").innerText
    const bank = document.querySelector("#remainingTPE").innerText

    let updateText = `${updateString}
[b]Earned TPE:[/b] ${total} + ${earned} = ${parseInt(total) + parseInt(earned)}
[b]Used TPE:[/b] ${spent} 
[b]Banked TPE:[/b] ${bank}

`
    playerData
        .then((response) => response.json())
        .then((data) => {
            const attributes = document.querySelectorAll('input[id*="out"]')

            attributes.forEach(element => {
                if (data[0].pos_gk == 20) {
                    if (element.closest("#keeperAttributes") != null |
                        element.closest("#mentalAttributes") != null |
                        element.closest("#physicalAttributes") != null) {
                        if (element.value != data[0][attributeArray[element.id.slice(3)]]) {
                            updateText +=
                                `${attributeArray[element.id.slice(3)]}: ${data[0][attributeArray[element.id.slice(3)]]} -> ${element.value} (${costArray[data[0][attributeArray[element.id.slice(3)]]] - costArray[element.value]})
`
                        }
                    }
                } else {
                    if (element.closest("#technicalAttributes") != null |
                        element.closest("#mentalAttributes") != null |
                        element.closest("#physicalAttributes") != null) {
                        if (element.value != data[0][attributeArray[element.id.slice(3)]]) {
                            updateText +=
                                `${attributeArray[element.id.slice(3)]}: ${data[0][attributeArray[element.id.slice(3)]]} -> ${element.value} (${costArray[data[0][attributeArray[element.id.slice(3)]]] - costArray[element.value]})
`
                        }
                    }
                }


            })


            Swal.fire({
                title: 'Update Summarized!',
                html: '<pre>' + updateText + '</pre>',
                icon: 'success',
                confirmButtonText: 'Copy text'
            }).then(function (isConfirm) {
                if (isConfirm) {
                    // Copy the text inside the text field
                    navigator.clipboard.writeText(updateText);
                } else {
                    // DO NOTHING
                }
            })
        })

    return false;
}


function submitCheck() {
    if (document.querySelector("#remainingTPE").innerText < 0) {

        Swal.fire({
            title: 'Too much TPE spent!',
            text: 'You have spent more TPE on your player than you have earned.',
            icon: 'error',
            confirmButtonText: 'OK'
        })

        document.querySelector("#remainingTPE").style = "border: 2px solid red;"

    } else {
        console.log("Checked and building")
        document.querySelector("#remainingTPE").style = "border: inherit;"

        updateOutput()
    }
}

function HandleDropdowns(element) {
    var value = element.value

    const otherSelect = document.querySelectorAll("select")

    otherSelect.forEach(otherElement => {
        if (otherElement.id != element.id) {
            var subValue = otherElement.value;
            if (subValue === value) { // if value is same reset
                otherElement.value = '';
                console.log('resetting ' + otherElement.id); // demo purpose
            }
        }
    });

}


// Attribute updater
function updateAttribute(element, data) {
    const keeperPattern = /K$/

    if (data[0].pos_gk == 20) {

        // Checks if the attribute is in the Keeper Attributes table and fills it if that is true
        if (element.closest("#keeperAttributes") != null |
            element.closest("#mentalAttributes") != null |
            element.closest("#physicalAttributes") != null) {
            element.value = data[0][attributeArray[element.id.slice(3)]]
        }

    } else {
        if (keeperPattern.test(element.id)) {
            // Do nothing
        } else {
            element.value = data[0][attributeArray[element.id.slice(3)]]
        }

    }

    if (element.id == "outNat" | element.id == "outSta") {
        // Do nothing
    } else {
        attributeCost(element)
    }
}

// Fetches the list of current players in the league
async function fetchListPlayers() {
    const url = "https://api.simulationsoccer.com/player/getAllPlayers"

    const data = fetch(url)

    data
        .then((response) => response.json())
        .then((data) => {
            const usernames = JSON.parse(data[0].username)
            const playernames = JSON.parse(data[0].name)

            const selectObject = document.querySelector('#selectedPlayer')

            for (const key in jsData) {
                // console.log(`${ key }: ${ jsData[key]}`)
                const option = document.createElement("option");
                option.text = playernames;
                option.value = usernames;
                selectObject.appendChild(option)
            }

            if (username != "Guest") { fetchPlayerInitial() } else { fetchPlayerSelected() }
        }
        )
}

// Fetches the build of the player whose user is logged in
async function fetchPlayerInitial() {
    const url = "https://api.simulationsoccer.com/player/getPlayer?username=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            // data contains in its [0] index, the javascript object with all information
            updateForm(data[0].pos_gk)

            document.querySelector("#currentTPE").innerText = data[0].tpe

            document.querySelector('option[value="' + username + '"]').selected = true

            const attributes = document.querySelectorAll('input[id*="out"]')

            attributes.forEach(element => updateAttribute(element, data))
        });

}

// Fetches the build of the player that is selected in the drop-down
async function fetchPlayerSelected() {
    // Removes .number from the value in case a user has a retired and active player
    // EDIT: Search instead for player name when a specific player has been selected, thereby not updating the selection 
    // let username = document.querySelector("#selectedPlayer").value.replace(/\.\d+$/, "")

    let choice = document.querySelector("#selectedPlayer")

    let playerName = choice.options[choice.selectedIndex].text;

    const url = "https://api.simulationsoccer.com/player/getPlayer?name=" + playername

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            // data contains in its [0] index, the javascript object with all information
            updateForm(data[0].Position)

            document.querySelector("#currentTPE").innerText = data[0].tpe

            // document.querySelector('option[value="' + username + '"]').selected = true

            const attributes = document.querySelectorAll('input[id*="out"]')

            attributes.forEach(element => updateAttribute(element, data))


        });

}


