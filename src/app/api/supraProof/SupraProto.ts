export default {
    "nested": {
        "pull_service": {
            "nested": {
                "PullResponse": {
                    "oneofs": {"resp": {"oneof": ["evm", "sui", "aptos"]}},
                    "fields": {
                        "evm": {"type": "PullResponseEvm", "id": 1},
                        "sui": {"type": "PullResponseSui", "id": 2},
                        "aptos": {"type": "PullResponseAptos", "id": 3}
                    }
                },
                "PullService": {
                    "methods": {
                        "GetProof": {
                            "requestType": "PullRequest",
                            "responseType": "PullResponse"
                        }
                    }
                },
                "PullRequest": {
                    "fields": {
                        "pairIndexes": {"rule": "repeated", "type": "uint32", "id": 1},
                        "chainType": {"type": "string", "id": 2}
                    }
                },
                "PullResponseEvm": {
                    "fields": {
                        "pairIndexes": {"rule": "repeated", "type": "uint32", "id": 1},
                        "proofBytes": {"type": "bytes", "id": 2}
                    }
                },
                "PullResponseSui": {
                    "fields": {
                        "pairIndexes": {"rule": "repeated", "type": "uint32", "id": 1},
                        "dkgObject": {"type": "string", "id": 2},
                        "oracleHolderObject": {"type": "string", "id": 3},
                        "voteSmrBlockRound": {"type": "bytes", "id": 5},
                        "voteSmrBlockTimestamp": {"type": "bytes", "id": 6},
                        "voteSmrBlockAuthor": {"type": "bytes", "id": 7},
                        "voteSmrBlockQcHash": {"type": "bytes", "id": 8},
                        "voteSmrBlockBatchHashes": {"type": "bytes", "id": 9},
                        "voteRound": {"type": "bytes", "id": 10},
                        "minBatchProtocol": {"type": "bytes", "id": 11},
                        "minBatchTxnHashes": {"type": "bytes", "id": 12},
                        "minTxnClusterHashes": {"type": "bytes", "id": 13},
                        "minTxnSender": {"type": "bytes", "id": 14},
                        "minTxnProtocol": {"type": "bytes", "id": 15},
                        "minTxnTxSubType": {"type": "bytes", "id": 16},
                        "sccDataHash": {"type": "bytes", "id": 17},
                        "sccPair": {"type": "bytes", "id": 18},
                        "sccPrices": {"type": "bytes", "id": 19},
                        "sccTimestamp": {"type": "bytes", "id": 20},
                        "sccDecimals": {"type": "bytes", "id": 21},
                        "sccQc": {"type": "bytes", "id": 22},
                        "sccRound": {"type": "bytes", "id": 23},
                        "sccId": {"type": "bytes", "id": 24},
                        "sccMemberIndex": {"type": "bytes", "id": 25},
                        "sccCommitteeIndex": {"type": "bytes", "id": 26},
                        "batchIdx": {"type": "bytes", "id": 27},
                        "txnIdx": {"type": "bytes", "id": 28},
                        "clusterIdx": {"type": "bytes", "id": 29},
                        "sig": {"type": "bytes", "id": 30},
                        "pairMask": {"type": "bytes", "id": 31}
                    }
                },
                "PullResponseAptos": {
                    "fields": {
                        "pairIndexes": {"rule": "repeated", "type": "uint32", "id": 1},
                        "dkgObject": {"type": "string", "id": 2},
                        "oracleHolderObject": {"type": "string", "id": 3},
                        "voteSmrBlockRound": {"type": "bytes", "id": 5},
                        "voteSmrBlockTimestamp": {"type": "bytes", "id": 6},
                        "voteSmrBlockAuthor": {"type": "bytes", "id": 7},
                        "voteSmrBlockQcHash": {"type": "bytes", "id": 8},
                        "voteSmrBlockBatchHashes": {"type": "bytes", "id": 9},
                        "voteRound": {"type": "bytes", "id": 10},
                        "minBatchProtocol": {"type": "bytes", "id": 11},
                        "minBatchTxnHashes": {"type": "bytes", "id": 12},
                        "minTxnClusterHashes": {"type": "bytes", "id": 13},
                        "minTxnSender": {"type": "bytes", "id": 14},
                        "minTxnProtocol": {"type": "bytes", "id": 15},
                        "minTxnTxSubType": {"type": "bytes", "id": 16},
                        "sccDataHash": {"type": "bytes", "id": 17},
                        "sccPair": {"type": "bytes", "id": 18},
                        "sccPrices": {"type": "bytes", "id": 19},
                        "sccTimestamp": {"type": "bytes", "id": 20},
                        "sccDecimals": {"type": "bytes", "id": 21},
                        "sccQc": {"type": "bytes", "id": 22},
                        "sccRound": {"type": "bytes", "id": 23},
                        "sccId": {"type": "bytes", "id": 24},
                        "sccMemberIndex": {"type": "bytes", "id": 25},
                        "sccCommitteeIndex": {"type": "bytes", "id": 26},
                        "batchIdx": {"type": "bytes", "id": 27},
                        "txnIdx": {"type": "bytes", "id": 28},
                        "clusterIdx": {"type": "bytes", "id": 29},
                        "sig": {"type": "bytes", "id": 30},
                        "pairMask": {"type": "bytes", "id": 31}
                    }
                }
            }
        }
    }
}
