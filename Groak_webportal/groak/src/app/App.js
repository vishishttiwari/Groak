/* eslint-disable import/first */
import React, { useReducer, Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const HomePage = lazy(() => { return import('../components/homepage/HomePage'); });
const PrivacyPolicy = lazy(() => { return import('../components/homepage/PrivacyPolicy'); });
const ContactUs = lazy(() => { return import('../components/homepage/contactus/ContactUs'); });
const SignIn = lazy(() => { return import('../components/portal/authentication/signIn/SignIn'); });
const SignUp = lazy(() => { return import('../components/portal/authentication/signUp/SignUp'); });
const Dishes = lazy(() => { return import('../components/portal/menu/dishes/Dishes'); });
const DishDetails = lazy(() => { return import('../components/portal/menu/dishDetails/DishDetails'); });
const Categories = lazy(() => { return import('../components/portal/menu/categories/Categories'); });
const CategoryDetails = lazy(() => { return import('../components/portal/menu/categoryDetails/CategoryDetails'); });
const OrdersTables = lazy(() => { return import('../components/portal/orders/ordersTables/OrdersTables'); });
const OrdersDetails = lazy(() => { return import('../components/portal/orders/orderDetails/OrderDetails'); });
const Tables = lazy(() => { return import('../components/portal/tables/Tables'); });
const Settings = lazy(() => { return import('../components/portal/settings/Settings'); });
const NewEmailAddress = lazy(() => { return import('../components/portal/authentication/new/NewEmailAddress'); });
const NewPassword = lazy(() => { return import('../components/portal/authentication/new/NewPassword'); });
const QRWindow = lazy(() => { return import('../components/portal/qrMenuPage/QRWindow'); });
const CustomerIntro = lazy(() => { return import('../components/customer/customerIntro/CustomerIntro'); });
const CustomerSearch = lazy(() => { return import('../components/customer/search/Search'); });
const CustomerMenuDish = lazy(() => { return import('../components/customer/dish/MenuDish'); });
const CustomerAddToCart = lazy(() => { return import('../components/customer/addToCart/AddToCart'); });
const CustomerCartDetails = lazy(() => { return import('../components/customer/cartDetails/CartDetails'); });
const CustomerRequests = lazy(() => { return import('../components/customer/requests/Requests'); });
const CustomerReceipt = lazy(() => { return import('../components/customer/receipt/Receipt'); });
const QRCodes = lazy(() => { return import('../components/portal/qrCodes/QRCodes'); });
const QRCodesDetails = lazy(() => { return import('../components/portal/qrCodes/qrCodeDetails/QRCodeDetails'); });

import { defaultState, reducer, Provider } from '../globalState/globalState';
import Layout from '../components/layout/Layout';
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
                            <Layout allowedURLSegments={['privacypolicy', 'customer', 'signin', 'signup', 'contactus', 'requestademo']}>
                                <Suspense fallback={<Spinner show />}>
                                    <Switch>
                                        <Route path="/privacypolicy" exact render={() => { return <PrivacyPolicy />; }} />
                                        <Route path="/contactus" exact render={() => { return <ContactUs />; }} />
                                        <Route path="/requestademo" exact render={() => { return <ContactUs title="Request A Demo" />; }} />
                                        <Route path="/newemail" exact render={() => { return <NewEmailAddress />; }} />
                                        <Route path="/newpassword" exact render={() => { return <NewPassword />; }} />
                                        <Route path="/signin" exact render={() => { return <SignIn />; }} />
                                        <Route path="/signup" exact render={() => { return <SignUp />; }} />
                                        <Route path="/tables" exact render={() => { return <Tables />; }} />
                                        <Route path="/orders/:orderid" exact render={() => { return <OrdersDetails />; }} />
                                        <Route path="/orders/" exact render={() => { return <OrdersTables />; }} />
                                        <Route path="/dishes/:dishid" exact render={() => { return <DishDetails />; }} />
                                        <Route path="/dishes" exact render={() => { return <Dishes />; }} />
                                        <Route path="/categories/:categoryid" exact render={() => { return <CategoryDetails />; }} />
                                        <Route path="/categories" exact render={() => { return <Categories />; }} />
                                        <Route path="/qrcodes" exact render={() => { return <QRCodes />; }} />
                                        <Route path="/qrcodes/:qrcodeid" exact render={() => { return <QRCodesDetails />; }} />
                                        <Route path="/settings" exact render={() => { return <Settings />; }} />
                                        <Route path="/qrmenupage/:tableid" exact render={() => { return <QRWindow />; }} />
                                        <Route path="/customer/menu/:restaurantid/:tableid/:qrcodeid" exact render={() => { return <CustomerIntro />; }} />
                                        <Route path="/customer/search/:restaurantid/:tableid/:qrcodeid" exact render={() => { return <CustomerSearch />; }} />
                                        <Route path="/customer/dish/:restaurantid/:dishid" exact render={() => { return <CustomerMenuDish />; }} />
                                        <Route path="/customer/addtocart/:restaurantid/:dishid" exact render={() => { return <CustomerAddToCart />; }} />
                                        <Route path="/customer/cartdetails/:restaurantid" exact render={() => { return <CustomerCartDetails />; }} />
                                        <Route path="/customer/requests/:restaurantid/:tableid" exact render={() => { return <CustomerRequests />; }} />
                                        <Route path="/customer/receipt/:restaurantid/:tableid" exact render={() => { return <CustomerReceipt />; }} />
                                        <Redirect from="/qrmenupage" to="/tables" exact />
                                        <Redirect from="/menu/:restaurantid/:tableid/:qrcodeid" to="/customer/menu/:restaurantid/:tableid/:qrcodeid" exact />
                                        <Redirect from="/customermenu/:restaurantid/:tableid/:qrcodeid" to="/customer/menu/:restaurantid/:tableid/:qrcodeid" />
                                        <Route path="/" exact render={() => { return <HomePage />; }} />
                                        <Route render={() => { return <Redirect to={{ pathname: '/' }} />; }} />
                                    </Switch>
                                    <BottomSection />
                                </Suspense>
                            </Layout>
                        </Provider>
                    </ThemeProvider>
                </SnackbarProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
