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
import { onMounted } from 'vue'
export default {
  name: 'MyRatingCharts',
  setup() {
    onMounted(() => {
      const chart1Id = 'chart1';
      const chart2Id = 'chart2';

      //// Chart Data
      const numOfRatingsPerScore = [100, 200, 300, 200, 500, 400, 300, 250, 500, 600]
      //// CHART CONFIG
      // Chart 1
      const chart1Data = {
        type: 'bar',
        plot: {
          animation: {
            effect: 4,
            sequence:1,
            speed: 5000
          }
        },
        globals: {
          fontFamily: 'Poppins'
        },
        backgroundColor: 'transparent',
        scaleX: {
          // labels: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],
          labels: ['', '★', '', '★★', '', '★★★', '', '★★★★', '', '★★★★★'],
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
          }
        },
        plotarea: {
          margin: 'dynamic'
        },
        series: [
          {
            values: numOfRatingsPerScore,
            barColor: 'var(--yellow)',
            lineWidth: 5,
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
            speed: 5000
          },
          'value-box': {
            'font-family': "Georgia",
            'font-size': 12,
            'font-weight': "bold",
            'font-color': 'white',
            'offset-x': 0,
            'offset-y': -15,
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
            'Originality',
            'Creativity',
            'Characters',
            'Cinematography',
            'Plot',
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
            values: [1, 3, 3, 4, 3, 2],
            // values: [1, 3, 3, 4, 3, 2, 1, 3, 3, 4, 3, 2],
            text: 'farm',
            marker: {
              type: 'star5',
              size: 4
            }
          },
        ]
      };

// RENDER CHARTS
      // -----------------------------

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