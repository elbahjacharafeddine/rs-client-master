import React, { useEffect, useCallback, useState, useContext } from "react";

import TreeView from '@material-ui/lab/TreeView';

import TreeItem from '@material-ui/lab/TreeItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import { IconButton, Typography } from "@material-ui/core";
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import DeleteIcon from '@material-ui/icons/Delete'
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import swal from "sweetalert";
import { AppContext } from "../../context/AppContext";
import green from '@material-ui/core/colors/green';


const GalerieTree = ({ data, downloadPhoto, deleteGalerie, pushFile, removeElement }) => {

    const [test, setTest] = useState([]);
    const { user, ApiServices } = useContext(AppContext);
    const { galerieUploadService } = ApiServices;

    useEffect(() => {
        setTest(data)
        console.log(user)
    }, [data]);

    const onNodeSelect = (nodeKey, node) => {
        if (node.includes("/"))
            downloadPhoto(node)
    }

    const MinusSquare = (props) => {
        return (
            <SvgIcon fontSize="inherit" style={{ width: 14, height: 14, color: "red" }} {...props}>
                {/* tslint:disable-next-line: max-line-length */}
                <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
            </SvgIcon>
        );
    }

    const PlusSquare = (props) => {
        return (
            <SvgIcon fontSize="inherit" style={{ width: 14, height: 14, color: "#4BB543" }} {...props}>
                {/* tslint:disable-next-line: max-line-length */}
                <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
            </SvgIcon>
        );
    }

    const CloseSquare = (props) => {
        return (
            <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14, color: "#f0ad4e" }} {...props}>
                {/* tslint:disable-next-line: max-line-length */}
                <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
            </SvgIcon>
        );
    }


    const dropHandler = (ev) => {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        var racineDestination = ev.currentTarget.id.split("/")[0];
        var targetCategory = ev.currentTarget.id.split("/")[1];


        if (ev.dataTransfer.items) {
            if (targetCategory == "photo") {
                if (ev.dataTransfer.items.length > 1) {
                    swal("Plusieurs photos!", "Vous avez choisi plusieurs photos.", "info");
                    return;
                }

                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                    // If dropped items aren't files, reject them
                    if (ev.dataTransfer.items[i].kind === 'file') {
                        var file = ev.dataTransfer.items[i].getAsFile();
                        if (file.type == "image/jpeg") {

                            checkAvailability(racineDestination).then(function (response) {
                                if (response.photo.length == 0) {
                                    pushFile(targetCategory, racineDestination, file)
                                } else {
                                    swal("Plusieurs photos!", "Vous ne pouvez avoir qu'une seule photo.", "info");
                                }
                            })

                        } else {
                            swal("il ne s'agit pas d'une photo!", "Vous devez choisir un fichier en format jpg.", "info");
                            return;
                        }

                    }
                }

            } 
        }
    }

    const checkAvailability = async (racineDestination) => {
        const response = await galerieUploadService.findGalerieById(racineDestination)
        return response.data;
    }

    const dragOverHandler = (ev) => {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }



    return (

        <div>

            {user.roles.includes("RESEARCHER") && !user.roles.includes("LABORATORY_HEAD") && (<div>
                <TreeView

                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpandIcon={<PlusSquare />}
                >

                    {data.map((dataObjectRow, indexP) => (
                        <TreeItem nodeId={"item".concat(indexP)} label={

                            <div className="d-flex">
                                <div className="mr-auto p-2">{dataObjectRow.date.split("T")[0]}</div>

                            </div>
                        } >
                            <TreeItem nodeId={"photos".concat(indexP)} label={"Photo"}>
                                {dataObjectRow.photo.map((objectRow, indexC) => (

                                    <TreeItem nodeId={dataObjectRow._id.concat("/" + objectRow._id)} label={
                                        <div className="d-flex">
                                            <div className="mr-auto p-2">{objectRow.name}</div>
                                            <div className="p-2">
                                                <button onClick={() => { downloadPhoto(dataObjectRow._id.concat("/" + objectRow._id)) }} className="mr-2 btn-sm btn btn-outline-success">Télécharger</button>
                                            </div>
                                        </div>
                                    } />
                                ))}
                            </TreeItem>
                            
                        </TreeItem>
                    ))}

                </TreeView>

            </div>
            )}



            {user.roles.includes("LABORATORY_HEAD") && (<div>

                <TreeView

                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpandIcon={<PlusSquare />}
                >

                    {data.map((dataObjectRow, indexP) => (
                        <TreeItem nodeId={"item".concat(indexP)} label={

                            <div className="d-flex">
                                <div className="mr-auto p-2">{dataObjectRow.date.split("T")[0]}</div>
                                <div className="p-2">
                                    <IconButton onClick={() => { deleteGalerie(dataObjectRow._id) }} size="small" color="secondary" component="span">
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </div>
                        } >
                            <TreeItem onDrop={dropHandler} id={dataObjectRow._id.concat("/photo")} onDragOver={dragOverHandler} nodeId={"photos".concat(indexP)} label={"Photo"}>
                                {dataObjectRow.photo.map((objectRow, indexC) => (

                                    <TreeItem nodeId={dataObjectRow._id.concat("/" + objectRow._id)} label={
                                        <div className="d-flex">
                                            <div className="mr-auto p-2">{objectRow.name}</div>
                                            <div className="p-2">
                                                <IconButton onClick={() => { removeElement("photo", dataObjectRow._id.concat("/" + objectRow._id)) }} size="small" color="secondary" component="span">
                                                    <HighlightOffOutlinedIcon />
                                                </IconButton>
                                                <IconButton onClick={() => { downloadPhoto(dataObjectRow._id.concat("/" + objectRow._id)) }} size="small" style={{ color: "#4caf50" }} component="span">
                                                    <GetAppRoundedIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    } />
                                ))}
                            </TreeItem>
                            
                        </TreeItem>
                    ))}

                </TreeView>

            </div>)}
        </div>



    );
};

export default GalerieTree;
