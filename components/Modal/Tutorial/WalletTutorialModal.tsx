import React from "react";
import BasicModal from '@/components/Modal/BasicModal'

// props: open, onClose
export type WalletTutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

export const WalletTutorialModal: React.FC<WalletTutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <BasicModal
      title="ウォレットとは何か"
      icon={<img src="/images/icons/mini/white/book.svg" alt="" className="w-7 h-7 bg-[#494848] rounded-full p-0.5"/>}
      open={open}
      requestClose={onClose}>
      <p>
        ウォレットは、ブロックチェーン上でコインをやりとりするときに使う目印のようなものです。<br />
        コインは実際にどこかに保管されているわけではなく、「いつ、だれから、だれへ、いくつコインを送ったか」という記録の積み重ねによって、いま誰が何枚のコインを持っているかがわかるしくみになっています。<br />
        ウォレットはその記録の中で、コインの送り主や受け取り先を示す目印のような役割を果たしています。<br />
        つまり、ウォレットは「ユーザーが持っているもの」というより、コインの移動の通り道や行き先を示す記号です。
      </p>
    </BasicModal>
  );
};
