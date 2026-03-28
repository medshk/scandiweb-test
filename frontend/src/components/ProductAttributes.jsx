import { useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useDataContext, getPrice } from '../DataContext';

const ProductAttributes = ({
  product,
  className,
  isModalView = false,
  isCartPageView = false,
  itemSelectedAttributes = [],
}) => {
  const { addToCart, updateCartItemAttribute, selectedCurrency } = useDataContext();
  const [selectedAttributes, setSelectedAttributes] = useState(
    itemSelectedAttributes
  );

  const price = getPrice(product.prices, selectedCurrency);
  const totalPrice = price
    ? `${price.currency.symbol}${(
        parseFloat(price.amount) * (product.quantity ?? 1)
      ).toFixed(2)}`
    : null;

  const handleAttributeClick = (attribute) => {
    const existingIndex = selectedAttributes.findIndex(
      (attr) => attr.attributeId === attribute.attribute_id
    );

    const updatedSelectedAttributes = [...selectedAttributes];

    if (existingIndex !== -1) {
      updatedSelectedAttributes[existingIndex] = {
        id: attribute.id,
        attributeId: attribute.attribute_id,
        value: attribute.value,
      };
    } else {
      updatedSelectedAttributes.push({
        id: attribute.id,
        attributeId: attribute.attribute_id,
        value: attribute.value,
      });
    }

    setSelectedAttributes(updatedSelectedAttributes);

    if (isModalView || isCartPageView) {
      updateCartItemAttribute(
        product,
        selectedAttributes,
        updatedSelectedAttributes
      );
    }
  };

  const isAttributeValueSelected = (attribute) => {
    return selectedAttributes.some(
      (attr) =>
        attribute.attribute_id === attr.attributeId &&
        attribute.value === attr.value
    );
  };

  return (
    <div className={`${className}${product.inStock ? '' : ' opacity-70'}`}>
      <h2
        className={isModalView ? 'capitalize font-light text-lg' : 'heading-h1'}
      >
        {isModalView ? product.name : product.brand}
      </h2>
      {!isModalView && product.name && (
        <h3 className={isCartPageView ? 'text-base font-light mb-2' : 'text-xl font-light mb-4 -mt-4'}>
          {product.name}
        </h3>
      )}

      {isModalView && <div className="my-2 font-medium font-roboto-condensed">{totalPrice}</div>}

      {product.attributes?.map((attributeSet) => (
        <div
          key={attributeSet.id}
          className={isModalView ? 'mt-2' : 'mt-4'}
          data-testid={`${
            isModalView || isCartPageView ? 'cart-item' : 'product'
          }-attribute-${attributeSet.name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <h3
            className={`${
              isModalView ? 'text-sm' : 'font-bold uppercase font-roboto-condensed'
            } mb-1`}
          >
            {attributeSet.name}:
          </h3>

          <div
            className={`${
              isModalView ? 'gap-x-2' : 'gap-x-3'
            } flex flex-wrap gap-y-2`}
          >
            {attributeSet.items.map((attribute) =>
              attributeSet.type?.toLowerCase() === 'swatch' &&
              attributeSet.name?.toLowerCase() === 'color' ? (
                <button
                  type="button"
                  key={attribute.id}
                  className={`relative ${isModalView ? 'w-5 h-5' : 'w-8 h-8'} ${
                    isAttributeValueSelected(attribute)
                      ? 'ring-2 ring-primary ring-offset-1'
                      : ''
                  } border border-gray-200 ${
                    product.inStock ? 'hover:ring-2 hover:ring-primary hover:ring-offset-1' : ''
                  } transition-all`}
                  style={{ backgroundColor: attribute.value }}
                  title={attribute.displayValue}
                  onClick={() => handleAttributeClick(attribute)}
                  disabled={!product.inStock}
                  data-testid={`${
                    isModalView || isCartPageView ? 'cart-item' : 'product'
                  }-attribute-${attributeSet.name.toLowerCase().replace(/\s+/g, '-')}-${
                    attribute.displayValue.replace(/\s+/g, '-')
                  }${
                    isAttributeValueSelected(attribute) ? '-selected' : ''
                  }`}
                >
                </button>
              ) : (
                <button
                  type="button"
                  key={attribute.id}
                  className={`${
                    isModalView
                      ? 'min-w-[24px] min-h-[24px] text-sm px-2 py-0.5'
                      : 'min-w-[63px] min-h-[45px] px-3 py-1'
                  } ${
                    isAttributeValueSelected(attribute)
                      ? 'bg-text text-white'
                      : 'bg-white'
                  } flex items-center justify-center transition-colors border font-roboto-condensed ${
                    product.inStock ? 'hover:bg-gray-800 hover:text-white' : ''
                  } border-text`}
                  disabled={!product.inStock}
                  onClick={() => handleAttributeClick(attribute)}
                  data-testid={`${
                    isModalView || isCartPageView ? 'cart-item' : 'product'
                  }-attribute-${attributeSet.name.toLowerCase().replace(
                    /\s+/g,
                    '-'
                  )}-${attribute.displayValue.replace(/\s+/g, '-')}${
                    isAttributeValueSelected(attribute) ? '-selected' : ''
                  }`}
                >
                  {attribute.displayValue}
                </button>
              )
            )}
          </div>
        </div>
      ))}

      {!isModalView && !isCartPageView && (
        <>
          <h3 className="mt-6 mb-2 font-bold uppercase font-roboto-condensed">Price:</h3>
          <div className="mb-5 text-2xl font-bold font-raleway" data-testid="product-price">
            {price && `${price.currency.symbol}${price.amount}`}
          </div>
        </>
      )}

      {isCartPageView && (
        <div className="mt-4 text-lg font-bold font-roboto-condensed">
          {totalPrice}
        </div>
      )}

      {!isModalView && !isCartPageView && product.inStock && (
        <button
          type="button"
          className="w-full mb-10 btn-cta"
          onClick={() => addToCart(product, true, selectedAttributes)}
          disabled={product.attributes.length !== selectedAttributes.length}
          data-testid="add-to-cart"
        >
          Add to Cart
        </button>
      )}

      {!isModalView && !isCartPageView && (
        <div className="text-base leading-relaxed font-roboto" data-testid="product-description">
          {parse(DOMPurify.sanitize(product.description))}
        </div>
      )}
    </div>
  );
};

ProductAttributes.propTypes = {
  product: PropTypes.object.isRequired,
  className: PropTypes.string,
  isModalView: PropTypes.bool,
  isCartPageView: PropTypes.bool,
  itemSelectedAttributes: PropTypes.array,
};

export default ProductAttributes;
