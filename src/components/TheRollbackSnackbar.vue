<template>
  <div class="TheRollbackSnackbar" :class="{ hidden }">
    <span class="description">{{ description }}</span>
    <BaseButton
      class="rollback-button"
      flat round icon="restore"
      @click="$store.dispatch('rollback/rollback')"
    />
    <BaseButton
      class="close-button"
      flat round icon="close"
      @click="$store.dispatch('rollback/register', { fn: null })"
    />
  </div>
</template>

<script>

export default {
  name: 'TheRollbackSnackbar',

  computed: {
    rollback() { return this.$store.state.rollback },
    hidden() { return this.rollback.undo.fn === null },
    description() { return this.rollback.undo.description },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../stylus/variables.styl'

  .TheRollbackSnackbar
    position fixed
    bottom 0
    right 0
    width 100%
    background $dark
    color $grey1
    padding 1.5em
    box-shadow:
      0 -2px 1px -1px rgba(0, 0, 0, .2),
      0 -1px 1px 0 rgba(0, 0, 0, .14),
      0 -1px 3px 0 rgba(0, 0, 0, .12)
    opactity 1
    transition:
      opacity 150ms cubic-bezier(.25, .8, .25, 1),
      box-shadow 150ms cubic-bezier(.25, .8, .25, 1)

    display flex
    align-items center
    height 90px

    &:hover
      box-shadow:
        0 -4px 10px -1px rgba(0, 0, 0, .2),
        0 -2px 6px 0 rgba(0, 0, 0, .14),
        0 -1px 3px 0 rgba(0, 0, 0, .12)

    &.hidden
      opacity 0
      pointer-events none

    @media md
      width 600px
      left 0
      right 0
      bottom .5em
      margin 0 auto

  .description
    flex 1

  .close-button, .rollback-button
    margin-left 1em
</style>
