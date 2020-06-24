<template>
  <span class="BaseCheckbox" :class="{ focus }" @click="model = !model">
    <input
      v-model="model"
      type="checkbox"
      class="focus-trap"
      @focus="focus = true"
      @blur="focus = false"
      @keyup.enter="model = !model"
    />
    <span
      :id="generatedId"
      class="material-icons checkbox-icon"
      v-text="model ? 'check_box' : 'check_box_outline_blank'"
    />
    <label :for="generatedId">{{ label }}</label>
  </span>
</template>

<script>
const autoId = (() => {
  let minId = Number.MIN_SAFE_INTEGER
  return () => `base-field-${+new Date()}-${minId++}`
})()

export default {
  name: 'BaseCheckbox',

  model: {
    prop: 'value',
    event: 'input',
  },

  data: () => ({
    generatedId: autoId(),
    model: null,
    focus: false,
  }),

  props: {
    value: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },

  watch: {
    value: {
      handler(value) { this.model = value },
      immediate: true,
    },

    model: {
      handler(model) {
        if (model !== this.value) this.$emit('input', model)
      },
      immediate: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../stylus/variables'

  .BaseCheckbox
    position relative
    display inline-flex
    align-items center
    cursor pointer
    max-width 100%
    user-select none

    .focus-trap
      position: absolute
      top 0
      left 0
      opacity 0
      pointer-events none

    .checkbox-icon
      margin-right 7px
      border 1px solid transparent

    &.focus .checkbox-icon
      border 1px dashed $grey3

    label
      cursor pointer
      user-select none
      flex 1

  .BaseCheckbox, label
    overflow hidden
    text-overflow ellipsis
</style>
