import React from "react";
import BasicModal from '@/components/Modal/BasicModal'

// props: open, onClose
export type TxPoolTutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

export const TxPoolTutorialModal: React.FC<TxPoolTutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <BasicModal
      title="未承認取引一覧"
      icon={<img src="/images/icons/mini/white/book.svg" alt="" className="w-7 h-7 bg-[#494848] rounded-full p-0.5"/>}
      open={open}
      requestClose={onClose}>
      <p>
        ブロックチェーンでは、取引は作成しただけでは成立しません。<br />
        その取引が正式な記録として扱われるには、ほかの参加者に内容を検証され、ブロックに格納され、そのブロックが最長チェーンに接続される必要があります。<br />
        そのため取引は一度つくられても、すぐには確定されず、しばらくのあいだ承認待ちの状態になります。<br />
        このような取引は、まだブロックに含まれておらず、チェーンにもつながっていませんが、すでに存在していて誰でも参照・検証・ブロックへの格納が可能です。<br />
        <br />
        このアプリでは、そのような状態の取引を「未承認取引一覧」に表示しています。<br />
        <br />
        ただし、すべての取引のうち、その時点の最長チェーンから見てまだ接続されていないものを抽出したリストにすぎません。<br />
        そのため最長でない他のチェーンから見たときにはこの内容は大きく異なることがあります。<br />
        <br />
        ここにある取引から何をブロックに取り込むかによって、その後のチェーンの形や記録の流れが変わっていきます。
      </p>
    </BasicModal>
  );
};
