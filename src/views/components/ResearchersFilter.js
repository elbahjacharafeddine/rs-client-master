import React, { Fragment, useState, useEffect } from "react";
import { LoopIcon } from "./icons";
import { Link } from "react-router-dom";

const ResearchersFilter = ({
  filter,
  setFilter,
  filteringOptions,
  setSearchTerm,
  searchTerm,
  isSearchActive,
  setIsSearchActive,
}) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!filteringOptions) return;

    setTeams(
      filteringOptions.filter(({ optionType }) => optionType === "team")
    );
  }, [filteringOptions]);

  return (
    <form action="" method="get">
      <div className="mb-3">
        <div className="input-icon">
          <input
            name="searchTerm"
            type="text"
            disabled={!isSearchActive}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control form-control-rounded"
            placeholder="Search…"
          />
          <span className="input-icon-addon">
            <LoopIcon />
          </span>
        </div>
      </div>

      {
        <FilteringCategory
          {...{
            options: teams,
            category: "Équipes",
            setFilter,
            filter,
          }}
        />
      }
    </form>
  );
};

export default ResearchersFilter;

const FilteringCategory = ({ category, options, setFilter, filter }) => {
  return (
    <Fragment>
      <div className="subheader mb-2">{category}</div>
      <div className="list-group list-group-transparent mb-3">
        {options.map((option, index) => (
          <FilteringOption key={index} {...{ option, setFilter, filter }} />
        ))}
      </div>
    </Fragment>
  );
};

const FilteringOption = ({ option, setFilter, filter }) => {
  const classes =
    "list-group-item list-group-item-action d-flex align-items-center ";

  const updateFilter = (e) => {
    e.preventDefault();
    setFilter({
      [`${option.optionType}_abbreviation`]: option.abbreviation,
    });
  };

  const isActive = filter
    ? filter[`${option.optionType}_abbreviation`] === option.abbreviation
    : false;
  return (
    <Link
      to="/#"
      className={`${classes} ${isActive ? " active " : "notActive"}`}
      onClick={updateFilter}
    >
      {option.abbreviation}
      <small className="text-muted ml-auto">{option.membershipCount}</small>
    </Link>
  );
};
