import { expect, test } from 'vitest'

import { getFunctionSelector } from './getFunctionSelector.js'

test('creates function signature', () => {
  expect(getFunctionSelector('_compound(uint256,uint256,uint256)')).toEqual(
    '0xf4fbb312',
  )
  expect(
    getFunctionSelector('function _compound(uint256 a, uint256 b, uint256 c)'),
  ).toEqual('0xf4fbb312')
  expect(getFunctionSelector('function ownerOf(uint256 tokenId)')).toEqual(
    '0x6352211e',
  )
  expect(getFunctionSelector('ownerOf(uint256)')).toEqual('0x6352211e')
  expect(
    getFunctionSelector('processInvestment(address,uint256,bool)'),
  ).toEqual('0xcf4b8f61')
  expect(getFunctionSelector('processAccount(uint256 , address )')).toEqual(
    '0x73933128',
  )
  expect(getFunctionSelector('claimed()')).toEqual('0xe834a834')
  expect(getFunctionSelector('function claimed()')).toEqual('0xe834a834')
})

test('creates function signature from `AbiFunction`', () => {
  expect(
    getFunctionSelector({
      name: '_compound',
      type: 'function',
      inputs: [
        { name: 'a', type: 'uint256' },
        { name: 'b', type: 'uint256' },
        { name: 'c', type: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    }),
  ).toEqual('0xf4fbb312')

  expect(
    getFunctionSelector({
      name: '_compound',
      type: 'function',
      inputs: [
        { name: 'a', type: 'uint256' },
        { name: 'b', type: 'uint256' },
        { name: 'c', type: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    }),
  ).toEqual('0xf4fbb312')

  expect(
    getFunctionSelector({
      name: 'ownerOf',
      type: 'function',
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      outputs: [],
      stateMutability: 'view',
    }),
  ).toEqual('0x6352211e')

  expect(
    getFunctionSelector({
      name: 'ownerOf',
      type: 'function',
      inputs: [{ name: '', type: 'uint256' }],
      outputs: [],
      stateMutability: 'view',
    }),
  ).toEqual('0x6352211e')

  expect(
    getFunctionSelector({
      name: 'processInvestment',
      type: 'function',
      inputs: [
        { name: '', type: 'address' },
        { name: '', type: 'uint256' },
        { name: '', type: 'bool' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    }),
  ).toEqual('0xcf4b8f61')

  expect(
    getFunctionSelector({
      name: 'processAccount',
      type: 'function',
      inputs: [
        { name: '', type: 'uint256' },
        { name: '', type: 'address' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    }),
  ).toEqual('0x73933128')

  expect(
    getFunctionSelector({
      name: 'claimed',
      type: 'function',
      inputs: [],
      outputs: [],
      stateMutability: 'view',
    }),
  ).toEqual('0xe834a834')

  expect(
    getFunctionSelector({
      name: 'claimed',
      type: 'function',
      inputs: [],
      outputs: [],
      stateMutability: 'view',
    }),
  ).toEqual('0xe834a834')

  expect(
    getFunctionSelector({
      inputs: [
        {
          internalType: 'uint256',
          name: 'card',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'uint256',
              name: 'Onetime',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'Daily',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'Monthly',
              type: 'uint256',
            },
            {
              internalType: 'uint32',
              name: 'Seqno',
              type: 'uint32',
            },
            {
              internalType: 'bool',
              name: 'Enabled',
              type: 'bool',
            },
          ],
          internalType: 'struct WhalesCardV1.PendingLimits',
          name: 'limits',
          type: 'tuple',
        },
      ],
      name: 'setLimits',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    }),
  ).toEqual('0xbc75a138')
})
