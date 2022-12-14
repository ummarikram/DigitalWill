
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.5/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const ContractName = "will";
const AssetName = "digital-will";

Clarinet.test({
    name: "Ensure that claiming is working!",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const donor = accounts.get("deployer")!;
        const beneficiary = accounts.get("wallet_1")!;
        const amount = 100;
        const unlockHours = 1;
        const advanceBlockHeight = 11;

        chain.mineEmptyBlockUntil(advanceBlockHeight);

        let block = chain.mineBlock([
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "mint", [types.principal(beneficiary.address), types.uint(unlockHours), types.uint(amount) , types.buff("propery-deed.jpeg")], donor.address)
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

        chain.mineEmptyBlockUntil(100);

        let futureBlock = chain.mineBlock([
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "claim", [types.uint(1)], beneficiary.address)
        ]);

        futureBlock.receipts[0].result.expectOk()
        .expectBool(true)

        futureBlock.receipts[0].events.expectSTXTransferEvent(
            amount,
            `${donor.address}.${ContractName}`,
            beneficiary.address
          );

    },
});

Clarinet.test({
    name: "Ensure that beneficiary cannot claim twice!",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const donor = accounts.get("deployer")!;
        const beneficiary = accounts.get("wallet_1")!;
        const amount = 100;
        const unlockHours = 1;
        const advanceBlockHeight = 11;

        chain.mineEmptyBlockUntil(advanceBlockHeight);

        let block = chain.mineBlock([
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "mint", [types.principal(beneficiary.address), types.uint(unlockHours), types.uint(amount) , types.buff("propery-deed.jpeg")], donor.address)
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

        chain.mineEmptyBlockUntil(100);

        let futureBlock = chain.mineBlock([
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "claim", [types.uint(1)], beneficiary.address),
           Tx.contractCall(ContractName, "claim", [types.uint(1)], beneficiary.address)
        ]);

        futureBlock.receipts[0].result.expectOk()
        .expectBool(true)

        futureBlock.receipts[0].events.expectSTXTransferEvent(
            amount,
            `${donor.address}.${ContractName}`,
            beneficiary.address
          );

          futureBlock.receipts[1].result.expectErr()
        .expectUint(994)

    },
});

Clarinet.test({
    name: "Ensure that only beneficiary can claim!",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const donor = accounts.get("deployer")!;
        const beneficiary = accounts.get("wallet_1")!;
        const hacker = accounts.get("wallet_2")!;
        const amount = 100;
        const unlockHours = 1;
        const advanceBlockHeight = 11;

        chain.mineEmptyBlockUntil(advanceBlockHeight);

        let block = chain.mineBlock([
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "mint", [types.principal(beneficiary.address), types.uint(unlockHours), types.uint(amount) , types.buff("propery-deed.jpeg")], donor.address)
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

        chain.mineEmptyBlockUntil(100);

        let futureBlock = chain.mineBlock([
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "claim", [types.uint(1)], hacker.address)
        ]);

        futureBlock.receipts[0].result.expectErr()
        .expectUint(999)

    },
});

Clarinet.test({
    name: "Ensure that claiming before time fails!",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const donor = accounts.get("deployer")!;
        const beneficiary = accounts.get("wallet_1")!;
        const amount = 100;
        const unlockHours = 10;
        const advanceBlockHeight = 11;

        chain.mineEmptyBlockUntil(advanceBlockHeight);

        let block = chain.mineBlock([
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "mint", [types.principal(beneficiary.address), types.uint(unlockHours), types.uint(amount) , types.buff("propery-deed.jpeg")], donor.address)
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

        chain.mineEmptyBlockUntil(15);

        let futureBlock = chain.mineBlock([
            // (Contract Name, Function Name, Parameters[], Sender Address)
           Tx.contractCall(ContractName, "claim", [types.uint(1)], beneficiary.address)
        ]);

        futureBlock.receipts[0].result.expectErr()
        .expectUint(996)

    },
});

