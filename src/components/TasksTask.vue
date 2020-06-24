<template>
  <BaseCard
    class="TasksTask"
    clickable
    :to="{ name: 'Task', params: { id: taskId } }"
   :title="`Click to edit &quot;${task.title}&quot;`"
  >
    <h2>{{ task.title }}</h2>
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
  name: 'TasksTask',

  props: {
    taskId: { type: Number, required: true },
  },

  computed: {
    task() { return this.$store.getters['task/get'](this.taskId) },
    topItems() { return this.task && this.task.items.slice(0, 3) },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../stylus/variables'

  .TasksTask
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
