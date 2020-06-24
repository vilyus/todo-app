<template>
  <div class="TodoList">
    <template v-if="todoList">
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
                <BaseCheckbox
                  v-model="item.checked"
                  :label="item.title"
                />
                <BaseButton
                  flat round class="delete-icon"
                  title="Delete ToDo"
                  @click="deleteItem(item)"
                >
                  <span class="material-icons">delete</span>
                </BaseButton>
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
        <BaseButton @click="save()">
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

      <ModalDialog
        v-model="deleteModal"
      >
        <h1>Are you sure that you want to delete this task?</h1>
        <section class="modal-actions">
          <BaseButton flat @click="deleteModal = false">
            <span class="material-icons">cancel</span>
            <span>No, keep the task</span>
          </BaseButton>
          <BaseButton class="autofocus" :color="$colors.danger" @click="deleteTask()">
            <span class="material-icons">delete</span>
            <span>Yes, delete it</span>
          </BaseButton>
        </section>
      </ModalDialog>
    </template>
  </div>
</template>

<script>
import * as R from 'ramda'
import Draggable from 'vuedraggable'

import ModalDialog from './ModalDialog'

export default {
  name: 'TodoList',

  components: {
    Draggable,
    ModalDialog,
  },

  props: {
    todoListId: { type: Number, required: true },
  },

  data: () => ({
    model: {
      title: null,
      items: null,
      newItemTitle: '',
      removeItemIds: [],
    },
    revertModal: false,
    deleteModal: false,
  }),

  computed: {
    todoList() { return this.$store.getters['todoList/get'](this.todoListId) },

    hasChanges() {
      const { todoList, model } = this

      return todoList.title !== model.title ||
        !R.equals(todoList.items, model.items)
    },
  },

  watch: {
    todoListId: {
      handler(todoListId) {
        const { $store, todoList } = this
        if (todoList === null) $store.dispatch('todoList/get', { todoListId })
      },
      immediate: true,
    },
    todoList: {
      handler: 'initModel',
      immediate: true,
    },
  },

  methods: {
    addNewItem() {
      const { model, todoListId: listId } = this

      const title = model.newItemTitle.trim()
      if (!title) return

      model.items.push({
        id: null,
        listId,
        checked: false,
        title,
        order: model.items.length
          ? R.last(model.items).order + 10
          : 10,
      })
      model.newItemTitle = ''
    },

    deleteItem(item) {
      const { model } = this

      model.items = model.items.filter(listItem => listItem !== item)
      if (item.id) {
        model.removeItemIds.push(item.id)
      }
    },

    initModel() {
      const { todoList } = this

      if (todoList) {
        this.model.title = todoList.title
        this.model.items = R.clone(todoList.items)
        this.model.removeItemIds = []
      }
    },

    // Confirm revert changes from the modal dialog
    revert() {
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

    save() {
      const {
        $store,
        todoListId,
        model: { title, items, removeItemIds },
      } = this

      const todoList = { id: todoListId, title }

      // 1. update title
      return $store.dispatch('todoList/update', { todoList })
        // 2. delete removed items
        .then(() =>
          Promise.all(removeItemIds.map(todoItemId =>
            $store.dispatch('todoItem/delete', { todoItemId }))))
        // 3. create/update rest of the items
        .then(() =>
          Promise.all(items.map(todoItem =>
            todoItem.id
              ? $store.dispatch('todoItem/update', { todoItem })
              : $store.dispatch('todoItem/create', {
                todoItem: R.omit(['id'], todoItem),
              }))))
        // 4. reload `TodoList` with new items
        .then(() => $store.dispatch('todoList/get', { todoListId }))
    },

    deleteTask() {
      const { $store, $router, todoListId } = this

      return $store.dispatch('todoList/delete', { todoListId })
        .then(() => $router.replace({ name: 'TodoLists' }))
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
          background-color transparent
          margin-left 7px

        &.checked
          color $grey2

          & >>> label
            text-decoration line-through

          .delete-icon
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
