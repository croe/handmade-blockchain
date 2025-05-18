'use client'

type Props = {
  children?: React.ReactNode
}

const BottomBar = ({children}:Props) => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[100px] bg-[#E5E5E5] flex items-center justify-center">
      {children}
    </div>
  )
}

export default BottomBar
