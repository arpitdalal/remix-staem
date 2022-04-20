type ContainerProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;
export default function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div className={`${className} px-8 lg:px-20`} {...props}>
      {children}
    </div>
  );
}
