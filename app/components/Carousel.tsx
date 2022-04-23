import type { Settings } from "react-slick";
import Slider from "react-slick";
import type { Game } from "~/types";

type CarouselProps = {
  games: Game[];
} & React.HTMLAttributes<HTMLDivElement>;
export default function Carousel({
  games,
  className = "",
  ...props
}: CarouselProps) {
  const settings: Settings = {
    dots: true,
    accessibility: true,
    className: "center",
    arrows: false,
    centerMode: true,
    infinite: true,
    centerPadding: "300px",
    slidesToShow: 1,
    speed: 500,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          centerPadding: "50px",
        },
      },
    ],
    appendDots: (dots) => (
      <div
        style={{
          paddingTop: "1rem",
        }}
      >
        <ul className="slick-dots"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          borderRadius: "50%",
          height: "15px",
          width: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      ></div>
    ),
  };

  return (
    <div className={`${className} relative`} {...props}>
      <CircularGradient />
      <Slider {...settings} className="pt-16">
        {games.map((game) => (
          <div key={game.id} className="rounded-primary">
            <img
              src={game.image}
              alt={game.title}
              className="max-h-[500px] w-[100%] rounded-primary object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function CircularGradient() {
  return (
    <svg
      width="1440"
      height="905"
      viewBox="0 0 1440 905"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute top-1/2 left-1/2 w-[100%] -translate-x-1/2 -translate-y-1/2 transform"
    >
      <g filter="url(#filter0_f_1701_119)">
        <ellipse cx="729.5" cy="362" rx="433.5" ry="173" fill="#4D6E95" />
      </g>
      <defs>
        <filter
          id="filter0_f_1701_119"
          x="-74"
          y="-181"
          width="1607"
          height="1086"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="185"
            result="effect1_foregroundBlur_1701_119"
          />
        </filter>
      </defs>
    </svg>
  );
}
