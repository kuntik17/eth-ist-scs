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
    isShare: false,
  });
  const [warning, setWarning] = useState("");

  const handleShare = () => {
    if (!form.secrets) {
      setIsOpen(true);
      setWarning("You need to add a secret");
      return;
    }
    if (form.isShare && !form.address) {
      setIsOpen(true);
      setWarning("You need to add an address to share");
      return;
    }
    setLoading(true);
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
      <div className=" w-full	mt-8">
        {!shared ? (
          <div className=" pb-24">
            <div className="sm:col-span-2">
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
              <div className={!form.isShare ? "invisible relative mt-2 rounded-md shadow-sm" : " relative mt-2 rounded-md shadow-sm"}>
                <label htmlFor="wallet-address" className="block text-sm font-semibold leading-6 text-white mt-4">
                  Wallet address to share
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
              </div>
            </div>

            <>
              <div className="mt-2.5 flex">
                <div className="w-32" />
                <div className={!form.isShare ? "invisible relative  rounded-md shadow-sm w-64" : " relative rounded-md shadow-sm w-64"}></div>
                <h4 className={form.isShare ? "invisible mt-5" : "mt-5"}>Share</h4>
                <input
                  onChange={() => setform({ ...form, isShare: !form.isShare })}
                  id="share"
                  aria-describedby="share"
                  name="share"
                  type="checkbox"
                  className="h-4 mt-6 w-4 rounded border-gray-300  ml-4 text-indigo-600 focus:ring-indigo-600"
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
                  ) : !form.isShare ? (
                    "Save"
                  ) : (
                    "Share"
                  )}
                </button>
              </div>
            </>
          </div>
        ) : (
          <h1 className="obfuscated w-full min-h-full h-96 mx-auto my-auto mt-72 text-center"> {form.isShare ? "Shared" : "Saved"}</h1>
        )}
      </div>
    </>
  );
}
