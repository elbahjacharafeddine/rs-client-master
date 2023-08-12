import React, { Fragment, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportTable from "../Statistics/ReportTable";

const LabReportsForm = ({
  inputs,
  setInputs,
  inputsSkeleton,
  handleSubmit,
  cancelEdit,
  action,
  title,
  willPrint,
  labPublications,
  loading
}) => {

  const handleNumberInputsChange = (event) => {
    event.persist();
    if (Number.isInteger(parseInt(event.target.value))) {
      setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: parseInt(event.target.value),
      }));
    }
  };
  const handleInputsChange = (event) => {
    event.persist();

    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  }

  useEffect(() => {
    inputsSkeleton.forEach((input) => {
      console.log("undef", inputs[input.name]);
      if (
        input.type === "select" &&
        input.options.length &&
        inputs[input.name] === undefined
      )
        setInputs((inputs) => ({
          ...inputs,
          [input.name]: 2015,
        }));


    });
  }, [inputs, inputsSkeleton, setInputs]);

  return (
    <div className="card col-md-12">
      <form onSubmit={handleSubmit}>
        <div className="card-header">
          <h3 className="card-title">
            {title}
          </h3>
        </div>

        <div className="card-body">
          {inputsSkeleton.map((input, index) => (
            <Fragment key={index}>
              {input.type === "input" && (
                <div className="form-group mt-2">
                  <label className="form-label">{input.label}</label>
                  <input
                    required
                    type="text"
                    pattern="[0-9]*"
                    className="form-control"
                    onChange={handleNumberInputsChange}
                    value={inputs[input.name]}
                    name={input.name}
                  />
                </div>
              )}

              {input.type === "select" && (
                <div className="form-group mt-2">
                  <label className="form-label">{input.label}</label>
                  <select
                    name={input.name}
                    onChange={handleInputsChange}
                    value={inputs[input.name]}
                    className="form-control"
                  >
                    <option>Choisissez une option</option>
                    {input.options.map((option, index) => (
                      <option value={option} key={index}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className="card-footer text-right">
          {!willPrint &&
            <div>
              <button onClick={cancelEdit} className="mr-2 btn btn-outline-danger">
                Annuler
          </button>
              <button type="submit" className="btn btn-primary">
                Soumettre
          </button>
            </div>}
          {willPrint &&
            <Fragment>
              {(loading ? <button className="btn  btn-sm m-1  btn-outline-primary disabled" >Imprimer le rapport</button> :
                <PDFDownloadLink className="btn  btn-sm m-1  btn-primary text-white" document={<ReportTable teamPublications={labPublications} team={inputs.laboratoire} year={inputs.year.toString()} isLab={true}/>} fileName={inputs.laboratoire.concat(" "+inputs.year.toString())}>
                  Imprimer le rapport
             </PDFDownloadLink>)}

            </Fragment>}

        </div>
      </form>
    </div>
  );
};

export default LabReportsForm;
