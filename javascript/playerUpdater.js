const costArray = { 5: 0, 6: 2, 7: 4, 8: 8, 9: 12, 10: 16, 11: 22, 12: 28, 13: 34, 14: 46, 15: 58, 16: 70, 17: 88, 18: 106, 19: 131, 20: 156 }

const attributeArray = {
    Acc: "Acceleration", Agi: "Agility", Bal: "Balance", Jmp: "Jumping Reach", Nat: "Natural Fitness", Pac: "Pace", Sta: "Stamina", Str: "Strength", Agg: "Aggression", Ant: "Anticipation", Bra: "Bravery", Cmp: "Composure", Con: "Concentration", Dec: "Decisions", Det: "Determination", Fla: "Flair", Lea: "Leadership", Otb: "Off the Ball", Pos: "Positioning", Tea: "Teamwork", Vis: "Vision", Wrk: "Work Rate", Cor: "Corners", Cro: "Crossing", Dri: "Dribbling", Fin: "Finishing", Fst: "First Touch", FstK: "First Touch", Frk: "Free Kick", FrkK: "Free Kick", Hea: "Heading", Lsh: "Long Shots", Lth: "Long Throws", Mar: "Marking", Pas: "Passing", PasK: "Passing", Pen: "Penalty Taking", PenK: "Penalty Taking", Tck: "Tackling", Tec: "Technique", TecK: "Technique", Aer: "Aerial Reach", Coa: "Command of Area", Com: "Communication", Ecc: "Eccentricity", Han: "Handling", Kic: "Kicking", Ooo: "One on Ones", Ref: "Reflexes", Ttr: "Tendency to Rush", Ttp: "Tendency to Punch", Thr: "Throwing"
}

// Capitalize first letter in string
function toCapital(string) {
    return string[0].toUpperCase() + string.slice(1)
}

// Updates the attribute form based on player type
function updateForm(control) {
    if (control.id == "keeper") {
        document.querySelector("#keeperAttributes").style.display = "block"
        document.querySelector("#technicalAttributes").style.display = "none"
        document.querySelector("#outfieldExtra").style.display = "none"

        let outfieldExtras = document.querySelectorAll("#outfieldExtra select")

        outfieldExtras.forEach(element => {
            element.value = null
            element.required = false
        })

        let attributes = document.querySelectorAll("#keeperAttributes td input")

        attributes.forEach(element => {
            element.value = 5
        });

        let attributeCosts = document.querySelectorAll("#keeperAttributes td span.attributeCost")

        attributeCosts.forEach(element => {
            element.innerText = 0
        });

    } else {
        document.querySelector("#keeperAttributes").style.display = "none"
        document.querySelector("#technicalAttributes").style.display = "block"
        document.querySelector("#outfieldExtra").style.display = "block"


        let outfieldExtras = document.querySelectorAll("#outfieldExtra select")

        outfieldExtras.forEach(element => {
            element.required = true
        })

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
    document.querySelector("#remainingTPE").innerText = document.querySelector("#currentTPE").innerText + document.querySelector("#earnedTPE").innerText - cost
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

function anyRequiredEmpty() {
    const required = document.getElementById("playerCreator").querySelectorAll("[required]")

    const requiredArr = Array.prototype.slice.call(required)

    const isEmpty = (element) => element.value === "";

    const anyEmpty = requiredArr.some(isEmpty)

    return anyEmpty
}


// Function to gather the information from the form
function submitForm(formElement) {
    const formData = new FormData(formElement)
    const allEntries = [...formData.entries()]
        .reduce((all, entry) => {
            all[entry[0]] = entry[1]
            return all
        }, {})
    console.log(allEntries)

    if (allEntries.footedness == "right") {
        allEntries.footedness = "10 | 20"
    } else {
        allEntries.footedness = "20 | 10"
    }

    const positions = { ld: 0, cd: 0, rd: 0, lwb: 0, cdm: 0, rwb: 0, lm: 0, cm: 0, rm: 0, lam: 0, cam: 0, ram: 0, st: 0 }

    if (allEntries.playerType == "goalkeeper") {
        allEntries.posPrim = "GK"
    } else {
        positions[allEntries.posPrim] = 20
        positions[allEntries.posSec1] = 15
        positions[allEntries.posSec2] = 15
    }

    let textOutput =
        `[size=7][u][b]Player Details[/b][/u][/size]
First Name: ${allEntries.firstName}
Last Name: ${allEntries.lastName}
Discord: ${allEntries.discordUsername}
Birthplace: ${allEntries.birthplace}
Height: ${allEntries.height}
Weight: ${allEntries.weight}
Preferred Foot: ${allEntries.footedness}
Preferred Position: ${allEntries.posPrim.toUpperCase()}

[size=7][u][b]Cosmetics[/b][/u][/size]
Hair Color: ${allEntries.hairColor}
Hair Length: ${allEntries.hairLength}
Skin Tone: ${allEntries.skinColor}

[size=7][u][b]Player Attributes[/b][/u][/size]
TPE Available: ${allEntries.totalTPE - totalAttributeCost()}

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

    if (allEntries.playerType == "goalkeeper") {
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
Technique: ${allEntries.tTec}

[u][b]Positional Experience[/b][/u]
Striker: ${positions.st}
Attacking Midfielder [L]: ${positions.lam}
Attacking Midfielder [C]: ${positions.cam}
Attacking Midfielder [R]: ${positions.ram}
Midfielder [L]: ${positions.lm}
Midfielder [C]: ${positions.cm}
Midfielder [R]: ${positions.rm}
Wingback [L]: ${positions.lwb}
Defensive Midfielder [C]: ${positions.cdm}
Wingback [R]: ${positions.rwb}
Defense [L]: ${positions.ld}
Defense [C]: ${positions.cd}
Defense [R]: ${positions.rd}

[u][b]Traits[/b][/u]
Trait 1: ${allEntries.trait1}
Trait 2: ${allEntries.trait2}`

        textOutput += addition
    }

    document.querySelector("#CODE").innerHTML = textOutput

    return false;
}


function submitCheck() {
    if (anyRequiredEmpty()) {
        alert("You must fill out all required fields.")
        const required = document.getElementById("playerCreator").querySelectorAll("[required]")

        required.forEach(element => {
            if (element.value == "") {
                element.style = "border: 2px solid red;"
            } else {
                element.style = "border: inherit;"
            }
        })
    } else if (document.querySelector("#remainingTPE").innerText < 0) {

        alert("You have spent too much TPE on your build.")

        document.querySelector("#remainingTPE").style = "border: 2px solid red;"

    } else if (document.querySelector("#remainingTPE").innerText > 150) {

        alert("You have more than 150 TPE left to spend on your player.")

    } else {
        const required = document.getElementById("playerCreator").querySelectorAll("[required]")

        required.forEach(element => {
            element.style = "border: inherit;"
        })

        document.querySelector("#remainingTPE").style = "border: inherit;"

        submitForm(document.querySelector("#playerCreator"))

        document.querySelector("#popupButton").click()
    }
}


document.querySelector("#createButton").addEventListener("click", submitCheck);

function copyText() {
    // Get the text field
    var copyText = document.querySelector("#CODE");

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.innerText);

    // Alert the copied text
    alert("Copied the text");
}


$('select').on('change', function () {
    HandleDropdowns($(this));
});

function HandleDropdowns(element) {
    var $element = element;
    var value = $element.val();

    $.each($('select').not($element), function () { //loop all remaining select elements
        var subValue = $(this).val();
        if (subValue === value) { // if value is same reset
            $(this).val('');
            console.log('resetting ' + $(this).attr('id')); // demo purpose
        }
    });
}

async function fetchListPlayers() {
    const url = "https://api.simulationsoccer.com/ssl/listPlayers"

    const data = fetch(url)

    data
        .then((response) => response.json())
        .then((data) => {
            const selectObject = document.querySelector('#selectedPlayer')

            data.forEach(element => {
                const option = document.createElement("option");
                option.text = element;
                selectObject.appendChild(option)
            }
            )
        }
        )
}


async function fetchPlayerInitial() {
    const url = "https://api.simulationsoccer.com/ssl/getPlayer?username=" + username

    const playerData = fetch(url)

    playerData
        .then((response) => response.json())
        .then((data) => {
            // data contains in its [0] index, the javascript object with all information
            document.querySelector("#currentTPE").innerText = data[0].TPE

            document.querySelector('option[value="' + data[0].Name + '"]').selected = true

            const attributes = document.querySelectorAll('input[id*="out"]')

            attributes.forEach(element => {
                const keeperPattern = /K$/

                if (data[0].Position == "Goalkeeper") {
                    if (keeperPattern.test(element.id)) {
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
            })
        });

}


