<template>
  <div id="myChart" class="chart--container">
    <a class="zc-ref" href="https://www.zingchart.com/"></a>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

import zingchart from 'zingchart/zingchart-es6.min.js';

export default {
  name: 'ZingChart',
  setup() {
    const store = useStore()

    onMounted(() => {
      setTimeout(() => {
        const detailedRatingData = store.state.movies.picked_movie.detailed_ratings_average
        const detailedRatingAverageScores = [
          detailedRatingData.entertainment_value_average,
          detailedRatingData.plot_average,
          detailedRatingData.characters_average,
          detailedRatingData.cinematography_average,
          detailedRatingData.originality_average,
          detailedRatingData.music_score_average,
        ]
        console.log(detailedRatingAverageScores)
        var myConfig = {
          type: 'radar',
          plot: {
            aspect: 'area',
            animation: {
              effect: 3,
              sequence: 1,
              speed: 5000
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
            // aspect: 'circle',
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

        zingchart.render({
          id: 'myChart',
          data: myConfig,
          height: '100%',
          width: '100%'
        });
      }, 500)
   
    })
  }
}
</script>

<style scoped>
.chart--container {
  position: absolute;
  width: 25vw;
  height: 25vh;
  left: 27vw;
  top: 20vh;
}

.zc-ref {
  display: none;
}

</style>