import React from 'react';
import { useProduct } from 'vtex.product-context';
import { Helmet } from 'vtex.render-runtime';

function PageTitle() {
  const productContextValue = useProduct();
  const pageTitle = `${productContextValue?.product?.productName}${productContextValue?.product?.brand ? "|" : ""}${productContextValue?.product?.brand ? productContextValue?.product?.brand : ""}`;
  return (
    <>
      <Helmet>
        <meta name='description' content={productContextValue?.product?.description} data-react-helmet="true"></meta>
        <meta name='product:name' content={productContextValue?.product?.productName} data-react-helmet="true"></meta>
        <title>{pageTitle}</title>
      </Helmet>
    </>
  );
}

export default PageTitle;

