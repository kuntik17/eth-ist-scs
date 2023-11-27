import { useState, useEffect } from "react";
import List from "../components/ListSecrets";
import { ethers } from "ethers";
import { supabase } from "../../utils/supabase";
import { SecretTextContract } from "../../smart_contract/deployedAddresses.json";
import contractData from "../../smart_contract/artifacts/contracts/SecretTextContract.sol/SecretTextContract.json";
import { useSDK } from "@metamask/sdk-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Dashboard() {
  const { connected } = useSDK();
  const [accounts, setAccount] = useState();
  const [receivedSecrets, setReceivedSecrets] = useState([]);
  const [sentSecrets, setSentSecrets] = useState([]);
  const [availableSecrets, setAvailableSecrets] = useState([]);
  const [navigation, setNavigation] = useState([
    { name: "Available", count: 0 },
    { name: "Received", count: 0 },
    { name: "Sent", count: 0 },
    { name: "Create", count: 0 },
  ]);
  const [tab, setTab] = useState("Received");

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

          setNavigation([
            { name: "Available", count: listed.data.length },
            { name: "Received", count: data.length },
            { name: "Sent", count: from.data.length },
            { name: "Create", count: null },
          ]);
        }
      }
    };
    initializeProvider();
  }, []);

  const [see, setSee] = useState(true);

  const handleSwap = async (secret) => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const account = await provider.listAccounts();
      //const infuraApiKey = "87a0c31e5f3f4baaae705bb627d0350c";
      //const goerliEndpoint = `https://goerli.infura.io/v3/${infuraApiKey}`;

      const providerMaster = new ethers.JsonRpcProvider("https://rpc.testnet.mantle.xyz/");

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
      <div className="bg-white h-screen">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <img className="h-14 w-auto" src="/logo.png" alt="logo" />
              </a>
            </div>

            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setTab(item.name)}
                  className={classNames(
                    tab === item.name
                      ? "border-indigo-500 text-indigo-600 cursor-pointer"
                      : " cursor-pointer border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                    "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium text-sm font-semibold leading-6 text-gray-900"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {item.name}{" "}
                  {item.count ? (
                    <span
                      className={classNames(
                        tab === item.name ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-900",
                        "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                      )}
                    >
                      {item.count}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <button className="text-sm font-semibold leading-6 text-gray-900">
                {connected ? "Connected" : "Log in"} <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </nav>
        </header>
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <List
            tab={tab}
            account={accounts}
            handleSwap={handleSwap}
            receivedSecrets={receivedSecrets}
            sentSecrets={sentSecrets}
            AvailableSecrets={availableSecrets}
            openForm={() => setSee(false)}
            handleStake={handleStake}
            secret={secret}
            handlePay={handlePay}
          />

          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
