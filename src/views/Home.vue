<template>
  <div class="home">
    <h1>Home</h1>
    <div v-for="question in questions" :key="question.id">
      <h4>{{ question.id}}. {{ question.content }}</h4>
      <div v-for="(choice, idx) in question.choices" :key="idx">
        <p>{{ choice }}</p>
      </div>
    </div>
    
  </div>
  <div>
    asdfs
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'

import { ref, watchEffect } from 'vue'

export default {
  name: 'Home',
  setup() {
    const questions = ref([])

    watchEffect(() => {
      console.log('test')
      axios({
        url: 'api/questions',
        method: 'get',
      })
        .then((res) => {
          console.log(res)
          questions.value = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    })

    return {
      questions
    }
  }
}
</script>
