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
                <h2 className={classes.title}>규모에 관계 없이 누구나</h2>
                <span className={classes.content}>규모에 관계 없이 창고 개수에 맞춰 구매할 수 있습니다.</span>
            </div>
        </div>
    )
}