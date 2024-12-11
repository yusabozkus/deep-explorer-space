import { useFolllow } from "@/Database/React Query/queries";
import { IUser } from "@/Types";
import { Button } from "@nextui-org/button";
import { CircularProgress } from "@nextui-org/react";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
// import useSocket from "../../Database/Hooks/useSocket";

const FollowButton = ({
  followed,
  follower,
  followerList,
  user,
  onFollowChange,
}: {
  followed: string;
  follower: string;
  followerList: Models.DocumentList;
  user: IUser;
  onFollowChange: (isFollowing: boolean) => void; // Yeni prop
}) => {
  const { mutateAsync: follow } = useFolllow();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // İşlem sırasında durum kontrolü

  //   const { followUser } = useSocket();

  const handleFollow = async () => {
    setIsLoading(true); // İşlem başlıyor
    try {
      await follow({ followed, follower });
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      onFollowChange(newFollowingState); // Takipçi sayısını güncelle
      //   followUser("aUser", "bUser");
    } catch (error) {
      console.error("Follow operation failed:", error);
    } finally {
      setIsLoading(false); // İşlem tamamlandı
    }
  };

  useEffect(() => {
    const userIsFollowing = followerList.some(
      (doc) => doc.follower.$id === user.id
    );
    setIsFollowing(userIsFollowing);
  }, [followerList, user.id]);

  return (
    <Button
      onPress={() => handleFollow()}
      disabled={isLoading} // Loading sırasında devre dışı
      variant="solid"
      color={isFollowing ? "default" : "primary"}
      className="w-full font-medium"
    >
      {isLoading ? ( // İşlem sırasında CircularProgress
        <CircularProgress
          color="default"
          classNames={{ indicator: "stroke-white", svg: "w-[25px] h-[25px]" }}
        />
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default FollowButton;
