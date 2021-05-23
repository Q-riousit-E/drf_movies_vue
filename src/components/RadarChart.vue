<template>
  <div width="60" height="40">
    <canvas id="radarChart"></canvas>
  </div>
</template>

<script>
import { onMounted } from 'vue';
export default {
  name: 'RadarChart',
  setup() {
    const data = {
      labels: [
        'Originality',
        'Creativity',
        'Plot',
        'Pacing & Structure',
        'Characters',
        'Cinematography',
        'Sound Quality',
        'Music Score',
        'Entertainment Value',
        'Dialogue',
        'Message Effectiveness',
        'Call to Action'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [1, 3, 3, 4, 3, 2, 2, 3, 4, 5, 2, 1],
        backgroundColor: "rgba(200,0,0,0.2)",
        fill: true,
      }]
    }
    const config = {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 3
          }
        },
        scale: {
          ticks: {
            beginAtZero: true,
            fontColor: 'white', // labels such as 10, 20, etc
            showLabelBackdrop: false // hide square behind text
          },
          pointLabels: {
            fontColor: 'white' // labels around the edge like 'Running'
          },
          gridLines: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          angleLines: {
            color: 'white' // lines radiating from the center
          }
        }
      }
    }
    onMounted(() => {
      const ctx = document.querySelector('#radarChart')
      const myChart = new Chart(ctx, config)
    })
  }
}
</script>

<style>

</style>