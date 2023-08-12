import React from "react";

import "c3/c3.css";
import C3Chart from "react-c3js";

const AuthorCitations = (props) => {
  let chart = {
    title: "AuthorCitations",
    data: {
      columns: [],
      type: "bar",
      colors: {
        data1: "#467fcf",
      },
      names: {
        data1: "Citations",
      },
    },
    axis: {
      x: {
        type: "category",
        categories: [],
      },
    },
  };
  var message=""
  console.log(props.author.citationsPerYear.length)
  if(props.author.citationsPerYear.length===0){
     message =  <div className="card-header">
     <h4 style={{color: "orange"}} className="card-title">veuillez essayer de nouveau pour avoir les statistiques</h4><br/>
    
   </div>  

  }else{
     message=""
  }
  chart.data.columns[0] = ["data1"].concat(
    props.author.citationsPerYear.slice(-5).map((a) => a.citations)
  );

  chart.axis.x.categories = props.author.citationsPerYear
    .slice(-5)
    .map((a) => a.year);

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Citée par</h4>
      </div>
    {message}
      <div className="table-responsive ">
        <table className="table table-hover table-outline   small text-muted card-table">
          <thead>
            <tr>
              <th></th>
              <th className="text-center">Toutes</th>
              <th className="text-center">
                Depuis {new Date().getFullYear() - 5}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.author.indexes.map(
              ({ name, total, lastFiveYears }, index) => (
                <tr key={index}>
                  <td>{name}</td>
                  <td className="text-center">{total}</td>
                  <td className="text-center">{lastFiveYears}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <div className="card-body">
          <C3Chart
            data={chart.data}
            axis={chart.axis}
            legend={{
              show: false,
            }}
            padding={{
              bottom: 0,
              top: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthorCitations;
