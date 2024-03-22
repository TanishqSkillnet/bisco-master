import classnames from 'classnames'
import { range, values } from 'ramda'
import React from 'react'
import { Dots, Slide, Slider, SliderContainer } from 'vtex.slider'
import { Container } from 'vtex.store-components'
import { IconCaret } from 'vtex.store-icons'
import { getItemsPerPage } from './utils/pageUtils'
import { resolvePaginationDotsVisibility } from './utils/resolvePaginationDots'
import vSlider from './videoSlider.css'
import { withDevice } from 'vtex.device-detector'

interface Props {
  videoHeight: number
  videoWidth: string
  numberOfVideos: number
  videos: []
  autoplay?: boolean
  autoplaySpeed: number
  showArrows?: boolean
  showDots?: boolean
  perPage: string
  draggable: boolean
  minItemsPerPage: number
  isMobile: boolean
  paginationDotsVisibility: string
  videoMobileHeight: number
}

interface State {
  currentSlide: number
}

interface ArrowProps {
  orientation: string
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

interface ArrowContainerProps {
  children: React.ReactNode
}

const DEFAULT_MAX_ITEMS = 1
const DEFAULT_MIN_ITEMS_PER_PAGE = 1

class VideoSlider extends React.Component<Props, State> {
  public static defaultProps = {
    autoplay: false,
    autoplaySpeed: 5,
    draggable: true,
    isMobile: false,
    minItemsPerPage: DEFAULT_MIN_ITEMS_PER_PAGE,
    numberOfVideos: DEFAULT_MAX_ITEMS,
    paginationDotsVisibility: 'visible',
    perPage: '300:1',
    showArrows: true,
    showDots: true,
    videoHeight: 420,
    videoMobileHeight: 210,
    videoWidth: '100%',
  }

  public static getSchema = (data: { numberOfVideos: number; autoplay: boolean }) => {
    const videoList = {} as any

    range(0, data.numberOfVideos || 3).forEach((videoIndex: number) => {
      videoList[`video-${videoIndex}`] = {
        properties: {
          videoTitle: {
            default: '',
            title: 'editor.video-slider.video.videoTitle',
            type: 'string',
          },
          videoUrl: {
            default: '',
            title: 'editor.video-slider.video.videoUrl',
            type: 'string',
          },
        },
        title: 'editor.video-slider.videos.title',
        type: 'object',
      }
    })

    return {
      description: 'editor.video-slider.description',
      properties: {
        autoplay: {
          default: true,
          title: 'editor.video-slider.video.autoPlay',
          type: 'boolean',
        },
        autoplaySpeed: data.autoplay
          ? {
              default: 5,
              enum: [4, 5, 6],
              isLayout: true,
              title: 'editor.video-slider.video.autoplaySpeed',
              type: 'number',
              widget: {
                'ui:options': {
                  inline: true,
                },
                'ui:widget': 'radio',
              },
            }
          : {},
        draggable: {
          default: true,
          title: 'editor.video-slider.video.draggable',
          type: 'boolean',
        },
        videoHeight: {
          default: 420,
          title: 'editor.video-slider.video.height',
          type: 'number',
        },
        videoMobileHeight: {
          default: 210,
          title: 'editor.video-slider.video.mobile-height',
          type: 'number',
        },
        videoWidth: {
          default: '100%',
          title: 'editor.video-slider.video.width',
          type: 'string',
        },
        paginationDotsVisibility: {
          default: 'visible',
          enum: ['visible', 'invisible'],
          isLayout: false,
          title: 'editor.video-slider.paginationDotsVisibility',
          type: 'string',
        },
        numberOfVideos: {
          default: 2,
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          isLayout: false,
          title: 'editor.video-slider.numberOfVideos',
          type: 'number',
        },
        perPage: {
          default: '',
          title: 'editor.video-slider.video.perPage',
          type: 'string',
        },
        showArrows: {
          default: true,
          title: 'editor.video-slider.video.showArrows',
          type: 'boolean',
        },
        showDots: {
          default: true,
          title: 'editor.video-slider.video.showDots',
          type: 'boolean',
        },
        videos: {
          isLayout: false,
          properties: videoList,
          title: 'editor.video-slider.videos',
          type: 'object',
        },
      },
      title: 'editor.video-slider.title',
      type: 'object',
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      currentSlide: 0,
    }
  }

  public handleChangeSlide = (i: number): void => {
    this.setState({ currentSlide: i })
  }

  public handleNextSlide = (): void => {
    const perPage = 1
    const videoList = values(this.props.videos).map(video => video)
    this.setState(({ currentSlide }) => {
      const videosLength: number = videoList.filter((video: any) => video && video.videoUrl).length
      const nextSlide: number = ((currentSlide + 1 - perPage) % videosLength) + perPage

      return {
        currentSlide: nextSlide,
      }
    })
  }

  public ArrowRender: React.StatelessComponent<ArrowProps> = ({
    orientation,
    onClick,
  }: ArrowProps) => {
    const containerClasses = classnames(vSlider.arrow, 'pointer z-1 flex', {
      [vSlider.arrowLeft]: orientation === 'left',
      [vSlider.arrowRight]: orientation === 'right',
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
    const wrapperClasses = classnames(
      vSlider.arrowsContainerWrapper,
      'w-100 h-100 absolute left-0 top-0 flex justify-center'
    )
    const containerClasses = classnames(
      vSlider.arrowsContainer,
      'w-100 h-100 mw9 flex-ns justify-between items-center dn-s'
    )

    return (
      <div className={wrapperClasses}>
        <Container className={containerClasses}>{children}</Container>
      </div>
    )
  }

  public getVideosWithUrls = (videos: any) =>
    values(videos)
      .map(video => video)
      .filter(video => video && video.videoUrl)

  public roundHalf = (num: number) => Math.round(num * 2) / 2

  public render() {
    const {
      videoHeight,
      videoMobileHeight,
      autoplay,
      showArrows,
      autoplaySpeed,
      showDots,
      draggable,
      perPage,
      videos,
      videoWidth,
      minItemsPerPage,
      paginationDotsVisibility,
      isMobile,
    } = this.props
    const { currentSlide } = this.state

    if (!videos || videos.length === 0) {
      return <div />
    }

    const videoList = this.getVideosWithUrls(videos)
    const itemsPerPage = getItemsPerPage(perPage)

    const iframeStyles = {
      maxHeight: isMobile ? videoMobileHeight : videoHeight,
      width: videoWidth,
    }

    const showPaginationDots = resolvePaginationDotsVisibility(paginationDotsVisibility, isMobile)
    const roundedMinItems = this.roundHalf(minItemsPerPage)
    return (
      <SliderContainer
        autoplay={autoplay}
        autoplayInterval={autoplaySpeed * 1000}
        pauseOnHover
        onNextSlide={this.handleNextSlide}
        className={vSlider.container}>
        <Slider
          loop
          classes={{
            root: vSlider.sliderRoot,
            sliderFrame: vSlider.sliderFrame,
          }}
          perPage={itemsPerPage}
          minPerPage={roundedMinItems}
          arrowRender={showArrows && this.ArrowRender}
          currentSlide={Math.ceil(currentSlide)}
          onChangeSlide={this.handleChangeSlide}
          arrowsContainerComponent={showArrows && this.ArrowContainerRender}
          duration={500}
          draggable={draggable}>
          {videoList.map((video: any, i: number) => (
            <Slide
              className={vSlider.slide}
              key={i}
              style={{ height: `${isMobile ? videoMobileHeight : videoHeight}px` }}
              sliderTransitionDuration={500}>
              <div className="w-100 flex items-center justify-center h-100">
                <iframe src={video.videoUrl} {...iframeStyles} className={vSlider.videoContainer} />
              </div>
            </Slide>
          ))}
        </Slider>
        {showDots && showPaginationDots && (
          <Dots
            loop
            perPage={perPage}
            minPerPage={roundedMinItems}
            currentSlide={Math.ceil(currentSlide)}
            totalSlides={videos.length}
            onChangeSlide={this.handleChangeSlide}
            classes={{
              activeDot: classnames(vSlider.activeDot, 'bg-emphasis'),
              dot: classnames(vSlider.dot, 'mh2 mv0 pointer br-100'),
              notActiveDot: classnames(vSlider.notActiveDot, 'bg-muted-3'),
              root: classnames(vSlider.containerDots, 'bottom-0 pb4'),
            }}
          />
        )}
      </SliderContainer>
    )
  }
}

export default withDevice(VideoSlider)
