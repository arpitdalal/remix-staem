type SilentTextProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>;
export default function SilentText({
  children,
  className = "",
  ...props
}: SilentTextProps) {
  return (
    <p className={`${className} font-arial opacity-50`} {...props}>
      {children}
    </p>
  );
}
