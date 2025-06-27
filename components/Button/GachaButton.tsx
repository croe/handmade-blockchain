'use client'

import { useRouter } from 'next/navigation'

const GachaButton = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/tx/create?gacha=true')
  };

  return (
    <button
      className="fixed z-20 bottom-[158px] right-0 rounded-l-2xl py-1 pl-1 bg-white shadow"
      onClick={handleClick}
    >
      <div className="rounded-l-xl border-y-2 border-l-2 border-[#FF6631] flex flex-col items-center justify-center px-4 py-2 gap-1">
        <img src="/images/icons/gacha.svg" alt="Gacha" className="w-10 h-9" />
        <p className="font-black text-[#FF6631]">ガチャ</p>
      </div>
    </button>
  );
}

export default GachaButton
