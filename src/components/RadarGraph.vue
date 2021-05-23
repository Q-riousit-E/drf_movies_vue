<template>
  <div class="media">
    <div class="media-left">
      <Polygraph :stats="players" :width="width"></Polygraph>
      <div class="scoreviz controls">
        <score-control v-for="(p, idx) in players" :stat="p" :index="index" :total="players.length" :key="idx"></score-control>
      </div>
    </div>
    <div class="media-body">
      <div class="scoreboard">
        <div class="scorerow" v-for="(p, idx) in players" :key="idx"><label v-text="p.label + ': ' + p.value"></label><button @click="remove(p)">&times;</button></div>
        <form id="add"><input name="newLabel" v-model="newLabel" /><button @click="add">Add player</button></form>
      </div>
    </div>
  </div>
  <pre id="raw" v-text="players | json"></pre>
</template>

<script>
import Polygraph from '@/components/Polygraph.vue'

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
const players = [
  { label: '연기력', value: 100 },
  { label: 'BGM', value: 100 },
  { label: '스토리텔링', value: 100 },
  { label: 'D', value: 100 },
  { label: 'E', value: 100 },
  { label: 'F', value: 100 }
]

export default {
  name: 'RadarGraph',
	data() {
		return {
			newLabel: "",
			players: players,
			width: 600
		}
	},
	methods: {
		add(evt) {
			evt.preventDefault()
			if (!this.newLabel) return
			this.players.push({
				label: this.newLabel,
				value: 100
			})
			this.newLabel = ""
		},
		remove(stat) {
			if (this.players.length > 3) {
				this.players.remove(stat)
			} else {
				alert("Can't remove more!")
			}
		}
	},
	components: {
		Polygraph,
		scoreControl: {
			template: '<input class="slider" type="range" v-model="stat.value" min="0" max="100" :style="style" />',
			props: {
				stat: Object,
				index: Number,
				total: Number
			},
			computed: {
				point() {
					return valueToPoint(
						this.stat.value,
						this.index,
						this.total
					)
				},
				style() {
					var angle = this.point.angle;
					return {
						transform: "rotate(" + angle + "rad)"
					}
				}
			}
		}
	}
}
</script>

<style>
.scoreviz {
	 width: 100%;
	 max-height: 100vw;
}
 .scoreviz.controls {
	 float: none;
	 position: absolute;
	 left: 0;
	 top: 0;
}
 .scoreviz.controls:before {
	 content: "";
	 display: block;
	 padding-top: 100%;
}
 .scoreviz.controls .slider {
	 transform-origin: left center;
	 left: 50%;
	 top: 48%;
	 width: 47%;
	 height: 20px;
	 position: absolute;
	 opacity: 0;
}
 @media screen and (min-width: 768px) {
	 .scoreviz {
		 float: left;
		 max-width: 50%;
	}
}
 polygon {
	 fill: rgba(66,185,131,0.4);
	 stroke: #42b983;
	 stroke-width: 2px;
}
 circle.outline {
	 fill: transparent;
	 stroke: #999;
}
 text {
	 font-size: 18px;
	 fill: #777;
}
 #raw {
	 font-size: 80%;
}
 
</style>