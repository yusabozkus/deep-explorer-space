import { useLikeThought, useVoteArticle } from "@/Database/React Query/queries";
import { IUser } from "@/Types";
import { Button, Tooltip } from "@nextui-org/react";
import { Models } from "appwrite";
import {
  BadgeCheck,
  Bookmark,
  MessageCircle,
  MoreVertical,
  Share,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import Confetti from "react-confetti";

const ArticleStats = ({ article }: { article: Models.Document }) => {
  const currentUser = useOutletContext<IUser>();

  const { mutateAsync: toggleVote } = useVoteArticle();
  const [isUserVoted, setIsUserVoted] = useState(false);
  const [votes, setVotes] = useState(article.success_votes.length);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleArticleVote = async () => {
    setIsUserVoted(!isUserVoted);

    // Optimistically update like count
    setVotes(isUserVoted ? votes - 1 : votes + 1);

    try {
      await toggleVote({ item: article.$id, user: currentUser.id });

      // Confetti animation when voting is successful
      if (!isUserVoted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Confetti shown for 3 seconds
      }
    } catch (error) {
      // Revert the optimistic update in case of error
      setVotes(isUserVoted ? votes + 1 : votes - 1);
      setIsUserVoted(!isUserVoted);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const userHasLiked = (article.success_votes || []).some(
      (like: { user: { $id: string } }) => like.user.$id === currentUser.id
    );
    setIsUserVoted(userHasLiked);
  }, [article.success_votes, currentUser.id]);

  if (!article) return null;

  return (
    <div className="flex flex-row w-full justify-between items-center border-t border-b border-border py-2">
      {showConfetti && (
        <div className="absolute top-[70px] w-full max-w-[700px] p-1">
          <div className="relative">
            <Confetti className="left-0 w-full max-w-[700px]" />
          </div>
        </div>
      )}
      <div className="flex flex-row items-center gap-2">
        <Button size="sm" variant={isUserVoted ? 'shadow' : 'solid'} color={isUserVoted ? 'primary' : 'default'}>
          <div
            className={`transition-all ease-linear flex flex-row p-1 gap-2 cursor-pointer relative items-center justify-center`}
            onClick={() => handleArticleVote()}
          >
            <BadgeCheck
              color={`${isUserVoted ? "#fff" : "#71717A"}`}
              size={18}
            />
            <p
              className={`${isUserVoted ? "text-white" : "text-default-500"} text-[.85rem] font-light transition-all ease-linear mt-[2px]`}
            >
              {votes}
            </p>
          </div>
        </Button>
        <Button size="sm">
          <div className="flex flex-row p-1 gap-2">
            <MessageCircle color="#71717A" size={18} />
            <p className="text-[.85rem] font-light text-default-500 mt-[2px]">345</p>
          </div>
        </Button>
      </div>
      <div>
        <Tooltip
          closeDelay={100}
          content="Save"
          classNames={{
            content: "bg-card border border-border",
          }}
        >
          <Button variant="light" size="sm" isIconOnly>
            <Bookmark color="#71717A" size={20} />
          </Button>
        </Tooltip>

        <Tooltip
          closeDelay={100}
          content="Share"
          classNames={{
            content: "bg-card border border-border",
          }}
        >
          <Button variant="light" size="sm" isIconOnly>
            <Share color="#71717A" size={20} />
          </Button>
        </Tooltip>

        <Tooltip
          closeDelay={100}
          content="More"
          classNames={{
            content: "bg-card border border-border",
          }}
        >
          <Button variant="light" size="sm" isIconOnly>
            <MoreVertical color="#71717A" size={20} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ArticleStats;
