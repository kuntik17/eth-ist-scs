import { useState, useEffect } from "react";
import SendPassword from "../components/SendForm";
import List from "../components/ListSecrets";
import { ethers } from "ethers";
import { supabase } from "../../utils/supabase";
import { SecretTextContract } from "../../smart_contract/deployedAddresses.json";
import contractData from "../../smart_contract/artifacts/contracts/SecretTextContract.sol/SecretTextContract.json";

function Dashboard() {
  const [accounts, setAccount] = useState();
  const [receivedSecrets, setReceivedSecrets] = useState([]);
  const [sentSecrets, setSentSecrets] = useState([]);
  const [AvailableSecrets, setAvailableSecrets] = useState([]);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const account = await provider.listAccounts();
        const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
        const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;
        // providerMaster = new ethers.BrowserProvider(goerliEndpoint);
        const providerMaster = new ethers.JsonRpcProvider(goerliEndpoint);

        console.log(providerMaster);
        const privateKey = "5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61";
        const wallet = new ethers.Wallet(privateKey, providerMaster);
        console.log("wallet", wallet);

        const contract = new ethers.Contract(SecretTextContract, contractData.abi, wallet);
        console.log("contract", contract);
        // const tx = await contract.setSellerAddress(account[0].address);
        const tx = await contract.sellerAddress();
        console.log(tx, "tx");

        setAccount(account[0].address);
        if (account[0].address) {
          const { data } = await supabase.from("secrets").select("*").eq("to", account[0].address);
          const from = await supabase.from("secrets").select("*").eq("from", account[0].address);
          const listed = await supabase.from("secrets").select("*").eq("status", "listed");
          console.log(listed);
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
      console.log(secret);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const account = await provider.listAccounts();
      const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
      const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;
      // providerMaster = new ethers.BrowserProvider(goerliEndpoint);
      const providerMaster = new ethers.JsonRpcProvider(goerliEndpoint);

      console.log(providerMaster);
      const privateKey = "5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61";
      const master_wallet = new ethers.Wallet(privateKey, providerMaster);

      const contract = new ethers.Contract(SecretTextContract, contractData.abi, master_wallet);

      const tx_setSeller = await contract.setSellerAddress(account[0].address);
      console.log(tx_setSeller, "tx");
      const contract_seller = new ethers.Contract(SecretTextContract, contractData.abi, await provider.getSigner());
      const priceInWei = ethers.parseUnits(secret.price, "ether");
      console.log(priceInWei, "priceInWei");
      tx_setSeller.wait(2);
      const tx_setPrice = await contract_seller.setPrice(priceInWei);
      const tx_setSecret = await contract_seller.setSecretText(secret.secret);
      console.log(tx_setPrice, tx_setSecret, "tx");
    }
  };

  const handleStake = async (secret) => {
    if (window.ethereum) {
      console.log(secret);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const account = await provider.listAccounts();
      const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
      const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;
      // providerMaster = new ethers.BrowserProvider(goerliEndpoint);
      const providerMaster = new ethers.JsonRpcProvider(goerliEndpoint);

      console.log(providerMaster);
      const privateKey = "5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61";
      const master_wallet = new ethers.Wallet(privateKey, providerMaster);

      const contract = new ethers.Contract(SecretTextContract, contractData.abi, master_wallet);

      const tx_setSeller = await contract.setBuyerAddress(account[0].address);
      console.log(tx_setSeller, "tx");
      const contract_seller = new ethers.Contract(SecretTextContract, contractData.abi, await provider.getSigner());

      tx_setSeller.wait(2);
      const priceInWei = ethers.parseUnits("0.001", "ether");
      console.log(priceInWei, "priceInWei");
      const tx_stake = await contract_seller.addStake({ value: priceInWei });
      console.log(tx_stake);
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

        const contract_seller = new ethers.Contract(SecretTextContract, contractData.abi, await provider.getSigner());

        const tx_stake = await contract_seller.getSecretText();
        setSecret(tx_stake);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePay = async () => {
    if (window.ethereum) {
      try {
        console.log("payment");

        const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
        const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;
        // providerMaster = new ethers.BrowserProvider(goerliEndpoint);
        const providerMaster = new ethers.JsonRpcProvider(goerliEndpoint);

        const privateKey = "5e7c050e4b572af2829de5e6625b7de13094f249870a4ddf7da9fcbb46bd1f61";
        const master_wallet = new ethers.Wallet(privateKey, providerMaster);

        const contract = new ethers.Contract(SecretTextContract, contractData.abi, master_wallet);

        const tx_stake = await contract.payStakeToSeller();
        console.log(tx_stake);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {see ? (
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
      ) : (
        <div className="password w-full">
          <SendPassword account={accounts} handleSwap={handleSwap} />
        </div>
      )}
    </>
  );
}

export default Dashboard;
