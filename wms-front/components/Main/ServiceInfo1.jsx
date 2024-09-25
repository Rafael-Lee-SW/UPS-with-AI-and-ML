import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/serviceInfo1Style.js"

const useStyles = makeStyles(styles)

export default function ServiceInfo() {
    const classes = useStyles();

    return (
        <div id="service-info" className={classes.container}>
            <div className={classes.section1}>
                <h2 className={classes.title}>재고관리의 시작, FitBox에서</h2>
                <p className={classes.subTitle}>FitBox는 보다 쉬운 재고관리를 위해</p>
                <p className={classes.subTitle}>FitBox만의 솔루션을 제안합니다.</p>
            </div>
            <div className={classes.section2}>
                <img className={classes.subImg} src="/img/sub1.jpg" alt="sub1"/>
            </div>
        </div>
    )
};