const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        // creating new hash based on above information
        this.hash = '';
        // 'random' value for hash insertion
        this.nonce = 0;
    }

    // take properties of block
    // run thru hash method encapsulator
    // provide new hash post-transaction
    calculateHash(){
        return SHA256( this.index +
                       this.previousHash +
                       this.timestamp +
                       JSON.stringify( this.data ) + 
                       this.nonce ).toString();
    }

    // incorporate proof-of-work for all preceding hashes
    mineBlock(difficulty){
        // first 'difficulty' chars of hash are all 0s
        // difficulty scales to increase PoW effort as processing speeds up
        while( this.hash.substring( 0, difficulty ) !== Array( difficulty + 1 ).join("0") ){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log( 'Block mined: ' + this.hash );
    }
}

// first block on a chain is known as "genesis block"
// it should be made manually

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2022", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        // normally, much more security is needed to push a new block to the chain
        // but for this experiment it is not necessary.  worth exploring in future
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            // check if current hash is valid
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            
            // check if previous hash is valid
            if(currentBlock.previousHash !== previousBlock.hash){
                return false
            }

            return true;
        }
    }
}


let myCoin = new Blockchain();

console.log('Mining Block 1...');
myCoin.addBlock(new Block(1, "1/18/2022", { amount: 4 }));
console.log('Mining Block 2...');
myCoin.addBlock(new Block(1, "1/19/2022", { amount: 10 }));


//console.log('Is blockchain valid? ' + myCoin.isChainValid())
//console.log(JSON.stringify(myCoin, null, 4));