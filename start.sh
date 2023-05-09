#!/bin/bash

export FABRIC_CFG_PATH=${PWD}/config

. ./utils.sh
printSeparator "Generate crypto-material for Hospital"
cryptogen generate --config=./crypto-input/crypto-config-hospital.yaml --output="crypto-material"
printSeparator "Generate crypto-material for Chemist"
cryptogen generate --config=./crypto-input/crypto-config-chemist.yaml --output="crypto-material"
printSeparator "Generate crypto-material for Insurance"
cryptogen generate --config=./crypto-input/crypto-config-insurance.yaml --output="crypto-material"
printSeparator "Generate crypto-material for Pathology"
cryptogen generate --config=./crypto-input/crypto-config-pathology.yaml --output="crypto-material"
printSeparator "Generate crypto-material for Orderer"
cryptogen generate --config=./crypto-input/crypto-config-orderer.yaml --output="crypto-material"
printSeparator "Create Genesis-Block"
configtxgen -profile PcaNetworkProfile -configPath ${PWD}/config -channelID system-channel -outputBlock ./system-genesis-block/genesis.block
printSeparator "Start Network within Docker Containers"
docker-compose -f ./docker/docker-compose-orderer.yaml -f ./docker/docker-compose-hospital.yaml -f ./docker/docker-compose-chemist.yaml -f ./docker/docker-compose-pathology.yaml -f ./docker/docker-compose-insurance.yaml up -d
printSeparator "Create Channel 1 Transaction"
configtxgen -profile PcaChannelProfile1 -configPath ${PWD}/config -outputCreateChannelTx ./channel-artifacts/pcaChannel1.tx -channelID channel1 && sleep 3
printSeparator "Create Anchor Peers Update for Hospital"
configtxgen -profile PcaChannelProfile1 -configPath ${PWD}/config -outputAnchorPeersUpdate ./channel-artifacts/HospitalMSPAnchors.tx -channelID channel1 -asOrg Hospital
printSeparator "Create Anchor Peers Update for Insurance"
configtxgen -profile PcaChannelProfile1 -configPath ${PWD}/config -outputAnchorPeersUpdate ./channel-artifacts/InsuranceMSPAnchors.tx -channelID channel1 -asOrg Insurance
printSeparator "Wait 3 seconds for network to come up" && sleep 3
printSeparator "Set Identity to Hospital"
switchIdentity "Hospital" 7051 && echoCurrentFabricEnvironment
printSeparator "Create channel"
peer channel create -o localhost:7050 -c channel1 --ordererTLSHostnameOverride orderer.pca.com -f ./channel-artifacts/pcaChannel1.tx --outputBlock ./channel-artifacts/channel1.block --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
printSeparator "Join Hospital to channel"
peer channel join -b ./channel-artifacts/channel1.block && sleep 1
printSeparator "Update Anchor Peers as Hospital"
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.pca.com -c channel1 -f ./channel-artifacts/HospitalMSPAnchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
printSeparator "Set Identity to Insurance"
switchIdentity "Insurance" 7054 && echoCurrentFabricEnvironment && sleep 1
printSeparator "Join Insurance to channel"
peer channel join -b ./channel-artifacts/channel1.block
printSeparator "Update Anchor Peers as Insurance"
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.pca.com -c channel1 -f ./channel-artifacts/InsuranceMSPAnchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

printSeparator "Create Channel 2 Transaction"
configtxgen -profile PcaChannelProfile2 -configPath ${PWD}/config -outputCreateChannelTx ./channel-artifacts/pcaChannel2.tx -channelID channel2 && sleep 3
printSeparator "Create Anchor Peers Update for Hospital"
configtxgen -profile PcaChannelProfile2 -configPath ${PWD}/config -outputAnchorPeersUpdate ./channel-artifacts/HospitalMSPanchors2.tx -channelID channel2 -asOrg Hospital
printSeparator "Create Anchor Peers Update for Pathology"
configtxgen -profile PcaChannelProfile2 -configPath ${PWD}/config -outputAnchorPeersUpdate ./channel-artifacts/PathologyMSPanchors2.tx -channelID channel2 -asOrg Pathology
printSeparator "Wait 3 seconds for network to come up" && sleep 3
printSeparator "Set Identity to Hospital"
switchIdentity "Hospital" 7051 && echoCurrentFabricEnvironment
printSeparator "Create channel"
peer channel create -o localhost:7050 -c channel2 --ordererTLSHostnameOverride orderer.pca.com -f ./channel-artifacts/pcaChannel2.tx --outputBlock ./channel-artifacts/channel2.block --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
printSeparator "Join Hospital to channel"
peer channel join -b ./channel-artifacts/channel2.block && sleep 1
printSeparator "Update Anchor Peers as Hospital"
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.pca.com -c channel2 -f ./channel-artifacts/HospitalMSPanchors2.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
printSeparator "Set Identity to Pathology"
switchIdentity "Pathology" 7053 && echoCurrentFabricEnvironment && sleep 1
printSeparator "Join Pathology to channel"
peer channel join -b ./channel-artifacts/channel2.block
printSeparator "Update Anchor Peers as Pathology"
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.pca.com -c channel2 -f ./channel-artifacts/PathologyMSPanchors2.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

printSeparator "Create Channel 3 Transaction"
configtxgen -profile PcaChannelProfile3 -configPath ${PWD}/config -outputCreateChannelTx ./channel-artifacts/pcaChannel3.tx -channelID channel3 && sleep 3
printSeparator "Create Anchor Peers Update for Hospital"
configtxgen -profile PcaChannelProfile3 -configPath ${PWD}/config -outputAnchorPeersUpdate ./channel-artifacts/HospitalMSPanchors3.tx -channelID channel3 -asOrg Hospital
printSeparator "Create Anchor Peers Update for Insurance"
configtxgen -profile PcaChannelProfile3 -configPath ${PWD}/config -outputAnchorPeersUpdate ./channel-artifacts/ChemistMSPanchors3.tx -channelID channel3 -asOrg Chemist
printSeparator "Wait 3 seconds for network to come up" && sleep 3
printSeparator "Set Identity to Hospital"
switchIdentity "Hospital" 7051 && echoCurrentFabricEnvironment
printSeparator "Create channel"
peer channel create -o localhost:7050 -c channel3 --ordererTLSHostnameOverride orderer.pca.com -f ./channel-artifacts/pcaChannel3.tx --outputBlock ./channel-artifacts/channel3.block --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
printSeparator "Join Hospital to channel"
peer channel join -b ./channel-artifacts/channel3.block && sleep 1
printSeparator "Update Anchor Peers as Hospital"
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.pca.com -c channel3 -f ./channel-artifacts/HospitalMSPanchors3.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
printSeparator "Set Identity to Chemist"
switchIdentity "Chemist" 8050 && echoCurrentFabricEnvironment && sleep 1
printSeparator "Join Chemist to channel"
peer channel join -b ./channel-artifacts/channel3.block
printSeparator "Update Anchor Peers as Chemist"
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.pca.com -c channel3 -f ./channel-artifacts/ChemistMSPanchors3.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

printSeparator "Done!"