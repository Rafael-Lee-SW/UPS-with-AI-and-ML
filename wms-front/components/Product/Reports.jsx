// Reports.jsx

import React, { useState, useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { makeStyles } from "@mui/styles";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  section: {
    marginBottom: "40px",
  },
  chartContainer: {
    position: "relative",
    height: "400px",
    width: "100%",
  },
  progressContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
}));

const Reports = () => {
  const classes = useStyles();
  const [loadingReports, setLoadingReports] = useState(true);
  const [topProductsLastWeek, setTopProductsLastWeek] = useState(null);
  const [topProductsForecast, setTopProductsForecast] = useState(null);
  const [customerPreferences, setCustomerPreferences] = useState(null);
  const [productPlacement, setProductPlacement] = useState(null);

  // Fetch reports data on component mount
  useEffect(() => {
    const fetchReportsData = async () => {
      setLoadingReports(true);
      try {
        // Fetch top products last week
        const topLastWeekResponse = await fetch(
          "https://j11a302.p.ssafy.io/ml/report/top_products/last_week"
        );
        if (topLastWeekResponse.ok) {
          const topLastWeekData = await topLastWeekResponse.json();
          setTopProductsLastWeek(topLastWeekData.top_products);
        } else {
          setTopProductsLastWeek(null);
        }

        // Fetch top forecasted products
        const topForecastResponse = await fetch(
          "https://j11a302.p.ssafy.io/ml/report/top_products/forecast"
        );
        if (topForecastResponse.ok) {
          const topForecastData = await topForecastResponse.json();
          setTopProductsForecast(topForecastData.top_forecasts);
        } else {
          setTopProductsForecast(null);
        }

        // Fetch customer preferences
        const customerPreferencesResponse = await fetch(
          "https://j11a302.p.ssafy.io/ml/report/customer_preferences"
        );
        if (customerPreferencesResponse.ok) {
          const customerPreferencesData = await customerPreferencesResponse.json();
          setCustomerPreferences(customerPreferencesData.customer_preferences);
        } else {
          setCustomerPreferences(null);
        }

        // Fetch product placement recommendations
        const productPlacementResponse = await fetch(
          "https://j11a302.p.ssafy.io/ml/report/product_placement"
        );
        if (productPlacementResponse.ok) {
          const productPlacementData = await productPlacementResponse.json();
          setProductPlacement(productPlacementData.placement_recommendations);
        } else {
          setProductPlacement(null);
        }
      } catch (error) {
        console.error(error);
        setTopProductsLastWeek(null);
        setTopProductsForecast(null);
        setCustomerPreferences(null);
        setProductPlacement(null);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReportsData();
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        리포트
      </Typography>
      {loadingReports ? (
        <div className={classes.progressContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {/* Top Products Last Week */}
          {topProductsLastWeek && (
            <div className={classes.section}>
              <Typography variant="h6">지난주 상위 제품</Typography>
              <div className={classes.chartContainer}>
                <Bar
                  data={{
                    labels: topProductsLastWeek.map(
                      (product) => product.item_description
                    ),
                    datasets: [
                      {
                        label: "판매액",
                        data: topProductsLastWeek.map(
                          (product) => product.price
                        ),
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          )}
          {/* Top Forecasted Products */}
          {topProductsForecast && (
            <div className={classes.section}>
              <Typography variant="h6">
                예측 상위 제품 (다음주)
              </Typography>
              <div className={classes.chartContainer}>
                <Bar
                  data={{
                    labels: topProductsForecast.map(
                      (product) => product.item_description
                    ),
                    datasets: [
                      {
                        label: "예측 판매액",
                        data: topProductsForecast.map(
                          (product) => product.forecast_total
                        ),
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          )}
          {/* Customer Preferences */}
          {customerPreferences && (
            <div className={classes.section}>
              <Typography variant="h6">고객 선호도</Typography>
              {customerPreferences.map((pref, index) => (
                <Paper
                  key={index}
                  style={{ padding: "10px", marginBottom: "10px" }}
                >
                  <Typography variant="subtitle1">
                    연령대: {pref.age_group}
                  </Typography>
                  <Typography variant="body1">
                    선호 제품: {pref.item_description}
                  </Typography>
                  <Typography variant="body2">
                    총 구매액: {pref.price.toLocaleString()}원
                  </Typography>
                </Paper>
              ))}
            </div>
          )}
          {/* Product Placement Recommendations */}
          {productPlacement && (
            <div className={classes.section}>
              <Typography variant="h6">상품 배치 추천</Typography>
              {productPlacement.map((rec, index) => (
                <Paper
                  key={index}
                  style={{ padding: "10px", marginBottom: "10px" }}
                >
                  <Typography variant="body1">
                    위치 {rec.from_location_id} ({rec.from_location_name}) ➔ 위치{" "}
                    {rec.to_location_id} ({rec.to_location_name})
                  </Typography>
                  <Typography variant="body2">
                    효율성 향상 예상:{" "}
                    {(rec.effectiveness * 100).toFixed(2)}%
                  </Typography>
                </Paper>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
