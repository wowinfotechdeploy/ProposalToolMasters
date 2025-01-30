import Loader from "../loader/Loader";
const noResultFoundModel = ({ name, totalRecords }) => {
  return (
    <div className="noResult">
      <div className="text-center">
        {totalRecords === -1 ? (
          <h5 className="mt-4">
            <Loader /> Loading...
          </h5>
        ) : (
          <h5 className="mt-4">No {name} Found</h5>
        )}
      </div>
    </div>
  );
};
export default noResultFoundModel;
