'use client'

type Props = {
  children?: React.ReactNode
}

const BasicButton = ({children}:Props) => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-[330px] w-max">
      {children}
    </button>
  )
}

export default BasicButton
