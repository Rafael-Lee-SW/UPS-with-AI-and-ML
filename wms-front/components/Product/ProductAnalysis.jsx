// ProductAnalysis.jsx

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
import { Bar, Line } from "react-chartjs-2";
import { makeStyles } from "@mui/styles";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
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

const ProductAnalysis = ({ barcode, onBack }) => {
  const classes = useStyles();
  const [productData, setProductData] = useState(null);
  const [lastWeekSalesData, setLastWeekSalesData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data when barcode changes
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

      // Fetch product information
      const productInfoResponse = await fetch(
        `https://j11a302.p.ssafy.io/ml/products/info/${barcode}`
      );
      if (productInfoResponse.ok) {
        const productInfo = await productInfoResponse.json();
        setProductData(productInfo);
      } else {
        setProductData({
          product_code: barcode,
          product_description: `Product ${barcode}`,
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
      {!loading && productData && (
        <div>
          <Typography variant="h5" gutterBottom>
            상품 분석
          </Typography>
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
      {!loading && !productData && (
        <Typography variant="body1">상품 정보를 불러올 수 없습니다.</Typography>
      )}
    </div>
  );
};

export default ProductAnalysis;
