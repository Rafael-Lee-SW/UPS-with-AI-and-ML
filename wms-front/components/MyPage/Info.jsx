import { makeStyles } from "@material-ui/core";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/infoStyle.js";

const useStyles = makeStyles(styles)

// 회원정보 랜더링
export default function Info({ name, email, createdDate }) {
    
    const classes = useStyles();
    const initialUserInfo = { name, email, createdDate } 

    const formattedDate = initialUserInfo.createdDate ? initialUserInfo.createdDate.substring(0, 10) : '';

    return (
      <div>
        <h3>{name}님, 반갑습니다.</h3>
          <div className={classes.container}>
            <table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>이름</strong></td>
                  <td className={classes.valueCell}>{initialUserInfo.name}</td>
                </tr>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>이메일</strong></td>
                  <td className={classes.valueCell}>{initialUserInfo.email}</td>
                </tr>
                <tr>
                  <td className={classes.labelCell}>
                    <strong className={classes.text}>가입 일자</strong>
                  </td>
                  <td className={classes.valueCell}>{formattedDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    )
}
