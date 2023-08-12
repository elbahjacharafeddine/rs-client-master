import React, { Fragment, useState, useContext } from "react";
import "../../assets/css/form.css";

const ArchivageFORM = ({ inputs, setInputs, handleSubmit, inputsSkeleton, cancelEdit, action, twoColumns }) => {

  const handleInputsChange = (event) => {
    event.persist();
    if (event.target.name == "annexe") {
      var keys = Object.keys(event.target.files);
      var files = event.target.files
      keys.forEach((key) => {
        setInputs((inputs) => ({
          ...inputs,
          [files[key].lastModified]: files[key],
        }));
      })

    } else if(event.target.name=="rapport") {
      setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: event.target.files[0],
      }));
    }else {
      setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: event.target.value,
      }));
    }
  };


  return (
    <div className="card">
      <form method="POST" onSubmit={handleSubmit}>
        <div className="card-header">
          <h3 className="card-title">Ajouter un PV</h3>
        </div>
        <div className={`card-body form `}>
          <ul className={twoColumns || "none"}>
            {inputsSkeleton.map((input, index) => (
              <li className={twoColumns || ""} key={index}>
                <Fragment>
                  {input.type === "date" && (
                    <div className="form-group mt-2">
                      <label className="form-label">{input.label}</label>
                      <input required type="date" className="form-control" onChange={handleInputsChange} value={inputs[input.name] || ""} name={input.name} required />
                    </div>
                  )}
                  {input.type === "file" && input.label === "Joidre les annexes" && (

                    <div className="form-group mt-2 ">
                      <label className="form-label">{input.label}</label>
                      <input type="file" className="" 
                        onChange={handleInputsChange} multiple name={input.name}  required />
                    </div>
                  )}

                  {input.type === "file" && input.label === "Joindre le rapport" && (

                    <div className="form-group mt-2 ">
                      <label className="form-label">{input.label}</label>
                      <input type="file" className="" accept=".pdf, .doc, .docx"
                        onChange={handleInputsChange}  name={input.name} required />
                    </div>
                  )}
                </Fragment>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-footer text-right">
          <button onClick={cancelEdit} className="mr-2 btn btn-outline-danger">
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArchivageFORM;
