type Props = {
  onClick?: () => void
}

const HelpButton = ({onClick}:Props) => {
  return (
    <button onClick={onClick}>
      <img src="/images/icons/circle_book.svg" className="w-10 h-10" alt="help" />
    </button>
  )
}

export default HelpButton
