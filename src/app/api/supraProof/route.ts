import PullServiceClient from './SupraClient'

const supraClient = new PullServiceClient();
export async function GET(): Promise<Response> {
  const proof = await supraClient.getProof({
    // previous and current active pairs in the oracle game contract
    pairIndexes: [9, 10],
    chainType: 'evm',
  }).then((response: any) => {
    return response.evm;
  });

  return Response.json(proof);
}
