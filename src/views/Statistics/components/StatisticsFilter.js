import React from "react";

const StatisticsFilter = ({ dateRange, setDateRange, updateStatistics }) => {
  const handleInputsChange = (event) => {
    event.persist();

    const { value, name } = event.target;
    if (value > 200)
      setDateRange((dateRange) => ({
        ...dateRange,
        [name]: value,
      }));
  };

  const handelFormSubmit = (event) => {
    event.preventDefault();
    setDateRange(dateRange);
    updateStatistics();
  };

  const thisYear = new Date().getFullYear();

  return (
    <form action="" method="get" onSubmit={handelFormSubmit}>
      <div className="subheader mb-2">Date</div>
      <div className="row row-sm align-items-center mb-3">
        <div className="col">
          <div className="input-group">
            <div className="input-group-prepend ">
              <span className="input-group-text">Début</span>
            </div>
            <input
              onChange={handleInputsChange}
              name="start"
              type="number"
              min={thisYear - 20}
              max={dateRange.end}
              className="form-control"
              value={dateRange.start}
            />
          </div>
        </div>
        <div className="col-auto">—</div>
        <div className="col">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">Fin</span>
            </div>
            <input
              onChange={handleInputsChange}
              name="end"
              type="number"
              min={dateRange.start}
              max={thisYear}
              className="form-control"
              value={dateRange.end}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 mb-5"></div>
    </form>
  );
};

export default StatisticsFilter;
