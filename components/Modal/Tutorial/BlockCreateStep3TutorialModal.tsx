import React from "react";
import BasicModal from '@/components/Modal/BasicModal'

// props: open, onClose
export type BlockCreateStep3TutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

export const BlockCreateStep3TutorialModal: React.FC<BlockCreateStep3TutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <BasicModal
      title="ブロック作成報酬の意義"
      icon={<img src="/images/icons/mini/white/book.svg" alt="" className="w-7 h-7 bg-[#494848] rounded-full p-0.5"/>}
      open={open}
      requestClose={onClose}>
      <div>
        <p>
          ブロックチェーンでは、記録の正しさを保つために、誰かが取引を選び、内容を検証し、それをブロックとしてまとめる作業が必要になります。<br />
          しかしこの作業には手間がかかり、利他的な行動でもあるため、何らかのインセンティブ（報酬）がないと誰も進んで行おうとしなくなります。<br />
          そのため、ブロックを作成した人には、その見返りとして一定のコインが報酬として支払われる仕組みが設けられています。<br />
          この報酬はブロック内に「送金取引」として自動的に含まれ、他の取引と一緒に記録されます。<br />
          この報酬の仕組みには、以下のような意義があります：
        </p>
        <ul className="list-disc pl-5">
          <li>誰かが進んでブロック作成を担う動機づけになる</li>
          <li>記録を維持する作業が、ボランティアではなく経済的に支えられる</li>
          <li>ブロックを作る行為自体に価値が与えられ、分散的な記録が持続可能になる</li>
        </ul>
        つまり、報酬は単なるおまけではなく、分散型の仕組みが自律的に回り続けるための、必要不可欠な設計要素です。
      </div>
    </BasicModal>
  );
};
