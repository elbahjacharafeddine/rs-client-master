/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";
import ArchiveTree from "../components/ArchiveTree";
import SyncLoader from "react-spinners/SyncLoader";

const GenralAssembly = () => {
    const { ApiServices } = useContext(AppContext);
    const { pvUploadService, teamService } = ApiServices;
    const [pvs, setPvs] = useState([])
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#1e90ff");


    const updatePvData = useCallback(async () => {
        const teamId = JSON.parse(localStorage.getItem("user")).teamsMemberships[0].team_id;
        setLoading(true)
        try {
            const teamsResponse = await teamService.findTeam(teamId);
            const response = await pvUploadService.findAllPvs(teamsResponse.data.laboratory_id);
            
            if (response.data) {
                console.log(response.data)
                setPvs(
                    response.data.map((pv) => ({
                        ...pv,
                        pv: pv,
                    }))
                );
                setLoading(false)

            }
            else throw Error();
        } catch (error) {
            console.log(error)
        }
    }, []);



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



    useEffect(() => {
        updatePvData();
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
                    title={`Consultation des PVs `}
                    subTitle={`${pvs.length} procédés verbaux`}
                />
            </div>
            <div className="row row-cards row-deck">
                <div className="col-md-12">
                    <div className="card">
                      
                        <div className={`card-body form `}>
                            <ArchiveTree data={pvs}
                                downloadRapport={downloadRapport} />

                        </div>
                    </div>
                </div>

            </div>
        </Fragment>
    );
};


export default GenralAssembly;
