<template>
  <div id="myChart" class="chart--container">
    <a class="zc-ref" href="https://www.zingchart.com/">Powered by ZingChart</a>
  </div>
</template>

<script>
import { onMounted } from 'vue'
export default {
  name: 'ZingChart',
  setup() {
    onMounted(() => {
      ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "b55b025e438fa8a98e32482b5f768ff5"];
      var myConfig = {
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
            'font-size':12,
            'font-weight': "normal"
          },
        },
        scaleV: {
          visible: true,
          'min-value': 0,
          'max-value': 5,
          step: 1
        },
        scaleK: {
          // aspect: 'circle',
          labels: [
            'Originality',
            // 'Creativity',
            'Plot',
            // 'Pacing & Structure',
            'Characters',
            'Cinematography',
            // 'Sound Quality',
            'Music Score',
            // 'Entertainment Value',
            'Dialogue',
            // 'Message Effectiveness',
            // 'Call to Action'
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
            size: 20
          },
          guide: {
            lineColor: "#607D8B",
            lineStyle: 'solid',
            alpha: 0.3,
            backgroundColor: "#c5c5c5 #718eb4"
          }
        },
        backgroundColor: 'transparent',
        // plotarea: {
        //   backgroundColor: 'white'
        // },
        series: [{
            values: [1, 3, 3, 4, 3, 2],
            text: 'farm',
            marker: {
              type: 'star5'
            }
          },
        ]
      };

      zingchart.render({
        id: 'myChart',
        data: myConfig,
        height: '100%',
        width: '100%'
      });
    })
  }
}
</script>

<style scoped>
.chart--container {
  position: absolute;
  width: 30vw;
  height: 30vh;
  left: 24vw;
  top: 15vh;
}

.zc-ref {
  display: none;
}
</style>