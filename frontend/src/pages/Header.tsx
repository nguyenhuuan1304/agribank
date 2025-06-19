import Logo from "../assets/agribank.png";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function Header() {
  return (
    <header className="bg-gray-100 shadow p-4 flex sticky top-0 z-50 w-full">
      <div className="flex items-center max-w-7xl w-full mx-auto justify-between">
        <div className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Agribank Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div className="text-xl font-semibold text-gray-800 flex items-center">
            Agribank
          </div>
        </div>
        <div className="cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
