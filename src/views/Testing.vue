<template>
  <MovieInfoBox @onResetPickImage="onResetPickImage" v-if="true"/>
  <!-- <div class="wrap" v-if="false">
    <div class="bg">
      <div class="loading">
        <span class="title">loading</span>
        <span class="text">tehran highway</span>
      </div>
    </div>
  </div>
	<iframe v-if="false" width="420" height="315" src="https://www.youtube.com/embed/ul7wcneBjOI" frameborder="0"></iframe> -->
	<!-- Radar Chart -->
	<!-- <div>
		<RadarChart />
		<ZingChart />
	</div> -->
</template>

<script>
import MovieInfoBox from '@/components/MovieInfoBox.vue'
import RadarChart from '@/components/RadarChart.vue'
import ZingChart from '@/components/ZingChart.vue'

export default {
  name: 'Testing',
  components: {
    MovieInfoBox,
		RadarChart,
		ZingChart
  },
  setup() {
    const onResetPickImage = () => {
      console.log('clicked')
    }

    return {
      onResetPickImage
    }
  }
}
</script>

<style scoped>
@-webkit-keyframes title {
	 0% {
		 opacity: 0;
		 right: 130px;
	}
	 48% {
		 opacity: 0;
		 right: 130px;
	}
	 52% {
		 opacity: 1;
		 right: 30px;
	}
	 70% {
		 opacity: 1;
		 right: 30px;
	}
	 100% {
		 opacity: 0;
		 right: 30px;
	}
}
 @-moz-keyframes title {
	 0% {
		 opacity: 0;
		 right: 130px;
	}
	 48% {
		 opacity: 0;
		 right: 130px;
	}
	 52% {
		 opacity: 1;
		 right: 30px;
	}
	 70% {
		 opacity: 1;
		 right: 30px;
	}
	 100% {
		 opacity: 0;
		 right: 30px;
	}
}
 @-webkit-keyframes fade {
	 0% {
		 opacity: 1;
	}
	 100% {
		 opacity: 0;
	}
}
 @-moz-keyframes fade {
	 0% {
		 opacity: 1;
	}
	 100% {
		 opacity: 0;
	}
}
 @-webkit-keyframes bg {
	 0% {
		 background-color: #306f99;
	}
	 50% {
		 background-color: #19470f;
	}
	 90% {
		 background-color: #734a10;
	}
}
 @-moz-keyframes bg {
	 0% {
		 background-color: #306f99;
	}
	 50% {
		 background-color: #19470f;
	}
	 90% {
		 background-color: #734a10;
	}
}
 @-webkit-keyframes blink {
	 0% {
		 opacity: 0;
	}
	 5% {
		 opacity: 1;
	}
	 10% {
		 opacity: 0;
	}
	 15% {
		 opacity: 1;
	}
	 20% {
		 opacity: 0;
	}
	 25% {
		 opacity: 1;
	}
	 30% {
		 opacity: 0;
	}
	 35% {
		 opacity: 1;
	}
	 40% {
		 opacity: 0;
		 right: -21px;
	}
	 45% {
		 opacity: 1;
		 right: 80px;
	}
	 50% {
		 opacity: 0;
		 right: -21px;
	}
	 51% {
		 right: -21px;
	}
	 55% {
		 opacity: 1;
	}
	 60% {
		 opacity: 0;
	}
	 65% {
		 opacity: 1;
	}
	 70% {
		 opacity: 0;
	}
	 75% {
		 opacity: 1;
	}
	 80% {
		 opacity: 0;
	}
	 85% {
		 opacity: 1;
	}
	 90% {
		 opacity: 0;
		 right: -21px;
	}
	 95% {
		 opacity: 1;
		 right: 80px;
	}
	 96% {
		 right: -21px;
	}
	 100% {
		 opacity: 0;
		 right: -21px;
	}
}
 @-moz-keyframes blink {
	 0% {
		 opacity: 0;
	}
	 5% {
		 opacity: 1;
	}
	 10% {
		 opacity: 0;
	}
	 15% {
		 opacity: 1;
	}
	 20% {
		 opacity: 0;
	}
	 25% {
		 opacity: 1;
	}
	 30% {
		 opacity: 0;
	}
	 35% {
		 opacity: 1;
	}
	 40% {
		 opacity: 0;
		 right: -21px;
	}
	 45% {
		 opacity: 1;
		 right: 80px;
	}
	 50% {
		 opacity: 0;
		 right: -21px;
	}
	 51% {
		 right: -21px;
	}
	 55% {
		 opacity: 1;
	}
	 60% {
		 opacity: 0;
	}
	 65% {
		 opacity: 1;
	}
	 70% {
		 opacity: 0;
	}
	 75% {
		 opacity: 1;
	}
	 80% {
		 opacity: 0;
	}
	 85% {
		 opacity: 1;
	}
	 90% {
		 opacity: 0;
		 right: -21px;
	}
	 95% {
		 opacity: 1;
		 right: 80px;
	}
	 96% {
		 right: -21px;
	}
	 100% {
		 opacity: 0;
		 right: -21px;
	}
}
 .wrap {
	 font-family: Purista, sans-serif, arial;
	 background: rgb(73, 73, 73);
	 color: #eaf7ff;
	 position: absolute;
	 top: 50%;
	 left: 50%;
	 margin-left: -80px;
	 margin-top: -40px;
}
 .bg {
	 padding: 30px 30px 30px 0;
	 background: #306f99;
   animation: bg 1.5s linear infinite;
   box-shadow: inset 0 0 45px 30px black;
}
.loading {
	 position: relative;
	 text-align: right;
	 height: 20px;
	 width: 150px;
   text-shadow: 0 0 6px #bce4ff;
}
 .loading span {
	 display: block;
	 text-transform: uppercase;
	 position: absolute;
	 right: 30px;
	 height: 20px;
	 width: 200px;
	 line-height: 20px;
}
 .loading span:after {
	 content: "";
	 display: block;
	 position: absolute;
	 top: -2px;
	 right: -21px;
	 height: 20px;
	 width: 16px;
   background: #eaf7ff;
   box-shadow: 0 0 15px #bce4ff;
   animation: blink 6s infinite;
}
 .loading span.title {
   animation: title 6s linear infinite;
}
 .loading span.text {
   animation: title 6s linear 3s infinite;
	 opacity: 0;
}
</style>
