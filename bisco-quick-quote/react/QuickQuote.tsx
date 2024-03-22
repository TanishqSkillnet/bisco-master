import { head, isEmpty, path, pathOr } from 'ramda'
import React, { Component, FormEvent } from 'react'
import { ChildProps, compose, graphql, Mutation, MutationFn } from 'react-apollo'
import { withPixel } from 'vtex.pixel-manager/PixelContext'
import { Button, DatePicker, Dropdown, Input, Modal } from 'vtex.styleguide'
import ADD_QUICK_QUOTE from './mutations/addQuickQuote.gql'
import CREATE_QUOTE_IN_JAALA from './mutations/createQuoteInJaalaa.graphql'
import GET_BRANDS from './queries/getBrands.gql'
import PROFILE_QUERY from './queries/getProfile.gql'
import SESSION_QUERY from './queries/getSession.gql'
import styles from './quickQuote.css'
import { Brand, Profile } from './utils/constants'
import {countries, countriesKR, countriesES, countriesFR} from './utils/countries'
import { validate } from './utils/validator'
import { getCampaignData } from './utils/campaigninfo'
import { buildAddress } from './utils/address'
import Toast from './components/Toast'
import { getCookie, setCookie } from './utils/dom-utils'
import * as uuid from 'uuid'
import pushToDataLayer from './utils/pushToDataLayer'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext, RenderContextProps, RenderingContext } from 'vtex.render-runtime'

interface Props extends RenderContextProps{
  profile?: Profile
  brand: Brand
  profileLoading: boolean
  brandLoading: boolean
  sessionLoading: boolean
  productName: string
  isBlock: boolean
  runtime: RenderingContext
}

interface PixelProps {
  push: (...args: any) => void
}

interface Session {
  profile?: Profile
  address: {
    country: string
    state: string
    number: string
    street: string
    postalCode: string
    city: string
  }
}

interface Option {
  label: string
  value: string
}

interface State {
  isModalOpen: boolean
  company: string
  countryOptions: Option[]
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  location: string
  postalCode: string
  productId?: string | null
  brandId?: string | null
  targetPrice: number
  competitor: string
  quantity: number
  needByDate: Date
  showToast: boolean
  successToast: boolean
  touched: FormState
  changed: FormState
}

interface FormState {
  [key: string]: boolean
  brandId: boolean
  company: boolean
  competitor: boolean
  email: boolean
  location: boolean
  firstName: boolean
  lastName: boolean
  needByDate: boolean
  phoneNumber: boolean
  postalCode: boolean
  productId: boolean
  quantity: boolean
  targetPrice: boolean
}

interface Product {
  brand: string
  brandId: string
  categories: string[]
  productId: string
  productName: string
  productReference: string
  linkText: string
  items: Item[]
}

interface Item {
  itemId: string
  name: string
  ean?: string // TODO: provide this info at productImpression
  referenceId: { Key: string; Value: string }
  seller?: Seller
  sellers: Seller[]
}

interface Seller {
  commertialOffer: CommertialOffer
  sellerId: string
}

interface CommertialOffer {
  Price: number
  ListPrice: number
  AvailableQuantity: number
}

interface BrandInputProps {
  product: Product
  selectedItem: Item
}

const withBrand = graphql<BrandInputProps, Brand>(GET_BRANDS, {
  name: 'brands',
  props: ({ brands, ownProps }: any) => {
    const brand =
      brands.brands &&
      ownProps.product &&
      head(brands.brands.filter((brandItem: Brand) => brandItem.name === ownProps.product.brand))
    return {
      brand,
      brandLoading: brands.loading,
      ...brands,
    }
  },
})

const withProfile = graphql<{}, Profile>(PROFILE_QUERY, {
  name: 'profile',
  options: () => ({ ssr: false }),
  props: ({ profile }: any) => {
    return { ...profile, profileLoading: profile.loading }
  },
})

const withSession = graphql<{}, Session>(SESSION_QUERY, {
  name: 'session',
  options: () => ({ ssr: false }),
  props: ({ session }: any) => {
    return { ...session, sessionLoading: session.loading }
  },
})

class QuickQuote extends Component<
  Props & PixelProps & ChildProps<BrandInputProps, Brand & Session & Profile>,
  State
> {

  public handleCountries =()=> {
    const { binding } = this.props.runtime
    const address = binding?.canonicalBaseAddress
    const lang = address ? address.split('-')[1] : ''
    switch (lang) {
      case 'KR':
        return countriesKR;
      case 'FR':
        return countriesFR;
      case 'ES':
        return countriesES;
      default:
        return countries;
    }
  }

  public state = {
    brandId: this.props.brand ? this.props.brand.id : '',
    changed: {
      brandId: false,
      company: false,
      competitor: false,
      email: false,
      firstName: false,
      lastName: false,
      location: false,
      needByDate: false,
      phoneNumber: false,
      postalCode: false,
      productId: false,
      quantity: false,
      targetPrice: false,
    },
    company: pathOr('', ['profile', 'corporateName'], this.props),
    competitor: '',
    countryOptions: [],
    email: pathOr('', ['getSession', 'profile', 'email'], this.props),
    firstName: pathOr('', ['getSession', 'profile', 'firstName'], this.props),
    isModalOpen: false,
    lastName: pathOr('', ['getSession', 'profile', 'lastName'], this.props),
    location: pathOr('', ['profile', 'addresses', 0, 'country'], this.props),
    needByDate: new Date(),
    phoneNumber: pathOr('', ['getSession', 'profile', 'phone'], this.props),
    postalCode: pathOr('', ['profile', 'addresses', 0, 'postalCode'], this.props),
    productId: this.props.product ? this.props.product.productId : '',
    quantity: 0,
    showToast: false,
    successToast: false,
    targetPrice: 0,
    touched: {
      brandId: false,
      company: false,
      competitor: false,
      email: false,
      firstName: false,
      lastName: false,
      location: false,
      needByDate: false,
      phoneNumber: false,
      postalCode: false,
      productId: false,
      quantity: false,
      targetPrice: false,
    },
  }

  componentDidMount() {
    this.setState({ countryOptions: this.handleCountries() });
  }

  constructor(props: Props & PixelProps & ChildProps<BrandInputProps, Brand & Session & Profile>) {
    super(props)
    this.handleModalToggle = this.handleModalToggle.bind(this)
    this.handleConfirmation = this.handleConfirmation.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleUserInput = this.handleUserInput.bind(this)
    this.handleCountries = this.handleCountries.bind(this)
  }

  public handleBlur = (field: string) => () => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    })
  }

  public handleUserInput(e: FormEvent<HTMLInputElement>) {
    const name: string = e.currentTarget.name
    const value: string = e.currentTarget.value
    this.setState({ [name]: value, changed: { ...this.state.changed, [name]: true } } as any)
    e.stopPropagation()
    e.preventDefault()
  }

  public handleModalToggle(e: FormEvent<HTMLElement>) {
    this.setState({ isModalOpen: !this.state.isModalOpen })
    e.stopPropagation()
    e.preventDefault()
  }

  public handleConfirmation(e: FormEvent<HTMLElement>) {
    this.handleModalToggle(e)
  }

  private handleCloseToast = () => {
    this.setState({ showToast: false, successToast: false })
  }

  public handleChange(date: Date) {
    this.setState({ needByDate: date })
  }

  public formatDate(date: Date) {
    let month = '' + (date.getMonth() + 1)
    let day = '' + date.getDate()
    const year = date.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }

  public validateFields(
    company: string,
    competitor: string,
    email: string,
    location: string,
    firstName: string,
    lastName: string,
    needByDate: string,
    phoneNumber: string,
    postalCode: string,
    quantity: number,
    targetPrice: number,
    brandId?: number,
    productId?: number
  ) {
    return {
      brandId: validate(brandId, 'required'),
      company: validate(company, 'required'),
      competitor: validate(competitor, 'required'),
      email: validate(email, 'required|email'),
      firstName: validate(firstName, 'required'),
      lastName: validate(lastName, 'required'),
      location: validate(location, 'required'),
      needByDate: validate(needByDate, 'required'),
      phoneNumber: validate(phoneNumber, 'required'),
      postalCode: validate(postalCode, 'required'),
      productId: validate(productId, 'required'),
      quantity: validate(quantity, 'required'),
      targetPrice: validate(targetPrice, 'required'),
    }
  }

  public getDefaults(group: Array<string | number>, field: string): string {
    const fieldMap = {
      company: 'corporateName',
      location: 'country',
      phoneNumber: 'phone',
    }
    const valInState: string = path([field], this.state) as string
    const valInProp: string = path(
      [...group, pathOr(field, [field], fieldMap)],
      this.props
    ) as string

    if (false === Boolean(path(['changed', field], this.state))) {
      return valInProp
    }
    if (
      true === Boolean(path(['touched', field], this.state)) &&
      valInState &&
      valInState.length > 0
    ) {
      return valInState
    }
    return valInState
  }

  public pushProductToDataLayer = () => {
    const { product } = this.props

    const categories: string[] = pathOr(
      [],
      ['categories'],
      product
    ) as string[]
    const longestCategory =
      categories.length > 0
        ? categories.reduce((a: string, b: string) => {
            return a.length > b.length ? a : b
          })
        : ''

    const ecommerce = {
      quote: {
        firstName: this.getDefaults(['getSession', 'profile'], 'firstName'),
        lastName: this.getDefaults(['getSession', 'profile'], 'lastName'),
        emailAddress: this.getDefaults(['getSession', 'profile'], 'email'),
        companyName: this.getDefaults(['profile'], 'company'),
        address: buildAddress([
          this.getDefaults(['profile', 'addresses', 0], 'number'),
          this.getDefaults(['profile', 'addresses', 0], 'street'),
          this.getDefaults(['profile', 'addresses', 0], 'city'),
          this.getDefaults(['profile', 'addresses', 0], 'state'),
        ]),
        zipCode: this.getDefaults(['profile', 'addresses', 0], 'postalCode'),
        country: this.getDefaults(['profile', 'addresses', 0], 'location'),
        category: (longestCategory.match(/[^/]+/g) ?? []).join('/'),
        product,
      },
    }

    pushToDataLayer({
      event: 'quoteAdded',
      // ...quote,
      ecommerce,
    })
  }

  public getSaveHandler = (save: MutationFn, createQuickQuoteSave: MutationFn) => async (
    e: FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    let response = null
    try {
      response = await save({
        variables: {
          acronym: 'QuickQuote',
          document: {
            fields: [
              { key: 'company', value: this.getDefaults(['profile'], 'company') },
              { key: 'email', value: this.getDefaults(['getSession', 'profile'], 'email') },
              { key: 'firstName', value: this.getDefaults(['getSession', 'profile'], 'firstName') },
              { key: 'lastName', value: this.getDefaults(['getSession', 'profile'], 'lastName') },
              { key: 'country', value: this.getDefaults(['profile', 'addresses', 0], 'location') },
              {
                key: 'postalCode',
                value: this.getDefaults(['profile', 'addresses', 0], 'postalCode'),
              },
              {
                key: 'phoneNumber',
                value: this.getDefaults(['getSession', 'profile'], 'phoneNumber'),
              },
              { key: 'productId', value: parseInt(this.getDefaults(['product'], 'productId'), 10) },
              { key: 'productName', value: this.getDefaults(['product'], 'productName') },
              { key: 'brandId', value: parseInt(this.getDefaults(['brand'], 'id'), 10) },
              { key: 'brandName', value: this.getDefaults(['brand'], 'name') },
              { key: 'targetPrice', value: parseFloat(this.state.targetPrice.toString()) },
              { key: 'competitor', value: this.state.competitor },
              { key: 'quantity', value: parseInt(this.state.quantity.toString(), 10) },
              { key: 'needByDate', value: this.formatDate(this.state.needByDate) },
            ],
          },
          schema: 'quick-quote-schema-v1',
        },
      })
    } catch (err) {
      this.setState({ showToast: true, successToast: false })
    }
    if (!isEmpty(pathOr('', ['data', 'createDocument', 'id'], response))) {
      let jaalaUserCookie = getCookie('jaala-user')
      if (!jaalaUserCookie) {
        jaalaUserCookie = setCookie('jaala-user', uuid.v4())
      }

      const campaignFields = getCampaignData()
      const number = this.getDefaults(['profile', 'addresses', 0], 'number')
      const street = this.getDefaults(['profile', 'addresses', 0], 'street')
      const city = this.getDefaults(['profile', 'addresses', 0], 'city')
      const state = this.getDefaults(['profile', 'addresses', 0], 'state')

      const address = buildAddress([
        number, street, city, state
      ])

      this.setState({ showToast: true, successToast: true })
      const dataObject = {
        firstName: this.getDefaults(['getSession', 'profile'], 'firstName'),
        lastName: this.getDefaults(['getSession', 'profile'], 'lastName'),
        // tslint:disable-next-line:object-literal-sort-keys
        emailAddress: this.getDefaults(['getSession', 'profile'], 'email'),
        companyName: this.getDefaults(['profile'], 'company'),
        address,
        city: this.getDefaults(['profile', 'addresses', 0], 'city'),
        state: this.getDefaults(['profile', 'addresses', 0], 'state'),
        phone: this.getDefaults(['getSession', 'profile'], 'phoneNumber'),
        postalCode: this.getDefaults(['profile', 'addresses', 0], 'postalCode'),
        country: this.getDefaults(['profile', 'addresses', 0], 'location'),
        targetPrice: this.state.targetPrice.toString(),
        totalPrice: (
          parseFloat(
            pathOr('', ['sellers', 0, 'commertialOffer', 'Price'], this.props.selectedItem)
          ) * parseInt(this.state.quantity.toString(), 10)
        ).toString(),
        note: '',
        cookie: jaalaUserCookie,
        type: 'QUOTE',
        dateNeeded: this.formatDate(this.state.needByDate),
        items: [
          {
            biscoPartNumber: pathOr('', ['name'], this.props.selectedItem),
            prc: pathOr('', ['brandId'], this.props.product).toString(),
            // tslint:disable-next-line:object-literal-sort-keys
            partNumber: pathOr('', ['name'], this.props.selectedItem),
            brandName: this.getDefaults(['brand'], 'name'),
            quantity: parseInt(this.state.quantity.toString(), 10),
            unitOfMeasure: 'E',
            targetPrice: parseFloat(this.state.targetPrice.toString()),
            unitPrice: parseFloat(
              pathOr('0', ['sku', 'sellers', 0, 'commertialOffer', 'Price'], this.props.product)
            ),
          },
        ],
        campaignInfo: campaignFields? {
          source: decodeURI(campaignFields.get('utm_source')) ?? ``,
          medium: decodeURI(campaignFields.get('utm_medium')) ?? ``,
          campaignName: decodeURI(campaignFields.get('utm_campaign')) ?? ``,
          term: decodeURI(campaignFields.get('utm_term')) ?? ``,
          contentPage: decodeURI(campaignFields.get('utm_content')) ?? ``,
          id: decodeURI(campaignFields.get('utm_id')) ?? ``,
          referrer: decodeURI(campaignFields.get('utm_referrer')) ?? ``,
        } : null,
      }
      try {
        await createQuickQuoteSave({
          variables: {
            dataObject: dataObject,
          },
        })
        this.pushProductToDataLayer()
      } catch (e) {
        this.setState({ showToast: true, successToast: false })
      }
    }
    this.handleConfirmation(e)
  }

  public render() {
    const { isBlock, brandLoading, sessionLoading, profileLoading } = this.props

    const errors: any = this.validateFields(
      this.getDefaults(['profile'], 'company'),
      this.state.competitor,
      this.getDefaults(['getSession', 'profile'], 'email'),
      this.getDefaults(['profile', 'addresses', 0], 'location'),
      this.getDefaults(['getSession', 'profile'], 'firstName'),
      this.getDefaults(['getSession', 'profile'], 'lastName'),
      this.formatDate(this.state.needByDate),
      this.getDefaults(['getSession', 'profile'], 'phoneNumber'),
      this.getDefaults(['profile', 'addresses', 0], 'postalCode'),
      parseInt(this.state.quantity.toString(), 10),
      parseFloat(this.state.targetPrice.toString()),
      parseInt(this.getDefaults(['brand'], 'id'), 10),
      parseInt(this.getDefaults(['product'], 'productId'), 10)
    )
    const isEnabled: boolean = !Object.keys(errors).some(
      (x: any) => errors[x].length > 0
    ) as boolean
    const shouldMarkError = (field: string) => {
      const hasError: boolean = !isEmpty(errors[field]) as boolean
      const shouldShow: boolean = Boolean(path(['touched', field], this.state))

      return hasError && shouldShow
    }

    return (
      <Mutation mutation={CREATE_QUOTE_IN_JAALA}>
        {(createQuickQuotaSave, { loading: isSavingQuickQuote }) => (
          <Mutation mutation={ADD_QUICK_QUOTE}>
            {(save, { loading: isSaving }) => (
              <div className={`center ${styles.quickQuoteContainer}`}>
                <div className="center mw-100">
                  <Button
                    onClick={this.handleModalToggle}
                    block={isBlock || true}
                    variation="danger"
                    disabled={brandLoading || sessionLoading || profileLoading}>
                    <FormattedMessage id={"bisco-quick-quote.quick-quote"} />
                  </Button>
                </div>

                <Modal isOpen={this.state.isModalOpen} onClose={this.handleModalToggle}>
                  <h4 className="t-heading-4 mt0"> <FormattedMessage id={"bisco-quick-quote.get-a-quick-response"} /></h4>

                  <form>
                    <div className="flex flex-column justify-start items-start">
                      <div className="flex flex-wrap justify-center items-center w-100">
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="firstName"
                            label= {<FormattedMessage id={"bisco-quick-quote.first-name"} />}
                            defaultValue={pathOr(
                              '',
                              ['getSession', 'profile', 'firstName'],
                              this.props
                            )}
                            error={shouldMarkError('firstName')}
                            errorMessage={shouldMarkError('firstName') && head(errors.firstName)}
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('firstName')}
                          />
                        </div>
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="lastName"
                            label= {<FormattedMessage id={"bisco-quick-quote.last-name"} />}
                            defaultValue={pathOr(
                              '',
                              ['getSession', 'profile', 'lastName'],
                              this.props
                            )}
                            error={shouldMarkError('lastName')}
                            errorMessage={shouldMarkError('lastName') && head(errors.lastName)}
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('lastName')}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center items-center w-100">
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="email"
                            label= {<FormattedMessage id={"bisco-quick-quote.email"} />}
                            defaultValue={pathOr(
                              '',
                              ['getSession', 'profile', 'email'],
                              this.props
                            )}
                            error={shouldMarkError('email')}
                            errorMessage={shouldMarkError('email') && head(errors.email)}
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('email')}
                          />
                        </div>
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="phoneNumber"
                            label= {<FormattedMessage id={"bisco-quick-quote.phone"} />}
                            type="tel"
                            defaultValue={pathOr(
                              '',
                              ['getSession', 'profile', 'phone'],
                              this.props
                            )}
                            error={shouldMarkError('phoneNumber')}
                            errorMessage={
                              shouldMarkError('phoneNumber') && head(errors.phoneNumber)
                            }
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('phoneNumber')}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center items-center w-100">
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="company"
                            label= {<FormattedMessage id={"bisco-quick-quote.company"} />}
                            defaultValue={pathOr('', ['profile', 'corporateName'], this.props)}
                            error={shouldMarkError('company')}
                            errorMessage={shouldMarkError('company') && head(errors.company)}
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('company')}
                          />
                        </div>
                        <div className="w-100 w-50-ns pa4">
                          <Dropdown
                            name="location"
                            label= {<FormattedMessage id={"bisco-quick-quote.country"} />}
                            options={this.state.countryOptions}
                            value={
                              !isEmpty(this.state.location)
                                ? this.state.location
                                : pathOr('', ['profile', 'addresses', 0, 'country'], this.props)
                            }
                            error={shouldMarkError('location')}
                            errorMessage={shouldMarkError('location') && head(errors.location)}
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('location')}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center items-center w-100">
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="postalCode"
                            label= {<FormattedMessage id={"bisco-quick-quote.postal-code"} />}
                            defaultValue={pathOr(
                              '',
                              ['profile', 'addresses', 0, 'postalCode'],
                              this.props
                            )}
                            error={shouldMarkError('postalCode')}
                            errorMessage={shouldMarkError('postalCode') && head(errors.postalCode)}
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('postalCode')}
                          />
                        </div>
                        <div className="w-100 w-50-ns pa4" />
                      </div>
                      <div className="flex flex-wrap justify-center items-center w-100">
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="productName"
                            label= {<FormattedMessage id={"bisco-quick-quote.product-name"} />}
                            readOnly={true}
                            value={this.props.product.productName}
                            errorMessage={shouldMarkError('productName') && head(errors.productId)}
                          />
                          <input
                            type="hidden"
                            name="productId"
                            value={this.props.product.productId}
                          />
                        </div>
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="brandName"
                            label= {<FormattedMessage id={"bisco-quick-quote.brand-name"} />}
                            readOnly={true}
                            value={this.props.brand ? this.props.brand.name : ''}
                            errorMessage={shouldMarkError('brandName') && head(errors.brandId)}
                          />
                          <input
                            type="hidden"
                            name="brandId"
                            value={this.props.brand ? this.props.brand.id : ''}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center items-center w-100">
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="targetPrice"
                            label= {<FormattedMessage id={"bisco-quick-quote.target-price"} />}
                            type="number"
                            min="0"
                            step="0.01"
                            value={this.state.targetPrice}
                            error={shouldMarkError('targetPrice')}
                            errorMessage={
                              shouldMarkError('targetPrice') && head(errors.targetPrice)
                            }
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('targetPrice')}
                          />
                        </div>
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="competitor"
                            label= {<FormattedMessage id={"bisco-quick-quote.competitor"} />}
                            value={this.state.competitor}
                            error={shouldMarkError('competitor')}
                            errorMessage={shouldMarkError('competitor') && head(errors.competitor)}
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('competitor')}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center items-center w-100">
                        <div className="w-100 w-50-ns pa4">
                          <Input
                            name="quantity"
                            label= {<FormattedMessage id={"bisco-quick-quote.quantity"} />}
                            type="number"
                            min="1"
                            step="1"
                            value={this.state.quantity}
                            error={shouldMarkError('quantity')}
                            errorMessage={shouldMarkError('quantity') && head(errors.quantity)}
                            onChange={(event: any) => this.handleUserInput(event)}
                            onBlur={this.handleBlur('quantity')}
                          />
                        </div>
                        <div className="w-100 w-50-ns pa4">
                          <DatePicker
                            label= {<FormattedMessage id={"bisco-quick-quote.need-by-date"} />}
                            name="needByDate"
                            value={this.state.needByDate}
                            onChange={this.handleChange}
                            error={shouldMarkError('needByDate')}
                            errorMessage={shouldMarkError('needByDate') && head(errors.needByDate)}
                            locale="en-US"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-start items-start w-100">
                        <div className="w-100 w-50-ns pa4">
                          <Button
                            variation="primary"
                            disabled={!isEnabled}
                            onClick={this.getSaveHandler(save, createQuickQuotaSave)}
                            isLoading={isSaving || isSavingQuickQuote}>
                            <FormattedMessage id={"bisco-quick-quote.submit"} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Modal>
                {this.state.showToast && this.state.successToast && (
                  <Toast messageId="alert.success" type="success" onClose={this.handleCloseToast} />
                )}
                {this.state.showToast && !this.state.successToast && (
                  <Toast messageId="alert.error" type="error" onClose={this.handleCloseToast} />
                )}
              </div>
            )}
          </Mutation>
        )}
      </Mutation>
    )
  }
}

export default compose(
  withPixel,
  withBrand,
  withSession,
  withProfile,
  withRuntimeContext
)(QuickQuote)

