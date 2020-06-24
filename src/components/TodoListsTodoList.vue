<template>
  <BaseCard
    class="TodoListsTodoList"
    clickable
    :to="{ name: 'TodoList', params: { id: todoListId } }"
   :title="`Click to edit &quot;${todoList.title}&quot;`"
  >
    <h2>{{ todoList.title }}</h2>
    <ul class="unstyled-list">
      <li
        v-for="item in topItems"
        :key="item.id"
        class="flex-center"
      >
        <span
          class="material-icons list-checkbox"
          v-text="item.checked ? 'check_box' : 'check_box_outline_blank'"
        />
        <span>{{ item.title }}</span>
      </li>
      <li v-if="!topItems.length" class="empty">
        No ToDo's yet, click to add some!
      </li>
    </ul>
  </BaseCard>
</template>

<script>
export default {
  name: 'TodoListsTodoList',

  props: {
    todoListId: { type: Number, required: true },
  },

  computed: {
    todoList() { return this.$store.getters['todoList/get'](this.todoListId) },
    topItems() { return this.todoList && this.todoList.items.slice(0, 3) },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../stylus/variables'

  .TodoListsTodoList
    text-align left
    display flex
    flex-direction column

  h2
    white-space nowrap
    overflow hidden
    text-overflow ellipsis

  .unstyled-list
    list-style none
    padding-left 0

  .flex-center
    display flex
    align-items center

  .list-checkbox
    margin-right 7px

  .empty
    font-style italic
    color $grey4
</style>
