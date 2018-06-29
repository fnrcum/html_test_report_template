var pass = 0,
    fail = 0,
    skip = 0,
    xpathError = 0,
    assertError = 0,
    browserError = 0,
    timeOutError = 0,
    onclickError = 0,
    otherError = 0,
    methods = [],
    seconds = [],
    totaltime = 0,
    from = 0,
    end = 49,
    page = 1,
    pageniationText = "page " + page + " of " + Math.ceil(data.length / 50);


// function showElementsIfInconsistent(elementList) {
//     var numberOfVisibleElements = 0,
//     numberOfHiddenElements = 0;
//     for(var i=0; i < elementList.length; i++) {
//         if(elementList[i].classList.contains("hide")) {
//             numberOfHiddenElements++;
//         } else {
//             numberOfVisibleElements++;
//         }
//     }
//     if(numberOfHiddenElements == 0 || numberOfVisibleElements == 0){
//         console.log("haha")
//         return;
//     }
//     if(numberOfHiddenElements > numberOfVisibleElements){
//         console.log("haha1")
//         for(var i=0; i < elementList.length; i++) {
//             if(!elementList[i].classList.contains("hide")) {
//                 elementList[i].classList.toggle("hide");
//             }
//         }
//     } else {
//         console.log("haha2")
//         for(var i=0; i < elementList.length; i++) {
//             if(elementList[i].classList.contains("hide")) {
//                 elementList[i].classList.toggle("hide");
//             }
//         }
//     }
//     return; 
// }

    
function removeNull(element) {
    return null == element ? "" : element
}

function getClassIndexForTable(string) {
    var index = 0;
    for (var val in data) {
        if (data[val].className === string){
            index++;
            break;
        }
        index++;
    }
    return index;
}

function checkClassStatus(checkedClass) {
    var status = "SUCCESS",
    prevStatus = "SUCCESS",
    correctClass = true;
    for (var value in data) {
        if (data[value].className !== checkedClass) {
            correctClass = false;
        } else {
            correctClass = true;
        }
        if (correctClass && data[value].status === "SUCCESS" && prevStatus === "SUCCESS") {
            status = "SUCCESS";
            prevStatus = status;
        } else if (correctClass && data[value].status === "SKIPPED" && (prevStatus === "SUCCESS" || !prevStatus === "FAILED")) {
            status = "SKIPPED";
            prevStatus = status;
        } else if (correctClass && data[value].status === "FAILED") {
            status = "FAILED";
            prevStatus = status;
        }
    }
    return status;
}

function addTableRowsFromJSON() {
    var element, table, node = document.getElementById("BodyRows"), 
        parentNode = node.parentNode;
    for (var value in data) {
        if (!document.getElementById(data[value].className)) {
            var indexHeader = getClassIndexForTable(data[value].className) - 1,
            headerTr = node.insertRow(indexHeader),
            tHeader= document.createElement("td"),
            classNameSplit = data[value].className.split(".").slice(-1)[0];

            tHeader.setAttribute("colspan", "7");
            tHeader.style = "cursor: pointer;"
            tHeader.className = checkClassStatus(data[value].className);
            tHeader.className += " middle_text boldText headerHeight collapse2";
            tHeader.id = data[value].className;
            tHeader.innerHTML = data[value].className
            headerTr.appendChild(tHeader);
            node.appendChild(headerTr);

        }
        element = node.insertRow()
        element.className = classNameSplit + " collapsableTable2 hide ";
        var status = removeNull(data[value].status);
        for ("SUCCESS" == status ? (element.className += "SUCCESS passedTest", pass += 1) : "FAILED" == status ? (element.className += "FAILED failTest", fail += 1, failedData(removeNull(data[value].exception))) : (element.className += "SKIPPED skipTest", skip += 1), switchOption = 0; switchOption < 7; switchOption++) {
            table = element.insertCell(element.cells.length);
            if (!element.classList.contains(classNameSplit)) {
                element.className += classNameSplit;
            }
            var info, innerElement = document.createElement("div");
            switch (switchOption) {
                case 0:
                    info = removeNull(data[value].count);
                    break;
                case 1:
                    info = removeNull(data[value].method), methods.push(info);
                    break;
                case 2:
                    info = removeNull(data[value].testParams)
                    break;
                case 3:
                    if(!(data[value].status === "FAILED")) {
                        info = "<div class='collapsible'>See More...</div><div class='content'>" + removeNull(data[value].testDescription) + "</div>";
                    } else {
                        info = removeNull(data[value].testDescription);
                    }
                    break;
                case 4:
                    var time = removeNull(data[value].time);
                    info = toSecond(time).toFixed(2), seconds.push(toSecond(time));
                    break;
                case 5:
                    info = removeNull(data[value].status);
                    break;
                case 6:
                    if(data[value].status === "SKIPPED") {
                        info = "<div class='collapsible'>See More...</div><div class='content'>" + removeNull(data[value].exception); + "</div>";
                    } else {
                        info = removeNull(data[value].exception);;
                    }
            }
            innerElement.innerHTML = info, 0 != switchOption && 1 != switchOption && 2 != switchOption || (innerElement.className = "class font15 middle_text"), 
            4 != switchOption && 5 != switchOption || (innerElement.className = "result font15 middle_text"), 
            3 != switchOption && 6 != switchOption || (innerElement.className = "font15"), table.appendChild(innerElement)
        }
    }
    parentNode.appendChild(node)
}

function status() {
    var errorChart = {
            type: "pie",
            data: {
                datasets: [{
                    data: [xpathError, assertError, browserError, timeOutError, onclickError, otherError],
                    backgroundColor: ["#f48642", "#6c8e5e", "#aeedf9", "#41c1f4", "#b6aef9", "#f4df41"],
                    label: "Dataset 1"
                }],
                labels: ["Unable to find element", "Assert Fail", "Unable to get browser", "Time Out Issue", "Unable to Click", "Others"]
            },
            options: {
                pieceLabel: {
                    render: "percentage",
                    fontColor: ["white", "white", "white"],
                    precision: 1,
                    fontSize: 11,
                    fontStyle: "bold",
                    overlap: !0
                },
                title: {
                    display: !1,
                    text: "Type of Exeptions"
                },
                legend: {
                    labels: {
                        boxWidth: 10,
                        padding: 5,
                        fontSize: 12
                    }
                }
            }
        },
        statusChart = {
            type: "pie",
            data: {
                datasets: [{
                    data: [pass, fail, skip],
                    backgroundColor: ["#82b74b", "#f7786b", "#ffcc5c"],
                    label: "Dataset 1"
                }],
                labels: ["PASSED", "FAILED", "SKIPPED"]
            },
            options: {
                pieceLabel: {
                    render: "percentage",
                    fontColor: ["white"],
                    precision: 1,
                    fontSize: 11,
                    fontStyle: "bold",
                    overlap: !0
                },
                title: {
                    display: !1,
                    text: "Total Test Result"
                },
                legend: {
                    labels: {
                        boxWidth: 25,
                        padding: 7,
                        fontSize: 12
                    }
                }
            }
        },
    statusChartLocation = document.getElementById("test-status").getContext("2d");
    window.myPie = new Chart(statusChartLocation, statusChart);
    var errorChartLocation = document.getElementById("fail-result").getContext("2d");
    window.myPie = new Chart(errorChartLocation, errorChart)
}

function StatusTable() {
    var element = document.getElementById("statusTable"),
        table = element.insertRow(1);
    table.setAttribute("style", "background-color: #8cf2a2;");
    var passCell = table.insertCell(0),
        passValueCell = table.insertCell(1);
    passCell.innerHTML = "Passed", passValueCell.innerHTML = pass;
    passCell.id = "PassFilter";
    var row = element.insertRow(2);
    row.setAttribute("style", "background-color: #f7786b;");
    var failedCell = row.insertCell(0),
        failedValueCell = row.insertCell(1);
    failedCell.innerHTML = "Failed", failedValueCell.innerHTML = fail;
    failedCell.id = "FailedFilter";
    var row2 = element.insertRow(3);
    row2.setAttribute("style", "background-color: #f9ef7f;");
    var skippedCell = row2.insertCell(0),
        skippedValueCell = row2.insertCell(1);
    skippedCell.innerHTML = "SKIPPED", skippedValueCell.innerHTML = skip;
    skippedCell.id = "SkippedFilter";
    var row3 = element.insertRow(4);
    row3.setAttribute("style", "background-color: #87cefa;");
    var totalCell = row3.insertCell(0),
        totalValueCell = row3.insertCell(1);
    totalCell.innerHTML = "Total", totalValueCell.innerHTML = skip + pass + fail;
    var parsedMillis = parseMillisecondsIntoReadableTime(totaltime);
    document.getElementById("time").innerHTML = parsedMillis
    // expandTestsWithStatus();
}

function toSecond(value) {
    return totaltime += parseInt(value), parseInt(value) / 1e3
}

function parseMillisecondsIntoReadableTime(e) {
    var t = e / 36e5,
        a = Math.floor(t),
        o = a > 9 ? a : "0" + a,
        r = 60 * (t - a),
        n = Math.floor(r),
        l = n > 9 ? n : "0" + n,
        i = 60 * (r - n),
        d = Math.floor(i);
    return o + ":" + l + ":" + (d > 9 ? d : "0" + d)
}

function failedData(data) {
    data.indexOf("Unable to find element with") > -1 || data.indexOf("Cannot locate element with text") > -1 ? xpathError += 1 : data.indexOf("expected [") > -1 && data.indexOf("but found [") > -1 ? assertError += 1 : data.indexOf("Unable to get browser") > -1 ? browserError += 1 : data.indexOf("Timed out after") > -1 ? timeOutError += 1 : data.indexOf("Cannot click on element") > -1 ? onclickError += 1 : otherError += 1
}

function lineGraph(e, t) {
    var lineChartHolder = document.getElementById("canHolder"),
        o = document.getElementById("myChart");
    o.parentElement.removeChild(o);
    var r = document.createElement("canvas");
    r.id = "myChart", lineChartHolder.appendChild(r);
    var n = document.getElementById("myChart"),
        l = {
            labels: methods.slice(e, t),
            datasets: [{
                label: "Execution Time (S) / Test",
                fill: !0,
                lineTension: .1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "#42a1f4",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 3,
                pointHitRadius: 5,
                data: seconds.slice(e, t),
                borderWidth: 1
            }]
        };
    Chart.Line(n, {
        data: l,
        options: {
            showLines: !0,
            scales: {
                xAxes: [{
                    ticks: {
                        display: !1
                    }
                }],
                yAxes: [{
                    ticks: {
                        display: !0
                    }
                }]
            }
        }
    })
}

function pagintion(e) {
    "next" === e ? (from = 50 * page, end = 50 * (page + 1) - 1, document.getElementById("back").disabled = !1, page++) : (end = 50 * --page - 1, from = 50 * (page - 1), document.getElementById("front").disabled = !1), end >= data.length && (end = data.length, from = 50 * (page - 1), document.getElementById("front").disabled = !0), from <= 0 && (from = 0, end = 49, document.getElementById("back").disabled = !0), lineGraph(from, end), pageniationText = "page " + page + " of " + Math.ceil(methods.length / 50), document.getElementById("size").value = pageniationText
}

// TODO Do not remove this
// function autoRefresh() {
//     var e = document.getElementById("myCheck");
//     document.getElementById("text");
//     1 == e.checked ? timeout = setTimeout("location.reload(true);", 5e3) : clearTimeout(timeout)
// }

function expandable() {
    var coll = document.getElementsByClassName("collapsible");
	var i;

	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
			this.classList.toggle("active");
			var content = this.nextElementSibling;
			if (content.style.display === "block") {
				content.style.display = "none";
				this.innerText = "See More...";
			} else {
				content.style.display = "block";
				this.innerText = "See Less...";
			}
		});
	} 
}

function expandableResults() {
    var coll = document.getElementsByClassName("collapse2");
    for(var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            var collapsibleTableElements = document.getElementsByClassName(this.id.split(".").slice(-1)[0]);
            // showElementsIfInconsistent(collapsibleTableElements);
            for(i = 0; i < collapsibleTableElements.length; i++){
                if (!collapsibleTableElements[i].classList.contains("hide")) {
                    collapsibleTableElements[i].classList.toggle("hide");
                } else {
                    collapsibleTableElements[i].classList.toggle("hide");
                }
            }
        })
    }
} 

window.addEventListener("load", function() {
    addTableRowsFromJSON(), 
    status(), 
    lineGraph(0, 49), 
    document.getElementById("size").value = pageniationText, 
    data.length < 51 && (document.getElementById("front").disabled = !0), 
    // autoRefresh(), DO NOT REMOVE THIS
    expandable(),
    expandableResults();
    
});

// function expandTestsWithStatus() {
//     var passFilter = document.getElementById("PassFilter"),
//     failFilter = document.getElementById("FailedFilter"),
//     skipFilter = document.getElementById("SkippedFilter");

//     console.log(passFilter);

//     passFilter.addEventListener("click", function() {
//         var passedTableElements = document.getElementsByClassName("passedTest");
//         for(i = 0; i < passedTableElements.length; i++){
//             if (!passedTableElements[i].classList.contains("hide")) {
//                 passedTableElements[i].classList.toggle("hide");
//             } else {
//                 passedTableElements[i].classList.toggle("hide");
//             }
//         }
//     })
//     failFilter.addEventListener("click", function() {
//         var passedTableElements = document.getElementsByClassName("failTest");
//         for(i = 0; i < passedTableElements.length; i++){
//             if (!passedTableElements[i].classList.contains("hide")) {
//                 passedTableElements[i].classList.toggle("hide");
//             } else {
//                 passedTableElements[i].classList.toggle("hide");
//             }
//         }
//     })
//     skipFilter.addEventListener("click", function() {
//         var passedTableElements = document.getElementsByClassName("skipTest");
//         for(i = 0; i < passedTableElements.length; i++){
//             if (!passedTableElements[i].classList.contains("hide")) {
//                 passedTableElements[i].classList.toggle("hide");
//             } else {
//                 passedTableElements[i].classList.toggle("hide");
//             }
//         }
//     })
// };

// function search() {
//     var searchValue, tableRows;
//     searchValue = document.getElementById("myInput").value.toUpperCase();
//     for (var line = 1, numberOfRows = (tableRows = document.getElementById("MainTable")).rows.length; line < numberOfRows - 1; line++) {
//         var strLen = !1;
//         if (searchValue) {
//             for (var line2 = 0, numberOfRows2 = tableRows.rows[line].cells.length; line2 < numberOfRows2; line2++)
//                 if (tableRows.rows[line].cells[line2].children[0].innerHTML.toUpperCase().indexOf(searchValue) > -1) {
//                     strLen = !0;
//                     break
//                 }
//             tableRows.rows[line].style.display = strLen ? "" : "none"
//         } else tableRows.rows[line].style.display = ""
//     }
// }