<template>
  <div id="app" class="App">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

  watch: {
    $route() { window.scroll(0, 0) },
  },
}
</script>

<style lang="stylus" scoped>
  @import './stylus/variables'

  .App
    font-family Roboto, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color $dark
    text-align center
    display flex
    justify-content center
    min-height 100vh
    max-width 100vw
    overflow hidden
</style>

<style lang="stylus">
  @import './stylus/variables'

  body
    color $dark
    background $grey2
    overflow-y scroll
  *
    box-sizing border-box
</style>
