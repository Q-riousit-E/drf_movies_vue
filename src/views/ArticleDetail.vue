<template>
  <h1>{{ article.title }}</h1>
  <p>{{ article.content }}</p>
  <div v-for="comment in article.comment_set" :key="comment.id">
    <div>
      <span>{{ comment }}</span>
      <button @click="onDeleteComment(comment.id)">Delete Comment</button>
    </div>
  </div>

  <hr>

  <form action="#" @submit="onSubmitCommentCreate">
    <input type="text" v-model="comment">
    <input type="submit" value="Add Comment">
  </form>
  
  <hr>
  
  <button @click="onDeleteArticle(article.id)">Delete</button>

  <hr>

  <form action="#" @submit="onSubmitArticleUpdate">
    <input type="text" v-model="updateData.title">
    <input type="text" v-model="updateData.content">
    <input type="submit" value="Update Article">
  </form>
</template>

<script>
import axios from 'axios'
import jwt_decode from "jwt-decode";

import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ArticleDetail',
  setup() {
    // Get article info
    const route = useRoute()
    const router = useRouter()


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

    // Delete article
    const onDeleteArticle = (id) => {
      axios({
        method: 'delete',
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

    // Update article
    const updateData = ref({
      title: '',
      content: ''
    })
    const onSubmitArticleUpdate = () => {
      axios({
        method: 'put',
        url: `/api/v1/articles/${route.params.id}/`,
        data: updateData.value
      })
        .then((res) => {
          console.log(res)
          router.push({ name: 'Articles' })
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // Create Comment
    const comment = ref('')
    const store = useStore()
    const token = computed(() => store.state.auth.token)
    const decodedToken = jwt_decode(token.value.token)

    const onSubmitCommentCreate = () => {
      axios({
        method: 'post',
        url: `/api/v1/articles/${route.params.id}/comments/`,
        data: {
          content: comment.value,
          user_id: decodedToken.user_id
        }
      })
        .then((res) => {
          console.log(res)
          article.value = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const onDeleteComment = (id) => {
      console.log(id)
    }


    return {
      article, getArticle,
      onDeleteArticle,
      updateData, onSubmitArticleUpdate,
      comment, onSubmitCommentCreate, onDeleteComment
    }
  },
  created() {
    this.getArticle()
  }
}
</script>

<style>

</style>