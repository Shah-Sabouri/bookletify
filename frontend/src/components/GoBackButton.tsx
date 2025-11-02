import { useNavigate } from "react-router-dom";
import styles from "./GoBackButton.module.css";

export default function GoBackButton() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (window.history.state && window.history.state.idx > 0) navigate(-1);
        else navigate("/");
    };

    return (
        <button onClick={handleGoBack} className={styles.goBackBtn}>
            ← Go Back
        </button>
    );
}
