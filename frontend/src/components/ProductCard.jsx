import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Cart } from './';
import searchingImg from '../assets/searching.svg';
import { useDataContext, getPrice } from '../DataContext';

function ProductCard({ product = {} }) {
  const { addToCart, selectedCurrency } = useDataContext();
  const price = getPrice(product.prices, selectedCurrency);

  return (
    <article>
      <div className={`p-4 overflow-hidden transition-shadow duration-300 group${product.inStock ? ' hover:shadow-[0_4px_35px_rgba(168,172,176,0.19)]' : ''}`}>
        <div className={`relative mb-6${!product.inStock ? ' opacity-50' : ''}`}>
          <Link
            to={`/products/${product.id}`}
            data-testid={`product-${product.name
              .replace(/\s+/g, '-')
              .toLowerCase()}`}
          >
            <div className="relative">
              <img
                src={product.gallery[0] ?? searchingImg}
                alt={product.name}
                loading="lazy"
                className="object-contain w-full h-[330px]"
              />
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center text-2xl uppercase bg-white bg-opacity-50 text-muted">
                  Out of Stock
                </div>
              )}
            </div>
          </Link>

          {product.inStock && (
            <button
              onClick={() => addToCart(product)}
              className="absolute bottom-0 p-3 transition-opacity duration-300 transform translate-y-1/2 rounded-full shadow-lg opacity-0 cta group-hover:opacity-100 right-4"
              data-testid="quick-shop-btn"
            >
              <Cart color="white" size={24} />
            </button>
          )}
        </div>

        <div className={!product.inStock ? 'opacity-50' : ''}>
          <h3 className="text-lg font-light">
            {product.brand} {product.name}
          </h3>
          <div className={`font-medium text-lg font-roboto-condensed ${!product.inStock ? 'text-muted' : ''}`}>
            {price?.currency?.symbol}{price?.amount}
          </div>
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    inStock: PropTypes.bool.isRequired,
    gallery: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    prices: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.string.isRequired,
        currency: PropTypes.shape({
          label: PropTypes.string.isRequired,
          symbol: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
    category: PropTypes.string.isRequired,
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            displayValue: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ProductCard;
