<template>
  <svg class="scoreviz" viewBox="viewbox" :width="width">
    <g class="score-dial">
      <circle class="outline" :r="radius * 0.9" cx="0" cy="0"></circle>
      <polygon :points="points"></polygon>
      <axis-label v-for="(stat, idx) in stats" :stat="stat" :index="index" :total="stats.length" :key="idx"></axis-label>
    </g>
  </svg>
</template>

<script>
const valueToPoint = (value, index, total) => {
  var maxV  = 100
  var maxR  = 300 * 0.9
  var r     = maxR / maxV * value
  var angle = Math.PI * 2 / total * index + Math.PI / 2
  var cos   = Math.cos(angle)
  var sin   = Math.sin(angle)
  var tx    = r * cos
  var ty    = r * sin
  return {
  angle: angle,
    radius: r,
    x: tx,
    y: ty
  }  
}
export default {
  name: 'Polygraph',
  props: ['stats', 'width'],
  computed: {
    radius() {
      return this.width / 2
    },
    viewbox() {
      const size = this.width
      const min = -(size/2)
      console.log([min, min, size, size].join(' '))
      return [min, min, size, size].join(' ')
    },
    points() {
      const total = this.stats.length
      return this.stats.map((stat, i) => {
        const point = valueToPoint(stat.value, i, total)
        return point.x + ',' + point.y
      }).join(' ')
    }
  },
  components: {
    axisLabel: {
      template: '<text v-bind="{ x: point.x, y: point.y }" v-text="stat.label"></text>',
      props: {
        stat: Object,
        index: Number,
        total: Number
      },
      computed: {
        point() {
          return valueToPoint(this.stat.value, this.index, this.total)
        }
      }
    }
  }
}
</script>

<style>

</style>