// React and Semantic UI 元素。
import React, { useState, useEffect,useCallback } from 'react';
import { Form, Input, Grid, Message } from 'semantic-ui-react';
// 预设的 Substrate front-end 工具，用于连接节点
// 和执行交易。
import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';
// Polkadot-JS 工具，用作对数据进行 hash 计算 。
import { blake2AsHex } from '@polkadot/util-crypto';



function useInput(initValue) {
    const [value, setValue] = useState(initValue)
    const onChange = useCallback(value => 
        {
            console.log(value.target.value);
            setValue(value.target.value)
        },[]);
    return {
        value,
        onChange
    }
}

// 导出存证的主要组件。
export function Main (props) {
  // 建立一个与 Substrate 节点通讯的 API。
  const { api } = useSubstrate();
  // 从 `AccountSelector` 组件中获取选定的用户。
  const { accountPair } = props;
  const fileProof = useInput('');
  const toAddress = useInput('');

  const [status, setStatus] = useState('');
  // 使用 React hook 来更新文件中的 owner 和  block number 信息。
//   useEffect(() => {
//     let unsubscribe;

//     // 使用 Polkadot-JS API 来查询 pallet 中  `proofs` 的存储信息。
//     // 这是一个订阅，它将总是获得最新的值，
//     // 即便它发生了改变。
//     api.query.templateModule
//       .proofs(fileProof.value, (result) => {
//         // 我们的存储项将返回一个元组，以一个数组来代表。
//         // setOwner(result[0].toString());
//         // setBlock(result[1].toString());
//       })
//       .then((unsub) => {
//         unsubscribe = unsub;
//       });

//     return () => unsubscribe && unsubscribe();
//     // 用来告诉 React hook 在文件的摘要发生更改
//     // (当新文件被选择时)，或当存储订阅表示存储项的值已更新时，
//     // 执行页面更新操作。
//   }, [fileProof.value, api.query.templateModule]);

  // 若储存文件摘要的区块值不为零，我们则称该文件摘要已被声明。
  function isClaimed () {
    return block !== 0;
  }

  // 从组件中返回实际的 UI 元素。
  return (
    <Grid.Column>
      <h1>Proof 转移</h1>
      {/* 当文件被声明或失败时，显示警告或成功的消息。 */}
      <Form >


      <Form.Field>
          <Input
            fluid
            label='Claim'
            type='text'
            placeholder='file claim'
            {...fileProof}
          />
        </Form.Field>

      <Form.Field>
          <Input
            fluid
            label='To'
            type='text'
            placeholder='address'
            {...toAddress}
          />
        </Form.Field>
        {toAddress.value}, {fileProof.value}, 
        {/* 与组件交互的 Buttons。 */}
        <Form.Field>
          {/* 用于创建声明的 Button。 只有在文件被选择且所选文件未被声明时，
          可用。 更新 `status`。 */}
          <TxButton
            accountPair={accountPair}
            label={'Transfer Claim'}
            setStatus={setStatus}
            type='SIGNED-TX'
            attrs={{
              palletRpc: 'templateModule',
              callable: 'transferClaim',
              inputParams: [fileProof.value, toAddress.value],
              paramFields: [true, true]
            }}
          />
        </Form.Field>
        {/* 交易的状态信息。 */}
        {/* <div style={{ overflowWrap: 'break-word' }}>{status}</div> */}
      </Form>
    </Grid.Column>
  );
}

export default function TemplateModule (props) {
  const { api } = useSubstrate();
  return (api.query.templateModule && api.query.templateModule.proofs
    ? <Main {...props} /> : null);
}