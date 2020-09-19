import { getMinutesFromMidnight, getTimeInAMPMFromTimeStamp } from './TimesDates';

/**
 * Random comments used through out the project.
 */
export const AddressComment = 'Please select an address from the list. This is needed to ensure no one beyond 100 feet from the restaurant is able to place an order.';
export const ValidEmailComment = 'Please enter a valid email. Invalid email will to lead to loss of all data.';

export const TroubleSigningIn = 'Trouble signing in?';
export const NoAccount = 'Don\'t have an account?';

export const DishImageDescription = 'Images will resized to 320x240. Please upload pictures in landscape.';

export const NoDishes = 'You don\'t have any dishes in your menu. Use the add dish button to add dishes.';
export const NoCategories = 'You don\'t have any categories in your menu. Use the add category button to add categories.';
export const NoQRCodes = 'You don\'t have any QR codes in your menu. Use the add QR code button to add QR codes.';

export const DishShortInfo = 'A short info of the dish that will be shown to customers along with the dish';
export const DishDescription = 'Detailed information about the dish that will be shown to the customer if they would like to know more about the dish.';

export const DishVegetarian = 'Is this dish Vegetarian?';
export const DishVegan = 'Is this dish Vegan?';
export const DishGlutenFree = 'Is this dish Gluten-free?';
export const DishKosher = 'Is this dish Kosher?';
export const DishSeaFood = 'Is this Sea Food?';

export const QRCodesOrder = 'QR Codes will be shown in the same order as below. To change order, toggle the change order switch and then drag and drop each qr code card.';
export const QRCodeCategoriesOrder = 'Categories in this QR Code will be shown in the same order as below. To change order, drag and drop each category card and then save the changes.';
export const CategoryOrder = 'Categories will be shown in the same order as below. To change order, toggle the change order switch and then drag and drop each category card.';
export const CategoryDishesOrder = 'Dishes in this category will be shown in the same order as below. To change order, drag and drop each dish card and then save the changes.';
export const DishOrder = 'Dishes will be shown in the same order as below. To change order, toggle the change order switch and then drag and drop each dish card.';

export const QRCodesNotFound = 'QR Codes Not Found';
export const CategoriesNotFound = (startTimeString, endTimeString, startTime, endTime) => {
    const mins = getMinutesFromMidnight();
    if (mins >= startTime && mins <= endTime) {
        return 'Menu not available at the moment';
    }
    return `Menu not available at the moment. This menu will be available from ${startTimeString} to ${endTimeString}`;
};
export const DishesNotFound = 'Dishes Not Found';
export const RestaurantNotFound = 'Restaurant Not Found';
export const MenuNotFound = 'Menu not available at the moment';

export const ShowTableMessage = 'You can press the barcode button to get the barcode for this table.';
export const AddTableMessage = 'Enter table name. You can press the barcode button to get the barcode for this table.';

export const IncludeLogoMessage = 'To include your logo, please upload your logo in settings.';
export const RerenderPDF = 'Rerender pdf whenever you change format to see any changes.';
export const IncludeRestaurantImage = 'To include your restaurant image, please upload your restaurant image in settings.';
export const RenderPDF = "To view the pdf, click 'Render PDF' button at the bottom";

export const TablesDesc = 'Tables that are currently in use cannot be updated. Wait for the tables to be available to edit them. Click available tables to edit them and non-available tables to see orders at that table.';
export const TableAvailable = 'Table is available for customers';
export const TableRequested = 'Customers have placed their order';
export const TableUpdated = 'Customers have updates their order';
export const TableApproved = 'Customers are waiting for the order';
export const TableServed = 'Order has been served';
export const TablePayment = 'Customers are ready for the payment';

export const FrontDoorQRMenuPage = 'Front door menu page will show the whole menu regardless of availability and timings. You can use this menu on the front door to help your customers view the full menu';
export const ViewOnlyQRMenuPage = 'This menu page can be used for viewing the menu. No orders can be places through this menu';

export const ImageSubjectToChange = 'Disclaimer: The images depicted are not representative of the services offered. Food images are subject to change';

export const CartEmpty = 'You can add dishes from the menu tab';
export const OrderEmpty = 'You can place your orders from the cart tab';

export const OrderOrdered = 'Your order has been requested. Pending for approval.';
export const OrderServed = 'Your order has been served. Enjoy!';
export const OrderPayment = 'You have requested for payment. Someone will be at your table soon.';
export const VenmoPayment = 'Please pay the amount in Venmo. We will send a waiter your way, please show them the receipt from Venmo once you are done.';
export const OrderAvailable = 'You can start ordering. Your orders will appear below.';
export const OrderApproved = (serveTime) => {
    return `Your order will be served at ${getTimeInAMPMFromTimeStamp(serveTime)}`;
};

export const LeaveNoteForKitchen = 'Leave a note for the kitchen';
export const OtherInstructions = 'Any other instructions? (Ex: Please start with starters)';

export const EmptyCartMessage = 'Would you like to empty the cart?';
export const WaiterMessage = 'We will send a waiter to your table for payment. Would you like to continue?';
export const VenmoMessage = 'We will redirect you to the Venmo app if you have one. Please pay the amount above. We will also send a waiter to your table. Please show them the receipt from Venmo when you are done.';
export const iPhoneReceiptSave = 'To save the receipt on iphone, press save receipt below and then long press the screen to save receipt in camera roll';
export const VenmoUsageMessage = 'Only use Venmo if you have the app installed';

export const CovidMessageSubheader = 'Measures taken by restaurant to reduce the spread';
export const CovidGuidelineSubheader = 'Covid directives in your area';
