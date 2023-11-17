import { useEffect, useState } from "react";
import baffle from "baffle";
import Alert from "./Alert";

export default function SendPassword() {
  const [loading, setLoading] = useState(false);
  const [shared, setShared] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setform] = useState({
    address: "",
    secrets: "",
    price: "",
    isSell: false,
  });
  const [warning, setWarning] = useState("");

  const handleShare = () => {
    setLoading(true);
    if (!form.address || !form.secrets) {
      setIsOpen(true);
      setWarning("You need to add receiver wallet address and a secret");
      return;
    }
    if (form.isSell && !form.price) {
      setIsOpen(true);
      setWarning("You need to add a price");
      return;
    }
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
      <div className=" w-full	mt-16">
        {!shared ? (
          <div className=" pb-24">
            <div className="">
              <div className="sm:col-span-2">
                <label htmlFor="wallet-address" className="block text-sm font-semibold leading-6 text-white">
                  Receiver wallet address
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="wallet-address"
                    id="wallet-address"
                    autoComplete="wallet-address"
                    placeholder="0xE2dc27f386E713cd0F277151250811b401f30CB2"
                    className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    value={form.address}
                    onChange={(e) => setform({ ...form, address: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="secrets" className="block text-sm font-semibold leading-6 text-white">
                    Secrets
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="secrets"
                      id="secrets"
                      rows={4}
                      className="block w-full rounded-md border-0 bg-white/5  px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder={"Username: \nPassword: \n"}
                      value={form.secrets}
                      onChange={(e) => setform({ ...form, secrets: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <>
                <label htmlFor="wallet-address" className="block text-sm font-semibold leading-6 text-white">
                  Price
                </label>
                <div className="mt-2.5 flex items-center">
                  <div className={!form.isSell ? "invisible relative mt-2 rounded-md shadow-sm" : " relative mt-2 rounded-md shadow-sm"}>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">ETH</span>
                    </div>

                    <input
                      disabled={!form.isSell}
                      type="number"
                      name="price"
                      id="price"
                      className="block w-56 rounded-md border-0 py-2.5 pl-12 pr-12  bg-white/5  text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="0.000000"
                      aria-describedby="price-currency"
                      value={form.price}
                      onChange={(e) => setform({ ...form, price: e.target.value })}
                    />
                  </div>
                  <h4 className={form.isSell ? "invisible mt-2" : "mt-2"}>Sell</h4>
                  <input
                    onChange={() => setform({ ...form, isSell: !form.isSell })}
                    id="sell"
                    aria-describedby="sell"
                    name="sell"
                    type="checkbox"
                    className="h-4 mt-2 w-4 rounded border-gray-300  ml-4 text-indigo-600 focus:ring-indigo-600"
                  />

                  <button
                    onClick={handleShare}
                    className="w-24 rounded-md mt-2 ml-4 bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
                    ) : form.isSell ? (
                      "Sell"
                    ) : (
                      "Share"
                    )}
                  </button>
                </div>
              </>
            </div>
          </div>
        ) : (
          <h1 className="obfuscated w-full min-h-full h-96 mx-auto my-auto mt-72 text-center"> {form.isSell ? "Waiting for approval" : "Shared"}</h1>
        )}
      </div>
    </>
  );
}
