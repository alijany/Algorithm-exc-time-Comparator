import "./style/costume.scss";
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/collapse';

import { chart } from './lib/chart';
import { editor } from './lib/editor';
import { algorithms } from './algorithms/algorithmsLoader';

import RunWorker from "./run.worker";

// ***************************
function sendToWorker(massage) {
    runWorker.postMessage(massage);
    return new Promise(resolve => { sendToWorker.resolve = resolve });
}

function createWorker() {
    runWorker = new RunWorker();
    runWorker.onmessage = function (response) {
        sendToWorker.resolve(response.data);
    };
}
// ***************************

var $algoList = $("#mainAlgorithm");
var $loopCount = $("#inputLoop");
var mainAlgorithm = 0;
var loopCount;
var runWorker;
var switchAlgorithm = false;
var series = [];
var spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

// editor functions -----

function getCurrentAlgo() {
    return algorithms[mainAlgorithm].main;
}

function setCurrentAlgo(index) {
    switchAlgorithm = true;
    editor.setValue(algorithms[index].main);
    mainAlgorithm = index;
}

function appendAlgorithmsToList() {
    var temp = '';
    algorithms.forEach((algo, index) => {
        temp += `<a class="dropdown-item" data-val="${index}" href="#">${algo.name}</a>`
    });
    $algoList.append($(temp));
}

function updateSeries() {
    series = [];
    algorithms.forEach(algo => {
        if (algo.series)
            series.push(algo.series);
    });
}

function clearSeries() {
    algorithms.forEach(algo => algo.series = undefined);
    chart.updateSeries([], false);
}

// chart function -------
function appendToChart(time) {
    algorithms[mainAlgorithm].series.data.push(time);
    return chart.updateSeries(series, false);
}

// execution function -----

function resetMainSeries() {
    var newSeries = [];
    algorithms[mainAlgorithm].series = { name: algorithms[mainAlgorithm].name, data: [] };
    algorithms.forEach(algo => {
        if (algo.series) {
            newSeries.push(algo.series);
        }
    });
    series = newSeries;
}

function cancel() {
    runWorker.terminate();
    createWorker();
    $("#Run").off('click').click(exec).html('Run');
}

async function exec() {
    $("#Run").off('click').click(cancel).html(spinner + ' Cancel');

    resetMainSeries();
    await sendToWorker(getCurrentAlgo());

    for (let i = 0; i < loopCount; i++) {
        var time = await sendToWorker();
        await appendToChart(time.toFixed(3));
    }

    $("#Run").off('click').click(exec).text('Run');
}

async function execAll() {
    for (var index = 0; index < algorithms.length; index++) {
        setCurrentAlgo(index);
        await exec();
    }
}

// initialize user interface ---

loopCount = $loopCount.val();
createWorker();
appendAlgorithmsToList();
editor.setValue(getCurrentAlgo());
updateSeries();
chart.updateSeries(series, false);


// event listeners --------------

$("#loader").removeClass("d-flex").hide();

$("#Ok").click(function () {
    loopCount = $loopCount.val();
});

$("#mainAlgorithm").on('click', 'a', function () {
    var index = this.getAttribute("data-val");
    setCurrentAlgo(index);
});

$("#run-all").on('click', execAll);

$("#clear-chart").on('click', clearSeries);

$("#display-chart").on('click', () => {
    $("#chart-col").show();
    $("#output-col").hide();
});

$("#display-output").on('click', () => {
    $("#output-col").show();
    $("#chart-col").hide();
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
