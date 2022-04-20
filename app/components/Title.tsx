type TitleProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;
export default function Title({
  children,
  className = "",
  ...props
}: TitleProps) {
  return (
    <h1
      style={{
        lineHeight: "3rem",
      }}
      className={`${className} before:r-0 after:r-0 relative inline text-4xl font-bold before:absolute before:top-1/2 before:-left-[135px] before:h-[10px] before:w-[127px] before:translate-y-[-50%] before:rounded-primary before:bg-primary after:absolute after:-right-36 after:top-1/2 after:h-[10px] after:w-[127px] after:translate-y-[-50%] after:rounded-primary after:bg-primary lg:before:-left-36`}
      {...props}
    >
      {children}
    </h1>
  );
}
