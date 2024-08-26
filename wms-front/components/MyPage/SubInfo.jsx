import React, { useState, useEffect } from "react";
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import subInfoStyle from "/styles/jss/nextjs-material-kit/pages/componentsSections/subInfoStyle.js";
import { useRouter } from "next/router";

const useStyles = makeStyles(subInfoStyle);

export default function SubInfo() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [userData, setUserData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        router.push('/404');
        return;
      }

      try {
        const userResponse = await fetch(
          `https://i11a508.p.ssafy.io/api/users/${user.id}`
        );
        if (!userResponse.ok) {
          router.push('/404');
          return;
        }

        const userData = await userResponse.json();
        setUserData(userData.result);

        if (userData.result.roleTypeEnum === "BUSINESS") {
          const businessId = userData.result.businessId;
          const subscriptionResponse = await fetch(
            `https://i11a508.p.ssafy.io/api/subscriptions?businessId=${businessId}`
          );

          if (!subscriptionResponse.ok) {
            router.push('/404');
            return;
          }

          const subscriptionData = await subscriptionResponse.json();
          setSubscriptionData(subscriptionData.result);
        }
      } catch (error) {
        router.push('/404');
      }
    };

    fetchUserData();
  }, []);

  const handleOpen = (subscription) => {
    setCurrentSubscription(subscription);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderContentByRole = () => {
    if (!userData) {
      return <h4 className={classes.loadingText}>Loading...</h4>;
    }

    switch (userData.roleTypeEnum) {
      case "BUSINESS":
        if (subscriptionData.length === 0) {
          return <h4 className={classes.contentText}>구독 정보가 없습니다.</h4>;
        }

        const currentSubscription = subscriptionData[0];
        return (
          <div>
            <div className={classes.contentContainer}>
              <h4 className={classes.contentText}>
                현재 사용 중인 창고 수: {currentSubscription.warehouseCount}
              </h4>
              <button
                className={classes.button}
                onClick={() => router.push("/payment")}
              >
                창고 추가 결제
              </button>
            </div>
            <div>
              <h3 className={classes.contentText}>구독 내역</h3>
              {subscriptionData.map((subscription) => (
                <div className={classes.cardContainer}>
                  <Card
                  key={subscription.id}
                  onClick={() => handleOpen(subscription)}
                  className={classes.card}
                >
                  <p style={{ margin: 0}}>구독 날짜 : {subscription.startDate.substring(0, 10)}</p>
                </Card>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <h4 className={classes.contentText}>알 수 없는 사용자 입니다.</h4>;
    }
  };

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>구독 정보</h3>
      {renderContentByRole()}

      <Dialog open={open} onClose={handleClose}>
        <div className={classes.modalTitle}><DialogTitle>구독 상세 정보</DialogTitle></div>
        <DialogContent>
          {currentSubscription && (
            <>
              <p>구독 날짜 : {currentSubscription.startDate.substring(0, 10)}</p>
              <p>구독 종료 날짜 : {currentSubscription.endDate.substring(0, 10)}</p>
              <p>결제 방법 : {currentSubscription.paidTypeEnum}</p>
            </>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'flex-end' }}>
          <button className={classes.modalCloseButton} onClick={handleClose}>
            X
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
