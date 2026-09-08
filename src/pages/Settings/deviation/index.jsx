/* global $ */
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { GetDeviationList } from "../../../redux/Services/Setting/DeviationApi";
import "./Deviation-redesign.css";

const Deviation = () => {
  const { setLoader } = useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage);

  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);

        const res = await GetDeviationList(common.organisationKeyID);

        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        setData(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoader(false);
      }
    };

    if (common.organisationKeyID) fetchData();
  }, [common.organisationKeyID]);

  // Load More Handler
  const handleLoadMore = () => {
    setLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setLoadingMore(false);
    }, 500); // small delay for spinner UX
  };

  return (
    <div className="deviation-list-redesign">
      <div className="deviation-list-page">
        <div className="deviation-list-page-header">
          <div>
            <h1 className="deviation-list-page-title">Deviation</h1>
            <p className="deviation-list-page-subtitle">
              Review package pricing limits and deviation values.
            </p>
          </div>
        </div>

        <section className="deviation-list-card">
          <div className="deviation-list-toolbar">
            <div>
              <h2 className="deviation-list-toolbar-title">Deviation List</h2>
              <p className="deviation-list-toolbar-subtitle">
                Compare original, default and minimum prices by service package.
              </p>
            </div>

            {Array.isArray(data) && data.length > 0 && (
              <span className="deviation-list-count">
                {data.length} {data.length === 1 ? "record" : "records"}
              </span>
            )}
          </div>

          <div className="deviation-list-table-scroll">
            <table className="deviation-list-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Profession Type</th>
                  <th>Original Price</th>
                  <th>Default Price</th>
                  <th>Minimum Price</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(data) &&
                  data.slice(0, visibleCount).map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="deviation-list-name-cell">
                          <span className="deviation-list-name-icon">
                            <i className="ri-price-tag-3-line"></i>
                          </span>
                          <span
                            className="deviation-list-name"
                            title={item.servicePackageName}
                          >
                            {item.servicePackageName || "-"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className="deviation-list-profession-chip"
                          title={item.professionTypeNames}
                        >
                          {item.professionTypeNames || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="deviation-list-price-box">
                          <div className="deviation-list-price-row">
                            <span>Recurring</span>
                            <strong>{item.recurringOriginalPrice}</strong>
                          </div>
                          <div className="deviation-list-price-row">
                            <span>One Off</span>
                            <strong>{item.oneOffOriginalPrice}</strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="deviation-list-price-box">
                          <div className="deviation-list-price-row">
                            <span>Recurring</span>
                            <strong>{item.recurringDefaultPrice}</strong>
                          </div>
                          <div className="deviation-list-price-row">
                            <span>One Off</span>
                            <strong>{item.oneOffDefaultPrice}</strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="deviation-list-price-box">
                          <div className="deviation-list-price-row">
                            <span>Recurring</span>
                            <strong>{item.recurringMinPrice}</strong>
                          </div>
                          <div className="deviation-list-price-row">
                            <span>One Off</span>
                            <strong>{item.oneOffMinPrice}</strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`deviation-list-status ${
                            item.statusName === "Active"
                              ? "is-active"
                              : "is-inactive"
                          }`}
                        >
                          {item.statusName || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {Array.isArray(data) && data.length === 0 && (
            <div className="deviation-list-empty-state">
              <span className="deviation-list-empty-icon">
                <i className="ri-file-list-3-line"></i>
              </span>
              <h3>No records found</h3>
              <p>There are no deviation records available right now.</p>
            </div>
          )}

          {Array.isArray(data) && visibleCount < data.length && (
            <div className="deviation-list-load-more">
              <button
                className="btn btn-success create-item-btn deviation-list-load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line"></i>
                    <span>Show More</span>
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Deviation;
