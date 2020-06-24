<template>
  <article
    class="BaseCard"
    :class="{ clickable, active }"
    @blur="this.active = false"
    @click="onCardClick()"
  >
    <router-link
      v-if="clickable"
      ref="routerLink"
      :to="to || '#'"
      :replace="replace"
      class="router-link"
    >
      <slot />
    </router-link>
    <slot v-else />
  </article>
</template>

<script>
export default {
  name: 'BaseCard',

  props: {
    // can be clicked to go to another route / $emit('click')
    clickable: { type: Boolean, default: false },
    // same as router-link `to` prop
    to: { type: [String, Object], default: null },
    // same as router-link `replace` prop
    replace: { default: false },
  },

  data: () => ({
    active: false,
  }),

  computed: {
    activeListeners() {
      const { clickable } = this
      return clickable ? {
        'keydown.enter': () => { this.active = true },
        'keyup.enter': () => { this.active = false },
        blur: () => { this.active = false },
      } : {}
    },
  },

  watch: {
    clickable: {
      handler(clickable) { clickable ? this.startListen() : this.stopListen() },
      immediate: true,
    },
  },

  methods: {
    startListen() {
      document.body.addEventListener('keydown', this.keydown, false)
      document.body.addEventListener('keyup', this.keyup, false)
    },
    stopListen() {
      document.body.removeEventListener('keydown', this.keydown, false)
      document.body.removeEventListener('keyup', this.keyup, false)
    },
    keydown(e) {
      const code = e.keyCode || e.which

      if (!this.$refs.routerLink) return

      if (e.target === this.$refs.routerLink.$el && Number(code) === 13) {
        this.active = true
      }
    },
    keyup(e) {
      const code = e.keyCode || e.which

      if (this.active && Number(code) === 13) {
        this.active = false
      }
    },
    onCardClick() {
      const { $router, clickable, to, replace } = this

      if (!clickable || !to) return

      if (replace) $router.replace(to).catch(() => {})
      else $router.push(to).catch(() => {})
    },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../stylus/variables'

  .BaseCard
    background white
    padding 8px 16px
    display flex
    flex-direction column

    box-shadow:
      0 2px 1px -1px rgba(0, 0, 0, .2),
      0 1px 1px 0 rgba(0, 0, 0, .14),
      0 1px 3px 0 rgba(0, 0, 0, .12)

    transition box-shadow 150ms cubic-bezier(.25, .8, .25, 1)

    @media md
      padding 16px 32px

    &.clickable
      cursor pointer
      transition:
        box-shadow 150ms cubic-bezier(.25, .8, .25, 1),
        transform 150ms cubic-bezier(.25, .8, .25, 1),
        background-color 150ms cubic-bezier(.25, .8, .25, 1)

      &:hover, &:active, &.active, &:focus
        box-shadow:
          0 8px 10px -1px rgba(0, 0, 0, .2),
          0 2px 6px 0 rgba(0, 0, 0, .14),
          0 1px 3px 0 rgba(0, 0, 0, .12)

      &:active, &.active, &.focus
        transform translateY(3px)
        background-color $grey1
        box-shadow:
          0 11px 10px -1px rgba(0, 0, 0, .2),
          0 5px 6px 0 rgba(0, 0, 0, .14)

  .router-link
    display flex
    flex-direction column
    color inherit
    text-decoration inherit
    height 100%
</style>
