<template>
  <div class="TodoLists">
    <section>
      <BaseInput
        v-model="model.newTodoListTitle"
        class="add-todo-list-field"
        label="New task"
        @enter="submit()"
      >
        <template v-if="model.newTodoListTitle" #append>
          <BaseButton
            round
            flat
            :color="$colors.success"
            icon="note_add"
            title="Add new task"
            @click="submit()"
          />
        </template>
      </BaseInput>
    </section>
    <section>
      <div v-if="!lists"><br />Loading...</div>
      <template v-else>
        <section class="lists-flex">
          <TodoListsTodoList
            v-for="list in lists"
            :key="list.id"
            :todo-list-id="list.id"
          />
        </section>
      </template>
    </section>
  </div>
</template>

<script>
import TodoListsTodoList from './TodoListsTodoList'

export default {
  name: 'TodoLists',

  components: {
    TodoListsTodoList,
  },

  data: () => ({
    model: {
      newTodoListTitle: '',
    },
  }),

  computed: {
    // all `TodoItem`s are grouped in such `TodoList`s
    lists() { return this.$store.getters['todoList/list'] },
  },

  created() {
    // get lists form DB
    this.$store.dispatch('todoList/getList')
  },

  methods: {
    submit() {
      const { $store, model: { newTodoListTitle: title } } = this

      return $store.dispatch('todoList/create', { todoList: { title } })
        .then(() => { this.model.newTodoListTitle = '' })
    },
  },
}
</script>

<style scoped lang="stylus">
  @import "../stylus/variables"

  .add-todo-list-field
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

  .TodoListsTodoList
    margin 20px 0
    width 100%

    @media sm
      width calc(50% - 32px)
    @media lg
      width calc(33% - 32px)
</style>
