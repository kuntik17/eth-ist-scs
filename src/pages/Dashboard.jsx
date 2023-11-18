import { useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";
import SendPassword from "../components/SendForm";
import List from "../components/ListSecrets";
import { ethers } from "ethers";
import { supabase } from "../../utils/supabase";

function Dashboard() {
  const [accounts, setAccount] = useState();
  const [receivedSecrets, setReceivedSecrets] = useState([]);
  const [sentSecrets, setSentSecrets] = useState([]);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const account = await provider.listAccounts();
        setAccount(account[0].address);
        if (account[0].address) {
          const { data, error } = await supabase.from("secrets").select("*").eq("to", account[0].address);
          console.log(data, error);
          const from = await supabase.from("secrets").select("*").eq("from", account[0].address);
          setSentSecrets(from.data);
          setReceivedSecrets(data);
        }
      }
    };
    initializeProvider();
  }, []);

  const [see, setSee] = useState(true);

  return (
    <>
      {see ? (
        <div id="list-secrets" className="password list-secrets w-full overflow-scroll">
          <List receivedSecrets={receivedSecrets} sentSecrets={sentSecrets} openForm={() => setSee(false)} />
        </div>
      ) : (
        <div className="password w-full">
          <SendPassword account={accounts} />
        </div>
      )}
    </>
  );
}

export default Dashboard;
