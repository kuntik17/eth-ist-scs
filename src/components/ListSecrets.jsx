import { ChevronRightIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
import Approve from "./Approve";
import { useState } from "react";
import { supabase } from "../../utils/supabase";

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

export default function List({ openForm, receivedSecrets, sentSecrets }) {
  const [selectedSecret, setSelectedSecret] = useState({ secret: "", id: "", price: "" });
  const [open, setOpen] = useState(false);
  const handleSelect = (secret) => {
    setSelectedSecret(secret);
    setOpen(true);
  };

  const handleApply = async () => {
    await supabase.from("secrets").update({ status: "sold" }).eq("id", selectedSecret.id);
    setOpen(false);
  };

  const handleDeny = async () => {
    await supabase.from("secrets").update({ status: "cancel" }).eq("id", selectedSecret.id);
    setOpen(false);
  };

  return (
    <>
      <Approve secret={selectedSecret.secret} price={selectedSecret.price} status={selectedSecret.status} open={open} setOpen={setOpen} approve={handleApply} deny={handleDeny} />
      <li key={1} className="relative flex items-center  text-center  py-4">
        <div className="min-w-0 flex-auto">
          <div className="flex items-center gap-x-3">
            <div className={"flex-none rounded-full p-1"}>
              <div className="h-2 w-2 rounded-full bg-current" />
            </div>
            <h2 className="min-w-0 text-sm text-center font-semibold leading-6 text-white" onClick={openForm}>
              Add new item
              <span className="absolute inset-0" />
            </h2>
          </div>
        </div>
      </li>
      <ul role="list" className="divide-y divide-white/5 overflow-scroll">
        {receivedSecrets.map((deployment) => (
          <li key={deployment.id} className="relative flex items-center space-x-4 py-4" onClick={() => handleSelect(deployment)}>
            <div className="min-w-0 flex-auto">
              <div className="flex items-center gap-x-3">
                <div className={classNames(statuses[deployment.status], "flex-none rounded-full p-1")}>
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div>
                <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                  <span className="truncate">{deployment.secret}</span>

                  <span className="absolute inset-0" />
                </h2>
              </div>
            </div>
            <div className={classNames(environments[deployment.environment], "rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset")}>
              {deployment.status === "sold" ? "owned" : deployment.status}
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </li>
        ))}
        {sentSecrets.map((deployment) => (
          <li key={deployment.id} className="relative flex items-center space-x-4 py-4">
            <div className="min-w-0 flex-auto">
              <div className="flex items-center gap-x-3">
                <div className={classNames(statuses[deployment.status], "flex-none rounded-full p-1")}>
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div>
                <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
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
        ))}
      </ul>
    </>
  );
}

List.propTypes = {
  openForm: PropTypes.func,
  receivedSecrets: PropTypes.array,
  sentSecrets: PropTypes.array,
};
