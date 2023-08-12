/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import GalerieFORM from '../components/GalerieFORM';
import { AppContext } from "../../context/AppContext";
import swal from 'sweetalert';
import GalerieTree from "../components/GalerieTree";
import SyncLoader from "react-spinners/SyncLoader";
import { css } from "@emotion/core";


const Galerie = () => {
    const { ApiServices } = useContext(AppContext);
    const { galerieUploadService } = ApiServices;
    const [galeries, setGaleries] = useState([])
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#1e90ff");

    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");

    const columns = ["Date de la photo", "Joindre la photo"];
    const inputsSkeleton = [
        { name: "date", label: columns[0], type: "date" },
        { name: "file", label: columns[1], type: "file" },
    ];


    const updateGalerieData = useCallback(async () => {

        const connectedUser = JSON.parse(localStorage.getItem("user"));
        try {
            const response = await galerieUploadService.findAllGaleries(connectedUser.laboratoriesHeaded[0]._id);
            if (response.data) {
                setGaleries(
                    response.data.sort(compare).map((galerie) => ({
                        ...galerie,
                        galerie: galerie,
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

    const addGalerie = async () => {
        try {
            swal({
                title: "Confirmation",
                text: "Etes vous sur de vouloir ajouter cet photo?",
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
                            formData.append(key, inputs[key])
                        })

                        formData.append('laboratory_id', laboratoryId);
                        const response = await galerieUploadService.createGalerie(formData);
                        setLoading(false)
                        swal("La photo à été ajouter avec succès", {
                            icon: "success",
                        });
                        if (response.data) {
                            updateGalerieData();
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

    const deleteGalerie = async (_id) => {

        try {
            swal({
                title: "Confirmation",
                text: "Etes vous sur de vouloir supprimer cet photo?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    const response = await galerieUploadService.deleteGalerie(_id);
                    if (response.data) updateGalerieData();
                    else throw Error();
                    swal("La photo à été supprimer avec succès", {
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



    const downloadPhoto = async (galerie) => {
        try {
            setLoading(true)
            const response = await galerieUploadService.findGalerie(galerie.split("/")[0], galerie.split("/")[1]);

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

    const removeElement = async (type, galerie) => {
        try {
            swal({
                title: "Confirmation",
                text: "Etes vous sur de vouloir supprimer cet photo?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    var racine = galerie.split("/")[0];
                    var element = galerie.split("/")[1];
                    const response = await galerieUploadService.removeElement(type, racine, element);
                    if (response.data) updateGalerieData();
                    else throw Error();
                    swal("La photo à été supprimer avec succès", {
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
            const response = await galerieUploadService.pushFile(form);
            if (response.data) {
                
                updateGalerieData();
                setLoading(false)
                swal("L'opération est terminèe!", `La photo ${file.name} a été ajouté avec succès`, "success");

            }
            else throw Error();
        } catch (error) {

        }
    }

    const clearInputs = () => {
        setInputs(() => ({
            date: "",
            galerie: "",
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        return action === "ADDING"
            ? addGalerie()
            : action === "EDITING"
                ? updateGalerie()
                : updateGalerieData();
    };

    const updateGalerie = () => {
        console.log("updating")
    }


    useEffect(() => {
        updateGalerieData();
        clearInputs();
    }, [updateGalerieData]);


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
                    title={`Archivage des photos `}
                    subTitle={`${galeries.length} photos`}
                />
            </div>
            <div className="row row-cards row-deck">
                <div className="col-md-6">
                    <GalerieFORM
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
                            <h3 className="card-title">Les Photos</h3>
                        </div>
                        <div className={`card-body form `}>
                            <GalerieTree data={galeries}
                                removeElement={removeElement}
                                downloadPhoto={downloadPhoto}
                                deleteGalerie={deleteGalerie}
                                pushFile={pushFile}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </Fragment >
    );
};


export default Galerie;
