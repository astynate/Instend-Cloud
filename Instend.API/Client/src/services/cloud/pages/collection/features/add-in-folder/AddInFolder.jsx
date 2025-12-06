import { useParams } from "react-router-dom";
import AddButton from "../../../../ui-kit/buttons/add-button/Add";
import excel from './images/types/excel.png';
import newFolder from './images/types/new-folder.png';
import note from './images/types/note.png';
import powerpoint from './images/types/powerpoint.png';
import upload from './images/types/upload.png';
import word from './images/types/word.png';
import CloudController from "../../../../api/CloudController";
import CollectionsController from "../../../../api/CollectionsController";

const AddInFolder = ({OpenDialog = () => {}}) => {
    let params = useParams();
    
    const types = {
        "collection": {
            title: "Create collection",
            text: "Name is required",
            placeholder: "Collection name",
            type: "collection",
            callback: CollectionsController.CreateCollection
        },
        "txt": {
            title: "Create note",
            text: "Name is required",
            placeholder: "Note name",
            type: "txt"
        },
        "docx": {
            title: "Create Word Document",
            text: "Name is required",
            placeholder: "Document name",
            type: "docx"
        },
        "xlsx": {
            title: "Create Excel Table",
            text: "Name is required",
            placeholder: "Table name",
            type: "xlsx"
        },
        "pptx": {
            title: "Create Powerpoint Presentation",
            text: "Name is required",
            placeholder: "Presentation name",
            type: "pptx"
        }
    };

    return (
        <AddButton
            items={[
                {image: newFolder, title: "Collection", callback: () => OpenDialog(types.collection)},
                {image: upload, title: "Upload", callback: () => {}, type: "upload", sendFiles: (event) => CloudController.UploadFilesFromEvent(event, params.id)},
                // {image: note, title: "Note", callback: () => OpenDialog(types.txt)},
                // {image: word, title: "Word", callback: () => OpenDialog(types.docx)},
                // {image: excel, title: "Excel", callback: () => OpenDialog(types.xlsx)},
                // {image: powerpoint, title: "Powerpoint", callback: () => OpenDialog(types.pptx)}
            ]}
        />
    );
}

export default AddInFolder;