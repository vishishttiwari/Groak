import React, { useReducer } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Layout from '../components/layout/Layout';
import HomePage from '../components/homepage/HomePage';
import PrivacyPolicy from '../components/homepage/PrivacyPolicy';
import ContactUs from '../components/contactus/ContactUs';
import SignIn from '../components/content/authentication/signIn/SignIn';
import SignUp from '../components/content/authentication/signUp/SignUp';
import Dishes from '../components/content/menu/dishes/Dishes';
import DishDetails from '../components/content/menu/dishDetails/DishDetails';
import Categories from '../components/content/menu/categories/Categories';
import CategoryDetails from '../components/content/menu/categoryDetails/CategoryDetails';
import OrdersTables from '../components/content/orders/ordersTables/OrdersTables';
import OrdersDetails from '../components/content/orders/orderDetails/OrderDetails';
import Tables from '../components/content/tables/Tables';
import Settings from '../components/content/settings/Settings';
import NewEmailAddress from '../components/content/authentication/new/NewEmailAddress';
import NewPassword from '../components/content/authentication/new/NewPassword';
import QRWindow from '../components/content/qr/QRWindow';
import CustomerMenu from '../components/customerMenu/CustomerMenu';

import { defaultState, reducer, Provider } from '../globalState/globalState';
import BottomSection from '../components/homepage/BottomSection';

// I tried CSSVariables.primaryColor here but it threw error during deployment to firestore
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#800000',
        },
        secondary: {
            main: '#F0F0F0',
        },
    },
});

function App() {
    const [globalState, setGlobalState] = useReducer(reducer, defaultState);

    return (
        <>
            <BrowserRouter>
                <SnackbarProvider maxSnack={10}>
                    <ThemeProvider theme={theme}>
                        <Provider value={{ globalState, setGlobalState }}>
                            <Layout allowedURLSegments={['privacypolicy', 'customermenu', 'signin', 'signup', 'contactus', 'requestademo']}>
                                <Switch>
                                    <Route path="/privacypolicy" exact render={() => { return <PrivacyPolicy />; }} />
                                    <Route path="/contactus" exact render={() => { return <ContactUs />; }} />
                                    <Route path="/requestademo" exact render={() => { return <ContactUs title="Request A Demo" />; }} />
                                    <Route path="/newemail" exact render={() => { return <NewEmailAddress />; }} />
                                    <Route path="/newpassword" exact render={() => { return <NewPassword />; }} />
                                    <Route path="/signin" exact render={() => { return <SignIn />; }} />
                                    <Route path="/signup" exact render={() => { return <SignUp />; }} />
                                    <Route path="/tables" exact render={() => { return <Tables />; }} />
                                    <Route path="/orders/:id" exact render={() => { return <OrdersDetails />; }} />
                                    <Route path="/orders/" exact render={() => { return <OrdersTables />; }} />
                                    <Route path="/dishes/:id" exact render={() => { return <DishDetails />; }} />
                                    <Route path="/dishes" exact render={() => { return <Dishes />; }} />
                                    <Route path="/categories/:id" exact render={() => { return <CategoryDetails />; }} />
                                    <Route path="/categories" exact render={() => { return <Categories />; }} />
                                    <Route path="/settings" exact render={() => { return <Settings />; }} />
                                    <Route path="/qrcode/:id" exact render={() => { return <QRWindow />; }} />
                                    <Route path="/customermenu/:id1/:id2" exact render={() => { return <CustomerMenu />; }} />
                                    <Route path="/" exact render={() => { return <HomePage />; }} />
                                    <Redirect from="/qrcode" to="/tables" exact />
                                    <Redirect from="/menu" to="/dishes" exact />
                                    <Route render={() => { return <Redirect to={{ pathname: '/' }} />; }} />
                                </Switch>
                                <BottomSection />
                            </Layout>
                        </Provider>
                    </ThemeProvider>
                </SnackbarProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
