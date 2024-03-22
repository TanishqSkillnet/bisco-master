interface Category {
  id: string
  name: string
  href: string
  slug: string
  imageUrl: string
  children: Category[]
}

interface Field {
  key: string
  value: string
}

interface Document {
  id: string
  fields: Field[]
}

interface DocumentObject {
  [key: string]: string | number | boolean | unknown
}

interface Facet {
  id: string
  name: string
  href: string
  link: string
  linkEncoded: string
  map: string
  value: string
  children: Facet[]
}
