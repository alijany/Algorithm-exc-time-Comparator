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
        temp += `<option value="${index}">${algo.name}</option>`
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
    $(this).prop("disabled", true);
    $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> in process...');

    var newSeries = resetMainSeries();
    await sendToWorker(getCurrentAlgo());

    for (let i = 0; i < loopCount; i++) {
        var time = await sendToWorker();
        await appendToChart(time.toFixed(3), newSeries);
    }

    $(this).prop("disabled", false);
    $(this).text('run');
}

appendAlgorithmsToList();
editor.setValue(getCurrentAlgo());

var newSeries = [];
algorithms.forEach(algo => {
    if (algo.series)
        newSeries.push(algo.series);
});
chart.updateSeries(newSeries, false);

$("#Ok").click(function () {
    var key = $algoList.val();
    editor.setValue(algorithms[key].main);
    mainAlgorithm = key;

    loopCount = $loopCount.val();
});

$("#Update").click(function () {
    algorithms[mainAlgorithm].main = editor.getValue();
    $("#Update").prop("disabled", true);
    $("#Update").html('Update');
});

editor.on("change", function () {
    $("#Update").prop("disabled", false);
    $("#Update").html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Update');
});


$("#Run").click(exec);
