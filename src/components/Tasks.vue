<template>
  <div class="Tasks">
    <section>
      <BaseInput
        v-model="model.newTaskTitle"
        class="add-task-field"
        label="New task"
        @enter="disable ? null : submit()"
      >
        <template v-if="model.newTaskTitle" #append>
          <BaseButton
            round
            flat
            :color="$colors.success"
            icon="note_add"
            title="Add new task"
            @click="disable ? null : submit()"
          />
        </template>
      </BaseInput>
    </section>

    <section>
      <div v-if="!lists"><br />Loading...</div>
      <template v-else>
        <section class="lists-flex">
          <TasksTask
            v-for="list in lists"
            :key="list.id"
            :task-id="list.id"
            @delete="deleteTaskId = $event"
          />
        </section>
      </template>
    </section>

    <DeleteModal
      :value="deleteTaskId !== null"
      :task-id="deleteTaskId"
      @input="deleteTaskId = $event ? deleteTaskId : null"
    />

  </div>
</template>

<script>
import TasksTask from './TasksTask'
import DeleteModal from './DeleteModal'

export default {
  name: 'Tasks',

  components: {
    DeleteModal,
    TasksTask,
  },

  data: () => ({
    model: {
      newTaskTitle: '',
    },
    disable: false,
    deleteTaskId: null,
  }),

  computed: {
    // all `TodoItem`s are grouped in such `Task`s
    lists() { return this.$store.getters['task/list'] },
  },

  created() {
    // get lists form DB
    this.$store.dispatch('task/getList')
  },

  methods: {
    submit() {
      const { $store, model: { newTaskTitle: title } } = this

      if (!title) return

      this.disable = true
      return $store.dispatch('task/create', { task: { title } })
        .then(() => { this.model.newTaskTitle = '' })
        .finally(() => { this.disable = false })
    },
  },
}
</script>

<style scoped lang="stylus">
  @import "../stylus/variables"

  .add-task-field
    width 100%
    max-width 100%

    @media md
      width: auto
      min-width: 400px

  .lists-flex
    display flex
    flex-wrap wrap
    justify-content space-around

    padding-top 32px

  .TasksTask
    margin 20px 0
    width 100%

    @media sm
      width calc(50% - 32px)
    @media lg
      width calc(33% - 32px)
</style>
