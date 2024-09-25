import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import styles from "/styles/jss/nextjs-material-kit/components/cardWarehouse.js";

const useStyles = makeStyles(styles);

const Card = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { className, children, plain, carousel, ...rest } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardCarousel]: carousel,
    [className]: className !== undefined,
  });

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const lightRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const light = lightRef.current;

    const getCardCenter = () => {
      const rect = container.getBoundingClientRect();
      return {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
    };

    const mouseMove = (e) => {
      const { centerX, centerY } = getCardCenter();
      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;
      const rotationX = offsetY / 20; // 세로 기준 회전
      const rotationY = -offsetX / 20; // 가로 기준 회전

      // 카드 회전 및 그림자 효과 적용
      card.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      card.style.boxShadow = `${-offsetX / 10}px ${-offsetY / 10}px 30px rgba(0,0,0,0.3)`;

      // 빛 효과 추가
      light.style.backgroundImage = `radial-gradient(circle at ${offsetX + container.clientWidth / 2}px ${offsetY + container.clientHeight / 2}px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))`;
    };

    const handleResize = () => {
      getCardCenter(); // 리사이즈 시 카드의 중심점을 재계산
    };

    container.addEventListener("mousemove", mouseMove);

    container.addEventListener("mouseleave", () => {
      card.style.transform = ""; // 원래 상태로 되돌리기
      card.style.boxShadow = ""; // 그림자 초기화
      light.style.backgroundImage = ""; // 빛 효과 제거
    });

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={classes.frame} ref={containerRef}>
      <div className={cardClasses} ref={cardRef} {...rest}>
        <div className={classes.light} ref={lightRef}></div>
        {children}
      </div>
    </div>
  );
});

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  carousel: PropTypes.bool,
  children: PropTypes.node,
};

export default Card;
