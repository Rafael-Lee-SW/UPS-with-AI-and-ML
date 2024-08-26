import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/serviceInfo3Style.js"

const useStyles = makeStyles(styles)

export default function serviceInfo3 () {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.section1}>
                <h2 className={classes.title}>손쉽고 편리한 재고관리</h2>
                <p className={classes.content}>FitBox는 창고를 옮겨 놓은 듯한 직관적인 UI를 제공합니다.</p>
                <p className={classes.content}>사용자가 원하는 곳에 직접 적재함을 위치시킬 수 있습니다.</p>
            </div>
            <div className={classes.section2}>
                <img className={classes.mainImg} src="/img/mainInfo1.png" alt="mainInfo"/>
            </div>
        </div>
    )
}