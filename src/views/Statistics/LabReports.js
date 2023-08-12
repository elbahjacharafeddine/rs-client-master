/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";

import "c3/c3.css";

import LabReportsForm from "../components/LabReportsForm";

const LabReports = () => {
    const [researchersStatistics, setResearchersStatistics] = useState([]);
    const [labPublications, setLabPublications] = useState([]);
    const [loading, setLoading] = useState(false);
    const title = "Rapport par Laboratoire"

    const [inputs, setInputs] = useState({
        year: 2019,
        laboratoire: "Choisissez une option"
    });

    const [filter, setFilter] = useState(null);
    const [filteringOptions, setFilteringOptions] = useState(null);

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [laboratoire, setLaboratoire] = useState("");
    const [options, setOptions] = useState([]);
    const willPrint = true;
    const { user, ApiServices } = useContext(AppContext);
    const { statisticsService, userService, laboratoryService } = ApiServices;
    const columns = ["Laboratoire", "Année"];
    const inputsSkeleton = [
        {
            name: "laboratoire",
            label: columns[0],
            type: "select",
            options: options,
        },
        {
            name: "year",
            label: columns[1],
            type: "select",
            options: Array(2040 - 2015 + 1).fill().map((_, idx) => 2015 + idx),
        },
    ];


    const updateFilteringOptionsData = useCallback(async () => {
        try {
            let response = await laboratoryService.findAllLaboratories();

            if (response.data) {

                setFilteringOptions(response.data.filter((lab) => { return lab.head_id == user._id }));
            }
            else throw Error();
        } catch (error) {
            console.log(error)
        }
    }, [user._id]);



    const updateFollowedUsersData = useCallback(async () => {
        try {
            const response = await statisticsService.getStatistics(filter);
            if (response.data) setResearchersStatistics(response.data);
            else throw Error();
        } catch (error) {
            console.log(error)
        }
    }, [filter]);


    const setLabPublicationByYear = useCallback(async (year) => {
        setLoading(true);

        //const response = await statisticsService.getPublicationsPerTeam(req);
        //console.log(response.data)
        const response = await userService.getFollowedUsers({ "laboratory_abbreviation": inputs.laboratoire });

        try {
            if (response.data) {
                var pubs = new Map();
                response.data.forEach((data) => {
                    data.publications.forEach((pub) => {
                        if (pub.year == year){
                            pubs.set(pub.title.toLowerCase(), pub)
                        }
                    })
                })
                pubs = Array.from(pubs).map((pub)=>{return pub[1]})
                setLabPublications(pubs);
                setLoading(false);
            } else throw Error();

        } catch (error) {

        }
    })


    useEffect(() => {
        updateFilteringOptionsData();
        setLabPublicationByYear(inputs.year.toString());

    }, [updateFilteringOptionsData, researchersStatistics]);

    useEffect(() => {
        if (filteringOptions != null)
            setOptions(filteringOptions.map(option => option.abbreviation))
    }, [filteringOptions])


    useEffect(() => {
        setLabPublicationByYear(inputs.year.toString());
    }, [filter, researchersStatistics, inputs])
    useEffect(() => {
        if (!filter) return;
        if (!isSearchActive) setIsSearchActive(true);
        updateFollowedUsersData();

        setLaboratoire(inputs.laboratoire);

    }, [filter, isSearchActive, updateFollowedUsersData, inputs]);




    return (
        <Fragment>
            <div className="page-header">
                <PageHeader
                    title="Imprimer rapport"

                />
            </div>


            <div className="row row-cards row-deck">
                <div className="col-md-6">
                    <LabReportsForm
                        {...{
                            inputs,
                            setInputs,
                            inputsSkeleton,
                            title,
                            willPrint,
                            labPublications,
                            loading
                        }}
                    />
                </div>

            </div>
        </Fragment>


    );
};

export default LabReports;
