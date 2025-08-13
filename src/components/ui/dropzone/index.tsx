import {
    Dropzone as DropzonePrimitive,
    DropzoneDescription,
    DropzoneGroup,
    DropzoneInput,
    DropzoneTitle,
    DropzoneUploadIcon,
    DropzoneZone,
} from "@/components/ui/dropzone/dropzone"
import { Accept } from "react-dropzone";
import {
    FileList,
    FileListAction,
    FileListActions,
    FileListDescription,
    FileListHeader,
    FileListIcon,
    FileListInfo,
    FileListItem,
    FileListName,
    FileListSize,
} from "@/components/ui/file-list/file-list"
import { Trash2 } from "lucide-react";

type DropzoneProps = {
    file?: File
    setFiles: (files: File | undefined) => void;
    accept?: Accept
}

const defaultAccept: Accept = {
    "image/*": [".jpg", ".png", ".jpeg", ".webp"],
}

export const Dropzone = ({ file, setFiles, accept = defaultAccept }: DropzoneProps) => {

    return (

        <DropzonePrimitive
            accept={accept}
            maxSize={5 * 1024 * 1024} // 5MB
            onDropAccepted={(files) => {
                setFiles(files[0]);
            }}
        >
            <div className="flex flex-col gap-4">

                <DropzoneZone>
                    <DropzoneInput />
                    <DropzoneGroup className="gap-4">
                        <DropzoneUploadIcon />
                        <DropzoneGroup>
                            <DropzoneTitle>Arraste e solte seus arquivos aqui</DropzoneTitle>
                            <DropzoneDescription>
                                Você pode enviar arquivos de até 5MB. Formatos suportados: JPG, PNG,
                                JPEG.
                            </DropzoneDescription>
                        </DropzoneGroup>
                    </DropzoneGroup>
                </DropzoneZone>

                {file && (
                    <FileList>
                        <FileListItem>
                            <FileListHeader>
                                <FileListIcon />
                                <FileListInfo>
                                    <FileListName>{file.name}</FileListName>
                                    <FileListDescription>
                                        <FileListSize>{file.size}</FileListSize>

                                    </FileListDescription>
                                </FileListInfo>
                                <FileListActions>
                                    <FileListAction onClick={() => setFiles(undefined)}>
                                        <Trash2 />
                                        <span className="sr-only">Remove</span>
                                    </FileListAction>
                                </FileListActions>
                            </FileListHeader>

                        </FileListItem>
                    </FileList>
                )}
            </div>
        </DropzonePrimitive>

    )

}

