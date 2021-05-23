<template>
  <!-- <Polygraph /> -->
  <RadarGraph />
</template>

<script>
import Polygraph from '@/components/Polygraph.vue'
import RadarGraph from '@/components/RadarGraph.vue'

export default {
  name: 'GraphView',
  components: {
    Polygraph,
    RadarGraph
  }
}
</script>

<style>

</style>