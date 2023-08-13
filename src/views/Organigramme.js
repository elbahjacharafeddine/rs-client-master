import React from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import { AppContext } from '../context/AppContext';
import PageHeader from './components/PageHeader';
import { useState, useCallback, useEffect, useContext, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '../views/styleOrganigramme.css'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pivote from '../assets/images/pivot.png'
import ReactDOMServer from 'react-dom/server';

import domtoimage from 'dom-to-image';
import logo from '../assets/images/avatar.jpg'

import ReactToPrint from "react-to-print";



const Organigramme = () => {
    const { user, ApiServices, UserHelper } = useContext(AppContext);
    const { laboratoryService } = ApiServices;
    const [printed, setPrinted] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [nodes, setNodes] = useState([]);

    const [laboratoire, setLaboratoire] = useState("")

    // data pour chef de laboratoire
    const [dataChefLab, setDataChefLab] = useState("");
    //fin

    //data pour les chefs d'equipes
    const [dataChefsEquipes, setDataChefsEquipes] = useState([]);
    //data pour les membres d'equipes
    const [dataMembres, setDataMembres] = useState([])
    //les couleurs 
    const colors = [
        "aliceblue",
        "antiquewhite",
        "aqua",
        "aquamarine",
        "beige",
        "bisque",
        "black",
        "blanchedalmond",
        "blue",
        "blueviolet",
        "brown",
        "burlywood",
        "cadetblue",
        "chartreuse",
        "chocolate",
        "coral",
        "cornflowerblue",
        "cornsilk",
        "crimson",
        "cyan",
        "darkblue",
        "darkcyan",
        "darkgoldenrod",
        "darkgray",
        "darkgreen",
        "darkkhaki",
        "darkmagenta",
        "darkolivegreen",
        "darkorange",
        "darkorchid",
        "darkred",
        "darksalmon",
        "darkseagreen",
        "darkslateblue",
        "darkslategray",
        "darkturquoise",
        "darkviolet",
        "deeppink",
        "deepskyblue",
        "dimgray",
        "dodgerblue",
        "firebrick",
        "floralwhite",
        "forestgreen",
        "fuchsia",
        "gainsboro",
        "ghostwhite",
        "gold",
        "goldenrod",
        "gray",
        "green",
        "greenyellow",
        "honeydew",
        "hotpink",
        "indianred",
        "indigo",
        "ivory",
        "khaki",
        "lavender",
        "lavenderblush",
        "lawngreen",
        "lemonchiffon",
        "lightblue",
        "lightcoral",
        "lightcyan",
        "lightgoldenrodyellow",
        "lightgray",
        "lightgreen",
        "lightpink",
        "lightsalmon",
        "lightseagreen",
        "lightskyblue",
        "lightslategray",
        "lightsteelblue",
        "lightyellow",
        "lime",
        "limegreen",
        "linen",
        "magenta",
        "maroon",
        "mediumaquamarine",
        "mediumblue",
        "mediumorchid",
        "mediumpurple",
        "mediumseagreen",
        "mediumslateblue",
        "mediumspringgreen",
        "mediumturquoise",
        "mediumvioletred",
        "midnightblue",
        "mintcream",
        "mistyrose",
        "moccasin",
        "navajowhite",
        "navy",
        "oldlace",
        "olive",
        "olivedrab",
        "orange",
        "orangered",
        "orchid",
        "palegoldenrod",
        "palegreen",
        "paleturquoise",
        "palevioletred",
        "papayawhip",
        "peachpuff",
        "peru",
        "pink",
        "plum",
        "powderblue",
        "purple",
        "rebeccapurple",
        "red",
        "rosybrown",
        "royalblue",
        "saddlebrown",
        "salmon",
        "sandybrown",
        "seagreen",
        "seashell",
        "sienna",
        "silver",
        "skyblue",
        "slateblue",
        "slategray",
        "snow",
        "springgreen",
        "steelblue",
        "tan",
        "teal",
        "thistle",
        "tomato",
        "turquoise",
        "violet",
        "wheat",
        "white",
        "whitesmoke",
        "yellow",
        "yellowgreen"
    ];

    const getRandomIndex = (list) => {
        const randomIndex = Math.floor(Math.random() * list.length);
        return randomIndex;
    }

    // fonction pour le mappage
    const childernDataMembres = (listMembres, item, color) => {
        return listMembres
            .filter((e) => e.stpid === item.stpid && e.id != item.id)
            .map((e) => {
                return {
                    label: 'Membre',
                    type: 'person',
                    className: `${printed ? 'p-person' : 'pp-person'}`,
                    expanded: true,
                    data: { name: e.name, avatar: logo },
                    style: { background: color }
                };

            });
    };

    const childrenData = dataChefsEquipes.map((item) => {
        const randomIndex = getRandomIndex(colors);
        return {
            label: item.title,
            type: 'person',
            className: `${printed ? 'p-person' : 'pp-person'}`,
            expanded: true,
            data: { name: item.name, avatar: logo },
            children: childernDataMembres(dataMembres, item, colors[randomIndex]),
            style: { background: colors[randomIndex] }
        };
    });

    const updateNodes = useCallback(async () => {
        let orgChartNodes;
        orgChartNodes = await laboratoryService.getNodesForOrgChart();
        console.log(orgChartNodes.data[0]);
        setDataChefLab(orgChartNodes.data[0])
        const phrase = orgChartNodes.data[0].title;
        const nouvellePhrase = phrase.replace(/chef de /i, "");
        const phraseFinale = "Organigramme de " + nouvellePhrase;
        setLaboratoire(phraseFinale)
        console.log(orgChartNodes.data);

        orgChartNodes.data.forEach(element => {
            if (element.name && element.tags) {
                // console.log(element.name +" " +element.id);
                orgChartNodes.data.forEach(e => {
                    if (e.stpid === element.id && e.title) {
                        // console.log(e.name + "chef de " + element.name);
                        e.title = e.title + " " + element.name
                        setDataChefsEquipes((x) => [...x, e])
                    }
                })
            }
        });

        setNodes(orgChartNodes.data);
        setDataMembres(orgChartNodes.data)
        setIsLoading(false);
    }, [laboratoryService]);

    useEffect(() => {
        updateNodes();
    }, []);

    const datta = [
        {
            label: dataChefLab.title,
            type: 'person',
            className: `${printed ? 'p-person' : 'pp-person'}`,
            expanded: true,
            data: { name: dataChefLab.name, avatar: logo },
            children: childrenData,
            style: { background: "azure" }
        }]

    const nodeTemplate = (node) => {
        if (node.type === 'person') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <img alt={node.data.name} src={node.data.avatar} className="mb-3 w-3rem h-3rem" />
                        <span className="font-bold mb-2">{node.data.name}</span>
                        <span>{node.data.title}</span><br />
                        <span>{node.label}</span>
                    </div>
                </div>
            );
        }

        return node.label;
    };

    const chartRef = useRef(null);


    const handlePivote = () => {
        if (printed) { setPrinted(false) }
        else { setPrinted(true) }
    };


    const handlePrint = async () => {
        setPrinted(false)
        const chart = chartRef.current;
        const chartHeight = chart.scrollHeight; // Utilisez scrollHeight pour obtenir la hauteur totale, y compris la partie non visible
        const a4Height = 841.89; // Hauteur d'une page A4 en points
        const numPages = Math.ceil(chartHeight / a4Height);
        const pdf = new jsPDF(); // A4 size page of PDF

        const addPageToPDF = async (i) => {
            await domtoimage.toBlob(chart, {
                height: a4Height,
                style: {
                    transform: `translateY(${-i * a4Height}px)`,
                    transformOrigin: 'top'
                }
            }).then(blob => {
                let imgData = URL.createObjectURL(blob);
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                if (i !== 0) {
                    pdf.addPage();
                }
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'NONE', 0, 0);
                if (i === numPages) {
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'NONE', 0, 0);
                    pdf.save("download.pdf");
                } else {
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'NONE', 0, 0);
                    addPageToPDF(i + 1);
                }
            });
        }

        await addPageToPDF(0);
        window.location.reload()
    }


    const handlePrintClick = () => {
        setPrinted(false)

    }



    return (
        <>
            <div className="page-header">
                <PageHeader
                    title={`Organigramme de laboratoire ${UserHelper.userHeadedLaboratories(
                        user
                    )}`}
                />

            </div>
            {!isLoading ?
                <>
                    {/* <button onClick={handlePrint} className='btn btn-primary'>Imprimer</button> */}
                    <img onClick={handlePivote} src={pivote} width='40px' height='40px' />
                    {printed &&<p class="small text-danger">Cliquez sur la flèche pour activer l'impression</p>}


                    <ReactToPrint
                        trigger={() => <button className='btn btn-primary m-3' disabled={printed}>Imprimer</button>}
                        content={() => chartRef.current}
                    />
                    <div className={`${printed ? 'organigramme-container' : 'organigramme-containerr'}`} ref={chartRef} id="content">


                        <div className={`${printed ? 'chart-wrapper' : 'chart-wrapperr'}`} >
                            <OrganizationChart value={datta} nodeTemplate={nodeTemplate} className={`${printed ? 'chart-container' : 'chart-containerr'}`} />
                        </div>
                    </div>
                </>
                :
                <>
                    <p>L'organigramme se charge ...</p>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                    </Box>
                </>
            }




        </>
    );
};

export default Organigramme;
