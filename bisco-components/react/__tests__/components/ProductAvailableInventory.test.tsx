import { render } from '@vtex/test-tools/react'
import React from 'react'
import ProductAvailableInventory from '../../components/Inventory/ProductAvailableInventory'

describe('<ProductAvailableInventory />', () => {
  const renderComponent = () => {
    return render(<ProductAvailableInventory/>)
  }

  it('should be mounted', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should match the snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should have available inventory 100', () => {
    const { getByText } = renderComponent()
    expect(getByText('Items Available: 100')).toBeDefined()
  })
})
