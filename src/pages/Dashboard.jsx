import { useState, useEffect } from "react";
import { Network, Alchemy } from 'alchemy-sdk';
import List from "../components/ListSecrets";
import { ethers } from "ethers";
import { supabase } from "../../utils/supabase";
import { SecretTextContract } from "../../smart_contract/deployedAddresses.json";
import contractData from "../../smart_contract/artifacts/contracts/SecretTextContract.sol/SecretTextContract.json";
import { initialize, encrypt, conditions, domains } from '@nucypher/taco';

function Dashboard() {
  const [accounts, setAccount] = useState();
  const [receivedSecrets, setReceivedSecrets] = useState([]);
  const [sentSecrets, setSentSecrets] = useState([]);
  const [AvailableSecrets, setAvailableSecrets] = useState([]);
  const [ApeCoinStatus, setApeCoinStatus] = useState([]);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const account = await provider.listAccounts();

        setAccount(account[0].address);
        if (account[0].address) {
          const { data } = await supabase.from("secrets").select("*").eq("to", account[0].address);
          const from = await supabase.from("secrets").select("*").eq("from", account[0].address);
          const listed = await supabase.from("secrets").select("*").eq("status", "listed");

          setAvailableSecrets(listed.data);
          setSentSecrets(from.data);
          setReceivedSecrets(data);
        }
      }
    };
    initializeProvider();
  }, []);

  const [see, setSee] = useState(true);

  const handleSwap = async (secret) => {
    if (window.ethereum) {

      if (checkIfApecoinTokenHolder() == true){
        setApeCoinStatus(true)
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const account = await provider.listAccounts();
      const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
      const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;

      const providerMaster = new ethers.JsonRpcProvider(goerliEndpoint);

      const privateKey = "5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61";
      const master_wallet = new ethers.Wallet(privateKey, providerMaster);

      const contract = new ethers.Contract(SecretTextContract, contractData.abi, master_wallet);

      const tx_setSeller = await contract.setSellerAddress(account[0].address);

      const contract_seller = new ethers.Contract(SecretTextContract, contractData.abi, await provider.getSigner());
      const priceInWei = ethers.parseUnits(secret.price, "ether");

      tx_setSeller.wait(2);
      const tx_setPrice = await contract_seller.setPrice(priceInWei);
      const tx_setSecret = await contract_seller.setSecretText(secret.secret);

      // encrypt with threshold
      const contractAddr = '0x08B30a7fB75a873DfF03aDBCcf866B27d8d7DD85';

      // We have to initialize the TACo library first
      await initialize();

      //@ts-ignore
      const isBuyerAddressCondition = new conditions.base.ContractCondition({
        method: 'getBuyerAddress', // `myMethodAbi.name`
        parameters: [':userAddress'], // `myMethodAbi.inputs`
        functionAbi: contractData.abi, // Our custom function ABI
        contractAddress: contractAddr,
        chain: 5,
        returnValueTest: {
          index: 0,
          comparator: '>',
          value: 0,
        },
      });

      const message = "my secret message";

      const messageKit = await encrypt(
        provider,
        domains.DEV,
        message,
        isBuyerAddressCondition,
        0,
        provider.getSigner() 
      );
      }

      supabase.from("secrets").update({ messageKit: messageKit }).eq("id", selectedSecret.id);
  };

   // check if ape coin holder
   const checkIfApecoinTokenHolder = async (
    address,
    mainOrTest = 'mainnet'
  ) => {
    if (mainOrTest === 'mainnet') {

      const alchemyMainnet = new Alchemy({
        apiKey: process.env.REACT_APP_ALCHEMY_KEY_MAINNET,
        network: Network.ETH_MAINNET,
      });

      const apecoinContractMainnet = '0x4d224452801ACEd8B2F0aebE155379bb5D594381';

      return alchemyMainnet.core
        .getTokenBalances(address, [apecoinContractMainnet])
        .then(balances => {
          const { tokenBalances } = balances;
          const holdsTokens =
            tokenBalances[0].tokenBalance !==
            '0x0000000000000000000000000000000000000000000000000000000000000000';
          return holdsTokens; //boolean
        });
    }
  };


  const handleStake = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const account = await provider.listAccounts();
      const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
      const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;
      // providerMaster = new ethers.BrowserProvider(goerliEndpoint);
      const providerMaster = new ethers.JsonRpcProvider(goerliEndpoint);

      const privateKey = "5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61";
      const master_wallet = new ethers.Wallet(privateKey, providerMaster);

      const contract = new ethers.Contract(SecretTextContract, contractData.abi, master_wallet);

      const tx_setSeller = await contract.setBuyerAddress(account[0].address);

      const contract_seller = new ethers.Contract(SecretTextContract, contractData.abi, await provider.getSigner());

      tx_setSeller.wait(2);
      const priceInWei = ethers.parseUnits("0.001", "ether");

      const tx_stake = await contract_seller.addStake({ value: priceInWei });
    }
  };

  useEffect(() => {
    getSecret();
  }, []);

  const [secret, setSecret] = useState("");

  const getSecret = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        /*const contract_seller = new ethers.Contract(SecretTextContract, contractData.abi, await provider.getSigner());

        const tx_stake = await contract_seller.getSecretText();
        setSecret(tx_stake);*/

        // retrieve secret via threshold messagekit
        supabase.from("secrets").update({ messageKit: messageKit }).eq("id", selectedSecret.id);
        const { data } = await supabase.from("secrets").select("*").eq("to", account[0].address);

        await initialize();

        const decryptedMessage = await decrypt(
          provider,
          domains.DEV,
          data.messageKit,
          getPorterUri(domains.DEV),
          provider.getSigner()
        );

        setSecret(decryptedMessage);

      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePay = async () => {
    if (window.ethereum) {
      try {
        const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
        const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;

        const providerMaster = new ethers.JsonRpcProvider(goerliEndpoint);

        const privateKey = "5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61";
        const master_wallet = new ethers.Wallet(privateKey, providerMaster);

        const contract = new ethers.Contract(SecretTextContract, contractData.abi, master_wallet);

        const tx_stake = await contract.payStakeToSeller();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div id="list-secrets" className="password list-secrets w-full overflow-scroll">
        <List
          account={accounts}
          handleSwap={handleSwap}
          receivedSecrets={receivedSecrets}
          sentSecrets={sentSecrets}
          AvailableSecrets={AvailableSecrets}
          openForm={() => setSee(false)}
          handleStake={handleStake}
          secret={secret}
          handlePay={handlePay}
        />
      </div>
    </>
  );
}

export default Dashboard;
