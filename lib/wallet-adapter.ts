// This file provides wallet adapter functionality for the application
import type { Keypair } from "@solana/web3.js"

// Define a Wallet interface that matches what our application needs
export interface Wallet {
  publicKey: Keypair["publicKey"]
  signTransaction: Keypair["signTransaction"]
  signAllTransactions: Keypair["signAllTransactions"]
}

// Create a KeypairWallet class that implements the Wallet interface
export class KeypairWallet implements Wallet {
  constructor(private keypair: Keypair) {}

  get publicKey() {
    return this.keypair.publicKey
  }

  async signTransaction(tx: any) {
    tx.partialSign(this.keypair)
    return tx
  }

  async signAllTransactions(txs: any[]) {
    return txs.map((tx) => {
      tx.partialSign(this.keypair)
      return tx
    })
  }
}
