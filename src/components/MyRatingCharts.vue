<template>
<div class="zc-body d-flex justify-content-between">
  <!-- Chart 1 -->
  <div class="chart-panel d-flex flex-column align-items-center w-50">
    <p class="chart-name">Star Rating</p>
    <div id="chart1" class="w-100">
      <a href="https://www.zingchart.com/" rel="noopener" class="zc-ref">Powered by ZingChart</a>
    </div>
  </div>

  <!-- Chart 2 -->
  <div class="chart-panel d-flex flex-column align-items-center w-50">
    <p class="chart-name">Hexa Rating</p>
    <div id="chart2" class="w-100">
      <a href="https://www.zingchart.com/" rel="noopener" class="zc-ref">Powered by ZingChart</a>
    </div>
  </div>
</div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import zingchart from 'zingchart/zingchart-es6.min.js';


export default {
  name: 'MyRatingCharts',
  setup() {
    const store = useStore()

    onMounted(() => {
      const chart1Id = 'chart1';
      const chart2Id = 'chart2';
      setTimeout(() => {
        //// Chart Data
        const simpleRatingData = store.state.movies.picked_movie.simple_rating_counts
        const numOfRatingsPerScore = [
          simpleRatingData['0.5'],
          simpleRatingData['1.0'],
          simpleRatingData['1.5'],
          simpleRatingData['2.0'],
          simpleRatingData['2.5'],
          simpleRatingData['3.0'],
          simpleRatingData['3.5'],
          simpleRatingData['4.0'],
          simpleRatingData['4.5'],
          simpleRatingData['5.0'],
        ]
        const detailedRatingData = store.state.movies.picked_movie.detailed_ratings_average
        const detailedRatingAverageScores = [
          detailedRatingData.entertainment_value_average,
          detailedRatingData.plot_average,
          detailedRatingData.characters_average,
          detailedRatingData.cinematography_average,
          detailedRatingData.originality_average,
          detailedRatingData.music_score_average,
        ]
  
        //// CHART CONFIG
        // Chart 1
        const chart1Data = {
          type: 'bar',
          plot: {
            'value-box': {
              'font-size': 12,
              // 'font-weight': "bold",
              'font-color': 'rgb(160, 157, 157)',
            },
            animation: {
              effect: 4,
              sequence:1,
              speed: 10000
            },
            barWidth: '0.75rem',
          },
          globals: {
            fontFamily: 'Poppins'
          },
          backgroundColor: 'transparent',
          scaleX: {
            // labels: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],
            labels: ['', '★', '', '★ x 2', '', '★ x 3', '', '★ x 4', '', '★ x 5'],
            item: {
              fontColor: 'rgb(220, 220, 220)',
            },
            tick: {
              visible: false
            }
          },
          scaleY: {
            lineWidth: 0,
            tick: {
              visible: false
            },
            guide: {
              lineStyle: 'solid',
              lineColor: 'var(--lightGray)'
            },
            item: {
              fontColor: 'rgb(220, 220, 220)',
            },
          },
          plotarea: {
            margin: 'dynamic'
          },
          series: [
            {
              values: numOfRatingsPerScore,
              barColor: 'var(--yellow)',
              lineWidth: 1,
              borderWidth: 1.2,
              // 'background-color': "#6666FF #FF0066",
              'background-color': "var(--yellow)",
              alpha: 0.8,
              marker: {
                type: 'star5',
                size: 4
              }
            }
          ]
        }
        // Chart 2
        const chart2Data = {
          type: 'radar',
          plot: {
            aspect: 'area',
            animation: {
              effect: 3,
              sequence: 1,
              speed: 10000
            },
            'value-box': {
              'font-family': "Georgia",
              'font-size': 12,
              'font-weight': "bold",
              'font-color': 'white',
            },
          },
          scaleV: {
            visible: true,
            'min-value': 0,
            'max-value': 5,
            step: 1,
            items: {
              fontColor: '#607D8B',
            }
          },
          scaleK: {
            labels: [
              'Entertainment Value',
              'Plot',
              'Characters',
              'Cinematography',
              'Originality',
              'Music Score',
            ],
            item: {
              fontColor: '#607D8B',
              backgroundColor: "white",
              borderColor: "#aeaeae",
              borderWidth: 1,
              padding: '5 10',
              borderRadius: 10
            },
            refLine: {
              lineColor: '#c10000'
            },
            tick: {
              lineColor: '#59869c',
              lineWidth: 2,
              lineStyle: 'dotted',
              size: 15
            },
            guide: {
              lineColor: "#607D8B",
              lineStyle: 'solid',
              alpha: 0.4,
              backgroundColor: "#c5c5c5 #718eb4"
            }
          },
          backgroundColor: 'transparent',
          plotarea: {
            margin: 'dynamic'
          },
          series: [{
              values: detailedRatingAverageScores,
              text: 'farm',
              marker: {
                type: 'star5',
                size: 4
              }
            },
          ]
        };
  
        //// RENDER CHARTS
        // Chart 1
        zingchart.render({
          id: chart1Id,
          data : chart1Data,
          height: 300,
          width: '100%'
        });
  
        // Chart 2
        zingchart.render({
          id: chart2Id,
          data : chart2Data,
          height: 300,
          width: '100%'
        });
      }, 1500)
    })
  }
}
</script>

<style lang="scss">
:root {
  --purple: #212135;
  --lightPurple: #2D2D45;
  --yellow: #FCEA3C;
  --white: #FFFFFF;
  --lightGray: #7C7C8E;
  --green: #A5F291;
  --red: #FA7477;
}

.zc-body {
  justify-content: center;
  background-color: var(--purple);
  font-family: Poppins;
  border-radius: 5px;
}

.zc-ref {
  display: none;
}

.chart-panel {
  margin: 2vh;
  background-color: var(--lightPurple);
  border-radius: 5px;
}
.chart-name {
  align-self: flex-start;
  font-size: 1.5rem;
  color: white;
  margin: 1rem 0 1rem 1.5rem;
}
</style>