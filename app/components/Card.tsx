import { forwardRef } from "react";

import SilentText from "~/components/SilentText";

import type { Game } from "~/types";

type CardProps = {
  game: Game;
  children?: never;
} & React.HTMLAttributes<HTMLDivElement>;
const Card = forwardRef(function Card(
  { game, className = "", ...props }: CardProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      className={`${className} my-14 rounded-primary bg-card transition-transform hover:scale-105`}
      {...props}
      ref={ref}
    >
      <a
        href={game.link}
        className="flex flex-col lg:flex-row"
        rel="noreferrer"
        target="_blank"
      >
        <div
          style={{
            backgroundImage: `url(${game.image})`,
          }}
          className={`min-h-[280px] rounded-t-primary bg-cover bg-center bg-no-repeat lg:min-w-[40%] lg:rounded-l-primary lg:rounded-tr-none`}
        ></div>
        <div className="mt-5 flex-grow px-5 lg:mt-14 lg:px-0 lg:pl-12">
          <h3 className="text-3xl">{game.title}</h3>
          <SilentText className="mt-2 text-xl">
            {game.tags?.join(", ")}
          </SilentText>
          <span className="relative mt-4 block before:absolute before:h-[10px] before:w-[127px] before:rounded-primary before:bg-primary lg:mt-6"></span>
        </div>
        <div className="mt-5 mb-5 flex flex-grow flex-row items-center justify-between px-5 lg:mt-14 lg:mb-10 lg:flex-col lg:items-end lg:pr-8">
          <IcSharpGridView className="h-[40px] w-[40px] text-primary" />
          <p className="text-bold text-5xl font-bold">${game.price}</p>
        </div>
      </a>
    </div>
  );
});

export function IcSharpGridView(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M0 0H18.9621V18.9538H0V0ZM21.0379 0H40V18.9538H21.0379V0ZM0 21.0379H18.9621V40H0V21.0379ZM21.0379 21.0379H40V40H21.0379"
      />
    </svg>
  );
}

export default Card;
