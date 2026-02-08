import { Radar } from "lucide-react";

const Header = () => (
  <header className="flex items-center gap-3 px-8 py-5">
    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
      <Radar className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        CallPilot <span className="font-normal text-muted-foreground">Mission Control</span>
      </h1>
    </div>
  </header>
);

export default Header;
