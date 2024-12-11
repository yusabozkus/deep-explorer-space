import { Button } from "@nextui-org/button";
import {
  Chip,
  CircularProgress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FiThumbsUp, FiShare } from "react-icons/fi";
import { BiMessageSquare } from "react-icons/bi";
import { IUser } from "@/Types";
import { ChevronDown, Heart, MessageCircle, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Models } from "appwrite";
import {
  useLikeThought,
  useSaveThoughtComment,
} from "@/Database/React Query/queries";
import toast from "react-hot-toast";
import ThoughtCommentCard from "../Cards/ThoughtCommentCard";
import { sendNotificationToUser } from "@/Database/Ably/ably";

const ItemStats = ({
  user: currentUser,
  thought,
  hideComment = false,
}: {
  user: IUser;
  thought: Models.Document;
  hideComment?: boolean;
}) => {
  const { mutateAsync: toggleLike } = useLikeThought();
  const { mutateAsync: saveComment } = useSaveThoughtComment();

  const [isUserLiked, setIsUserLiked] = useState(false);
  const [likes, setLikes] = useState(thought.likes ? thought.likes.length : 0);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Most popular"]));
  const [showComments, setShowComments] = useState(hideComment);
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState(thought.comments);
  const [isLoading, setIsLoading] = useState(false);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleLikeButton = async () => {
    setIsUserLiked(!isUserLiked);

    // Optimistically update like count
    setLikes(isUserLiked ? likes - 1 : likes + 1);

    try {
      await toggleLike({ item: thought.$id, user: currentUser.id });
      console.log("message send");
    } catch (error) {
      // Revert the optimistic update in case of error
      setLikes(isUserLiked ? likes + 1 : likes - 1);
      setIsUserLiked(!isUserLiked);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleShareCommentButton = async () => {
    if (!currentUser || !thought) {
      toast.error("Thought or User undefined.");
    } else {
      if (userComment.length > 0) {
        if (userComment.length > 500) {
          toast.error("It must be at most 500 characters.");
        } else {
          setIsLoading(true);
          const comment = await saveComment({
            comment: userComment,
            creator: currentUser.id,
            thought: thought.$id,
          });

          if (comment) {
            const newComment = [...comments];
            newComment.push(comment);

            setComments(newComment);
            setUserComment("");
            sendNotificationToUser(
              thought.creator.$id,
              `Kullanıcı ${currentUser.id} gönderinize yorum yaptı!`
            );
            toast.success("Your comment has been shared!");
          }
          setIsLoading(false);
        }
      } else {
        toast.error("It must be at least 10 characters.");
      }
    }
  };

  useEffect(() => {
    if (thought?.likes) {
      // Ensure 'thought' and 'thought.likes' are defined
      const userHasLiked = (thought.likes || []).some(
        (like: { user: { $id: string } }) => like?.user?.$id === currentUser?.id
      );
      setIsUserLiked(userHasLiked);
    }
  }, [currentUser?.id, thought]);

  if (!thought) return null;

  return (
    <section className="flex flex-col">
      <div className="w-full p-1 mt-5 flex flex-row items-center justify-between gap-2">
        <Button
          onPress={handleLikeButton}
          size="sm"
          color={isUserLiked ? "primary" : "default"}
          variant={isUserLiked ? "faded" : "light"}
          startContent={
            <Heart
              size={17}
              strokeWidth={2.4}
              className="transition-all ease-linear"
              color={`${isUserLiked ? "rgb(235, 87, 87)" : "#b6b6b6"}`}
            />
          }
        >
          <p
            className={`transition-all ease-linear ${isUserLiked ? "text-[rgb(235, 87, 87)]" : "text-[#b6b6b6]"} text-[.9rem]`}
          >
            {likes}
          </p>
        </Button>
        <Button
          onPress={() => setShowComments(!showComments)}
          size="sm"
          color={"default"}
          variant={"light"}
          startContent={
            <MessageCircle size={17} strokeWidth={2.4} color="#b6b6b6" />
          }
        >
          <p className="text-[.9rem] text-[#b6b6b6]">{comments.length}</p>
        </Button>
        <Button
          onPress={() => {}}
          size="sm"
          color={"default"}
          variant={"light"}
          startContent={<FiShare size={17} strokeWidth={2.4} color="#b6b6b6" />}
        >
          <p className="text-[.9rem] text-[#b6b6b6]">{likes}</p>
        </Button>
      </div>
      <AnimatePresence>
        {showComments && (
          <motion.div
            exit={{ scale: 0.9, opacity: 0, height: 0 }}
            initial={{ scale: 0.9, opacity: 0, height: 0 }}
            animate={{ scale: 1, opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <hr className="my-7 border-border" />
            <div>
              <div className="flex flex-row gap-4 items-center h-[45px] w-full">
                <img
                  src={currentUser.profile}
                  className="w-[45px] h-[45px] rounded-full"
                  alt=""
                />
                <div
                  className={`transition-all ease-linear flex-1 h-full px-5 rounded-xl relative ${isLoading ? "bg-[#1c1d1c]" : "bg-input"}`}
                >
                  <input
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    type="text"
                    disabled={isLoading}
                    className={`transition-all ease-linear w-full h-full bg-transparent text-[.85rem] font-normal placeholder:text-default-500 ${isLoading ? "text-[#9e9e9e]" : "text-white"}`}
                    placeholder="Share your comment..."
                  />
                  <Button
                    isDisabled={isLoading}
                    onPress={() => handleShareCommentButton()}
                    color="primary"
                    className={`transition-all ease-linear absolute right-0 top-0 bottom-0 h-auto w-auto m-1 ${userComment.length > 0 ? "scale-100" : "scale-0"}`}
                    isIconOnly
                  >
                    {isLoading ? (
                      <CircularProgress
                        color="default"
                        classNames={{
                          indicator: "stroke-white",
                          svg: "w-[25px] h-[25px]",
                        }}
                      />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
                </div>
              </div>
              <div className="my-5 flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <p className="font-light text-[.7rem] text-default-500">
                    All comments
                  </p>
                  <ChevronDown color="#A1A1AA" size={17} />
                </div>
                <div className="">
                  <Dropdown className="bg-card border-border">
                    <DropdownTrigger>
                      <p className="font-light text-[.7rem] text-default-500 cursor-pointer">
                        {" "}
                        Sort by{" "}
                        <span className="text-gray font-normal">
                          {selectedValue}
                        </span>
                      </p>
                    </DropdownTrigger>
                    <DropdownMenu
                      className="bg-card border-border"
                      aria-label="Single selection example"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                    >
                      <DropdownItem key="Most popular">
                        Most popular
                      </DropdownItem>
                      <DropdownItem key="Recent">Recent</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <div>
                {comments.length > 0 ? (
                  comments.map((comment: Models.Document) => (
                    <ThoughtCommentCard comment={comment} key={comment.$id} />
                  ))
                ) : (
                  <p className="text-center font-light text-[.7rem] text-default-500">
                    No comments yet
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ItemStats;
