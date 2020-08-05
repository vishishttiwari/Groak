/* eslint-disable import/first */
import React, { useReducer, Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const Layout = lazy(() => { return import('../components/layout/Layout'); });
const HomePage = lazy(() => { return import('../components/homepage/HomePage'); });
const PrivacyPolicy = lazy(() => { return import('../components/homepage/PrivacyPolicy'); });
const ContactUs = lazy(() => { return import('../components/contactus/ContactUs'); });
const SignIn = lazy(() => { return import('../components/content/authentication/signIn/SignIn'); });
const SignUp = lazy(() => { return import('../components/content/authentication/signUp/SignUp'); });
const Dishes = lazy(() => { return import('../components/content/menu/dishes/Dishes'); });
const DishDetails = lazy(() => { return import('../components/content/menu/dishDetails/DishDetails'); });
const Categories = lazy(() => { return import('../components/content/menu/categories/Categories'); });
const CategoryDetails = lazy(() => { return import('../components/content/menu/categoryDetails/CategoryDetails'); });
const OrdersTables = lazy(() => { return import('../components/content/orders/ordersTables/OrdersTables'); });
const OrdersDetails = lazy(() => { return import('../components/content/orders/orderDetails/OrderDetails'); });
const Tables = lazy(() => { return import('../components/content/tables/Tables'); });
const Settings = lazy(() => { return import('../components/content/settings/Settings'); });
const NewEmailAddress = lazy(() => { return import('../components/content/authentication/new/NewEmailAddress'); });
const NewPassword = lazy(() => { return import('../components/content/authentication/new/NewPassword'); });
const QRWindow = lazy(() => { return import('../components/content/qrMenuPage/QRWindow'); });
const CustomerMenu = lazy(() => { return import('../components/customerMenu/CustomerMenu'); });
const QRCodes = lazy(() => { return import('../components/content/qrCodes/QRCodes'); });
const QRCodesDetails = lazy(() => { return import('../components/content/qrCodes/qrCodeDetails/QRCodeDetails'); });

import { defaultState, reducer, Provider } from '../globalState/globalState';
import BottomSection from '../components/homepage/BottomSection';
import Spinner from '../components/ui/spinner/Spinner';

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
                            <Suspense fallback={<Spinner show />}>
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
                                        <Route path="/qrcodes" exact render={() => { return <QRCodes />; }} />
                                        <Route path="/qrcodes/:id" exact render={() => { return <QRCodesDetails />; }} />
                                        <Route path="/settings" exact render={() => { return <Settings />; }} />
                                        <Route path="/qrmenupage/:id" exact render={() => { return <QRWindow />; }} />
                                        <Route path="/customermenu/:id1/:id2/:id3" exact render={() => { return <CustomerMenu />; }} />
                                        <Route path="/" exact render={() => { return <HomePage />; }} />
                                        <Redirect from="/qrmenupage" to="/tables" exact />
                                        <Redirect from="/menu" to="/dishes" exact />
                                        <Route render={() => { return <Redirect to={{ pathname: '/' }} />; }} />
                                    </Switch>
                                    <BottomSection />
                                </Layout>
                            </Suspense>
                        </Provider>
                    </ThemeProvider>
                </SnackbarProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
