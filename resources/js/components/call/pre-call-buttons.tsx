import { Link } from "@inertiajs/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { ConnectionState } from "@/pages/call/call";

interface PreCallButtonsProps {
  connect: () => Promise<void>;
  connectionState: ConnectionState;
}

export default function PreCallButtons({ connectionState, connect }: PreCallButtonsProps) {
  if (connectionState !== 'unconnected') {
    return null;
  }
  return (
    <>
      <div className="absolute top-1/2 w-full">
        <Button size='lg' onClick={connect} className="block m-auto text-lg">
          Connect
        </Button>
      </div>
      <Link className="absolute rounded-full top-10 right-10" method="post" href={route('logout')} as="button">
          <LogOut />
      </Link>
    </>
  );
}
