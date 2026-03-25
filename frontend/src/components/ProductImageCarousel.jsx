import { Component } from 'react';
import PropTypes from 'prop-types';
import { Arrow } from './';

class ProductImageCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      mainImageHeight: null,
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleMainImageLoad = this.handleMainImageLoad.bind(this);
  }

  handleNext() {
    this.setState((prevState) => ({
      currentIndex: (prevState.currentIndex + 1) % this.props.images.length,
    }));
  }

  handlePrev() {
    this.setState((prevState) => ({
      currentIndex:
        (prevState.currentIndex - 1 + this.props.images.length) %
        this.props.images.length,
    }));
  }

  handleMainImageLoad(e) {
    const { clientHeight } = e.target;
    const maxHeightRatio = 0.6;
    const maxHeight = window.innerHeight * maxHeightRatio;
    const mainImageHeight = Math.min(clientHeight, maxHeight);

    this.setState({ mainImageHeight });
  }

  render() {
    const { images = [], alt = 'Product' } = this.props;
    const { currentIndex, mainImageHeight } = this.state;

    return (
      <section className="flex-1 mb-6 md:mb-0" data-testid="product-gallery">
        {!!images?.length && (
          <div className="relative flex gap-4">
            <div
              className="flex flex-col gap-2 w-[80px] flex-shrink-0 max-h-[500px] overflow-y-auto"
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={alt}
                  className={`w-full h-[80px] object-cover ${
                    index === currentIndex ? 'border-2 border-primary' : 'border border-transparent'
                  } cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => this.setState({ currentIndex: index })}
                />
              ))}
            </div>
            <div className="relative flex-1">
              <img
                src={images[currentIndex]}
                alt={alt}
                className="object-contain w-full h-auto max-h-[500px]"
                onLoad={this.handleMainImageLoad}
              />

              {images.length > 1 && (
                <>
                  <button
                    className="absolute flex items-center justify-center w-8 h-8 text-white transition-opacity bg-black bg-opacity-70 hover:bg-opacity-90 bottom-4 right-14"
                    onClick={this.handlePrev}
                  >
                    <Arrow direction="left" />
                  </button>
                  <button
                    className="absolute flex items-center justify-center w-8 h-8 text-white transition-opacity bg-black bg-opacity-70 hover:bg-opacity-90 bottom-4 right-4"
                    onClick={this.handleNext}
                  >
                    <Arrow />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }
}

ProductImageCarousel.propTypes = {
  images: PropTypes.array,
  alt: PropTypes.string,
};

export default ProductImageCarousel;
