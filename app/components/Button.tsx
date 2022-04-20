type ButtonProps = {
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${className} rounded-primary bg-primary px-5 py-2 text-text transition-transform hover:scale-105`}
      {...props}
    >
      {children}
    </button>
  );
}
