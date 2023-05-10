const costArray = { 5: 0, 6: 2, 7: 4, 8: 8, 9: 12, 10: 16, 11: 22, 12: 28, 13: 34, 14: 46, 15: 58, 16: 70, 17: 88, 18: 106, 19: 131, 20: 156 }

const attributeArray = {
    Acc: "Acceleration", Agi: "Agility", Bal: "Balance", Jmp: "Jumping Reach", Nat: "Natural Fitness", Pac: "Pace", Sta: "Stamina", Str: "Strength", Agg: "Aggression", Ant: "Anticipation", Bra: "Bravery", Cmp: "Composure", Con: "Concentration", Dec: "Decisions", Det: "Determination", Fla: "Flair", Lea: "Leadership", Otb: "Off the Ball", Pos: "Positioning", Tea: "Teamwork", Vis: "Vision", Wrk: "Work Rate", Cor: "Corners", Cro: "Crossing", Dri: "Dribbling", Fin: "Finishing", Fst: "First Touch", FstK: "First Touch", Frk: "Free Kick", FrkK: "Free Kick", Hea: "Heading", Lsh: "Long Shots", Lth: "Long Throws", Mar: "Marking", Pas: "Passing", PasK: "Passing", Pen: "Penalty Taking", PenK: "Penalty Taking", Tck: "Tackling", Tec: "Technique", TecK: "Technique", Aer: "Aerial Reach", Coa: "Command of Area", Com: "Communication", Ecc: "Eccentricity", Han: "Handling", Kic: "Kicking", Ooo: "One on Ones", Ref: "Reflexes", Ttr: "Tendency to Rush", Ttp: "Tendency to Punch", Thr: "Throwing"
}

// Capitalize first letter in string
function toCapital(string) {
    return string[0].toUpperCase() + string.slice(1)
}

// Updates the attribute tables based on the selected player position
function updateForm(position) {
    if (position != "Goalkeeper") {
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
    let username = document.querySelector("#selectedPlayer").value

    const url = "https://api.simulationsoccer.com/ssl/getPlayer?username=" + username

    const playerData = fetch(url)

    const total = document.querySelector("#currentTPE").innerText
    const earned = document.querySelector("#earnedTPE").value
    const spent = document.querySelector("#spentTPE").innerText
    const bank = document.querySelector("#remainingTPE").innerText

    var numRows = getRowsInUpdateTable();
    var updateString = "";

    for (var i = 1; i < numRows; i++) {
        updateString += "[url=" + $('#' + i + 'link').val() + "]" + '+ ' + $('#' + i + 'uncappedTpe').val() + ' TPE - ' + $('#' + i + 'task').val() + "[/url]\n";
    }

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
                if (data[0].Position == "Goalkeeper") {
                    if (element.closest("#keeperAttributes") != null |
                        element.closest("#mentalAttributes") != null |
                        element.closest("#physicalAttributes") != null) {
                        if (element.value != data[0][attributeArray[element.id.slice(3)]]) {
                            updateText +=
                                `${attributeArray[element.id.slice(3)]}: ${data[0][attributeArray[element.id.slice(3)]]} -> ${element.value}
`
                        }
                    }
                } else {
                    if (element.closest("#technicalAttributes") != null |
                        element.closest("#mentalAttributes") != null |
                        element.closest("#physicalAttributes") != null) {
                        if (element.value != data[0][attributeArray[element.id.slice(3)]]) {
                            updateText +=
                                `${attributeArray[element.id.slice(3)]}: ${data[0][attributeArray[element.id.slice(3)]]} -> ${element.value}
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

// Function to gather the information for the player page data
function pageOutput() {
    let username = document.querySelector("#selectedPlayer").value

    const url = "https://api.simulationsoccer.com/ssl/getPlayer?username=" + username

    const playerData = fetch(url)

    const bank = document.querySelector("#remainingTPE").innerText

    let inputs = document.querySelectorAll('.playerBuild input')

    let allEntries = {}

    inputs.forEach(element => {
        allEntries[element.name] = element.value
    });

    playerData
        .then((response) => response.json())
        .then((data) => {
            let textOutput = `[size=7][u][b]Player Attributes[/b][/u][/size]
TPE Available: ${bank}
            
[u][b]Physical[/b][/u]
Acceleration: ${allEntries.pAcc}
Agility: ${allEntries.pAgi}
Balance: ${allEntries.pBal}
Jumping Reach: ${allEntries.pJmp}
Natural Fitness: ${allEntries.pNat}
Pace: ${allEntries.pPac}
Stamina: ${allEntries.pSta}
Strength: ${allEntries.pStr}

[u][b]Mental[/b][/u]
Aggression: ${allEntries.mAgg}
Anticipation: ${allEntries.mAnt}
Bravery: ${allEntries.mBra}
Composure: ${allEntries.mCmp}
Concentration: ${allEntries.mCon}
Decisions: ${allEntries.mDec}
Determination: ${allEntries.mDet}
Flair: ${allEntries.mFla}
Leadership: ${allEntries.mLea}
Off the Ball: ${allEntries.mOtb}
Positioning: ${allEntries.mPos}
Teamwork: ${allEntries.mTea}
Vision: ${allEntries.mVis}
Work Rate: ${allEntries.mWrk}

`

            if (data[0].Position == "Goalkeeper") {
                let addition =
                    `[u][b]Goalkeeping[/b][/u]
Aerial Reach: ${allEntries.kAer}
Command of Area: ${allEntries.kCoa}
Communication: ${allEntries.kCom}
Eccentricity: ${allEntries.kEcc}
Handling: ${allEntries.kHan}
Kicking: ${allEntries.kKic}
One on Ones: ${allEntries.kOoo}
Reflexes: ${allEntries.kRef}
Tendency to Rush: ${allEntries.kRus}
Tendency to Punch: ${allEntries.kPun}
Throwing: ${allEntries.kThr}
First Touch: ${allEntries.kFst}
Free Kick: ${allEntries.kFrk}
Passing: ${allEntries.kPas}
Penalty Taking: ${allEntries.kPen}
Technique: ${allEntries.kTec}`

                textOutput += addition
            } else {
                let addition =
                    `[u][b]Technical[/b][/u]
Corners: ${allEntries.tCor}
Crossing: ${allEntries.tCro}
Dribbling: ${allEntries.tDri}
Finishing: ${allEntries.tFin}
First Touch: ${allEntries.tFst}
Free Kick: ${allEntries.tFrk}
Heading: ${allEntries.tHea}
Long Shots: ${allEntries.tLsh}
Long Throws: ${allEntries.tLth}
Marking: ${allEntries.tMar}
Passing: ${allEntries.tPas}
Penalty Taking: ${allEntries.tPen}
Tackling: ${allEntries.tTck}
Technique: ${allEntries.tTec}`

                textOutput += addition
            }

            Swal.fire({
                title: 'New Player Page!',
                html: '<pre>' + textOutput + '</pre>',
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

function playerPageCheck() {
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

        pageOutput()
    }
}

// document.querySelector("#summaryButton").addEventListener("click", submitCheck);


function updateEarnedTPE() {
    const allEarnings = document.querySelectorAll("[id$='uncappedTpe']")
    const earnedTPE = document.querySelector("#earnedTPE")

    var sum = 0

    allEarnings.forEach(element => sum += parseInt(element.value))

    earnedTPE.value = sum

    attributeCost()
}

function addRow() {
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

    if (data[0].Position == "Goalkeeper") {

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
    const url = "https://api.simulationsoccer.com/ssl/listPlayers"

    const data = fetch(url)

    data
        .then((response) => response.json())
        .then((data) => {
            const jsData = JSON.parse(data)

            const selectObject = document.querySelector('#selectedPlayer')

            for (const key in jsData) {
                // console.log(`${ key }: ${ jsData[key]}`)
                const option = document.createElement("option");
                option.text = jsData[key];
                option.value = key;
                selectObject.appendChild(option)
            }

            if (username != "Guest") { fetchPlayerInitial() } else { fetchPlayerSelected() }
        }
        )
}

// Fetches the build of the player whose user is logged in
async function fetchPlayerInitial() {
    const url = "https://api.simulationsoccer.com/ssl/getPlayer?username=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            // data contains in its [0] index, the javascript object with all information
            updateForm(data[0].Position)

            document.querySelector("#currentTPE").innerText = data[0].TPE

            document.querySelector('option[value="' + username + '"]').selected = true

            const attributes = document.querySelectorAll('input[id*="out"]')

            attributes.forEach(element => updateAttribute(element, data))
        });

}

// Fetches the build of the player that is selected in the drop-down
async function fetchPlayerSelected() {
    // Removes .number from the value in case a user has a retired and active player
    let username = document.querySelector("#selectedPlayer").value.replace(/\.\d+$/, "")

    const url = "https://api.simulationsoccer.com/ssl/getPlayer?username=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            // data contains in its [0] index, the javascript object with all information
            updateForm(data[0].Position)

            document.querySelector("#currentTPE").innerText = data[0].TPE

            document.querySelector('option[value="' + username + '"]').selected = true

            const attributes = document.querySelectorAll('input[id*="out"]')

            attributes.forEach(element => updateAttribute(element, data))


        });

}


