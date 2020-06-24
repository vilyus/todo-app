<template>
  <button
    :class="{ round, flat, active }"
    :style="{ color, borderColor: flat ? null : color }"
    type="button"
    class="BaseButton"
    @keydown.enter.prevent="active = true"
    @keydown.space="active = true"
    @keyup="active = false"
    @keyup.enter="active = false, $emit('click')"
    @blur="active = false"
    @click="$emit('click')"
  >
    <slot>
      <span
        v-if="icon"
        class="button-icon material-icons"
        v-text="icon"
      />
      <span v-if="label">{{ label }}</span>
    </slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',

  props: {
    icon: { type: String, default: null },
    label: { type: String, default: null },
    round: { type: Boolean, default: false },
    flat: { type: Boolean, default: false },
    color: { type: String, default: null },
  },

  data: () => ({
    active: false,
  }),
}
</script>

<style lang="stylus" scoped>
  @import "../stylus/variables"

  .BaseButton
    display inline-flex
    flex-wrap nowrap
    align-items center
    justify-content center

    border 1px solid $grey3
    background-color white
    height 50px
    color $grey4
    padding 0 16px

    cursor pointer
    pointer-events all
    outline none
    outline-offset none
    appearance none
    -webkit-appearance none
    -moz-appearance none

    box-shadow 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24)
    transition:
      box-shadow 150ms cubic-bezier(.25, .8, .25, 1),
      transform 150ms cubic-bezier(.25, .8, .25, 1),
      background-color 150ms cubic-bezier(.25, .8, .25, 1)

    &.round
      border-radius 100%
      width 38px
      height 38px

    &.flat
      border-color transparent
      box-shadow none

    &:hover, &:focus
      box-shadow 0 1px 8px rgba(0, 0, 0, .25), 0 1px 4px rgba(0, 0, 0, .22)

    &::-moz-focus-inner
      border 0

    &:active, &.active
      transform translateY(3px)
      background-color $grey1

    & > span
      pointer-events none

    & >>> .material-icons + *
      margin-left 5px
    & >>> * + .material-icons
      margin-right 5px
</style>
