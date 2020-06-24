<!-- The details page: one `TodoList` (titled collections of `TodoItem`s) -->

<template>
  <div class="PageTodoList">
    <TodoList :todo-list-id="todoListId" />
  </div>
</template>

<script>
import TodoList from '../components/TodoList'

export default {
  name: 'PageTodoList',

  components: {
    TodoList,
  },

  props: {
    todoListId: { type: Number, required: true },
  },
}
</script>
