<template>
  <ModalDialog
    v-model="model"
  >
    <template v-if="taskId !== null">
      <h1>Are you sure that you want to delete this task?</h1>

      <section class="modal-actions">
        <BaseButton flat @click="model = false">
          <span class="material-icons">cancel</span>
          <span>No, keep the task</span>
        </BaseButton>
        <BaseButton class="autofocus" :color="$colors.danger" @click="deleteTask()">
          <span class="material-icons">delete</span>
          <span>Yes, delete it</span>
        </BaseButton>
      </section>
    </template>
  </ModalDialog>
</template>

<script>
import ModalDialog from './ModalDialog'

export default {
  name: 'DeleteModal',

  components: {
    ModalDialog,
  },

  props: {
    value: { type: Boolean, default: false },
    taskId: { type: Number, default: null },
  },

  data: () => ({
    model: false,
  }),

  computed: {
    task() { return this.$store.getters['task/get'](this.taskId) },
  },

  watch: {
    value: {
      handler(value) { this.model = value },
      immediate: true,
    },
    model(model) { this.$emit('input', model) },
  },

  methods: {
    deleteTask() {
      const { $store, taskId } = this

      this.$emit('delete')
      return $store.dispatch('task/delete', { taskId })
        .then(() => { this.model = false })
    },
  },
}
</script>

<style lang="stylus" scoped>
  .ModalDialog
    text-align center
</style>
