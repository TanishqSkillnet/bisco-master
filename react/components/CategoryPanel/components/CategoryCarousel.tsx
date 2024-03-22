import React, { Component } from 'react'
import { CategoryItem, FacetImage } from '../utils/interfaces'
import classNames from 'classnames'
import CategoryPanelItem from './CategoryPanelItem'
import { resolvePaginationDotsVisibility } from '../utils/resolvePaginationDots'
import styles from '../categoryPanel.css'
import { NoSSR } from 'vtex.render-runtime'
import { Dots, Slide, Slider, SliderContainer } from 'vtex.slider'
import { Container } from 'vtex.store-components'
import { IconCaret } from 'vtex.store-icons'

interface Props {
  items: CategoryItem[]
  noOfCategories: number
  autoplay: boolean
  autoplaySpeed: number
  showArrows: boolean
  showDots: boolean
  itemsPerPage: number
  width: number
  gap: string
  maxItems: number
  minItemsPerPage: number
  paginationDotsVisibility: string
  isMobile: boolean
  facetImages: FacetImage[]
}

interface State {
  currentSlide: number
  firstRender: boolean
}

interface ArrowProps {
  orientation: string
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

interface ArrowContainerProps {
  children: React.ReactNode
}

const SLIDER_WIDTH_ONE_ELEMENT = 320
const SLIDER_WIDTH_TWO_ELEMENTS = 500
const SLIDER_WIDTH_THREE_ELEMENTS = 750
const SLIDER_WIDTH_FOUR_ELEMENTS = 1000
const SLIDER_WIDTH_FIVE_ELEMENTS = 1290
const DEFAULT_SHELF_ITEM_WIDTH = 260

class CategoryCarousel extends Component<Props, State> {
  public perPage: any

  public static defaultProps = {
    itemsPerPage: 5,
    minItemsPerPage: 1,
    paginationDotsVisibility: 'visible',
  }

  public constructor(props: Props) {
    super(props)
    this.handleChangeSlide = this.handleChangeSlide.bind(this)
    this.handleNextSlide = this.handleNextSlide.bind(this)
    this.perPage = {
      [SLIDER_WIDTH_FIVE_ELEMENTS]: 5,
      [SLIDER_WIDTH_FOUR_ELEMENTS]: 4,
      [SLIDER_WIDTH_THREE_ELEMENTS]: 3,
      [SLIDER_WIDTH_TWO_ELEMENTS]: 2,
      [SLIDER_WIDTH_ONE_ELEMENT]: 1,
    }
    this.calcItemsPerPage()
    this.state = {
      currentSlide: 0,
      firstRender: true,
    }
  }

  public calcItemsPerPage = () => {
    const { itemsPerPage } = this.props
    for (let key in this.perPage) {
      if (this.perPage[key] > itemsPerPage) delete this.perPage[key]
    }
  }

  componentDidMount() {
    this.setState({ firstRender: false })
  }

  public handleChangeSlide = (i: number): void => {
    this.setState({ currentSlide: i })
  }

  public handleNextSlide = (): void => {
    const { items } = this.props
    this.setState(({ currentSlide }) => {
      const itemLength: number = items.length
      const nextSlide: number =
        ((currentSlide + 1 - this.props.itemsPerPage) % itemLength) + this.props.itemsPerPage

      return {
        currentSlide: nextSlide,
      }
    })
  }

  public ArrowRender: React.StatelessComponent<ArrowProps> = ({
    orientation,
    onClick,
  }: ArrowProps) => {
    const { gap } = this.props
    const containerClasses = classNames(styles.arrow, 'pointer z-1 flex absolute', {
      [`${styles.arrowLeft} left-0 ${gap}`]: orientation === 'left',
      [`${styles.arrowRight} right-0 ${gap}`]: orientation === 'right',
    })
    return (
      <div className={containerClasses} onClick={onClick}>
        <IconCaret orientation={orientation} thin size={20} />
      </div>
    )
  }

  public ArrowContainerRender: React.StatelessComponent<ArrowContainerProps> = ({
    children,
  }: ArrowContainerProps) => {
    const wrapperClasses = classNames(
      styles.arrowsContainerWrapper,
      'w-100 h-100 absolute left-0 top-0 flex justify-center'
    )
    const containerClasses = classNames(
      styles.arrowsContainer,
      'w-100 h-100 flex-ns justify-between items-center dn-s'
    )

    return (
      <div className={wrapperClasses}>
        <Container className={containerClasses}>{children}</Container>
      </div>
    )
  }

  public roundHalf = (num: number) => Math.round(num * 2) / 2

  public render() {
    const { currentSlide } = this.state
    const {
      items,
      showArrows,
      showDots,
      maxItems,
      minItemsPerPage,
      paginationDotsVisibility,
      isMobile,
      facetImages,
    } = this.props

    const showPaginationDots = resolvePaginationDotsVisibility(paginationDotsVisibility, isMobile)
    const roundedMinItems = this.roundHalf(minItemsPerPage)

    return (
      items.length !== 0 && (
        <div className="flex justify-start">
          <SliderContainer
            onNextSlide={this.handleNextSlide}
            className={`${styles.categoryPanelContainer} w-100`}>
            <Slider
              loop
              classes={{
                root: styles.sliderRoot,
                sliderFrame: styles.sliderFrame,
              }}
              perPage={this.perPage}
              minPerPage={roundedMinItems}
              arrowRender={showArrows && this.ArrowRender}
              currentSlide={Math.ceil(currentSlide)}
              onChangeSlide={this.handleChangeSlide}
              scrollByPage={false}
              duration={500}
              easing="ease">
              {items.map(item => (
                <Slide
                  className={styles.slide}
                  key={item.key}
                  sliderTransitionDuration={500}
                  defaultWidth={DEFAULT_SHELF_ITEM_WIDTH}>
                  <CategoryPanelItem category={item} facetImages={facetImages} index={1} parent={"name"} />
                </Slide>
              ))}
            </Slider>
            {showDots && showPaginationDots && (
              <NoSSR>
                <Dots
                  loop
                  perPage={this.perPage}
                  minPerPage={roundedMinItems}
                  currentSlide={Math.ceil(currentSlide)}
                  totalSlides={items.slice(0, maxItems).length}
                  onChangeSlide={this.handleChangeSlide}
                  classes={{
                    activeDot: classNames(styles.activeDot, 'bg-emphasis'),
                    dot: classNames(styles.dot, 'mh2 mv0 pointer br-100'),
                    notActiveDot: classNames(styles.notActiveDot, 'bg-muted-3'),
                    root: classNames(styles.containerDots, 'bottom-0 pb4'),
                  }}
                />
              </NoSSR>
            )}
          </SliderContainer>
        </div>
      )
    )
  }
}

export default CategoryCarousel
