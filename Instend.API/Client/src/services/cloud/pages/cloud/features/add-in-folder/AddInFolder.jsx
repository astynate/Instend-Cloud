import { useParams } from "react-router-dom";
import StorageController from "../../../../api/StorageController";
import AddButton from "../../../../ui-kit/buttons/add-button/Add";
import excel from './images/types/excel.png';
import illustrator from './images/types/illustrator.png';
import newFolder from './images/types/new-folder.png';
import note from './images/types/note.png';
import photoshop from './images/types/photoshop.png';
import powerpoint from './images/types/powerpoint.png';
import upload from './images/types/upload.png';
import word from './images/types/word.png';

const AddInFolder = ({OpenDialog = () => {}}) => {
    let params = useParams();
    
    const types = {
        "folder": {
            title: "Create folder",
            text: "Name is required",
            placeholder: "Folder name",
            type: "folder"
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
        },
        "psd": {
            title: "Create Phoshop file",
            text: "Name is required",
            placeholder: "File name",
            type: "psd"
        },
        "ai": {
            title: "Create Illustrator file",
            text: "Name is required",
            placeholder: "File name",
            type: "ai"
        }
    }

    return (
        <AddButton
            items={[
                {image: newFolder, title: "Folder", callback: () => OpenDialog(types.folder)},
                {image: upload, title: "Upload", callback: () => {}, type: "upload", sendFiles: (event) => StorageController.UploadFilesFromEvent(event, params.id)},
                {image: note, title: "Note", callback: () => OpenDialog(types.txt)},
                {image: word, title: "Word", callback: () => OpenDialog(types.docx)},
                {image: excel, title: "Excel", callback: () => OpenDialog(types.xlsx)},
                {image: powerpoint, title: "Powerpoint", callback: () => OpenDialog(types.pptx)},
                {image: photoshop, title: "Photoshop", callback: () => OpenDialog(types.psd)},
                {image: illustrator, title: "Illustrator", callback: () => OpenDialog(types.ai)}
            ]}
        />
    );
}

export default AddInFolder;