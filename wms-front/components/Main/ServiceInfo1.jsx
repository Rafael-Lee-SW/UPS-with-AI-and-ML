import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/serviceInfo1Style.js"

const useStyles = makeStyles(styles)

export default function ServiceInfo() {
    const classes = useStyles();

    return (
        <div id="service-info" className={classes.container}>
            <div className={classes.section1}>
                <h2 className={classes.title}>혼자서도 손 쉬운 매장 관리</h2>
                <p className={classes.subTitle}>재고부터 방범까지 한 번에 관리하는</p>
                <p className={classes.subTitle}>Auto-Store만의 솔루션을 제안합니다.</p>
            </div>
            <div className={classes.section2}>
                <img className={classes.subImg} src="/img/sub1.jpg" alt="sub1"/>
            </div>
        </div>
    )
};