function test() {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();

        var startTime = (new Date()).getTime(), endTime = startTime, latencyTime = startTime, latency = 0;
        request.onreadystatechange = function () {
            if (request.readyState == 1) latencyTime = (new Date()).getTime();
            if (request.readyState == 2) {
                startTime = (new Date().getTime());
                latency = startTime - latencyTime;
            }
            if (request.readyState == 4) {
                endTime = (new Date()).getTime();
                var downloadSize = request.responseText.length;
                var sizeInBits = downloadSize * 8;
                var time = (endTime - startTime) / 1000;
                var speed = ((sizeInBits / time) / (1024 * 1024));
                resolve({speed: speed, latency: latency});
            }
        }

        request.open('GET', "https://sp-axpot-telefonica.eaqbr.com.br/download/2?_=" + (new Date()).getTime(), true);
        request.send();
    });
}

function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

var results = [], time = 10, i = 1; stop = false;

setInterval(function () {
    document.querySelector('.velocidade.pcg').style.width = `${i * 100 / time}%`;
    i++
}, 1000);

setTimeout(function () {
    stop = true;
    if(results.length == 0) document.querySelector('.velocidade.text').innerHTML = `Your internet is too slow`;
}, time*1000);

(async () => {
    for await (r of Array.from({length: 1024}, (_, i) => i + 1)) {
        var result = await test();
        console.log(result);
        results.push(result.speed);
        // console.log(median(results).toFixed(2));
        // var bar = median(results) * 100 / 1024;
        // document.querySelector('.velocidade.pcg').style.width = `${bar}%`;
        document.querySelector('.velocidade.text').innerHTML = `${median(results).toFixed(2)}<span>mbps</span>`;
        document.querySelector('.velocidade.ping').innerHTML = `${result.latency}<span>ms</span>`;
        if(stop) {
            document.querySelector('.velocidade.box').classList.remove('testing');
            document.querySelector('.velocidade.display').classList.remove('testing');
            break;
        }
    }
})();