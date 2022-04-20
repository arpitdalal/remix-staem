import Slider from "react-slick";

import type { Settings } from "react-slick";
import type { Game } from "~/types";

type CarouselProps = {
  games: Game[];
};
export default function Carousel({ games }: CarouselProps) {
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
    <Slider {...settings} className="mt-16 mb-32">
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
  );
}
