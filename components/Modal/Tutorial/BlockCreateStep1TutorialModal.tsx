import React from "react";
import BasicModal from '@/components/Modal/BasicModal'

// props: open, onClose
export type BlockCreateStep1TutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

export const BlockCreateStep1TutorialModal: React.FC<BlockCreateStep1TutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <BasicModal
      title="ブロックとはなぜ必要なのか"
      icon={<img src="/images/icons/mini/white/book.svg" alt="" className="w-7 h-7 bg-[#494848] rounded-full p-0.5"/>}
      open={open}
      requestClose={onClose}>
      <p>ブロックは、取引の情報をまとめて格納する「箱」のようなものです。<br />
        送金などの取引データは、ブロックに入れられてはじめて正式な記録とみなされ、その内容が実行されます。<br />
        なぜわざわざブロックに格納するという工程を挟む必要があるのでしょうか？<br />
        それは、記録を整理して扱いやすくするだけでなく、その記録が正しいとみなされるための“公開の枠組み”として機能しているからです。<br />
        取引はブロックに入れられることによって、他者による確認が可能となり、不正や改ざんが発見されやすくなります。<br />
        つまりブロックは、「取引を成立させる」「他の参加者に知らせる」「記録として残す」という３つの役割を同時に担う、ブロックチェーンの基本単位です。
      </p>
    </BasicModal>
  );
};


