import { Link } from "react-router-dom";

import picture from "@assets/profile-default.svg";

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { useProfile } from "../../../../../features/auth/hooks/profile";

const ProfileButton = () => {
    const { user } = useProfile()
  return (
    <Link to="/me" className="ml-1 rounded-full">
      <Avatar className="size-8" title={user?.name}>
        <AvatarImage src={picture} alt={user?.name} />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
    </Link>
  );
}

export default ProfileButton;
