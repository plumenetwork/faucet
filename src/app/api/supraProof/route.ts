import { createPublicClient, http } from 'viem'
import { plumeTestnet } from 'viem/chains'
import OracleGameAbi from './OracleGameAbi.json'
import PullServiceClient from './SupraClient'

const web3Client = createPublicClient({
  chain: plumeTestnet,
  transport: http()
})
const supraClient = new PullServiceClient();

export async function GET(): Promise<Response> {
  const currentPairIndex = Number(await web3Client.readContract({
    address: process.env.NEXT_PUBLIC_ORACLE_GAME_CONTRACT_ADDRESS as `0x${string}`,
    abi: OracleGameAbi.abi,
    functionName: 'currentPairIndex',
  }) as BigInt);

  const proofPairs = []

  if (currentPairIndex == -1) {
    // Game not started yet
  }

  if (currentPairIndex >= 0) {
    // Adding current active pair if available
    const currentPair = Number(await web3Client.readContract({
      address: process.env.NEXT_PUBLIC_ORACLE_GAME_CONTRACT_ADDRESS as `0x${string}`,
      abi: OracleGameAbi.abi,
      functionName: 'allPairs',
      args: [currentPairIndex]
    }) as BigInt)
    proofPairs.push(currentPair);
  }

  if (currentPairIndex >= 1) {
    // Adding previous active pair if available
    const previousPair = Number(await web3Client.readContract({
      address: process.env.NEXT_PUBLIC_ORACLE_GAME_CONTRACT_ADDRESS as `0x${string}`,
      abi: OracleGameAbi.abi,
      functionName: 'allPairs',
      args: [currentPairIndex - 1]
    }) as BigInt)
    proofPairs.push(previousPair);
  }

  // Getting proof for active pairs from supra
  try {
    const proof = await supraClient.getProof({
      // previous and current active pairs in the oracle game contract
      pairIndexes: proofPairs,
      chainType: 'evm',
    }).then((response: any) => {
      return response.evm;
    })
    return Response.json(proof);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
