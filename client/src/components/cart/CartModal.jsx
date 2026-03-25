import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CartModalItem from './CartModalItem';
import PlaceOrderBtn from './PlaceOrderBtn';
import { useDataContext, getPrice } from '../../DataContext';

function CartModal({ cartItems = [] }) {
  const { selectedCurrency } = useDataContext();

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
    <section className="z-50 bg-white py-8 px-4 w-[325px] max-h-[calc(100vh-5rem)] overflow-y-auto">
      <h2 className="mb-4 text-base">
        <span className="font-bold">My Bag,</span>
        {' '}{totalItems} item{totalItems === 1 ? '' : 's'}
      </h2>

      {totalItems === 0 ? (
        <p className="mt-2 text-gray-500">Your bag is empty.</p>
      ) : (
        <>
          <div className="py-2 space-y-8 overflow-y-auto max-h-[420px]">
            {cartItems.map((item) => (
              <CartModalItem key={item.id} item={item} />
            ))}
          </div>

          <div className="pt-6 mt-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-medium font-roboto">Total</h3>
              <div className="font-bold" data-testid="cart-total">
                {`${currencySymbol}${totalPrice}`}
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/cart"
                className="flex-1 py-3 text-sm text-center uppercase transition-colors border border-text hover:bg-text hover:text-white"
                onClick={() => (document.body.style.overflowY = 'auto')}
              >
                View Bag
              </Link>
              <PlaceOrderBtn className="flex-1 !px-4 !text-sm" />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

CartModal.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.object),
};

export default CartModal;
