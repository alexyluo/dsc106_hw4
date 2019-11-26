Highcharts.ajax({
    url: 'keanu.json',
    dataType: 'text',
    success: function (activity) {
        activity = JSON.parse(activity);
        console.log(activity)
        var titles = []
        var domestic = []
        var international = []
        var box = []
        var date = []
        var character = []
        var rating = []
        var budget = []
        var descriptions = []
        activity.forEach(function(movie, i) {
            titles.push(movie.Title)
            domestic.push(Number(movie.Domestic.replace(/[^0-9.-]+/g,"")))
            international.push(Number(movie.International.replace(/[^0-9.-]+/g,"")))
            box.push(Number(movie.Box.replace(/[^0-9.-]+/g,"")))
            date.push(new Date(movie.Date))
            character.push(movie.Character)
            rating.push(Number(movie.Tomato.replace(/[^0-9.-]+/g,"")))
            budget.push(Number(movie.Budget.replace(/[^0-9.-]+/g,"")))
            descriptions.push(movie.Description)
        })
        console.log(descriptions)
    
        var roSeries = [
        {
            type: 'column',
            name: 'International',
            data: international.reverse(),
            pointPlacement: 'between',
            color: "rgba(44,151,92,.75)"
        }, 
        {
            type: 'column',
            name: 'Domestic',
            data: domestic.reverse(),
            pointPlacement: 'between',
            color: "black"
        }, 
        ]

        Highcharts.chart('rose', {

            chart: {
                polar: true,
                height: 500,
                width: 500,
                backgroundColor: "None"
            },

            title: {
                text: "Keanu's Appeal Stateside and Worldwide"
            },

            subtitle: {
                text: 'International and Domestic Box Office for Top Films'
            },

            pane: {
                startAngle: 0,
                endAngle: 360
            },

            xAxis: {
                tickInterval: 24,
                min: 0,
                max: 360,
                labels: 'None'
            },

            yAxis: {
                min: 0,
                max: 800000000,
                tickInterval: 400000000,
            },

            tooltip: {
                formatter: function() {
                    console.log(this.points)
                    return this.points.reduce(function (s, point) {
                        return s + "<br>" + point.series.name + ": $" + (point.y/1000000).toPrecision(3) + "M<br>"
                    }, '<b>' + this.x + '</b>');
                },
                shared: true

            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    pointStart: 0,
                    pointInterval: 24
                },
                column: {
                    pointPadding: 0,
                    groupPadding: 0
                }
            },

            series: roSeries
        });
        // timeline = Highcharts.map(date, function(day, i))
        bubbleData = Highcharts.map(date, function(item, i) {
            return {'x': item, 
                    'y': rating[i], 
                    'z': budget[i],
                }
        })
        var fresh = {
            name: "Fresh",
            color: 'rgba(223, 83, 83, .5)',
            data: [],
        }
        var rott = {
            name: "Rotten",
            color: 'rgba(6, 199, 84, .5)',
            data: []
        }
        bubbleData.forEach( function (entry, i) {
            entry.name = titles[i]
            entry.description = descriptions[i]
            if (entry.y >= 60) {
                fresh.data.push(entry)
            } else {
                rott.data.push(entry)
            }
        })

        var bubSeries = [fresh, rott]
    
        console.log(bubSeries)
        Highcharts.chart('bubble', {
            chart: {
              type: 'bubble',
              height: 500,
              width: 1000,
              backgroundColor: "rgba(255,255,255,.60)",
            },
            title: {
              text: "Quality Keanu Throughout the Ages"
            },
            subtitle: {
              text: "Timeline of Keanu's Most Notable Films Weighted by Budget and Scored by Rotten Tomatoes"
            },
            xAxis: {
                type: "datetime",
                labels: {
                    format: '{value:%Y-%b-%e}'
                  },
                crosshair: true,
                labels: {
                    enabled: true
                }
            }, 
            
            yAxis: {
                min: 0,
                max: 100,
              title: {
                text: 'Rotten Tomato Score'
              },
              labels: {
                format: '{value}%'
              }
            },
            legend: {
              layout: 'vertical',
              align: 'left',
              verticalAlign: 'top',
              x: 100,
              y: 100,
              floating: true,
              backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
              borderWidth: 1,
            },
            plotOptions: {
              scatter: {
                marker: {
                  symbol: 'cricle',
                  radius: 5,
                  states: {
                    hover: {
                      enabled: true,
                      lineColor: 'rgb(100,100,100)'
                    }
                  }
                },
                states: {
                  hover: {
                    marker: {
                      enabled: false
                    }
                  }
                },
                
              }
            },
            tooltip: {
                formatter: function() {
                    console.log(this.point)
                    return (
                        "<b>" + this.point.name + " (" + this.point.x.getFullYear() +") " + "</b><br>" + 
                        "<b>Score: </b>" + this.point.y + "% <br>" + 
                        "<b>Budget: </b> $" + this.point.z / 1000000 + "M <br>" + this.point.description
                    )
                },
                shared: true

            },
            series: bubSeries
          });
        
    }
});
