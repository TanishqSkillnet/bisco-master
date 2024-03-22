import classNames from 'classnames'
import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Dots, Slide, Slider, SliderContainer } from 'vtex.slider'
import { Container } from 'vtex.store-components'
import { IconCaret } from 'vtex.store-icons'
import styles from '../brandContent.css'
import ProductSliderItem from './ProductSliderItem'

interface Props {
  productIds: string[]
  noOfProducts: number
  autoplay: boolean
  autoplaySpeed: number | string | null
  showArrows: boolean
  showDots: boolean
  itemsPerPage: number
  width: number
  gap: string
  height?: number
  maxItems: number
  minItemsPerPage: number
  paginationDotsVisibility: string
  isMobile: boolean
}

interface ArrowProps {
  orientation: string
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

interface ArrowContainerProps {
  children: React.ReactNode
}

const PER_PAGE = 4

const CSS_HANDLES = [
  'brandContentArrow',
  'brandContentArrowLeft',
  'brandContentArrowRight',
  'brandContentArrowsContainerWrapper',
  'sliderRoot',
  'sliderFrame',
  'slide',
  'activeDot',
  'notActiveDot',
  'containerDots',
] as const

const ProductCarousel = (props: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const handles = useCssHandles(CSS_HANDLES)
  const {
    height = 375,
    autoplay = true,
    showDots = true,
    showArrows = true,
    autoplaySpeed = 5,
    productIds = [],
  } = props
  const ArrowRender = ({ orientation, onClick }: ArrowProps) => {
    const containerClasses = classNames(handles.brandContentArrow, 'pointer z-1 flex', {
      [handles.brandContentArrowLeft]: orientation === 'left',
      [handles.brandContentArrowRight]: orientation === 'right',
    })
    return (
      <div className={containerClasses} onClick={onClick}>
        <IconCaret orientation={orientation} thin size={20} />
      </div>
    )
  }

  const ArrowContainerRender = ({ children }: ArrowContainerProps) => {
    const wrapperClasses = classNames(
      handles.brandContentArrowsContainerWrapper,
      'w-100 h-100 absolute left-0 top-0 flex justify-center'
    )
    const containerClasses = classNames(
      styles.brandContentArrowsContainer,
      'w-100 h-100 mw9 flex-ns justify-between items-center dn-s'
    )

    return (
      <div className={wrapperClasses}>
        <Container className={containerClasses}>{children}</Container>
      </div>
    )
  }

  const handleNextSlide = () => {
    const nextSlide = ((currentSlide + 1 - PER_PAGE) % productIds.length) + PER_PAGE
    setCurrentSlide(nextSlide)
  }

  const autoplayInterval = autoplaySpeed
    ? typeof autoplaySpeed === 'string'
      ? parseFloat(autoplaySpeed)
      : autoplaySpeed
    : 0

  return (
    <SliderContainer
      autoplay={autoplay && autoplayInterval > 0}
      autoplayInterval={autoplayInterval * 1000}
      pauseOnHover
      onNextSlide={handleNextSlide}
      className={styles.container}
    >
      <Slider
        loop
        classes={{
          root: handles.sliderRoot,
          sliderFrame: handles.sliderFrame,
        }}
        perPage={PER_PAGE}
        arrowRender={showArrows && ArrowRender}
        currentSlide={currentSlide}
        onChangeSlide={setCurrentSlide}
        arrowsContainerComponent={showArrows && ArrowContainerRender}
        duration={500}
      >
        {productIds.map((productId, i) => (
          <Slide
            className={handles.slide}
            key={i}
            style={{ maxHeight: height }}
            sliderTransitionDuration={500}
          >
            <ProductSliderItem productId={productId} />
          </Slide>
        ))}
      </Slider>
      {showDots && (
        <Dots
          loop
          perPage={PER_PAGE}
          currentSlide={currentSlide}
          totalSlides={productIds.length}
          onChangeSlide={setCurrentSlide}
          classes={{
            activeDot: classNames(handles.activeDot, 'bg-emphasis'),
            dot: classNames(styles.dot, 'mh2 mv0 pointer br-100'),
            notActiveDot: classNames(handles.notActiveDot, 'bg-muted-3'),
            root: classNames(handles.containerDots, 'bottom-0 pb4'),
          }}
        />
      )}
    </SliderContainer>
  )
}

ProductCarousel.defaultProps = {
  itemsPerPage: 5,
  minItemsPerPage: 1,
  paginationDotsVisibility: 'visible',
}

export default ProductCarousel
