<!-- The main page: list of `TodoList`s (titled collections of `TodoItem`s) -->

<template>
  <div class="PageTodoLists">
    <TodoLists />
  </div>
</template>

<script>
import TodoLists from '../components/TodoLists'

export default {
  name: 'PageTodoLists',

  components: {
    TodoLists,
  },
}
</script>
