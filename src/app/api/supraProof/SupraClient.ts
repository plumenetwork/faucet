import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import SupraProto from "@/app/api/supraProof/SupraProto";

class PullServiceClient {
    private client: any;
    constructor() {
        const packageDefinition = protoLoader.fromJSON(SupraProto as any, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });

        const pullProto: any = grpc.loadPackageDefinition(packageDefinition).pull_service;
        this.client = new pullProto.PullService('testnet-dora.supraoracles.com', grpc.credentials.createSsl());
    }

    getProof(request: any) {
        return new Promise((resolve, reject) => {
            this.client.getProof(request, (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

export default PullServiceClient;