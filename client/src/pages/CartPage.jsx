import { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProductAttributes from '../components/ProductAttributes';
import ActionBtn from '../components/cart/ActionBtn';
import PlaceOrderBtn from '../components/cart/PlaceOrderBtn';
import { useDataContext, getPrice } from '../DataContext';

function CartItemImage({ gallery = [], name = '' }) {
  return (
    <div className="flex-shrink-0 w-[200px] h-[288px]">
      <img
        src={gallery[0] ?? ''}
        alt={name}
        className="object-cover w-full h-full"
      />
    </div>
  );
}

CartItemImage.propTypes = {
  gallery: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
};

function CartItem({ item = {} }) {
  const { updateCartItemQuantity } = useDataContext();

  return (
    <div className="flex gap-3 py-6 border-t border-gray-200">
      <ProductAttributes
        className="flex-1"
        isModalView={false}
        isCartPageView={true}
        product={item.product}
        itemSelectedAttributes={item.selectedAttributes}
      />

      <div className="flex flex-col items-center justify-between">
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 text-lg transition-colors border border-text hover:bg-text hover:text-white"
          onClick={() => updateCartItemQuantity(item.id, 1)}
          data-testid="cart-item-amount-increase"
        >
          +
        </button>
        <span className="text-lg font-medium" data-testid="cart-item-amount">
          {item.quantity}
        </span>
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 text-lg transition-colors border border-text hover:bg-text hover:text-white"
          onClick={() => updateCartItemQuantity(item.id, -1)}
          data-testid="cart-item-amount-decrease"
        >
          -
        </button>
      </div>

      <CartItemImage gallery={item.product.gallery} name={item.product.name} />
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.object,
};

class CartPage extends Component {
  render() {
    return <CartPageContent />;
  }
}

function CartPageContent() {
  const { cartItems, selectedCurrency } = useDataContext();

  const totalPrice = cartItems
    .reduce((total, item) => {
      const price = getPrice(item.product?.prices, selectedCurrency);
      return total + parseFloat(price?.amount || 0) * item.quantity;
    }, 0)
    .toFixed(2);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const currencySymbol = cartItems.length > 0
    ? getPrice(cartItems[0]?.product?.prices, selectedCurrency)?.currency?.symbol
    : '$';

  return (
    <div className="mt-14">
      <h1 className="heading-h1 !text-[32px] !font-bold !uppercase">Cart</h1>

      {totalItems === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-lg text-gray-500">Your cart is empty.</p>
          <Link to="/" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="py-6 mt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold font-roboto">
                Total ({totalItems} item{totalItems === 1 ? '' : 's'})
              </span>
              <div className="text-2xl font-bold" data-testid="cart-total">
                {currencySymbol} {totalPrice}
              </div>
            </div>

            <PlaceOrderBtn className="w-full" />
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
