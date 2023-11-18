import { useState, useEffect } from "react";
import List from "../components/ListSecrets";
import { ethers } from "ethers";
import { supabase } from "../../utils/supabase";
import { SecretTextContract } from "../../smart_contract/deployedAddresses.json";
import contractData from "../../smart_contract/artifacts/contracts/SecretTextContract.sol/SecretTextContract.json";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

function Dashboard() {
  const [accounts, setAccount] = useState();
  const [receivedSecrets, setReceivedSecrets] = useState([]);
  const [sentSecrets, setSentSecrets] = useState([]);
  const [AvailableSecrets, setAvailableSecrets] = useState([]);

  const setPush = async () => {
    // Creating a random signer from a wallet, ideally this is the wallet you will connect
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(await signer.getAddress());
    provider.getCode(signer.getAddress()).then((code) => {
      console.log(code);
    });
    console.log(CONSTANTS.ENV.STAGING);
    const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
    const inboxNotifications = await userAlice.notification.list("INBOX");
    console.log(inboxNotifications);

    /*
    const response = await userAlice.channel.create({
      name: "Test Channel",
      description: "Test Description",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
      url: "https://push.org",
    });
*/
  };

  useEffect(() => {
    //setPush();
  }, []);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
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

  const handleSwap = async (secret) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
    }
  };

  const handleStake = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const account = await provider.listAccounts();
      const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
      const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;
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
        const provider = new ethers.providers.Web3Provider(window.ethereum);

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
          handleStake={handleStake}
          secret={secret}
          handlePay={handlePay}
        />
      </div>
    </>
  );
}

export default Dashboard;
