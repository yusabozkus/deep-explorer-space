import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Image } from "lucide-react";
import { convertFileToUrl } from "@/Database/utils";
import { Avatar } from "@nextui-org/react";

type ProfileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(convertFileToUrl(acceptedFiles[0]));
        },
        [file]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg"],
        },
    });

    return (
        <div {...getRootProps()} className="h-full relative w-min">
            <input {...getInputProps()} className="cursor-pointer" />

            <div className="cursor-pointer gap-4 h-full">
                <Avatar
                    className="w-[120px] h-[120px]"
                    alt="image"
                    src={fileUrl || "/assets/icons/profile-placeholder.svg"} />
            </div>

            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#000000af] backdrop-blur-sm w-full h-full rounded-full transition-all ease-linear opacity-0 hover:top-0 hover:opacity-100 cursor-pointer flex items-center justify-center">
                <Image />
            </div>
        </div>
    );
};

export default ProfileUploader;
