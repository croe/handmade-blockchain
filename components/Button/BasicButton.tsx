'use client'

type Props = {
  children?: React.ReactNode
  onClick?: () => void
  variant?: 'success' | 'error'
}

const BasicButton = ({children, onClick, variant = 'success'}:Props) => {
  const bgColor = variant === 'success' ? 'bg-[#0FCFFF]' : 'bg-red-500'

  return (
    <button
      className={`${bgColor} text-white font-bold p-1 rounded-3xl min-w-[250px] w-max`}
      onClick={onClick}
    >
      <div className="border border-[#E5E5E5] w-full h-full rounded-3xl px-3 p-2 flex justify-between items-center">
        {children}
      </div>
    </button>
  )
}

export default BasicButton
