<template>
  <span
    class="BaseField"
    :class="{ 'has-append': !!($slots.append || $scopedSlots.append) }"
  >
    <label
      v-if="label || $slots.label"
      :for="generatedId"
      :class="{ placeholder: !value && !hasFocus }"
    >
      <slot name="label" v-bind="{ generatedId, label }">
        {{ label }}
      </slot>
    </label>

    <slot
      v-bind="{ generatedId, on: { focus: onFocus, blur: onBlur } }"
    />

    <template v-if="$slots.append || $scopedSlots.append">
      <span
        class="append"
        @click="$emit('click:append')"
        @keyup.enter="$emit('click:append')"
      >
        <slot name="append" />
      </span>
    </template>
  </span>
</template>

<script>
const autoId = (() => {
  let minId = Number.MIN_SAFE_INTEGER
  return () => `base-field-${+new Date()}-${minId++}`
})()

export default {
  name: 'BaseField',

  props: {
    label: { type: String, default: null },
    value: { default: null },
  },

  data: () => ({
    generatedId: autoId(),
    hasFocus: false,
  }),

  methods: {
    onFocus() { this.hasFocus = true },
    onBlur() { this.hasFocus = false },
  },
}
</script>

<style lang="stylus" scoped>
  @import "../stylus/variables"

  .BaseField
    position relative
    display inline-flex
    border 1px solid $grey3

    & >>> input
      border 0
      outline none
      padding 15px
      padding-left 30px

      min-width 50px
      max-width 100%
      flex 1 1 0

    &.has-append input
      padding-right 50px

    &.has-append label
      max-width calc(100% - 45px - 30px)

  label
    pointer-events none
    user-select none

    white-space nowrap
    max-width calc(100% - 45px)
    overflow hidden
    text-overflow  ellipsis
    border 1px solid $grey3

    position absolute
    top -7px
    left 25px

    background-color white
    padding 0 7px
    font-size 12px
    color $grey4
    transition:
      transform 250ms cubic-bezier(.25, .8, .25, 1),
      padding 250ms cubic-bezier(.25, .8, .25, 1),
      font-size 250ms cubic-bezier(.25, .8, .25, 1),
      background-color 250ms cubic-bezier(.25, .8, .25, 1),
      border-color 250ms cubic-bezier(.25, .8, .25, 1),
      top 250ms cubic-bezier(.25, .8, .25, 1)

    &.placeholder
      border-color transparent !important
      top 50%
      transform translateY(-50%)
      font-size 24px
      padding 0

  .append
    position absolute
    right 7px
    top 50%
    transform translateY(-50%)
</style>
