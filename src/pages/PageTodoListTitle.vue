<template>
  <h1 class="PageTodoListTitle">
    <BaseButton
      flat round
      class="back-button"
      @click="$router.replace({ name: 'TodoLists' })"
    >
      <span class="material-icons">arrow_back</span>
    </BaseButton>
    <span class="title-text">
      {{ todoList ? todoList.title : 'Loading...' }}
    </span>
  </h1>
</template>

<script>
export default {
  name: 'PageTodoListTitle',

  props: {
    todoListId: { type: Number, required: true },
  },

  computed: {
    todoList() { return this.$store.getters['todoList/get'](this.todoListId) },
  },
}
</script>

<style lang="stylus" scoped>
  .PageTodoListTitle
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
