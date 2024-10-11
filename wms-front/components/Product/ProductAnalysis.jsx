import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { makeStyles } from "@mui/styles";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  PointElement,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
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
  backButton: {
    marginBottom: "20px",
    backgroundColor: "#e6f4fa",
    "&:hover": {
      backgroundColor: "#d4ecf7",
    },
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

const ProductAnalysis = ({ barcode, product, onBack }) => {
  const classes = useStyles();
  const [lastWeekSalesData, setLastWeekSalesData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch sales and forecast data when barcode changes
  useEffect(() => {
    if (barcode) {
      handleFetchData(barcode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcode]);

  const handleFetchData = async (barcode) => {
    setLoading(true);
    try {
      // Fetch last week's sales data
      const salesResponse = await fetch(
        `https://j11a302.p.ssafy.io/ml/sales/last_week/${barcode}`
      );
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setLastWeekSalesData(salesData);
      } else {
        setLastWeekSalesData(null);
      }

      // Fetch forecasted sales data
      const forecastResponse = await fetch(
        `https://j11a302.p.ssafy.io/ml/sales/forecast/${barcode}`
      );
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData.forecast);
      } else {
        setForecastData(null);
      }

      // Fetch related products
      const relatedResponse = await fetch(
        `https://j11a302.p.ssafy.io/ml/products/related/${barcode}`
      );
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData.related_products);
      } else {
        setRelatedProducts(null);
      }
    } catch (error) {
      console.error(error);
      setLastWeekSalesData(null);
      setForecastData(null);
      setRelatedProducts(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Button variant="contained" onClick={onBack} className={classes.backButton}>
        뒤로가기
      </Button>
      {loading && (
        <div className={classes.progressContainer}>
          <CircularProgress />
        </div>
      )}
      {!loading && product && (
        <div>
          <Typography variant="h5" gutterBottom>
            상품 분석
          </Typography>
          <Typography variant="h6">상품 정보</Typography>
          <Typography>상품 코드: {product.barcode}</Typography>
          <Typography>상품명: {product.name}</Typography>
          <Typography>수량: {product.quantity} 개</Typography>
          <Typography>적재함: {product.locationName}</Typography>
          <Typography>층수: {product.floorLevel}</Typography>
          <Typography>원가: {product.originalPrice} 원</Typography>
          <Typography>판매가: {product.sellingPrice} 원</Typography>

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
                        label: "판매액 (원)",
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
                    scales: {
                      y: {
                        ticks: {
                          callback: function (value) {
                            return value + " 원";
                          },
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return context.raw + " 원";
                          },
                        },
                      },
                    },
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
                        label: "예측 판매액 (원)",
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
                    scales: {
                      y: {
                        ticks: {
                          callback: function (value) {
                            return value + " 원";
                          },
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return context.raw + " 원";
                          },
                        },
                      },
                    },
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
      {!loading && !product && (
        <Typography variant="body1">상품 정보를 불러올 수 없습니다.</Typography>
      )}
    </div>
  );
};

export default ProductAnalysis;
