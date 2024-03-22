import { render } from '@vtex/test-tools/react'
import React from 'react'
import ProductSummaryAvailableInventory from '../../components/Inventory/ProductSummaryAvailableInventory'

describe('<ProductSummaryAvailableInventory />', () => {
  const renderComponent = () => {
    return render(<ProductSummaryAvailableInventory/>)
  }

  it('should be mounted', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should match the snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should have available inventory 0', () => {
    const { getByText } = renderComponent()
    expect(getByText('Items Available: 0')).toBeDefined()
  })
})
