<!-- The main page: list of `Task`s (titled collections of `TodoItem`s) -->

<template>
  <div class="PageTasks">
    <Tasks />
  </div>
</template>

<script>
import Tasks from '../components/Tasks'

export default {
  name: 'PageTasks',

  components: {
    Tasks,
  },
}
</script>
