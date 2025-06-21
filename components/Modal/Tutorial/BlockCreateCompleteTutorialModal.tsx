import React from "react";
import BasicModal from '@/components/Modal/BasicModal'

// props: open, onClose
export type BlockCreateCompleteTutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

export const BlockCreateCompleteTutorialModal: React.FC<BlockCreateCompleteTutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <BasicModal
      title="なぜ最長チェーンだけが正史なのか"
      icon={<img src="/images/icons/mini/white/book.svg" alt="" className="w-7 h-7 bg-[#494848] rounded-full p-0.5"/>}
      open={open}
      requestClose={onClose}>
      <p>ブロックチェーンでは、それぞれのブロックが「どのブロックのあとに作られたか」というつながりを持ち、過去から未来へと連なる記録の列をつくっていきます。<br />
        このようなつながりの集合を「チェーン」と呼びます。<br />
        チェーンは一本だけではなく、複数の分岐が生まれることもあります。この場合、複数のルートが同時に存在することになりますが、ブロックチェーンでは「もっとも長くつながっているチェーン（＝最も多くのブロックがつながっているルート）」を「正しい歴史」として扱うのが基本のルールです。<br />
        このルールは、「誰か特別な権限を持つ人」が記録の正しさを決めるのではなく、一番多くの参加者に支持され、協力されて続いてきた記録こそが“みんなにとっての正しさ”だとみなすという考え方に基づいています。<br />
        つまり、情報の正しさは力や命令ではなく、参加と継続の積み重ねによって決まるという、ブロックチェーンの基本理念を実現するための仕組みなのです。
      </p>
    </BasicModal>
  );
};
