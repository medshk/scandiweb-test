import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDataContext } from '../DataContext';

function NavigationMenu({ categories, handleCategoryChange }) {
  const { selectedCategory } = useDataContext();

  return (
    <nav className="z-10 h-full">
      <ul className="flex h-full gap-2 uppercase">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;

          return (
            <li key={category} className="flex">
              <Link
                to={`/${category}`}
                className={`flex items-center px-4 border-b-2 transition-colors duration-200 ${
                  isSelected
                    ? 'nav-active'
                    : 'border-transparent hover:text-primary hover:border-primary'
                }`}
                data-testid={
                  isSelected ? 'active-category-link' : 'category-link'
                }
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

NavigationMenu.propTypes = {
  categories: PropTypes.array,
  handleCategoryChange: PropTypes.func,
};

export default NavigationMenu;
