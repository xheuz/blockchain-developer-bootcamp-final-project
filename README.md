# Onyx Trust

_Create a Trust or Will that enable to transfer your digital assets to your love ones once you are gone._

## Description
### Introduction

Traditionally we have a way to create a Trust or Will via an Executor for tangible and financial (fiat) assets but not for digital assets. The Executor is responsible for making sure that the wishes are carried out dutifully. Executors are commonly attorneys or trusted family members. There is a long process for beneficiaries to access or claim an inheritance: asset inventory, asset valuation, bill pay, tax and returns, distribution and only after going through all those long and painful steps the inheritance can finally be released. Also depending on where you live you can have different processes or rules to claim your inheritance.

This project aims to provide a dapp that works as a Trust or Will. Basically allows anybody to protect their digital assets in a simple and homogeneous manner. Those digital assets then will only be accessible to beneficiaries added by the owner of the Trust or Will. In order to inherit those assets the owner should be already dead or he is unable to manage them for any reason. This is a way to secure that your assets will be distributed to those you really love. This is a very fast way for inheritance as well solves the issue of having to pay crazy amounts of money to third parties and trusting them to deliver everything as planned.

### What is this project about?

A decentralized Trust or Will application.

### Why building this project?

Currently we lack options to leave our digital assets to our loves ones. Decentralization enables a use case for creating a way to actually transfer ownership of your digital assets without third parties involved in the process and in a secure way.

### How will this project work?

The project will have 3 roles:
- The Owner: the person who creates and administrate the Trust or Will.
- The Beneficiary: the person who receives the assets.
- The Executor: the person who will work as arbitrage to release funds to beneficiaries. It will only be necessary when is a multi-beneficiary case and it does not receive any amount of assets.

A sample of workflow for a single beneficiary trust:

1. First the Owner needs to connect with its wallet to create a Trust or Will by filling in all required information like time that should pass to release the assets.
1. Then the Owner will be able to add a beneficiary.
1. After that the Owner needs to add the assets (ERC-20 or ERC-721 tokens only).
1. The Owner needs to keep doing a checking within the amount of time selected at the time of creating the Trust or Will.
1. If the Owner dies or it's unable to access the assets then the beneficiary can connect with it's wallet and request the assets to be transfer.
1. This change the Trust state to RELEASE and it will check against the check in status.
1. The Trust will emit an event to the Owner to notify about the Trust state change.
1. If the Owner didn't check in within the time range the assets will be released to the beneficiary.
1. If the Owner do a check in within the time range established then the Trust state will revert to HOLD and the request from the beneficiary will be invalid.

#### Case 1: Single Beneficiary Trust:

##### As an Owner, I can:

1. Connect with my wallet.
1. Create a Trust or Will.
1. Add assets ERC-20 tokens or ERC-721 tokens.
1. Add a beneficiary.
1. Configure a release period of time.
1. Keep adding assets to the Trust or Will.
1. Invalidate a false health condition notification.
1. Receive a notification when assets are released.
1. Destroy the Trust or Will and all assets should be transfer back to me.

##### As a Beneficiary, I can:

1. Connect with my wallet.
1. Send a notification about the health condition of the Owner.
1. Receive a notification when assets are released.

#### Case 2: Multi-Beneficiary Trust (TBD):

##### As an Owner, I can:

1. Do all things as in the Single Beneficiary Case.
1. Configure minimum health condition notification required.
1. Add as many beneficiaries as desire.
1. Select how the assets will be distributed among the beneficiaries.

##### As a Beneficiary, I can (TBD):

1. Do all things as in the Single Beneficiary Case.

##### As an Executor, I can (TBD):


<!-- Walk through a single workflow for the future user of your project. Once you have a general idea of what you'd like to do, isolate some of the actions a user will take. Write -->

<!-- By default everything should be distributed equally among beneficiaries. He can optionally place a weight for the split the asset in the case the asset is an ERC-20 compatible token.

Then him needs to add beneficiaries that will inherit the assets.
He can also provide an specific asset to belongs to an specific beneficiary whenever the asset is ERC-20 or ERC-721. -->

<!-- Pseudocode is a great tool for this exercise When thinking through the actions your future users will take, it can help to write out the steps in plain language!  -->

<!-- ## Structure -->

<!-- describes the directory structure -->

<!-- ## Frontend -->

<!-- and where the frontend project can be accessed -->

<!-- And has your public Ethereum address if you'd like your certification as an NFT (optional)? YES/NO -->
<!-- `<public Ethereum address>` -->

