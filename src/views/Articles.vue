<template>
  <div v-if="articles.length">
    <div v-for="article in articles" :key="article.id">
      #{{article.id}}: {{ article.title }}
      <router-link :to="{ name: 'ArticleDetail', params: {id: article.id} }">보기</router-link>
    </div>
  </div>
  <div v-else>
    <h1>No articles</h1>
  </div>
</template>

<script>
import axios from 'axios'
import { ref } from 'vue'

export default {
  name: 'Articles',
  setup() {
    // articles
    const articles = ref([])
    const getArticles = () => {
      axios({
        method: 'get',
        url: '/api/v1/articles/',
      })
        .then((res) => {
          console.log(res)
          articles.value = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }

    return {
      articles, getArticles
    }
  },
  created() {
    this.getArticles()
  }
}
</script>
