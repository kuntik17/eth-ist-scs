import { useEffect, useState } from "react";
import baffle from "baffle";
import Alert from "./Alert";
import { supabase } from "../../utils/supabase";
import PropTypes from "prop-types";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SendPassword({ account, handleSwap }) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shared, setShared] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setform] = useState({
    address: "",
    secrets: "",
    price: "",
  });
  const [warning, setWarning] = useState("");

  const handleShare = async () => {
    if (!form.secrets) {
      setIsOpen(true);
      setWarning("You need to add a secret");
      return;
    }
    if (!form.price) {
      setIsOpen(true);
      setWarning("You need to add a price for swap");
      return;
    }
    setLoading(true);
    await supabase.from("secrets").insert([
      {
        from: account,
        to: "0x0000000",
        secret: "Steam Account 36 games",
        price: form.price,
        status: "listed",
      },
    ]);
    handleSwap({ seller: account, price: form.price, secret: form.secrets });
    setTimeout(() => {
      setLoading(false);
      setShared(true);
    }, 3000);
  };

  useEffect(() => {
    const target = baffle(".obfuscated");
    target.set({
      characters: "█▓█ ▒░/▒░ █░▒▓/ █▒▒ ▓▒▓/█<░▒ ▓/░>",
      speed: 100,
    });
    target.start();
    target.reveal(1000, 100);
  }, [shared]);

  return (
    <>
      <Alert text={warning} isOpen={isOpen} setIsOpen={() => setIsOpen(false)} />
      <div className="flex items-center justify-center gap-x-6 py-5">
        {!shared ? (
          <div className="pb-24 mt-20">
            <div className="flex">
              <label htmlFor="secrets" className="block text-sm font-semibold leading-6 text-black">
                Secrets to {enabled ? "share" : "swap"}{" "}
              </label>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={classNames(
                  enabled ? " bg-indigo-600" : "bg-gray-200",
                  "ml-4  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    enabled ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  )}
                />
              </Switch>
            </div>
            <div className="mt-2.5">
              <textarea
                name="secrets"
                id="secrets"
                rows={4}
                className="block w-full rounded-md border-0 bg-black/5  px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder={"Username: \nPassword: \n"}
                value={form.secrets}
                onChange={(e) => setform({ ...form, secrets: e.target.value })}
              />
            </div>

            {enabled && (
              <div className={"relative mt-2 rounded-md shadow-sm"}>
                <label htmlFor="wallet-address" className="block text-sm font-semibold leading-6 text-black mt-4">
                  Wallet address to share
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="wallet-address"
                    id="wallet-address"
                    autoComplete="wallet-address"
                    placeholder="0xE2dc27f386E713cd0F277151250811b401f30CB2"
                    className="block w-full rounded-md border-0 bg-black/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    value={form.address}
                    onChange={(e) => setform({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
            )}

            <>
              <label htmlFor="wallet-address" className="mt-4 block text-sm font-semibold leading-6 text-black">
                Swap Rate
              </label>
              <div className="flex items-center">
                <div className=" relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">MNT</span>
                  </div>

                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="block w-56 rounded-md border-0 py-2.5 pl-12 pr-12  bg-black/5  text-black ring-1 ring-inset ring-black/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder="0.000000"
                    aria-describedby="price-currency"
                    value={form.price}
                    onChange={(e) => setform({ ...form, price: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleShare}
                  className="w-36 rounded-md mt-2 ml-4 bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  ) : (
                    "Swap"
                  )}
                </button>
              </div>
            </>
          </div>
        ) : (
          <h1 className="obfuscated w-full min-h-full h-96 mx-auto my-auto mt-24 text-center"> Listed</h1>
        )}
      </div>
    </>
  );
}

SendPassword.propTypes = {
  account: PropTypes.string,
  handleSwap: PropTypes.func,
};
