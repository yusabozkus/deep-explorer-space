import { Helmet } from "react-helmet-async";
import ArticleStats from "@/components/Shared/ArticleStats";
import { useGetArticleByID } from "@/Database/React Query/queries";
import { timeAgo } from "@/Database/utils";
import { Avatar, Spinner } from "@nextui-org/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const SingleArticle = () => {
    const { id } = useParams();
    const { data: article, refetch } = useGetArticleByID(id);

    const firstImageSrc = article?.inner.match(/<img[^>]+src="([^">]+)"/)?.[1];

    useEffect(() => {
        refetch();
    }, [id]);

    if (!id || !article) {
        return <Spinner />;
    }

    console.log(firstImageSrc);


    return (
        <>
            {/* OG Tags with Helmet */}
            <Helmet>
                <title>{article.title}</title>
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.subtitle + " - DES Articles"} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={firstImageSrc || article.creator.profile} />
                <meta property="og:url" content={`https://des-v1.netlify.app/article/${id}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.title + " - DES Articles"} />
                <meta name="twitter:description" content={article.subtitle} />
                <meta name="twitter:image" content={firstImageSrc || article.creator.profile} />
            </Helmet>

            {/* Main Article Content */}
            <article className="w-full max-w-[700px] m-auto mt-12 px-3 mb-20 lg:px-0 lg:mb-0">
                <section className="flex flex-col gap-10 z-10">
                    <div>
                        <h1 className="text-[2rem] text-white font-bold">{article.title}</h1>
                        <h2 className="text-[1.2rem] text-default-500 font-medium mt-1">{article.subtitle}</h2>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <Avatar size="lg" src={article.creator.profile} />
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-2">
                                <h4 className="text-[1rem] text-white">{article.creator.name}</h4>
                                <p className="text-[.6rem] text-gray mt-1">•</p>
                                <p className="text-[1rem] text-gray">Follow</p>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-[.8rem] text-default-500">3 min read</p>
                                <p className="text-[.6rem] text-default-500 mt-[2px]">•</p>
                                <p className="text-[.8rem] text-default-500">{timeAgo(article.$createdAt)}</p>
                            </div>
                        </div>
                    </div>
                    <ArticleStats article={article} />
                </section>
                <section
                    dangerouslySetInnerHTML={{ __html: article.inner }}
                    className="mt-12 preview-container"
                ></section>
            </article>
        </>
    );
};

export default SingleArticle;
