import { Link } from "react-router";

type NavbarItemProps = {
  name: string;
  path: string;
};

export const Navbar = () => {
  const navbarItems: NavbarItemProps[] = [
    { name: "Admin charts (remote)", path: "/dashboard" },
  ];

  return (
    <nav className="sm:w-1/3 sm:min-w-72 sm:max-w-80 flex flex-col justify-start border-b sm:border-r border-white/10 sm:h-full pb-6 px-3 sm:p-3 sm:p-6 mb-3 sm:mb-0">
      <ul className="flex flex-col">
        {navbarItems.map(({ name, path }) => {
          return (
            <Link to={path} key={name}>
              <li
                className={`text-xs uppercase font-semibold tracking-widest cursor-pointer bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6 text-center mb-3`}
              >
                {name}
              </li>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
};
