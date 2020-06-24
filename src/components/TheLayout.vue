<template>
  <div class="TheLayout">
    <TheXhrProgress />

    <router-view name="title">
      <h1>Todo App</h1>
    </router-view>

    <router-view/>

    <TheRollbackSnackbar />
  </div>
</template>

<script>
import TheRollbackSnackbar from './TheRollbackSnackbar'
import TheXhrProgress from './TheXhrProgress'

export default {
  name: 'TheLayout',

  components: {
    TheRollbackSnackbar,
    TheXhrProgress,
  },
}
</script>

<style lang="stylus" scoped>
  @import "../stylus/variables"

  .TheLayout
    width 100vw
    min-height 100vh
    position relative

    background $grey1
    height 100%
    padding 10px 15px

    @media md
      width 900px
      padding 30px 20px
      box-shadow:
        0 0 20px rgba(0, 0, 0, .25),
        0 0 8px rgba(0, 0, 0, .1),
        0 0 4px rgba(0, 0, 0, .1)
    @media lg
      width 1240px
</style>
