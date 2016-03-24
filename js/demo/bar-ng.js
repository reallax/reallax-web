
(function() {
	
	MetronicApp.controller("echartBarController", ["$scope", function($scope) {
		$scope.inputShow = "欢迎光临！";		
		$scope.clickEvent = function() {
			var btn = angular.element(document.getElementById("testBtn"));
			btn.after("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' value='" + $scope.inputShow + "'>");
		}
		
		var myChart = echarts.init(document.getElementById("barDiv"));
		myChart.setOption(option);
	}]);
	
	
	var option = {
	    title: {
	        x: 'center',
	        text: 'ECharts例子个数统计',
	        subtext: 'Rainbow bar example',
	        link: 'http://echarts.baidu.com/doc/example.html'
	    },
	    tooltip: {
	        trigger: 'item'
	    },
	    toolbox: {
	        show: true,
	        feature: {
	            dataView: {show: true, readOnly: false},
	            restore: {show: true},
	            saveAsImage: {show: true}
	        }
	    },
	    calculable: true,
	    grid: {
	        borderWidth: 0,
	        y: 80,
	        y2: 60
	    },
	    xAxis: [
	        {
	            type: 'category',
	            show: false,
	            data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            show: false
	        }
	    ],
	    series: [
	        {
	            name: 'ECharts例子个数统计',
	            type: 'bar',
	            itemStyle: {
	                normal: {
	                    color: function(params) {
	                        // build a color map as your need.
	                        var colorList = [
	                          '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
	                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
	                           '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
	                        ];
	                        return colorList[params.dataIndex]
	                    },
	                    label: {
	                        show: true,
	                        position: 'top',
	                        formatter: '{b}\n{c}'
	                    }
	                }
	            },
	            data: [12,21,10,4,12,5,6,5,25,23,7],
	        }
	    ]
	};
	
}
)();



