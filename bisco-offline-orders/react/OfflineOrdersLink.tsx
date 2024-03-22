import { injectIntl } from 'react-intl'

interface RenderProps {
  name: string
  path: string
}

interface Props{
  render: (paths: RenderProps[]) => any
  intl: any
}

const OfflineOrdersLink = ({ render, intl }: Props) => {
  return render([
    {
      name: intl.formatMessage({ id: 'offline.orders.list.link' }),
      path: '/offlineorders',
    }
  ])
}

export default injectIntl(OfflineOrdersLink)
