import { shallowMount } from '@vue/test-utils'
import BaseButton from '@/components/BaseButton'

describe('BaseButton', () => {
  it('respects label prop', () => {
    const label = 'Button label'
    const wrapper = shallowMount(BaseButton, {
      propsData: { label },
    })
    expect(wrapper.text()).toMatch(label)
  })

  it('has BaseButton class', () => {
    const wrapper = shallowMount(BaseButton)
    expect(wrapper.classes()).toContain('BaseButton')
  })
})
