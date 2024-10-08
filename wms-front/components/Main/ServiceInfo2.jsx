import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/serviceInfo2Style.js"

const useStyles = makeStyles(styles)

export default function serviceInfo2() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.section1}>
                <img className={classes.img} src="/img/sub2.jpg" alt="sub2"/>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title}>즉각적인 재고반영</h2>
                <span className={classes.content}>결제내역이 재고에 즉각적으로 반영됩니다.</span>
            </div>
        </div>
    )
}