
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.5/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const ContractName = "will";
const AssetName = "digital-will";

Clarinet.test({
    name: "Ensure that minting is working!",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const donor = accounts.get("deployer")!;
        const beneficiary = accounts.get("wallet_1")!;
        const amount = 100;
        const unlockYears = 1;
        const advanceBlockHeight = 11;

        chain.mineEmptyBlockUntil(advanceBlockHeight);

        let block = chain.mineBlock([
           
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "mint", [types.principal(beneficiary.address), types.uint(unlockYears), types.uint(amount) , types.ascii("propery-deed.jpeg")], donor.address)
          
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, advanceBlockHeight + 1);
        
        block.receipts[0].result.expectOk()
        .expectUint(1)

        // (Identifier, Owner/Reciever, Contract Address, Asset Name)
        block.receipts[0].events.expectNonFungibleTokenMintEvent(types.uint(1), beneficiary.address, 
        `${donor.address}.${ContractName}`, AssetName)

        block.receipts[0].events.expectSTXTransferEvent(
            amount,
            donor.address,
            `${donor.address}.${ContractName}`,
          );

    },
});

Clarinet.test({
    name: "Ensure that owner is correct!",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const donor = accounts.get("deployer")!;
        const beneficiary = accounts.get("wallet_1")!;
        const amount = 100;
        const unlockYears = 1;
        const advanceBlockHeight = 11;

        chain.mineEmptyBlockUntil(advanceBlockHeight);

        let block = chain.mineBlock([
           
           // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "mint", [types.principal(beneficiary.address), types.uint(unlockYears), types.uint(amount) , types.ascii("propery-deed.jpeg")], donor.address),
           Tx.contractCall(ContractName, "get-owner", [types.uint(1)], donor.address)
          
        ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, advanceBlockHeight + 1);
        
        block.receipts[0].result.expectOk()
        .expectUint(1)

       // (Identifier, Owner/Reciever, Contract Address, Asset Name)
       block.receipts[0].events.expectNonFungibleTokenMintEvent(types.uint(1), beneficiary.address, 
       `${donor.address}.${ContractName}`, AssetName)

       block.receipts[0].events.expectSTXTransferEvent(
           amount,
           donor.address,
           `${donor.address}.${ContractName}`,
         );

        const owner = block.receipts[1].result.expectSome()

        assertEquals(owner, beneficiary.address)
        
    },
});

Clarinet.test({
    name: "Ensure that only owner can transfer!",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const donor = accounts.get("deployer")!;
        const beneficiary = accounts.get("wallet_1")!;
        const agent = accounts.get("wallet_2")!;
        const amount = 100;
        const unlockYears = 1;
        const advanceBlockHeight = 11;

        chain.mineEmptyBlockUntil(advanceBlockHeight);

        let block = chain.mineBlock([
           
           // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "mint", [types.principal(beneficiary.address), types.uint(unlockYears), types.uint(amount) , types.ascii("propery-deed.jpeg")], donor.address),
           Tx.contractCall(ContractName, "transfer", [types.uint(1), types.principal(beneficiary.address), types.principal(agent.address)], donor.address),
          
        ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, advanceBlockHeight + 1);
        
        block.receipts[0].result.expectOk()
        .expectUint(1)

        // (Identifier, Owner/Reciever, Contract Address, Asset Name)
       block.receipts[0].events.expectNonFungibleTokenMintEvent(types.uint(1), beneficiary.address, 
       `${donor.address}.${ContractName}`, AssetName)

       block.receipts[0].events.expectSTXTransferEvent(
           amount,
           donor.address,
           `${donor.address}.${ContractName}`,
         );
        
        // Expect ERR_NOT_OWNER (u999) Error
        block.receipts[1].result.expectErr()
        .expectUint(999)
        
    },
});

Clarinet.test({
    name: "Ensure that transfer is working properly!",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const donor = accounts.get("deployer")!;
        const agent = accounts.get("wallet_1")!;
        const beneficiary = accounts.get("wallet_2")!;
        const amount = 100;
        const unlockYears = 1;
        const advanceBlockHeight = 11;

        chain.mineEmptyBlockUntil(advanceBlockHeight);


        let block = chain.mineBlock([
           
           // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "mint", [types.principal(agent.address), types.uint(unlockYears), types.uint(amount) , types.ascii("propery-deed.jpeg")], donor.address),
           Tx.contractCall(ContractName, "transfer", [types.uint(1), types.principal(agent.address), types.principal(beneficiary.address)], agent.address),
           Tx.contractCall(ContractName, "get-owner", [types.uint(1)], beneficiary.address)
          
        ]);

        assertEquals(block.receipts.length, 3);
        assertEquals(block.height, advanceBlockHeight + 1);
        
        block.receipts[0].result.expectOk()
        .expectUint(1)

        // (Identifier, Owner/Reciever, Contract Address, Asset Name)
       block.receipts[0].events.expectNonFungibleTokenMintEvent(types.uint(1), agent.address, 
       `${donor.address}.${ContractName}`, AssetName)

       block.receipts[0].events.expectSTXTransferEvent(
           amount,
           donor.address,
           `${donor.address}.${ContractName}`,
         );

        block.receipts[1].events.expectNonFungibleTokenTransferEvent(
            types.uint(1),
            agent.address, 
            beneficiary.address,
            `${donor.address}.${ContractName}`,
            AssetName
        )

        const owner = block.receipts[2].result.expectSome()

        assertEquals(owner, beneficiary.address)
        
    },
});
