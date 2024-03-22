import { head, isEmpty, path, pathOr } from 'ramda'
import React, { Component } from 'react'
import { ChildProps, compose, DataProps, graphql, MutateProps, Mutation, MutationFn, OperationVariables } from 'react-apollo'
import { InjectedIntlProps, injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { Alert, Button, Dropdown, Input, PageBlock, Spinner, Textarea } from 'vtex.styleguide'
import styles from './contactForm.css'
import ADD_CLIENT_INQUIRY from './mutations/addClientInquiry.gql'
import PROFILE_QUERY from './queries/getProfile.gql'
import SESSION_QUERY from './queries/getSession.gql'
import { Profile } from './utils/constants'
import countries from './utils/countries'
import { validate } from './utils/validator'

interface Props {
  title?: string
  profile?: Profile
  profileLoading: boolean
  sessionLoading: boolean
}

interface Option {
  label: string
  value: string
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

interface State {
  company: string
  country: string
  countryOptions: Option[]
  email: string
  firstName: string
  formValid: boolean
  lastName: string
  message: string
  phoneNumber: string
  postalCode: string
  topic: string
  topicOptions: Option[]
  touched: FormState
  changed: FormState
  showAlert: boolean
  success: boolean
}

interface FormState {
  [key: string]: boolean

  company: boolean
  country: boolean
  email: boolean
  firstName: boolean
  lastName: boolean
  message: boolean
  phoneNumber: boolean
  postalCode: boolean
  topic: boolean
}

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

class ContactForm extends Component<Props & ChildProps<{}, Session & Profile> & InjectedIntlProps, State> {
  public static propTypes: React.ValidationMap<any> = {
    intl: intlShape.isRequired,
  }

  public static defaultProps = {
    title: <FormattedMessage id="store/contact-form.form.contact-us" />,
  }

  public state = {
    changed: {
      company: false,
      country: false,
      email: false,
      firstName: false,
      lastName: false,
      message: false,
      phoneNumber: false,
      postalCode: false,
      topic: false,
    },
    company: pathOr('', ['profile', 'corporateName'], this.props),
    country: pathOr('', ['profile', 'addresses', 0, 'country'], this.props),
    countryOptions: countries,
    email: pathOr('', ['getSession', 'profile', 'email'], this.props),
    firstName: pathOr('', ['getSession', 'profile', 'firstName'], this.props),
    formValid: false,
    lastName: pathOr('', ['getSession', 'profile', 'lastName'], this.props),
    message: '',
    phoneNumber: pathOr('', ['getSession', 'profile', 'phone'], this.props),
    postalCode: pathOr('', ['profile', 'addresses', 0, 'postalCode'], this.props),
    showAlert: false,
    success: false,
    topic: '',
    topicOptions: [
      { value: 'quoterequest', label: 'Quote Request' },
      { value: 'Accounts Payable', label: 'Accounts Payable' },
      { value: 'Accounts Receivables', label: 'Accounts Receivables' },
      { value: 'Customer Service', label: 'Customer Service' },
      { value: 'Quality', label: 'Quality' },
      { value: 'Website Help', label: 'Website Help' },
    ],
    touched: {
      company: false,
      country: false,
      email: false,
      firstName: false,
      lastName: false,
      message: false,
      phoneNumber: false,
      postalCode: false,
      topic: false,
    },
  }

  constructor(props: Props & ChildProps<{}, Session & Profile> & InjectedIntlProps) {
    super(props)
    this.handleUserInput = this.handleUserInput.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
  }

  componentDidUpdate(prevProps: Readonly<Props & Partial<DataProps<Session & Profile, OperationVariables>> & Partial<MutateProps<Session & Profile, OperationVariables>> & InjectedIntlProps>): void {
      if(prevProps.sessionLoading == true && this.props.sessionLoading == false){
        this.setState({
          email: pathOr('', ['getSession', 'profile', 'email'], this.props),
          firstName: pathOr('', ['getSession', 'profile', 'firstName'], this.props),
          lastName: pathOr('', ['getSession', 'profile', 'lastName'], this.props),
          phoneNumber: pathOr('', ['getSession', 'profile', 'phone'], this.props),
        })
      }

      if(prevProps.profileLoading == true && this.props.profileLoading == false){
        this.setState({
          company: pathOr('', ['profile', 'corporateName'], this.props),
          country: pathOr('', ['profile', 'addresses', 0, 'country'], this.props),
          postalCode: pathOr('', ['profile', 'addresses', 0, 'postalCode'], this.props),
        })
      }
  }

  public handleBlur = (field: string) => () => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    })
  }

  public handleUserInput(e: { target: { name: string; value: string } }) {
    const { name, value } = e.target
    this.setState({ [name]: value, changed: { ...this.state.changed, [name]: true } } as any)
  }

  public clearForm() {
    this.setState({
      company: pathOr('', ['profile', 'corporateName'], this.props),
      country: pathOr('', ['profile', 'addresses', 0, 'country'], this.props),
      email: pathOr('', ['getSession', 'profile', 'email'], this.props),
      firstName: pathOr('', ['getSession', 'profile', 'firstName'], this.props),
      lastName: pathOr('', ['getSession', 'profile', 'lastName'], this.props),
      phoneNumber: pathOr('', ['getSession', 'profile', 'phone'], this.props),
      postalCode: pathOr('', ['profile', 'addresses', 0, 'postalCode'], this.props),
      message: '',
      formValid: false,
      topic: '',
    })
  }

  public validateFields(
    company: string,
    country: string,
    email: string,
    firstName: string,
    lastName: string,
    message: string,
    phoneNumber: string,
    postalCode: string,
    topic: string
  ) {
    return {
      company: validate(company, 'required'),
      country: validate(country, 'required'),
      email: validate(email, 'required|email'),
      firstName: validate(firstName, 'required'),
      lastName: validate(lastName, 'required'),
      message: validate(message, 'required'),
      phoneNumber: validate(phoneNumber, 'required'),
      postalCode: validate(postalCode, ''),
      topic: validate(topic, 'required'),
    }
  }

  public handleDropdownChange(e: { target: { name: string; value: string } }) {
    const { name, value } = e.target
    this.setState({ [name]: value, changed: { ...this.state.changed, [name]: true } } as any)
  }

  public getDefaults(group: Array<string|number>, field: string): string {
    const fieldMap = {
      company: 'corporateName',
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

  public getSaveHandler = (save: MutationFn) => async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const response: any = await save({
        variables: {
          acronym: 'ClientInquiry',
          document: {
            fields: [
              { key: 'company', value: this.getDefaults(['profile'], 'company') },
              { key: 'country', value: this.getDefaults(['profile', 'addresses', 0], 'country') },
              { key: 'email', value: this.getDefaults(['getSession', 'profile'], 'email') },
              { key: 'firstName', value: this.getDefaults(['getSession', 'profile'], 'firstName') },
              { key: 'lastName', value: this.getDefaults(['getSession', 'profile'], 'lastName') },
              { key: 'message', value: this.state.message },
              { key: 'phoneNumber', value: this.getDefaults(['getSession', 'profile'], 'phoneNumber') },
              { key: 'postalCode', value: this.getDefaults(['profile', 'addresses', 0], 'postalCode') },
              { key: 'topic', value: this.state.topic },
            ],
          },
          schema: 'client-inquiry-schema-v1',
        },
      })
      this.setState({ success: !isEmpty(path(['data', 'createDocument', 'cacheId'], response)), showAlert: true })
      this.clearForm()
    } catch (err) {
      this.setState({ success: false, showAlert: true })
    }
  }

  public render() {
    const { intl, title, profileLoading, sessionLoading } = this.props
    if (profileLoading || sessionLoading) {
      return <div className="mt5 tc"><Spinner/></div>
    }
    const errors: any = this.validateFields(
      this.getDefaults(['profile'], 'company') as string,
      this.getDefaults(['profile', 'addresses', 0], 'country'),
      this.getDefaults(['getSession', 'profile'], 'email') as string,
      this.getDefaults(['getSession', 'profile'], 'firstName') as string,
      this.getDefaults(['getSession', 'profile'], 'lastName') as string,
      this.state.message,
      this.getDefaults(['getSession', 'profile'], 'phoneNumber') as string,
      this.getDefaults(['profile', 'addresses', 0], 'postalCode'),
      this.state.topic
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
      <Mutation mutation={ADD_CLIENT_INQUIRY}>
        {(save, { loading: isSaving }) => (
          <div className="bg-muted-5 pa1 pa8-m">
            <PageBlock variation="half">
              <div>
                <div className="mb5 ph5">
                  <h2 className="t-heading-2">{title}</h2>
                  <h6 className="t-heading-6">{intl.formatMessage({ id: 'store/contact-form.form.corporate-office'})}</h6>
                  <p className="t-body lh-copy mw9 mb4">
                    5065 East Hunter
                    <br />
                    Anaheim, CA 92807
                  </p>
                  <p className="t-body lh-copy mw9">
                    USA <a href="tel:(800)323-1232">(800)323-1232</a>
                    <br />
                    Canada <a href="tel:(800)258-2693">(800)258-2693</a>
                    <br />
                    Intl. <a href="tel:+001 (714)876-2402">+001 (714)876-2402</a>
                    <br />
                  </p>
                </div>
                <div className="mb5">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.9855630965612!2d-117.80926448505825!3d33.864262935060694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcd1158f95fb13%3A0x689e048526f53b5f!2s5065%20E%20Hunter%20Ave%2C%20Anaheim%2C%20CA%2092807!5e0!3m2!1sen!2sus!4v1604093903792!5m2!1sen!2sus"
                    className={`${styles.corporateMap} w-100`}
                  />
                </div>
              </div>
              <div>
                <form>
                  <div className="mb5">
                    <Dropdown
                      name="topic"
                      label={intl.formatMessage({ id: 'store/contact-form.form.topic' })}
                      options={this.state.topicOptions}
                      value={this.state.topic}
                      error={shouldMarkError('topic')}
                      errorMessage={shouldMarkError('topic') && head(errors.topic)}
                      onChange={this.handleDropdownChange}
                      onBlur={this.handleBlur('topic')}
                    />
                  </div>

                  <div className="mb5">
                    <Input
                      name="firstName"
                      label={intl.formatMessage({ id: 'store/contact-form.form.firstName' })}
                      value={this.state.firstName}
                      error={shouldMarkError('firstName')}
                      errorMessage={shouldMarkError('firstName') && head(errors.firstName)}
                      onChange={(event: any) => this.handleUserInput(event)}
                      onBlur={this.handleBlur('firstName')}
                    />
                  </div>

                  <div className="mb5">
                    <Input
                      name="lastName"
                      label={intl.formatMessage({ id: 'store/contact-form.form.lastName' })}
                      value={this.state.lastName}
                      error={shouldMarkError('lastName')}
                      errorMessage={shouldMarkError('lastName') && head(errors.lastName)}
                      onChange={(event: any) => this.handleUserInput(event)}
                      onBlur={this.handleBlur('lastName')}
                    />
                  </div>

                  <div className="mb5">
                    <Input
                      name="company"
                      label={intl.formatMessage({ id: 'store/contact-form.form.company' })}
                      value={this.state.company}
                      error={shouldMarkError('company')}
                      errorMessage={shouldMarkError('company') && head(errors.company)}
                      onChange={(event: any) => this.handleUserInput(event)}
                      onBlur={this.handleBlur('company')}
                    />
                  </div>

                  <div className="mb5">
                    <Input
                      name="email"
                      label={intl.formatMessage({ id: 'store/contact-form.form.email' })}
                      value={this.state.email}
                      error={shouldMarkError('email')}
                      errorMessage={shouldMarkError('email') && head(errors.email)}
                      onChange={(event: any) => this.handleUserInput(event)}
                      onBlur={this.handleBlur('email')}
                    />
                  </div>

                  <div className="mb5">
                    <Input
                      name="phoneNumber"
                      label={intl.formatMessage({ id: 'store/contact-form.form.phoneNumber' })}
                      value={this.state.phoneNumber}
                      error={shouldMarkError('phoneNumber')}
                      errorMessage={shouldMarkError('phoneNumber') && head(errors.phoneNumber)}
                      onChange={(event: any) => this.handleUserInput(event)}
                      onBlur={this.handleBlur('phoneNumber')}
                    />
                  </div>

                  <div className="mb5">
                    <Dropdown
                      name="country"
                      label={intl.formatMessage({ id: 'store/contact-form.form.country' })}
                      options={this.state.countryOptions}
                      value={this.state.country}
                      error={shouldMarkError('country')}
                      errorMessage={shouldMarkError('country') && head(errors.country)}
                      onChange={this.handleDropdownChange}
                      onBlur={this.handleBlur('country')}
                    />
                  </div>

                  <div className="mb5">
                    <Input
                      name="postalCode"
                      label={intl.formatMessage({ id: 'store/contact-form.form.postalCode' })}
                      value={this.state.postalCode}
                      error={shouldMarkError('postalCode')}
                      errorMessage={shouldMarkError('postalCode') && head(errors.postalCode)}
                      onChange={(event: any) => this.handleUserInput(event)}
                      onBlur={this.handleBlur('postalCode')}
                    />
                  </div>

                  <div className="mb5">
                    <Textarea
                      name="message"
                      label={intl.formatMessage({ id: 'store/contact-form.form.message' })}
                      value={this.state.message}
                      error={shouldMarkError('message')}
                      errorMessage={shouldMarkError('message') && head(errors.message)}
                      onChange={(event: any) => this.handleUserInput(event)}
                      onBlur={this.handleBlur('message')}
                    />
                  </div>

                  <Button
                    variation="primary"
                    disabled={!isEnabled}
                    onClick={this.getSaveHandler(save)}
                    isLoading={isSaving}>
                    {intl.formatMessage({ id: 'store/contact-form.form.submit' })}
                  </Button>
                </form>
              </div>
            </PageBlock>
            {this.state.showAlert && (
              <div className="animated slower bottom--1 fixed z-5 ma7-ns mb5-s left-2-ns w-100-s w-30-ns">
                {this.state.success ? (
                  <Alert type="success" onClose={() => this.setState({ showAlert: false })}>
                    {intl.formatMessage({ id: 'store/contact-form.form.success' })}
                  </Alert>
                ) : (
                  <Alert type="error" onClose={() => this.setState({ showAlert: false })}>
                    {intl.formatMessage({ id: 'store/contact-form.form.error' })}
                  </Alert>
                )}
              </div>
            )}
          </div>
        )}
      </Mutation>
    )
  }
}

export default compose(
  injectIntl,
  withSession,
  withProfile
)(ContactForm)
