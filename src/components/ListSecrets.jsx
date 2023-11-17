import { ChevronRightIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

const statuses = {
  offline: "text-gray-500 bg-gray-100/10",
  online: "text-green-400 bg-green-400/10",
  error: "text-rose-400 bg-rose-400/10",
};
const environments = {
  Sold: "text-gray-400 bg-gray-400/10 ring-gray-400/20",
  Owned: "text-indigo-400 bg-indigo-400/10 ring-indigo-400/30",
  Shared: "text-yellow-400 bg-yellow-400/10 ring-yellow-400/20",
  Waiting: "text-gray-400 bg-gray-400/10 ring-gray-400/20",
  Canceled: "text-rose-400 bg-rose-400/10 ring-rose-400/20",
};
const deployments = [
  {
    id: 1,
    href: "#",
    teamName: "Fortnite",
    status: "online",
    statusText: "password",
    description: "username",
    environment: "Owned",
  },
  {
    id: 1,
    href: "#",
    teamName: "Fortnite",
    status: "online",
    statusText: "password",
    description: "username",
    environment: "Owned",
  },
  {
    id: 2,
    href: "#",
    teamName: "Pubg",
    status: "offline",
    statusText: "password",
    description: "username",
    environment: "Sold",
  },
  {
    id: 3,
    href: "#",
    teamName: "AWS",
    status: "online",
    statusText: "password",
    description: "username",
    environment: "Shared",
  },
  {
    id: 4,
    href: "#",
    teamName: "Twitter",
    status: "offline",
    statusText: "password",
    description: "username",
    environment: "Waiting",
  },
  {
    id: 5,
    href: "#",
    teamName: "Gmail",
    status: "online",
    statusText: "password",
    description: "username",
    environment: "Owned",
  },
  {
    id: 6,
    href: "#",
    teamName: "Figma",
    status: "online",
    statusText: "password",
    description: "username",
    environment: "Shared",
  },
  {
    id: 7,
    href: "#",
    teamName: "Metamask",
    status: "error",
    statusText: "password",
    description: "username",
    environment: "Canceled",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function List({ openForm }) {
  return (
    <>
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
        {deployments.map((deployment) => (
          <li key={deployment.id} className="relative flex items-center space-x-4 py-4">
            <div className="min-w-0 flex-auto">
              <div className="flex items-center gap-x-3">
                <div className={classNames(statuses[deployment.status], "flex-none rounded-full p-1")}>
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div>
                <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                  <a href={deployment.href} className="flex gap-x-2">
                    <span className="truncate">{deployment.teamName}</span>
                    <span className="text-gray-400">/</span>

                    <span className="absolute inset-0" />
                  </a>
                </h2>
              </div>
              <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                <p className="truncate">{deployment.description}</p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="whitespace-nowrap">{deployment.statusText}</p>
              </div>
            </div>
            <div className={classNames(environments[deployment.environment], "rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset")}>
              {deployment.environment}
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
};
