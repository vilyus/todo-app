<template>
  <BaseLoader
    class="TheXhrProgress"
    :class="{ show }"
  />
</template>

<script>
const builtinSend = XMLHttpRequest.prototype.send
let pendingRequests = 0

export default {
  name: 'TheXhrProgress',

  data: () => ({
    show: false,
  }),

  mounted() {
    this.highjackAjax()
  },

  beforeDestroy() {
    this.restoreAjax()
  },

  methods: {
    highjackAjax() {
      const self = this

      XMLHttpRequest.prototype.send = function() {
        ++pendingRequests

        self.show = true
        this.addEventListener('readystatechange', () => {
          // Only run if the request is complete
          if (this.readyState !== 4) return
          // Hide Ajax progress bar
          if (--pendingRequests <= 0) {
            setTimeout(() => {
              if (pendingRequests <= 0) self.show = false
            }, 250)
          }
        }, false)

        return builtinSend.apply(this, arguments)
      }
    },

    restoreAjax() {
      XMLHttpRequest.prototype.send = builtinSend
      pendingRequests = 0
    },
  },
}
</script>

<style lang="stylus" scoped>
  .TheXhrProgress
    position absolute
    top 10px
    right 10px

    pointer-events none

    opacity 0
    transition opacity 150ms cubic-bezier(0.5, 0, 0.5, 1)

    &.show
      opacity 1
</style>
