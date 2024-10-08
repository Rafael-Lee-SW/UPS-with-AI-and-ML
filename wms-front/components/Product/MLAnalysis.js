import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import { makeStyles } from "@mui/styles";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  tabContent: {
    marginTop: "20px",
  },
  section: {
    marginBottom: "40px",
  },
  chartContainer: {
    position: "relative",
    height: "400px",
    width: "100%",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "20px",
  },
  searchButton: {
    marginLeft: "10px",
    height: "56px",
  },
  progressContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
}));

const MLAnalysis = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [productCode, setProductCode] = useState("");
  const [productData, setProductData] = useState(null);
  const [lastWeekSalesData, setLastWeekSalesData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topProductsLastWeek, setTopProductsLastWeek] = useState(null);
  const [topProductsForecast, setTopProductsForecast] = useState(null);
  const [customerPreferences, setCustomerPreferences] = useState(null);
  const [productPlacement, setProductPlacement] = useState(null);
  const [loadingReports, setLoadingReports] = useState(true);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Function to handle product search
  const handleSearch = async () => {
    setLoading(true);
    try {
      // Fetch last week's sales data
      const salesResponse = await fetch(
        `http://127.0.0.1:8000/ml/sales/last_week/${productCode}`
      );
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setLastWeekSalesData(salesData);
      } else {
        setLastWeekSalesData(null);
      }

      // Fetch forecasted sales data
      const forecastResponse = await fetch(
        `http://127.0.0.1:8000/ml/sales/forecast/${productCode}`
      );
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData.forecast);
      } else {
        setForecastData(null);
      }

      // Fetch related products
      const relatedResponse = await fetch(
        `http://127.0.0.1:8000/ml/products/related/${productCode}`
      );
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData.related_products);
      } else {
        setRelatedProducts(null);
      }

      // Fetch product information (you can create an endpoint or extract from data)
      // For now, let's assume we have a way to get the product description
      const productInfoResponse = await fetch(
        `http://127.0.0.1:8000/ml/products/info/${productCode}`
      );
      if (productInfoResponse.ok) {
        const productInfo = await productInfoResponse.json();
        setProductData(productInfo);
      } else {
        setProductData({
          product_code: productCode,
          product_description: `Product ${productCode}`,
        });
      }
    } catch (error) {
      console.error(error);
      setProductData(null);
      setLastWeekSalesData(null);
      setForecastData(null);
      setRelatedProducts(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports data on component mount
  useEffect(() => {
    const fetchReportsData = async () => {
      setLoadingReports(true);
      try {
        // Fetch top products last week
        const topLastWeekResponse = await fetch(
          "http://127.0.0.1:8000/ml/report/top_products/last_week"
        );
        if (topLastWeekResponse.ok) {
          const topLastWeekData = await topLastWeekResponse.json();
          setTopProductsLastWeek(topLastWeekData.top_products);
        } else {
          setTopProductsLastWeek(null);
        }

        // Fetch top forecasted products
        const topForecastResponse = await fetch(
          "http://127.0.0.1:8000/ml/report/top_products/forecast"
        );
        if (topForecastResponse.ok) {
          const topForecastData = await topForecastResponse.json();
          setTopProductsForecast(topForecastData.top_forecasts);
        } else {
          setTopProductsForecast(null);
        }

        // Fetch customer preferences
        const customerPreferencesResponse = await fetch(
          "http://127.0.0.1:8000/ml/report/customer_preferences"
        );
        if (customerPreferencesResponse.ok) {
          const customerPreferencesData = await customerPreferencesResponse.json();
          setCustomerPreferences(customerPreferencesData.customer_preferences);
        } else {
          setCustomerPreferences(null);
        }

        // Fetch product placement recommendations
        const productPlacementResponse = await fetch(
          "http://127.0.0.1:8000/ml/report/product_placement"
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
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        variant="fullWidth"
      >
        <Tab label="상품 분석" />
        <Tab label="리포트" />
      </Tabs>
      <div className={classes.tabContent}>
        {activeTab === 0 && (
          <Box>
            {/* Product Search Section */}
            <Typography variant="h5" gutterBottom>
              상품 검색 및 예측
            </Typography>
            <div className={classes.searchContainer}>
              <TextField
                label="상품 코드"
                variant="outlined"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                className={classes.searchButton}
              >
                검색
              </Button>
            </div>
            {loading && (
              <div className={classes.progressContainer}>
                <CircularProgress />
              </div>
            )}
            {!loading && productData && (
              <div style={{ marginTop: "20px" }}>
                <Typography variant="h6">상품 정보</Typography>
                <Typography>상품 코드: {productData.product_code}</Typography>
                <Typography>상품명: {productData.product_description}</Typography>
                {/* Display last week's sales chart */}
                {lastWeekSalesData && (
                  <div className={classes.section}>
                    <Typography variant="h6">지난주 판매액</Typography>
                    <div className={classes.chartContainer}>
                      <Line
                        data={{
                          labels: Object.keys(lastWeekSalesData),
                          datasets: [
                            {
                              label: "판매액",
                              data: Object.values(lastWeekSalesData),
                              backgroundColor: "rgba(75,192,192,0.4)",
                              borderColor: "rgba(75,192,192,1)",
                              fill: false,
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
                {/* Display forecast chart */}
                {forecastData && (
                  <div className={classes.section}>
                    <Typography variant="h6">예측 판매액 (다음주)</Typography>
                    <div className={classes.chartContainer}>
                      <Line
                        data={{
                          labels: Object.keys(forecastData),
                          datasets: [
                            {
                              label: "예측 판매액",
                              data: Object.values(forecastData),
                              backgroundColor: "rgba(153, 102, 255, 0.6)",
                              borderColor: "rgba(153, 102, 255, 1)",
                              fill: false,
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
                {/* Display related products */}
                {relatedProducts && (
                  <div className={classes.section}>
                    <Typography variant="h6">연관 상품</Typography>
                    <List>
                      {relatedProducts.map((product, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={product.item_description}
                            secondary={`함께 구매된 횟수: ${product.count}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )}
              </div>
            )}
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            {/* Reports Section */}
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
          </Box>
        )}
      </div>
    </div>
  );
};

export default MLAnalysis;
