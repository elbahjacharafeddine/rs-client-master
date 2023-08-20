import React from 'react';
import DataTable from 'react-data-table-component';
import { IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
// import UpdateFormulaire from "./updateFormulaire"; // Assurez-vous d'importer correctement ce composant

const Publication = ({
  publication,
  updatePublication,
  index,
  getProfile,
}) => {
  // ...
  // Votre code actuel pour les fonctions et états

  const customColumns = [
    {
      name: 'Title',
      selector: 'title',
      sortable: true,
      cell: (row) => (
        <>
          <div>{row.title}</div>
          <div>
            {row.authors && (
              <small>{row.authors.join(", ")}</small>
            )}
            {row.source && (
              <small>{row.source}</small>
            )}
          </div>
          {row.extraInformation &&
            row.extraInformation["Conference"] && (
              <small>{row.extraInformation["Conference"]}</small>
            )}
          {row.extraInformation &&
            row.extraInformation["Journal"] && (
              <small>{row.extraInformation["Journal"]}</small>
            )}
        </>
      )
    },
    {
      name: 'Year',
      selector: 'year',
      sortable: true,
      center: true,
    },
    {
      name: 'Citation',
      selector: 'citation',
      sortable: true,
      center: true,
      cell: (row) => (row.citation ? row.citation.replace("*", "") : ""),
    },
    {
      name: 'IF',
      selector: 'IF',
      sortable: true,
      center: true,
      cell: (row) => (
        <>
          {/* {row.IF ?? " "}
          {isLoading && <Loader size="25" />} */}
        </>
      ),
    },
    {
      name: 'SJR',
      selector: 'SJR',
      sortable: true,
      center: true,
      cell: (row) => (
        <>
          {/* {row.SJR ?? " "}
          {isLoading && <Loader size="25" />} */}
        </>
      ),
    },
    {
      name: '',
      cell: (row) => (
        <div className="d-flex justify-content-center">
          <IconButton
            id={row._id}
            size="small"
            color="primary"
            component="span"
            // onClick={showModal}
          >
            <UpdateIcon />
          </IconButton>
          <IconButton
            id={row._id}
            size="small"
            color="secondary"
            component="span"
            // onClick={deletePub}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <DataTable
      title="tttt"
      columns={customColumns}
      data={[publication]} // Pass the data as an array for a single row
      pagination
      highlightOnHover
    />
  );
};

export default Publication;
