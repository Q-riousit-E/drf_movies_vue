<template>
  <div>{{ review }}</div>
</template>

<script>
export default {
  name: 'ReviewCard',
  props: ['review'],
  setup(props) {
    const review = props.review

    return {
      review
    }
  }
}
</script>

<style>

</style>