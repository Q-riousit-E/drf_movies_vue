<template>
  <div v-if="articles.length">
    <transition-group 
      tag="div"
      appear
      @beforeEnter="beforeEnter"
      @enter="enter"
    >
      <div 
        v-for="(article, idx) in articles" 
        :key="article.id"
        :data-idx="idx"
      >
        <span>#{{article.id}}: {{ article.title }}</span>
        <router-link :to="{ name: 'ArticleDetail', params: {id: article.id} }">보기</router-link>
      </div>
    </transition-group>
  </div>
  <div v-else>
    <h1>Loading Articles</h1>
  </div>
  <hr>
  <h1>Create New Article</h1>
  <form action="#" @submit="onSubmitNewArticle">
    <p>Title:</p>
    <input type="text" name="title" v-model="newArticle.title">
    <p>Content:</p>
    <input type="text" name="content" v-model="newArticle.content">
    <input type="submit" value="create new article">
  </form>
  
</template>

<script>
import axios from 'axios'
import gsap from 'gsap'
import jwt_decode from "jwt-decode";

import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Articles',
  setup() {
    // Get articles
    const articles = ref([])
    const getArticles = () => {
      // axios({
      //   method: 'get',
      //   url: '/api/v1/articles/',
      // })
      //   .then((res) => {
      //     console.log(res)
      //     articles.value = res.data
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
    }

    // Create new Article
    const newArticle = ref({
      title:'',
      content:'',
      user_id: ''
    })
    const onSubmitNewArticle = (e) => {
      e.preventDefault()

      const store = useStore()
      const token = computed(() => store.state.auth.token)
  
      // // 이거 받아오는게 조금 이상해서 일단은 그냥 token 여기서 바로 decode 해서 써보기
      // const user_id = computed(() => store.getters['auth/decodedToken'].value)
      // console.log(user_id)
      const decodedToken = jwt_decode(token.value.token)
      console.log(decodedToken)
      newArticle.value.user_id = decodedToken.user_id
      axios({
        method: 'post',
        url: '/api/v1/articles/',
        data: newArticle.value
      })
        .then((res) => {
          console.log(res)
          getArticles()
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // transitions
    const beforeEnter = (ele) => {
      ele.style.opacity = 0
      ele.style.transform = 'translateY(100px)'
    }
    const enter = (ele, done) => {
      gsap.to(ele, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        onComplete: done,
        delay: ele.dataset.idx * 0.2
      })
    }

    return {
      articles, getArticles, 
      newArticle, onSubmitNewArticle,
      beforeEnter, enter
    }
  },
  created() {
    this.getArticles()
  }
}
</script>
