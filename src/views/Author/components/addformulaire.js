import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Fragment, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';


const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: "#EFEFEF",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  list: {
    alignItems: "center",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function aire(props) {
  const { show, hideModal, pub, setPub, addpublication, clearInputs } = props;

  const add = (event) => {
    event.preventDefault();
    addpublication();
   
   
  };

  const handlePasswordUpdateChange = (event) => {
    event.persist();

    setPub((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  
  return (
    show && (
      <Modal
        show={true}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
         <form onSubmit={add}>
        <Modal.Header closeButton  onClick={hideModal}>
          <Modal.Title id="contained-modal-title-vcenter">
            Ajouter une publication
        </Modal.Title>

        </Modal.Header>
        <Modal.Body>
         
          <div className="container">
            <div className="form-group col-12">
              <label>Titre</label>
              <input type="text" className="form-control"
                onChange={handlePasswordUpdateChange}
                value={pub.titre}
                required
                name="titre"
                className="form-control"
              />
            </div>
            
            <div className="form-group col-12">
              <label>Auteur</label>
              <input
                className="form-control"

                type="text"
                value={pub.auteur}
                onChange={handlePasswordUpdateChange}
                name="auteur"
                required
                placeholder="par exemple : Lachgar, Mohamed; Ouahmane, Hassan" id="example3"/>
            </div>

            <div className="form-group col-12">
              <label  htmlFor="example3">Citation</label>
              <input type="text"
               className="form-control"
                onChange={handlePasswordUpdateChange}
                value={pub.citation}
                name="citation"
              />
            </div>

            <div className="form-group col-12">
              <label >Année de publication</label>
              <input
               className="form-control"
                type="text"
                value={pub.annee}
                onChange={handlePasswordUpdateChange}
                required name="annee" placeholder="AAAA" className="form-control form-control-sm" />
            </div>

            <div className="form-group col-12">
              <label >Source</label>
              <input type="text" required className="form-control"
                onChange={handlePasswordUpdateChange}
                value={pub.source}
                name="source"
              />
            </div>
            <div className="form-group col-12">
              <label>IF</label>
              <input type="text"  className="form-control"
                onChange={handlePasswordUpdateChange}
                value={pub.IF}
                name="IF"
              />
            </div>
            <div className="form-group col-12">
              <label>SJR</label>
              <input type="text" className="form-control"
                onChange={handlePasswordUpdateChange}
                value={pub.SJR}
                name="SJR"
              />
              
            </div>
            
          </div>
          

        </Modal.Body>
        <Modal.Footer>
       
          <Button size="small" type="submit" variant="contained" color="primary" >ajouter</Button>
          
          <Button size="small" style={{marginLeft:"5px"}}  onClick={hideModal} variant="contained" color="secondary">Fermer</Button>
       
        </Modal.Footer>
        
        </form>
      </Modal>

    )
  )
};

export default aire;