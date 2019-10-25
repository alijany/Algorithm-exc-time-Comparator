var algo;

function multiply(a, b) {
    var sum = 0;
    for (var j = 0; j < a; j++) {
        sum += b;
    }
    return sum;
}

onmessage = function (event) {
    if (event.data) {
        algo = eval("var algorithm;" + event.data);
        algo.initialize();
        postMessage("algorithm initialized");
    } else {
        var startTime, endTime, time = 0;
        var output;

        startTime = performance.now();
        output = algo.run();
        endTime = performance.now();

        algo.update();
        time = endTime - startTime;
        postMessage({
            time: time,
            output : output
        });
    }
}