import { path } from 'ramda'
import React from 'react'
import { graphql, compose } from 'react-apollo'
import { Button, Input } from 'vtex.styleguide'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import CreateMediaLead from '../graphql/createMediaLead.graphql'
import { MEDIA_LEAD_ACRONYM, MEDIA_LEAD_SCHEMA } from '../utils/consts'
import { Address, ProductInfo, Profile } from '../utils/dataTypes'

interface FormFieldState {
  type: string
  valid: boolean
  typeMismatch?: boolean
  errorMessage?: string
  fieldName: string
  required?: boolean
  requiredTxt?: string
  formatErrorTxt?: string
  value: any
}

interface InputProps extends InjectedIntlProps {
  productInfo: ProductInfo
  profile?: Profile
  address?: Address
  existingLead?: any
  onCreateMediaLead?: any
  onAfterFormSubmit?: any
}

interface State {
  emailAddress: FormFieldState
  firstName: FormFieldState
  lastName: FormFieldState
  company: FormFieldState
  phoneNumber: FormFieldState
  country: FormFieldState
  postalCode: FormFieldState
  needByDate: FormFieldState
  application: FormFieldState
  allFieldsValid: boolean
}

interface LeadProps {
  id: string
  cacheId: string
}

class LeadForm extends React.Component<InputProps, State> {
  constructor(props: InputProps) {
    super(props)

    this.setFieldStates()
    this.onSubmit = this.onSubmit.bind(this)
    this.onFieldChange = this.onFieldChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  public getFieldSet = (
    type: string,
    value: any,
    fieldName: string,
    required: boolean,
    requiredTxt: string,
    typeMismatch: boolean,
    formatErrorTxt: string
  ) => {
    return {
      fieldName,
      formatErrorTxt,
      required,
      requiredTxt,
      type,
      typeMismatch,
      valid: true,
      value,
    }
  }

  public initialFieldValues = () => {
    const { profile, address, existingLead } = this.props
    return {
      emailAddress: !existingLead
        ? path(['email'], profile ? profile : {})
          ? path(['email'], profile ? profile : {})
          : ''
        : existingLead.email,
      firstName: !existingLead
        ? path(['firstName'], profile ? profile : {})
          ? path(['firstName'], profile ? profile : {})
          : ''
        : existingLead.firstName,
      lastName: !existingLead
        ? path(['lastName'], profile ? profile : {})
          ? path(['lastName'], profile ? profile : {})
          : ''
        : existingLead.lastName,
      company: !existingLead ? '' : existingLead.company,
      phoneNumber: !existingLead
        ? path(['phone'], profile ? profile : {})
          ? path(['phone'], profile ? profile : {})
          : ''
        : existingLead.phoneNumber,
      country: !existingLead
        ? path(['country'], address ? address : {})
          ? path(['country'], address ? address : {})
          : ''
        : existingLead.country,
      postalCode: !existingLead
        ? path(['postalCode'], address ? address : {})
          ? path(['postalCode'], address ? address : {})
          : ''
        : existingLead.postalCode,
      needByDate: new Date().toJSON().slice(0, 10),
      application: !existingLead ? '' : existingLead.application,
    }
  }

  public setFieldStates() {
    const { intl } = this.props

    const initialValues = this.initialFieldValues()
    this.state = {
      emailAddress: this.getFieldSet(
        'text',
        initialValues.emailAddress,
        'emailAddress',
        true,
        intl.formatMessage({
          id: 'store/media-links.components.LeadForm.emailIsRequired',
        }),
        true,
        intl.formatMessage({
          id: 'store/media-links.components.LeadForm.incorrectEmailAddress',
        })
      ) as FormFieldState,
      firstName: this.getFieldSet(
        'text',
        initialValues.firstName,
        'firstName',
        true,
        intl.formatMessage({
          id: 'store/media-links.components.LeadForm.firstNameIsRequired',
        }),
        false,
        ''
      ) as FormFieldState,
      lastName: this.getFieldSet(
        'text',
        initialValues.lastName,
        'lastName',
        false,
        '',
        false,
        ''
      ) as FormFieldState,
      company: this.getFieldSet(
        'text',
        initialValues.company,
        'company',
        false,
        '',
        false,
        ''
      ) as FormFieldState,
      phoneNumber: this.getFieldSet(
        'text',
        initialValues.phoneNumber,
        'phoneNumber',
        true,
        intl.formatMessage({
          id: 'store/media-links.components.LeadForm.phoneNumberIsRequired',
        }),
        true,
        intl.formatMessage({
          id: 'store/media-links.components.LeadForm.phoneNumberIsIncorrect',
        })
      ) as FormFieldState,
      country: this.getFieldSet(
        'text',
        initialValues.country,
        'country',
        true,
        intl.formatMessage({
          id: 'store/media-links.components.LeadForm.countryIsRequired',
        }),
        false,
        ''
      ) as FormFieldState,
      postalCode: this.getFieldSet(
        'text',
        initialValues.postalCode,
        'postalCode',
        true,
        intl.formatMessage({
          id: 'store/media-links.components.LeadForm.postalCodeIsRequired',
        }),
        false,
        ''
      ) as FormFieldState,
      needByDate: this.getFieldSet(
        'date',
        initialValues.needByDate,
        'needByDate',
        true,
        intl.formatMessage({
          id: 'store/media-links.components.LeadForm.neededDateIsRequired',
        }),
        false,
        ''
      ) as FormFieldState,
      application: this.getFieldSet(
        'text',
        initialValues.application,
        'application',
        false,
        '',
        false,
        ''
      ) as FormFieldState,

      allFieldsValid: true,
    }
  }

  public reduceFormValues = (formElements: any) => {
    const arrElements = Array.prototype.slice.call(formElements)
    const formValues = arrElements
      .filter((elem: any) => elem.name.length > 0)
      .map((x: any) => {
        const { typeMismatch } = x.validity
        const { name, type, value } = x
        return {
          name,
          type,
          typeMismatch,
          valid: x.checkValidity(),
          value,
        }
      })
      .reduce((acc: any, currVal: any) => {
        const { value, valid, typeMismatch, name } = currVal
        const field = path([name], this.state) as FormFieldState
        if (field) {
          acc[currVal.name] = {
            fieldName: field.fieldName,
            formatErrorTxt: field.formatErrorTxt,
            requiredTxt: field.requiredTxt,
            type: field.type,
            typeMismatch,
            valid,
            value,
          }
        }
        return acc
      }, {})

    return formValues
  }

  public checkAllFieldsValid = (formValues: any) => {
    return !Object.keys(formValues)
      .map(x => formValues[x])
      .some(field => !field.valid)
  }

  public getFieldValues = (fields: any) => {
    return fields.reduce((acc: any, field: any) => {
      return { ...acc, ...{ [field.key]: field.value } }
    }, {})
  }

  public onSubmit = async (e: any) => {
    e.preventDefault()
    const { onCreateMediaLead, productInfo, onAfterFormSubmit } = this.props

    const formValues = this.reduceFormValues(e.target.elements)
    const allFieldsValid = this.checkAllFieldsValid(formValues)
    this.setState({ ...formValues, allFieldsValid })

    if (!allFieldsValid) {
      return
    }

    const fieldsToSubmit = [
      { key: 'email', value: this.getFieldValue('emailAddress') },
      { key: 'firstName', value: this.getFieldValue('firstName') },
      { key: 'lastName', value: this.getFieldValue('lastName') },
      { key: 'company', value: this.getFieldValue('company') },
      { key: 'country', value: this.getFieldValue('country') },
      { key: 'postalCode', value: this.getFieldValue('postalCode') },
      { key: 'phoneNumber', value: this.getFieldValue('phoneNumber') },
      { key: 'productId', value: productInfo.productId },
      { key: 'productName', value: productInfo.productName },
      { key: 'refId', value: productInfo.productRefId },
      { key: 'brandId', value: productInfo.brandId ? productInfo.brandId.toString() : '' },
      { key: 'brandName', value: productInfo.brandName },
      { key: 'needByDate', value: this.getFieldValue('needByDate') },
      { key: 'application', value: this.getFieldValue('application') },
    ]

    try {
      const response = await onCreateMediaLead({
        variables: {
          acronym: MEDIA_LEAD_ACRONYM,
          document: { fields: fieldsToSubmit },
          schema: MEDIA_LEAD_SCHEMA,
        },
      })

      const cacheId = path(['data', 'createDocument', 'cacheId'], response)
      if (cacheId) {
        sessionStorage.setItem(productInfo.productRefId, cacheId as string)
      }
      onAfterFormSubmit()
    } catch (e) {
      console.log(e)
    }
  }

  public getFieldValue = (name: string) => {
    const field: any = path([name], this.state)

    if (field.type === 'number') {
      return field && field.value ? field.value : 0
    }

    return field && field.value ? field.value : ''
  }

  public onFieldChange(e: any) {
    const { name, value } = e.target
    const field = path([name], this.state) as FormFieldState
    this.setState({ [name]: { ...field, value } } as any)
  }

  public render() {
    const {
      emailAddress,
      firstName,
      lastName,
      company,
      phoneNumber,
      country,
      postalCode,
      needByDate,
      application,
    } = this.state

    const { productInfo, intl } = this.props

    return (
      <form noValidate onSubmit={this.onSubmit}>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.productName',
            })}
            name="productName"
            value={productInfo.productName}
            disabled
          />
        </div>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.brandName',
            })}
            name="brandName"
            value={productInfo.brandName}
            disabled
          />
        </div>
        <div className="mb5">
          <Input
            type="email"
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.email',
            })}
            name={emailAddress.fieldName}
            onChange={this.onFieldChange}
            value={emailAddress.value}
            error={!emailAddress.valid}
            errorMessage={
              !emailAddress.valid
                ? emailAddress.typeMismatch
                  ? emailAddress.formatErrorTxt
                  : emailAddress.requiredTxt
                : null
            }
            required
          />
        </div>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.firstName',
            })}
            name={firstName.fieldName}
            onChange={this.onFieldChange}
            value={firstName.value}
            error={!firstName.valid}
            errorMessage={!firstName.valid ? firstName.requiredTxt : ''}
            required
          />
        </div>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.lastName',
            })}
            name={lastName.fieldName}
            onChange={this.onFieldChange}
            value={lastName.value}
          />
        </div>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.companyName',
            })}
            name={company.fieldName}
            onChange={this.onFieldChange}
            value={company.value}
          />
        </div>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.phoneNumber',
            })}
            name={phoneNumber.fieldName}
            onChange={this.onFieldChange}
            value={phoneNumber.value}
            error={!phoneNumber.valid}
            errorMessage={!phoneNumber.valid ? phoneNumber.requiredTxt : ''}
            required
          />
        </div>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.countryName',
            })}
            name={country.fieldName}
            onChange={this.onFieldChange}
            value={country.value}
            error={!country.valid}
            errorMessage={!country.valid ? country.requiredTxt : ''}
            required
          />
        </div>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.postalCode',
            })}
            name={postalCode.fieldName}
            onChange={this.onFieldChange}
            value={postalCode.value}
            error={!postalCode.valid}
            errorMessage={!postalCode.valid ? postalCode.requiredTxt : ''}
            required
          />
        </div>
        <div className="mb5">
          <Input
            type="date"
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.neededDate',
            })}
            name={needByDate.fieldName}
            onChange={this.onFieldChange}
            value={needByDate.value}
            error={!needByDate.valid}
            errorMessage={!needByDate.valid ? needByDate.requiredTxt : ''}
            required
          />
        </div>
        <div className="mb5">
          <Input
            label={intl.formatMessage({
              id: 'store/media-links.components.LeadForm.application',
            })}
            name={application.fieldName}
            onChange={this.onFieldChange}
            value={application.value}
          />
        </div>
        <Button type="submit">
          {intl.formatMessage({
            id: 'store/media-links.components.LeadForm.submit',
          })}
        </Button>
      </form>
    )
  }
}

const withMediaLeadMutation = graphql<InputProps, LeadProps>(CreateMediaLead, {
  name: 'createMediaLead',
  options: () => ({ ssr: false }),
  props: ({ createMediaLead, ownProps }: any) => {
    return { onCreateMediaLead: createMediaLead, ...ownProps }
  },
})

export default compose(
  injectIntl,
  withMediaLeadMutation
)(LeadForm)
