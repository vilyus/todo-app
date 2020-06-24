<!-- The details page: one `Task` (titled collections of `TodoItem`s) -->

<template>
  <div class="PageTask">
    <Task :task-id="taskId" />
  </div>
</template>

<script>
import Task from '../components/Task'

export default {
  name: 'PageTask',

  components: {
    Task,
  },

  props: {
    taskId: { type: Number, required: true },
  },
}
</script>
