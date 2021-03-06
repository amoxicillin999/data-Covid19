function showData(elCountry,elDaysRange) {
    url = 'https://datahub.io/core/covid-19/r/time-series-19-covid-combined.json';
    $.getJSON(url, function (data) { 
        var labels = [];
        var result = []
        var vCases; // 確診人數 
        var dCases; // 死亡人數
        var daysRange = elDaysRange;
        // j 計算出最後一筆資料
        var j; 
        for(i in data) {
            var item = data[i];
            if (item['Country/Region'] == elCountry) {
                 j = i;
            }
        }

        // 開始 push
        for(i in data) {
            var item = data[i];
            if (item['Country/Region'] == elCountry) {
                // 計算今日確診人數 = 今日Confirmed - 昨日Confirmed
                // 由於台灣第一筆記錄無昨日Confirmed值，所以以Null值為替
                if (vCases != null) {
                    var vCases = data[i].Confirmed - data[i-1].Confirmed;
                } else {
                    var vCases = data[i].Confirmed;
                }

                // 計算今日死亡人數 = 今日Deaths - 昨日Deaths
                // 由於台灣第一筆記錄無昨日Deaths值，所以以Null值為替
                if (dCases != null) {
                    var dCases = data[i].Deaths - data[i-1].Deaths;
                } else {
                    var dCases = data[i].Deaths;
                }
                //j最後一筆資料-dayRange為push多少天的資料
                if ( i > j - daysRange) result.push({'id':i, 'Confirmed':vCases, 'Deaths':dCases, 'Date':data[i].Date});
                document.getElementById("vInfo").innerHTML = ' <p>' + elCountry + ', Date: ' + data[i].Date + ", Confirmed cases: " + vCases + ", Death cases: " + dCases + '</p>';
            }
        }

        //
        results=JSON.stringify(result);
        document.getElementById("test").innerHTML += results;

        results=JSON.parse(results);

        // 發病日期For Chart.js x
        var labels = results.map(function(e) {
            return e.Date;
        }); 

        // 確診人數For Chart.js y
        var data = results.map(function(e) {
            return e.Confirmed;
        });

        // 死亡人數For Chart.js y
        var data2 = results.map(function(e) {
            return e.Deaths;
        });

        //Create Chart
        createChart(labels, data, data2);

    });
}    

// Bar chart for Char.js
function createChart(labels,data, data2) {
    // 藉由刪除#bar-chart來重新更新#bar-chart並建之資料
    $("canvas#bar-chart").remove();
    $("#chartreport").append('<canvas id="bar-chart" width="800" height="450"></canvas>');
    // 開始建立Chart
    var eChart = document.getElementById("bar-chart"); 
    var myChart = new Chart(eChart, {
        type: 'bar',

             /* Deal with from Chart.js */
            data: { 
                labels: labels,
                datasets: [{
                    label: 'Comfirmed cases',
                    data: data,
                    backgroundColor: 'black'
                },{
                    label: 'Death cases',
                    data: data2,
                    backgroundColor: 'red'
                }]
            },
            options: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Predicted world population (millions) in 2050'
            }
        }
    });
}
