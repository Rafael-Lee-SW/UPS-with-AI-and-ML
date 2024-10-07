import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Bar } from "react-chartjs-2";

const MLAnalysis = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [productCode, setProductCode] = useState("");
  const [productData, setProductData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalForecastData, setTotalForecastData] = useState(null);
  const [loadingTotalForecast, setLoadingTotalForecast] = useState(true);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Function to handle product search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/ml/products/${productCode}`
      );
      if (response.ok) {
        const data = await response.json();
        setProductData(data);
        // Prepare data for chart
        if (data.forecast) {
          const labels = data.forecast.map((_, index) => `Day ${index + 1}`);
          const chartData = {
            labels: labels,
            datasets: [
              {
                label: "예측 판매량",
                data: data.forecast,
                backgroundColor: "rgba(75,192,192,0.4)",
              },
            ],
          };
          setForecastData(chartData);
        }
      } else {
        // Handle error
        setProductData(null);
        setForecastData(null);
      }
    } catch (error) {
      console.error(error);
      setProductData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch total forecasting data on component mount
  useEffect(() => {
    const fetchForecastingData = async () => {
      setLoadingTotalForecast(true);
      try {
        const response = await fetch(
          "https://j11a302.p.ssafy.io/ml/forecasting"
        );
        if (response.ok) {
          const data = await response.json();
          setTotalForecastData(data);
        } else {
          // Handle error
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTotalForecast(false);
      }
    };

    fetchForecastingData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="상품 검색 및 예측" />
        <Tab label="전체 예측 데이터" />
      </Tabs>
      <div>
        {activeTab === 0 && (
          <Box>
            {/* Product Search Section */}
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              상품 검색 및 예측
            </Typography>
            <div style={{ marginTop: "20px" }}>
              <TextField
                label="상품 코드"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                style={{ marginLeft: "10px" }}
              >
                검색
              </Button>
            </div>
            {loading && <CircularProgress />}
            {productData && (
              <div style={{ marginTop: "20px" }}>
                <Typography variant="subtitle1">상품 정보</Typography>
                <Typography>상품 코드: {productData.product_code}</Typography>
                <Typography>
                  상품명: {productData.product_description}
                </Typography>
                {/* Display forecast chart */}
                {forecastData && (
                  <div style={{ marginTop: "20px" }}>
                    <Typography variant="subtitle1">판매 예측</Typography>
                    <Bar data={forecastData} />
                  </div>
                )}
              </div>
            )}
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            {/* Total Forecasting Data Section */}
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              전체 예측 데이터
            </Typography>
            {loadingTotalForecast ? (
              <CircularProgress />
            ) : (
              totalForecastData && (
                <div>
                  {/* Top Products Forecasting */}
                  <div style={{ marginTop: "20px" }}>
                    <Typography variant="subtitle1">
                      상위 제품 판매 예측
                    </Typography>
                    {totalForecastData.top_products_forecasting.map(
                      (product, index) => (
                        <div key={index} style={{ marginTop: "20px" }}>
                          <Typography>{product.product_description}</Typography>
                          <Bar
                            data={{
                              labels: product.forecast.map(
                                (_, idx) => `Day ${idx + 1}`
                              ),
                              datasets: [
                                {
                                  label: "예측 판매량",
                                  data: product.forecast,
                                  backgroundColor: "rgba(153, 102, 255, 0.6)",
                                },
                              ],
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>

                  {/* Top Categories Forecasting */}
                  <div style={{ marginTop: "40px" }}>
                    <Typography variant="subtitle1">
                      상위 카테고리 판매 예측
                    </Typography>
                    {totalForecastData.top_categories_forecasting.map(
                      (category, index) => (
                        <div key={index} style={{ marginTop: "20px" }}>
                          <Typography>{category.category_name}</Typography>
                          <Bar
                            data={{
                              labels: category.forecast.map(
                                (_, idx) => `Day ${idx + 1}`
                              ),
                              datasets: [
                                {
                                  label: "예측 판매량",
                                  data: category.forecast,
                                  backgroundColor: "rgba(255, 159, 64, 0.6)",
                                },
                              ],
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>

                  {/* Top Locations */}
                  <div style={{ marginTop: "40px" }}>
                    <Typography variant="subtitle1">상위 위치</Typography>
                    <Bar
                      data={{
                        labels: totalForecastData.top_locations.map(
                          (loc) => loc.location
                        ),
                        datasets: [
                          {
                            label: "판매액",
                            data: totalForecastData.top_locations.map(
                              (loc) => loc.price
                            ),
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </Box>
        )}
      </div>
    </div>
  );
};

export default MLAnalysis;
