$(function() {
	var window_size = 30*60;	// seconds
	var chart;
	var utcoffset = -(new Date()).getTimezoneOffset()*60*1000;

	function ms2knot(ms) {
		return ms*1.94384;
	}

	function addpoint(data,idx) {
		if (!(chart == null)) {
			var series = chart.series[idx];
			var shift = series.data.length > 60*60;
			/*var shift = false;
			var d = series.data;
			if (d.length > 0) {
				var span = (d[d.length-1].x - d[0].x)/1000;	// should be Math.max() - Math.min(), but that's expensive at 10Hz
				shift = (span >= window_size);
			}*/
			var ts = Number(data['ts']*1000) + utcoffset;
			var v = ms2knot(Number(data['apparent_speed_mps']));
			series.addPoint([ts,v],true,shift);
		}
	}

	$(document).ready(function() {
		chart = new Highcharts.Chart({
			chart: {
				type: 'line',
				renderTo: 'container',
				defaultSeriesType: 'spline',
				events: {
					//load: addpoint
				},
				animation: false
			},
			title: {
				text: 'Apparent Wind Speed'
			},
			subtitle: {
				//text: 'Live data from port and starboard RM Young anemometer'
			},
			xAxis: {
				type: 'datetime',
				tickPixelInterval: 150,
				minRange: 1000
			},
			yAxis: {
				minPadding: 0.2,
				maxPadding: 0.2,
				title: {
					text: 'knots',
					margin: 40,
					style: {
						fontSize: '20px'
					}
				}
			},
			series: [{
				name: 'Port',
				data: [],
				color: 'red',//Highcharts.getOptions().colors[2],
				tooltip: {
					valueSuffix: ' knots',
				},
				/*marker: {
					enabled: false
				}*/
			},{
				name: 'Starboard',
				data: [],
				color: 'green',
				tooptip: {
					valueSuffix: ' knots',
				}
			},{
				name: 'Ultrasonic',
				data: [],
				color: 'blue',
				tooptip: {
					valueSuffix: ' knots',
				}
			}],
			tooltip: {
				enabled: false
			},
			legend: {
				enabled: true,
				layout: 'vertical',
				floating: true,
				align: 'left',
				verticalAlign: 'top',
				y: 60,
				x: 100,
				//backgroundColor: '#ffffff',
				itemStyle: {
					color: '#E0E0E0',
				}
			},
			credits: {
				enabled: false
			},
			/*plotOptions: {
				area: {
					fillColor: {
						linearGradient: {
							x1:0,
							y1:0,
							x2:0,
							y2:1
						},
						stops: [
							[0, Highcharts.getOptions().colors[2]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0).get('rgba')]
						]
					}
				}
			},*/
		});		
	});

	var url = "ws://" + String(window.location.host) + ":9000";
	ws = new ReconnectingWebSocket(url);
	ws.onopen = function(evt) {
		//console.log(evt)
	};
	ws.onclose = function(evt) {
		//console.log("closed")
	};
	ws.onmessage = function(evt) {
		//console.log(evt.data);
		var m = evt.data;
		var i = m.indexOf(',');
		if (m.substr(0,i).includes("_PortWind")) {
			var data = JSON.parse(m.substr(i+1));
			addpoint(data,0);
		} else if (m.substr(0,i).includes("_StarboardWind")) {
			var data = JSON.parse(m.substr(i+1));
			addpoint(data,1);
		} else if (m.substr(0,i).includes("_UltrasonicWind")) {
			var data = JSON.parse(m.substr(i+1));
			addpoint(data,2);
		}
	};
	ws.onerror = function(evt) {
		console.log("error?")
	};
});