type Props = {
  children?: React.ReactNode;
}

const MiniLayout = ({children}: Props) => (
  <div className="mx-auto px-5 max-w-[400px] flex flex-col gap-4">
    {children}
  </div>
)
export default MiniLayout;
