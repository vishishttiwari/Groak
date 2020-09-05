/**
 * Notification Comments used through out the project. This is different from normal comments because
 * these normally appear due to some trigger.
 */
export const No6CharactersPassword = 'Password must be atleast 6 characters long';
export const NoDigitPassword = 'Password must contain atleat 1 digit (0-9)';
export const NoLetterPassword = 'Password must contain atleat 1 letter (a-z, A-Z)';
export const InvalidPassword = 'Invalid password. Please enter a valid password';
export const NoPassword = 'Password not entered. Please enter a valid password';
export const PasswordVerificationEmailSent = 'A password reset email has been sent to your email address';

export const InvalidEmail = 'Invalid email. Please enter a valid email';
export const NoEmail = 'Email not entered. Please enter a valid email';
export const NotSameEmail = 'Email address provided are not the same';
export const NotVerifiedEmail = 'Please verify your email address to sign in';
export const VerificationEmailSent = 'Email sent. Please verify your email address before logging in again';

export const NotFoundRestaurant = 'Restaurant not found';
export const InvalidRestaurantName = 'Invalid Restaurant name. Please enter a valid restaurant name';
export const NoRestaurantName = 'Restaurant name not entered. Please enter a valid restaurant name';
export const InvalidRestaurantAddress = 'Invalid Restaurant address. Please enter a valid restaurant address from the list';
export const ErrorUpdatingRestaurant = 'Error updating restaurant';

export const ErrorChangingAvailability = 'Error changing availability';
export const ErrorFetchingDishes = 'Error fetching dishes';
export const ErrorFetchingDish = 'Error fetching dish';
export const ErrorAddingDish = 'Error adding dish';
export const ErrorUpdatingDish = 'Error updating dish';
export const ErrorDeletingDish = 'Error deleting dish';
export const DishNotFound = 'Dish not found';
export const DishAdded = 'Dish added';
export const DishUpdated = 'Dish updated';
export const DishDeleted = 'Dish deleted';
export const DishOrderChanged = 'Dish order changed';
export const ErrorChangingDishOrder = 'Error changing Dish order';

export const NoDishTitle = 'Dish name not entered. Please enter a valid name';
export const InvalidDishPrice = 'Please enter a valid price';
export const InvalidDishNutritionalInfo = 'Nutritional info entered is not valid. Please enter valid nutritional info';
export const InvalidDishIngredients = 'Please make sure all ingredients are valid';
export const InvalidDishIngredientsIndividual = 'Please enter a valid ingredient name';
export const InvalidDishExtras = 'One of the extras fields are not valid';
export const InvalidDishExtrasTitle = 'Please enter a valid title';
export const InvalidDishExtrasPrice = 'Please enter a valid price';
export const EmptyDishExtrasMinOptions = 'Empty field will be considered as there is no lower limit on the options that can be chosen';
export const EmptyDishExtrasMaxOptions = 'Empty field will be considered as there is no upper limit on the options that can be chosen';
export const DeleteDishPopUpTitle = 'Delete Dish?';
export const DeleteDishPopUp = 'Are you sure you would like to delete this dish?';

export const ErrorFetchingCategories = 'Error fetching menu categories';
export const ErrorFetchingCategory = 'Error fetching menu category';
export const ErrorChangingOrderOfCategory = 'Error changing order of menu category';
export const ErrorAddingCategory = 'Error adding menu category';
export const ErrorUpdatingCategory = 'Error updating menu category';
export const ErrorDeletingCategory = 'Error deleting menu category';
export const CategoryNotFound = 'Category not found';
export const NoCategoryTitle = 'Category title not entered. Please enter a valid title';
export const DeleteCategoryPopUpTitle = 'Delete Category?';
export const DeleteCategoryPopUp = 'Are you sure you would like to delete this category?';
export const CategoryAdded = 'Category added';
export const CategoryUpdated = 'Category updated';
export const CategoryDeleted = 'Category deleted';
export const CategoryOrderChanged = 'Category order changed';
export const ErrorChangingCategoryOrder = 'Error changing Category order';

export const InvalidTableName = 'Invalid Table name. Please enter a valid table name';
export const ErrorAddingTable = 'Error adding table';
export const ErrorFetchingTables = 'Error fetching tables';
export const ErrorFetchingTable = 'Error fetching table';
export const ErrorUpdatingTable = 'Error updating table';
export const ErrorDeletingTable = 'Error deleting table';
export const TableNotFound = 'Table not found';
export const ErrorUnsubscribingTables = 'Error unsubscribing tables';

export const InvalidQRCodeTitle = 'Invalid QR code title. Please enter a valid QR code title';
export const ErrorAddingQRCode = 'Error adding QR code';
export const ErrorFetchingQRCodes = 'Error fetching QR codes';
export const ErrorFetchingQRCode = 'Error fetching QR code';
export const ErrorUpdatingQRCode = 'Error updating QR code';
export const ErrorDeletingQRCode = 'Error deleting QR code';
export const QRCodeNotFound = 'QR code not found';
export const MaximumQRCodeLimitReached = 'Maximum limit on QR codes reached';
export const DeleteQRCodePopUpTitle = 'Delete QR Code?';
export const DeleteQRCodePopUp = 'Are you sure you would like to delete this qr code?';
export const QRCodeAdded = 'QR code added';
export const QRCodeUpdated = 'QR code updated';
export const QRCodeDeleted = 'QR code deleted';
export const QRCodeOrderChanged = 'QR code order changed';
export const ErrorChangingQRCodeOrder = 'Error changing QR code order';

export const ErrorFetchingOrders = 'Error fetching orders';
export const ErrorFetchingOrder = 'Error fetching order';
export const ErrorUpdatingOrder = 'Error updating order';
export const ErrorUnsubscribingOrders = 'Error unsubscribing orders';
export const ErrorUnsubscribingOrder = 'Error unsubscribing order';

export const ErrorFetchingRequest = 'Error fetching requests';
export const ErrorUpdatingRequest = 'Error sending your response. Please try again.';
export const ErrorUnsubscribingRequest = 'Error unsubscribing requests';

export const QRMenuPageUpdated = 'Changes Saved';

export const SettingsUpdated = 'Changes Saved';

export const ErrorContactInfoFirstName = 'Please enter your first name';
export const ErrorContactInfoLastName = 'Please enter your last name';
export const ErrorContactInfoEmailName = 'Please enter your email';
export const ErrorContactInfoPhoneName = 'Please enter your phone';
export const ErrorContactInfoMessageName = 'Please enter a message for us describing your requirements';
export const MessageSent = 'Thank you. Someone from our team will get in touch with you soon';
export const ErrorMessageSent = 'There was an error sending message. Please use contact@groakapp.com to send us a message';

export const OrderAdded = (table) => {
    return `New order added at ${table}`;
};
export const OrderUpdated = (table) => {
    return `New order updated at ${table}`;
};
export const SpecialRequest = (table) => {
    return `Special request at ${table}`;
};
export const OrderReadyForPayment = (table) => {
    return `${table} ready for payment`;
};
export const OrderLate = (table) => {
    return `Order late at ${table}`;
};
export const OrderDueIn5 = (table) => {
    return `Order due in 5 minutes at ${table}`;
};

export const OptionsExceedingMax = (title) => {
    return `Maximum options selected for ${title}`;
};
export const OptionsExceedingMin = (title, min) => {
    if (min === 1) {
        return `Select atleast ${min} options for ${title}`;
    }
    return `Select atleast ${min} option for ${title}`;
};
