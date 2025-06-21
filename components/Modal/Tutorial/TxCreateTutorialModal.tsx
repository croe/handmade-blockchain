import React from "react";
import BasicModal from '@/components/Modal/BasicModal'

// props: open, onClose
export type TxCreateTutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

export const TxCreateTutorialModal: React.FC<TxCreateTutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <BasicModal
      title="取引とはなにか"
      icon={<img src="/images/icons/mini/white/book.svg" alt="" className="w-7 h-7 bg-[#494848] rounded-full p-0.5"/>}
      open={open}
      requestClose={onClose}>
      <p>ブロックチェーンにおける「取引」とは、コインを誰かに送りたいという意志を他の参加者に宣言することです。<br />
        たとえば「自分が10コインをAさんに送る」という取引があれば、それを他の参加者が確認・検証し、正しいと認めれば、その取引はブロックに記録され、正式に実行されます。<br />
        つまり取引は、ブロックチェーン上でコインを動かすための最小単位の情報です。
      </p>
    </BasicModal>
  );
};
