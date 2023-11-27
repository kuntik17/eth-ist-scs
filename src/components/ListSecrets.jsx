import { ChevronRightIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
import Approve from "./Approve";
import { useState } from "react";
import SendPassword from "./SendForm";

const statuses = {
  pending: "text-gray-500 bg-gray-100/10",
  sold: "text-green-400 bg-green-400/10",
  canceled: "text-rose-400 bg-rose-400/10",
};
const environments = {
  Sold: "text-gray-400 bg-gray-400/10 ring-gray-400/20",
  Owned: "hidden text-indigo-400 bg-indigo-400/10 ring-indigo-400/30",
  Shared: "text-yellow-400 bg-yellow-400/10 ring-yellow-400/20",
  Waiting: "text-gray-400 bg-gray-400/10 ring-gray-400/20",
  Canceled: "text-rose-400 bg-rose-400/10 ring-rose-400/20",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function List({ receivedSecrets, sentSecrets, AvailableSecrets, accounts, handleSwap, handleStake, secret, handlePay, tab }) {
  const [selectedSecret, setSelectedSecret] = useState({ secret: "", id: "", price: "" });
  const [open, setOpen] = useState(false);
  const handleSelect = (secret) => {
    setSelectedSecret(secret);

    if (secret.secret === "Steam Account 36 games" && secret.status === "listed") {
      setOpen(true);
    }
  };

  const handleApply = async () => {
    if (secret) {
      handlePay();
    } else {
      handleStake(selectedSecret);
    }

    // await supabase.from("secrets").update({ status: "staked" }).eq("id", selectedSecret.id);
    setOpen(false);
  };

  const handleDeny = async () => {
    //await supabase.from("secrets").update({ status: "cancel" }).eq("id", selectedSecret.id);
    setOpen(false);
  };

  return (
    <>
      <Approve
        isSecret={secret}
        secret={selectedSecret.secret}
        price={selectedSecret.price}
        status={selectedSecret.status}
        open={open}
        setOpen={setOpen}
        approve={handleApply}
        deny={handleDeny}
      />

      <ul role="list" className="divide-y divide-gray-100 text-black w-1/2 ml-auto mr-auto mt-20">
        {tab === "Received" ? (
          receivedSecrets.map((deployment) => (
            <li key={deployment.id} className="flex items-center justify-between gap-x-6 py-5">
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">
                  <div className={classNames(statuses[deployment.status], "flex-none rounded-full p-1")}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <div className="min-w-0 text-sm font-semibold leading-6 text-black">
                    <span className="truncate text-black">{deployment.secret}</span>

                    <span className="absolute inset-0" />
                  </div>
                </div>
              </div>
              <div className={classNames(environments[deployment.environment], "rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset")}>
                {deployment.status === "sold" ? "owned" : deployment.status}
              </div>
              <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </li>
          ))
        ) : tab === "Sent" ? (
          sentSecrets.map((deployment) => (
            <li key={deployment.id} className="flex items-center justify-between gap-x-6 py-5">
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">
                  <div className={classNames(statuses[deployment.status], "flex-none rounded-full p-1")}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <h2 className="min-w-0 text-sm font-semibold leading-6 text-black">
                    <span className="truncate">{deployment.secret}</span>

                    <span className="absolute inset-0" />
                  </h2>
                </div>
              </div>
              <div className={classNames(environments[deployment.environment], "rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset")}>
                {deployment.status === "canceled" ? "returned" : deployment.status === "pending" ? "waiting payment" : deployment.status}
              </div>
              <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </li>
          ))
        ) : tab === "Available" ? (
          AvailableSecrets.map((deployment) => (
            <li key={deployment.id} className="flex items-center justify-between gap-x-6 py-5" onClick={() => handleSelect(deployment)}>
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">
                  <div className={classNames(statuses[deployment.status], "flex-none rounded-full p-1")}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <h2 className="flex min-w-0 text-sm font-semibold leading-6 text-black">
                    <span className="truncate">{deployment.secret}</span>
                  </h2>
                </div>
              </div>
              <div className={classNames(environments[deployment.environment], "rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset")}>
                {deployment.price} MNT
              </div>
              <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </li>
          ))
        ) : (
          <SendPassword account={accounts} handleSwap={handleSwap} />
        )}
      </ul>
    </>
  );
}

List.propTypes = {
  receivedSecrets: PropTypes.array,
  sentSecrets: PropTypes.array,
  AvailableSecrets: PropTypes.array,
  accounts: PropTypes.string,
  handleSwap: PropTypes.func,
  handleStake: PropTypes.func,
  secret: PropTypes.string,
  handlePay: PropTypes.func,
  tab: PropTypes.string,
};
