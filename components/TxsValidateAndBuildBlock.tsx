'use client'

import {useAtom, useSetAtom} from 'jotai'
import {selectedTxsState} from '@/stores/transactions'
import {getBucketImage} from '@/utils/getBucketImage'
import {TX_AMOUNT_BUCKET} from '@/lib/firebase'
import {Controller, useForm} from 'react-hook-form'
import {TxInBlock} from '@/models/block'
import {useRouter} from 'next/navigation'
import {chainState, selectedBlockState} from '@/stores/chain'
import {buildBlock} from '@/api/block'
import {currentUserState} from '@/stores/users'
import {makeTx} from '@/api/transaction'
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
  const router = useRouter()
  const onSubmit = async (data: FormValues) => {
    if (!currentUser) return
    if (!selectedBlock) return
    const validatedTxs: TxInBlock[] = data.tx.map((t, index) => ({
      i: selectedTxs[index].id,
      m: +t.amount
    }))
    const txKey = await makeTx(currentUser.id, 'reward', currentUser.id)
    console.log(txKey, !txKey?.key)
    if (!txKey?.key) return
    const systemTx: TxInBlock = {
      i: txKey.key,
      m: 100,
    }
    console.log(validatedTxs)
    console.log(currentUser.id, selectedBlock.id, concat(validatedTxs, [systemTx]), selectedBlock.blockHeight + 1)
    const blockKey = await buildBlock(currentUser.id, selectedBlock.id, concat(validatedTxs, [systemTx]), selectedBlock.blockHeight + 1)
    console.log(blockKey)

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
