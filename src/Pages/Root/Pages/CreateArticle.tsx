import "@blocknote/core/fonts/inter.css";
import { SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import '../../../globals.css';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArticleValidation } from "@/Database/Validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateArticle } from "@/Database/React Query/queries";
import { Link, useOutletContext } from "react-router-dom";
import { IUser } from "@/Types";
import toast from "react-hot-toast";
import { BadgeCheck } from "lucide-react";
import { Models } from "appwrite";

const CreateArticle = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useOutletContext<IUser>()
  const [showHtml, setShowHtml] = useState(false);
  const [html, setHTML] = useState<string>("");
  const { mutateAsync: createArticle } = useCreateArticle()

  const [isLoading, setIsLoading] = useState(false)
  const [isProgress, setIsProgress] = useState(false)
  const [isShare, setIsShare] = useState(false)

  const [Post, setPost] = useState<Models.Document | null>(null)

  const editor = useCreateBlockNote({
    defaultStyles: true,
  });

  const onChange = async () => {
    let htmlContent = await editor.blocksToHTMLLossy(editor.document);

    // <p></p> boş paragraflarını <br /> ile değiştirme
    htmlContent = htmlContent.replace(/<p><\/p>/g, "<br />");

    setHTML(htmlContent);
    form.setValue("inner", htmlContent)
    console.log(htmlContent);
  };

  const form = useForm<z.infer<typeof ArticleValidation>>({
    resolver: zodResolver(ArticleValidation),
    defaultValues: {
      title: "",
      subtitle: "",
      inner: ""
    }
  })

  const handleSubmitForm = async (data: z.infer<typeof ArticleValidation>) => {
    if (!data || user.id === "" || data.title === "" || data.subtitle === "" || data.inner === "") {
      toast.error("Title, subtitle, and article content are required!");
    } else if (data.inner.length <= 0) {
      toast.error("Article content cannot be this short!");
    } else {
      setIsLoading(true)
      setIsProgress(true)

      const article = await createArticle({ creator: user.id, ...data });

      if (article) {
        setPost(article)
        setIsLoading(false)
        setIsShare(true)
      } else {
        setIsLoading(false)
        setIsShare(false)
      }
    }
  }


  return (
    <div className="p-2 bg-[#1f1f1f] w-full h-screen overflow-y-auto">
      <Modal className="bg-card border-border" backdrop={"blur"} isOpen={isProgress} onClose={isProgress}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{isLoading ? "Post Sharing" : isShare ? "Post Sharing Succesfull" : !isShare ? "Post Sharing Failed" : ""}</ModalHeader>
              {isLoading && <ModalBody>
                <Spinner />
              </ModalBody>}
              {isShare ?
                <ModalBody>
                  <div className="flex flex-col w-full h-full text-center items-center justify-center my-10">
                    <BadgeCheck color="#17c964" size={40} />
                    <h1 className="text-[1rem] mt-6">Sharing Completed</h1>
                    <h2 className="text-[.8rem] mt-2 text-default-500">Your article is now live and ready for the world to see. Share your insights, inspire others, and let your voice be heard! Here’s the link to your article spread the word!</h2>

                    <div className="w-full p-2 bg-input rounded-lg border border-border mt-10 flex flex-row items-center justify-center">
                      <p className="overflow-hidden text-ellipsis text-[.8rem] text-foreground-500">https://deepexplorer.space/article/{Post?.$id}</p>
                    </div>
                  </div>
                </ModalBody>
                :
                null
              }
              <ModalFooter>
                {!isLoading &&
                  <>
                    <Button color="default" variant="light" onPress={() => setIsProgress(false)}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      <Link to={`/article/${Post?.$id}`}>
                        Go to article
                      </Link>
                    </Button>
                  </>}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)}>
          <div className="max-w-[1000px] m-auto my-10">
            <div className="fixed right-4 top-4 lg:left-24 lg:top-12">
              <Button variant="faded" type="submit" size="sm" >
                Share
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="ml-[22px] w-full h-[60px] flex flex-row items-center gap-3">
                        <p className="text-[#808080] text-[.8rem]">Title</p>
                        <Divider orientation="vertical" />
                        <input {...field} type="text" className="w-full h-full rounded-lg bg-transparent text-[2rem] font-bold placeholder:text-[#808080]" placeholder="Tell a story..." />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="mt-4 w-full h-[60px] flex flex-row items-center gap-3">
                        <p className="text-[#808080] text-[.8rem]">Subtitle</p>
                        <Divider orientation="vertical" />
                        <input {...field} type="text" className="w-full h-full rounded-lg bg-transparent text-[1.3rem] font-medium placeholder:text-[#808080]" placeholder="Tell a story..." />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="ml-[10px] mt-10 ">
              <BlockNoteView className="preview-container" data-theming-css-variables-demo editor={editor} onChange={onChange}>
              </BlockNoteView>
            </div>
          </div>
        </form>
      </Form>

      {/* <div dangerouslySetInnerHTML={{ __html: html }} className="w-[700px] border bg-[#333] text-white editor-p p-4 rounded-lg overflow-auto preview-container"></div> */}
    </div>
  );
}

export default CreateArticle;
