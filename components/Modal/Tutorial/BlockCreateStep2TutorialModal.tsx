import React from "react";
import BasicModal from '@/components/Modal/BasicModal'

// props: open, onClose
export type BlockCreateStep2TutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

export const BlockCreateStep2TutorialModal: React.FC<BlockCreateStep2TutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <BasicModal
      title="なぜ取引内容の検証をするのか"
      icon={<img src="/images/icons/mini/white/book.svg" alt="" className="w-7 h-7 bg-[#494848] rounded-full p-0.5"/>}
      open={open}
      requestClose={onClose}>
      <p>ブロックチェーンにおける「取引の検証」とは、取引内容が正しいかどうかを複数の参加者が確認し合うプロセスのことです。<br />
        たとえば誰かが「10コインを送金しよう」としたとき、その人が本当に10コインを持っているか、送金先が正しいか、といった内容を第三者(本アプリでは本位による検証も可能)が検証します。この確認を通過した取引だけが正当なものとされ、ブロックに記録されます。<br />
        この仕組みによって、特定の管理者がいなくても、不正な取引や記録の改ざんを防ぐことができます。言い換えれば、「検証」はブロックチェーンにおける信頼の代わりとなる重要な工程です。<br />
        ブロックチェーンは、誰かが一方的に記録を作るのではなく、他の参加者による確認を通じて、はじめて記録が成立するという構造で成り立っています。
      </p>
    </BasicModal>
  );
};
