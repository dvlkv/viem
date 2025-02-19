import type { Abi, AbiEvent, ExtractAbiEvent } from 'abitype'

import type { PublicClient } from '../../clients/createPublicClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import {
  DecodeLogDataMismatch,
  DecodeLogTopicsMismatch,
} from '../../errors/abi.js'
import type { Chain } from '../../types/chain.js'
import type { Filter } from '../../types/filter.js'
import type { Log } from '../../types/log.js'
import { decodeEventLog } from '../../utils/abi/decodeEventLog.js'
import { formatLog } from '../../utils/formatters/log.js'

export type GetFilterLogsParameters<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string | undefined = string,
  TStrict extends boolean | undefined = undefined,
> = {
  filter: Filter<'event', TAbi, TEventName, any, TStrict>
}
export type GetFilterLogsReturnType<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string | undefined = string,
  TStrict extends boolean | undefined = undefined,
  _AbiEvent extends AbiEvent | undefined = TAbi extends Abi
    ? TEventName extends string
      ? ExtractAbiEvent<TAbi, TEventName>
      : undefined
    : undefined,
> = Log<bigint, number, _AbiEvent, TStrict, TAbi, TEventName>[]

/**
 * Returns a list of event logs since the filter was created.
 *
 * - Docs: https://viem.sh/docs/actions/public/getFilterLogs.html
 * - JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)
 *
 * `getFilterLogs` is only compatible with **event filters**.
 *
 * @param client - Client to use
 * @param parameters - {@link GetFilterLogsParameters}
 * @returns A list of event logs. {@link GetFilterLogsReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbiItem } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEventFilter, getFilterLogs } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createEventFilter(client, {
 *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
 * })
 * const logs = await getFilterLogs(client, { filter })
 */
export async function getFilterLogs<
  TChain extends Chain | undefined,
  TAbi extends Abi | readonly unknown[],
  TEventName extends string | undefined,
  TStrict extends boolean | undefined = undefined,
>(
  _client: PublicClient<Transport, TChain>,
  { filter }: GetFilterLogsParameters<TAbi, TEventName, TStrict>,
): Promise<GetFilterLogsReturnType<TAbi, TEventName, TStrict>> {
  const strict = filter.strict ?? false

  const logs = await filter.request({
    method: 'eth_getFilterLogs',
    params: [filter.id],
  })
  return logs
    .map((log) => {
      try {
        const { eventName, args } =
          'abi' in filter && filter.abi
            ? decodeEventLog({
                abi: filter.abi,
                data: log.data,
                topics: log.topics as any,
                strict,
              })
            : { eventName: undefined, args: undefined }
        return formatLog(log, { args, eventName })
      } catch (err) {
        let eventName
        let isUnnamed
        if (
          err instanceof DecodeLogDataMismatch ||
          err instanceof DecodeLogTopicsMismatch
        ) {
          // If strict mode is on, and log data/topics do not match event definition, skip.
          if ('strict' in filter && filter.strict) return
          eventName = err.abiItem.name
          isUnnamed = err.abiItem.inputs?.some((x) => !('name' in x && x.name))
        }

        // Set args to empty if there is an error decoding (e.g. indexed/non-indexed params mismatch).
        return formatLog(log, { args: isUnnamed ? [] : {}, eventName })
      }
    })
    .filter(Boolean) as unknown as GetFilterLogsReturnType<
    TAbi,
    TEventName,
    TStrict
  >
}
