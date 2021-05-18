<template>
  <h1>Article Detail</h1>
</template>

<script>
import axios from 'axios'

import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'ArticleDetail',
  setup() {
    const route = useRoute()
    console.log(route.params)

    const article = ref({})
    const getArticle = () => {
      axios({
        method: 'get',
        url: `/api/v1/articles/${route.params.id}/` 
      })
        .then((res) => {
          console.log(res)
          article.value = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }

    return {
      article, getArticle
    }
  },
  created() {
    this.getArticle()
  }
}
</script>

<style>

</style>