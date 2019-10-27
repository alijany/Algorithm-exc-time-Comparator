import "./style/costume.scss";
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/collapse';

import {
    chart
} from './lib/chart';
import {
    editor
} from './lib/editor';
import {
    algorithms
} from './algorithms/algorithmsLoader';
import defaultAlgo from '!!raw-loader!./algorithms/default.js';

import RunWorker from "./run.worker";

// ***************************
function sendToWorker(massage) {
    runWorker.postMessage(massage);
    return new Promise(resolve => {
        sendToWorker.resolve = resolve
    });
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
var $logList = $("#log-list");
var currentAlgo = 0;
var loopCount = $loopCount.val();
var runWorker;
var algorithmIsSwitched = false;
var series = [];
var spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

// editor functions -----

function getAlgo(prop = "main", index = currentAlgo) {
    return algorithms[index][prop];
}

function setAlgo(value, prop = "main", index = currentAlgo) {
    algorithms[index][prop] = value;
}

function changeAlgoTo(index) {
    algorithmIsSwitched = true;
    editor.setValue(algorithms[index].main);
    currentAlgo = index;
}

// ninja function :P
function switchAlgo(index, el) {
    var isVisible = getAlgo("visible", index) ? "-slash" : "";
    el.html(`<i class="far fa-eye${isVisible}"></i>`)
        .next().prop('disabled', function (i, v) {
            return !v;
        });;
    setAlgo(!isVisible, "visible", index);
}

function appendAlgoToList() {
    var temp = '';
    algorithms.forEach((algo, index) => {
        var isVisible = algo.visible ? "" : "-slash";
        temp += `
        <div class="btn-group w-100" data-val="${index}">
            <button class="btn btn-light remove"><i class="far fa-eye${isVisible}"></i></button>
            <button class="dropdown-item select">${algo.name}</button>
        </div>
        `
    });
    $algoList.html($(temp));
}

function addAlgo(name, visible) {
    var index = algorithms.push({
        name: name,
        main: defaultAlgo,
        series: undefined,
        visible: visible
    });
    appendAlgoToList();
    changeAlgoTo(index - 1);
}

function updateSeries() {
    series = [];
    algorithms.forEach(algo => {
        if (algo.series)
            series.push(algo.series);
    });
}

// main functions --------
function clear() {
    algorithms.forEach(algo => algo.series = undefined);
    chart.updateSeries([], false);
    $logList.text("");
}

function log(data, info, type = "") {
    var infoEl = `<span class="float-right">${info}</span>`
    $logList.append(`<li class="list-group-item ${type}">${data + infoEl}</li>`);
}

// chart function -------
function appendToChart(time) {
    getAlgo("series").data.push(time);
    return chart.updateSeries(series, false);
}

// execution function -----

function resetMainSeries() {
    var newSeries = [];
    setAlgo({
        data: [],
        name: getAlgo("name")
    }, "series");
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
    await sendToWorker(getAlgo());
    log(getAlgo("name"), "time", "list-group-item-primary");

    for (let i = 0; i < loopCount; i++) {
        var {
            time,
            output
        } = await sendToWorker();
        log(output, time.toFixed(1));
        await appendToChart(time.toFixed(1));
    }

    $("#Run").off('click').click(exec).text('Run');
}

async function execAll() {
    clear();
    for (var index = 0; index < algorithms.length; index++) {
        if (getAlgo("visible", index)) {
            changeAlgoTo(index);
            await exec();
        }
    }
}

// initialize user interface ---

createWorker();
appendAlgoToList();
editor.setValue(getAlgo());
updateSeries();
chart.updateSeries(series, false);


// event listeners --------------

$("#loader").removeClass("d-flex").hide();

$("#Ok").click(function () {
    loopCount = $loopCount.val();
});

$("#mainAlgorithm").on('click', '.select', function () {
    var index = $(this).parent().data("val");
    changeAlgoTo(index);
});

$("#mainAlgorithm").on('click', '.remove', function (e) {
    e.stopPropagation();
    var index = $(this).parent().data("val");
    switchAlgo(index, $(this));
});

$("#run-all").on('click', execAll);

$("#clear").on('click', clear);

$("#new-algo").on('click', () => $("#new-algo-modal").modal("show"));

$("#new-algo-ok").on('click', () => addAlgo($("#new-algo-name").val(), $("#new-algo-visible").is(':checked')));

$("#display-chart").on('click', () => {
    $("#chart-col").removeClass("d-none");
    $("#log-col").addClass("d-none");

    if ($("#chart").css('min-height') == "15px")
        chart.render();
});

$("#display-log").on('click', () => {
    $("#log-col").removeClass("d-none");
    $("#chart-col").addClass("d-none");
});

editor.on("change", function () {
    if (algorithmIsSwitched) {
        algorithmIsSwitched = false;
        $("#Update").prop("disabled", true).html('Update');
    } else {
        $("#Update").prop("disabled", false).html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Update');
    }
});

$("#Update").click(function () {
    setAlgo(editor.getValue(), "main");
    $("#Update").prop("disabled", true).html('Update');
});

$("#Run").click(exec);