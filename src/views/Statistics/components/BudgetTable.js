import React, { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import BudgetDetails from "../../components/BudgetDetails";
import NoResultFound from "../../components/NoResultFound";

const BudgetTable = ({ labBudget, selectedLab }) => {
  const [modalShow, setModalShow] = useState(false);
  const [budgetData, setBudgetData] = useState([]);
  const [inputs, setInputs] = useState({});
  const [cats, setCats] = useState([]);
  const [sum, setSum] = useState(0);
  const [result, setResult] = useState(true);
  const [labHead, setLabHead] = useState(false);
  const { ApiServices, user } = useContext(AppContext);
  const { budgetHistoryService } = ApiServices;

  const showModal = async (labData) => {
    console.log(labData)
    try {
      var response;
      if (selectedLab != "" && selectedLab != undefined) {
        setLabHead(true)
        response = await budgetHistoryService.findHistory({ laboratory_id: selectedLab });
      } else {
        response = await budgetHistoryService.findHistory({ laboratory_id: user.laboratoriesHeaded[0]._id });
      }
      setBudgetData(labData)
      var categories = [];
      var tot = 0;
      response.data[0].budget.forEach((budget) => {
        if (budget.year != undefined && budget.year == labData.year) {
          setBudgetData(budget)
          budget.categories.forEach((cat) => {
            categories.push(createOption(Object.keys(cat)[0], cat[Object.keys(cat)[0]]))
            setInputs((inputs) => ({
              ...inputs,
              [Object.keys(cat)[0]]: cat[Object.keys(cat)[0]],
            }));
            tot = parseInt(tot) + parseInt(cat[Object.keys(cat)[0]]);
          })
          setSum(tot)
        } else {
          setBudgetData(labData)
        }
      })

      setCats(categories)
      setModalShow(true);
    } catch (error) {
      console.log(error)
    }

  }

  const createOption = (label, sum) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
    sum: sum
  });

  const hideModal = () => {
    clearInputs();
    setInputs({});
    setModalShow(false);
  }

  const clearInputs = () => {
    setInputs({});
    setCats([])
    setSum(0)
    setResult(true)
  }


  const addBudgetHistory = async () => {
    var laboratory_id = user.laboratoriesHeaded[0]._id;
    const response = await budgetHistoryService.addBudgetHistory({
      laboratory_id: laboratory_id, categories: cats.map((e) => { return { [e.label]: inputs[e.label] } })
      , budgetData: budgetData
    })
  }


  if (labBudget !== undefined) {
    return (
      <div>
        <table className="table card-table table-vcenter">
          <thead>
            <tr>
              <th>Année</th>
              <th>Budget</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(labBudget).reverse().map((year, index) => {
              if (year >= 2017) {
                return (<tr key={index}>
                  <td> {year}</td>
                  <td className="" key={index}>{labBudget[year] ?? 0}DH</td>

                  <td>

                    <button type="button" className="btn btn-primary " onClick={() => showModal({ "budget": labBudget[year], "year": year })}>détail</button> </td>
                </tr>
                )
              }
            }
            )}
          </tbody>
        </table>
        <BudgetDetails
          labHead={labHead}
          show={modalShow}
          hideModal={hideModal}
          labBudget={budgetData}
          setInputs={setInputs}
          inputs={inputs}
          clearInputs={clearInputs}
          cats={cats}
          setCats={setCats}
          result={result}
          setResult={setResult}
          addBudgetHistory={addBudgetHistory}
          inputs={inputs}
          sum={sum}
          setSum={setSum}
        />
      </div>
    );
  }
  else {
    return (<NoResultFound query={""} />
    )
  }
};

export default BudgetTable;
