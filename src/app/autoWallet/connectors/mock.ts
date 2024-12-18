/*
 * Mock Connector
 * This is a modified version of the mock connector from the Wagmi SDK that allows for custom signMessage functions.
 * https://github.com/wevm/wagmi/blob/main/packages/core/src/connectors/mock.ts
 *
 * Modifications to the original mock connector are denoted by the comment `// ADDED:`
 */

import {
  type Address,
  type EIP1193RequestFn,
  type Hex,
  RpcRequestError,
  SwitchChainError,
  type Transport,
  UserRejectedRequestError,
  type WalletCallReceipt,
  type WalletRpcSchema,
  custom,
  fromHex,
  getAddress,
  keccak256,
  numberToHex,
  stringToHex,
} from 'viem';
import { rpc } from 'viem/utils';
import { ChainNotConfiguredError, createConnector } from 'wagmi';
import { ConnectorNotConnectedError } from '@wagmi/core';

export type MockParameters = {
  accounts: readonly [Address, ...Address[]];
  features?:
    | {
        connectError?: boolean | Error | undefined;
        switchChainError?: boolean | Error | undefined;
        signMessageError?: boolean | Error | undefined;
        signTypedDataError?: boolean | Error | undefined;
        reconnect?: boolean | undefined;
      }
    | undefined;
  // ADDED: Custom signMessage function
  signMessage: (message: string) => Promise<Hex>;
};

mock.type = 'mock' as const;
export function mock(parameters: MockParameters) {
  const transactionCache = new Map<Hex, Hex[]>();
  const features = parameters.features ?? {};
  // ADDED: Custom signMessage function
  const signMessage = parameters.signMessage;

  type Provider = ReturnType<
    Transport<'custom', unknown, EIP1193RequestFn<WalletRpcSchema>>
  >;
  let connected = false;
  let connectedChainId: number;

  return createConnector<Provider>((config) => ({
    id: 'mock',
    name: 'Mock Connector',
    type: mock.type,
    async setup() {
      connectedChainId = config.chains[0].id;
    },
    async connect({ chainId } = {}) {
      if (features.connectError) {
        if (typeof features.connectError === 'boolean')
          throw new UserRejectedRequestError(new Error('Failed to connect.'));
        throw features.connectError;
      }

      const provider = await this.getProvider();
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      let currentChainId = await this.getChainId();
      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain!({ chainId });
        currentChainId = chain.id;
      }

      connected = true;

      return {
        accounts: accounts.map((x) => getAddress(x)),
        chainId: currentChainId,
      };
    },
    async disconnect() {
      connected = false;
    },
    async getAccounts() {
      if (!connected) throw new ConnectorNotConnectedError();
      const provider = await this.getProvider();
      const accounts = await provider.request({ method: 'eth_accounts' });
      return accounts.map((x) => getAddress(x));
    },
    async getChainId() {
      const provider = await this.getProvider();
      const hexChainId = await provider.request({ method: 'eth_chainId' });
      return fromHex(hexChainId, 'number');
    },
    async isAuthorized() {
      if (!features.reconnect) return false;
      if (!connected) return false;
      const accounts = await this.getAccounts();
      return !!accounts.length;
    },
    async switchChain({ chainId }) {
      const provider = await this.getProvider();
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: numberToHex(chainId) }],
      });
      return chain;
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      else
        config.emitter.emit('change', {
          accounts: accounts.map((x) => getAddress(x)),
        });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit('change', { chainId });
    },
    async onDisconnect(_error) {
      config.emitter.emit('disconnect');
      connected = false;
    },
    async getProvider({ chainId } = {}) {
      const chain =
        config.chains.find((x) => x.id === chainId) ?? config.chains[0];
      const url = chain.rpcUrls.default.http[0]!;

      const request: EIP1193RequestFn = async ({ method, params }) => {
        // eth methods
        if (method === 'eth_chainId') return numberToHex(connectedChainId);
        if (method === 'eth_requestAccounts') return parameters.accounts;
        if (method === 'eth_signTypedData_v4')
          if (features.signTypedDataError) {
            if (typeof features.signTypedDataError === 'boolean')
              throw new UserRejectedRequestError(
                new Error('Failed to sign typed data.')
              );
            throw features.signTypedDataError;
          }

        // wallet methods
        if (method === 'wallet_switchEthereumChain') {
          if (features.switchChainError) {
            if (typeof features.switchChainError === 'boolean')
              throw new UserRejectedRequestError(
                new Error('Failed to switch chain.')
              );
            throw features.switchChainError;
          }
          type Params = [{ chainId: Hex }];
          connectedChainId = fromHex((params as Params)[0].chainId, 'number');
          this.onChainChanged(connectedChainId.toString());
          return;
        }

        if (method === 'wallet_getCapabilities')
          return {
            '0x2105': {
              paymasterService: {
                supported:
                  (params as [Hex])[0] ===
                  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
              },
              sessionKeys: {
                supported: true,
              },
            },
            '0x14A34': {
              paymasterService: {
                supported:
                  (params as [Hex])[0] ===
                  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
              },
            },
          };

        if (method === 'wallet_sendCalls') {
          const hashes = [];
          const calls = (params as any)[0].calls;
          for (const call of calls) {
            const { result, error } = await rpc.http(url, {
              body: {
                method: 'eth_sendTransaction',
                params: [call],
              },
            });
            if (error)
              throw new RpcRequestError({
                body: { method, params },
                error,
                url,
              });
            hashes.push(result);
          }
          const id = keccak256(stringToHex(JSON.stringify(calls)));
          transactionCache.set(id, hashes);
          return id;
        }

        if (method === 'wallet_getCallsStatus') {
          const hashes = transactionCache.get((params as any)[0]);
          if (!hashes) return null;
          const receipts = await Promise.all(
            hashes.map(async (hash) => {
              const { result, error } = await rpc.http(url, {
                body: {
                  method: 'eth_getTransactionReceipt',
                  params: [hash],
                  id: 0,
                },
              });
              if (error)
                throw new RpcRequestError({
                  body: { method, params },
                  error,
                  url,
                });
              if (!result) return null;
              return {
                blockHash: result.blockHash,
                blockNumber: result.blockNumber,
                gasUsed: result.gasUsed,
                logs: result.logs,
                status: result.status,
                transactionHash: result.transactionHash,
              } satisfies WalletCallReceipt;
            })
          );
          if (receipts.some((x) => !x))
            return { status: 'PENDING', receipts: [] };
          return { status: 'CONFIRMED', receipts };
        }

        if (method === 'wallet_showCallsStatus') return;

        // other methods
        if (method === 'personal_sign') {
          if (features.signMessageError) {
            if (typeof features.signMessageError === 'boolean')
              throw new UserRejectedRequestError(
                new Error('Failed to sign message.')
              );
            throw features.signMessageError;
          }
          // Change `personal_sign` to `eth_sign` and swap params
          method = 'eth_sign';
          type Params = [data: Hex, address: Address];
          params = [(params as Params)[1], (params as Params)[0]];

          // ADDED: Check if signMessage function is provided
          if (signMessage) {
            // ADDED: Sign the message with the given sign message function
            const hexMessage = (params as Params)[1];
            const message = Buffer.from(hexMessage.slice(2), 'hex').toString(
              'utf8'
            );
            return await signMessage(message);
          }
        }

        const body = { method, params };
        const { error, result } = await rpc.http(url, { body });
        if (error) throw new RpcRequestError({ body, error, url });

        return result;
      };
      return custom({ request })({ retryCount: 0 });
    },
  }));
}
