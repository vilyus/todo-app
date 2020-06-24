<template>
  <BaseCard
    class="TasksTask"
    clickable
    :to="{ name: 'Task', params: { id: taskId } }"
   :title="`Click to edit &quot;${task.title}&quot;`"
  >
    <h2>
      <span class="title">{{ task.title }}</span>

      <BaseButton
        icon="delete" flat round
        :color="$colors.danger"
        class="delete-button"
        tabindex="-1"
        :title="`Click to delete &quot;${task.title}&quot;`"
        @click="$emit('delete', taskId)"
        @click.native.prevent.stop="$emit('delete', taskId)"
      />
    </h2>
    <ul class="unstyled-list">
      <li
        v-for="item in topItems"
        :key="item.id"
        :class="{ muted: item.checked }"
        class="flex-center"
      >
        <span
          class="material-icons list-checkbox"
          v-text="item.checked ? 'check_box' : 'check_box_outline_blank'"
        />
        <span
          :class="{ 'line-through': item.checked }"
          v-text="item.title || '<empty>'"
        />
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
    position relative
    padding-top 0

    @media sm
      .delete-button
        display none

      &:hover, &:active, &:focus, &.active
        .delete-button
          display flex

  h2
    display flex
    align-items center
    height 40px

    .title
      flex-grow 1
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      margin-right .5em

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

  .line-through
    text-decoration line-through

  .muted
    color $grey2
</style>
