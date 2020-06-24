<template>
  <transition name="fade">
    <div class="ModalDialog" v-show="model">
      <div class="dialog">
        <slot />
        <!-- button prevents tabbing underneath modal windows -->
        <button type="button" class="tab-trap" @keydown.prevent />
      </div>
      <div class="backdrop" @click="model = false" />
    </div>
  </transition>
</template>

<script>
const ESC = 27

export default {
  name: 'ModalDialog',

  props: {
    value: { type: Boolean, default: false },
  },

  data: () => ({
    model: false,
  }),

  watch: {
    value: {
      handler(value) { this.model = value },
      immediate: true,
    },
    model(model) {
      this.$emit('input', model)

      if (model) {
        this.$nextTick(() => {
          const focusEl = this.$el.querySelector('.autofocus')
          if (focusEl) focusEl.focus()
        })
      }
    },
  },

  mounted() {
    document.addEventListener('keydown', this.onKeydown, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown, false)
  },
  methods: {
    onKeydown(evt) {
      const code = evt.keyCode || evt.which

      if (code === ESC) this.model = false
    },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../stylus/variables'

  .ModalDialog
    opacity 1

    .dialog
      position fixed
      z-index $z-modal-window
      top 0
      left 0
      width calc(100vw - 1px)
      height calc(100vh - 1px)
      opacity 1

      padding 20px

      background $white

      @media sm
        top 60px
        left 50%
        transform translateX(-50%)
        width calc(100% - 50px)
        height auto
        min-height 200px
        box-shadow 0 1px 16px rgba(0, 0, 0, .3), 0 1px 7px rgba(0, 0, 0, .4)

      @media md
        width 800px

      & >>> .modal-actions
        display flex
        flex-wrap wrap
        justify-content space-around
        margin-top 20px

        & > .BaseButton
          margin-top 20px

    .backdrop
      position fixed
      z-index $z-modal-backdrop
      top 0
      left 0
      right 0
      bottom 0

      width calc(100vw - 1px)
      height calc(100vh - 1px)

      background $grey5
      opacity .7

  .fade-enter-active, .fade-leave-active
    transition opacity 250ms
  .fade-enter, .fade-leave-to
    opacity 0

  .tab-trap
    position absolute
    top 0
    left 0
    opacity 0
</style>
