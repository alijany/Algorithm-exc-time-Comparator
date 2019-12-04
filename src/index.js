import './style/costume.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/collapse';

import { chart } from './lib/chart';
import { editor } from './lib/editor';
import { algorithms } from './algorithms/algorithmsLoader';
import Algo_template from '!!raw-loader!./algorithms/default.js';

import RunWorker from './run.worker';

// ***************************
function sendToWorker(massage) {
    runWorker.postMessage(massage);
    return new Promise(resolve => sendToWorker.resolve = resolve);
}

function createWorker() {
    runWorker = new RunWorker();
    runWorker.onmessage = (response) => sendToWorker.resolve(response.data);

}
// ***************************

var $algoList = $('#mainAlgorithm');
var $loopCount = $('#inputLoop');
var editorAlgoIndex = 0;
var loopCount = $loopCount.val();
var runWorker;
var runMode = 'current';
var algorithmIsSwitched = false;
var series = [];
var algorithm;

function appendAssignmentsToDropDown() {
    var temp = ''
    for (var i = 0; i < algorithms.length; i++) {
        temp += `<a class="dropdown-item" data-val="${i}" href="#">Series ${i+1}</a>`
    }
    $("#Assignments").html(temp);
}

function selectAssignment(index) {
    algorithm = algorithms[index];
    appendAlgoToList();
    editor.setValue(getAlgo());
    updateSeries();
    chart.updateSeries(series, false);
}

// editor functions -----

function getAlgo(prop = "main", index = editorAlgoIndex) {
    return algorithm[index][prop];
}

function setAlgo(value, prop = "main", index = editorAlgoIndex) {
    algorithm[index][prop] = value;
}

function changeAlgoTo(index) {
    algorithmIsSwitched = true;
    editor.setValue(algorithm[index].main);
    editorAlgoIndex = index;
}

// ninja function :P
function switchAlgo(index, el) {
    var isVisible = getAlgo('visible', index) ? '-slash' : '';
    el.html(`<i class="far fa-eye${isVisible}"></i>`)
        .next().prop('disabled', function (i, v) { return !v; });
    setAlgo(!isVisible, 'visible', index);

    updateSeries();
    chart.updateSeries(series, false);
    if (!isVisible)
        $('.log-' + index).show();
    else
        $('.log-' + index).hide();
}

function appendAlgoToList() {
    var temp = '';
    algorithm.forEach((algo, index) => {
        var isVisible = algo.visible ? "" : "-slash";
        temp += `
        <div class="btn-group w-100" data-val="${index}">
            <button class="btn btn-light remove"><i class="far fa-eye${isVisible}"></i></button>
            <button class="dropdown-item select">${algo.name}</button>
        </div>
        `;
    });
    $algoList.html(temp);
}

function addAlgo(name, visible) {
    var index = algorithm.push({
        name: name,
        main: Algo_template,
        series: undefined,
        visible: visible
    });
    appendAlgoToList();
    changeAlgoTo(index - 1);
}

function updateSeries() {
    series = [];
    algorithm.forEach(algo => {
        if (algo.series && algo.visible)
            series.push(algo.series);
    });
}

// main functions --------
function clear() {
    algorithm.forEach(algo => algo.series = undefined);
    chart.updateSeries([], false);
    $('#log-container').text('');
}

function createLogList(header, className = '') {
    var $logList = $(`<ul class="list-group mb-3 ${className}"></ul>`).appendTo('#log-container');
    var $remove = $('<a href="#" class="float-right"><i class="fas fa-trash"></i></a>').click(() => $logList.remove());
    log($logList, header, $remove, 'list-group-item-primary');
    return $logList;
}

function log($logList, data, info, className = '') {
    if (typeof (info) == 'string') info = `<span class="float-right">${info}</span>`;
    var $listItem = $(`<li class="list-group-item ${className}">${data}</li>`);
    $logList.append($listItem.append(info));
}

// chart function -------
function appendToChart(time) {
    getAlgo('series').data.push(time);
    return chart.updateSeries(series, false);
}

// execution function -----

function resetMainSeries() {
    var newSeries = [];
    setAlgo({
        data: [],
        name: getAlgo('name')
    }, 'series');

    algorithm.forEach(algo => {
        if (algo.series && algo.visible) newSeries.push(algo.series);
    });

    series = newSeries;
}

function cancel() {
    runWorker.terminate();
    createWorker();
    $('#Run').off('click').click(run).html('<i class="fas fa-play"></i>');
}

async function exec() {
    resetMainSeries();
    await sendToWorker(getAlgo());

    var $logList = createLogList(getAlgo('name'), 'log-' + editorAlgoIndex);

    for (let i = 0; i < loopCount; i++) {
        var { time, output } = await sendToWorker();
        log($logList, output, time.toFixed(1));
        await appendToChart(time.toFixed(1));
    }
}

async function execAll() {
    clear();
    for (var index = 0; index < algorithm.length; index++) {
        if (getAlgo("visible", index)) {
            changeAlgoTo(index);
            await exec();
        }
    }
}

async function run() {
    $('#Run').off('click').click(cancel).html('<i class="fas fa-stop"></i>');

    if (runMode == 'All') await execAll();
    else if (getAlgo('visible')) await exec();

    $('#Run').off('click').click(run).html('<i class="fas fa-play"></i>');
}

// initialize user interface ---s

createWorker();
appendAssignmentsToDropDown();
selectAssignment(1);


// event listeners --------------

$('#loader').removeClass('d-flex').hide();

$('#Ok').click(function () {
    loopCount = $loopCount.val();
});

$("#Assignments").on('click', 'a', function () {
    algorithmIsSwitched = true;
    var index = $(this).data("val");
    selectAssignment(index);
})

$("#mainAlgorithm").on('click', '.select', function () {
    var index = $(this).parent().data("val");
    changeAlgoTo(index);
});

$('#mainAlgorithm').on('click', '.remove', function (e) {
    e.stopPropagation();
    var index = $(this).parent().data('val');
    switchAlgo(index, $(this));
});

$('#clear').on('click', clear);

$('#new-algo').on('click', () => $('#new-algo-modal').modal('show'));

$('#new-algo-ok').on('click', () => addAlgo($('#new-algo-name').val(), $('#new-algo-visible').is(':checked')));

$('#d-mode').on('click', () => {
    if ($('#chart-col').hasClass('d-none'))
        $('#d-mode').html('<i class="fas fa-terminal"></i>');
    else
        $('#d-mode').html('<i class="far fa-chart-bar"></i>');

    $('#log-col').toggleClass('d-none');
    $('#chart-col').toggleClass('d-none');

    if ($('#chart').css('min-height') == '15px')
        chart.render();
});


editor.on('change', function () {
    if (algorithmIsSwitched) {
        algorithmIsSwitched = false;
        $('#Update').prop('disabled', true).html('<i class="fas fa-check"></i>');
    } else {
        $('#Update').prop('disabled', false).html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>');
    }
});

$('#Update').click(function () {
    setAlgo(editor.getValue(), 'main');
    $('#Update').prop('disabled', true).html('<i class="fas fa-check"></i>');
});

$('#run-mode').on('click', 'a', function () {
    runMode = $(this).text();
});

$('#Run').click(run);