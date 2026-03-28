import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Cart, CartModal, Loading, Logo, NavigationMenu } from '.';
import { useDataContext } from '../DataContext';
import { GET_CATEGORIES_AND_PRODUCTS, GET_PRODUCTS } from '../graphql/queries';

const Header = () => {
  const { category } = useParams();
  const { cartItems, setSelectedCategory, setProductsData, isCartOpen, setIsCartOpen } = useDataContext();

  const [categories, setCategories] = useState([]);

  const toggleModal = () => setIsCartOpen((prevState) => !prevState);

  const [fetchProducts] = useLazyQuery(GET_PRODUCTS, {
    onCompleted: (data) => setProductsData(data.products),
  });

  const handleCategoryChange = (category) => {
    fetchProducts({ variables: { category } });
    setSelectedCategory(category);
  };

  const [fetchData, { loading: dataLoading, error: dataError }] = useLazyQuery(
    GET_CATEGORIES_AND_PRODUCTS,
    {
      onCompleted: (data) => {
        setProductsData(data.products);
        setCategories(data.categories.map((category) => category.name));
        setSelectedCategory(category ?? data.categories[0]?.name);
      },
    }
  );

  useEffect(() => {
    fetchData({ variables: { category } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  useEffect(() => {
    document.body.style.overflowY = isCartOpen ? 'hidden' : 'auto';
  }, [isCartOpen]);

  if (dataError) {
    return (
      <p className="py-2 my-8 font-semibold text-center text-white bg-red-500">
        Oops! Something broke. Try reloading the page or come back later.
      </p>
    );
  }

  if (dataLoading) {
    return <Loading />;
  }

  return (
    <>
      <header className="relative z-20 flex items-center justify-between border-b border-gray-200">
        <NavigationMenu
          categories={categories}
          handleCategoryChange={handleCategoryChange}
        />

        <div className="absolute inset-x-0 flex items-center justify-center mx-auto pointer-events-none">
          <Link
            to="/"
            onClick={() => handleCategoryChange(categories[0])}
            className="pointer-events-auto"
          >
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-4 z-10">
          <button
            className="relative cursor-pointer py-6"
            onClick={toggleModal}
            data-testid="cart-btn"
          >
            <Cart />
            {cartItems.length > 0 && (
              <div
                className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full top-3 -right-2 bg-text font-roboto"
                data-testid="cart-count-bubble"
              >
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </div>
            )}
          </button>
        </div>
      </header>

      {isCartOpen && (
        <div
          data-testid="cart-overlay"
          className="fixed inset-0 z-50 flex"
          style={{ visibility: 'visible' }}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            style={{ top: '80px' }}
            onClick={toggleModal}
          ></div>
          <div className="absolute right-0 top-[80px] bottom-0 w-[400px] bg-white shadow-lg overflow-y-auto">
            <CartModal cartItems={cartItems} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
