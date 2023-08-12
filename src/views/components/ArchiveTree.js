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


const ArchiveTree = ({ data, downloadRapport, deletePv, pushFile, removeElement }) => {

    const [test, setTest] = useState([]);
    const { user, ApiServices } = useContext(AppContext);
    const { pvUploadService } = ApiServices;

    useEffect(() => {
        setTest(data)
        console.log(user)
    }, [data]);

    const onNodeSelect = (nodeKey, node) => {
        if (node.includes("/"))
            downloadRapport(node)
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
            if (targetCategory == "rapport") {
                if (ev.dataTransfer.items.length > 1) {
                    swal("Plusieurs rapports!", "Vous avez choisi plusieurs rapports.", "info");
                    return;
                }

                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                    // If dropped items aren't files, reject them
                    if (ev.dataTransfer.items[i].kind === 'file') {
                        var file = ev.dataTransfer.items[i].getAsFile();
                        console.log(file.type)
                        if ((file.type == "application/pdf") || (file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {

                            checkAvailability(racineDestination).then(function (response) {
                                if (response.rapport.length == 0) {
                                    pushFile(targetCategory, racineDestination, file)
                                } else {
                                    swal("Plusieurs rapports!", "Vous ne pouvez avoir qu'un seul rapport.", "info");
                                }
                            })

                        } else {
                            swal("il ne s'agit pas d'un format valide!", "Vous devez choisir un fichier en format PDF ou DOC.", "info");
                            return;
                        }

                    }
                }

            } else {
                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                    // If dropped items aren't files, reject them
                    if (ev.dataTransfer.items[i].kind === 'file') {
                        var file = ev.dataTransfer.items[i].getAsFile();
                        pushFile(targetCategory, racineDestination, file)
                    }
                }
            }
        }
    }

    const checkAvailability = async (racineDestination) => {
        const response = await pvUploadService.findPvById(racineDestination)
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
                            <TreeItem nodeId={"rapports".concat(indexP)} label={"Procès-verbal"}>
                                {dataObjectRow.rapport.map((objectRow, indexC) => (

                                    <TreeItem nodeId={dataObjectRow._id.concat("/" + objectRow._id)} label={
                                        <div className="d-flex">
                                            <div className="mr-auto p-2">{objectRow.name}</div>
                                            <div className="p-2">
                                                <IconButton onClick={() => { downloadRapport(dataObjectRow._id.concat("/" + objectRow._id)) }} size="small" style={{ color: "#4caf50" }} component="span">
                                                    <GetAppRoundedIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    } />
                                ))}
                            </TreeItem>
                            <TreeItem nodeId={"annexes".concat(indexP)} label="Annexes">
                                {dataObjectRow.annexe.map((objectRow, indexC) => (

                                    <TreeItem nodeId={dataObjectRow._id.concat("/" + objectRow._id)} label={<div className="d-flex">
                                        <div className="mr-auto p-2">{objectRow.name}</div>
                                        <div className="p-2">
                                            <IconButton onClick={() => { downloadRapport(dataObjectRow._id.concat("/" + objectRow._id)) }} size="small" style={{ color: "#4caf50" }} component="span">
                                                <GetAppRoundedIcon />
                                            </IconButton>

                                        </div>
                                    </div>} />
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
                                    <IconButton onClick={() => { deletePv(dataObjectRow._id) }} size="small" color="secondary" component="span">
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </div>
                        } >
                            <TreeItem onDrop={dropHandler} id={dataObjectRow._id.concat("/rapport")} onDragOver={dragOverHandler} nodeId={"rapports".concat(indexP)} label={"Procès-verbal"}>
                                {dataObjectRow.rapport.map((objectRow, indexC) => (

                                    <TreeItem nodeId={dataObjectRow._id.concat("/" + objectRow._id)} label={
                                        <div className="d-flex">
                                            <div className="mr-auto p-2">{objectRow.name}</div>
                                            <div className="p-2">
                                                <IconButton onClick={() => { removeElement("rapport", dataObjectRow._id.concat("/" + objectRow._id)) }} size="small" color="secondary" component="span">
                                                    <HighlightOffOutlinedIcon />
                                                </IconButton>
                                                <IconButton onClick={() => { downloadRapport(dataObjectRow._id.concat("/" + objectRow._id)) }} size="small" style={{ color: "#4caf50" }} component="span">
                                                    <GetAppRoundedIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    } />
                                ))}
                            </TreeItem>
                            <TreeItem onDrop={dropHandler} id={dataObjectRow._id.concat("/annexe")} onDragOver={dragOverHandler} nodeId={"annexes".concat(indexP)} label="Annexes">
                                {dataObjectRow.annexe.map((objectRow, indexC) => (

                                    <TreeItem nodeId={dataObjectRow._id.concat("/" + objectRow._id)} label={<div className="d-flex">
                                        <div className="mr-auto p-2">{objectRow.name}</div>
                                        <div className="p-2">
                                            <IconButton onClick={() => { removeElement("annexe", dataObjectRow._id.concat("/" + objectRow._id)) }} size="small" color="secondary" component="span">
                                                <HighlightOffOutlinedIcon />
                                            </IconButton>
                                            <IconButton onClick={() => { downloadRapport(dataObjectRow._id.concat("/" + objectRow._id)) }} size="small" style={{ color: "#4caf50" }} component="span">
                                                <GetAppRoundedIcon />
                                            </IconButton>
                                        </div>
                                    </div>} />
                                ))}
                            </TreeItem>
                        </TreeItem>
                    ))}

                </TreeView>

            </div>)}
        </div>



    );
};

export default ArchiveTree;