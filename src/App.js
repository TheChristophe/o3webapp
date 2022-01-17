import * as React from 'react';
import NavBar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ErrorMessageModal from './components/ErrorMessageModal/ErrorMessageModal';
import CookieConsentModal from './components/CookieConsentModal/CookieConsentModal';
import LandingPage from './views/landingPage/LandingPage';
import PropTypes from "prop-types";
import PlotTypeSelector from "./views/landingPage/Sidebar/InputComponents/PlotTypeSelector/PlotTypeSelector";

/**
 * Main container of the Webapp
 * Contains all GUI elements
 * @returns {JSX} a jsx containing all main components
 */
function App() {

    const [isErrorModalVisible, setErrorModalVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);  // if errorMessage null no error
    const [isCookieConsentModalVisible, setCookieConsentModalVisibility] = React.useState(true);

    /**
     * function to report an error from other components
     * automatically opens errorModal
     * @param {string} msg the message of the reported error
     */
    const reportError = (msg) => {
        setErrorModalVisible(true);
        setErrorMessage(msg);
    }

    /**
     * closes the error modal
     */
    const closeErrorModal = () => {
        setErrorModalVisible(false);
    }

    /**
     * closes the cookie consent modal
     */
    const onCloseCookieConsentModal = () => {
        setCookieConsentModalVisibility(false);
    }


    return (
    <>
        <NavBar reportError={reportError} />

        <LandingPage reportError={reportError} />

        <Footer reportError={reportError} />
        <ErrorMessageModal isOpen={isErrorModalVisible} message={errorMessage} onClose={closeErrorModal} />
        <CookieConsentModal isOpen={isCookieConsentModalVisible} onClose={onCloseCookieConsentModal} error={reportError} />
    </>
    );
}

export default App;