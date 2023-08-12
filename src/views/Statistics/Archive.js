/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import ArchivageFORM from '../components/ArchivageFORM';
import { AppContext } from "../../context/AppContext";
import swal from 'sweetalert';
import ArchiveTree from "../components/ArchiveTree";
import SyncLoader from "react-spinners/SyncLoader";


const Archive = () => {
    const { ApiServices } = useContext(AppContext);
    const { pvUploadService } = ApiServices;
    const [pvs, setPvs] = useState([])
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#1e90ff");


    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");



    const columns = ["Date du PV", "Joindre le rapport", "Joidre les annexes"];
    const inputsSkeleton = [
        { name: "date", label: columns[0], type: "date" },
        { name: "rapport", label: columns[1], type: "file" },
        { name: "annexe", label: columns[2], type: "file" },
    ];


    const updatePvData = useCallback(async () => {

        const connectedUser = JSON.parse(localStorage.getItem("user"));
        try {
            const response = await pvUploadService.findAllPvs(connectedUser.laboratoriesHeaded[0]._id);
            if (response.data) {
                setPvs(
                    response.data.sort(compare).map((pv) => ({
                        ...pv,
                        pv: pv,
                    }))
                );

            }
            else throw Error();
        } catch (error) {
            console.log(error)
        }
    }, []);

    const compare = (a, b) => {
        if (a.date < b.date) {
            return 1;
        }
        if (a.date > b.date) {
            return -1;
        }
        return 0;
    }

    const addPv = async () => {
        try {
            swal({
                title: "Confirmation",
                text: "Etes vous sur de vouloir ajouter cet procès verbale?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    try {
                        setLoading(true)
                        const laboratoryId = JSON.parse(localStorage.getItem("user")).laboratoriesHeaded[0]._id;
                        const formData = new FormData();
                        var keys = Object.keys(inputs);
                        keys.forEach((key) => {
                            console.log(inputs[key])
                            formData.append(key, inputs[key])
                        })

                        formData.append('laboratory_id', laboratoryId);
                        const response = await pvUploadService.createPv(formData);
                        setLoading(false)
                        swal("Le procès verbale à été ajouter avec succès", {
                            icon: "success",
                        });
                        if (response.data) {
                            updatePvData();
                            clearInputs();
                        }
                        else throw Error();
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    swal("Annulation du transaction!", "", "info");
                }
            });
        } catch (error) {
            console.log(error)
        }


    };

    const deletePv = async (_id) => {

        try {
            swal({
                title: "Confirmation",
                text: "Etes vous sur de vouloir supprimer cet procès verbale?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    const response = await pvUploadService.deletePv(_id);
                    if (response.data) updatePvData();
                    else throw Error();
                    swal("Le procès verbale à été supprimer avec succès", {
                        icon: "success",
                    });
                } else {
                    swal("Abortion du transaction!");
                }
            });
        } catch (error) {
            console.log(error)
        }
    }



    const downloadRapport = async (pv) => {
        try {
            setLoading(true)
            const response = await pvUploadService.findPv(pv.split("/")[0], pv.split("/")[1]);
            if (response.data) {

                const base64Response = await fetch(`data:${response.data.mimetype};base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(response.data.data.data)))}`);
                const blob = await base64Response.blob();
                var fileURL = URL.createObjectURL(blob);
                setLoading(false)
                window.open(fileURL);
            }


        } catch (error) {

            console.log(error)
        }
    }

    const removeElement = async (type, pv) => {
        try {
            swal({
                title: "Confirmation",
                text: "Etes vous sur de vouloir supprimer cet procès verbale?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    var racine = pv.split("/")[0];
                    var element = pv.split("/")[1];
                    const response = await pvUploadService.removeElement(type, racine, element);
                    if (response.data) updatePvData();
                    else throw Error();
                    swal("Le procès verbale à été supprimer avec succès", {
                        icon: "success",
                    });
                } else {
                    swal("Abortion du transaction!");
                }
            });
        } catch (error) {

            console.log(error)
        }
    }



    const pushFile = async (type, racineDestination, file) => {
        try {
            setLoading(true)
            console.log(type, racineDestination, file)
            var form = new FormData();
            form.append("type", type)
            form.append("racineDestination", racineDestination)
            form.append("file", file)
            const response = await pvUploadService.pushFile(form);
            if (response.data) {
                
                updatePvData();
                setLoading(false)
                swal("L'opération est terminèe!", `Le rapport ${file.name} a été ajouté avec succès`, "success");

            }
            else throw Error();
        } catch (error) {

        }
    }

    const clearInputs = () => {
        setInputs(() => ({
            date: "",
            file: "",
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        return action === "ADDING"
            ? addPv()
            : action === "EDITING"
                ? updatePv()
                : updatePvData();
    };

    const updatePv = () => {
        console.log("updating")
    }


    useEffect(() => {
        updatePvData();
        clearInputs();
    }, [updatePvData]);


    return (
        <Fragment>

            <div style={{
                position: "fixed",
                zIndex: "999",
                height: "2em",
                width: "4em",
                overflow: "show",
                margin: "auto",
                top: "0",
                left: "0",
                bottom: "0",
                right: "0",
            }}>
                <SyncLoader color={color} loading={loading} size={15} />

            </div>



            <div className="page-header">
                <PageHeader
                    title={`Archivage des PVs `}
                    subTitle={`${pvs.length} procédés verbaux`}
                />
            </div>
            <div className="row row-cards row-deck">
                <div className="col-md-6">
                    <ArchivageFORM
                        {...{
                            inputs,
                            setInputs,
                            inputsSkeleton,
                            handleSubmit,
                            action,
                        }}
                    />

                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Les Pvs</h3>
                        </div>
                        <div className={`card-body form `}>
                            <ArchiveTree data={pvs}
                                removeElement={removeElement}
                                downloadRapport={downloadRapport}
                                deletePv={deletePv}
                                pushFile={pushFile}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </Fragment >
    );
};


export default Archive;
