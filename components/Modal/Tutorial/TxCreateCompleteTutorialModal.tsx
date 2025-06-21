import React from "react";
import BasicModal from '@/components/Modal/BasicModal'

// props: open, onClose
export type TxCreateCompleteTutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

export const TxCreateCompleteTutorialModal: React.FC<TxCreateCompleteTutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <BasicModal
      title="なぜ取引はすぐに成立しないのか"
      icon={<img src="/images/icons/mini/white/book.svg" alt="" className="w-7 h-7 bg-[#494848] rounded-full p-0.5"/>}
      open={open}
      requestClose={onClose}>
      <div>
        ブロックチェーンでは、誰かが「コインを送りたい」と言っただけでは、その取引はまだ本当かどうかわからない情報です。<br />
        そのまま信じてしまうと、あとからウソの取引や二重の送金がまぎれこんでしまうかもしれません。<br />
        そのため、作成された取引はまず「ブロック」という箱に入れて、他の参加者に中身を確認してもらい、記録として共有される必要があります。<br />
        これによって、その取引は「みんなに知られていて、正しいと認められた記録」として成立します。<br />
        さらに、同じ場所から複数の記録が同時に進んでしまったとき（分岐したとき）には、一番多くの参加者によって続けられた“最長のチェーン”だけが正しい歴史（正史）として残ります。
        <br />
        つまり、取引が正式に成立するためには、<br />
        <ul className="list-decimal pl-5">
          <li>作成される</li>
          <li>ブロックに格納され、参加者の検証を受ける</li>
          <li>そのブロックが最長チェーンにつながる</li>
        </ul>
        という順序をたどる必要があります。<br />
        <br />
        これは「一人の判断ではなく、たくさんの人の参加と同意で正しさを決める」というブロックチェーンの考え方に基づいたしくみです。
      </div>
    </BasicModal>
  );
};
