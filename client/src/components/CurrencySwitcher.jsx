import { Component } from 'react';
import PropTypes from 'prop-types';
import { Arrow } from './';
import { useDataContext } from '../DataContext';

function CurrencySwitcherWrapper({ currencies }) {
  const { selectedCurrency, changeCurrency } = useDataContext();
  return (
    <CurrencySwitcher
      currencies={currencies}
      selectedCurrency={selectedCurrency}
      changeCurrency={changeCurrency}
    />
  );
}

CurrencySwitcherWrapper.propTypes = {
  currencies: PropTypes.array.isRequired,
};

class CurrencySwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.ref = null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.ref && !this.ref.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  toggleDropdown() {
    this.setState((prev) => ({ isOpen: !prev.isOpen }));
  }

  handleSelect(currencyLabel) {
    this.props.changeCurrency(currencyLabel);
    this.setState({ isOpen: false });
  }

  render() {
    const { currencies, selectedCurrency } = this.props;
    const { isOpen } = this.state;

    const currentCurrency = currencies.find(
      (c) => c.label === selectedCurrency
    );
    const symbol = currentCurrency?.symbol || '$';

    return (
      <div
        className="relative z-10"
        ref={(el) => (this.ref = el)}
        data-testid="currency-switcher"
      >
        <button
          className="flex items-center gap-1 py-6 text-lg font-medium cursor-pointer"
          onClick={this.toggleDropdown}
        >
          <span>{symbol}</span>
          <Arrow direction={isOpen ? 'up' : 'down'} />
        </button>

        {isOpen && (
          <div className="absolute left-0 z-50 bg-white shadow-lg top-full w-[114px]">
            {currencies.map((currency) => (
              <button
                key={currency.label}
                className={`block w-full px-4 py-2 text-left text-lg hover:bg-gray-100 transition-colors ${
                  currency.label === selectedCurrency ? 'font-bold' : ''
                }`}
                onClick={() => this.handleSelect(currency.label)}
              >
                {currency.symbol} {currency.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

CurrencySwitcher.propTypes = {
  currencies: PropTypes.array.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
  changeCurrency: PropTypes.func.isRequired,
};

export default CurrencySwitcherWrapper;
