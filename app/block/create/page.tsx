'use client'

import { useEffect, useRef, useState } from 'react'
import {useAtomValue, useSetAtom} from 'jotai'
import { currentUserState } from '@/stores/users'
import * as fabric from 'fabric'
import { Eraser, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { storage } from '@/lib/firebase'
import { ref, uploadString } from 'firebase/storage'
import {getTxs, makeTx} from '@/api/transaction'
import {txsState} from '@/stores/transactions'

const BlockCreatePage = () => {

  /**
   * どのブロックに繋げるか選ぶ
   * どのTxを入れるか選ぶ→一覧からクリックで選択？
   * → 数値を入れる（Txを完成）
   * 報酬Txは自動的に入る
   * ブロックを追加する
   */

  return (
    <div className="w-full h-screen text-black">
      <div className="w-4/5 p-4 border-2 flex flex-col text-sm mx-auto mt-20">

      </div>
      <p className="text-center mt-10"><Link href={`/`}>HOME</Link></p>
    </div>
  )
}

export default BlockCreatePage
