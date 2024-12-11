import ThoughtCard from "@/components/Cards/ThoughtCard";
import Create from "@/components/Shared/Create";
import { useGetThoughts } from "@/Database/React Query/queries";
import { IUser } from "@/Types";
import { CircularProgress, Tab, Tabs } from "@nextui-org/react";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const user = useOutletContext<IUser>();

  const { data: thought } = useGetThoughts();

  return (
    <div className="w-full p-4 flex flex-row gap-6">
      <div className="flex-1 flex flex-col gap-4 max-w-[650px] m-auto">
        <Create user={user} />
        <div className="flex flex-col mt-10">
          {thought?.total > 0 ? (
            thought?.documents.map((thought, index) => (
              <ThoughtCard user={user} key={index} thought={thought} />
            ))
          ) : (
            <div className="w-full flex items-center justify-center">
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
