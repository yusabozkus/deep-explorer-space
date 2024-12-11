import ArticleCard from "@/components/Cards/ArticleCard"
import { useGetArticles } from "@/Database/React Query/queries"
import { Button, Link, Skeleton, Spinner, Tab, Tabs } from "@nextui-org/react"


const Articles = () => {

  const { data: articles } = useGetArticles()

  return (
    <div className='w-full h-full flex flex-row gap-4 max-w-[1100px] m-auto mb-20 lg:mb-0'>
      <div className="flex-1 pr-0 pt-5 lg:pr-16 lg:pt-7">
        <div className="sticky top-[55px] lg:top-[90px] py-2 bg-[#00000000] rounded-none backdrop-blur-sm lg:rounded-xl lg:backdrop-blur-lg">
          <Tabs size="md" aria-label="Options" color="primary" className="border-border text-gray" variant="underlined">
            <Tab
              key="recents"
              title={
                <div className="flex items-center space-x-2">
                  <span>For you</span>
                </div>
              }
            />
            <Tab
              key="popular"
              title={
                <div className="flex items-center space-x-2">
                  <span>Following</span>
                </div>
              }
            />
            <Tab
              key="my-articles"
              title={
                <div className="flex items-center space-x-2">
                  <span>My Articles</span>
                </div>
              }
            />
            <Tab
              key="my-drafts"
              title={
                <div className="flex items-center space-x-2">
                  <span>My Drafts</span>
                </div>
              }
            />
          </Tabs>
        </div>

        <ul className="mt-10 flex flex-col gap-14 px-3 lg:px-0">
          {articles?.documents ? articles?.documents.map((article, index) => (
            <li key={index}>
              <ArticleCard article={article} />
            </li>
          )) :
            [1, 2, 3].map((article, index) => (
              <article className="flex flex-row gap-20 w-full">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-row items-center gap-3">
                    <Skeleton className='rounded-full w-[35px] h-[35px]' />
                    <Skeleton className="w-full max-w-[200px] h-[20px] rounded-lg" />
                  </div>
                  <div className="">
                    <Skeleton className="w-full h-[40px] rounded-lg" />
                    <Skeleton className="w-full h-[20px] mt-2 rounded-lg" />
                  </div>
                  <div className="flex flex-row gap-3">
                    <Skeleton className="w-[120px] h-[20px] rounded-lg" />
                    <Skeleton className="w-[80px] h-[20px] rounded-lg" />
                    <Skeleton className="w-[80px] h-[20px] rounded-lg" />
                  </div>
                </div>
                <div className="w-[150px] h-[150px]">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
              </article>
            ))}
        </ul>
      </div>
      <div className="w-[300px] border-l border-border pt-10 pl-10 hidden lg:flex ">
        <ul className="flex flex-col gap-8 overflow-y-auto sticky top-[70px]">
          <li>
            <div>
              <h4 className="text-white font-medium text-[1rem]">Staff Picks</h4>
              <ul className="mt-6 flex flex-col gap-7">
                <li>
                  <div className="flex flex-row items-center gap-3">
                    <img
                      src="https://miro.medium.com/v2/resize:fill:48:48/1*Bp03drPMBMNc_j-uH2TU7Q.jpeg"
                      className="w-[22px] h-[22px] object-cover rounded-full" alt="" />
                    <h3 className="text-white text-[.75rem] font-normal mt-[2px]">Alex Mathers</h3>
                  </div>
                  <h3 className="text-white font-bold text-[.9rem] mt-4">The Science Behind AI’s First Nobel Prize</h3>
                </li>
                <li>
                  <div className="flex flex-row items-center gap-3">
                    <img
                      src="https://miro.medium.com/v2/resize:fill:48:48/1*Bp03drPMBMNc_j-uH2TU7Q.jpeg"
                      className="w-[22px] h-[22px] object-cover rounded-full" alt="" />
                    <h3 className="text-white text-[.75rem] font-normal mt-[2px]">Alex Mathers</h3>
                  </div>
                  <h3 className="text-white font-bold text-[.9rem] mt-4">The Science Behind AI’s First Nobel Prize</h3>
                </li>
                <li>
                  <div className="flex flex-row items-center gap-3">
                    <img
                      src="https://miro.medium.com/v2/resize:fill:48:48/1*Bp03drPMBMNc_j-uH2TU7Q.jpeg"
                      className="w-[22px] h-[22px] object-cover rounded-full" alt="" />
                    <h3 className="text-white text-[.75rem] font-normal mt-[2px]">Alex Mathers</h3>
                  </div>
                  <h3 className="text-white font-bold text-[.9rem] mt-4">The Science Behind AI’s First Nobel Prize</h3>
                </li>
              </ul>
              <Link className="text-[.75rem] mt-5 font-light cursor-pointer" onPress={() => { alert("sadas") }}>
                See the full list
              </Link>
            </div>
          </li>
          <li>
            <div>
              <h4 className="text-white font-medium text-[1rem]">Recommended Topics</h4>
              <ul className="mt-6 flex flex-wrap gap-2">
                <li className="bg-default p-2 border border-border w-max rounded-2xl">
                  <p className="text-[.7rem] font-normal text-gray">Programming</p>
                </li>
                <li className="bg-default p-2 border border-border w-max rounded-2xl">
                  <p className="text-[.7rem] font-normal text-gray">Self Improvement</p>
                </li>
                <li className="bg-default p-2 border border-border w-max rounded-2xl">
                  <p className="text-[.7rem] font-normal text-gray">Data Science</p>
                </li>
                <li className="bg-default p-2 border border-border w-max rounded-2xl">
                  <p className="text-[.7rem] font-normal text-gray">Writing</p>
                </li>
                <li className="bg-default p-2 border border-border w-max rounded-2xl">
                  <p className="text-[.7rem] font-normal text-gray">Politics</p>
                </li>
              </ul>
              <Link className="text-[.75rem] mt-5 font-light cursor-pointer" onPress={() => { alert("sadas") }}>
                See more topics
              </Link>
            </div>
          </li>
          <li>
            <div>
              <h4 className="text-white font-medium text-[1rem]">Who To Follow</h4>
              <ul className="mt-6 flex flex-wrap gap-6">
                <li className="flex flex-row gap-3 justify-between">
                  <div className="flex flex-row gap-4">
                    <img
                      src="https://miro.medium.com/v2/resize:fill:48:48/1*Bp03drPMBMNc_j-uH2TU7Q.jpeg"
                      className="w-[35px] h-[35px] rounded-full object-cover" alt="" />
                    <div>
                      <h1 className="text-[.9rem] font-semibold">Alex Mathers</h1>
                      <h4 className="text-[.7rem] font-normal text-default-500 mt-2">Helping you develop a consistent writing habit with impact.</h4>
                    </div>
                  </div>
                  <Button size="sm" variant="flat">
                    Follow
                  </Button>
                </li>
                <li className="flex flex-row gap-3 justify-between">
                  <div className="flex flex-row gap-4">
                    <img
                      src="https://miro.medium.com/v2/resize:fill:48:48/1*Bp03drPMBMNc_j-uH2TU7Q.jpeg"
                      className="w-[35px] h-[35px] rounded-full object-cover" alt="" />
                    <div>
                      <h1 className="text-[.9rem] font-semibold">Alex Mathers</h1>
                      <h4 className="text-[.7rem] font-normal text-default-500 mt-2">Helping you develop a consistent writing habit with impact.</h4>
                    </div>
                  </div>
                  <Button size="sm" variant="flat">
                    Follow
                  </Button>
                </li>
                <li className="flex flex-row gap-3 justify-between">
                  <div className="flex flex-row gap-4">
                    <img
                      src="https://miro.medium.com/v2/resize:fill:48:48/1*Bp03drPMBMNc_j-uH2TU7Q.jpeg"
                      className="w-[35px] h-[35px] rounded-full object-cover" alt="" />
                    <div>
                      <h1 className="text-[.9rem] font-semibold">Alex Mathers</h1>
                      <h4 className="text-[.7rem] font-normal text-default-500 mt-2">Helping you develop a consistent writing habit with impact.</h4>
                    </div>
                  </div>
                  <Button size="sm" variant="flat">
                    Follow
                  </Button>
                </li>
              </ul>
              <Link className="text-[.75rem] mt-5 font-light cursor-pointer" onPress={() => { alert("sadas") }}>
                See more users
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Articles
