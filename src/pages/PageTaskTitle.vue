<template>
  <h1 class="PageTaskTitle">
    <BaseButton
      flat round
      class="back-button"
      @click="$router.replace({ name: 'Tasks' })"
    >
      <span class="material-icons">arrow_back</span>
    </BaseButton>
    <span class="title-text">
      {{ task ? task.title : 'Loading...' }}
    </span>
  </h1>
</template>

<script>
export default {
  name: 'PageTaskTitle',

  props: {
    taskId: { type: Number, required: true },
  },

  computed: {
    task() { return this.$store.getters['task/get'](this.taskId) },
  },
}
</script>

<style lang="stylus" scoped>
  .PageTaskTitle
    max-width 100%
    display inline-flex
    align-items center
    padding 10px 0

    .title-text
      display inline-block
      overflow hidden
      text-overflow ellipsis

    .back-button
      background-color transparent
      margin-right 7px
</style>
