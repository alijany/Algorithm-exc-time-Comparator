import "./style/costume.scss";
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/collapse';

import { chart } from './lib/chart';
import { editor } from './lib/editor';
import { algorithms } from './algorithms/algorithmsLoader';

import RunWorker from "./run.worker";
const runWorker = new RunWorker();

// ***************************
function sendToWorker(massage) {
    runWorker.postMessage(massage);
    return new Promise(resolve => { sendToWorker.resolve = resolve });
}

runWorker.onmessage = function (response) {
    sendToWorker.resolve(response.data);
}
// ***************************

var mainAlgorithm = 0;
var $algoList = $("#mainAlgorithm");
var $loopCount = $("#inputLoop");
var loopCount = $loopCount.val();

function getCurrentAlgo() {
    return algorithms[mainAlgorithm].main;
}

function appendAlgorithmsToList() {
    var temp = '';
    algorithms.forEach((algo, index) => {
        temp += `<a class="dropdown-item" data-val="${index}" href="#">${algo.name}</a>`
    });
    $algoList.append($(temp));
}


function resetMainSeries() {
    var newSeries = [];
    algorithms[mainAlgorithm].series = { name: algorithms[mainAlgorithm].name, data: [] };
    algorithms.forEach(algo => {
        if (algo.series) {
            newSeries.push(algo.series);
        }
    });
    return newSeries;
}

function appendToChart(time, newSeries) {
    algorithms[mainAlgorithm].series.data.push(time);
    return chart.updateSeries(newSeries, false);
}

async function exec() {
    $(this).prop("disabled", true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> in process...');

    var newSeries = resetMainSeries();
    await sendToWorker(getCurrentAlgo());

    for (let i = 0; i < loopCount; i++) {
        var time = await sendToWorker();
        await appendToChart(time.toFixed(3), newSeries);
    }

    $(this).prop("disabled", false).text('run');
}

appendAlgorithmsToList();
editor.setValue(getCurrentAlgo());

var newSeries = [];
algorithms.forEach(algo => {
    if (algo.series)
        newSeries.push(algo.series);
});
chart.updateSeries(newSeries, false);

$("#loader").removeClass("d-flex").hide();

$("#Ok").click(function () {
    loopCount = $loopCount.val();
});

var switchAlgorithm = false;
$("#mainAlgorithm").on('click', 'a', function () {
    var key = this.getAttribute("data-val");
    switchAlgorithm = true;
    editor.setValue(algorithms[key].main);
    mainAlgorithm = key;
});

editor.on("change", function () {
    if (switchAlgorithm) {
        switchAlgorithm = false;
        $("#Update").prop("disabled", true).html('Update');
    } else {
        $("#Update").prop("disabled", false).html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Update');
    }
});

$("#Update").click(function () {
    algorithms[mainAlgorithm].main = editor.getValue();
    $("#Update").prop("disabled", true).html('Update');
});


$("#Run").click(exec);
