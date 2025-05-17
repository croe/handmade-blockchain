'use client'

import {useAtom, useSetAtom} from 'jotai'
import {selectedTxsState, txsState} from '@/stores/transactions'
import {getBucketImage} from '@/utils/getBucketImage'
import {TX_AMOUNT_BUCKET} from '@/lib/firebase'
import {Controller, useForm} from 'react-hook-form'
import {TxInBlock} from '@/models/block'
import {useRouter} from 'next/navigation'
import {chainState, selectedBlockState} from '@/stores/chain'
import {buildBlock, getBlock} from '@/api/block'
import {currentUserState} from '@/stores/users'
import {getTx, getTxs, makeTx} from '@/api/transaction'
import {concat} from 'lodash'

type FormValues = {
  tx: {
    amount: number;
  }[];
}

const TxsValidateAndBuildBlock = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      tx: [{amount: 0}, {amount: 0}, {amount: 0}]
    },
    mode: 'onTouched'
  })
  const [selectedBlock, setSelectedBlock] = useAtom(selectedBlockState)
  const [selectedTxs, setSelectedTxs] = useAtom(selectedTxsState)
  const [currentUser] = useAtom(currentUserState)
  const setTxs = useSetAtom(txsState)
  const setChain = useSetAtom(chainState)
  const router = useRouter()
  const onSubmit = async (data: FormValues) => {
    // デバッグ用に、data.tx と selectedTxs の状態を確認します
    console.log('selectedTxs at onSubmit start:', selectedTxs, 'data.tx:', data.tx);

    if (!currentUser) return;
    if (!selectedBlock) return;

    const validatedTxs: TxInBlock[] = data.tx
      .map((formTxItem, index) => {
        const correspondingSelectedTx = selectedTxs[index]; // onSubmitが呼ばれた瞬間のselectedTxsを参照
        if (!correspondingSelectedTx) {
          // data.tx の方が selectedTxs より長い場合、このログが出力されます
          console.warn(
            `Warning: No selected transaction data for form item at index ${index}. Skipping this item.`,
            `data.tx length: ${data.tx.length}, selectedTxs length: ${selectedTxs.length}`
          );
          return null; // 不整合がある場合は null を返し、後でフィルタリングします
        }
        return {
          i: correspondingSelectedTx.id,
          m: +formTxItem.amount,
        };
      })
      .filter(Boolean) as TxInBlock[]; // nullやundefinedになった要素を除去します

    // validatedTxs が空、または期待した処理ができない状態なら早期リターンも検討
    if (validatedTxs.length === 0 && data.tx.length > 0 && selectedTxs.length > 0) {
        console.error("No valid transactions could be processed due to inconsistencies. Check if selectedTxs become empty unexpectedly.");
        //  状況に応じてユーザーに通知するか、処理を中断する
        return;
    }

    // FIXME: 同期タイミングを考える必要がありそう
    const txKey = await makeTx(currentUser.id, 'reward', currentUser.id);
    if (!txKey?.key) return;
    const systemTx: TxInBlock = {
      i: txKey.key,
      m: 100,
    };
    const systemTxFromDB = await getTx(currentUser.id, txKey.key)
    if (systemTxFromDB) {
      setTxs(prev => concat(prev, [systemTxFromDB]).flatMap(e => e != null ? e : []))
    }
    console.log(validatedTxs)
    console.log(currentUser.id, selectedBlock.id, concat(validatedTxs, [systemTx]), selectedBlock.blockHeight + 1)
    const blockKey = await buildBlock(
      currentUser.id,
      selectedBlock.id,
      concat(validatedTxs, [systemTx]),
      selectedBlock.blockHeight + 1
    );
    console.log(blockKey)
    if (!blockKey?.key) return
    const newBlockFromDB = await getBlock(currentUser.id, blockKey.key)
    if (newBlockFromDB) {
      setChain(prev => concat(prev, [newBlockFromDB]).flatMap(e => e != null ? e : []))
    }

    /**
     * Reset
     */
    setSelectedBlock(null)
    setSelectedTxs([])
    router.push('/')
  }

  return (
    <div className="flex flex-col gap-4">
      {selectedTxs.map((tx, index) => (
        <div key={tx.id}>
          <p>{tx.id}</p>
          <img src={getBucketImage(TX_AMOUNT_BUCKET, tx.id, 'png')} alt="" className="w-[200px]"/>
          <p>
            <span>value: </span>
            <Controller
              name={`tx.${index}.amount`}
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  className="px-2 py-1 border mt-2 rounded"
                  placeholder="100"
                />
              )}
            />
          </p>
        </div>
      ))}
      <button
        type="submit"
        className="mt-10 px-2 py-1 rounded bg-gray-200 w-max"
        onClick={handleSubmit(onSubmit)}
      >Validate</button>
    </div>
  )
}

export default TxsValidateAndBuildBlock
