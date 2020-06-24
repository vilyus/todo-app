<template>
  <div class="Task">
    <template v-if="task">
      <BaseInput
        v-model="model.title"
        label="Task title"
        class="title-input"
      />

      <div class="items">
        <Draggable
          v-model="model.items"
          draggable=".item"
          tag="ul"
          :animation="150"
          @end="setItemsOrder()"
        >
          <transition-group>
            <li
              v-for="(item, i) in model.items"
              :key="`${i}-${item && item.id}`"
              class="item"
              :class="{ checked: !!item && item.checked }"
              title="Drag ToDo's to change their order, click to toggle"
            >
              <template v-if="item">
                <BaseInput
                  v-if="item.edit"
                  v-model="item.title"
                  label="Edit ToDo"
                  @enter="item.edit = false"
                />
                <BaseCheckbox
                  v-else
                  v-model="item.checked"
                  :label="item.title || '<empty>'"
                />
                <BaseButton
                  flat round class="edit-icon"
                  :icon="item.edit ? 'check' : 'edit'"
                  title="Edit ToDo"
                  @click="item.edit = !item.edit"
                />
                <BaseButton
                  flat round icon="delete" class="delete-icon"
                  title="Delete ToDo"
                  @click="deleteItem(item)"
                />
              </template>
            </li>
          </transition-group>
          <template #footer>
            <li v-if="!model.items.length" class="empty">
              Please go on and add some ToDo's below:
            </li>
          </template>
        </Draggable>
      </div>

      <BaseInput
        v-model="model.newItemTitle"
        label="Add new ToDo"
        class="new-item-title-input"
        @enter="addNewItem()"
        @click:append="addNewItem()"
      >
        <template
          v-if="model.newItemTitle && model.newItemTitle.trim()"
          #append
        >
          <BaseButton flat round :color="$colors.success">
            <span class="material-icons">add</span>
          </BaseButton>
        </template>
      </BaseInput>

      <section class="actions-section">
        <BaseButton v-show="hasChanges" @click="save()">
          <span class="material-icons">save</span>
          <span>Apply changes</span>
        </BaseButton>

        <BaseButton v-show="hasChanges" @click="revertModal = true">
          <span class="material-icons">restore</span>
          <span>Revert changes</span>
        </BaseButton>

        <BaseButton @click="deleteModal = true">
          <span class="material-icons">delete</span>
          <span>Delete task</span>
        </BaseButton>
      </section>

      <ModalDialog
        v-model="revertModal"
      >
        <h1>Are you sure that you want to revert changes?</h1>
        <section class="modal-actions">
          <BaseButton flat @click="revertModal = false">
            <span class="material-icons">cancel</span>
            <span>No, keep changes</span>
          </BaseButton>
          <BaseButton class="autofocus" :color="$colors.danger" @click="revert()">
            <span class="material-icons">restore</span>
            <span>Yes, revert changes</span>
          </BaseButton>
        </section>
      </ModalDialog>

      <DeleteModal
        v-model="deleteModal"
        :task-id="taskId"
        @delete="$router.replace({ name: 'Tasks' })"
      />

    </template>
  </div>
</template>

<script>
import * as R from 'ramda'
import Draggable from 'vuedraggable'

import ModalDialog from './ModalDialog'
import DeleteModal from './DeleteModal'

export default {
  name: 'Task',

  components: {
    DeleteModal,
    Draggable,
    ModalDialog,
  },

  props: {
    taskId: { type: Number, required: true },
  },

  data: () => ({
    model: {
      title: null,
      items: null,
      newItemTitle: '',
    },
    revertModal: false,
    deleteModal: false,
  }),

  computed: {
    task() { return this.$store.getters['task/get'](this.taskId) },

    hasChanges() {
      const { task, model } = this

      // `id` and `edit` flag do not show changes
      const clearItems = R.map(R.omit(['id', 'edit']))
      return !!model.newItemTitle || task.title !== model.title ||
        !R.equals(clearItems(task.items), clearItems(model.items))
    },
  },

  watch: {
    taskId: {
      handler(taskId) {
        const { $store, task } = this
        if (task === null) $store.dispatch('task/get', { taskId })
      },
      immediate: true,
    },

    task: {
      handler: 'initModel',
      immediate: true,
    },

    model: {
      handler() {
        // hide rollback snackbar on model changes
        this.$store.dispatch('rollback/register', { fn: null })
      },
      deep: true,
    },
  },

  methods: {
    addNewItem() {
      const { model, taskId } = this

      const title = model.newItemTitle.trim()
      if (!title) return

      model.items.push({
        id: null,
        taskId,
        checked: false,
        title,
        order: model.items.length
          ? R.last(model.items).order + 10
          : 10,
        edit: false,
      })
      model.newItemTitle = ''
    },

    deleteItem(item) {
      const { model } = this

      model.items = model.items.filter(listItem => listItem !== item)
    },

    initModel() {
      // init model on value change or when revert was requested
      const { task } = this

      if (task) {
        this.model.title = task.title
        this.model.items = R.clone(task.items)
          // add edit flag for per-item editing
          .map(item => ({ ...item, edit: false }))
        this.model.newItemTitle = ''
      }
    },

    revert() {
      // Confirm revert changes from the modal dialog
      this.initModel()
      this.revertModal = false
    },

    setItemsOrder() {
      // after drag and drop set order for `TodoItem`s
      this.$nextTick(() => {
        const setOrder = (item, ix) => ({ ...item, order: (ix + 1) * 10 })
        this.model.items = R.addIndex(R.map)(setOrder, this.model.items)
      })
    },

    registerUndoRedo(undoState, redoState) {
      // undo/redo functionality
      const { $store } = this

      // undo function updates task to its previous value
      const undoFn = () => {
        $store.dispatch('task/update', { task: undoState })
          .then(() => {
            // on success it swap undoState and redoState
            const oldUndoState = undoState
            undoState = redoState
            redoState = oldUndoState

            // now, when states are swapped this same function
            // can provide redo functionality
            return $store.dispatch('rollback/register', {
              fn: undoFn,
              description: 'Changes reverted. Want to redo them?',
            })
          })
      }

      $store.dispatch('rollback/register', {
        fn: undoFn,
        description: 'Changes saved. Want to undo them?',
      })
    },

    save() {
      // update the task
      const {
        $store,
        taskId,
        task,
        model: { title, items },
      } = this

      // if user typed something to add a new `Todo` - apply it first
      this.addNewItem()

      // remove `id`'s of new items and client-only `edit` prop
      const apiItems = items
        .map(item => ({ ...item, id: item.id || undefined, edit: undefined }))

      // build the updated task
      const updatedTask = { id: taskId, title, items: apiItems }
      // remember the task current state for undo
      const undoState = {
        id: taskId,
        title: task.title,
        items: R.clone(task.items)
          .map(item => ({ ...item, id: item.id || undefined, edit: undefined })),
      }

      // update task
      return $store.dispatch('task/update', { task: updatedTask })
        // show the undo snackbar
        .then(() => { this.registerUndoRedo(undoState, updatedTask) })
    },
  },
}
</script>

<style lang="stylus" scoped>
  @import '../stylus/variables'

  .title-input, .new-item-title-input
    width 100%

    @media md
      width auto
      min-width 400px

  .items
    overflow-y auto
    margin 20px 0

    ul
      margin 0
      list-style none
      padding-left 0
      padding-top 7px
      text-align left

      display inline-block
      width 100%
      max-width 100%

      @media md
        width auto
        min-width 400px
        min-height 32px !important
        max-height calc(100vh - 520px)
        overflow-y auto

      li
        display flex
        align-items center
        margin-bottom 7px
        max width 100%

        .delete-icon
          color $danger
        .delete-icon, .edit-icon
          background-color transparent
          margin-left 7px

        &.checked
          color $grey2

          & >>> label
            text-decoration line-through

          .delete-icon, .edit-icon
            color $grey3

  .empty
    font-style italic
    color $grey4

  .actions-section
    margin-top 20px

    .BaseButton
      display flex
      flex-wrap nowrap
      align-items center
      width 100%
      margin-bottom 20px
      margin-left auto
      margin-right auto

      @media md
        width auto
        min-width 400px

  .ModalDialog
    text-align center
</style>
